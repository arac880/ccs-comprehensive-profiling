import { FaLaptopCode } from "react-icons/fa";
import styles from "../../pages/studentPages/studentStyles/WelcomeBanner.module.css";

export default function WelcomeBanner({
  studentName = "Student",
  program = "BSCS — 3rd Year",
  semester = "2nd Semester • A.Y. 2024–2025",
}) {
  return (
    <div className={styles.card}>
      {/* Text side */}
      <div className={styles.textBlock}>
        <div className={styles.greeting}>Good day, {studentName}</div>

        {/* "Welcome to the CCS" headline */}
        <div className={styles.headingRow}>
          <span className={styles.headingText}>Welcome&nbsp;to&nbsp;the&nbsp;</span>
          <span className={styles.accentCCS}>CCS</span>
        </div>

        <p className={styles.sub}>Comprehensive Profiling System</p>

        <span className={styles.badge}>
          <i className="bi bi-patch-check-fill" />
          {semester}
        </span>
      </div>

      {/* Illustration side */}
      <div className={styles.illustBlock}>
        <div className={styles.iconTile}>
          <FaLaptopCode />
        </div>
        <span className={styles.iconCaption}>{program}</span>
      </div>
    </div>
  );
}