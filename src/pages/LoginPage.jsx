import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./LoginPage.css";

// ── Small reusable input ────────────────────────────────────────────────────────
function InputField({ id, label, type = "text", value, onChange, error, disabled }) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  return (
    <div className={`input-wrap ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className={`floating-label ${floating ? "up" : ""}`}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        autoComplete="off"
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field-level validation
  function validate() {
    const e = {};
    if (!form.email.trim()) {
      e.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      e.password = "Please enter your password.";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    return e;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear individual field error as user types
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
      if (serverError) setServerError("");
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      // Persist user info for the session
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      {/* Background gradient */}
      <div className="bg-gradient" aria-hidden="true" />

      {/* Header */}
      <header className="login-header">
        <span className="brand">NETFLIX</span>
      </header>

      {/* Card */}
      <main className="login-main">
        <div className="login-card">
          <h1 className="card-title">Sign In</h1>

          {serverError && (
            <div className="server-error" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              id="email"
              label="Email or phone number"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
              disabled={loading}
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
              disabled={loading}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign In"}
            </button>
          </form>

          {/* Helper links */}
          <div className="card-links">
            <a href="#" className="link-muted">Forgot password?</a>
            <span className="link-muted">·</span>
            <a href="#" className="link-muted">Need help?</a>
          </div>

          <p className="signup-prompt">
            New to Netflix?{" "}
            <a href="#" className="link-white">Sign up now.</a>
          </p>

          {/* Hint for demo */}
          <div className="demo-hint">
            <span>Demo credentials</span>
            <code>user@netflix.com / password123</code>
          </div>
        </div>
      </main>
    </div>
  );
}
