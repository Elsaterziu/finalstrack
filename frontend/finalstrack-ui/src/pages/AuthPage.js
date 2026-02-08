import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/auth.css";

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = useMemo(
    () => (mode === "signin" ? "Sign In" : "Sign Up"),
    [mode]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!fullName.trim()) {
          throw new Error("Full name is required.");
        }

        await register(fullName.trim(), email.trim(), password);
        setMode("signin");
        return;
      }

      const me = await login(email.trim(), password);
      const roles = me?.roles || [];

      if (roles.includes("Admin")) {
        navigate("/admin", { replace: true });
              } else if (roles.includes("Professor")) {
          navigate("/professor", { replace: true });
             } else {
          navigate("/student", { replace: true });
          }

    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(typeof msg === "string" ? msg : "Invalid request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="auth-shell mx-auto">

          {/* BRAND */}
          <div className="text-center mb-4">
            <div className="auth-cap mx-auto mb-2">
              <CapIcon />
            </div>
            <h1 className="auth-title">FinalsTrack</h1>
            <p className="auth-sub">Your exam season survival companion</p>
          </div>

          {/* CARD */}
          <div className="card border-0 shadow-sm auth-card mx-auto">
            <div className="card-body p-4">

              {/* TABS */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${mode === "signin" ? "active" : ""}`}
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-3">

                {mode === "signup" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : title} →
                </button>
              </form>
            </div>
          </div>

          <footer className="text-center small text-muted mt-4">
            © {new Date().getFullYear()} FinalsTrack
          </footer>

        </div>
      </div>
    </div>
  );
}
