import React, { useState, useEffect, useCallback } from "react";
import styles from "../../pages/facultyPages/facultyStyles/events.module.css";
import AddEventModal from "../../components/facultyComponents/AddEventModal";
import EditEventModal from "../../components/facultyComponents/EditEventModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import AppToast from "../../components/ui/AppToast";

const FILTERS = ["All", "Meeting", "Event", "Academic", "Assembly"];

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

function getDriveFileName(link) {
  if (!link) return "View PDF";
  try {
    const match = link.match(/\/d\/(.*?)\//);
    if (match && match[1]) return `PDF File (${match[1].slice(0, 6)})`;
    return "View PDF";
  } catch {
    return "View PDF";
  }
}

function getDrivePreviewLink(link) {
  if (!link) return "";
  const match = link.match(/\/d\/(.*?)\//);
  if (match && match[1])
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  return link;
}

/* ── Main Page ── */
const FacultyEvents = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewLink, setPreviewLink] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const role = localStorage.getItem("role");
  const canAdd = role === "dean" || role === "chair";

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      showToast("Failed to load events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${deleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed.");

      setConfirmOpen(false);
      setDeleteId(null);
      showToast("Event deleted successfully.", "success");
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Failed to delete event.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* Toast */}
      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        duration={3500}
      />

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

                  <div className={styles.eventActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => setSelectedEvent(e)}
                    >
                      <i className="bi bi-pencil-square" /> Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setDeleteId(e._id);
                        setConfirmOpen(true);
                      }}
                    >
                      <i className="bi bi-trash-fill" /> Delete
                    </button>
                  </div>
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
        showToast={showToast}
      />

      <EditEventModal
        isOpen={!!selectedEvent}
        editData={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={fetchEvents}
        showToast={showToast}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        isProcessing={isDeleting}
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
