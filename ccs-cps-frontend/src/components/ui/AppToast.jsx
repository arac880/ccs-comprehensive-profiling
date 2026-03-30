import React, { useEffect } from "react";
import styles from "../../styles/AppToast.module.css";

const AppToast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const iconClass =
    type === "success"
      ? "bi-check-circle-fill"
      : type === "error"
        ? "bi-exclamation-octagon-fill"
        : "bi-info-circle-fill";

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${styles[type]}`}>
        <i className={`bi ${iconClass}`} style={{ fontSize: "18px" }} />
        <p className={styles.toastText}>{message}</p>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
      </div>
    </div>
  );
};

export default AppToast;
