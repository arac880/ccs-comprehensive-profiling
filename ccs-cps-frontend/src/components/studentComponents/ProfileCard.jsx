// components/studentComponents/ProfileCard.jsx
import { useRef, useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import EditButton from "../../components/ui/EditButton";
import styles from "../../pages/studentPages/studentStyles/ProfileCard.module.css";

const TYPE_COLOR = {
  Regular: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Irregular: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Dropout: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  LOA: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Graduated: { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
};

const STATUS_COLOR = {
  Enrolled: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Not Enrolled": { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Pending: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Graduated: { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
};

function getStudentFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—",
      studentNumber: u.id ?? "—",
      yearLevel: u.year ?? "—",
      section: u.section ?? "—",
      program: u.program ?? "—",
      type: u.type ?? "Regular",
      status: u.status ?? "Enrolled",
      avatarUrl: u.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

export default function ProfileCard() {
  const [student, setStudent] = useState(getStudentFromStorage);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const onStorage = () => setStudent(getStudentFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!student) return null;

  const typeStyle = TYPE_COLOR[student.type] ?? TYPE_COLOR["Regular"];
  const statusStyle = STATUS_COLOR[student.status] ?? STATUS_COLOR["Enrolled"];

  const handleCamClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

 return (
  <div className={styles.heroCard}>
    {/* Hidden file input */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleFileChange}
    />

    {/* Avatar */}
    <div className={styles.heroAvatarWrap}>
      {previewUrl || student.avatarUrl ? (
        <img
          src={previewUrl ?? student.avatarUrl}
          alt="Profile"
          className={styles.heroAvatarImg}
        />
      ) : (
        <div className={styles.heroAvatar}>
          <FaUserCircle size={40} />
        </div>
      )}

      <div className={styles.editOverlay}>
        <EditButton iconOnly onClick={handleCamClick} />
      </div>
    </div>

    {/* Info */}
    <div className={styles.heroInfo}>
      <h2 className={styles.heroName}>{student.fullName}</h2>

      <div className={styles.heroMeta}>
        <span className={styles.heroMetaItem}>
          <i className="bi bi-card-text" />
          {student.studentNumber}
        </span>

        <span className={styles.heroMetaItem}>
          <i className="bi bi-journal-bookmark" />
          {student.program}
        </span>

        <span className={styles.heroMetaItem}>
          <i className="bi bi-diagram-2" />
          {student.yearLevel} — Section {student.section}
        </span>
      </div>
    </div>

    {/* Badges */}
    <div className={styles.badgeWrap}>
      <span
        className={styles.badge}
        style={{
          background: typeStyle.bg,
          color: typeStyle.color,
          border: `1px solid ${typeStyle.border}`,
        }}
      >
        {student.type}
      </span>

      <span
        className={styles.badge}
        style={{
          background: statusStyle.bg,
          color: statusStyle.color,
          border: `1px solid ${statusStyle.border}`,
        }}
      >
        {student.status}
      </span>
    </div>
  </div>
);
}
