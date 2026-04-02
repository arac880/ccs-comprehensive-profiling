import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/facultyPages/facultyStyles/SideNavbar.module.css";
import ccsLogo from "../../assets/ccs_logo.png";

const navItems = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: "bi-grid-fill",
    path: "/faculty/dashboard",
  },
  {
    name: "StudentList",
    label: "Student List",
    icon: "bi-people-fill",
    path: "/faculty/student-list",
  },
  {
    name: "Schedule",
    label: "Schedule",
    icon: "bi-calendar3",
    path: "/faculty/schedule",
  },
  {
    name: "Events",
    label: "Events",
    icon: "bi-calendar-event",
    path: "/faculty/events",
  },
  {
    name: "SignOut",
    label: "Sign Out",
    icon: "bi-arrow-left-circle",
    path: "/login",
  },
];

const faculty = { name: "Miriam B. Mulawin", id: "2203375" };

export default function SidebarNav({ activeNav = "Dashboard", onNavigate }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", y: 0 });
  const sidebarRef = useRef(null);

  const handleNav = (item) => {
    onNavigate?.(item.name);
    navigate(item.path);
  };

  const showTooltip = (e, label) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, label, y: rect.top + rect.height / 2 });
  };

  const hideTooltip = () => setTooltip({ visible: false, label: "", y: 0 });

  return (
    <>
      <div
        ref={sidebarRef}
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      >
        {/* Header */}
        <div className={styles.header}>
          {!collapsed && <span className={styles.brandName}>Faculty</span>}
          <button
            className={styles.toggleBtn}
            onClick={() => {
              setCollapsed(!collapsed);
              hideTooltip();
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={`bi ${collapsed ? "bi-layout-sidebar" : "bi-layout-sidebar-reverse"}`}
            />
          </button>
        </div>

        {/* Profile */}
        {!collapsed ? (
          <div className={styles.profileSection}>
            <i className={`bi bi-pencil-square ${styles.profileEditIcon}`} />
            <div className={styles.profileInner}>
              <div className={styles.profileAvatar}>
                <i className="bi bi-person-fill" />
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>{faculty.name}</p>
                <p className={styles.profileId}>{faculty.id}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.collapsedAvatar} title={faculty.name}>
            <i className="bi bi-person-fill" />
          </div>
        )}

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {navItems.map((item, index) => (
            <div key={item.name}>
              <div
                className={`${styles.navItemRow} ${activeNav === item.name ? styles.activeNav : ""}`}
                onClick={() => handleNav(item)}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
              >
                <i className={`bi ${item.icon} ${styles.navIcon}`} />
                {!collapsed && (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
              </div>
              {index < navItems.length - 1 && (
                <hr className={styles.navDivider} />
              )}
            </div>
          ))}
        </nav>

        {/* Watermark */}
        <div className={styles.sidebarWatermark}>
          <img
            src={ccsLogo}
            alt="CCS"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </div>

      {/* Portal-style tooltip rendered outside sidebar — never clipped */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: "78px",
            top: tooltip.y,
            transform: "translateY(-50%)",
            background: "#1c1c1c",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            padding: "5px 12px",
            borderRadius: "7px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            letterSpacing: "0.2px",
          }}
        >
          <span
            style={{
              position: "absolute",
              right: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              borderWidth: "5px",
              borderStyle: "solid",
              borderColor: "transparent #1c1c1c transparent transparent",
            }}
          />
          {tooltip.label}
        </div>
      )}
    </>
  );
}
