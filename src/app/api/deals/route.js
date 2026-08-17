import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const toDeal = (row) => ({ ...row, expectedRevenue: Number(row.expected_revenue), founderInvolvement: row.founder_involvement, progressiveOwnership: row.progressive_ownership, nextAction: row.next_action, nextActionDeadline: row.next_action_deadline, customerId: row.customer_id, projectId: row.project_id, value: Number(row.value), probability: Number(row.probability) });

export async function GET() {
  try {
    const { rows } = await getDb().query('SELECT * FROM deals ORDER BY created_at DESC');
    return Response.json(rows.map(toDeal));
  } catch (error) {
    console.error('Unable to load deals', error);
    return Response.json({ error: 'Database tidak dapat memuat opportunity.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const deal = await request.json();
    if (!deal.id || !deal.account || !deal.owner || !deal.stage) return Response.json({ error: 'Data opportunity belum lengkap.' }, { status: 400 });
    const value = Number(deal.value || 0); const probability = Number(deal.probability || 0);
    const { rows } = await getDb().query(`INSERT INTO deals (id, account, sector, owner, stage, value, probability, expected_revenue, next_action, next_action_deadline, founder_involvement, progressive_ownership, customer_id, project_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`, [deal.id, deal.account, deal.sector || null, deal.owner, deal.stage, value, probability, value * probability, deal.nextAction || null, deal.nextActionDeadline || null, Boolean(deal.founderInvolvement), deal.progressiveOwnership || 'Lead', deal.customerId || null, deal.projectId || null]);
    return Response.json(toDeal(rows[0]), { status: 201 });
  } catch (error) {
    console.error('Unable to create deal', error);
    return Response.json({ error: 'Database tidak dapat menyimpan opportunity.' }, { status: 500 });
  }
}
