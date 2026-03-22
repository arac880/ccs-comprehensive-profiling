import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/SideBarNav.module.css";
import ccsLogo from "../../assets/ccs_logo.png";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: "bi-grid-fill",
    path: "/student/dashboard",
  },
  {
    name: "Events",
    label: "Events",
    icon: "bi-calendar-event",
    path: "/student/events",
  },
  {
    name: "Schedule",
    label: "Schedule",
    icon: "bi-calendar3",
    path: "/student/schedule",
  },
  {
    name: "CollegeResearch",
    label: "College Research",
    icon: "bi-journal-text",
    path: "/student/college-research",
  },
  {
    name: "Profile",
    label: "Profile",
    icon: "bi-person",
    path: "/student/profile",
  },
  {
    name: "Clearance",
    label: "Clearance",
    icon: "bi-patch-check",
    path: "/student/clearance",
  },
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

export default function SideNavbar({ student = DEFAULT_STUDENT }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.name ??
    "Dashboard";

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

  const go = (name) => {
    const item = NAV_ITEMS.find((i) => i.name === name);
    if (item) navigate(item.path);
    if (isMobile) setDrawerOpen(false);
  };

  // ── Profile card ────────────────────────────────────────────
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
          <i className={`bi bi-person-fill ${styles.avatarIcon}`} />
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

  // ── Nav list ─────────────────────────────────────────────────
  const NavList = () => (
    <div className={styles.navWrapper}>
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeNav === item.name;
        return (
          <div key={item.name}>
            <div
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => go(item.name)}
            >
              <i
                className={`bi ${item.icon} ${styles.navIcon} ${isActive ? styles.navIconActive : ""}`}
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

  // ── Logo ─────────────────────────────────────────────────────
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

  // ── MOBILE ───────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div className={styles.mobileTopBar}>
          <i
            className={`bi bi-list ${styles.mobileHamburger}`}
            onClick={() => setDrawerOpen(true)}
          />
          <span className={styles.mobileTopBarTitle}>Student Portal</span>
          <div className={styles.mobileTopBarAvatar}>
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.name} />
            ) : (
              <i
                className="bi bi-person-fill"
                style={{ color: "#fff", fontSize: "1rem" }}
              />
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
            <i
              className={`bi bi-x-lg ${styles.closeIcon}`}
              onClick={() => setDrawerOpen(false)}
            />
          </div>
          <ProfileCard />
          <NavList />
          <Logo />
        </div>

        <div className={styles.bottomBar}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ""}`}
                onClick={() => go(item.name)}
              >
                <i
                  className={`bi ${item.icon} ${styles.tabIcon} ${isActive ? styles.tabIconActive : ""}`}
                />
                <span
                  className={`${styles.tabLabel} ${isActive ? styles.tabLabelActive : ""}`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── DESKTOP COLLAPSED ────────────────────────────────────────
  if (isCollapsed) {
    return (
      <div className={styles.sidebarCollapsed}>
        <div
          className={styles.collapsedToggle}
          onClick={() => setIsCollapsed(false)}
        >
          <i className={`bi bi-list ${styles.menuIcon}`} />
        </div>

        <hr className={styles.collapsedDivider} />

        <nav className="d-flex flex-column align-items-center w-100 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.collapsedNavItem} ${isActive ? styles.collapsedNavItemActive : ""}`}
                onClick={() => go(item.name)}
                title={item.label}
              >
                <i
                  className={`bi ${item.icon} ${styles.collapsedNavIcon} ${isActive ? styles.collapsedNavIconActive : ""}`}
                />
              </div>
            );
          })}
        </nav>

        <Logo collapsed />
      </div>
    );
  }

  // ── DESKTOP EXPANDED ─────────────────────────────────────────
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Student</span>
        <i
          className={`bi bi-list ${styles.menuIcon}`}
          onClick={() => setIsCollapsed(true)}
        />
      </div>

      <ProfileCard />
      <NavList />
      <Logo />
    </div>
  );
}
