// components/studentComponents/ProfileCard.jsx
import { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import EditButton from "../../components/ui/EditButton";
import styles from "../../pages/studentPages/studentStyles/profileCard.module.css";

const STATUS_COLOR = {
  Regular: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Irregular: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Dropout: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  LOA: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Graduated: { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
};

export default function ProfileCard({ student }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const statusStyle = STATUS_COLOR[student.type] || STATUS_COLOR["Regular"];

  const handleCamClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.card}>
      {/* ── LEFT: Avatar + Name + ID ── */}
      <div className={styles.leftBlock}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Avatar with camera overlay */}
        <div className={styles.avatarWrap}>
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarDefault}>
              <FaUserCircle className={styles.avatarIcon} color="#E65100" />
            </div>
          )}

          {/* NEW Edit Button */}
          <div className={styles.editOverlay}>
            <EditButton iconOnly onClick={handleCamClick} />
          </div>
        </div>

        {/* Name & ID */}
        <div className={styles.nameBlock}>
          <div className={styles.studentName}>{student.fullName}</div>
          <div className={styles.studentId}>{student.studentNumber}</div>
        </div>
      </div>

      {/* ── Vertical divider ── */}
      <div className={styles.vDivider} />

      {/* ── RIGHT: Info fields ── */}
      <div className={styles.rightBlock}>
        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Year Level</span>
          <span className={styles.infoValue}>{student.yearLevel}</span>
        </div>

        <div className={styles.infoSep} />

        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Section</span>
          <span className={styles.infoValue}>{student.section}</span>
        </div>

        <div className={styles.infoSep} />

        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Status</span>
          <span
            className={styles.statusBadge}
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1.5px solid ${statusStyle.border}`,
            }}
          >
            {student.type}
          </span>
        </div>

        <div className={styles.infoSep} />

        <div className={styles.infoField}>
          <span className={styles.infoLabel}>Program</span>
          <span className={styles.infoValue}>{student.program}</span>
        </div>
      </div>
    </div>
  );
}
