import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import CVUpload from "./CvUpload";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data?.user || res.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    loadMe();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 700, margin: "60px auto", padding: 16 }}>
      <h2>Dashboard</h2>

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div style={{ border: "1px solid #ddd", padding: 14, borderRadius: 10 }}>
          <p>
            <b>Full Name:</b> {user.full_name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Role:</b> {user.role}
          </p>
          <p>
            <b>Status:</b> {user.status}
          </p>

          <button onClick={logout} style={{ marginTop: 10 }}>
            Logout
          </button>

          {user.role === "admin" && (
            <p style={{ marginTop: 10 }}>
              <Link to="/admin/cvs" style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }} > CV List </Link>
              <Link to="/admin/users" style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }} > Pending Users </Link>
            </p>
          )}

          <hr style={{ margin: "24px 0" }} />

          {/* CV Upload Section */}
          <h3>Upload CV</h3>
          <CVUpload />
        </div>
      )}
    </div>
  )
}
