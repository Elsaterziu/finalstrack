import React, { useEffect, useMemo, useRef, useState } from "react";
import { adminService } from "./adminService";

const ROLE_OPTIONS = ["Admin", "Student", "Professor"];

export default function AdminRoles() {
  const [userId, setUserId] = useState("");
  const [loadedUserId, setLoadedUserId] = useState(null);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [roleToAssign, setRoleToAssign] = useState("Admin");

  const debounceRef = useRef(null);

  const canLoad = useMemo(() => {
    const n = Number(userId);
    return Number.isInteger(n) && n > 0;
  }, [userId]);

  const loadRoles = async (id) => {
    const userIdNum = Number(id);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) return;

    setErr("");
    setLoading(true);
    try {
      const r = await adminService.getUserRoles(userIdNum);
      setRoles(r || []);
      setLoadedUserId(userIdNum);
    } catch (e) {
      setErr(e?.response?.data || "Failed to load roles for this user.");
      setRoles([]);
      setLoadedUserId(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load roles when userId changes (debounced)
  useEffect(() => {
    if (!canLoad) {
      setLoadedUserId(null);
      setRoles([]);
      setErr("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadRoles(userId);
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const assign = async () => {
    if (!loadedUserId) return;
    const rn = String(roleToAssign || "").trim();
    if (!rn) return;

    // prevent duplicates in UI
    if (roles.some((x) => String(x).toLowerCase() === rn.toLowerCase())) return;

    setErr("");
    setSaving(true);
    try {
      await adminService.assignRole(loadedUserId, rn);
      const updated = await adminService.getUserRoles(loadedUserId);
      setRoles(updated || []);
    } catch (e) {
      setErr(e?.response?.data || "Failed to assign role.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (rn) => {
    if (!loadedUserId) return;

    const ok = window.confirm(`Are you sure you want to remove role "${rn}" from userId ${loadedUserId}?`);
    if (!ok) return;

    setErr("");
    setSaving(true);
    try {
      await adminService.removeRole(loadedUserId, rn);
      const updated = await adminService.getUserRoles(loadedUserId);
      setRoles(updated || []);
    } catch (e) {
      setErr(e?.response?.data || "Failed to remove role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Roles & Permissions</h2>
          <div className="small-muted">
            Search a user by ID, then assign or remove roles.
          </div>
        </div>
      </div>

      {/* Search / Load */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h5>Search User (by ID)</h5>
            <div className="small-muted">{`{userId}`}</div>
          </div>

          {/* Small button as fallback (optional) */}
          <button
            className="btn-soft btn-primary-soft"
            onClick={() => loadRoles(userId)}
            disabled={!canLoad || loading}
            title="Search now"
          >
            <i className="bi bi-search" /> {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <div className="f-input">
            <i className="bi bi-person-badge" />
            <input
              placeholder="Type User ID and press Enter…"
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/[^\d]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canLoad) loadRoles(userId);
              }}
            />
          </div>

          <div className="small-muted" style={{ marginTop: 8 }}>
            {loadedUserId
              ? `Showing roles for userId ${loadedUserId}.`
              : "Enter a valid userId to load roles."}
          </div>

          {err && <div className="text-danger" style={{ marginTop: 10 }}>{String(err)}</div>}
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Manage Roles */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h5>Manage Roles</h5>
            <div className="small-muted">
              
            </div>
          </div>
        </div>

        {/* Current roles */}
        <div style={{ padding: 16, borderBottom: "1px solid rgba(15,23,42,.08)" }}>
          <div className="small-muted" style={{ marginBottom: 8 }}>Current roles</div>

          {!loadedUserId ? (
            <div className="small-muted">Load a user first.</div>
          ) : loading ? (
            <div className="small-muted">Loading…</div>
          ) : roles.length ? (
            <div className="roles-wrap">
              {roles.map((r) => (
                <span key={r} className="badge-pill role-pill">{r}</span>
              ))}
            </div>
          ) : (
            <div className="small-muted">No roles for this user.</div>
          )}
        </div>

        {/* Assign role (dropdown) */}
        <div
          style={{
            padding: 16,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
          }}
        >
          <select
            className="f-select"
            value={roleToAssign}
            onChange={(e) => setRoleToAssign(e.target.value)}
            disabled={!loadedUserId || saving}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            className="btn-soft btn-primary-soft"
            onClick={assign}
            disabled={!loadedUserId || saving}
            title="Assign selected role"
          >
            <i className="bi bi-person-plus" /> {saving ? "Saving..." : "Assign"}
          </button>
        </div>

        {/* Remove role list */}
        <div style={{ padding: 16, paddingTop: 0 }}>
          <div className="small-muted" style={{ marginBottom: 8 }}>Remove a role</div>

          {!loadedUserId ? (
            <div className="small-muted">Load a user first.</div>
          ) : roles.length ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {roles.map((r) => (
                <button
                  key={r}
                  className="btn-soft btn-danger-soft"
                  onClick={() => remove(r)}
                  disabled={saving}
                  title={`Remove ${r}`}
                >
                  <i className="bi bi-x-circle" /> Remove {r}
                </button>
              ))}
            </div>
          ) : (
            <div className="small-muted">No roles to remove.</div>
          )}
        </div>
      </div>
    </div>
  );
}
