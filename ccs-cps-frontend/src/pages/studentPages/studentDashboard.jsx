import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
  const [bannerData, setBannerData] = useState({
    name: "Student",
    programLabel: "Loading...",
    semesterLabel: "2nd Semester • A.Y. 2025–2026" 
  });

  const isCleared = false; 

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        let programAbbr = "CCS";
        if (parsedUser.program) {
          if (parsedUser.program.includes("Information Technology")) programAbbr = "BSIT";
          if (parsedUser.program.includes("Computer Science")) programAbbr = "BSCS";
        }
        
        const formattedProgram = `${programAbbr} — ${parsedUser.year || ""}`;

        setBannerData({
          name: parsedUser.firstName + " " + parsedUser.lastName|| "Student",
          programLabel: formattedProgram,
          semesterLabel: "2nd Semester • A.Y. 2025–2026"
        });
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
    }

    return () => window.removeEventListener("resize", onResize);
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
        
        <DashWidget 
          title="Next Class" 
          icon={<FaClock />} 
          actionText="Full Schedule" 
          actionTo="/student/schedule"
        >
          <div className={styles.scheduleWidget}>
            <div className={styles.timeBlock}>
              <span className={styles.timeHighlight}>01:30 PM</span>
              <span className={styles.timeEnd}>to 03:00 PM</span>
            </div>
            <div className={styles.classBlock}>
              <span className={styles.subject}>IT312 - ComLab 2</span>
              <span className={styles.instructor}>Prof. Santos</span>
            </div>
          </div>
        </DashWidget>

        <DashWidget 
          title="Clearance Status" 
          icon={<FaCheckCircle />}
          actionText="Overall Clearance"
          actionTo="/student/clearance"
        >
          <div className={`${styles.clearanceDisplay} ${isCleared ? styles.cleared : styles.notCleared}`}>
            <div className={styles.statusMain}>
              {isCleared ? <FaCheckCircle size={28} /> : <FaTimesCircle size={28} />}
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
            <EventsSection />
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