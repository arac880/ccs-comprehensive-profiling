import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCircleUser,
  FaArrowRightFromBracket,
  FaBars,
  FaXmark,
  FaCircle,
  FaClipboardCheck,
  FaChalkboardUser,
  FaCalendarDay,
  FaScrewdriverWrench,
  FaRegBellSlash,
} from "react-icons/fa6";
import styles from "../../pages/facultyPages/facultyStyles/TopNavbar.module.css";
import LogoutModal from "../LogoutModal";

let socket;
const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?._id || user?.id;
if (userId) {
  const sock = getSocket();
  sock.on("connect", () => {
    sock.emit("join", userId);
    console.log("✅ Faculty socket connected and joined:", userId);
  });
  if (sock.connected) {
    sock.emit("join", userId);
  }
}

export default function TopBar({ onMenuClick, mobileOpen }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem("faculty_notifs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const notifRef = useRef(null);

  // ✅ sync from localStorage when NotificationPage marks as read
  useEffect(() => {
    const syncNotifs = () => {
      try {
        const saved = localStorage.getItem("faculty_notifs");
        setNotifs(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener("notifs-updated", syncNotifs);
    return () => window.removeEventListener("notifs-updated", syncNotifs);
  }, []);

  // ✅ socket listener
  useEffect(() => {
    const sock = getSocket();

    const handleNotification = (notif) => {
      console.log("🔔 Faculty GOT NOTIFICATION:", notif);
      setNotifs((prev) => {
        const updated = [notif, ...prev];
        localStorage.setItem("faculty_notifs", JSON.stringify(updated));
        window.dispatchEvent(new Event("notifs-updated"));
        return updated;
      });
    };

    sock.on("notification", handleNotification);
    return () => sock.off("notification", handleNotification);
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
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem("faculty_notifs", JSON.stringify(updated));
    window.dispatchEvent(new Event("notifs-updated"));
  };

  const markOneRead = (id) => {
    setNotifs((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem("faculty_notifs", JSON.stringify(updated));
      window.dispatchEvent(new Event("notifs-updated"));
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("faculty_notifs");
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`${styles.topNav} d-flex align-items-center justify-content-between px-3 px-md-4 w-100`}
        style={{ zIndex: 1035 }}
      >
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

        <div className={styles.iconGroup}>
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
                        onClick={() => {
                          markOneRead(notif.id);
                          if (notif.link) navigate(notif.link);
                          setShowNotif(false);
                        }}
                        style={{ cursor: "pointer" }}
                        className={`${styles.notifItem} ${!notif.read ? styles.unreadBg : ""}`}
                      >
                        <div className={styles.notifIconWrap}>
                          {getIcon(notif.type)}
                        </div>
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
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
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
                    navigate("/faculty/notifications");
                  }}
                >
                  View All Notifications
                </div>
              </div>
            )}
          </div>

          <div
            className={styles.iconBtn}
            onClick={() => navigate("/faculty/profile")}
          >
            <FaCircleUser size={22} className={styles.actionIcon} />
          </div>
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
