import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/NotificationPage.module.css";

import {
  FaBell,
  FaRegBellSlash,
  FaCircle,
  FaClipboardCheck,
  FaCalendarDay,
  FaScrewdriverWrench,
  FaTriangleExclamation,
  FaChalkboardUser,
  FaCalendarDays,
} from "react-icons/fa6";
import { BsGraphUp } from "react-icons/bs";

const FILTERS = [
  "All",
  "Unread",
  "Enrollment",
  "Violation",
  "Assignment",
  "Announcement",
];

const TYPE_COLORS = {
  enrollment: { dot: "#388E3C" },
  violation: { dot: "#E65100" },
  assignment: { dot: "#1565C0" },
  announcement: { dot: "#6A1B9A" },
};

const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.isDean || user?.isChair ? "faculty" : "student";
const storageKey = role === "faculty" ? "faculty_notifs" : "student_notifs";

export default function NotificationPage() {
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState("All");

  const getIcon = (type) => {
    switch (type) {
      case "enrollment":
        return <FaClipboardCheck size={15} />;
      case "assignment":
        return <FaChalkboardUser size={15} />;
      case "reminder":
        return <FaCalendarDay size={15} />;
      case "announcement":
        return <FaScrewdriverWrench size={15} />;
      case "violation":
        return <FaTriangleExclamation size={15} />;
      default:
        return <FaBell size={15} />;
    }
  };

  const filtered = notifs.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.type === activeFilter.toLowerCase();
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  const typeCounts = [
    "enrollment",
    "violation",
    "assignment",
    "reminder",
    "announcement",
  ].reduce(
    (acc, t) => ({ ...acc, [t]: notifs.filter((n) => n.type === t).length }),
    {},
  );

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        setNotifs(saved ? JSON.parse(saved) : []);
      } catch {}
    };

    window.addEventListener("notifs-updated", syncFromStorage);
    return () => window.removeEventListener("notifs-updated", syncFromStorage);
  }, []);

  const markAllRead = () => {
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event("notifs-updated"));
  };

  const markOneRead = (id) => {
    setNotifs((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new Event("notifs-updated"));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifs([]);
    localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event("notifs-updated"));
  };

  const handleClick = (notif) => {
    markOneRead(notif.id);
    if (notif.type === "violation") {
      navigate("/student/profile", { state: { tab: "violations" } });
    } else if (notif.link) {
      navigate(notif.link);
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <main className={styles.pageWrapper}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}>
            <FaBell size={20} color="#ffffff" />
          </div>
          <h2 className={styles.pageTitle}>All Notifications</h2>
        </div>
        <span className={styles.headerNote}>
          <FaBell size={13} />
          {unreadCount} unread
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className={styles.contentGrid}>
        {/* ── Left: notification feed ── */}
        <div className={styles.feedWidget}>
          {/* Toolbar top */}
          <div className={styles.widgetToolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.toolbarIcon}>
                <FaBell size={15} />
              </span>
              <span className={styles.widgetTitle}>Notification Feed</span>
              <span className={styles.countBadge}>
                {filtered.length} Notifications
              </span>
            </div>
            {unreadCount > 0 && (
              <span className={styles.markAllBtn} onClick={markAllRead}>
                Mark all as read
              </span>
            )}
          </div>

          {/* Filter tabs */}
          <div className={styles.filterBar}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterTab} ${activeFilter === f ? styles.filterTabActive : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className={styles.notifList}>
            {filtered.length > 0 ? (
              filtered.map((notif) => (
                <div
                  key={notif.id}
                  className={`${styles.notifItem} ${!notif.read ? styles.unreadItem : ""}`}
                  onClick={() => handleClick(notif)}
                >
                  <div
                    className={`${styles.notifIconCircle} ${styles[`icon_${notif.type}`]}`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  <div className={styles.notifContent}>
                    <div className={styles.notifItemHeader}>
                      <span className={styles.notifItemTitle}>
                        {notif.title || notif.type}
                      </span>
                      <div className={styles.notifMeta}>
                        {!notif.read && (
                          <FaCircle
                            size={8}
                            color="#E65100"
                            className={styles.unreadDot}
                          />
                        )}
                        <span className={styles.notifTime}>
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className={styles.notifItemMsg}>{notif.message}</p>
                    <span className={styles.notifDate}>
                      <FaCalendarDays size={10} style={{ marginRight: 4 }} />
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrap}>
                  <FaRegBellSlash size={28} />
                </div>
                <p className={styles.emptyText}>No notifications here.</p>
                <p className={styles.emptyHint}>Try a different filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: stats + actions ── */}
        <aside className={styles.rightCol}>
          {/* Stats card */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHeader}>
              <span className={styles.sideCardIcon}>
                <BsGraphUp size={14} />
              </span>
              <span className={styles.sideCardTitle}>Notification Stats</span>
            </div>
            <div className={styles.sideCardBody}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>{notifs.length}</span>
              </div>
              <hr className={styles.statDivider} />
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Unread</span>
                <span className={styles.statValue}>{unreadCount}</span>
              </div>
              <hr className={styles.statDivider} />

              {/* Per-type breakdown */}
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className={styles.typeRow}>
                  <span className={styles.typeLabel}>
                    <span
                      className={styles.typeDot}
                      style={{ background: TYPE_COLORS[type]?.dot }}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span className={styles.typeCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip card */}
          <div className={styles.tipCard}>
            <strong>Tip:</strong> Use the filter tabs to sort by category. Click
            a notification to go directly to the relevant page.
          </div>

          {/* Clear all */}
          {notifs.length > 0 && (
            <button className={styles.clearAllBtn} onClick={clearAll}>
              Clear all notifications
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}
