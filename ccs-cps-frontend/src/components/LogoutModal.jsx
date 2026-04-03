import { useEffect, useRef } from "react";
import { LuLogOut } from "react-icons/lu";
import AppButton from "./ui/AppButton";
import styles from "../styles/LogoutModal.module.css";

export default function LogoutModal({ isOpen, onCancel, onConfirm }) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  // Trap focus inside modal
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>
        {/* Icon */}
        <div className={styles.iconWrap}>
          <LuLogOut key={isOpen} className={styles.icon} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 id="logout-title" className={styles.title}>
            Log Out
          </h2>
          <p id="logout-desc" className={styles.description}>
            Are you sure you want to logout?
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <AppButton variant="border-only" size="md" onClick={onCancel}>
            Cancel
          </AppButton>
          <AppButton variant="primary" size="md" onClick={onConfirm}>
            Logout
          </AppButton>
        </div>
      </div>
    </div>
  );
}
