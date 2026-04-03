import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/TopBarNav.module.css";
import {
  FaBell,
  FaCircleUser,
  FaArrowRightFromBracket,
  FaBars,
} from "react-icons/fa6";

export default function TopNavBar({ notifCount = 0, onSignOut, onMenuClick }) {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    console.log('TopNav hamburger clicked!');
    onMenuClick?.(e);
  };

  return (
    <nav
      className={`${styles.topNav} d-flex align-items-center justify-content-between px-3 px-md-4 w-100`}
      style={{ zIndex: 1035 }}
    >
      <div className="d-flex align-items-center gap-3">
        <FaBars
          className={`${styles.hamburgerIcon} d-lg-none text-white`}
          size={22}
          onClick={handleMenuClick}
          style={{ pointerEvents: 'auto', zIndex: 1040 }}
        />

        <div className="d-flex flex-column justify-content-center">
          <span className={styles.brandTitle}>CCS</span>
          <span className={`${styles.brandSub} d-none d-sm-block`}>
            Comprehensive Profiling System
          </span>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="d-flex align-items-center gap-3">
        <div
          className={styles.iconBtn}
          onClick={() => navigate("/student/notifications")}
        >
          <FaBell size={20} className={styles.actionIcon} />
          {notifCount > 0 && (
            <span className={styles.notifBadge}>{notifCount}</span>
          )}
        </div>
        <FaCircleUser
          size={22}
          className={styles.actionIcon}
          onClick={() => navigate("/student/profile")}
        />
        <FaArrowRightFromBracket
          size={21}
          className={styles.actionIcon}
          onClick={onSignOut}
        />
      </div>
    </nav>
  );
}