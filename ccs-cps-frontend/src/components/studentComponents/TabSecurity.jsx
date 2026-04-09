import { useState } from "react";
import { FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import AppButton from "../../components/ui/AppButton";
import FloatableInput from "../../components/ui/FloatableInput";
import AppToast from "../../components/ui/AppToast";

function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#dc2626" };
  if (score <= 2) return { score, label: "Fair", color: "#d97706" };
  if (score <= 3) return { score, label: "Good", color: "#2563eb" };
  return { score, label: "Strong", color: "#16a34a" };
}

function getRequirements(password) {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least 1 number", met: /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export default function TabSecurity({ student }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ prev: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const strength = getStrength(form.next);
  const requirements = getRequirements(form.next);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.prev) e.prev = "Current password is required.";
    if (!form.next) e.next = "New password is required.";
    else if (form.next.length < 8) e.next = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.next))
      e.next = "Must contain at least 1 uppercase letter.";
    else if (!/[0-9]/.test(form.next))
      e.next = "Must contain at least 1 number.";
    else if (!/[^A-Za-z0-9]/.test(form.next))
      e.next = "Must contain at least 1 special character.";
    else if (form.next === form.prev)
      e.next = "New password must differ from the current one.";
    if (!form.confirm) e.confirm = "Please confirm your new password.";
    else if (form.next !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const id = user?._id;
    if (!id) {
      setToast({
        isVisible: true,
        message: "Unable to identify user. Please log in again.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/${id}/change-password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: form.prev,
            newPassword: form.next,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setErrors({ prev: data.message });
        else
          setToast({
            isVisible: true,
            message: data.message || "Something went wrong.",
            type: "error",
          });
        return;
      }
      setForm({ prev: "", next: "", confirm: "" });
      setErrors({});
      setToast({
        isVisible: true,
        message: "Password updated successfully!",
        type: "success",
      });
    } catch {
      setToast({
        isVisible: true,
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.tabWrapper}>
      {/* ── Account Security meta ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FaShieldAlt size={13} /> Account Security
          </span>
        </div>
        <div className={`${styles.infoGrid} ${styles.secMetaGrid}`}>
          <div className={styles.infoField}>
            <span className={styles.infoLabel}>Last Password Change</span>
            <span className={styles.infoValue}>
              {student?.lastPasswordChange ?? "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FaLock size={13} /> Change Password
          </span>
        </div>

        <div className={styles.secCard}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.secForm}>
              {/* Current password */}
              <div>
                <span className={styles.secFieldTitle}>Current Password</span>
                <FloatableInput
                  type="password"
                  label="Enter current password"
                  value={form.prev}
                  onChange={set("prev")}
                  error={errors.prev}
                />
              </div>

              <hr className={styles.secDivider} />

              {/* New password */}
              <div>
                <span className={styles.secFieldTitle}>New Password</span>
                <FloatableInput
                  type="password"
                  label="Enter new password"
                  value={form.next}
                  onChange={set("next")}
                  error={errors.next}
                />

                {form.next && (
                  <ul className={styles.secRequirements}>
                    {requirements.map((req) => (
                      <li
                        key={req.label}
                        className={styles.secRequirementItem}
                        style={{ color: req.met ? "#16a34a" : "#6b7280" }}
                      >
                        <span
                          className={styles.secRequirementDot}
                          style={{
                            background: req.met ? "#16a34a" : "#d1d5db",
                          }}
                        />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                )}

                {form.next && (
                  <div className={styles.secStrengthWrap}>
                    <div className={styles.secStrengthBar}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={styles.secStrengthSegment}
                          style={{
                            background:
                              n <= strength.score ? strength.color : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className={styles.secStrengthLabel}
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <span className={styles.secFieldTitle}>Confirm Password</span>
                <FloatableInput
                  type="password"
                  label="Re-enter password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  error={errors.confirm}
                />
                {form.confirm &&
                  form.next === form.confirm &&
                  !errors.confirm && (
                    <p className={styles.secMatch}>
                      <FaCheckCircle size={11} /> Passwords match
                    </p>
                  )}
              </div>
            </div>

            <div className={styles.secActions}>
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                disabled={loading}
              >
                Change Password
              </AppButton>
            </div>
          </form>
        </div>
      </div>

      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
