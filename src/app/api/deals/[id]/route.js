import { getDb } from '../../../../lib/db';

export const dynamic = 'force-dynamic';
const toDeal = (row) => ({ ...row, expectedRevenue: Number(row.expected_revenue), founderInvolvement: row.founder_involvement, progressiveOwnership: row.progressive_ownership, nextAction: row.next_action, nextActionDeadline: row.next_action_deadline, customerId: row.customer_id, projectId: row.project_id, value: Number(row.value), probability: Number(row.probability) });

export async function GET(_request, { params }) {
  try { const { id } = await params; const { rows } = await getDb().query('SELECT * FROM deals WHERE id = $1', [id]); return rows[0] ? Response.json(toDeal(rows[0])) : Response.json({ error: 'Opportunity tidak ditemukan.' }, { status: 404 }); } catch (error) { console.error('Unable to load deal', error); return Response.json({ error: 'Database tidak dapat memuat opportunity.' }, { status: 500 }); }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; const deal = await request.json(); const value = Number(deal.value || 0); const probability = Number(deal.probability || 0);
    const { rows } = await getDb().query(`UPDATE deals SET account=$2, sector=$3, owner=$4, stage=$5, value=$6, probability=$7, expected_revenue=$8, next_action=$9, next_action_deadline=$10, founder_involvement=$11, progressive_ownership=$12, customer_id=$13, project_id=$14, updated_at=NOW() WHERE id=$1 RETURNING *`, [id, deal.account, deal.sector || null, deal.owner, deal.stage, value, probability, value * probability, deal.nextAction || null, deal.nextActionDeadline || null, Boolean(deal.founderInvolvement), deal.progressiveOwnership || 'Lead', deal.customerId || null, deal.projectId || null]);
    return rows[0] ? Response.json(toDeal(rows[0])) : Response.json({ error: 'Opportunity tidak ditemukan.' }, { status: 404 });
  } catch (error) { console.error('Unable to update deal', error); return Response.json({ error: 'Database tidak dapat memperbarui opportunity.' }, { status: 500 }); }
}
