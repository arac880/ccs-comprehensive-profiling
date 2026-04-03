import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import WelcomeBanner from "../../components/studentComponents/WelcomeBanner";
import EventsSection from "../../components/studentComponents/EventSection";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CCSLinks from "../../components/studentComponents/CcsLinks";
import TitlePages from "../../components/ui/TitlePages";
import styles from "./studentStyles/dashboard.module.css";

export default function StudentDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const DashboardContent = () => (
    <div className={styles.dashLayout}>
      {/* ══ ROW 1: WelcomeBanner | CalendarWidget ══ */}
      <div className={styles.topRow}>
        <div className={styles.welcomeCell}>
          <WelcomeBanner />
        </div>
        <div className={styles.calendarCell}>
          <CalendarWidget />
        </div>
      </div>

      {/* ══ ROW 2: EventsSection | CCSLinks ══ */}
      <div className={styles.bottomRow}>
        <div className={styles.eventsCell}>
          <TitlePages
            icon={<FaCalendarAlt size={22} color="#ffffff" />}
            title="Events"
            iconBg="#E65100"
            textColor="#a34100"
          />
          <div className={styles.eventsList}>
            <EventsSection />
          </div>
        </div>

        <div className={styles.linksCell}>
          <CCSLinks />
        </div>
      </div>
    </div>
  );

  return <main className={isMobile ? styles.mobileMain : styles.mainContent}>
    <DashboardContent />
  </main>;
}