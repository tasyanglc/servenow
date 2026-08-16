import joblib
import sys
try:
    bundle = joblib.load('src/model/servenow_model_bundle.joblib')
    print("Bundle type:", type(bundle))
    if isinstance(bundle, dict):
        print("Keys:", bundle.keys())
        for k, v in bundle.items():
            print(f"Key {k} type: {type(v)}")
except Exception as e:
    print("Error:", e)
