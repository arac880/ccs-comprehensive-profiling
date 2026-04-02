import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // IMPORT ADDED
import styles from "../../pages/studentPages/studentStyles/SideBarNav.module.css";
import ccsLogo from "../../assets/ccs_logo.png";
import Footer from "../../components/Footer";

// React Icons — Font Awesome 6
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaCalendarDays } from "react-icons/fa6"; // Schedule
import { FaCalendarCheck } from "react-icons/fa6"; // Events
import { FaBookOpen } from "react-icons/fa6"; // College Research
import { FaClipboardCheck } from "react-icons/fa6"; // Clearance
import { FaBars } from "react-icons/fa6"; // Hamburger / menu toggle
import { FaXmark } from "react-icons/fa6"; // Close drawer
import { FaCircleUser } from "react-icons/fa6"; // Avatar fallback

// ADDED 'path' PROPERTY TO EACH ITEM based on your App.jsx
const NAV_ITEMS = [
  {
    name: "Dashboard",
    label: "Dashboard",
    Icon: RiDashboardHorizontalFill,
    path: "/student/dashboard",
  },
  {
    name: "Clearance",
    label: "Clearance",
    Icon: FaClipboardCheck,
    path: "/student/clearance",
  },
  {
    name: "Schedule",
    label: "Schedule",
    Icon: FaCalendarDays,
    path: "/student/schedule",
  },
  {
    name: "Events",
    label: "Events",
    Icon: FaCalendarCheck,
    path: "/student/events",
  },
  {
    name: "CollegeResearch",
    label: "College Research",
    Icon: FaBookOpen,
    path: "/student/research",
  }, // No page created yet
];

const DEFAULT_STUDENT = {
  name: "Jessa V. Cariñaga",
  id: "2001518",
  type: "Regular",
  status: "Enrolled",
  year: "4th Year",
  section: "4IT-D",
  avatarUrl: null,
};

const MOBILE_BREAKPOINT = 992;

export default function SideNavbar({
  activeNav = "Dashboard",
  onNavigate,
  student = DEFAULT_STUDENT,
}) {
  const navigate = useNavigate(); // HOOK INITIALIZED
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // UPDATED GO FUNCTION
  const go = (item) => {
    if (onNavigate) onNavigate(item.name);
    if (isMobile) setDrawerOpen(false);

    // Check if the route exists before navigating
    if (item.path) {
      navigate(item.path);
    }
  };

  // ── Profile card ─────────────────────────────────────────────
  const ProfileCard = () => (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.name}
            className={styles.avatarImg}
          />
        ) : (
          <FaCircleUser className={styles.avatarIcon} />
        )}
      </div>
      <p className={styles.studentName}>{student.name}</p>
      <p className={styles.studentId}>{student.id}</p>
      <hr className={styles.profileDivider} />
      <p className={styles.studentMeta}>Type: {student.type}</p>
      <p className={styles.studentMeta}>Status: {student.status}</p>
      <p className={styles.studentMeta}>Current Year Level: {student.year}</p>
      <p className={styles.studentMeta}>
        Section/s Enrolled: {student.section}
      </p>
    </div>
  );

  // ── Nav list ──────────────────────────────────────────────────
  const NavList = () => (
    <div className={styles.navWrapper}>
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeNav === item.name;
        return (
          <div key={item.name}>
            <div
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => go(item)} // PASS ENTIRE ITEM INSTEAD OF JUST NAME
            >
              <item.Icon
                className={`${styles.navIcon} ${isActive ? styles.navIconActive : ""}`}
              />
              <span
                className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ""}`}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className={styles.navBadge}>{item.badge}</span>
              )}
            </div>
            {index < NAV_ITEMS.length - 1 && (
              <hr className={styles.navDivider} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── CCS Logo watermark ────────────────────────────────────────
  const Logo = ({ collapsed = false }) => (
    <div className={collapsed ? styles.collapsedLogoWrap : styles.logoWrap}>
      <img
        src={ccsLogo}
        alt="CCS"
        className={collapsed ? styles.collapsedLogoImg : styles.logoImg}
        onError={(e) => (e.target.style.display = "none")}
      />
    </div>
  );

  // ============================================================
  //  MOBILE LAYOUT
  // ============================================================
  if (isMobile) {
    return (
      <>
        {/* Fixed orange top bar */}
        <div className={styles.mobileTopBar}>
          <FaBars
            className={styles.mobileHamburger}
            onClick={() => setDrawerOpen(true)}
          />
          <span className={styles.mobileTopBarTitle}>
            CCS - Comprehensive Profiling System
          </span>
          <div className={styles.mobileTopBarAvatar}>
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.name} />
            ) : (
              <FaCircleUser style={{ color: "#fff", fontSize: "1rem" }} />
            )}
          </div>
        </div>

        {/* Backdrop */}
        <div
          className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropShow : ""}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Sliding drawer */}
        <div
          className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        >
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Student</span>
            <FaXmark
              className={styles.closeIcon}
              onClick={() => setDrawerOpen(false)}
            />
          </div>
          <ProfileCard />
          <NavList />
          <Logo />
        </div>

        {/* Fixed bottom tab bar */}
        {/* <div className={styles.bottomBar}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ""}`}
                onClick={() => go(item)} // PASS ENTIRE ITEM
              >
                <item.Icon
                  className={`${styles.tabIcon} ${isActive ? styles.tabIconActive : ""}`}
                />
                <span className={`${styles.tabLabel} ${isActive ? styles.tabLabelActive : ""}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div> */}
      </>
    );
  }

  // ============================================================
  //  DESKTOP COLLAPSED — icon-only strip
  // ============================================================
  if (isCollapsed) {
    return (
      <div className={styles.sidebarCollapsed}>
        <div
          className={styles.collapsedToggle}
          onClick={() => setIsCollapsed(false)}
        >
          <FaBars className={styles.menuIcon} />
        </div>

        <hr className={styles.collapsedDivider} />

        <nav className="d-flex flex-column align-items-center w-100 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.collapsedNavItem} ${isActive ? styles.collapsedNavItemActive : ""}`}
                onClick={() => go(item)} // PASS ENTIRE ITEM
                title={item.label}
              >
                <item.Icon
                  className={`${styles.collapsedNavIcon} ${isActive ? styles.collapsedNavIconActive : ""}`}
                />
              </div>
            );
          })}
        </nav>

        <Logo collapsed />
      </div>
    );
  }

  // ============================================================
  //  DESKTOP EXPANDED — full sidebar
  // ============================================================
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Student</span>
        <FaBars
          className={styles.menuIcon}
          onClick={() => setIsCollapsed(true)}
        />
      </div>

      <ProfileCard />
      <NavList />
      <Logo />
    </div>
  );
}
