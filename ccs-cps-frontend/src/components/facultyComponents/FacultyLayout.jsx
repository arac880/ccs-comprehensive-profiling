import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import CCSFooter from "../../components/Footer";
import styles from "../../pages/facultyPages/facultyStyles/FacultyLayout.module.css";

const FacultyLayout = () => {
  const location = useLocation();

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
      <SideNavbar activeNav={getActiveNav()} />

      <div className={styles.pageMain}>
        <TopNavbar activePage={getActiveNav()} />
        <div className={styles.pageContent}>
          {" "}
          <Outlet />
        </div>
        <CCSFooter />{" "}
      </div>
    </div>
  );
};

export default FacultyLayout;
