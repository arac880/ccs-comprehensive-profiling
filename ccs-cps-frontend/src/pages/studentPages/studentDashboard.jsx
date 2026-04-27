import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";
import { BsArrowRightShort } from "react-icons/bs";

import WelcomeBanner from "../../components/studentComponents/WelcomeBanner";
import EventsSection from "../../components/studentComponents/EventSection";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CCSLinks from "../../components/studentComponents/CcsLinks";
import TitlePages from "../../components/ui/TitlePages";
import styles from "./studentStyles/dashboard.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_NUM_TO_STR = {
  0: "MONDAY",
  1: "TUESDAY",
  2: "WEDNESDAY",
  3: "THURSDAY",
  4: "FRIDAY",
  5: "SATURDAY",
  6: "SUNDAY",
};

// DB: start slot 0 = 7:00 AM, 1 = 8:00 AM, 2 = 9:00 AM ...
const SLOT_TO_HOUR = (slot) => 7 + Number(slot);

const formatTime = (hour, min = 0) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  const m = min === 0 ? "00" : min < 10 ? `0${min}` : `${min}`;
  return `${h12}:${m} ${ampm}`;
};

// JS getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
// DB day:      0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun
const JS_DAY_TO_DB_DAY = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };

// ─── Helper ───────────────────────────────────────────────────────────────────
const getStudentFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Widget wrapper ───────────────────────────────────────────────────────────
function DashWidget({ title, icon, actionText, actionTo, children }) {
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleWrap}>
          <div className={styles.widgetIcon}>{icon}</div>
          <span className={styles.widgetTitle}>{title}</span>
        </div>
        {actionText && actionTo && (
          <Link to={actionTo} className={styles.widgetAction}>
            {actionText} <BsArrowRightShort size={18} />
          </Link>
        )}
      </div>
      <div className={styles.widgetBody}>{children}</div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [bannerData, setBannerData] = useState({
    name: "Student",
    programLabel: "Loading...",
    semesterLabel: "1st Semester • A.Y. 2025–2026",
  });

  const [isCleared, setIsCleared] = useState(false);
  const [loadingClearance, setLoadingClearance] = useState(true);

  // ── Next class state ────────────────────────────────────────────────────────
  const [nextClass, setNextClass] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Fetch student profile & clearance ──────────────────────────────────────
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);

        let programAbbr = "CCS";
        if (parsedUser.program) {
          if (parsedUser.program.includes("Information Technology"))
            programAbbr = "BSIT";
          if (parsedUser.program.includes("Computer Science"))
            programAbbr = "BSCS";
        }
        setBannerData({
          name: parsedUser.firstName + " " + parsedUser.lastName || "Student",
          programLabel: `${programAbbr} — ${parsedUser.year || ""}`,
          semesterLabel: "1st Semester • A.Y. 2025–2026",
        });

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${parsedUser._id}`,
        );
        const data = await res.json();

        if (data?.clearance?.summaryItems) {
          setIsCleared(
            data.clearance.summaryItems.every((item) => item.isCleared),
          );
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoadingClearance(false);
      }
    };

    fetchStudentData();
  }, []);

  // ── Fetch schedule & compute next class ────────────────────────────────────
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const student = getStudentFromStorage();
        const section = student?.section;
        if (!section) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/schedules/section/${encodeURIComponent(section)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) return;

        // Normalize all schedules
        const normalized = data.map((s) => ({
          day: Number(s.day), // 0=Mon … 4=Fri (DB format)
          startHour: SLOT_TO_HOUR(s.start),
          endHour: SLOT_TO_HOUR(s.start) + Number(s.span),
          duration: Number(s.span),
          course: s.subjectCode ?? "",
          title: s.title ?? "",
          room: s.room ?? "",
          instructor: s.facultyName ?? "",
          type: s.type ?? "Lecture",
        }));

        // Find next class from today onward
        const now = new Date();
        const todayDbDay = JS_DAY_TO_DB_DAY[now.getDay()]; // today in DB format
        const currentHour = now.getHours() + now.getMinutes() / 60;

        // Sort: today's remaining classes first, then future days
        const sorted = [...normalized].sort((a, b) => {
          const aDiff =
            a.day === todayDbDay
              ? a.startHour >= currentHour
                ? a.startHour - currentHour // later today → small positive
                : a.startHour + 7 - currentHour + 5 // already passed → push to end
              : ((a.day - todayDbDay + 7) % 7) * 24 + a.startHour;

          const bDiff =
            b.day === todayDbDay
              ? b.startHour >= currentHour
                ? b.startHour - currentHour
                : b.startHour + 7 - currentHour + 5
              : ((b.day - todayDbDay + 7) % 7) * 24 + b.startHour;

          return aDiff - bDiff;
        });

        // Pick the first upcoming class
        const upcoming = sorted.find((s) => {
          if (s.day === todayDbDay) return s.startHour >= currentHour;
          return true;
        });

        setNextClass(upcoming ?? sorted[0]); // fallback to first if none today
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, []);

  // ── Fetch events ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        const today = new Date();
        const upcoming = data
          .map((e) => ({ ...e, dateObj: new Date(e.date) }))
          .filter((e) => e.dateObj >= today)
          .sort((a, b) => a.dateObj - b.dateObj);

        if (upcoming.length > 0) {
          const e = upcoming[0];
          setUpcomingEvent({
            id: e._id,
            title: e.title,
            date: e.dateObj.toDateString(),
            month: e.month,
            day: e.day,
            status: "Upcoming",
            body: e.description || "",
            location: e.location,
            time: e.time,
            type: e.type,
          });
        }
      } catch (err) {
        console.error("Failed to fetch upcoming event:", err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────
  const DashboardContent = () => (
    <div className={styles.dashLayout}>
      <div className={styles.heroRow}>
        <WelcomeBanner
          studentName={bannerData.name}
          program={bannerData.programLabel}
          semester={bannerData.semesterLabel}
        />
      </div>

      <div className={styles.widgetsRow}>
        {/* ── Next Class Widget ── */}
        <DashWidget
          title="Next Class"
          icon={<FaClock />}
          actionText="Full Schedule"
          actionTo="/student/schedule"
        >
          {loadingSchedule ? (
            <div
              style={{
                padding: "10px 0",
                color: "#aaa",
                textAlign: "center",
                fontSize: 13,
              }}
            >
              Loading schedule…
            </div>
          ) : nextClass ? (
            <div className={styles.scheduleWidget}>
              <div className={styles.timeBlock}>
                <span className={styles.timeHighlight}>
                  {formatTime(nextClass.startHour)}
                </span>
                <span className={styles.timeEnd}>
                  to {formatTime(nextClass.endHour)}
                </span>
              </div>
              <div className={styles.classBlock}>
                <span className={styles.subject}>
                  {nextClass.course} — {nextClass.room}
                </span>
                <span className={styles.instructor}>
                  {nextClass.instructor}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#a8917f",
                    marginTop: 2,
                  }}
                >
                  {DAY_NUM_TO_STR[nextClass.day]} •{" "}
                  {nextClass.type === "Laboratory" ? "LAB" : "LEC"}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "10px 0",
                color: "#aaa",
                textAlign: "center",
                fontSize: 13,
              }}
            >
              No upcoming classes found.
            </div>
          )}
        </DashWidget>

        {/* ── Clearance Widget ── */}
        <DashWidget
          title="Clearance Status"
          icon={<FaCheckCircle />}
          actionText="Overall Clearance"
          actionTo="/student/clearance"
        >
          {loadingClearance ? (
            <div
              style={{ padding: "10px 0", color: "#666", textAlign: "center" }}
            >
              Checking status...
            </div>
          ) : (
            <div
              className={`${styles.clearanceDisplay} ${
                isCleared ? styles.cleared : styles.notCleared
              }`}
            >
              <div className={styles.statusMain}>
                {isCleared ? (
                  <FaCheckCircle size={28} />
                ) : (
                  <FaTimesCircle size={28} />
                )}
                <span className={styles.statusTitle}>
                  {isCleared ? "CLEARED" : "NOT YET CLEARED"}
                </span>
              </div>
              <p className={styles.statusDesc}>
                {isCleared
                  ? "You have fully settled all requirements."
                  : "You have pending requirements to settle."}
              </p>
            </div>
          )}
        </DashWidget>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.eventsCell}>
          <TitlePages
            icon={<FaCalendarAlt size={15} color="#ffffff" />}
            title="Upcoming Events"
            iconBg="#E65100"
            textColor="#7A4F35"
          />
          <div className={styles.eventsList}>
            {loadingEvent ? (
              <p>Loading event...</p>
            ) : upcomingEvent ? (
              <EventsSection events={[upcomingEvent]} showMore={false} />
            ) : (
              <p>No upcoming events.</p>
            )}
          </div>
        </div>

        <div className={styles.sidebarCell}>
          <CalendarWidget />
          <div style={{ marginTop: "24px" }}>
            <TitlePages
              icon={
                <i
                  className="bi bi-link-45deg"
                  style={{ fontSize: 16, color: "#fff" }}
                />
              }
              title="CCS Links"
              iconBg="#E65100"
              textColor="#7A4F35"
            />
            <CCSLinks />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className={isMobile ? styles.mobileMain : styles.mainContent}>
      <DashboardContent />
    </main>
  );
}
