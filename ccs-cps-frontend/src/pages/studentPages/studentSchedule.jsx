import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaRegClock,
  FaMugHot,
} from "react-icons/fa";

import schedStyles from "./studentStyles/schedule.module.css";
import layoutStyles from "./studentStyles/dashboard.module.css";
import SubjectDetailPage from "../../pages/facultyPages/SubjectDetailPage"; // ← import

// ─── Constants ────────────────────────────────────────────────────────────────
const MOBILE_BREAKPOINT = 992;

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_NUM_TO_STR = {
  0: "MONDAY",
  1: "TUESDAY",
  2: "WEDNESDAY",
  3: "THURSDAY",
  4: "FRIDAY",
  5: "SATURDAY",
  6: "SUNDAY",
};

const SLOT_TO_HOUR = (slot) => 7 + Number(slot);

const DAY_MAP_JS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

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
];

const PALETTE = [
  "#4A90E2",
  "#E65100",
  "#43A047",
  "#8E44AD",
  "#009688",
  "#D32F2F",
  "#F39C12",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStudentFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatTime = (hour, min = 0) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  const m = min === 0 ? "00" : min < 10 ? `0${min}` : `${min}`;
  return `${h12}:${m} ${ampm}`;
};

const getEndTime = (startHour, durationHours) => {
  return formatTime(startHour + Number(durationHours), 0);
};

// Map raw MongoDB Schedule doc → shape this component uses
const normalizeSchedule = (s) => ({
  ...s, // keep all original fields (section, program, year, etc.)
  day: DAY_NUM_TO_STR[Number(s.day)] ?? "MONDAY",
  dayNum: Number(s.day),
  startHour: SLOT_TO_HOUR(s.start),
  duration: Number(s.span) ?? 1,
  course: s.subjectCode ?? "",
  title: s.title ?? "",
  room: s.room ?? "",
  instructor: s.facultyName ?? "",
  type: s.type ?? "Lecture",
  sub: s.sub ?? "",
  // timeLabel needed by SubjectDetailPage
  timeLabel: `${TIMES[s.start]} – ${TIMES[s.start + Number(s.span)] ?? "End"}`,
});

// getInitialDay — jump to nearest day with class
const getInitialDay = (data) => {
  const JS_TO_DB = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  const DB_TO_DAYSTR = DAY_NUM_TO_STR;
  const todayDb = JS_TO_DB[new Date().getDay()];
  const daysWithClass = [
    ...new Set(
      data.map((s) => {
        const raw = localStorage.getItem("user");
        const parsed = raw ? JSON.parse(raw) : null;
        return Number(parsed ? (s.dayNum ?? 0) : 0);
      }),
    ),
  ];

  // simpler — just use the already-normalized day string
  const dayStrings = [...new Set(data.map((s) => s.day))];
  const DB_TO_IDX = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
  };
  const JS_DAY_TO_DB_STR = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };
  const todayStr = JS_DAY_TO_DB_STR[new Date().getDay()];

  // Find closest day starting from today
  const ordered = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const todayIdx = ordered.indexOf(todayStr);
  for (let i = 0; i < 7; i++) {
    const check = ordered[(todayIdx + i) % 7];
    if (dayStrings.includes(check)) return check;
  }
  return "MONDAY";
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudentSchedule() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(
    DAY_MAP_JS[new Date().getDay()] || "MONDAY",
  );
  const [selectedSubject, setSelectedSubject] = useState(null); // ← new

  const student = getStudentFromStorage();
  const section = student?.section ?? null;

  // ── Responsive ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Fetch schedules by section ──────────────────────────────────────────────
  useEffect(() => {
    if (!section) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/schedules/section/${encodeURIComponent(section)}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map(normalizeSchedule) : [];
        setScheduleData(mapped);
        setActiveDay(getInitialDay(mapped));
      })
      .catch((err) => {
        console.error("[StudentSchedule] Error:", err);
        setError("Failed to load your schedule. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [section]);

  // ── If subject selected, show detail page ──────────────────────────────────
  if (selectedSubject) {
    return (
      <SubjectDetailPage
        cls={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const uniqueCourses = [...new Set(scheduleData.map((c) => c.course))];
  const courseColors = Object.fromEntries(
    uniqueCourses.map((course, i) => [course, PALETTE[i % PALETTE.length]]),
  );

  const todaysClasses = scheduleData
    .filter((c) => c.day === activeDay)
    .sort((a, b) => a.startHour - b.startHour);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main
      className={isMobile ? layoutStyles.mobileMain : layoutStyles.mainContent}
    >
      <div className={schedStyles.scheduleContainer}>
        {/* Header */}
        <div className={schedStyles.pageHeader}>
          <div className={schedStyles.titleWrapper}>
            <div className={schedStyles.iconBox}>
              <FaCalendarAlt size={18} color="#ffffff" />
            </div>
            <h2 className={schedStyles.pageTitle}>Daily Class Schedule</h2>
          </div>
          <div className={schedStyles.headerControls}>
            <div className={schedStyles.headerNote}>
              Class Section: <strong>{section ?? "—"}</strong>
            </div>
          </div>
        </div>

        {/* No section */}
        {!loading && !section && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              color: "#c0390a",
            }}
          >
            <div style={{ fontWeight: 600 }}>Session error</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Could not read your section. Please log out and log in again.
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "48px 0",
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

        {/* Error */}
        {!loading && error && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              color: "#c0390a",
            }}
          >
            <div style={{ fontWeight: 600 }}>{error}</div>
          </div>
        )}

        {/* Agenda widget */}
        {!loading && section && !error && (
          <div className={schedStyles.agendaWidget}>
            {/* Day picker */}
            <div className={schedStyles.dayNavScroll}>
              <div className={schedStyles.dayNav}>
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`${schedStyles.dayBtn} ${activeDay === day ? schedStyles.activeDayBtn : ""}`}
                  >
                    <span className={schedStyles.dayNameFull}>{day}</span>
                    <span className={schedStyles.dayNameShort}>
                      {day.substring(0, 3)}
                    </span>
                    {scheduleData.some((c) => c.day === day) && (
                      <span className={schedStyles.classIndicatorDot} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className={schedStyles.agendaContent}>
              {todaysClasses.length > 0 ? (
                <div className={schedStyles.timeline}>
                  {todaysClasses.map((cls, idx) => {
                    const mainColor = courseColors[cls.course] ?? PALETTE[0];
                    const startTime = formatTime(cls.startHour);
                    const endTime = getEndTime(cls.startHour, cls.duration);

                    return (
                      <div
                        key={idx}
                        className={schedStyles.timelineRow}
                        onClick={() => setSelectedSubject(cls)} // ← click to open detail
                        style={{ cursor: "pointer" }}
                      >
                        {/* Time */}
                        <div className={schedStyles.timeTrack}>
                          <span className={schedStyles.timeStart}>
                            {startTime}
                          </span>
                          <span className={schedStyles.timeEnd}>{endTime}</span>
                        </div>

                        {/* Node */}
                        <div className={schedStyles.nodeTrack}>
                          <div className={schedStyles.nodeLine} />
                          <div
                            className={schedStyles.nodeDot}
                            style={{ borderColor: mainColor }}
                          />
                        </div>

                        {/* Card */}
                        <div className={schedStyles.cardTrack}>
                          <div
                            className={schedStyles.agendaCard}
                            style={{
                              background: `linear-gradient(${hexToRgba(mainColor, 0.08)}, ${hexToRgba(mainColor, 0.08)}), #ffffff`,
                              borderLeft: `4px solid ${mainColor}`,
                              borderTop: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                              borderRight: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                              borderBottom: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                            }}
                          >
                            <div className={schedStyles.cardHeaderRow}>
                              <span
                                className={schedStyles.courseCode}
                                style={{ color: mainColor }}
                              >
                                {cls.course}
                              </span>
                              <span
                                className={
                                  cls.type === "Laboratory"
                                    ? schedStyles.tagLab
                                    : schedStyles.tagLec
                                }
                                style={{
                                  color: mainColor,
                                  backgroundColor:
                                    cls.type === "Laboratory"
                                      ? "#fff"
                                      : hexToRgba(mainColor, 0.15),
                                  borderColor: mainColor,
                                }}
                              >
                                {cls.type === "Laboratory" ? "LAB" : "LEC"}
                              </span>
                            </div>

                            <h3 className={schedStyles.courseTitle}>
                              {cls.title}
                            </h3>

                            <div className={schedStyles.cardMetaRow}>
                              <div className={schedStyles.metaItem}>
                                <FaRegClock color={mainColor} /> {cls.duration}{" "}
                                Hour{cls.duration !== 1 ? "s" : ""}
                              </div>
                              <div className={schedStyles.metaItem}>
                                <FaMapMarkerAlt color={mainColor} /> {cls.room}
                              </div>
                              <div className={schedStyles.metaItem}>
                                <FaUserTie color={mainColor} /> {cls.instructor}
                              </div>
                            </div>

                            {/* View detail hint */}
                            <div
                              style={{
                                fontSize: 11,
                                color: mainColor,
                                marginTop: 6,
                                opacity: 0.7,
                              }}
                            >
                              Tap to view subject details →
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={schedStyles.emptyState}>
                  <div className={schedStyles.emptyIconWrap}>
                    <FaMugHot size={32} />
                  </div>
                  <h3 className={schedStyles.emptyTitle}>Free Day!</h3>
                  <p className={schedStyles.emptyText}>
                    You have no classes on{" "}
                    {activeDay.charAt(0) + activeDay.slice(1).toLowerCase()}.
                    Enjoy your break!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
