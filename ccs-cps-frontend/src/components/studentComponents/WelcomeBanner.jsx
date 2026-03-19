import styles from "../../pages/studentPages/studentStyles/WelcomeBanner.module.css";

export default function WelcomeBanner() {
  return (
    <div className={styles.card}>
      {/* "Welcome  to  the  CCS" on one baseline row */}
      <div className={styles.headingRow}>
        <span className={styles.headingText}>Welcome&nbsp; to&nbsp; the&nbsp;</span>
        <span className={styles.accentCCS}>CCS</span>
      </div>

      {/* Subtitle */}
      <p className={styles.sub}>Comprehensive Profiling System</p>
    </div>
  );
}