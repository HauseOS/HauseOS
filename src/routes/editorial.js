import express from 'express';
import { getPool } from '../db/init.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import { notifyTelegram } from '../utils/telegram.js';

const router = express.Router();

// ============================================
// VIDEO IDEAS ENDPOINTS
// ============================================

// POST /api/editorial/ideas - Create new idea (agents only)
router.post('/ideas', verifyToken, async (req, res) => {
  try {
    const { title, angle, description, audience_hook, tags, partner_fit, research_links, video_angle_notes, estimated_difficulty, estimated_production_hours } = req.body;
    const agent_origin = req.user.agent_name || 'unknown';
    const submitted_by_name = req.user.name;

    // Validation
    if (!title || !angle || !audience_hook) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (title.length > 100 || title.length < 10) {
      return res.status(400).json({ error: 'Title must be 10-100 characters' });
    }
    if (angle.length > 500 || angle.length < 50) {
      return res.status(400).json({ error: 'Angle must be 50-500 characters' });
    }
    if (audience_hook.length > 300) {
      return res.status(400).json({ error: 'Audience hook max 300 characters' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Insert idea
    const query = `
      INSERT INTO video_ideas (
        title, angle, description, audience_hook, tags, partner_fit,
        video_angle_notes, estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'brainstorm')
      RETURNING *
    `;
    const result = await pool.query(query, [
      title, angle, description || null, audience_hook,
      tags || null, partner_fit || null, video_angle_notes || null,
      estimated_difficulty || null, estimated_production_hours || null,
      agent_origin, submitted_by_name
    ]);

    const idea = result.rows[0];

    // Insert research links
    if (research_links && research_links.length > 0) {
      for (const link of research_links) {
        await pool.query(
          'INSERT INTO research_links (idea_id, title, url, source) VALUES ($1, $2, $3, $4)',
          [idea.id, link.title, link.url, link.source || null]
        );
      }
    }

    // Notify Yeeling
    await notifyTelegram(`
🎬 New Video Idea from ${submitted_by_name}

*${title}*

_${angle}_

Status: Brainstorm | Priority: ${req.body.priority || 'MEDIUM'}

[View in HauseOS](https://hause-ops.vercel.app/editorial/ideas/${idea.id})
    `);

    res.status(201).json(idea);
  } catch (error) {
    console.error('POST /ideas error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/editorial/ideas - List all ideas with filtering
router.get('/ideas', verifyToken, async (req, res) => {
  try {
    const { status, tag, priority, search, sortBy = 'date', page = 1, limit = 20 } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let whereClause = '1=1';
    const params = [];
    let paramIndex = 1;

    // Filter by status
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filter by tag (array contains)
    if (tag) {
      whereClause += ` AND tags @> ARRAY[$${paramIndex}]`;
      params.push(tag);
      paramIndex++;
    }

    // Filter by priority
    if (priority) {
      whereClause += ` AND priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    // Search by title/angle/description
    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR angle ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Sort
    let orderBy = 'created_at DESC';
    if (sortBy === 'priority') orderBy = 'CASE WHEN priority=\'high\' THEN 0 WHEN priority=\'medium\' THEN 1 ELSE 2 END';
    if (sortBy === 'oldest') orderBy = 'created_at ASC';

    // Pagination
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM video_ideas
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(`SELECT COUNT(*) FROM video_ideas WHERE ${whereClause}`, params.slice(0, -2));

    res.json({
      ideas: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('GET /ideas error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/editorial/ideas/:id - Get single idea with notes
router.get('/ideas/:id', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Get idea
    const ideaResult = await pool.query('SELECT * FROM video_ideas WHERE id = $1', [req.params.id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];

    // Get research links
    const linksResult = await pool.query('SELECT * FROM research_links WHERE idea_id = $1', [req.params.id]);
    idea.research_links = linksResult.rows;

    // Get notes
    const notesResult = await pool.query('SELECT * FROM notes WHERE idea_id = $1 ORDER BY created_at DESC', [req.params.id]);
    idea.notes = notesResult.rows;

    // Get likes
    const reactionsResult = await pool.query('SELECT COUNT(*) as count FROM idea_reactions WHERE idea_id = $1', [req.params.id]);
    idea.likes = parseInt(reactionsResult.rows[0].count);

    res.json(idea);
  } catch (error) {
    console.error('GET /ideas/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/editorial/ideas/:id - Update own idea (agents only)
router.patch('/ideas/:id', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Verify ownership
    const ideaResult = await pool.query('SELECT agent_origin FROM video_ideas WHERE id = $1', [req.params.id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];
    if (idea.agent_origin !== (req.user.agent_name || 'unknown')) {
      return res.status(403).json({ error: 'Can only update your own ideas' });
    }

    // Update allowed fields
    const { title, angle, description, audience_hook, tags, partner_fit, video_angle_notes, estimated_difficulty, estimated_production_hours } = req.body;

    const query = `
      UPDATE video_ideas SET
        title = COALESCE($1, title),
        angle = COALESCE($2, angle),
        description = COALESCE($3, description),
        audience_hook = COALESCE($4, audience_hook),
        tags = COALESCE($5, tags),
        partner_fit = COALESCE($6, partner_fit),
        video_angle_notes = COALESCE($7, video_angle_notes),
        estimated_difficulty = COALESCE($8, estimated_difficulty),
        estimated_production_hours = COALESCE($9, estimated_production_hours),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const result = await pool.query(query, [
      title, angle, description, audience_hook, tags, partner_fit,
      video_angle_notes, estimated_difficulty, estimated_production_hours,
      req.params.id
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH /ideas/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/editorial/ideas/:id/status - Change status (Yeeling/Anders only)
router.patch('/ideas/:id/status', verifyToken, checkRole(['admin', 'approver']), async (req, res) => {
  try {
    const { status, note } = req.body;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const validStatuses = ['brainstorm', 'under_review', 'feedback_pending', 'greenlit', 'in_production', 'published', 'rejected', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get current idea
    const ideaResult = await pool.query('SELECT * FROM video_ideas WHERE id = $1', [req.params.id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];

    // Update status
    const updateQuery = `
      UPDATE video_ideas SET
        status = $1,
        greenlit_at = CASE WHEN $1 = 'greenlit' THEN NOW() ELSE greenlit_at END,
        greenlit_by = CASE WHEN $1 = 'greenlit' THEN $2 ELSE greenlit_by END,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [status, req.user.name, req.params.id]);
    const updatedIdea = result.rows[0];

    // Add status change note if provided
    if (note) {
      await pool.query(
        'INSERT INTO notes (idea_id, author, text, type) VALUES ($1, $2, $3, $4)',
        [req.params.id, req.user.name, note, status === 'rejected' ? 'rejection' : 'feedback']
      );
    }

    // Notify agent of status change
    if (status === 'greenlit' || status === 'rejected') {
      const message = status === 'greenlit' 
        ? `✅ Your idea "${idea.title}" has been greenlit!`
        : `❌ Your idea "${idea.title}" was not approved.${note ? ` Feedback: ${note}` : ''}`;
      
      await notifyTelegram(`${message}\n\n[View](https://hause-ops.vercel.app/editorial/ideas/${req.params.id})`);
    }

    res.json(updatedIdea);
  } catch (error) {
    console.error('PATCH /ideas/:id/status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/editorial/ideas/:id - Delete/reject idea (Yeeling/Anders only)
router.delete('/ideas/:id', verifyToken, checkRole(['admin', 'approver']), async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Get idea before deletion
    const ideaResult = await pool.query('SELECT * FROM video_ideas WHERE id = $1', [req.params.id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];

    // Mark as rejected (soft delete)
    const query = `
      UPDATE video_ideas SET
        status = 'rejected',
        rejection_reason = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [rejection_reason || null, req.params.id]);

    res.json({ success: true, idea: result.rows[0] });
  } catch (error) {
    console.error('DELETE /ideas/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/editorial/ideas/:id/reactions - Add like
router.post('/ideas/:id/reactions', verifyToken, checkRole(['admin', 'approver']), async (req, res) => {
  try {
    const { reaction_type = 'like' } = req.body;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO idea_reactions (idea_id, reactor_name, reaction_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (idea_id, reactor_name) DO UPDATE SET reaction_type = $3
      RETURNING *
    `;

    const result = await pool.query(query, [req.params.id, req.user.name, reaction_type]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('POST /reactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/editorial/ideas/:id/notes - Add feedback note (Yeeling/Anders only)
router.post('/ideas/:id/notes', verifyToken, checkRole(['admin', 'approver']), async (req, res) => {
  try {
    const { text, type = 'feedback' } = req.body;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    if (!text || text.length > 1000) {
      return res.status(400).json({ error: 'Note must be 1-1000 characters' });
    }

    const query = `
      INSERT INTO notes (idea_id, author, text, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [req.params.id, req.user.name, text, type]);
    const note = result.rows[0];

    // Get idea to notify agent
    const ideaResult = await pool.query('SELECT submitted_by_name FROM video_ideas WHERE id = $1', [req.params.id]);
    const idea = ideaResult.rows[0];

    // Notify agent of feedback
    await notifyTelegram(`
💬 Feedback on your idea: [View](https://hause-ops.vercel.app/editorial/ideas/${req.params.id})

_"${text}"_

- ${req.user.name}
    `);

    res.status(201).json(note);
  } catch (error) {
    console.error('POST /notes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RESEARCH DROPS ENDPOINTS
// ============================================

// POST /api/editorial/research - Create research drop
router.post('/research', verifyToken, async (req, res) => {
  try {
    const { topic, summary, key_findings, source_links, audience_data, partner_fit, urgency, suggested_angles } = req.body;
    const agent_origin = req.user.agent_name || 'curie';

    if (!topic || !summary || !key_findings || key_findings.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO research_drops (
        topic, summary, key_findings, supporting_data, audience_data,
        partner_fit, urgency, suggested_angles, agent_origin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      topic, summary, key_findings, req.body.supporting_data || null,
      audience_data || null, partner_fit || null, urgency || 'medium',
      suggested_angles || null, agent_origin
    ]);

    const drop = result.rows[0];

    // Insert source links
    if (source_links && source_links.length > 0) {
      for (const link of source_links) {
        await pool.query(
          'INSERT INTO research_drop_links (research_drop_id, title, url, source) VALUES ($1, $2, $3, $4)',
          [drop.id, link.title, link.url, link.source || null]
        );
      }
    }

    // Notify Yeeling
    const urgencyEmoji = urgency === 'high' ? '🔴' : urgency === 'medium' ? '🟡' : '⚪';
    await notifyTelegram(`
${urgencyEmoji} New Research Drop from ${req.user.name}

*${topic}*

${summary}

[View](https://hause-ops.vercel.app/editorial/research/${drop.id})
    `);

    res.status(201).json(drop);
  } catch (error) {
    console.error('POST /research error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/editorial/research - List research drops
router.get('/research', verifyToken, async (req, res) => {
  try {
    const { urgency, partner_fit, sortBy = 'date', page = 1, limit = 20 } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    let whereClause = '1=1';
    const params = [];
    let paramIndex = 1;

    if (urgency) {
      whereClause += ` AND urgency = $${paramIndex}`;
      params.push(urgency);
      paramIndex++;
    }

    if (partner_fit) {
      whereClause += ` AND partner_fit @> ARRAY[$${paramIndex}]`;
      params.push(partner_fit);
      paramIndex++;
    }

    let orderBy = 'created_at DESC';
    if (sortBy === 'oldest') orderBy = 'created_at ASC';

    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM research_drops
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(`SELECT COUNT(*) FROM research_drops WHERE ${whereClause}`, params.slice(0, -2));

    res.json({
      drops: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('GET /research error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/editorial/research/:id - Get single research drop
router.get('/research/:id', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const result = await pool.query('SELECT * FROM research_drops WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research drop not found' });
    }

    const drop = result.rows[0];

    // Get links
    const linksResult = await pool.query('SELECT * FROM research_drop_links WHERE research_drop_id = $1', [req.params.id]);
    drop.source_links = linksResult.rows;

    // Get notes
    const notesResult = await pool.query('SELECT * FROM research_drop_notes WHERE research_drop_id = $1 ORDER BY created_at DESC', [req.params.id]);
    drop.notes = notesResult.rows;

    res.json(drop);
  } catch (error) {
    console.error('GET /research/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DASHBOARD ENDPOINT
// ============================================

// GET /api/editorial/dashboard/stats - Dashboard metrics (Yeeling/Anders only)
router.get('/dashboard/stats', verifyToken, checkRole(['admin', 'approver']), async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    // Calculate date range
    const daysAgo = timeRange === '30days' ? 30 : 7;
    const dateFilter = `created_at >= NOW() - INTERVAL '${daysAgo} days'`;

    // Stats queries
    const submitted = await pool.query(`SELECT COUNT(*) as count FROM video_ideas WHERE ${dateFilter}`);
    const greenlit = await pool.query(`SELECT COUNT(*) as count FROM video_ideas WHERE ${dateFilter} AND status = 'greenlit'`);
    const published = await pool.query(`SELECT COUNT(*) as count FROM video_ideas WHERE ${dateFilter} AND status = 'published'`);
    const rejected = await pool.query(`SELECT COUNT(*) as count FROM video_ideas WHERE ${dateFilter} AND status = 'rejected'`);

    // By status (all time)
    const byStatus = await pool.query(`
      SELECT status, COUNT(*) as count FROM video_ideas
      GROUP BY status
    `);

    // By agent
    const byAgent = await pool.query(`
      SELECT agent_origin, COUNT(*) as count FROM video_ideas
      WHERE ${dateFilter}
      GROUP BY agent_origin
    `);

    // Avg time to greenlit
    const avgTimeToGreenlit = await pool.query(`
      SELECT AVG(EXTRACT(DAY FROM (greenlit_at - created_at))) as days
      FROM video_ideas
      WHERE status = 'greenlit' AND greenlit_at IS NOT NULL AND ${dateFilter}
    `);

    // Trending tags
    const trendingTags = await pool.query(`
      SELECT unnest(tags) as tag, COUNT(*) as count
      FROM video_ideas
      WHERE tags IS NOT NULL AND ${dateFilter}
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 5
    `);

    res.json({
      ideas_submitted: parseInt(submitted.rows[0].count),
      ideas_greenlit: parseInt(greenlit.rows[0].count),
      ideas_published: parseInt(published.rows[0].count),
      ideas_rejected: parseInt(rejected.rows[0].count),
      status_distribution: byStatus.rows,
      agent_contributions: byAgent.rows,
      avg_time_to_greenlit_days: parseFloat(avgTimeToGreenlit.rows[0].days) || 0,
      trending_tags: trendingTags.rows
    });
  } catch (error) {
    console.error('GET /dashboard/stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
