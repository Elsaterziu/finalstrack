import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/auth.css";

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("signin"); // signin | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");

  const title = useMemo(() => (mode === "signin" ? "Sign In" : "Sign Up"), [mode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!fullName.trim()) throw new Error("Full name is required.");
        await register(fullName.trim(), email.trim(), password);
        setMode("signin");
      } else {
        await login(email.trim(), password);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(typeof apiMsg === "string" ? apiMsg : "Invalid request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="auth-shell mx-auto">
          {/* Brand */}
          <div className="text-center mb-4">
            <div className="auth-cap mx-auto mb-2">
              <CapIcon />
            </div>
            <h1 className="m-0 auth-title">FinalsTrack</h1>
            <p className="m-0 auth-sub">Your exam season survival companion</p>
          </div>

          {/* Card */}
          <div className="card border-0 shadow-sm auth-card mx-auto">
            <div className="card-body p-4 p-md-4">
              {/* Tabs */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${mode === "signin" ? "active" : ""}`}
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-3">
                {/* Full Name (only signup) */}
                {mode === "signup" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="input-group auth-input">
                      <span className="input-group-text bg-transparent border-0 auth-addon">
                        <i className="bi bi-person" />
                        </span>
                      <input
                        className="form-control border-0 bg-transparent"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <div className="input-group auth-input">
                    <span className="input-group-text bg-transparent border-0 auth-addon">
                        <i className="bi bi-envelope" />
                        </span>
                    <input
                      type="email"
                      className="form-control border-0 bg-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group auth-input">
                        <span className="input-group-text bg-transparent border-0 auth-addon">
                            <i className="bi bi-lock" />
                        </span>
                    <input
                      type="password"
                      className="form-control border-0 bg-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2 mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 auth-btn"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : title} <span className="ms-2">→</span>
                </button>

              </form>
            </div>
          </div>

          {/* Footer fixed at bottom */}
          <footer className="auth-footer text-center small text-muted">
            © {new Date().getFullYear()} FinalsTrack
          </footer>
        </div>
      </div>
    </div>
  );
}
