import React, { useState } from "react";
import styles from "../../pages/facultyPages/facultyStyles/events.module.css";

const EVENTS = [

  {
    day: 28,
    month: "MAR",
    year: 2025,
    title: "CCS Department Meeting",
    desc: "Quarterly department meeting to discuss academic performance, concerns, and upcoming events.",
    time: "2:00 PM – 4:00 PM",
    loc: "Conference Room 2",
    type: "Meeting",
    badge: "badgeAmber",
    icon: "bi-people-fill",
  },
  {
    day: 3,
    month: "APR",
    year: 2025,
    title: "Students' Recognition Day",
    desc: "Awarding ceremony for academic achievers, student leaders, and outstanding organizations.",
    time: "9:00 AM – 12:00 PM",
    loc: "University Gymnasium",
    type: "Event",
    badge: "badgeGreen",
    icon: "bi-trophy-fill",
  },
  {
    day: 10,
    month: "APR",
    year: 2025,
    title: "Mid-Semester Grade Submission Deadline",
    desc: "All mid-semester grades must be encoded and submitted via the Online Faculty Portal before 11:59 PM.",
    time: "All Day",
    loc: "Online Portal",
    type: "Deadline",
    badge: "badgeRed",
    icon: "bi-exclamation-circle-fill",
  },

  {
    day: 22,
    month: "APR",
    year: 2025,
    title: "End-of-Semester Faculty Assembly",
    desc: "Final assembly before semester closeout. Discussion of final grades, clearance, and summer plans.",
    time: "3:00 PM – 5:00 PM",
    loc: "Auditorium",
    type: "Assembly",
    badge: "badgeDefault",
    icon: "bi-megaphone-fill",
  },
];

const FILTERS = [
  "All",
  "Meeting",
  "Event",
  "Deadline",
  "Academic",
  "Assembly",
];

const BADGE_COLORS = {
  badgeBlue: { bg: "#185fa5", light: "#e6f1fb", text: "#0c3a6b" },
  badgeAmber: { bg: "#e65100", light: "#fff0e0", text: "#7a3800" },
  badgeGreen: { bg: "#2d7a3c", light: "#e6f4ea", text: "#1a4a24" },
  badgeRed: { bg: "#c0390a", light: "#fde8e8", text: "#7b1a00" },
  badgeDefault: { bg: "#666", light: "#f0f0f0", text: "#333" },
};

const FacultyEvents = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = EVENTS.filter((e) => {
    const matchFilter = activeFilter === "All" || e.type === activeFilter;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.loc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const upcoming = EVENTS.filter(
    (e) => e.day >= 10 && e.month === "APR",
  ).length;
  const thisMonth = EVENTS.filter((e) => e.month === "APR").length;

  return (
    <div className={styles.pageContent}>
      {/* ── Page Header ── */}
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
         
          {/* Search */}
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

      {/* ── Filter Tabs ── */}
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

      {/* ── Events List ── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="bi bi-calendar-x" />
          <p>No events match your search.</p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {filtered.map((e, i) => {
            const colors = BADGE_COLORS[e.badge] || BADGE_COLORS.badgeDefault;
            return (
              <div key={i} className={styles.eventCard}>
                {/* Left: colored date column */}
                <div
                  className={styles.eventDateCol}
                  style={{
                    "--ev-accent": colors.bg,
                    "--ev-light": colors.light,
                  }}
                >
                  <div className={styles.eventIconCircle}>
                    <i className={`bi ${e.icon}`} />
                  </div>
                  <div className={styles.eventDateDay}>{e.day}</div>
                  <div className={styles.eventDateMon}>{e.month}</div>
                  <div className={styles.eventDateYear}>{e.year}</div>
                </div>

                {/* Right: event details */}
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
                    <p className={styles.eventDesc}>{e.desc}</p>
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
                      <i className="bi bi-geo-alt-fill" /> {e.loc}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;
