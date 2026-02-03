import { useState } from "react";
import api from "../api/axios";

export default function CVUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("cv", file);

      // ❗ Content-Type header ekleme
      const res = await api.post("/cv/upload", formData);

      setMessage(res.data?.message || "CV uploaded successfully.");
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.error || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: 16 }}>
      <h2>Upload CV</h2>

      {message && (
        <div style={{ background: "#e8ffe8", padding: 10, marginBottom: 10 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: "#ffe5e5", padding: 10, marginBottom: 10 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} style={{ display: "grid", gap: 10 }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload CV"}
        </button>
      </form>
    </div>
  );
}
