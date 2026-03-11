import { getPool } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const { status, deal_type, deal_value, contact_id, content_idea_id, notes, pitch_sent_at, reply_received_at, confirmed_at, delivered_at, paid_at } = req.body;

    const pool = getPool();
    const query = `
      UPDATE sponsor_deals SET
        status = COALESCE($1, status),
        deal_type = COALESCE($2, deal_type),
        deal_value = COALESCE($3, deal_value),
        contact_id = COALESCE($4, contact_id),
        content_idea_id = COALESCE($5, content_idea_id),
        notes = COALESCE($6, notes),
        pitch_sent_at = COALESCE($7, pitch_sent_at),
        reply_received_at = COALESCE($8, reply_received_at),
        confirmed_at = COALESCE($9, confirmed_at),
        delivered_at = COALESCE($10, delivered_at),
        paid_at = COALESCE($11, paid_at),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;

    const result = await pool.query(query, [
      status, deal_type, deal_value, contact_id, content_idea_id,
      notes, pitch_sent_at, reply_received_at, confirmed_at, delivered_at, paid_at,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH /api/deals/[id] error:', error);
    res.status(500).json({ error: error.message });
  }
}
