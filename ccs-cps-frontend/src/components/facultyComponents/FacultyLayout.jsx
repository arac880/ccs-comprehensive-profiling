import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import CCSFooter from "../../components/Footer";
import styles from "../../pages/facultyPages/facultyStyles/FacultyLayout.module.css";

const FacultyLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getActiveNav = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("student-list") || path.includes("student/"))
      return "StudentList";
    if (path.includes("schedule")) return "Schedule";
    if (path.includes("events")) return "Events";
    return "Dashboard";
  };

  return (
    <div className={styles.pageRoot}>
      <SideNavbar
        activeNav={getActiveNav()}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={styles.pageMain}>
        <TopNavbar
          activePage={getActiveNav()}
          onMenuClick={() => setMobileOpen(!mobileOpen)}
          mobileOpen={mobileOpen}
          notifCount={2}
        />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
        <CCSFooter version="v1.0.2" />
      </div>
    </div>
  );
};

export default FacultyLayout;
