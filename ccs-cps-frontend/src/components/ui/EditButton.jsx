import { FiEdit2 } from "react-icons/fi";
import styles from "../../styles/EditButton.module.css";

export default function EditButton({
  onClick,
  label = "Edit",
  iconOnly = false,
}) {
  return (
    <button
      className={`${styles.editBtn} ${iconOnly ? styles.iconOnly : ""}`}
      onClick={onClick}
      title="Edit"
    >
      <FiEdit2 size={14} className={styles.icon} />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
