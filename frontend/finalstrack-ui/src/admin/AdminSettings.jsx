import React, { useEffect, useMemo, useState } from "react";
import { adminService } from "./adminService";

export default function AdminSettings() {
  // loading + messages
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // me (from GET /api/auth/me)
  const [me, setMe] = useState(null);

  // profile form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [showPass, setShowPass] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await adminService.getAuthMe(); 
      setMe(data);
      setFullName(data?.fullName || "");
      setEmail(data?.email || "");
    } catch (e) {
      setErr(e?.response?.data || "Failed to load account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // small helpers
  const emailValid = useMemo(() => {
    const v = (email || "").trim();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [email]);

  const profileChanged = useMemo(() => {
    return (
      (fullName || "").trim() !== (me?.fullName || "").trim() ||
      (email || "").trim() !== (me?.email || "").trim()
    );
  }, [fullName, email, me]);

  const passwordValid = useMemo(() => {
    if (!currentPassword || !newPassword || !confirmNew) return false;
    if (newPassword.length < 6) return false; 
    if (newPassword !== confirmNew) return false;
    return true;
  }, [currentPassword, newPassword, confirmNew]);

  const saveProfile = async () => {
    setOk("");
    setErr("");

    if (!profileChanged) return;
    if (!(fullName || "").trim()) {
      setErr("Full name is required.");
      return;
    }
    if (!emailValid) {
      setErr("Please enter a valid email.");
      return;
    }

    setSavingProfile(true);
    try {
      await adminService.updateMe({
        fullName: fullName.trim(),
        email: email.trim(),
      }); 

      setOk("Profile updated ✅");
      await load(); // reload to keep in sync
    } catch (e) {
      setErr(e?.response?.data || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    setOk("");
    setErr("");

    if (!passwordValid) {
      setErr("Please check your password fields.");
      return;
    }

    setSavingPass(true);
    try {
      await adminService.changeMyPassword({
        currentPassword,
        newPassword,
      }); 

      setOk("Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNew("");
    } catch (e) {
      setErr(e?.response?.data || "Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Settings</h2>
          <div className="small-muted">Manage your account & security.</div>
        </div>
      </div>

      {loading ? (
        <div className="panel">
          <div className="p-4">Loading...</div>
        </div>
      ) : (
        <>
          {(err || ok) && (
            <div className="panel" style={{ marginBottom: 14 }}>
              <div className="p-4">
                {err && <div className="text-danger">{String(err)}</div>}
                {ok && <div style={{ fontWeight: 800 }}>{ok}</div>}
              </div>
            </div>
          )}

          {/* My Account */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h5>My Account</h5>
                <div className="small-muted">Update your full name and email.</div>
              </div>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <div className="small-muted" style={{ marginBottom: 6 }}>Full name</div>
                <div className="f-input">
                  <i className="bi bi-person" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div>
                <div className="small-muted" style={{ marginBottom: 6 }}>Email</div>
                <div className="f-input">
                  <i className="bi bi-envelope" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: 16, paddingTop: 0, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                className="btn-soft"
                type="button"
                onClick={() => {
                  setFullName(me?.fullName || "");
                  setEmail(me?.email || "");
                  setOk("");
                  setErr("");
                }}
                disabled={!profileChanged || savingProfile}
              >
                Reset
              </button>

              <button
                className="btn-soft btn-primary-soft"
                type="button"
                onClick={saveProfile}
                disabled={!profileChanged || savingProfile}
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

          <div style={{ height: 14 }} />

          {/* Security */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h5>Security</h5>
                <div className="small-muted">Change your password.</div>
              </div>

              <button
                className="btn-soft"
                type="button"
                onClick={() => setShowPass((x) => !x)}
                title={showPass ? "Hide passwords" : "Show passwords"}
              >
                <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />{" "}
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div>
                <div className="small-muted" style={{ marginBottom: 6 }}>Current password</div>
                <div className="f-input">
                  <i className="bi bi-lock" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                  />
                </div>
              </div>

              <div>
                <div className="small-muted" style={{ marginBottom: 6 }}>New password</div>
                <div className="f-input">
                  <i className="bi bi-shield-lock" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>
              </div>

              <div>
                <div className="small-muted" style={{ marginBottom: 6 }}>Confirm new</div>
                <div className="f-input">
                  <i className="bi bi-check2-circle" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmNew}
                    onChange={(e) => setConfirmNew(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: 16, paddingTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="small-muted">
                {newPassword && newPassword.length < 6 ? "Password should be at least 6 characters." : ""}
                {confirmNew && newPassword !== confirmNew ? " Passwords do not match." : ""}
              </div>

              <button
                className="btn-soft btn-primary-soft"
                type="button"
                onClick={changePassword}
                disabled={!passwordValid || savingPass}
              >
                {savingPass ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
