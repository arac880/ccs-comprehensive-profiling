import React, { useState } from "react";
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import styles from "../../pages/facultyPages/facultyStyles/events.module.css";

/* ── Events data ── */
const EVENTS = [
  {
    day: 25,
    month: "MAR",
    title: "Faculty Development Training",
    time: "8:00 AM – 5:00 PM",
    loc: "AVR, Main Building",
    type: "Training",
    badge: "badgeBlue",
  },
  {
    day: 28,
    month: "MAR",
    title: "CCS Department Meeting",
    time: "2:00 PM – 4:00 PM",
    loc: "Conference Room 2",
    type: "Meeting",
    badge: "badgeAmber",
  },
  {
    day: 3,
    month: "APR",
    title: "Students' Recognition Day",
    time: "9:00 AM – 12:00 PM",
    loc: "University Gymnasium",
    type: "Event",
    badge: "badgeGreen",
  },
  {
    day: 10,
    month: "APR",
    title: "Mid-Semester Grade Submission Deadline",
    time: "All Day",
    loc: "Online Portal",
    type: "Deadline",
    badge: "badgeRed",
  },
  {
    day: 15,
    month: "APR",
    title: "CCS Research Symposium",
    time: "8:00 AM – 6:00 PM",
    loc: "Audio-Visual Room",
    type: "Academic",
    badge: "badgeBlue",
  },
  {
    day: 22,
    month: "APR",
    title: "End-of-Semester Faculty Assembly",
    time: "3:00 PM – 5:00 PM",
    loc: "Auditorium",
    type: "Assembly",
    badge: "badgeDefault",
  },
];

/* ── Events Page ── */
const FacultyEvents = () => {
  const [currentPage, setCurrentPage] = useState("Events");

  return (
    <div className={styles.pageRoot}>
      {/* Sidebar */}
      <SideNavbar activeNav={currentPage} onNavigate={setCurrentPage} />

      {/* Main */}
      <div className={styles.pageMain}>
        {/* Topbar */}
        <TopNavbar activePage={currentPage} />

        {/* Content */}
        <div className={styles.pageContent}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <h2 className={styles.pageHeading}>
              <i className="bi bi-calendar-event-fill" /> Events
            </h2>
          </div>

          {/* Events list */}
          {EVENTS.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="bi bi-calendar-x" />
              No upcoming events.
            </div>
          ) : (
            <div className={styles.eventsList}>
              {EVENTS.map((e, i) => (
                <div key={i} className={styles.eventCard}>
                  {/* Date badge */}
                  <div className={styles.eventDateBadge}>
                    <div className={styles.eventDateDay}>{e.day}</div>
                    <div className={styles.eventDateMon}>{e.month}</div>
                  </div>

                  {/* Vertical divider */}
                  <div className={styles.eventDivider} />

                  {/* Info */}
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{e.title}</div>
                    <div className={styles.eventMeta}>
                      <span>
                        <i className="bi bi-clock" /> {e.time}
                      </span>
                      <span>
                        <i className="bi bi-geo-alt" /> {e.loc}
                      </span>
                    </div>
                  </div>

                  {/* Type badge */}
                  <span className={`${styles.badge} ${styles[e.badge]}`}>
                    {e.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyEvents;
