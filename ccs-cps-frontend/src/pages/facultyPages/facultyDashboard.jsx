import React, { useState } from "react";
import SidebarNav from "../../components/facultyComponents/SideNavbar";
import TopBar from "../../components/facultyComponents/TopNavbar";
import "./facultyStyles/dashboard.css";

const FacultyDashboard = () => {
  const now = new Date();
  const dows = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const mons = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];

  const today = {
    day: now.getDate(),
    dow: dows[now.getDay()],
    moy: `${mons[now.getMonth()]} ${now.getFullYear()}`,
  };

  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <div className="faculty-dashboard">

      {/* Sidebar */}
      <SidebarNav activeNav={currentPage} onNavigate={(page) => setCurrentPage(page)} />

      {/* Main */}
      <div className="dashboard-main">

        {/* Topbar */}
        <TopBar />

        {/* Content */}
        <div className="dashboard-content">

          {/* Left Column */}
          <div className="dashboard-left">

            {/* Welcome Banner */}
            <div className="welcome-banner">
              <p className="welcome-title">
                Welcome to the <span className="welcome-ccs">CCS</span>
              </p>
              <p className="welcome-sub">Comprehensive Profiling System</p>
            </div>

            {/* Announcement */}
            <div className="dashboard-card">
              <div className="card-title">
                <i className="bi bi-megaphone-fill"></i> Announcement
              </div>
              <div className="empty-notice">No announcement yet.</div>
            </div>

            {/* Events */}
            <div className="dashboard-card">
              <div className="card-title">
                <i className="bi bi-calendar-event-fill"></i> Events
              </div>
              <div className="event-block"></div>
              <div className="event-block"></div>
            </div>

          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            <div className="calendar-card">

              {/* Calendar Header */}
              <div className="calendar-header">
                <span className="calendar-day-num">{today.day}</span>
                <div className="calendar-day-info">
                  <span className="dow">{today.dow}</span>
                  <span className="moy">{today.moy}</span>
                </div>
                <button className="calendar-expand">⤢</button>
              </div>

              {/* Calendar Lines */}
              <div className="calendar-lines">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="calendar-line"></div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;