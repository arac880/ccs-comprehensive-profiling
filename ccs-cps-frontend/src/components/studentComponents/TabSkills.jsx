// components/studentComponents/TabSkills.jsx
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiCode, FiDatabase, FiLayers, FiActivity, FiEdit2, FiPlus } from "react-icons/fi";

const CAT_ICON = {
  Programming: <FiCode size={13} />,
  Database:    <FiDatabase size={13} />,
  Design:      <FiLayers size={13} />,
  Sports:      <FiActivity size={13} />,
};

export default function TabSkills({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Skills &amp; Proficiencies</div>
          <div className={styles.headerActions}>
            <button className={styles.addBtn} title="Add Skill">
              <FiPlus size={13} />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {categories.map((cat) => (
          <div key={cat}>
            <div className={styles.skillCat}>
              {CAT_ICON[cat]} {cat}
            </div>
            <div className={styles.skillGrid}>
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <div key={i} className={styles.skillRow}>
                  <div className={styles.skillTop}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <div className={styles.skillRight}>
                      <span className={styles.skillLevel}>{skill.level}</span>
                      <button className={styles.iconBtn} title="Edit skill">
                        <FiEdit2 size={11} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.skillBar}>
                    <div className={styles.skillFill} style={{ width: `${skill.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}