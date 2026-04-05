// components/studentComponents/ProfileCard.jsx
import { useRef, useState, useEffect } from "react";
import styles from "../../pages/studentPages/studentStyles/ProfileCard.module.css";

const TYPE_COLOR = {
  Regular:   { bg: "#fff8f4", color: "#c95c10", border: "#f0a070" },
  Irregular: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Dropout:   { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  LOA:       { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  Graduated: { bg: "#faf5ff", color: "#6d28d9", border: "#c4b5fd" },
};

const STATUS_COLOR = {
  Enrolled:       { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  "Not Enrolled": { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  Pending:        { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Graduated:      { bg: "#faf5ff", color: "#6d28d9", border: "#c4b5fd" },
};

function getInitials(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getStudentFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      fullName:      `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—",
      studentNumber: u.id ?? "—",
      yearLevel:     u.year ?? "—",
      section:       u.section ?? "—",
      program:       u.program ?? "—",
      type:          u.type ?? "Regular",
      status:        u.status ?? "Enrolled",
      avatarUrl:     u.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

export default function ProfileCard() {
  const [student, setStudent]       = useState(getStudentFromStorage);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef                = useRef(null);

  useEffect(() => {
    const onStorage = () => setStudent(getStudentFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!student) return null;

  const typeStyle   = TYPE_COLOR[student.type]     ?? TYPE_COLOR["Regular"];
  const statusStyle = STATUS_COLOR[student.status] ?? STATUS_COLOR["Enrolled"];

  const handleCamClick   = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const displaySrc = previewUrl ?? student.avatarUrl;

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

      <div className={styles.heroInner}>
        {/* Avatar */}
        <div className={styles.heroAvatarWrap}>
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Profile"
              className={styles.heroAvatarImg}
            />
          ) : (
            <div className={styles.heroAvatar} onClick={handleCamClick}>
              {getInitials(student.fullName)}
            </div>
          )}
          <div className={styles.editOverlay}>
            <button
              className={styles.editBtn}
              onClick={handleCamClick}
              title="Change photo"
              type="button"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zm7-10h-1.6l-1.67-2H8.27L6.6 5.5H5A2.5 2.5 0 0 0 2.5 8v11A2.5 2.5 0 0 0 5 21.5h14a2.5 2.5 0 0 0 2.5-2.5V8A2.5 2.5 0 0 0 19 5.5z"/>
              </svg>
            </button>
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
            <span className={styles.heroMetaDivider} />
            <span className={styles.heroMetaItem}>
              <i className="bi bi-journal-bookmark" />
              {student.program}
            </span>
            <span className={styles.heroMetaDivider} />
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
              color:      typeStyle.color,
              border:     `1.5px dashed ${typeStyle.border}`,
            }}
          >
            {student.type}
          </span>
          <span
            className={styles.badge}
            style={{
              background: statusStyle.bg,
              color:      statusStyle.color,
              border:     `1.5px dashed ${statusStyle.border}`,
            }}
          >
            {student.status}
          </span>
        </div>
      </div>
    </div>
  );
}