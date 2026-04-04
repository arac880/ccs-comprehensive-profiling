import React from "react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import styles from "../../pages/facultyPages/facultyStyles/ConfirmationModal.module.css"; 

const ConfirmationModal = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={styles.iconWrap}>
          <FiAlertTriangle size={28} />
        </div>

        {/* Text */}
        <h3 className={styles.title}>Delete Student?</h3>
        <p className={styles.message}>
          You are about to permanently delete{" "}
          <strong>{studentName || "this student"}</strong>. This action cannot
          be undone.
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            <FiX size={14} /> Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            <FiTrash2 size={14} /> Delete Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
