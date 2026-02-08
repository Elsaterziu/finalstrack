import React, { useEffect, useMemo, useState } from "react";
import { adminService } from "../admin/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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
    const q = (search || "").toLowerCase().trim();

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
  }, [users, search, roleFilter, statusFilter]);

  // modal roles
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
      <div className="panel">
        <div className="panel-header">
                <div>
          <h5>Manage Users</h5>
      <div className="small-muted">Search, filter and manage accounts.</div>
            </div>
         </div>


        <div className="filters-row">
          <div className="f-input">
            <i className="bi bi-search" />
            <input
              placeholder="Search name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        <div className="table-wrap">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : err ? (
            <div className="p-4 text-danger">{err}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 240 }}>Roles</th>
                  <th style={{ width: 360, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>

                    <td className="u-name">
                      <div className="u-avatar">
                        {(u.fullName || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="u-full">{u.fullName}</div>
                        <div className="small-muted">#{u.id}</div>
                      </div>
                    </td>

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
                        <div className="roles-wrap">
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
                          <i className="bi bi-shield-check" /> Roles
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
                          className="icon-danger"
                          onClick={() => delUser(u)}
                          title="Delete"
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

      {roleModalOpen && (
        <div className="modalx-backdrop" onClick={() => setRoleModalOpen(false)}>
          <div className="modalx" onClick={(e) => e.stopPropagation()}>
            <div className="modalx-head">
              <div>
                <div className="modalx-title">Manage Roles</div>
                <div className="small-muted">
                  {selectedUser?.fullName} • {selectedUser?.email}
                </div>
              </div>

              <button className="icon-btn" onClick={() => setRoleModalOpen(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="modalx-body">
              <div className="role-pills">
                {roleOptions
                  .filter((r) => r !== "All")
                  .map((r) => {
                    const active = selectedRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        className={`role-toggle ${active ? "on" : ""}`}
                        onClick={() => toggleRole(r)}
                      >
                        {active && <i className="bi bi-check2" />} {r}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="modalx-foot">
              <button className="btn-soft" onClick={() => setRoleModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-soft btn-primary-soft"
                onClick={saveRoles}
                disabled={roleSaving}
              >
                {roleSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
