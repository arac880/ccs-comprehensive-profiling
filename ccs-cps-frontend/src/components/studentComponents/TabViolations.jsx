import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

/* Severity → badge color mapping */
const severityColor = {
  Minor: styles.badgeAmber,
  Major: styles.badgeRed,
};

export default function TabViolations({ violations = [] }) {
  return (
    <div className={styles.tabWrapper}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <FiAlertTriangle size={16} style={{ marginRight: 6 }} />
            Violation Records
          </div>
        </div>

        {violations.length === 0 ? (
          <div
            className={`${styles.emptyGreen} ${styles.centerContent}`}
            style={{ gap: 8 }}
          >
            <FiCheckCircle size={20} />
            <span>No violations on record — keep it up!</span>
          </div>
        ) : (
          <div className={styles.violList}>
            {violations.map((v, idx) => (
              <div
                key={idx}
                className={`${styles.violRow} ${styles.violCard}`}
              >
                <div className={styles.violLeft}>
                  <FiAlertTriangle
                    className={styles.violIcon}
                    size={20}
                    style={{ flexShrink: 0, marginRight: 12 }}
                  />

                  <div style={{ flex: 1 }}>
                    <div className={styles.violTitle}>{v.offense ?? v.description}</div>
                    <div className={styles.violDate}>{v.date}</div>

                    {v.sanction && (
                      <div className={styles.violSanction}>
                        <strong>Sanction:</strong> {v.sanction}
                        {v.warningLevel && ` (${v.warningLevel})`}
                      </div>
                    )}
                  </div>

                  {v.severity && (
                    <span
                      className={`${styles.badge} ${
                        severityColor[v.severity] ?? styles.badgeAmber
                      } ${styles.violBadgeEnhanced}`}
                    >
                      {v.severity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}