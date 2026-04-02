import styles from "./styles/Footer.module.css";

export default function CCSFooter({ version = "v1.0" }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Left: System Branding */}
      <div className={styles.left}>
        <div className={styles.sysName}>
          <span className={styles.bold}>CCS</span>
          <span className={styles.sep}>|</span>
          <span className={styles.thin}>Comprehensive Profiling System</span>
          <span className={styles.version}>{version}</span>
        </div>
      </div>

      {/* Right: Copyright & Year */}
      <div className={styles.right}>
        <span className={styles.copyright}>© {year} All Rights Reserved</span>
      </div>
    </footer>
  );
}
