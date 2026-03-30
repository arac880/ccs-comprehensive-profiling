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

  const config = {
    success: {
      icon: "bi-check2-circle",
      title: "Success",
    },
    error: {
      icon: "bi-exclamation-octagon",
      title: "Error",
    },
    info: {
      icon: "bi-info-circle",
      title: "Notification",
    },
  };

  const currentConfig = config[type] || config.info;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${styles[type]}`}>
        
        <div className={styles.iconWrapper}>
          <i className={`bi ${currentConfig.icon}`} />
        </div>

        <div className={styles.toastContent}>
          <h4 className={styles.toastTitle}>{currentConfig.title}</h4>
          <p className={styles.toastText}>{message}</p>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>

        <div 
          className={styles.progressBar} 
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default AppToast;