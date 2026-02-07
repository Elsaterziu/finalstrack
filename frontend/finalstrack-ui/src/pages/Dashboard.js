import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roles = user?.roles || [];
  const isAdmin = roles.includes("Admin");

  return (
    <div className="container py-4">
      <h2 className="mb-3">Dashboard</h2>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-2"><b>User:</b> {user?.email}</div>
          <div className="mb-3"><b>Roles:</b> {roles.join(", ")}</div>

          {isAdmin && (
            <button
              className="btn btn-primary me-2"
              onClick={() => navigate("/admin")}
            >
              Go to Admin Panel
            </button>
          )}

          <button className="btn btn-outline-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
