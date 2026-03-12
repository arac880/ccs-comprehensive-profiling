import { useState, useId } from "react";
import styles from "../../styles/FloatableInput.module.css";

export default function FloatableInput({
  value,
  onChange,
  label,
  type = "text",
  disabled = false,
  error = "",
  autoComplete = "off",
  id,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generatedId = useId();
  const inputId = id || generatedId;

  const hasValue = !!value;
  const computedType = type === "password" ? (showPassword ? "text" : "password") : type;

  const fieldClass = [
    styles.field,
    isFocused ? styles.fieldFocused : "",
    hasValue ? styles.fieldFilled : "",
    error ? styles.fieldError : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClass}>
      <input
        id={inputId}
        type={computedType}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        className={styles.input}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />

      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      {/* Password toggle */}
      {type === "password" && (
        <button
          type="button"
          className={styles.eyeBtn}
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
        >
          {!showPassword ? (
            // Eye open
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          ) : (
            // Eye off
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          )}
        </button>
      )}

      {/* Error message */}
      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}