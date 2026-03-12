import styles from "../../styles/AppButton.module.css";

export default function AppButton({
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  block = false,
  onClick,
  children,
  ...rest
}) {
  const className = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    loading ? styles["btn--loading"] : "",
    block ? styles["btn--block"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={`${styles.label}${loading ? ` ${styles["label--hidden"]}` : ""}`}>
        {children}
      </span>
    </button>
  );
}