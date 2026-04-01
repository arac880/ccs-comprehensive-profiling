import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

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

                  {/* ✅ Updated Sanction Display */}
                  {v.sanction && (
                    <div className={styles.violSanction}>
                      Sanction: {v.sanction}
                      {v.warningLevel && ` (${v.warningLevel})`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
