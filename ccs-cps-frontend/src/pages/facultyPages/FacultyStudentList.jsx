import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/facultyComponents/sideNavbar";
import TopNavbar from "../../components/facultyComponents/topNavbar";
import AddStudentModal from "../../components/facultyComponents/AddStudentModal";
import AppButton from "../../components/ui/AppButton";
import styles from "./facultyStyles/studentList.module.css";

const STATUS_CLASS = {
  Active: "badgeActive",
  Inactive: "badgeInactive",
  "At Risk": "badgeAtRisk",
};

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => (n && n[0] ? n[0] : ""))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Student List Page ── */
const FacultyStudentList = () => {
  const [currentPage, setCurrentPage] = useState("StudentList");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Database States
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchStudents when the component first loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Format the database fields to match your table design
  const formattedStudents = students.map((s) => ({
    id: s.studentId, // MongoDB generates this unique ID automatically
    displayId: s.studentId.slice(-7).toUpperCase(), // Taking the last 7 characters as a pseudo-ID number
    name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
    year: `${s.program || ""} ${s.year || ""} - ${s.section || ""}`.trim(),
    status: s.status || "Active", // Defaulting to Active since it's not in the registration form
  }));

  // Filter based on the formatted data
  const filtered = formattedStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.displayId.includes(query) ||
      s.year.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={styles.pageRoot}>
      {/* Sidebar */}
      <SideNavbar activeNav={currentPage} onNavigate={setCurrentPage} />

      {/* Main */}
      <div className={styles.pageMain}>
        {/* Topbar */}
        <TopNavbar activePage={currentPage} />

        {/* Content */}
        <div className={styles.pageContent}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <h2 className={styles.pageHeading}>
              <i className="bi bi-people-fill" /> Student List
            </h2>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div className={styles.searchBar}>
                <i className="bi bi-search" />
                <input
                  className={styles.searchInput}
                  placeholder="Search student, ID, "
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <AppButton variant="primary" onClick={() => setIsModalOpen(true)}>
                <i className="bi bi-plus-lg" style={{ marginRight: "6px" }} />{" "}
                Add Student
              </AppButton>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID Number</th>
                  <th>Year &amp; Section</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={5}>Loading students...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={5}>No students match your search.</td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className={styles.avatarInitials}>
                          {getInitials(s.name)}
                        </span>
                        {s.name}
                      </td>
                      <td>{s.displayId}</td>
                      <td>{s.year}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${styles[STATUS_CLASS[s.status]]}`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* When the modal closes, we call fetchStudents again to refresh the table 
        with the newly added student from the database.
      */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchStudents();
        }}
      />
    </div>
  );
};

export default FacultyStudentList;
