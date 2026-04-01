// components/studentComponents/TabAcademic.jsx
import { useState } from "react";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";

function gradeClass(g) {
  const n = parseFloat(g);
  if (n <= 1.5) return styles.gradeHigh;
  if (n <= 2.0) return styles.gradeMid;
  return styles.gradeLow;
}

function SemBlock({ sem }) {
  const [open, setOpen] = useState(true);
  const totalUnits = sem.subjects.reduce((acc, s) => acc + s.units, 0);

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {/* Semester header */}
      <div
        style={{
          background: "#fff8f4",
          border: "1px solid #f5dece",
          borderRadius: "10px 10px 0 0",
          padding: "0.7rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          borderBottom: open ? "1px solid #f5dece" : "none",
          borderRadius: open ? "10px 10px 0 0" : "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#E65100",
              marginBottom: "0.2rem",
            }}
          >
            {sem.schoolYear}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a1a2e" }}
            >
              {sem.yearLevel} — {sem.semester}
            </span>
            <span className={`${styles.badge} ${styles.badgeOrange}`}>
              {sem.section}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.6rem",
                color: "#9ca3af",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              GWA
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 800, color: "#E65100" }}
            >
              {sem.gwa}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.6rem",
                color: "#9ca3af",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Units
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 800, color: "#374151" }}
            >
              {totalUnits}
            </div>
          </div>
          <button
            className={styles.semToggleBtn}
            onClick={() => setOpen(!open)}
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Subject table */}
      {open && (
        <div
          className={styles.tableWrap}
          style={{ borderRadius: "0 0 10px 10px", borderTop: "none" }}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th style={{ textAlign: "center" }}>Units</th>
                <th style={{ textAlign: "center" }}>Grade</th>
                <th style={{ textAlign: "center" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {sem.subjects.map((subj, i) => (
                <tr key={i}>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "#E65100",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {subj.code}
                  </td>
                  <td>{subj.name}</td>
                  <td style={{ textAlign: "center" }}>{subj.units}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className={gradeClass(subj.grade)}>{subj.grade}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={`${styles.badge} ${styles.badgeGreen}`}>
                      {subj.remarks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TabAcademic({ history }) {
  // Group by school year for display
  const years = [...new Set(history.map((h) => h.schoolYear))];

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Academic Records</div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
            padding: "0.6rem 0.9rem",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <span
            style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600 }}
          >
            Grade Guide:
          </span>
          <span style={{ fontSize: "0.7rem" }}>
            <span style={{ color: "#16a34a", fontWeight: 700 }}>1.00–1.50</span>{" "}
            Excellent
          </span>
          <span style={{ fontSize: "0.7rem" }}>
            <span style={{ color: "#374151", fontWeight: 700 }}>1.51–2.00</span>{" "}
            Good
          </span>
          <span style={{ fontSize: "0.7rem" }}>
            <span style={{ color: "#dc2626", fontWeight: 700 }}>2.01+</span>{" "}
            Average
          </span>
          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
            · Click ▲/▼ to expand/collapse each semester
          </span>
        </div>

        {history.map((sem, idx) => (
          <SemBlock key={idx} sem={sem} />
        ))}
      </div>
    </div>
  );
}
