import React, { useState, useEffect } from "react";
import styles from "../../pages/facultyPages/facultyStyles/schedule.module.css";
import {
  FaBook,
  FaChalkboardUser,
  FaLaptopCode,
  FaClock,
  FaLocationDot,
  FaUserGroup,
  FaClipboardList,
} from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import AddScheduleModal from "../../components/facultyComponents/AddScheduleModal";
import AppButton from "../../components/ui/AppButton";
import AppToast from "../../components/ui/AppToast";
import SubjectDetailPage from "../../pages/facultyPages/SubjectDetailPage";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMES = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

const DAYS = [
  { short: "MON", full: "Monday" },
  { short: "TUE", full: "Tuesday" },
  { short: "WED", full: "Wednesday" },
  { short: "THU", full: "Thursday" },
  { short: "FRI", full: "Friday" },
];

const LEGEND = [
  { label: "Lecture", color: "#c0390a" },
  { label: "Laboratory", color: "#d97706" },
  { label: "Seminar", color: "#185fa5" },
];

const TYPE_META = {
  Lecture: { icon: <FaBook size={18} />, bg: "#fde8e8", color: "#c0390a" },
  Seminar: {
    icon: <FaChalkboardUser size={18} />,
    bg: "#e6f1fb",
    color: "#185fa5",
  },
  Laboratory: {
    icon: <FaLaptopCode size={18} />,
    bg: "#fff0e0",
    color: "#d97706",
  },
  Applied: {
    icon: <FaLaptopCode size={18} />,
    bg: "#fff0e0",
    color: "#e65100",
  },
};

const TYPE_COLOR = {
  Lecture: "blockRed",
  Seminar: "blockBlue",
  Laboratory: "blockAmber",
  Applied: "blockAmber",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getFacultyIdFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const id = parsed?._id ?? parsed?.id ?? parsed?.facultyId ?? null;
    if (!id || id === "null" || id === "undefined") return null;
    return String(id);
  } catch {
    return null;
  }
};

const getUserRole = () => {
  try {
    return localStorage.getItem("role");
  } catch {
    return null;
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
const FacultySchedule = () => {
  const facultyId = getFacultyIdFromStorage();
  const userRole = getUserRole();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // ── Fetch schedules ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!facultyId) {
      console.warn(
        "No valid facultyId found in localStorage. User object:",
        JSON.parse(localStorage.getItem("user") || "{}"),
      );
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/schedules/faculty/${facultyId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mapped = Array.isArray(data)
          ? data.map((s) => ({
              ...s,
              color: TYPE_COLOR[s.type] ?? "blockBlue",
              timeLabel: `${TIMES[s.start]} – ${TIMES[s.start + s.span] ?? "End"}`,
            }))
          : [];
        setClasses(mapped);
      })
      .catch((err) => {
        console.error("Schedule fetch error:", err);
        showToast("Failed to load schedules. Please refresh.", "error");
      })
      .finally(() => setLoading(false));
  }, [facultyId]);

  // ── Toast helpers ───────────────────────────────────────────────────────────
  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });

  const closeToast = () => setToast((t) => ({ ...t, isVisible: false }));

  // ── Handle save from AddScheduleModal ──────────────────────────────────────
  const handleAddSave = (newEntry) => {
    const entryFacultyId = String(newEntry.facultyId ?? "");
    const currentFacultyId = String(facultyId ?? "");

    if (entryFacultyId === currentFacultyId) {
      setClasses((prev) => [
        ...prev,
        {
          ...newEntry,
          color: TYPE_COLOR[newEntry.type] ?? "blockBlue",
          timeLabel: `${TIMES[newEntry.start]} – ${TIMES[newEntry.start + newEntry.span] ?? "End"}`,
        },
      ]);
    }

    setShowAddModal(false);
    showToast(`"${newEntry.title}" schedule added successfully!`, "success");
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalClasses = classes.length;
  const uniqueSubjects = new Set(classes.map((c) => c.title)).size;
  const classesPerDay = DAYS.map(
    (_, i) => classes.filter((c) => c.day === i).length,
  );

  // ── Navigate to subject detail page ────────────────────────────────────────
  if (selectedSubject) {
    return (
      <SubjectDetailPage
        cls={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.pageContent}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <i className="bi bi-calendar3" />
          </div>
          <div className={styles.headingWrap}>
            <h2 className={styles.pageHeading}>My Schedule</h2>
            <span className={styles.pageSubheading}>
              A.Y. 2024–2025 · 2nd Semester
            </span>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>{totalClasses}</span>
            <span className={styles.headerStatLbl}>Classes</span>
          </div>
          <div className={styles.headerStatDiv} />
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>{uniqueSubjects}</span>
            <span className={styles.headerStatLbl}>Subjects</span>
          </div>

          {(userRole === "dean" || userRole === "chair") && (
            <AppButton
              variant="primary"
              onClick={() => setShowAddModal(true)}
              style={{ marginLeft: 12 }}
            >
              <FiPlus size={16} /> Add Schedule
            </AppButton>
          )}
        </div>
      </div>

      {/* ── No facultyId warning ── */}
      {!loading && !facultyId && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 24px",
            color: "#c0390a",
          }}
        >
          <i
            className="bi bi-exclamation-triangle"
            style={{ fontSize: 32, display: "block", marginBottom: 8 }}
          />
          <div style={{ fontWeight: 600 }}>Session error</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Could not read your account ID. Please log out and log in again.
          </div>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "40px 0",
            color: "#a8917f",
            fontSize: 14,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              border: "2.5px solid #fde0cc",
              borderTop: "2.5px solid #e8641a",
              borderRadius: "50%",
              animation: "spin 0.75s linear infinite",
            }}
          />
          Loading your schedule…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Schedule Card ── */}
      {!loading && facultyId && (
        <div className={styles.scheduleCard}>
          {/* Sticky day-header row */}
          <div className={styles.stickyHeader}>
            <div className={styles.schedTimeHeader}>
              <span>TIME</span>
            </div>
            {DAYS.map((d, i) => (
              <div key={d.short} className={styles.schedColHeader}>
                <span className={styles.colHeaderShort}>{d.short}</span>
                <span className={styles.colHeaderFull}>{d.full}</span>
                {classesPerDay[i] > 0 && (
                  <span className={styles.colHeaderBadge}>
                    {classesPerDay[i]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Scrollable grid */}
          <div className={styles.scheduleScrollArea}>
            <div className={styles.scheduleGrid}>
              {TIMES.map((time, row) => (
                <React.Fragment key={time}>
                  <div className={styles.schedTimeCell}>
                    <span className={styles.timeLabelText}>{time}</span>
                    <div className={styles.timeTickLine} />
                  </div>

                  {[0, 1, 2, 3, 4].map((col) => {
                    const cls = classes.find(
                      (c) => c.day === col && c.start === row,
                    );
                    const isCovered = classes.some(
                      (c) =>
                        c.day === col &&
                        c.start < row &&
                        c.start + (c.span || 1) > row,
                    );
                    if (isCovered) return null;

                    return (
                      <div
                        key={col}
                        className={styles.schedCell}
                        style={
                          cls?.span > 1 ? { gridRow: `span ${cls.span}` } : {}
                        }
                      >
                        {cls && (
                          <div
                            className={`${styles.schedBlock} ${styles[cls.color]}`}
                            onClick={() => setSelectedSubject(cls)}
                          >
                            <div className={styles.schedBlockInner}>
                              <div className={styles.schedBlockType}>
                                {cls.type}
                              </div>
                              <div className={styles.schedBlockTitle}>
                                {cls.title}
                              </div>
                              <div className={styles.schedBlockMeta}>
                                <span className={styles.schedBlockGroup}>
                                  {cls.sub}
                                </span>
                                <span className={styles.schedBlockRoom}>
                                  <i className="bi bi-geo-alt-fill" />{" "}
                                  {cls.room}
                                </span>
                              </div>
                              {cls.span > 1 && (
                                <div className={styles.schedBlockDuration}>
                                  {cls.span} hr{cls.span > 1 ? "s" : ""}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && facultyId && classes.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "#a8917f",
          }}
        >
          <i
            className="bi bi-calendar-x"
            style={{
              fontSize: 40,
              display: "block",
              marginBottom: 10,
              color: "#fde0cc",
            }}
          />
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#6b5a4e",
              marginBottom: 4,
            }}
          >
            No schedules yet
          </div>
          <div style={{ fontSize: 13 }}>
            Click <strong>Add Schedule</strong> to assign your first class.
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div className={styles.footer}>
        <div className={styles.legend}>
          {LEGEND.map((l) => (
            <div key={l.label} className={styles.legendItem}>
              <div
                className={styles.legendDot}
                style={{ background: l.color }}
              />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
        <span className={styles.footerNote}>
          <i className="bi bi-info-circle" /> Scroll to view full day · 7:00 AM
          – 9:00 PM
        </span>
      </div>

      {/* ── Add Schedule Modal ── */}
      {showAddModal && (
        <AddScheduleModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSave}
          onSaveError={(msg) => showToast(msg, "error")}
        />
      )}

      {/* ── Toast ── */}
      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        duration={3500}
      />
    </div>
  );
};

export default FacultySchedule;
