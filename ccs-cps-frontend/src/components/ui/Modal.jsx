import React, { useEffect } from "react";
import styles from "../../styles/Modal.module.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  icon = null,
  children,
  maxWidth = "650px",
}) => {
  // Prevent the background page from scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* e.stopPropagation() prevents clicks inside the modal from closing it */}
      <div
        className={styles.content}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>
            {icon && <i className={`bi ${icon} ${styles.icon}`} />}
            {title}
          </h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* The children prop allows you to inject any custom tabs, forms, or content directly under the header */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
