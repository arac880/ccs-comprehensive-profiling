import React, { useState, useEffect } from "react";
import styles from "../../pages/facultyPages/facultyStyles/events.module.css";

const FILTERS = ["All", "Meeting", "Event",  "Academic", "Assembly"];
const TYPES = ["Meeting", "Event",  "Academic", "Assembly"];

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

function getDriveFileName(link) {
  if (!link) return "View PDF";

  try {
    // If filename exists in URL (rare)
    const url = new URL(link);

    // fallback: generic name with ID
    const match = link.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `PDF File (${match[1].slice(0, 6)})`;
    }

    return "View PDF";
  } catch {
    return "View PDF";
  }
}

function getDrivePreviewLink(link) {
  if (!link) return "";

  const match = link.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  return link; // fallback
}

/* ── Add Event Modal ── */
function AddEventModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setServerError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save event.");
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const colors = TYPE_BADGE[form.type] || TYPE_BADGE.Assembly;

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
          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          {/* Type pills */}
          <div className={styles.formGroup}>
            <label>Event Type</label>
            <div className={styles.typePillsWrap}>
              {TYPES.map((t) => {
                const c = TYPE_BADGE[t];
                const active = form.type === t;
                return (
                  <button
                    key={t}
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
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>
                Title <span style={{ color: "#c0390a" }}>*</span>
              </label>
              <input
                placeholder="e.g. CCS Department Meeting"
                className={errors.title ? styles.inputError : ""}
                value={form.title}
                onChange={set("title")}
              />
              {errors.title && (
                <span className={styles.errorMsg}>{errors.title}</span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description</label>
              <textarea
                placeholder="Briefly describe the event..."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Date <span style={{ color: "#c0390a" }}>*</span>
              </label>
              <input
                type="date"
                className={errors.date ? styles.inputError : ""}
                value={form.date}
                onChange={set("date")}
              />
              {errors.date && (
                <span className={styles.errorMsg}>{errors.date}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Time</label>
              <input
                placeholder="e.g. 2:00 PM – 4:00 PM"
                value={form.time}
                onChange={set("time")}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Location</label>
              <input
                placeholder="e.g. Conference Room 2"
                value={form.location}
                onChange={set("location")}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Google Drive PDF Link</label>
            <input
              placeholder="Paste Google Drive share link..."
              value={form.driveLink}
              onChange={set("driveLink")}
            />
          </div>

          {/* Live preview */}
          <div
            className={styles.previewStrip}
            style={{ borderLeftColor: colors.bg, background: colors.light }}
          >
            <span
              className={styles.previewTitle}
              style={{ color: colors.text }}
            >
              {form.title || "Event title preview"}
            </span>
            <span className={styles.previewMeta} style={{ color: colors.text }}>
              {form.date || "Date"}
              {form.time ? ` · ${form.time}` : ""}
              {form.location ? ` · ${form.location}` : ""}
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
            <i className="bi bi-calendar-plus-fill" />
            {loading ? "Saving..." : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const FacultyEvents = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewLink, setPreviewLink] = useState(null);

  const role = localStorage.getItem("role");
  const canAdd = role === "dean" || role === "chair";

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    const matchFilter = activeFilter === "All" || e.type === activeFilter;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className={styles.pageContent}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <i className="bi bi-calendar-event-fill" />
          </div>
          <div className={styles.headingWrap}>
            <h2 className={styles.pageHeading}>Events</h2>
            <span className={styles.pageSubheading}>
              A.Y. 2024–2025 · 2nd Semester
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          {canAdd && (
            <button
              className={styles.addEventBtn}
              onClick={() => setModalOpen(true)}
            >
              <i className="bi bi-plus-lg" /> Add Event
            </button>
          )}
          <div className={styles.searchWrapper}>
            <i className={`bi bi-search ${styles.searchIcon}`} />
            <input
              className={styles.searchInput}
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
        <span className={styles.filterCount}>
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Events List */}
      {loading ? (
        <div className={styles.emptyState}>
          <p>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="bi bi-calendar-x" />
          <p>No events found.</p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {filtered.map((e, i) => {
            const colors = TYPE_BADGE[e.type] || TYPE_BADGE.Assembly;
            const icon =
              e.icon || TYPE_ICON[e.type] || "bi-calendar-event-fill";
            return (
              <div key={e._id || i} className={styles.eventCard}>
                <div
                  className={styles.eventDateCol}
                  style={{
                    "--ev-accent": colors.bg,
                    "--ev-light": colors.light,
                  }}
                >
                  <div className={styles.eventIconCircle}>
                    <i className={`bi ${icon}`} />
                  </div>
                  <div className={styles.eventDateDay}>{e.day}</div>
                  <div className={styles.eventDateMon}>{e.month}</div>
                  <div className={styles.eventDateYear}>{e.year}</div>
                </div>

                <div className={styles.eventBody}>
                  <div className={styles.eventTop}>
                    <div className={styles.eventTitleRow}>
                      <h3 className={styles.eventTitle}>{e.title}</h3>
                      <span
                        className={styles.badge}
                        style={{
                          background: colors.light,
                          color: colors.text,
                          border: `1px solid ${colors.bg}33`,
                        }}
                      >
                        {e.type}
                      </span>
                    </div>
                    <p className={styles.eventDesc}>{e.description}</p>
                  </div>
                  <div className={styles.eventMeta}>
                    <span
                      className={styles.eventMetaItem}
                      style={{ "--meta-color": colors.bg }}
                    >
                      <i className="bi bi-clock-fill" /> {e.time}
                    </span>
                    <span
                      className={styles.eventMetaItem}
                      style={{ "--meta-color": colors.bg }}
                    >
                      <i className="bi bi-geo-alt-fill" /> {e.location}
                    </span>
                  </div>

                  {e.driveLink && (
                    <button
                      className={styles.previewBtn}
                      onClick={() =>
                        setPreviewLink(getDrivePreviewLink(e.driveLink))
                      }
                    >
                      <i className="bi bi-file-earmark-pdf-fill" />
                      <span className={styles.previewText}>
                        {getDriveFileName(e.driveLink)}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchEvents}
      />

      {previewLink && (
        <div
          className={styles.pdfModalOverlay}
          onClick={() => setPreviewLink(null)}
        >
          <div
            className={styles.pdfModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.pdfHeader}>
              <span className={styles.pdfTitle}>PDF Preview</span>
              <button
                className={styles.pdfCloseBtn}
                onClick={() => setPreviewLink(null)}
              >
                ✕
              </button>
            </div>

            <iframe src={previewLink} className={styles.pdfFrame} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;
