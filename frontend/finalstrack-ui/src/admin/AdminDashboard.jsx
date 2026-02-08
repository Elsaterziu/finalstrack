import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../admin/adminService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setErr(e?.response?.data || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const disabled = users.filter((u) => !u.isActive).length;
    return { total, active, disabled };
  }, [users]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Admin Panel</h2>
          <div className="small-muted">Overview & quick actions</div>
        </div>

        
      </div>

      <div className="cards-row">
        <div className="stat-card2">
          <div className="stat-ic ic-purple"><i className="bi bi-people" /></div>
          <div>
            <div className="stat-num">{stats.total}</div>
            <div className="stat-lbl">Total Users</div>
          </div>
        </div>

        <div className="stat-card2">
          <div className="stat-ic ic-green"><i className="bi bi-check-circle" /></div>
          <div>
            <div className="stat-num">{stats.active}</div>
            <div className="stat-lbl">Active Users</div>
          </div>
        </div>

        <div className="stat-card2">
          <div className="stat-ic ic-red"><i className="bi bi-slash-circle" /></div>
          <div>
            <div className="stat-num">{stats.disabled}</div>
            <div className="stat-lbl">Disabled Users</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h5>Quick Actions</h5>
            <div className="small-muted">Most used admin tasks</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <button className="btn-soft btn-primary-soft" onClick={() => navigate("/admin/users")}>
            <i className="bi bi-people" /> Manage Users
          </button>

          <button className="btn-soft" onClick={() => navigate("/admin/roles")}>
            <i className="bi bi-shield-lock" /> Roles & Permissions
          </button>
        </div>

        {loading && <div className="p-4">Loading...</div>}
        {err && <div className="p-4 text-danger">{err}</div>}
      </div>
    </div>
  );
}
