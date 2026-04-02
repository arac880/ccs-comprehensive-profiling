// components/studentComponents/TabSecurity.jsx
import { useState } from "react";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import AppButton from "../../components/ui/AppButton";

/* ══════════════════════════════════════
   PASSWORD STRENGTH HELPER
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   FIELD WITH SHOW / HIDE TOGGLE
══════════════════════════════════════ */
function PasswordField({ id, label, value, onChange, placeholder, hint }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.secField}>
      <label htmlFor={id} className={styles.secLabel}>
        {label}
      </label>
      <div className={styles.secInputWrap}>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.secInput}
          autoComplete="off"
        />
        <button
          type="button"
          className={styles.secToggle}
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      </div>
      {hint && <p className={styles.secHint}>{hint}</p>}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function TabSecurity({ student }) {
  const [form, setForm] = useState({
    prev: "",
    next: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.next);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
    setSuccess(false);
  };

  const validate = () => {
    const e = {};
    if (!form.prev) e.prev = "Current password is required.";
    if (!form.next) e.next = "New password is required.";
    else if (form.next.length < 8)
      e.next = "Password must be at least 8 characters.";
    else if (form.next === form.prev)
      e.next = "New password must differ from the current one.";
    if (!form.confirm) e.confirm = "Please confirm your new password.";
    else if (form.next !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ prev: "", next: "", confirm: "" });
    }, 1200);
  };

  return (
    <div className={styles.secRoot}>
      {/* ── Section header ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FaShieldAlt size={12} />
            Account Security
          </span>
        </div>

        {/* Account meta info */}
        <div className={`${styles.infoGrid} ${styles.secMetaGrid}`}>
          <div className={styles.infoField}>
            <span className={styles.infoLabel}>Last Password Change</span>
            <span className={styles.infoValue}>
              {student?.lastPasswordChange ?? "N/A"}
            </span>
          </div>
          <div className={styles.infoField}>
            <span className={styles.infoLabel}>Account Status</span>
            <span className={`${styles.badge} ${styles.badgeGreen}`}>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Change Password card ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FaLock size={12} />
            Change Password
          </span>
        </div>

        <div className={styles.secCard}>
          {/* Success banner */}
          {success && (
            <div className={styles.secSuccess}>
              <FaCheckCircle size={15} />
              Password updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.secForm}>
              {/* Current password */}
              <div>
                <PasswordField
                  id="sec-prev"
                  label="Current Password"
                  value={form.prev}
                  onChange={set("prev")}
                  placeholder="Enter your current password"
                />
                {errors.prev && (
                  <p className={styles.secError}>{errors.prev}</p>
                )}
              </div>

              {/* Divider */}
              <hr className={styles.secDivider} />

              {/* New password */}
              <div>
                <PasswordField
                  id="sec-next"
                  label="New Password"
                  value={form.next}
                  onChange={set("next")}
                  placeholder="Enter your new password"
                />

                {/* Strength meter — shown only when typing */}
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

                {errors.next && (
                  <p className={styles.secError}>{errors.next}</p>
                )}

                {/* Requirements */}
                <ul className={styles.secReqs}>
                  <li className={form.next.length >= 8 ? styles.secReqMet : ""}>
                    At least 8 characters
                  </li>
                  <li
                    className={/[A-Z]/.test(form.next) ? styles.secReqMet : ""}
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={/[0-9]/.test(form.next) ? styles.secReqMet : ""}
                  >
                    One number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(form.next) ? styles.secReqMet : ""
                    }
                  >
                    One special character
                  </li>
                </ul>
              </div>

              {/* Confirm password */}
              <div>
                <PasswordField
                  id="sec-confirm"
                  label="Confirm New Password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Re-enter your new password"
                />
                {errors.confirm && (
                  <p className={styles.secError}>{errors.confirm}</p>
                )}
                {form.confirm &&
                  form.next === form.confirm &&
                  !errors.confirm && (
                    <p className={styles.secMatch}>
                      <FaCheckCircle size={11} /> Passwords match
                    </p>
                  )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.secActions}>
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                disabled={loading}
              >
                Update Password
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
