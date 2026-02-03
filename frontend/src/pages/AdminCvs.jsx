import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCvs() {
  const [cvs, setCvs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const loadList = async () => {
    setErr("");
    try {
      const res = await api.get("/admin/cvs");
      setCvs(res.data?.cvs || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load CV list.");
    }
  };

  const openPreview = async (id) => {
    setSelected(id);
    setPreview("");
    setErr("");
    setLoading(true);
    try {
      const res = await api.get(`/admin/cvs/${id}`);
      setPreview(res.data?.cv?.raw_text_preview || "");
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load CV preview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto", padding: 16 }}>
      <h2>Admin - Uploaded CVs</h2>

      {err && (
        <div style={{ background: "#ffe5e5", padding: 10, borderRadius: 8, marginTop: 10 }}>
          {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        {/* LEFT: list */}
        <div style={{ border: "1px solid #fff", borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Latest uploads</h3>

          {cvs.length === 0 ? (
            <p>No CV uploads yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {cvs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 10,
                    padding: 10,
                    cursor: "pointer",
                    background: selected === item.id ? "#eef2ff" : "#fafafa",
                    color:"#111"                  }}
                  onClick={() => openPreview(item.id)}
                >
                  <div><b>ID:</b> {item.id}</div>
                  <div><b>File:</b> {item.original_name}</div>
                  <div><b>User:</b> {item.user_id}</div>
                  <div><b>Text length:</b> {item.text_length}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={loadList} style={{ marginTop: 12 }}>
            Refresh
          </button>
        </div>

        {/* RIGHT: preview */}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Preview</h3>

          {!selected ? (
            <p>Select a CV from the list to preview parsed text.</p>
          ) : loading ? (
            <p>Loading preview...</p>
          ) : (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#0f172a",
                padding: 12,
                borderRadius: 10,
                maxHeight: 420,
                overflow: "auto",
              }}
            >
              {preview || "(No text extracted from this PDF)"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
