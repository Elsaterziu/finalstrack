import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminService } from "../admin/adminService";

export default function AdminUsers() {
  const { searchQuery } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // roles dropdown (dinamik)
  const roleOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => (u.roles || []).forEach((r) => set.add(r)));
    return ["All", ...Array.from(set).sort()];
  }, [users]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setErr(e?.response?.data || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();

    return users.filter((u) => {
      const matchesQ =
        !q ||
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        String(u.id).includes(q);

      const roles = u.roles || [];
      const matchesRole = roleFilter === "All" ? true : roles.includes(roleFilter);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Active"
            ? u.isActive === true
            : u.isActive === false;

      return matchesQ && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const disabled = users.filter((u) => !u.isActive).length;
    return { total, active, disabled };
  }, [users]);

  // roles modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleSaving, setRoleSaving] = useState(false);

  const openRoles = async (u) => {
    setSelectedUser(u);
    setRoleModalOpen(true);
    try {
      const r = await adminService.getUserRoles(u.id);
      setSelectedRoles(r || []);
    } catch {
      setSelectedRoles(u.roles || []);
    }
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((x) => x !== role) : [...prev, role]
    );
  };

  const saveRoles = async () => {
    if (!selectedUser) return;
    setRoleSaving(true);
    try {
      const current = await adminService.getUserRoles(selectedUser.id);
      const toAdd = selectedRoles.filter((r) => !current.includes(r));
      const toRemove = current.filter((r) => !selectedRoles.includes(r));

      for (const r of toAdd) await adminService.assignRole(selectedUser.id, r);
      for (const r of toRemove) await adminService.removeRole(selectedUser.id, r);

      await load();
      setRoleModalOpen(false);
    } catch (e) {
      alert(e?.response?.data || "Failed to save roles");
    } finally {
      setRoleSaving(false);
    }
  };

  const setStatus = async (u, active) => {
    try {
      await adminService.setUserStatus(u.id, active);
      await load();
    } catch (e) {
      alert(e?.response?.data || "Failed to update status");
    }
  };

  const delUser = async (u) => {
    if (!window.confirm(`Delete user: ${u.fullName}?`)) return;
    try {
      await adminService.deleteUser(u.id);
      await load();
    } catch (e) {
      alert(e?.response?.data || "Failed to delete user");
    }
  };

  return (
    <div>
      <h2 className="page-title">Admin Panel</h2>

      {/* Cards */}
      <div className="cards-row">
        <div className="stat-card2">
          <div className="stat-ic ic-purple">
            <i className="bi bi-people" />
          </div>
          <div>
            <div className="stat-num">{stats.total}</div>
            <div className="stat-lbl">Total Users</div>
          </div>
        </div>

        <div className="stat-card2">
          <div className="stat-ic ic-green">
            <i className="bi bi-check-circle" />
          </div>
          <div>
            <div className="stat-num">{stats.active}</div>
            <div className="stat-lbl">Active Users</div>
          </div>
        </div>

        <div className="stat-card2">
          <div className="stat-ic ic-red">
            <i className="bi bi-slash-circle" />
          </div>
          <div>
            <div className="stat-num">{stats.disabled}</div>
            <div className="stat-lbl">Disabled Users</div>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h5>Manage Users</h5>
            <div className="small-muted">Search is from topbar.</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="f-input">
            <i className="bi bi-search" />
            <input
              placeholder="Search name or email..."
              value={searchQuery || ""}
              readOnly
            />
          </div>

          <select
            className="f-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "Role: All" : r}
              </option>
            ))}
          </select>

          <select
            className="f-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : err ? (
            <div className="p-4 text-danger">{err}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 220 }}>Roles</th>
                  <th style={{ width: 320, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td style={{ fontWeight: 900 }}>{u.fullName}</td>
                    <td className="small-muted">{u.email}</td>

                    <td>
                      {u.isActive ? (
                        <span className="badge-pill badge-active">Active</span>
                      ) : (
                        <span className="badge-pill badge-disabled">Disabled</span>
                      )}
                    </td>

                    <td>
                      {(u.roles || []).length ? (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {u.roles.map((r) => (
                            <span key={r} className="badge-pill role-pill">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="small-muted">—</span>
                      )}
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="btn-soft btn-primary-soft"
                          onClick={() => openRoles(u)}
                        >
                          Manage Roles
                        </button>

                        <button
                          className={`btn-soft ${
                            u.isActive ? "btn-warn-soft" : "btn-green-soft"
                          }`}
                          onClick={() => setStatus(u, !u.isActive)}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          className="btn-soft btn-danger-soft"
                          onClick={() => delUser(u)}
                          title="Delete user"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 22 }}>
                      <span className="small-muted">No users found.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Roles Modal (Bootstrap) */}
      {roleModalOpen && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,.35)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Manage Roles</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRoleModalOpen(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-2">
                  <div className="fw-semibold">{selectedUser?.fullName}</div>
                  <div className="text-muted small">{selectedUser?.email}</div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  {roleOptions
                    .filter((r) => r !== "All")
                    .map((r) => {
                      const active = selectedRoles.includes(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          className={`btn btn-sm ${
                            active ? "btn-success" : "btn-outline-secondary"
                          }`}
                          onClick={() => toggleRole(r)}
                        >
                          {r}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setRoleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveRoles}
                  disabled={roleSaving}
                >
                  {roleSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
