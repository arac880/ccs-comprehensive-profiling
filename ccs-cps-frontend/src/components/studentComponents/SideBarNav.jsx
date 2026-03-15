
import { useState, useEffect } from "react";
import styles from "../../pages/studentPages/studentStyles/SideBarNav.module.css";
import ccsLogo from "../../assets/ccs_logo.png";

const NAV_ITEMS = [
  { name: "Dashboard",       label: "Dashboard",        icon: "bi-grid-fill"      },
  { name: "Events",          label: "Events",           icon: "bi-calendar-event" },
  { name: "Schedule",        label: "Schedule",         icon: "bi-calendar3"      },
  { name: "CollegeResearch", label: "College Research", icon: "bi-journal-text"   },
  { name: "Profile",         label: "Profile",          icon: "bi-person"         },
  { name: "Clearance",       label: "Clearance",        icon: "bi-patch-check"    },
];

const DEFAULT_STUDENT = {
  name:      "Jessa V. Cariñaga",
  id:        "2001518",
  type:      "Regular",
  status:    "Enrolled",
  year:      "4th Year",
  section:   "4IT-D",
  avatarUrl: null,
};

const MOBILE_BREAKPOINT = 992;

export default function SideNavbar({
  activeNav = "Dashboard",
  onNavigate,
  student   = DEFAULT_STUDENT,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < MOBILE_BREAKPOINT);

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
    if (onNavigate) onNavigate(name);
    if (isMobile) setDrawerOpen(false);
  };

  // ── Profile card (reused in expanded sidebar + drawer) ──────
  const ProfileCard = () => (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>
        {student.avatarUrl
          ? <img src={student.avatarUrl} alt={student.name} className={styles.avatarImg} />
          : <i className={`bi bi-person-fill ${styles.avatarIcon}`} />
        }
      </div>
      <p className={styles.studentName}>{student.name}</p>
      <p className={styles.studentId}>{student.id}</p>
      <hr className={styles.profileDivider} />
      <p className={styles.studentMeta}>Type: {student.type}</p>
      <p className={styles.studentMeta}>Status: {student.status}</p>
      <p className={styles.studentMeta}>Current Year Level: {student.year}</p>
      <p className={styles.studentMeta}>Section/s Enrolled: {student.section}</p>
    </div>
  );

  // ── Nav list (reused in expanded sidebar + drawer) ──────────
  // Uses separate active/inactive classes — no CSS chaining
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
              <i className={`bi ${item.icon} ${styles.navIcon} ${isActive ? styles.navIconActive : ""}`} />
              <span className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ""}`}>
                {item.label}
              </span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </div>
            {index < NAV_ITEMS.length - 1 && <hr className={styles.navDivider} />}
          </div>
        );
      })}
    </div>
  );

  // ── CCS logo watermark (pinned to bottom via margin-top:auto) ──
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
          <i
            className={`bi bi-list ${styles.mobileHamburger}`}
            onClick={() => setDrawerOpen(true)}
          />
          <span className={styles.mobileTopBarTitle}>Student Portal</span>
          <div className={styles.mobileTopBarAvatar}>
            {student.avatarUrl
              ? <img src={student.avatarUrl} alt={student.name} />
              : <i className="bi bi-person-fill" style={{ color: "#fff", fontSize: "1rem" }} />
            }
          </div>
        </div>

        {/* Backdrop — tap outside to close */}
        <div
          className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropShow : ""}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Sliding drawer — position:fixed, overlays everything */}
        <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Student</span>
            <i
              className={`bi bi-x-lg ${styles.closeIcon}`}
              onClick={() => setDrawerOpen(false)}
            />
          </div>
          <ProfileCard />
          <NavList />
          <Logo />   {/* logo pinned to bottom of drawer */}
        </div>

        {/* Fixed bottom tab bar */}
        <div className={styles.bottomBar}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <div
                key={item.name}
                className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ""}`}
                onClick={() => go(item.name)}
              >
                <i className={`bi ${item.icon} ${styles.tabIcon} ${isActive ? styles.tabIconActive : ""}`} />
                <span className={`${styles.tabLabel} ${isActive ? styles.tabLabelActive : ""}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  }


  // ============================================================
  //  DESKTOP COLLAPSED — icon-only strip
  // ============================================================
  if (isCollapsed) {
    return (
      <div className={styles.sidebarCollapsed}>
        <div className={styles.collapsedToggle} onClick={() => setIsCollapsed(false)}>
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
                <i className={`bi ${item.icon} ${styles.collapsedNavIcon} ${isActive ? styles.collapsedNavIconActive : ""}`} />
              </div>
            );
          })}
        </nav>

        <Logo collapsed />  {/* pinned to bottom */}
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
        <i
          className={`bi bi-list ${styles.menuIcon}`}
          onClick={() => setIsCollapsed(true)}
        />
      </div>

      <ProfileCard />
      <NavList />
      <Logo />  {/* margin-top:auto pushes this to very bottom */}
    </div>
  );
}