from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, create_model
import pandas as pd
import xgboost as xgb
import joblib
import json
import os
import shap

app = FastAPI(title="ServeNow SLA Prediction API")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load metadata
model_dir = os.path.join(os.path.dirname(__file__), "..", "src", "model")
metadata_path = os.path.join(model_dir, "servenow_model_metadata.json")
with open(metadata_path, 'r') as f:
    metadata = json.load(f)

threshold = metadata.get("selected_threshold", 0.4)

# Load preprocessor and model
preprocessor = joblib.load(os.path.join(model_dir, "servenow_preprocessor.joblib"))

bst = xgb.Booster()
bst.load_model(os.path.join(model_dir, "servenow_sla_breach_xgboost.json"))

# Initialize SHAP TreeExplainer
explainer = shap.TreeExplainer(bst)

with open(os.path.join(model_dir, "servenow_feature_list.json"), 'r') as f:
    feature_metadata = json.load(f)

# Create a dynamic Pydantic model based on required features
feature_fields = {
    **{f: (str, ...) for f in feature_metadata["raw_categorical_features"]},
    **{f: (float, ...) for f in feature_metadata["raw_numeric_features"]}
}

TaskInput = create_model("TaskInput", **feature_fields)

def get_recommended_action(root_cause_feature: str) -> str:
    """Rules engine to map the top root cause to a recommended manager action."""
    action_map = {
        "current_workload_ratio": "Rebalance Workload",
        "workload_pressure_score": "Rebalance Workload",
        "current_open_tasks": "Rebalance Workload",
        "dependency_delay_hours": "Escalate Dependency",
        "dependency_count": "Escalate Dependency",
        "dependency_pressure_score": "Escalate Dependency",
        "employee_experience_years": "Manager Review / Coaching",
        "employee_historical_sla_rate": "Manager Review / Coaching",
        "reassignment_count": "Manager Review (Task Bouncing)",
        "task_queue_age_hours": "Expedite Task Priority",
        "queue_pressure": "Expedite Task Priority",
        "estimated_vs_sla_ratio": "Renegotiate SLA / Adjust Scope",
    }
    return action_map.get(root_cause_feature, "Manager Review")

@app.post("/predict")
def predict_sla_breach(task: TaskInput):
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([task.dict()])
        
        # Ensure correct column order
        cols = feature_metadata["raw_categorical_features"] + feature_metadata["raw_numeric_features"]
        df = df[cols]
        
        # Preprocess
        X_processed = preprocessor.transform(df)
        
        # Ensure column names for DMatrix
        expected_cols = feature_metadata.get("encoded_feature_order")
        if expected_cols:
            if hasattr(X_processed, "toarray"):
                X_processed = X_processed.toarray()
            X_df = pd.DataFrame(X_processed, columns=expected_cols)
        else:
            X_df = pd.DataFrame(X_processed)
            
        dmatrix = xgb.DMatrix(X_df)
        
        # Predict Probability
        probs = bst.predict(dmatrix)
        prob = float(probs[0])
        
        # Calculate Risk Band
        if prob < 0.30:
            risk_band = "Low"
        elif prob < 0.60:
            risk_band = "Medium"
        else:
            risk_band = "High"
            
        # Calculate SHAP Values for Root Cause
        shap_values = explainer.shap_values(X_df)
        
        # Since this is a single prediction, shap_values is a 1D array
        instance_shap = shap_values[0]
        
        # Pair feature names with their absolute SHAP impact
        feature_impacts = []
        for i, col_name in enumerate(X_df.columns):
            impact = float(instance_shap[i])
            if impact != 0:
                feature_impacts.append({
                    "feature": col_name,
                    "impact": impact,
                    "abs_impact": abs(impact)
                })
        
        # Sort by absolute impact descending and get top 3
        feature_impacts.sort(key=lambda x: x["abs_impact"], reverse=True)
        top_causes = feature_impacts[:3]
        
        # Remove the temporary 'abs_impact' key before returning
        for cause in top_causes:
            del cause["abs_impact"]
            
        # Determine Recommended Action based on the #1 driver
        recommended_action = "None"
        if top_causes:
            primary_driver = top_causes[0]["feature"]
            # Clean up encoded feature names (e.g., task_type_Technical Issue -> task_type)
            if "_" in primary_driver and any(cat in primary_driver for cat in feature_metadata["raw_categorical_features"]):
                base_feature = next((cat for cat in feature_metadata["raw_categorical_features"] if primary_driver.startswith(cat)), primary_driver)
                recommended_action = get_recommended_action(base_feature)
            else:
                recommended_action = get_recommended_action(primary_driver)
        
        return {
            "sla_breach_probability": prob,
            "sla_breach_prediction": bool(prob >= threshold),
            "threshold": threshold,
            "risk_band": risk_band,
            "root_causes": top_causes,
            "recommended_action": recommended_action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
