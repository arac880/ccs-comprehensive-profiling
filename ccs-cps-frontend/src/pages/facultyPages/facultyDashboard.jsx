import React, { useState } from "react";
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import Footer from "../../components/Footer";
import styles from "./facultyStyles/dashboard.module.css";

/* ── Mini Calendar ── */
const MiniCalendar = ({ today }) => {
  const [viewDate, setViewDate] = useState(
    new Date(today.year, today.month, 1),
  );

  const DOWS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.day && month === today.month && year === today.year;

  return (
    <div className={styles.calendarBody}>
      {/* Month nav */}
      <div className={styles.calendarNav}>
        <button className={styles.calendarNavBtn} onClick={prevMonth}>
          ‹
        </button>
        <span className={styles.calendarMonthLabel}>
          {MONS[month]} {year}
        </span>
        <button className={styles.calendarNavBtn} onClick={nextMonth}>
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className={styles.calendarDowRow}>
        {DOWS.map((d) => (
          <div key={d} className={styles.calendarDowCell}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className={styles.calendarGrid}>
        {cells.map((d, i) =>
          d === null ? (
            <div key={`e-${i}`} className={styles.calendarCellEmpty} />
          ) : (
            <div
              key={d}
              className={[
                styles.calendarCell,
                isToday(d) ? styles.calendarCellToday : "",
                i % 7 === 0 && !isToday(d) ? styles.calendarCellSunday : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {d}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/* ── Faculty Dashboard Page ── */
const FacultyDashboard = () => {
  const now = new Date();
  const DOWS_S = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const MONS_S = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const today = {
    day: now.getDate(),
    dow: DOWS_S[now.getDay()],
    moy: `${MONS_S[now.getMonth()]} ${now.getFullYear()}`,
    month: now.getMonth(),
    year: now.getFullYear(),
  };

  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <div className={styles.facultyDashboard}>
      {/* Sidebar */}
      <SideNavbar activeNav={currentPage} onNavigate={setCurrentPage} />

      {/* Main */}
      <div className={styles.dashboardMain}>
        {/* Topbar */}
        <TopNavbar activePage={currentPage} />

        {/* Content */}
        <div className={styles.dashboardContent}>
          {/* Left column */}
          <div className={styles.dashboardLeft}>
            {/* Welcome Banner */}
            <div className={styles.welcomeBanner}>
              <p className={styles.welcomeTitle}>
                Welcome to the <span className={styles.welcomeCcs}>CCS</span>
              </p>
              <p className={styles.welcomeSub}>
                Comprehensive Profiling System
              </p>
            </div>

            {/* Announcements */}
            <div className={styles.dashboardCard}>
              <div className={styles.cardTitle}>
                <i className="bi bi-megaphone-fill" /> Announcement
              </div>
              <div className={styles.emptyNotice}>No announcement yet.</div>
            </div>

            {/* Events */}
            <div className={styles.dashboardCard}>
              <div className={styles.cardTitle}>
                <i className="bi bi-calendar-event-fill" /> Events
              </div>
              <div className={styles.eventBlock} />
              <div className={styles.eventBlock} />
            </div>
          </div>

          {/* Right column — Calendar */}
          <div className={styles.dashboardRight}>
            <div className={styles.calendarCard}>
              {/* Header */}
              <div className={styles.calendarHeader}>
                <span className={styles.calendarDayNum}>{today.day}</span>
                <div className={styles.calendarDayInfo}>
                  <span className={styles.dow}>{today.dow}</span>
                  <span className={styles.moy}>{today.moy}</span>
                </div>
                <button className={styles.calendarExpand}>⤢</button>
              </div>

              {/* Interactive calendar */}
              <MiniCalendar today={today} />
            </div>
          </div>
        </div>
        <Footer version="v1.0.1" />
      </div>
    </div>
  );
};

export default FacultyDashboard;
