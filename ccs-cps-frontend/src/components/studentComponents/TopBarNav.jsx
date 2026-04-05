import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/TopBarNav.module.css";
import {
  FaBell,
  FaCircleUser,
  FaArrowRightFromBracket,
  FaBars,
  FaCircle,
  FaAward,
  FaClipboardCheck,
  FaCalendarDay,
  FaScrewdriverWrench,
  FaRegBellSlash, 
  FaChalkboardUser,
} from "react-icons/fa6";

import LogoutModal from "../LogoutModal";

// ── DUMMY NOTIFICATION DATA ──
const DUMMY_NOTIFS = [
  { id: 1, type: "clearance", title: "Clearance Update", message: "Library clearance status changed to Cleared.", time: "2 hours ago", unread: true, icon: <FaClipboardCheck size={16} /> },
  { id: 2, type: "action", title: "Action Required", message: "You have pending instructor evaluations to complete for the current semester.", time: "1 day ago", unread: false, icon: <FaChalkboardUser size={16} /> },  
  { id: 3, type: "event", title: "Upcoming Event", message: "General Assembly starts tomorrow at 8 AM.", time: "1 day ago", unread: true, icon: <FaCalendarDay size={16} /> },
  { id: 4, type: "system", title: "System Maintenance", message: "System down for maintenance this Saturday.", time: "3 days ago", unread: false, icon: <FaScrewdriverWrench size={16} /> },
];

export default function TopNavBar({ onSignOut, onMenuClick }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(DUMMY_NOTIFS);
  const notifRef = useRef(null);
  
  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, unread: false })));
  };

  const handleMenuClick = (e) => {
    console.log("TopNav hamburger clicked!");
    onMenuClick?.(e);
  };

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
        <div className="d-flex align-items-center gap-3">
          <FaBars
            className={`${styles.hamburgerIcon} d-lg-none text-white`}
            size={22}
            onClick={handleMenuClick}
            style={{ pointerEvents: "auto", zIndex: 1040 }}
          />

          <div className="d-flex flex-column justify-content-center">
            <span className={styles.brandTitle}>CCS</span>
            <span className={`${styles.brandSub} d-none d-sm-block`}>
              Comprehensive Profiling System
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          
          {/* ── NOTIFICATION WRAPPER ── */}
          <div className={styles.notifWrap} ref={notifRef}>
            <div
              className={`${styles.iconBtn} ${showNotif ? styles.iconBtnActive : ""}`}
              onClick={() => setShowNotif(!showNotif)}
            >
              <FaBell size={20} className={styles.actionIcon} />
              {unreadCount > 0 && (
                <span className={styles.notifBadge}>{unreadCount}</span>
              )}
            </div>

            {/* Notification Dropdown Panel */}
            {showNotif && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifHeaderTitle}>Notifications</span>
                  {unreadCount > 0 && (
                    <span className={styles.notifMarkRead} onClick={markAllAsRead}>
                      Mark all as read
                    </span>
                  )}
                </div>
                
                <div className={styles.notifList}>
                  {notifs.length > 0 ? (
                    notifs.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`${styles.notifItem} ${notif.unread ? styles.unreadBg : ""}`}
                      >
                        <div className={styles.notifIconWrap}>
                          {notif.icon}
                        </div>
                        <div className={styles.notifContent}>
                          <div className={styles.notifItemHeader}>
                            <span className={styles.notifItemTitle}>{notif.title}</span>
                            {notif.unread && <FaCircle size={8} color="#E65100" className={styles.unreadDot} />}
                          </div>
                          <p className={styles.notifItemMsg}>{notif.message}</p>
                          <span className={styles.notifTime}>{notif.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyNotif}>
                      <FaRegBellSlash size={32} className={styles.emptyNotifIcon} />
                      <span className={styles.emptyNotifText}>You're all caught up!</span>
                    </div>
                  )}
                </div>

                <div 
                  className={styles.notifFooter}
                  onClick={() => {
                    setShowNotif(false);
                    navigate("/student/"); 
                  }}
                >
                  View All Notifications
                </div>
              </div>
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
            onClick={() => setShowLogout(true)}
          />
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