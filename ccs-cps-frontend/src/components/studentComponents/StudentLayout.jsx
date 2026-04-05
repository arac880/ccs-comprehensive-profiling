import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBarNav from "../studentComponents/SideBarNav";
import TopNavbar from "../studentComponents/TopBarNav";
import Footer from "../Footer";
import styles from "../../pages/studentPages/studentStyles/StudentLayout.module.css";

const StudentLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveNav = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("clearance")) return "Clearance";
    if (path.includes("schedule")) return "Schedule";
    if (path.includes("events")) return "Events";
    if (path.includes("research")) return "CollegeResearch";
    return "Dashboard";
  };

  const handleDrawerToggle = (open) => {
    setIsDrawerOpen(open);
  };

  const handleSignOut = () => {
    console.log("Signing out...");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.pageRoot}>
      <SideBarNav
        activeNav={getActiveNav()}
        drawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      <div className={styles.pageMain}>
        <TopNavbar
          notifCount={0}
          onSignOut={handleSignOut}
          onMenuClick={() => setIsDrawerOpen(true)}
        />

        <div className={styles.pageContent}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default StudentLayout;
