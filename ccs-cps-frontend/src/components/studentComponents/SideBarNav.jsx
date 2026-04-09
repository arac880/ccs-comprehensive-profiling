import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/SideBarNav.module.css";
import ccsLogo from "../../assets/ccs_logo.png";
import { useAuth } from "../../context/AuthContext"; //importing the AuthContext

import { RiDashboardHorizontalFill } from "react-icons/ri";
import {
  FaCalendarDays,
  FaCalendarCheck,
  FaBookOpen,
  FaClipboardCheck,
  FaBars,
  FaXmark,
  FaCircleUser,
} from "react-icons/fa6";

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
  },
];

const MOBILE_BREAKPOINT = 992;

export default function SideNavbar({
  activeNav = "Dashboard",
  onNavigate,
  drawerOpen: externalDrawerOpen,
  onDrawerToggle,
}) {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← ADD THIS

  // ← REMOVE getStoredStudent() and DEFAULT_STUDENT
  // ← REMOVE const [student, setStudent] = useState(...)
  // ← Build student object directly from context
  const student = {
    name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "—",
    id: user?.id ?? "—",
    type: user?.type ?? "—",
    status: user?.status ?? "—",
    year: user?.year ?? "—",
    section: user?.section ?? "—",
    avatarUrl: user?.avatarUrl ?? null,
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    if (externalDrawerOpen !== undefined) {
      setDrawerOpen(externalDrawerOpen);
    }
  }, [externalDrawerOpen]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) {
        setDrawerOpen(false);
        onDrawerToggle?.(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onDrawerToggle]);

  const toggleDrawer = () => {
    const newState = !drawerOpen;
    setDrawerOpen(newState);
    onDrawerToggle?.(newState);
  };

  const go = (item) => {
    if (onNavigate) onNavigate(item.name);
    if (isMobile) {
      setDrawerOpen(false);
      onDrawerToggle?.(false);
    }
    if (item.path) navigate(item.path);
  };

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

      <div className={styles.metaRow}>
        <span className={styles.metaChip}>
          <span className={styles.metaKey}>Type:</span> {student.type}
        </span>
        <span className={styles.metaDot}>·</span>
        <span className={styles.metaChip}>
          <span className={styles.metaKey}>Status:</span> {student.status}
        </span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaChip}>
          <span className={styles.metaKey}>Year:</span> {student.year}
        </span>
        <span className={styles.metaDot}>·</span>
        <span className={styles.metaChip}>
          <span className={styles.metaKey}>Section:</span> {student.section}
        </span>
      </div>
    </div>
  );

  const NavList = () => (
    <div className={styles.navWrapper}>
      <span className={styles.navSectionLabel}>Navigation</span>
      {NAV_ITEMS.map((item) => {
        const isActive = activeNav === item.name;
        return (
          <div
            key={item.name}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            onClick={() => go(item)}
          >
            <item.Icon
              className={`${styles.navIcon} ${isActive ? styles.navIconActive : ""}`}
            />
            <span
              className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ""}`}
            >
              {item.label}
            </span>
            {isActive && <span className={styles.navActiveDot} />}
            {item.badge && (
              <span className={styles.navBadge}>{item.badge}</span>
            )}
          </div>
        );
      })}
    </div>
  );

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

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <>
        <div
          className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropShow : ""}`}
          onClick={toggleDrawer}
        />
        <div
          className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        >
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Student</span>
            <FaXmark className={styles.closeIcon} onClick={toggleDrawer} />
          </div>
          <ProfileCard />
          <NavList />
          <Logo />
        </div>
      </>
    );
  }

  // ── DESKTOP COLLAPSED ──
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
        <nav className={styles.collapsedNav}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.collapsedNavItem} ${isActive ? styles.collapsedNavItemActive : ""}`}
                onClick={() => go(item)}
                title={item.label}
              >
                <item.Icon
                  className={`${styles.collapsedNavIcon} ${isActive ? styles.collapsedNavIconActive : ""}`}
                />
                <span className={styles.collapsedTooltip}>{item.label}</span>
              </div>
            );
          })}
        </nav>
        <Logo collapsed />
      </div>
    );
  }

  // ── DESKTOP EXPANDED ──
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Student</span>
        <div
          className={styles.hamburgerBtn}
          onClick={() => setIsCollapsed(true)}
        >
          <FaBars className={styles.menuIcon} />
        </div>
      </div>
      <ProfileCard />
      <NavList />
      <Logo />
    </div>
  );
}
