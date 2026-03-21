import styles from "../../pages/studentPages/studentStyles/TopBarNav.module.css";

export default function TopNavBar({ notifCount = 0, onSignOut }) {
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
        {/* Notification bell */}
        <div className={styles.notifWrap}>
          <i className={`bi bi-bell-fill ${styles.actionIcon}`} />
          {notifCount > 0 && (
            <span className={styles.notifBadge}>{notifCount}</span>
          )}
        </div>

        {/* Sign out */}
        <i
          className={`bi bi-box-arrow-right ${styles.actionIcon}`}
          onClick={onSignOut}
          title="Sign Out"
        />
      </div>
    </nav>
  );
}
