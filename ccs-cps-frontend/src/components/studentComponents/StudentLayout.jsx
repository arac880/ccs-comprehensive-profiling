import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarNav from "../studentComponents/SideBarNav";
import TopNavbar from "../studentComponents/TopBarNav";
import Footer from "../Footer";
import styles from "../../pages/studentPages/studentStyles/StudentLayout.module.css";

const StudentLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const location = useLocation();

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
          onSignOut={() => console.log('sign out')}  
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