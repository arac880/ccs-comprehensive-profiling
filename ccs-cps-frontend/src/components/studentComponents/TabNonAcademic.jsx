// components/studentComponents/TabNonAcademic.jsx
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiStar, FiEdit2, FiPlus } from "react-icons/fi";

const CAT_COLOR = {
  Competition: `${styles.badge} ${styles.badgeOrange}`,
  Event:       `${styles.badge} ${styles.badgeBlue}`,
  Seminar:     `${styles.badge} ${styles.badgeGreen}`,
  Workshop:    `${styles.badge} ${styles.badgeAmber}`,
};

export default function TabNonAcademic({ activities }) {
  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Activities &amp; Recognitions</div>
          <div className={styles.headerActions}>
            <button className={styles.addBtn} title="Add Activity">
              <FiPlus size={13} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {activities.length === 0 ? (
          <p className={styles.empty}>No activities recorded.</p>
        ) : (
          <div className={styles.cardGrid}>
            {activities.map((act, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{act.title}</div>
                  <div className={styles.cardActions}>
                    <button className={styles.iconBtn} title="Edit">
                      <FiEdit2 size={13} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span className={CAT_COLOR[act.category] || `${styles.badge} ${styles.badgeBlue}`}>
                    {act.category}
                  </span>
                  <span className={styles.cardMetaYear}>{act.year}</span>
                </div>

                <div className={styles.badgeRow}>
                  {act.role && <span className={`${styles.badge} ${styles.badgeOrange}`}>{act.role}</span>}
                  {act.placement && <span className={`${styles.badge} ${styles.badgeAmber}`}>🏆 {act.placement}</span>}
                </div>

                {act.description && <p className={styles.cardDesc}>{act.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}