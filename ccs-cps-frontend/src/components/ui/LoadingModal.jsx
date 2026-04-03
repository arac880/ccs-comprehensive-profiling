import React from "react";
import { FaGraduationCap, FaIdBadge } from "react-icons/fa6";
import styles from "../../styles/LoadingModal.module.css";

const StudentIcon = () => (
  <FaGraduationCap size={36} color="#e65100" style={{ opacity: 0.9 }} />
);

const FacultyIcon = () => (
  <FaIdBadge size={36} color="#e65100" style={{ opacity: 0.9 }} />
);

const LoadingModal = ({
  isVisible,
  role = "student",
  progress = 0,
  userName = "",
}) => {
  if (!isVisible) return null;

  const isStudent = role === "student";

  const config = isStudent
    ? {
        Icon: StudentIcon,
        badge: "Student Portal",
        title: userName
          ? `Welcome, ${userName}`
          : "Accessing Student Dashboard",
        sub: "Please wait while we load your student portal",
        status: "Loading academic records...",
      }
    : {
        Icon: FacultyIcon,
        badge: "Faculty Portal",
        title: userName
          ? `Welcome, ${userName}`
          : "Accessing Faculty Dashboard",
        sub: "Please wait while we load your faculty workspace",
        status: "Loading faculty dashboard...",
      };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.accentStrip} />
        <div className={styles.body}>
          <div className={styles.iconWrap}>
            <config.Icon />
          </div>

          <span className={styles.roleBadge}>{config.badge}</span>

          <h2 className={styles.title}>{config.title}</h2>
          <p className={styles.sub}>{config.sub}</p>

          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className={styles.progressMeta}>
              <span className={styles.progressStatus}>{config.status}</span>
              <span className={styles.progressPct}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className={styles.dots}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
