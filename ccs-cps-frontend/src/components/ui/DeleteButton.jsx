import styles from "../../styles/DeleteButton.module.css";
import { FiTrash2 } from "react-icons/fi";

export default function DeleteButton({ onClick, iconOnly = false }) {
  return (
    <button className={styles.deleteBtn} onClick={onClick}>
      {iconOnly ? (
        <FiTrash2 size={16} />
      ) : (
        <>
          {" "}
          <FiTrash2 size={16} /> Delete
        </>
      )}
    </button>
  );
}
