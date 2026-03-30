import React from "react";
import AppModal from "./Modal"; // Adjust name to match your actual file
import AppButton from "./AppButton";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing,
}) => {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon="bi-question-circle"
      maxWidth="400px"
    >
      <div
        style={{
          padding: "24px",
          fontSize: "14px",
          color: "#444",
          lineHeight: "1.5",
        }}
      >
        {message}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          padding: "16px 24px",
          background: "#fdf8f5",
          borderTop: "1px solid #e8ddd5",
        }}
      >
        <AppButton
          variant="secondary"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </AppButton>
        <AppButton variant="primary" onClick={onConfirm} loading={isProcessing}>
          Confirm
        </AppButton>
      </div>
    </AppModal>
  );
};

export default ConfirmModal;
