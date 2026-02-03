const router = require("express").Router();
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");

//  1) Admin - CV liste
router.get("/cvs", requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id, user_id, file_name, original_name, created_at,
        LENGTH(raw_text) AS text_length
      FROM uploaded_cvs
      ORDER BY created_at DESC
      LIMIT 50
      `
    );

    return res.json({ ok: true, cvs: result.rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

//  2) Admin - CV detay (preview)
router.get("/cvs/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        id, user_id, file_name, original_name, created_at, raw_text
      FROM uploaded_cvs
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "CV not found." });
    }

    const row = result.rows[0];
    return res.json({
      ok: true,
      cv: {
        ...row,
        raw_text_preview: (row.raw_text || "").slice(0, 1500),
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

//  3) pending users list
router.get("/pending-users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, status, created_at
       FROM users
       WHERE status = 'pending'
       ORDER BY created_at DESC`
    );

    return res.json({ ok: true, users: result.rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Kullanıcıyı onayla (pending -> active)
router.patch("/approve-user/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET status = 'active', updated_at = NOW()
       WHERE id = $1
       RETURNING id, full_name, email, role, status`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Kullanıcı bulunamadı." });
    }

    return res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Kullanıcıyı reddet 
router.patch("/reject-user/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET status = 'rejected', updated_at = NOW()
       WHERE id = $1
       RETURNING id, full_name, email, role, status`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Kullanıcı bulunamadı." });
    }

    return res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});


module.exports = router;


