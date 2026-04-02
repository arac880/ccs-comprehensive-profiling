import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import DeleteButton from "../../components/ui/DeleteButton";
import AddButton from "../../components/ui/AddButton";

export default function TabSkills({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Skills &amp; Proficiencies</div>
          <div className={styles.headerActions}>
            <AddButton
              title="Add Skill"
              onClick={() => console.log("Add Skill")}
            />
          </div>
        </div>

        {/* ✅ CATEGORY COLUMNS */}
        <div className={styles.skillColumns}>
          {categories.map((cat) => (
            <div key={cat} className={styles.skillColumn}>
              <div className={styles.skillCat}>{cat}</div>

              <ul className={styles.skillList}>
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill, i) => (
                    <li key={i} className={styles.skillItem}>
                      <span>{skill.name}</span>

                      <DeleteButton
                        iconOnly
                        onClick={() => console.log("Delete skill:", skill)}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
