import { useState, useRef, useEffect } from "react";
import styles from "../../styles/FilterDropdown.module.css";

export default function FilterDropdown({ value, onChange, options = [], label = "SHOW ITEMS", placeholder = "All" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.dropdownWrap} ref={ref}>
      <button className={styles.dropdownTrigger} onClick={() => setOpen((p) => !p)}>
        <span>{value || placeholder}</span>
        <i className={`bi bi-chevron-down ${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          <span className={styles.menuLabel}>{label}</span>
          {options.map((opt) => (
            <div
              key={opt}
              className={`${styles.menuItem} ${value === opt ? styles.menuItemActive : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}