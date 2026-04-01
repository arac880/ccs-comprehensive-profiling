// components/studentComponents/TabViolations.jsx
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const SEV_BADGE = {
  Minor: `${styles.badge} ${styles.badgeAmber}`,
  Moderate: `${styles.badge} ${styles.badgeOrange}`,
  Major: `${styles.badge} ${styles.badgeRed}`,
};

const STATUS_BADGE = {
  Resolved: `${styles.badge} ${styles.badgeGreen}`,
  Pending: `${styles.badge} ${styles.badgeAmber}`,
};

export default function TabViolations({ violations }) {
  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Violation Records</div>

        {violations.length === 0 ? (
          <div className={styles.emptyGreen}>
            <FiCheckCircle size={18} />
            <span>No violations on record — keep it up!</span>
          </div>
        ) : (
          violations.map((v, idx) => (
            <div key={idx} className={styles.violRow}>
              <div className={styles.violLeft}>
                <FiAlertTriangle className={styles.violIcon} />
                <div>
                  <div className={styles.violTitle}>{v.offense}</div>
                  <div className={styles.violDate}>{v.date}</div>
                  {v.sanction && (
                    <div className={styles.violSanction}>
                      Sanction: {v.sanction}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.violRight}>
                <span
                  className={
                    SEV_BADGE[v.severity] ||
                    `${styles.badge} ${styles.badgeOrange}`
                  }
                >
                  {v.severity}
                </span>
                <span
                  className={
                    STATUS_BADGE[v.status] ||
                    `${styles.badge} ${styles.badgeGreen}`
                  }
                >
                  {v.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
