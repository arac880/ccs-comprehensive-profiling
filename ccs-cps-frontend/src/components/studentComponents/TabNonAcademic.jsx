// components/studentComponents/TabNonAcademic.jsx
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import AddButton from "../../components/ui/AddButton";
import EditButton from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";

const CAT_COLOR = {
  Competition: `${styles.badge} ${styles.badgeOrange}`,
  Event: `${styles.badge} ${styles.badgeBlue}`,
  Seminar: `${styles.badge} ${styles.badgeGreen}`,
  Workshop: `${styles.badge} ${styles.badgeAmber}`,
};

export default function TabNonAcademic({ activities }) {
  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            Activities &amp; Recognitions
          </div>
          <div className={styles.headerActions}>
            <AddButton onClick={() => console.log("Add activity")} />
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
                    <DeleteButton
                      iconOnly
                      onClick={() => console.log("Delete activity:", act)}
                    />
                    <EditButton
                      iconOnly
                      onClick={() => console.log("Edit activity:", act)}
                    />
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span
                    className={
                      CAT_COLOR[act.category] ||
                      `${styles.badge} ${styles.badgeBlue}`
                    }
                  >
                    {act.category}
                  </span>
                  <span className={styles.cardMetaYear}>{act.year}</span>
                </div>
                {act.description && (
                  <p className={styles.cardDesc}>{act.description}</p>
                )}
                {act.date && (
                  <div className={styles.cardDate}>
                    {new Date(act.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
