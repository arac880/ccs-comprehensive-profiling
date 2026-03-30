import React from "react";
import AppModal from "./Modal"; // Adjust name to match your actual file
import AppButton from "./AppButton";

const ErrorModal = ({ isOpen, onClose, title = "Error", message }) => {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon="bi-exclamation-triangle-fill"
      maxWidth="400px"
    >
      <div
        style={{
          padding: "24px",
          fontSize: "14px",
          color: "#dc3545",
          lineHeight: "1.5",
          fontWeight: "500",
        }}
      >
        {message}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 24px",
          background: "#fdf8f5",
          borderTop: "1px solid #e8ddd5",
        }}
      >
        <AppButton variant="secondary" onClick={onClose}>
          Understood
        </AppButton>
      </div>
    </AppModal>
  );
};

export default ErrorModal;
