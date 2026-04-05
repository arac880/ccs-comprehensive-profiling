import { FaFilePdf } from "react-icons/fa6";
import { BsArrowRightShort } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "../../pages/studentPages/studentStyles/ResearchCard.module.css";

export default function ResearchCard({ title, uploadedAt, fileUrl = "#", index }) {
  return (
    <a
      href={fileUrl}
      className={styles.docRow}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open research: ${title}`}
    >
      {/* Index number */}
      {index !== undefined && (
        <span className={styles.docIndex}>
          {String(index).padStart(2, "0")}
        </span>
      )}

      {/* PDF icon */}
      <div className={styles.docIconWrap}>
        <FaFilePdf size={20} className={styles.docIcon} />
      </div>

      {/* Info */}
      <div className={styles.docInfo}>
        <h4 className={styles.docTitle}>{title}</h4>
        <span className={styles.docMeta}>
          <FaCalendarAlt size={10} />
          Uploaded: {uploadedAt}
        </span>
      </div>

      {/* CTA */}
      <div className={styles.docAction}>
        <span className={styles.actionText}>View PDF</span>
        <BsArrowRightShort size={22} className={styles.actionIcon} />
      </div>
    </a>
  );
}