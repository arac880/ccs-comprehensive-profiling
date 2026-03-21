
import styles from "../../pages/studentPages/studentStyles/Footer.module.css";

export default function CCSFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Left: logo + system name */}
      <div className={styles.left}>
        <div className={styles.sysName}>
          <span className={styles.bold}>CCS</span>
          <span className={styles.sep}>–</span>
          <span className={styles.thin}>Comprehensive Profiling System</span>
          <span className={styles.version}>v.1</span>
        </div>
      </div>

      {/* Right: year */}
      <div className={styles.right}>
        <span className={styles.year}>{year}</span>
      </div>
    </footer>
  );
}
