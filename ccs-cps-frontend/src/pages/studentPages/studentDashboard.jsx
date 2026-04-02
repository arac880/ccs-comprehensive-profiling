import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SideBarNav from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";
import WelcomeBanner from "../../components/studentComponents/WelcomeBanner";
import EventsSection from "../../components/studentComponents/EventSection";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CCSLinks from "../../components/studentComponents/CcsLinks";
import TitlePages from "../../components/ui/TitlePages";
import Footer from "../../components/Footer";
import styles from "./studentStyles/dashboard.module.css";
import { FaCalendarAlt } from "react-icons/fa";

const MOBILE_BREAKPOINT = 992;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [currentNav, setCurrentNav] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = () => navigate("/");

  const DashboardContent = () => (
    <div className={styles.dashLayout}>
      {/* ══ ROW 1: WelcomeBanner | CalendarWidget ══
          CSS grid row = both cells are EXACTLY the same height.
          The taller of the two drives the row; the shorter stretches. */}
      <div className={styles.topRow}>
        <div className={styles.welcomeCell}>
          <WelcomeBanner />
        </div>
        <div className={styles.calendarCell}>
          <CalendarWidget />
        </div>
      </div>

      {/* ══ ROW 2: EventsSection | CCSLinks ══
          Same grid strategy — eventsCell drives height,
          linksCell stretches to match exactly. */}
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

  if (isMobile) {
    return (
      <>
        <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />
        <main className={styles.mobileMain}>
          <DashboardContent />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />
      <div className={styles.rightColumn}>
        <TopBarNav notifCount={3} onSignOut={handleSignOut} />
        <main className={styles.mainContent}>
          <DashboardContent />
        </main>
        <Footer />
      </div>
    </div>
  );
}
