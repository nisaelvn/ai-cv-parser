const router = require("express").Router();
const fs = require("fs");
const pdfParse = require("pdf-parse"); // dikkat: function olarak geliyor
const upload = require("../middleware/upload.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const pool = require("../config/db"); // sende yolu farklıysa düzelt

router.post(
  "/upload",
  requireAuth,
  upload.single("cv"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ ok: false, error: "No file uploaded." });
      }

      // PDF -> text
      const pdfBuffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(pdfBuffer);
      const rawText = parsed?.text || "";

      // DB'ye kaydet
      const result = await pool.query(
        `INSERT INTO uploaded_cvs (user_id, file_name, original_name, file_path, raw_text)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, created_at`,
        [
          req.user.id,
          req.file.filename,
          req.file.originalname,
          req.file.path,
          rawText,
        ]
      );

      return res.json({
        ok: true,
        uploadId: result.rows[0].id,
        createdAt: result.rows[0].created_at,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        textLength: rawText.length,
        textPreview: rawText.slice(0, 300),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
);

module.exports = router;





