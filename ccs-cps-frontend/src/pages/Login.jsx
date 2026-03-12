import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatableInput from "../components/ui/FloatableInput";
import AppButton from "../components/ui/AppButton";
import styles from "../styles/Login.module.css";

import ccsBanner from "../assets/CCS_Banner.png";
import ccsHero from "../assets/CCS_CPS_Login_Picture.png";

export default function Login({ onLoginSuccess, onForgotPassword }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate() {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setServerError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      onLoginSuccess?.({ email: form.email });
      navigate("/faculty/dashboard");
    } catch (err) {
      setServerError(err?.message || "Invalid credentials. Please try again.");
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
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              disabled={isLoading}
            />

            <FloatableInput
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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

            {/* Submit — triggers handleLogin via form onSubmit */}
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