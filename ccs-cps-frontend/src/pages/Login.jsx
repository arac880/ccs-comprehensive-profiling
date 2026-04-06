import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatableInput from "../components/ui/FloatableInput";
import AppButton from "../components/ui/AppButton";
// import AppToast from "../components/ui/AppToast";
import LoadingModal from "../components/ui/LoadingModal";
import styles from "../styles/Login.module.css";

import ccsBanner from "../assets/CCS_Banner.png";
import ccsHero from "../assets/CCS_CPS_Login_Picture.png";

export default function Login({ onLoginSuccess, onForgotPassword }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [errors, setErrors] = useState({ id: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [loginRole, setLoginRole] = useState("student");
  const [userName, setUserName] = useState("");
  const [serverError, setServerError] = useState("");
  // const [toast, setToast] = useState({
  //   isVisible: false,
  //   message: "",
  //   type: "success",
  // });

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
    setLoginProgress(10);
    setUserName("");

    const progressInterval = setInterval(() => {
      setLoginProgress((prev) => {
        if (prev >= 85) return Math.min(95, prev + 1);
        return prev + (Math.random() * 8 + 3);
      });
    }, 150);

    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        clearInterval(progressInterval);
        setLoginProgress(0);

        setServerError(
          data.message || "Invalid credentials. Please try again.",
        );

        setIsLoading(false);
        return;
      }

      if (data.user?.isDeleted) {
        clearInterval(progressInterval);
        setLoginProgress(0);
        setServerError(
          "This account has been deactivated. Please contact the Faculty.",
        );
        setIsLoading(false);
        return;
      }

      const fullName = `${data.user.firstName} ${data.user.lastName}`;

      setLoginRole(data.role);
      setUserName(fullName);
      setLoginProgress(100);
      clearInterval(progressInterval);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        onLoginSuccess?.(data.user);
        if (data.role === "student") {
          navigate("/student/dashboard", { replace: true });
        } else {
          navigate("/faculty/dashboard", { replace: true });
        }
      }, 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setLoginProgress(0);
      setServerError("Cannot connect to server. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Left panel */}
        <div className={styles.formPanel}>
          <div className={styles.brand}>
            <img
              src={ccsBanner}
              alt="UC CCS Logo"
              className={styles.brandImg}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>

          <h1 className={styles.heading}>CCS Comprehensive Profiling Portal</h1>

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

            {serverError && (
              <div className={styles.serverError} role="alert">
                {serverError}
              </div>
            )}

            <div className={styles.forgotRow}>
              <a
                href="#"
                className={styles.forgotLink}
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPassword?.();
                }}
                style={{
                  opacity: isLoading ? 0.5 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
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
              disabled={isLoading}
            >
              LOGIN
            </AppButton>
          </form>

          <span className={styles.version}>v1.01</span>
        </div>

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

      {/* <AppToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
        duration={3000}
      /> */}

      <LoadingModal
        isVisible={isLoading}
        role={loginRole}
        progress={loginProgress}
        userName={userName}
      />
    </div>
  );
}
