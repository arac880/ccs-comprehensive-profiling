// components/studentComponents/TabAcademic.jsx
import { useState, useEffect, useMemo } from "react";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";

function gradeClass(g) {
  if (!g) return "";

  const str = String(g).toUpperCase();

  // Handle non-numeric grades
  if (["INC", "IP"].includes(str)) return styles.gradeMid;
  if (["OD", "UD"].includes(str)) return styles.gradeLow;

  const n = parseFloat(g);

  if (n <= 1.5) return styles.gradeHigh; // Excellent
  if (n <= 2.25) return styles.gradeMid; // Good / Passing
  if (n <= 3.0) return styles.gradeLow; // Barely Passing

  return styles.gradeLow; // 5.00 or invalid
}

function SemBlock({ sem }) {
  const [open, setOpen] = useState(true);
  const totalUnits = sem.subjects.reduce((acc, s) => acc + (Number(s.units) || 0), 0);

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
            {sem.section && (
              <span className={`${styles.badge} ${styles.badgeOrange}`}>
                {sem.section}
              </span>
            )}
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
            style={{
              background: "transparent",
              border: "none",
              color: "#E65100",
              cursor: "pointer",
              fontSize: "1rem"
            }}
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
                <th style={{ textAlign: "left" }}>Course Code</th>
                <th style={{ textAlign: "left" }}>Course Name</th>
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

export default function TabAcademic() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  // 1. Fetch data from database on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setHistory(data.academicHistory || []);
      } catch (err) {
        console.error("Error fetching academic history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  // 2. Group the flat database array into semesters dynamically
  const groupedHistory = useMemo(() => {
    if (!history.length) return [];

    const map = {};

    history.forEach((record) => {
      // Create a unique key for each semester group
      const key = `${record.schoolYear}||${record.yearLevel}||${record.semester}`;
      
      if (!map[key]) {
        map[key] = {
          schoolYear: record.schoolYear || "Unknown Year",
          yearLevel: record.yearLevel || "Unknown Level",
          semester: record.semester || "Unknown Semester",
          section: record.section || "",
          subjects: [],
        };
      }

      // Map the DB schema fields to what SemBlock expects
      map[key].subjects.push({
        code: record.courseCode,
        name: record.courseName,
        units: record.units,
        grade: record.grade,
        remarks: record.remarks,
      });
    });

    // Convert map to array and calculate GWA for each group
    return Object.values(map).map((group) => {
      const numericGrades = group.subjects
        .map((s) => parseFloat(s.grade))
        .filter((g) => !isNaN(g));
      
      const gwa = numericGrades.length > 0
        ? (numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length).toFixed(2)
        : "—";

      return { ...group, gwa };
    }).sort((a, b) => b.schoolYear.localeCompare(a.schoolYear)); // Sort newest first
  }, [history]);

  if (loading) {
    return <div className={styles.section}>Loading academic history...</div>;
  }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Academic Records</div>

        {/* Static Legend */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            marginBottom: "1.25rem",
            padding: "0.7rem 1rem",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "0.7rem",
          }}
        >
          <div style={{ fontWeight: 700, color: "#374151" }}>
            Grading System:
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            <span><b>1.00</b> (96–100)</span>
            <span><b>1.25</b> (92–95)</span>
            <span><b>1.50</b> (88–91)</span>
            <span><b>1.75</b> (84–87)</span>
            <span><b>2.00</b> (80–83)</span>
            <span><b>2.25</b> (75–79)</span>
            <span><b>2.50</b> (70–74)</span>
            <span><b>2.75</b> (65–69)</span>
            <span><b>3.00</b> (60–64)</span>
            <span><b>5.00</b> (0–59)</span>
          </div>

          <div style={{ marginTop: "0.3rem", color: "#6b7280" }}>
            INC – Incomplete · IP – In Progress · OD – Officially Dropped · UD –
            Unofficially Dropped
          </div>
        </div>

        {/* Dynamic Semester Blocks */}
        {groupedHistory.length === 0 ? (
          <p className={styles.empty}>No academic records found.</p>
        ) : (
          groupedHistory.map((sem, idx) => (
            <SemBlock key={idx} sem={sem} />
          ))
        )}
      </div>
    </div>
  );
}