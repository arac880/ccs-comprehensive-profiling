// components/facultyComponents/FacultyTabSecurity.jsx
import { useState, useEffect } from "react";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import AppToast from "../../components/ui/AppToast";

function Field({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || "—"}</span>
    </div>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>{title}</div>
      </div>
      <div className={styles.infoGrid}>{children}</div>
    </div>
  );
}

export default function FacultyTabSecurity() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [faculty, setFaculty] = useState(user || null);
  const [loading, setLoading] = useState(!user);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      const id = user?._id;
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/faculty/${id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setFaculty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setToast({
        isVisible: true,
        message: "New passwords do not match.",
        type: "error",
      });
      return;
    }
    if (form.newPassword.length < 6) {
      setToast({
        isVisible: true,
        message: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const id = faculty?._id;
      const res = await fetch(
        `http://localhost:5000/api/faculty/${id}/change-password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setToast({
        isVisible: true,
        message: "Password changed successfully.",
        type: "success",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setToast({ isVisible: true, message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className={styles.section}>
        <div className={styles.loadingState}>Loading security info…</div>
      </div>
    );

  return (
    <div className={styles.tabWrapper}>
      {/* ── Account Info ── */}
      <SectionBlock title="Account Information">
        <Field label="Email Address" value={faculty?.email} />
        <Field
          label="Last Password Change"
          value={faculty?.lastPasswordChange ?? "Never"}
        />
        <Field
          label="Two-Factor Auth"
          value={faculty?.twoFAEnabled ? "Enabled" : "Disabled"}
        />
      </SectionBlock>

      {/* ── Change Password ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Change Password</div>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 420,
          }}
        >
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 6,
              padding: "10px 28px",
              background: submitting ? "#ffb74d" : "#e65100",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontFamily: "var(--font-ui, sans-serif)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: submitting ? "not-allowed" : "pointer",
              alignSelf: "flex-start",
              transition: "background 0.18s",
            }}
          >
            {submitting ? "Saving…" : "Update Password"}
          </button>
        </form>
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

/* ── Password input helper ── */
function PasswordField({ label, name, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontFamily: "var(--font-ui, sans-serif)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--text-muted, #b07050)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: "10px 40px 10px 14px",
            borderRadius: 10,
            border: "1.5px solid var(--border, #edd8ca)",
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "0.9rem",
            color: "var(--text-dark, #2d1f15)",
            background: "var(--cream, #fdf6f0)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted, #b07050)",
            fontSize: "0.85rem",
            padding: 0,
          }}
        >
          <i className={show ? "bi bi-eye-slash" : "bi bi-eye"} />
        </button>
      </div>
    </div>
  );
}
