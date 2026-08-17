import model from '../../../model/servenow_sla_breach_xgboost.json';
import featureMetadata from '../../../model/servenow_feature_list.json';
import modelMetadata from '../../../model/servenow_model_metadata.json';
import { getDb } from '../../../lib/db';
import { ensureOperationalSeed, ensureTaskSeed } from '../../../lib/operationalStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const departmentMap = {
  Implementation: 'Implementation',
  Support: 'Support',
  Sales: 'Sales Operations',
  Teknologi: 'Engineering',
  'Technical Issue': 'Engineering',
  'Data Ops': 'Support',
};

const actionMap = {
  current_workload_ratio: 'Rebalance Workload', workload_pressure_score: 'Rebalance Workload', current_open_tasks: 'Rebalance Workload',
  dependency_delay_hours: 'Escalate Dependency', dependency_count: 'Escalate Dependency', dependency_pressure_score: 'Escalate Dependency',
  employee_experience_years: 'Manager Review / Coaching', employee_historical_sla_rate: 'Manager Review / Coaching', reassignment_count: 'Manager Review (Task Bouncing)',
  task_queue_age_hours: 'Expedite Task Priority', queue_pressure: 'Expedite Task Priority', estimated_vs_sla_ratio: 'Renegotiate SLA / Adjust Scope',
};

function buildFeatures(task = {}) {
  const slaHours = Number(task.sla_hours) || 24;
  const remainingHours = Number.isFinite(Number(task.remaining_sla_hours)) ? Number(task.remaining_sla_hours) : slaHours / 2;
  const workloadRatio = Number(task.current_workload_ratio) || 0.8;
  const openTasks = Number(task.current_open_tasks) || 5;
  const dependencyCount = Number(task.dependency_count) || 0;
  const dependencyDelay = Number(task.dependency_delay_hours) || 0;
  const queueAge = Number(task.task_queue_age_hours) || 0;
  const taskType = task.task_type || 'Support';
  const priority = task.task_priority || 'Medium';
  const tier = task.customer_tier || 'Standard';
  const department = departmentMap[task.employee_department || task.department || taskType] || 'Support';
  const raw = {
    task_type: taskType, task_priority: priority, customer_tier: tier, employee_department: department,
    employee_experience_years: Number(task.employee_experience_years) || 3,
    employee_historical_sla_rate: Number(task.employee_historical_sla_rate) || 0.95,
    current_open_tasks: openTasks, current_workload_ratio: workloadRatio,
    task_complexity: Number(task.task_complexity) || 5, estimated_task_hours: Number(task.estimated_task_hours) || 10,
    sla_hours: slaHours, remaining_sla_hours: remainingHours, dependency_count: dependencyCount,
    dependency_delay_hours: dependencyDelay, reassignment_count: Number(task.reassignment_count) || 0,
    similar_task_avg_hours: Number(task.similar_task_avg_hours) || 8.5, employee_avg_completion_hours: Number(task.employee_avg_completion_hours) || 8,
    task_queue_age_hours: queueAge, customer_escalation_history: Number(task.customer_escalation_history) || 0,
    cross_department_required: task.cross_department_required ? 1 : 0, peak_workload_flag: task.peak_workload_flag ? 1 : 0,
    estimated_vs_sla_ratio: (Number(task.estimated_task_hours) || 10) / slaHours,
    workload_pressure_score: Math.max(workloadRatio - 1, 0), dependency_pressure_score: dependencyCount * Math.log1p(dependencyDelay),
    employee_speed_ratio: (Number(task.employee_avg_completion_hours) || 8) / slaHours, sla_buffer_ratio: remainingHours / slaHours,
    queue_pressure: queueAge / slaHours, employee_historical_sla_rate_missing: 0, similar_task_avg_hours_missing: 0,
  };
  const values = {};
  featureMetadata.encoded_feature_order.forEach(feature => {
    if (feature.startsWith('task_type_')) values[feature] = Number(taskType === feature.slice('task_type_'.length));
    else if (feature.startsWith('task_priority_')) values[feature] = Number(priority === feature.slice('task_priority_'.length));
    else if (feature.startsWith('customer_tier_')) values[feature] = Number(tier === feature.slice('customer_tier_'.length));
    else if (feature.startsWith('employee_department_')) values[feature] = Number(department === feature.slice('employee_department_'.length));
    else values[feature] = Number(raw[feature]) || 0;
  });
  return values;
}

async function enrichTask(task = {}) {
  if (!task.id) return task;
  const db = getDb();
  await Promise.all([ensureTaskSeed(db), ensureOperationalSeed(db, 'employees'), ensureOperationalSeed(db, 'customers')]);
  const [storedTask, employeeRows, customerRows, taskRows] = await Promise.all([
    db.query('SELECT data FROM tasks WHERE id=$1', [task.id]),
    db.query("SELECT data FROM operational_records WHERE domain='employees'"),
    db.query("SELECT data FROM operational_records WHERE domain='customers'"),
    db.query('SELECT data, owner_initials, status FROM tasks'),
  ]);
  const saved = storedTask.rows[0]?.data || {};
  const merged = { ...saved, ...task, owner: task.owner || saved.owner };
  const employee = employeeRows.rows.map((row) => row.data).find((item) => item.initials === merged.owner?.initials);
  const customer = customerRows.rows.map((row) => row.data).find((item) => item.name === merged.customer);
  const relatedTasks = taskRows.rows.map((row) => row.data).filter((item) => item.owner?.initials === merged.owner?.initials);
  const customerTasks = taskRows.rows.map((row) => row.data).filter((item) => item.customer === merged.customer);
  const historical = relatedTasks.filter((item) => Number.isFinite(Number(item.sla_hours)) && Number.isFinite(Number(item.remaining_sla_hours)));
  const completedWithinSla = historical.filter((item) => Number(item.remaining_sla_hours) >= 0).length;
  return {
    ...merged,
    employee_department: merged.employee_department || employee?.department || merged.department,
    employee_experience_years: merged.employee_experience_years ?? employee?.experienceYears,
    current_workload_ratio: merged.current_workload_ratio ?? (employee ? Number(employee.allocatedHours || 0) / Math.max(1, Number(employee.capacityHours || 40)) : undefined),
    current_open_tasks: merged.current_open_tasks ?? relatedTasks.filter((item) => !['Resolved', 'Completed', 'Done'].includes(item.status)).length,
    employee_historical_sla_rate: merged.employee_historical_sla_rate ?? (historical.length ? completedWithinSla / historical.length : undefined),
    customer_tier: merged.customer_tier || customer?.tier,
    customer_escalation_history: merged.customer_escalation_history ?? customerTasks.filter((item) => (item.escalation_history || []).length > 0).length,
    similar_task_avg_hours: merged.similar_task_avg_hours ?? (historical.length ? historical.reduce((sum, item) => sum + (Number(item.estimated_task_hours) || 0), 0) / historical.length : undefined),
  };
}

function evaluateTree(tree, features, gains) {
  let node = 0;
  while (tree.left_children[node] !== -1) {
    const featureIndex = tree.split_indices[node];
    const feature = featureMetadata.encoded_feature_order[featureIndex];
    const value = features[feature];
    gains[feature] = (gains[feature] || 0) + Math.abs(tree.loss_changes[node] || 0);
    node = value < tree.split_conditions[node] ? tree.left_children[node] : tree.right_children[node];
  }
  return tree.split_conditions[node];
}

function predict(task) {
  const features = buildFeatures(task);
  const modelData = model.learner.gradient_booster.model;
  const gains = {};
  const margin = modelData.trees.reduce((sum, tree) => sum + evaluateTree(tree, features, gains), 0);
  const probability = 1 / (1 + Math.exp(-margin));
  const rootCauses = Object.entries(gains).sort(([, a], [, b]) => b - a).slice(0, 3).map(([feature, impact]) => ({ feature, impact }));
  const baseFeature = rootCauses[0]?.feature?.replace(/_(?:Account Management|Configuration|Customer Support|Implementation|Integration|Product Request|Technical Issue|Critical|High|Low|Medium|Enterprise|Growth|Standard|Strategic|Customer Success|Engineering|Sales Operations|Support)$/, '') || '';
  return {
    sla_breach_probability: probability,
    sla_breach_prediction: probability >= modelMetadata.selected_threshold,
    threshold: modelMetadata.selected_threshold,
    risk_band: probability < 0.30 ? 'Low' : probability < 0.60 ? 'Medium' : 'High',
    root_causes: rootCauses,
    recommended_action: actionMap[baseFeature] || 'Manager Review',
    explanation_method: 'XGBoost tree-path attribution',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const task = await enrichTask(body.task || body);
    const result = predict(task);
    if (task.id) {
      const actual = typeof task.sla_breached === 'boolean' ? task.sla_breached : Number.isFinite(Number(task.remaining_sla_hours)) ? Number(task.remaining_sla_hours) < 0 : null;
      await getDb().query(`INSERT INTO risk_predictions (task_id, model_version, input_snapshot, result, actual_sla_breach)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (task_id) DO UPDATE SET model_version=EXCLUDED.model_version, input_snapshot=EXCLUDED.input_snapshot, result=EXCLUDED.result, actual_sla_breach=EXCLUDED.actual_sla_breach, updated_at=NOW()`, [task.id, modelMetadata.model_version || 'xgboost-local', JSON.stringify(task), JSON.stringify(result), actual]);
    }
    return Response.json({ ...result, input_source: task.id ? 'PostgreSQL task context' : 'Request payload', model_version: modelMetadata.model_version || 'xgboost-local' });
  } catch (error) {
    console.error('Unable to calculate SLA risk', error);
    return Response.json({ error: 'Prediksi risiko tidak dapat dihitung.' }, { status: 400 });
  }
}
