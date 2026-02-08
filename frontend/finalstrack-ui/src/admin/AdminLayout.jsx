import React, { useEffect, useMemo, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.css";
import { adminService } from "./adminService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [me, setMe] = useState(null);

useEffect(() => {
  adminService.getAuthMe().then(setMe).catch(() => {});
}, []);


  const initials = useMemo(() => {
    const name = me?.fullName || "Admin";
    return name
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [me]);

  const onLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo">
            <i className="bi bi-mortarboard-fill" />
          </div>
          <div>
            <div className="name">FinalsTrack</div>
            <div className="sub">Admin</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <i className="bi bi-speedometer2" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users">
            <i className="bi bi-people" />
            Users
          </NavLink>

          <NavLink to="/admin/roles">
            <i className="bi bi-shield-lock" />
            Roles & Permissions
          </NavLink>

          <NavLink to="/admin/settings">
            <i className="bi bi-gear" />
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-soft btn-danger-soft w-100" onClick={onLogout}>
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          {/* Title (replaces search) */}
          <div>
            <div style={{ fontWeight: 950, color: "var(--text)", lineHeight: 1.1 }}>
              Admin Panel
            </div>
            <div className="small-muted">Manage users & roles</div>
          </div>

          <div className="topbar-right">
            <div className="profile-chip">
              <div className="avatar">{initials}</div>
              <div className="profile-meta">
                <div className="profile-name">{me?.fullName || "Admin"}</div>
                <div className="profile-email">{me?.email || ""}</div>
              </div>
              <button className="icon-btn" onClick={onLogout} title="Logout">
                <i className="bi bi-box-arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
