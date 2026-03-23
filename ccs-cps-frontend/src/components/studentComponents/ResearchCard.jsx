import styles from "../../pages/studentPages/studentStyles/ResearchCard.module.css";
import { FaFilePdf } from "react-icons/fa";

export default function ResearchCard({ title, uploadedAt, fileUrl = "#" }) {
  return (
    <a
      href={fileUrl}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open research: ${title}`}
    >
      {/* File icon area */}
      <div className={styles.iconWrap}>
        <FaFilePdf className={styles.icon} />
      </div>

      {/* Separator */}
      <hr className={styles.divider} />

      {/* Text info */}
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <p className={styles.meta}>Uploaded at: {uploadedAt}</p>
      </div>
    </a>
  );
}