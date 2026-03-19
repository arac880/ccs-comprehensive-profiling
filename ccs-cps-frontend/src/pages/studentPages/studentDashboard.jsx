import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SideBarNav from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";
import WelcomeBanner from "../../components/studentComponents/WelcomeBanner";
import EventsSection from "../../components/studentComponents/EventSection";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CCSLinks from "../../components/studentComponents/CcsLinks";
import TitlePages from "../../components/ui/TitlePages";
import styles from "./studentStyles/dashboard.module.css";

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

  // ── Shared dashboard content grid ────────────────────────
  const DashboardContent = () => (
    <div className={styles.dashGrid}>
      {/* Left column: welcome hero + events list */}
      <div className={styles.dashLeft}>
        <WelcomeBanner />

        <TitlePages
          icon="bi-calendar-event-fill"
          title="Events"
          iconBg="#E65100"
          iconColor="#ffffff"
          textColor="#E65100"
        />
        <EventsSection />
      </div>

      {/* Right column: today's date + CCS links */}
      <div className={styles.dashRight}>
        <CalendarWidget />
        <CCSLinks />
      </div>
    </div>
  );

  // ── Mobile layout ─────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />
        <main className={styles.mobileMain}>
          <DashboardContent />
        </main>
      </>
    );
  }

  // ── Desktop layout ────────────────────────────────────────
  return (
    <div className={styles.dashboardWrapper}>
      <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />

      <div className={styles.rightColumn}>
        <TopBarNav notifCount={3} onSignOut={handleSignOut} />

        <main className={styles.mainContent}>
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
