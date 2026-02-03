const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // <-- DB bağlantısı

const authRoutes = require("./routes/auth.routes");
const cvRoutes = require("./routes/cv.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/cv", cvRoutes);
app.use("/admin", adminRoutes);


// Sağlık kontrolü
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// DB test endpoint
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = app;


