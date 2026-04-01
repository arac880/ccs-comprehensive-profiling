import { FiPlus } from "react-icons/fi";
import styles from "../../styles/AddButton.module.css";

export default function AddButton({ onClick, title = "Add", size = 13 }) {
  return (
    <button className={styles.addBtn} title={title} onClick={onClick}>
      <FiPlus size={size} />
      <span>{title}</span>
    </button>
  );
}