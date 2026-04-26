import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/TopBarNav.module.css";
import {
  FaBell,
  FaCircleUser,
  FaArrowRightFromBracket,
  FaBars,
  FaCircle,
  FaClipboardCheck,
  FaCalendarDay,
  FaScrewdriverWrench,
  FaRegBellSlash,
  FaChalkboardUser,
} from "react-icons/fa6";

import LogoutModal from "../LogoutModal";

const socket = io("http://localhost:5000");

export default function TopNavBar({ onSignOut, onMenuClick }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    if (!userId) return;

    socket.emit("join", userId);

    socket.on("notification", (notif) => {
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "enrollment":
        return <FaClipboardCheck size={16} />;
      case "assignment":
        return <FaChalkboardUser size={16} />;
      case "reminder":
        return <FaCalendarDay size={16} />;
      case "announcement":
        return <FaScrewdriverWrench size={16} />;
      default:
        return <FaBell size={16} />;
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
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
                    <span
                      className={styles.notifMarkRead}
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </span>
                  )}
                </div>

                <div className={styles.notifList}>
                  {notifs.length > 0 ? (
                    notifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`${styles.notifItem} ${!notif.read ? styles.unreadBg : ""}`}
                      >
                        <div className={styles.notifIconWrap}>
                          {getIcon(notif.type)}
                        </div>{" "}
                        <div className={styles.notifContent}>
                          <div className={styles.notifItemHeader}>
                            <span className={styles.notifItemTitle}>
                              {notif.title || notif.type}
                            </span>
                            {!notif.read && (
                              <FaCircle
                                size={8}
                                color="#E65100"
                                className={styles.unreadDot}
                              />
                            )}
                          </div>
                          <p className={styles.notifItemMsg}>{notif.message}</p>
                          <span className={styles.notifTime}>
                            {new Date(notif.createdAt).toLocaleTimeString(
                              "en-PH",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>{" "}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyNotif}>
                      <FaRegBellSlash
                        size={32}
                        className={styles.emptyNotifIcon}
                      />
                      <span className={styles.emptyNotifText}>
                        You're all caught up!
                      </span>
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
