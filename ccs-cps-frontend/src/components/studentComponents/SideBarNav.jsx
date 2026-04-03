import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/SideBarNav.module.css";
import ccsLogo from "../../assets/ccs_logo.png";
import Footer from "../../components/Footer";

import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaCalendarDays } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";

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

// Fallback if localStorage has nothing yet
const DEFAULT_STUDENT = {
  name: "—",
  id: "—",
  status: "—",
  year: "—",
  section: "—",
  avatarUrl: null,
};

const MOBILE_BREAKPOINT = 992;

// ── Helper: read & shape the stored user ──────────────────────
function getStoredStudent() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return DEFAULT_STUDENT;

    const u = JSON.parse(raw);

    return {
      name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—",
      id: u.id ?? "—",
      status: u.status ?? "—", // "Regular" or "Irregular"
      year: u.year ?? "—", // "4th Year"
      section: u.section ?? "—", // "D"
      avatarUrl: u.avatarUrl ?? null,
    };
  } catch {
    return DEFAULT_STUDENT;
  }
}

export default function SideNavbar({
  activeNav = "Dashboard",
  onNavigate,
  // Accept an override prop, but default to localStorage data
  student: studentProp,
}) {
  const navigate = useNavigate();

  // Use prop if explicitly passed, otherwise pull from localStorage
  const [student, setStudent] = useState(studentProp ?? getStoredStudent());

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  // Re-read localStorage whenever the component mounts (e.g. after login redirect)
  useEffect(() => {
    if (!studentProp) {
      setStudent(getStoredStudent());
    }
  }, [studentProp]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (item) => {
    if (onNavigate) onNavigate(item.name);
    if (isMobile) setDrawerOpen(false);
    if (item.path) navigate(item.path);
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
      <p className={styles.studentMeta}>Status: {student.status}</p>
      <p className={styles.studentMeta}>Year Level: {student.year}</p>
      <p className={styles.studentMeta}>Section: {student.section}</p>
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

  // ── MOBILE ────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
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

        <div
          className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropShow : ""}`}
          onClick={() => setDrawerOpen(false)}
        />

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
      </>
    );
  }

  // ── DESKTOP COLLAPSED ─────────────────────────────────────────
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
                onClick={() => go(item)}
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

  // ── DESKTOP EXPANDED ──────────────────────────────────────────
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
