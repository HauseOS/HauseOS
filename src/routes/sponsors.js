import express from 'express';
import { getPool } from '../db/init.js';
import { requireApiKey } from '../middleware/api-key.js';

const router = express.Router();

// ============================================
// COMPANIES
// ============================================

// GET /api/companies — List all sponsor companies
router.get('/companies', async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let whereClause = '1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    let orderBy = 'created_at DESC';
    if (sort === 'fit_score') orderBy = 'fit_score DESC';
    if (sort === 'name') orderBy = 'name ASC';
    if (sort === 'last_seen') orderBy = 'last_seen_at DESC NULLS LAST';

    const query = `SELECT * FROM sponsor_companies WHERE ${whereClause} ORDER BY ${orderBy}`;
    const result = await pool.query(query, params);

    res.json({ companies: result.rows });
  } catch (error) {
    console.error('GET /companies error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/companies — Create sponsor company (API key protected)
router.post('/companies', requireApiKey, async (req, res) => {
  try {
    const { name, website, category, fit_score, funding_stage, has_partnership_page, notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;

    if (!name) return res.status(400).json({ error: 'Company name is required' });

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO sponsor_companies (
        name, website, category, fit_score, funding_stage, has_partnership_page,
        notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name, website || null, category || null, fit_score || 0,
      funding_stage || null, has_partnership_page || false,
      notes || null, source || 'manual', channels_sponsoring || null,
      sponsor_frequency || null, first_seen_at || null, last_seen_at || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /companies error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/companies/:id — Get single company with contacts
router.get('/companies/:id', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const companyResult = await pool.query('SELECT * FROM sponsor_companies WHERE id = $1', [req.params.id]);
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = companyResult.rows[0];

    const contactsResult = await pool.query('SELECT * FROM sponsor_contacts WHERE company_id = $1 ORDER BY created_at DESC', [req.params.id]);
    company.contacts = contactsResult.rows;

    const dealsResult = await pool.query(
      `SELECT d.*, vi.title as idea_title FROM sponsor_deals d
       LEFT JOIN video_ideas vi ON d.content_idea_id = vi.id
       WHERE d.company_id = $1 ORDER BY d.created_at DESC`,
      [req.params.id]
    );
    company.deals = dealsResult.rows;

    res.json(company);
  } catch (error) {
    console.error('GET /companies/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/companies/:id — Update company
router.patch('/companies/:id', async (req, res) => {
  try {
    const { name, website, category, fit_score, funding_stage, has_partnership_page, notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      UPDATE sponsor_companies SET
        name = COALESCE($1, name),
        website = COALESCE($2, website),
        category = COALESCE($3, category),
        fit_score = COALESCE($4, fit_score),
        funding_stage = COALESCE($5, funding_stage),
        has_partnership_page = COALESCE($6, has_partnership_page),
        notes = COALESCE($7, notes),
        source = COALESCE($8, source),
        channels_sponsoring = COALESCE($9, channels_sponsoring),
        sponsor_frequency = COALESCE($10, sponsor_frequency),
        first_seen_at = COALESCE($11, first_seen_at),
        last_seen_at = COALESCE($12, last_seen_at),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;

    const result = await pool.query(query, [
      name, website, category, fit_score, funding_stage, has_partnership_page,
      notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at,
      req.params.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH /companies/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CONTACTS
// ============================================

// GET /api/contacts — List contacts (optionally by company)
router.get('/contacts', async (req, res) => {
  try {
    const { company_id } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let query = `
      SELECT c.*, sc.name as company_name
      FROM sponsor_contacts c
      LEFT JOIN sponsor_companies sc ON c.company_id = sc.id
    `;
    const params = [];

    if (company_id) {
      query += ' WHERE c.company_id = $1';
      params.push(company_id);
    }

    query += ' ORDER BY c.created_at DESC';
    const result = await pool.query(query, params);

    res.json({ contacts: result.rows });
  } catch (error) {
    console.error('GET /contacts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contacts — Add contact to a company
router.post('/contacts', async (req, res) => {
  try {
    const { company_id, name, email, role, linkedin_url, source, verified } = req.body;

    if (!company_id || !name) {
      return res.status(400).json({ error: 'company_id and name are required' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO sponsor_contacts (company_id, name, email, role, linkedin_url, source, verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      company_id, name, email || null, role || null,
      linkedin_url || null, source || 'manual', verified || false
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /contacts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DEALS
// ============================================

// GET /api/deals — List all deals
router.get('/deals', async (req, res) => {
  try {
    const { status, company_id } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let whereClause = '1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND d.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (company_id) {
      whereClause += ` AND d.company_id = $${paramIndex}`;
      params.push(company_id);
      paramIndex++;
    }

    const query = `
      SELECT d.*,
        sc.name as company_name,
        sc.category as company_category,
        sc.fit_score as company_fit_score,
        scon.name as contact_name,
        scon.email as contact_email,
        vi.title as idea_title
      FROM sponsor_deals d
      LEFT JOIN sponsor_companies sc ON d.company_id = sc.id
      LEFT JOIN sponsor_contacts scon ON d.contact_id = scon.id
      LEFT JOIN video_ideas vi ON d.content_idea_id = vi.id
      WHERE ${whereClause}
      ORDER BY d.created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json({ deals: result.rows });
  } catch (error) {
    console.error('GET /deals error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deals/pipeline — Pipeline summary grouped by status
router.get('/deals/pipeline', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const summaryResult = await pool.query(`
      SELECT
        status,
        COUNT(*) as count,
        COALESCE(SUM(deal_value), 0) as total_value
      FROM sponsor_deals
      GROUP BY status
      ORDER BY CASE status
        WHEN 'discovered' THEN 1
        WHEN 'researched' THEN 2
        WHEN 'pitched' THEN 3
        WHEN 'negotiating' THEN 4
        WHEN 'confirmed' THEN 5
        WHEN 'delivered' THEN 6
        WHEN 'paid' THEN 7
        WHEN 'lost' THEN 8
      END
    `);

    const totalPipelineResult = await pool.query(`
      SELECT
        COALESCE(SUM(deal_value), 0) as total_pipeline_value,
        COUNT(*) as total_deals
      FROM sponsor_deals
      WHERE status NOT IN ('lost', 'paid')
    `);

    const thisMonthResult = await pool.query(`
      SELECT COUNT(*) as deals_this_month
      FROM sponsor_deals
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `);

    res.json({
      stages: summaryResult.rows,
      total_pipeline_value: parseFloat(totalPipelineResult.rows[0].total_pipeline_value),
      total_active_deals: parseInt(totalPipelineResult.rows[0].total_deals),
      deals_this_month: parseInt(thisMonthResult.rows[0].deals_this_month)
    });
  } catch (error) {
    console.error('GET /deals/pipeline error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/deals — Create deal (API key protected)
router.post('/deals', requireApiKey, async (req, res) => {
  try {
    const { company_id, contact_id, content_idea_id, status, deal_type, deal_value, notes } = req.body;

    if (!company_id) {
      return res.status(400).json({ error: 'company_id is required' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO sponsor_deals (
        company_id, contact_id, content_idea_id, status, deal_type, deal_value, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      company_id, contact_id || null, content_idea_id || null,
      status || 'discovered', deal_type || null, deal_value || null, notes || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /deals error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/deals/:id — Update deal
router.patch('/deals/:id', async (req, res) => {
  try {
    const { status, deal_type, deal_value, contact_id, content_idea_id, notes, pitch_sent_at, reply_received_at, confirmed_at, delivered_at, paid_at } = req.body;

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

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
      req.params.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH /deals/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// INTELLIGENCE
// ============================================

// POST /api/intelligence/match — Match idea to sponsors by category
router.post('/intelligence/match', async (req, res) => {
  try {
    const { idea_id } = req.body;

    if (!idea_id) return res.status(400).json({ error: 'idea_id is required' });

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Get the idea's tags
    const ideaResult = await pool.query('SELECT tags, partner_fit FROM video_ideas WHERE id = $1', [idea_id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];
    const tags = idea.tags || [];
    const partnerFit = idea.partner_fit || [];

    // Find companies matching by category (tags) or name (partner_fit)
    let query;
    let params;

    if (tags.length > 0 && partnerFit.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE category = ANY($1) OR name = ANY($2)
        ORDER BY fit_score DESC
      `;
      params = [tags, partnerFit];
    } else if (tags.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE category = ANY($1)
        ORDER BY fit_score DESC
      `;
      params = [tags];
    } else if (partnerFit.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE name = ANY($1)
        ORDER BY fit_score DESC
      `;
      params = [partnerFit];
    } else {
      return res.json({ matches: [], message: 'No tags or partner_fit data to match against' });
    }

    const result = await pool.query(query, params);
    res.json({ matches: result.rows });
  } catch (error) {
    console.error('POST /intelligence/match error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// OUTREACH LOG
// ============================================

// GET /api/outreach — List outreach entries for a deal
router.get('/outreach', async (req, res) => {
  try {
    const { deal_id } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let query = `
      SELECT o.*, scon.name as contact_name
      FROM outreach_log o
      LEFT JOIN sponsor_contacts scon ON o.contact_id = scon.id
    `;
    const params = [];

    if (deal_id) {
      query += ' WHERE o.deal_id = $1';
      params.push(deal_id);
    }

    query += ' ORDER BY o.sent_at DESC';
    const result = await pool.query(query, params);

    res.json({ entries: result.rows });
  } catch (error) {
    console.error('GET /outreach error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/outreach — Log outreach activity
router.post('/outreach', async (req, res) => {
  try {
    const { deal_id, contact_id, type, subject, body } = req.body;

    if (!type) return res.status(400).json({ error: 'type is required' });

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO outreach_log (deal_id, contact_id, type, subject, body)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      deal_id || null, contact_id || null, type, subject || null, body || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /outreach error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
