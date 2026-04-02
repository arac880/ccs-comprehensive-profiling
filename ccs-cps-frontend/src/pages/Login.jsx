import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatableInput from "../components/ui/FloatableInput";
import AppButton from "../components/ui/AppButton";
import styles from "../styles/Login.module.css";

import ccsBanner from "../assets/CCS_Banner.png";
import ccsHero from "../assets/CCS_CPS_Login_Picture.png";

export default function Login({ onLoginSuccess, onForgotPassword }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [errors, setErrors] = useState({ id: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate() {
    const newErrors = { id: "", password: "" };
    let valid = true;

    if (!form.id.trim()) {
      newErrors.id = "ID Number is required.";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.message || "Invalid credentials. Please try again.",
        );
        return;
      }

      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLoginSuccess?.(data.user);

      // Redirect based on role
      if (data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/faculty/dashboard");
      }
    } catch (err) {
      setServerError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Left panel */}
        <div className={styles.formPanel}>
          {/* Branding */}
          <div className={styles.brand}>
            <img
              src={ccsBanner}
              alt="UC CCS Logo"
              className={styles.brandImg}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>

          <h1 className={styles.heading}>CCS Comprehensive Profiling Portal</h1>

          {/* Login form */}
          <form className={styles.form} noValidate onSubmit={handleLogin}>
            <FloatableInput
              id="id"
              type="text"
              label="ID Number"
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              error={errors.id}
              disabled={isLoading}
            />

            <FloatableInput
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              error={errors.password}
              disabled={isLoading}
            />

            {/* Server error */}
            {serverError && (
              <div className={styles.serverError} role="alert">
                {serverError}
              </div>
            )}

            {/* Forgot password */}
            <div className={styles.forgotRow}>
              <a
                href="#"
                className={styles.forgotLink}
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPassword?.();
                }}
              >
                Forgot Password?
              </a>
            </div>

            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              block={true}
              loading={isLoading}
            >
              LOGIN
            </AppButton>
          </form>

          <span className={styles.version}>v1.01</span>
        </div>

        {/* Right panel */}
        <div className={styles.heroPanel}>
          <img
            src={ccsHero}
            alt="CCS Visual"
            className={styles.heroImage}
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className={styles.heroOverlay} />
        </div>
      </div>
    </div>
  );
}
