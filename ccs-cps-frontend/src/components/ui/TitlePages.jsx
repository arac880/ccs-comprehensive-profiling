import styles from "../../styles/TitlePages.module.css";

/**
 * TitlePages
 * Reusable section-header: colored icon tile + title text.
 *
 * Props:
 *   icon      — Bootstrap icon class e.g. "bi-calendar-event-fill"
 *   title     — label string          e.g. "Events"
 *   iconBg    — icon tile bg color    (default: #E65100)
 *   iconColor — icon color            (default: #ffffff)
 *   textColor — title text color      (default: #E65100)
 */
export default function TitlePages({
  icon = "bi-calendar-event-fill",
  title = "Events",
  iconBg = "#E65100",
  iconColor = "#ffffff",
  textColor = "#E65100",
}) {
  return (
    <div className={styles.titleRow}>
      {/* Icon tile */}
      <div
        className={styles.iconTile}
        style={{ backgroundColor: iconBg }}
        aria-hidden="true"
      >
        <i
          className={`bi ${icon} ${styles.tileIcon}`}
          style={{ color: iconColor }}
        />
      </div>

      {/* Title text */}
      <span className={styles.titleText} style={{ color: textColor }}>
        {title}
      </span>
    </div>
  );
}
