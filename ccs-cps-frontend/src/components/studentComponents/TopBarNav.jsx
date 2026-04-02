import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/TopBarNav.module.css";

// React Icons — FA6
import { FaBell, FaCircleUser, FaArrowRightFromBracket } from "react-icons/fa6";

export default function TopNavBar({ notifCount = 0, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut(); // call logout logic (e.g. clear token)
    }
    navigate("/login");
  };

  return (
    <nav
      className={`${styles.topNav} d-flex align-items-center justify-content-between px-3 px-md-4 w-100`}
    >
      {/* Left: Brand */}
      <div className="d-flex flex-column justify-content-center">
        <span className={styles.brandTitle}>CCS</span>
        <span className={styles.brandSub}>Comprehensive Profiling System</span>
      </div>

      {/* Right: Icons */}
      <div className={styles.iconGroup}>
        {/* Notification */}
        <div
          className={styles.notifWrap}
          role="button"
          title="Notifications"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/student/notifications")}
        >
          <FaBell size={20} className={styles.actionIcon} />
          {notifCount > 0 && (
            <span className={styles.notifBadge}>{notifCount}</span>
          )}
        </div>

        {/* Profile */}
        <FaCircleUser
          size={22}
          className={styles.actionIcon}
          onClick={() => navigate("/student/profile")}
          title="Profile"
          style={{ cursor: "pointer" }}
        />

        {/* Sign out */}
        <FaArrowRightFromBracket
          size={21}
          className={styles.actionIcon}
          onClick={handleSignOut}
          title="Sign Out"
          style={{ cursor: "pointer" }}
        />
      </div>
    </nav>
  );
}
