import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import styles from "../../pages/facultyPages/facultyStyles/SideNavbar.module.css";
import ccsLogo from "../../assets/ccs_logo.png";
import LogoutModal from "../LogoutModal";
import { useAuth } from "../../context/AuthContext";

const TABLET_BREAKPOINT = 992;
const MOBILE_BREAKPOINT = 768;

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
];

export default function SidebarNav({
  activeNav = "Dashboard",
  onNavigate,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //using auth

  const faculty = {
    name:
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Faculty",
    id: user?.id || "—",
    isDean: user?.isDean || false,
    isChair: storedUser.isChair || false,
    department: storedUser.department || " ",
  };
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  const [collapsed, setCollapsed] = useState(
    window.innerWidth < TABLET_BREAKPOINT,
  );
  const [showLogout, setShowLogout] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", y: 0 });
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < TABLET_BREAKPOINT) setCollapsed(true);
      if (window.innerWidth > MOBILE_BREAKPOINT) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setMobileOpen]);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout(); //
    navigate("/login");
  };

  const handleNav = (item) => {
    if (item.name === "SignOut") {
      setShowLogout(true);
      return;
    }
    setMobileOpen(false);
    onNavigate?.(item.name);
    navigate(item.path);
  };

  const showTooltip = (e, label) => {
    if (!collapsed || isMobile()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, label, y: rect.top + rect.height / 2 });
  };
  const hideTooltip = () => setTooltip({ visible: false, label: "", y: 0 });

  const showFull = !collapsed || isMobile();

  return (
    <>
      {/* MOBILE: backdrop overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR PANEL */}
      <div
        ref={sidebarRef}
        className={[
          styles.sidebar,
          collapsed && !isMobile() ? styles.collapsed : "",
          mobileOpen ? styles.mobileOpen : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Header ── */}
        <div className={styles.header}>
          {showFull && <span className={styles.brandName}>Faculty</span>}

          {isMobile() ? (
            <button
              className={styles.drawerClose}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <FaXmark />
            </button>
          ) : (
            <div
              className={styles.hamburgerBtn}
              onClick={() => {
                setCollapsed(!collapsed);
                hideTooltip();
              }}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FaBars className={styles.menuIcon} />
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        {showFull ? (
          <div className={styles.profileSection}>
            <div className={styles.profileEditBtn} title="Edit profile">
              <i className="bi bi-pencil-fill" />
            </div>
            <div className={styles.profileInner}>
              <div className={styles.profileAvatar}>
                <i className="bi bi-person-fill" />
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>{faculty.name}</p>
                <p className={styles.profileId}>{faculty.id}</p>
                {faculty.isDean && (
                  <span className={styles.deanBadge}>Dean</span>
                )}
              </div>
              <hr className={styles.profileDivider} />
            </div>
          </div>
        ) : (
          <div className={styles.collapsedAvatar} title={faculty.name}>
            <i className="bi bi-person-fill" />
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className={styles.sidebarNav}>
          {showFull && (
            <span className={styles.navSectionLabel}>Navigation</span>
          )}

          {navItems.map((item, index) => {
            const isActive = activeNav === item.name;
            const isSignOut = item.name === "SignOut";
            return (
              <div key={item.name}>
                <div
                  className={[
                    styles.navItemRow,
                    isActive ? styles.activeNav : "",
                    isSignOut ? styles.signOut : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleNav(item)}
                  onMouseEnter={(e) => showTooltip(e, item.label)}
                  onMouseLeave={hideTooltip}
                >
                  <i className={`bi ${item.icon} ${styles.navIcon}`} />
                  {showFull && (
                    <>
                      <span className={styles.navLabel}>{item.label}</span>
                      {isActive && <span className={styles.navActiveDot} />}
                    </>
                  )}
                </div>
                {index < navItems.length - 1 && !isSignOut && (
                  <hr className={styles.navDivider} />
                )}
                {index === navItems.length - 2 && (
                  <hr className={styles.navDividerSignout} />
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Watermark ── */}
        <div className={styles.sidebarWatermark}>
          <img
            src={ccsLogo}
            alt="CCS"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </div>

      {/* ── Desktop tooltip ── */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: "78px",
            top: tooltip.y,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.85)",
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
              borderColor:
                "transparent rgba(0,0,0,0.85) transparent transparent",
            }}
          />
          {tooltip.label}
        </div>
      )}

      <LogoutModal
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
