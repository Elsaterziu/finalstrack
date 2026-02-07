import React, { useEffect, useMemo, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.css";
import { adminService } from "./adminService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [me, setMe] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    adminService.getMe().then(setMe).catch(() => {});
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
      {/* Sidebar */}
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
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="topbar-search">
            <i className="bi bi-search" />
            <input
              placeholder="Search users..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <button className="btn-soft" type="button" title="Notifications">
              <i className="bi bi-bell" />
            </button>

            <div className="dropdown">
              <button
                className="btn-soft"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div className="avatar">{initials}</div>
                <div className="d-none d-md-block" style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 900, lineHeight: 1.1 }}>
                    {me?.fullName || "Admin"}
                  </div>
                  <div className="small-muted">{me?.email || ""}</div>
                </div>
                <i className="bi bi-chevron-down" />
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/admin/profile")}
                  >
                    <i className="bi bi-person me-2" /> Edit Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/admin/password")}
                  >
                    <i className="bi bi-key me-2" /> Change Password
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginTop: 14 }}>
          <Outlet context={{ searchQuery: q }} />
        </div>
      </main>
    </div>
  );
}
