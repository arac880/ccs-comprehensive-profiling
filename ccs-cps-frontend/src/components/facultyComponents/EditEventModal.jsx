import React, { useState, useEffect } from "react";
import styles from "../../pages/facultyPages/facultyStyles/events.module.css";

const TYPES = ["Meeting", "Event", "Academic", "Assembly"];

const TYPE_BADGE = {
  Meeting: { bg: "#e65100", light: "#fff0e0", text: "#7a3800" },
  Event: { bg: "#2d7a3c", light: "#e6f4ea", text: "#1a4a24" },
  Academic: { bg: "#185fa5", light: "#e6f1fb", text: "#0c3a6b" },
  Assembly: { bg: "#666", light: "#f0f0f0", text: "#333" },
};

const TYPE_ICON = {
  Meeting: "bi-people-fill",
  Event: "bi-stars",
  Academic: "bi-mortarboard-fill",
  Assembly: "bi-megaphone-fill",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  type: "Event",
  driveLink: "",
};

const AddEventModal = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save event.");

      showToast?.("Event added successfully!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast?.(err.message || "Failed to add event.", "error");
    } finally {
      setLoading(false);
    }
  };

  const colors = TYPE_BADGE[form.type] || TYPE_BADGE.Assembly;
  const icon = TYPE_ICON[form.type] || "bi-calendar-event-fill";

  // Format preview date
  const previewDate = form.date
    ? new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Add New Event</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Event Type</label>
            <div className={styles.typePillsWrap}>
              {TYPES.map((type) => {
                const c = TYPE_BADGE[type];
                const active = form.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    className={styles.typePill}
                    style={
                      active
                        ? {
                            background: c.light,
                            color: c.text,
                            borderColor: c.bg,
                          }
                        : {}
                    }
                    onClick={() => setForm((prev) => ({ ...prev, type }))}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Title *</label>
              <input
                value={form.title}
                onChange={set("title")}
                placeholder="Event title"
              />
              {errors.title && (
                <span className={styles.errorMsg}>{errors.title}</span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={set("description")}
                placeholder="Description"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date *</label>
              <input type="date" value={form.date} onChange={set("date")} />
              {errors.date && (
                <span className={styles.errorMsg}>{errors.date}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Time</label>
              <input
                value={form.time}
                onChange={set("time")}
                placeholder="2:00 PM"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Location</label>
              <input
                value={form.location}
                onChange={set("location")}
                placeholder="Location"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Google Drive PDF Link</label>
              <input
                value={form.driveLink}
                onChange={set("driveLink")}
                placeholder="Google Drive link"
              />
            </div>
          </div>

          {/* Full Preview Strip */}
          <div
            className={styles.previewStrip}
            style={{
              borderLeftColor: colors.bg,
              background: colors.light,
              alignItems: "flex-start",
            }}
          >
            <div className={styles.previewInfo}>
              <span
                className={styles.previewTitle}
                style={{ color: colors.text }}
              >
                {form.title || "Event title preview"}
              </span>
              <div className={styles.previewMeta}>
                {previewDate && (
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    <i className="bi bi-calendar3" /> {previewDate}
                  </span>
                )}
                {form.time && (
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    <i className="bi bi-clock" /> {form.time}
                  </span>
                )}
                {form.location && (
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    <i className="bi bi-geo-alt" /> {form.location}
                  </span>
                )}
                {form.description && (
                  <span
                    style={{
                      color: colors.text,
                      opacity: 0.7,
                      fontStyle: "italic",
                    }}
                  >
                    {form.description.length > 60
                      ? form.description.slice(0, 60) + "…"
                      : form.description}
                  </span>
                )}
                {form.driveLink && (
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    <i className="bi bi-file-earmark-pdf-fill" /> PDF attached
                  </span>
                )}
              </div>
            </div>
            <span
              className={styles.badge}
              style={{
                background: "#fff",
                color: colors.text,
                border: `1px solid ${colors.bg}55`,
                alignSelf: "flex-start",
                whiteSpace: "nowrap",
              }}
            >
              {form.type}
            </span>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className="bi bi-check2-circle" />
            {loading ? "Saving..." : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
