import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { BsArrowRightShort } from "react-icons/bs";

import WelcomeBanner from "../../components/studentComponents/WelcomeBanner";
import EventsSection from "../../components/studentComponents/EventSection";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CCSLinks from "../../components/studentComponents/CcsLinks";
import TitlePages from "../../components/ui/TitlePages";
import styles from "./studentStyles/dashboard.module.css";

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

export default function StudentDashboard() {
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [bannerData, setBannerData] = useState({
    name: "Student",
    programLabel: "Loading...",
    semesterLabel: "1st Semester • A.Y. 2025–2026",
  });

  // Dynamic Clearance States
  const [isCleared, setIsCleared] = useState(false);
  const [loadingClearance, setLoadingClearance] = useState(true);

  // Handle Resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch Student Profile & Clearance Data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);

        // Set banner data from localStorage
        let programAbbr = "CCS";
        if (parsedUser.program) {
          if (parsedUser.program.includes("Information Technology")) programAbbr = "BSIT";
          if (parsedUser.program.includes("Computer Science")) programAbbr = "BSCS";
        }
        setBannerData({
          name: parsedUser.firstName + " " + parsedUser.lastName || "Student",
          programLabel: `${programAbbr} — ${parsedUser.year || ""}`,
          semesterLabel: "1st Semester • A.Y. 2025–2026", 
        });

        // Fetch deep clearance data from backend using the logged-in student's ID
        const res = await fetch(`http://localhost:5000/api/students/${parsedUser._id}`);
        const data = await res.json();

        // Calculate overall clearance status
        if (data && data.clearance && data.clearance.summaryItems) {
          const overallCleared = data.clearance.summaryItems.every(item => item.isCleared);
          setIsCleared(overallCleared);
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoadingClearance(false);
      }
    };

    fetchStudentData();
  }, []);

  // Fetch Events
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
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
        {/* Next Class - Reverted to your original static layout */}
        <DashWidget
          title="Next Class"
          icon={<FaClock />}
          actionText="Full Schedule"
          actionTo="/student/schedule"
        >
          <div className={styles.scheduleWidget}>
            <div className={styles.timeBlock}>
              <span className={styles.timeHighlight}>02:00 PM</span>
              <span className={styles.timeEnd}>to 05:00 PM</span>
            </div>
            <div className={styles.classBlock}>
              <span className={styles.subject}>ITP113 - ComLab 2</span>
              <span className={styles.instructor}>Prof. Montecillo</span>
            </div>
          </div>
        </DashWidget>

        {/* Dynamic Clearance Widget */}
        <DashWidget
          title="Clearance Status"
          icon={<FaCheckCircle />}
          actionText="Overall Clearance"
          actionTo="/student/clearance"
        >
          {loadingClearance ? (
            <div style={{ padding: "10px 0", color: "#666", textAlign: "center" }}>
              Checking status...
            </div>
          ) : (
            <div className={`${styles.clearanceDisplay} ${isCleared ? styles.cleared : styles.notCleared}`}>
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
              icon={<i className="bi bi-link-45deg" style={{ fontSize: 16, color: "#fff" }} />}
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