import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCircleUser,
  FaArrowRightFromBracket,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import styles from "../../pages/facultyPages/facultyStyles/TopNavbar.module.css";
import LogoutModal from "../LogoutModal";

export default function TopBar({ notifCount = 0, onMenuClick, mobileOpen }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`${styles.topNav} d-flex align-items-center justify-content-between px-3 px-md-4 w-100`}
        style={{ zIndex: 1035 }}
      >
        {/* Left: Hamburger (mobile) + Brand */}
        <div className="d-flex align-items-center gap-3">
          {mobileOpen ? (
            <FaXmark
              className={`${styles.hamburgerIcon} d-lg-none text-white`}
              size={22}
              onClick={onMenuClick}
              style={{ pointerEvents: "auto", zIndex: 1040 }}
            />
          ) : (
            <FaBars
              className={`${styles.hamburgerIcon} d-lg-none text-white`}
              size={22}
              onClick={onMenuClick}
              style={{ pointerEvents: "auto", zIndex: 1040 }}
            />
          )}

          <div
            className="d-flex flex-column"
            style={{ justifyContent: "center" }}
          >
            <span className={styles.brandTitle}>CCS</span>
            <span className={`${styles.brandSub} d-none d-sm-block`}>
              Comprehensive Profiling System
            </span>
          </div>
        </div>

        {/* Right: Icons */}
        <div className={styles.iconGroup}>
          {/* Bell */}
          <div className={styles.notifWrap}>
            <div className={styles.iconBtn}>
              <FaBell size={20} className={styles.actionIcon} />
              {notifCount > 0 && (
                <span className={styles.notifBadge}>{notifCount}</span>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className={styles.iconBtn}>
            <FaCircleUser size={22} className={styles.actionIcon} />
          </div>

          {/* Sign out */}
          <div className={styles.iconBtn} onClick={() => setShowLogout(true)}>
            <FaArrowRightFromBracket size={21} className={styles.actionIcon} />
          </div>
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
