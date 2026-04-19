// components/facultyComponents/FacultyProfileCard.jsx
import { useRef, useState, useEffect } from "react";
import styles from "../../pages/facultyPages/facultyStyles/facultyProfileCard.module.css";

const ROLE_COLOR = {
  Dean: { bg: "#fff3e0", color: "#e65100", border: "#ffb74d" },
  "Department Chair": { bg: "#e8f5e9", color: "#2e7d32", border: "#81c784" },
  Secretary: { bg: "#e3f2fd", color: "#1565c0", border: "#64b5f6" },
  Faculty: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ba68c8" },
};

const STATUS_COLOR = {
  Plantilla: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  "Contract of Service": { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Contractual: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  "Part time": { bg: "#faf5ff", color: "#6d28d9", border: "#c4b5fd" },
};

function getInitials(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getFacultyFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—",
      facultyId: u.id ?? "—",
      role: u.role ?? "Faculty",
      department: u.department ?? "—",
      status: u.status ?? null,
      email: u.email ?? "—",
      avatarUrl: u.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

export default function FacultyProfileCard() {
  const [faculty, setFaculty] = useState(getFacultyFromStorage);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const onStorage = () => setFaculty(getFacultyFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!faculty) return null;

  const roleStyle = ROLE_COLOR[faculty.role] ?? ROLE_COLOR["Faculty"];
  const statusStyle = faculty.status
    ? (STATUS_COLOR[faculty.status] ?? null)
    : null;

  const handleCamClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const displaySrc = previewUrl ?? faculty.avatarUrl;

  return (
    <div className={styles.heroCard}>
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
              {getInitials(faculty.fullName)}
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
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zm7-10h-1.6l-1.67-2H8.27L6.6 5.5H5A2.5 2.5 0 0 0 2.5 8v11A2.5 2.5 0 0 0 5 21.5h14a2.5 2.5 0 0 0 2.5-2.5V8A2.5 2.5 0 0 0 19 5.5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={styles.heroInfo}>
          <h2 className={styles.heroName}>{faculty.fullName}</h2>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaItem}>
              <i className="bi bi-card-text" />
              {faculty.facultyId}
            </span>
            <span className={styles.heroMetaDivider} />
            <span className={styles.heroMetaItem}>
              <i className="bi bi-envelope" />
              {faculty.email}
            </span>
            {faculty.department && faculty.department !== "—" && (
              <>
                <span className={styles.heroMetaDivider} />
                <span className={styles.heroMetaItem}>
                  <i className="bi bi-diagram-2" />
                  {faculty.department}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className={styles.badgeWrap}>
          <span
            className={styles.badge}
            style={{
              background: roleStyle.bg,
              color: roleStyle.color,
              border: `1.5px dashed ${roleStyle.border}`,
            }}
          >
            {faculty.role}
          </span>
          {statusStyle && (
            <span
              className={styles.badge}
              style={{
                background: statusStyle.bg,
                color: statusStyle.color,
                border: `1.5px dashed ${statusStyle.border}`,
              }}
            >
              {faculty.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
