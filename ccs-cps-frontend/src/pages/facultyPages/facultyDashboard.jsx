import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.day && month === today.month && year === today.year;
  const hasEvent = (d) => [5, 12, 18, 24].includes(d);
  return (
    <div className={styles.calendarBody}>
      <div className={styles.calendarNav}>
        <button
          className={styles.calendarNavBtn}
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
        >
          ‹
        </button>
        <span className={styles.calendarMonthLabel}>
          {MONS[month]} {year}
        </span>
        <button
          className={styles.calendarNavBtn}
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
        >
          ›
        </button>
      </div>
      <div className={styles.calendarDowRow}>
        {DOWS.map((d) => (
          <div key={d} className={styles.calendarDowCell}>
            {d}
          </div>
        ))}
      </div>
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
                hasEvent(d) && !isToday(d) ? styles.calendarCellEvent : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {d}
              {hasEvent(d) && !isToday(d) && (
                <span className={styles.eventDot} />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, sub, color, loading }) => (
  <div className={styles.statCard} style={{ "--accent": color }}>
    <div className={styles.statIconWrap}>
      <i className={`bi ${icon} ${styles.statIcon}`} />
    </div>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>
        {loading ? <span className={styles.skeletonNum} /> : value}
      </span>
      <span className={styles.statLabel}>{label}</span>
      {sub && !loading && <span className={styles.statSub}>{sub}</span>}
    </div>
  </div>
);

const QUICK_ACTIONS = [
  {
    icon: "bi-person-plus-fill",
    label: "Add Student",
    path: "/faculty/student-list",
  },

  {
    icon: "bi-calendar-plus-fill",
    label: "Add Event",
    path: "/faculty/events",
  },
];

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => (n && n[0] ? n[0] : ""))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Main Dashboard ── */
const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const facultyName = storedUser.lastName
    ? `Prof. ${storedUser.lastName}`
    : "Faculty";

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
  const MONS_FULL = [
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

  const formatTime = (i) => TIMES[i] ?? "";
  const today = {
    day: now.getDate(),
    dow: DOWS_S[now.getDay()],
    moy: `${MONS_S[now.getMonth()]} ${now.getFullYear()}`,
    month: now.getMonth(),
    year: now.getFullYear(),
    fullMonth: MONS_FULL[now.getMonth()],
  };
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const upcomingEvents = events.filter((e) => e.isUpcoming);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/students`)
      .then((r) => r.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCount = students.length;
  const regularCount = students.filter((s) => s.type === "Regular").length;
  const enrolledCount = students.filter((s) => s.status === "Enrolled").length;
  const pendingCount = students.filter(
    (s) => s.status === "LOA" || s.status === "Dropped",
  ).length;

  const recentStudents = [...students]
    .slice(-4)
    .reverse()
    .map((s) => ({
      _id: s._id,
      name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || "—",
      displayId: s.studentId ? s.studentId.slice(-7).toUpperCase() : "—",
      year: s.year || "—",
      section: s.section || "—",
      type: s.type || "Regular",
      status: s.status || "Enrolled",
    }));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const data = await res.json();

        const now = new Date();

        const mapped = (Array.isArray(data) ? data : [])
          .map((e) => {
            const d = new Date(e.date);

            return {
              id: e._id,
              title: e.title,
              date: d.toDateString(),
              time: e.time || "All Day",
              type: e.type,
              color:
                e.type === "Meeting"
                  ? "#e65100"
                  : e.type === "Deadline"
                    ? "#c0390a"
                    : e.type === "Academic"
                      ? "#1565c0"
                      : "#2d7a3c",
              icon: e.icon || "bi-calendar-event-fill",
              isUpcoming: d >= now,
            };
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
  const facultyId = getFacultyIdFromStorage();

  useEffect(() => {
    if (!facultyId) {
      setScheduleLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/schedules/faculty/${facultyId}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = Array.isArray(data)
          ? data.map((s) => ({
              subject: s.title,
              code: s.sub,
              room: s.room,
              time: `${formatTime(s.start)} - ${formatTime(s.start + (s.span || 1))}`,
              day: s.day,
            }))
          : [];

        setSchedule(mapped);
      })
      .catch((err) => {
        console.error("Schedule fetch error:", err);
        setSchedule([]);
      })
      .finally(() => setScheduleLoading(false));
  }, [facultyId]);

  const getDayName = (day) => {
    const map = {
      0: "Monday",
      1: "Tuesday",
      2: "Wednesday",
      3: "Thursday",
      4: "Friday",
      5: "Saturday",
      6: "Sunday",
    };

    return map[Number(day)] ?? "";
  };

  return (
    <div className={styles.dashboardContent}>
      {/* ── LEFT COLUMN ── */}
      <div className={styles.dashboardLeft}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeOrb} />
          <div className={styles.welcomeOrb2} />
          <div className={styles.welcomeBannerInner}>
            <div className={styles.welcomeText}>
              <p className={styles.welcomeGreet}>Dangal Greetings!</p>
              <p className={styles.welcomeTitle}>
                Welcome to the <span className={styles.welcomeCcs}>CCS</span>
              </p>
              <p className={styles.welcomeSub}>
                Comprehensive Profiling System
              </p>
            </div>
            <div className={styles.welcomeStats}>
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatNum}>
                  {loading ? "—" : totalCount}
                </span>
                <span className={styles.welcomeStatLbl}>Students</span>
              </div>
              <div className={styles.welcomeStatDiv} />
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatNum}>3</span>
                <span className={styles.welcomeStatLbl}>Subjects</span>
              </div>
              <div className={styles.welcomeStatDiv} />
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatNum}>2</span>
                <span className={styles.welcomeStatLbl}>Sections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className={styles.statRow}>
          <StatCard
            icon="bi-people-fill"
            label="Total Students"
            value={totalCount}
            sub={`${regularCount} regular`}
            color="#e65100"
            loading={loading}
          />
          <StatCard
            icon="bi-check2-circle"
            label="Enrolled"
            value={enrolledCount}
            sub={`${Math.round((enrolledCount / Math.max(totalCount, 1)) * 100)}% of total`}
            color="#2e7d32"
            loading={loading}
          />
          <StatCard
            icon="bi-exclamation-circle"
            label="LOA / Dropped"
            value={pendingCount}
            sub="Need attention"
            color="#b45309"
            loading={loading}
          />
          <StatCard
            icon="bi-calendar2-check-fill"
            label="Events This Month"
            value="5"
            sub="Next: Apr 10"
            color="#1565c0"
            loading={false}
          />
        </div>

        {/* Mid row: Announcements + Schedule */}
        <div className={styles.midRow}>
          {/* Announcements */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}></span>
                Announcements
              </div>
              <span className={styles.cardBadge}>
                {eventsLoading ? "..." : upcomingEvents.length} new
              </span>
            </div>
            <div className={styles.announcementList}>
              {eventsLoading ? (
                <p>Loading...</p>
              ) : events.slice(0, 3).length === 0 ? (
                <p>No announcements</p>
              ) : (
                events.slice(0, 3).map((e) => (
                  <div key={e.id} className={styles.announcementItem}>
                    <div className={styles.announcementLeft}>
                      <span className={styles.announcementTag}>
                        {e.type || "Event"}
                      </span>
                      <p className={styles.announcementTitle}>{e.title}</p>
                      <span className={styles.announcementDate}>{e.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <i className="bi bi-journal-bookmark-fill" />
                </span>
                My Schedule
              </div>
              <span
                className={styles.cardLink}
                onClick={() => navigate("/faculty/schedule")}
              >
                View all
              </span>
            </div>
            <div className={styles.scheduleList}>
              <div className={styles.scheduleList}>
                {scheduleLoading ? (
                  <p>Loading...</p>
                ) : schedule.length === 0 ? (
                  <p>No schedule yet</p>
                ) : (
                  schedule.slice(0, 3).map((s, i) => (
                    <div key={i} className={styles.scheduleItem}>
                      <div className={styles.scheduleAccent} />
                      <div className={styles.scheduleInfo}>
                        <p className={styles.scheduleSubject}>{s.subject}</p>
                        <p className={styles.scheduleMeta}>
                          {s.code} · {s.room}
                        </p>
                      </div>
                      <div className={styles.scheduleTime}>
                        <span className={styles.scheduleTimeText}>
                          {s.time}
                        </span>
                        <span className={styles.scheduleDay}>
                          {getDayName(s.day)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Students */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span className={styles.cardTitleIcon}>
                <i className="bi bi-people-fill" />
              </span>
              Recent Students
            </div>
            <span
              className={styles.cardLink}
              onClick={() => navigate("/faculty/student-list")}
            >
              View all
            </span>
          </div>

          {loading ? (
            <div className={styles.skeletonRows}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeletonRow} />
              ))}
            </div>
          ) : recentStudents.length === 0 ? (
            <div className={styles.emptyStudents}>
              <i className="bi bi-people" />
              <p>No students yet.</p>
            </div>
          ) : (
            <div className={styles.studentTable}>
              <div className={styles.studentTableHead}>
                <span>Name</span>
                <span>ID</span>
                <span>Year</span>
                <span>Section</span>
                <span>Status</span>
              </div>
              {recentStudents.map((s) => (
                <div
                  key={s._id}
                  className={styles.studentRow}
                  onClick={() => navigate(`/faculty/student/${s._id}`)}
                >
                  <span className={styles.studentName}>
                    <span className={styles.studentAvatar}>
                      {getInitials(s.name)}
                    </span>
                    {s.name}
                  </span>
                  <span className={styles.studentMeta}>{s.displayId}</span>
                  <span className={styles.studentMeta}>{s.year}</span>
                  <span className={styles.studentMeta}>{s.section}</span>
                  <span
                    className={`${styles.statusBadge} ${
                      s.type === "Regular"
                        ? styles.statusRegular
                        : styles.statusIrregular
                    }`}
                  >
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className={styles.dashboardRight}>
        {/* Mini Calendar */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <span className={styles.calendarDayNum}>{today.day}</span>
            <div className={styles.calendarDayInfo}>
              <span className={styles.dow}>{today.dow}</span>
              <span className={styles.moy}>{today.moy}</span>
            </div>
            <button className={styles.calendarExpand}>⤢</button>
          </div>
          <MiniCalendar today={today} />
        </div>

        {/* Upcoming Events */}
        <div className={`${styles.dashboardCard} ${styles.eventsCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span className={styles.cardTitleIcon}>
                <i className="bi bi-calendar-event-fill" />
              </span>
              Upcoming
            </div>
          </div>
          <div className={styles.eventList}>
            {eventsLoading ? (
              <p>Loading events...</p>
            ) : events.filter((e) => e.isUpcoming).slice(0, 5).length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              events
                .filter((e) => e.isUpcoming)
                .slice(0, 5)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className={styles.eventItem}
                    style={{ "--ev-color": ev.color }}
                  >
                    <div className={styles.eventIconWrap}>
                      <i
                        className={`bi ${ev.icon}`}
                        style={{ color: ev.color }}
                      />
                    </div>
                    <div className={styles.eventInfo}>
                      <p className={styles.eventTitle}>{ev.title}</p>
                      <p className={styles.eventMeta}>
                        {ev.date} · {ev.time}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${styles.dashboardCard} ${styles.quickCard}`}>
          <div className={styles.cardTitle} style={{ marginBottom: "10px" }}>
            <span className={styles.cardTitleIcon}>
              <i className="bi bi-lightning-charge-fill" />
            </span>
            Quick Actions
          </div>
          <div className={styles.quickGrid}>
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                className={styles.quickBtn}
                onClick={() => q.path && navigate(q.path)}
              >
                <i className={`bi ${q.icon} ${styles.quickBtnIcon}`} />
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
