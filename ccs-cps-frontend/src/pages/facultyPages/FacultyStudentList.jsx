import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiArrowRight } from "react-icons/fi";
import { FaUserGroup } from 'react-icons/fa6';
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import AddStudentModal from "../../components/facultyComponents/AddStudentModal";
import AppButton from "../../components/ui/AppButton";
import styles from "./facultyStyles/studentList.module.css";

const STATUS_CLASS = {
  Regular: "badgeActive",
  Irregular: "badgeAtRisk",
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

const FacultyStudentList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("StudentList");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/students");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const formattedStudents = students.map((s) => ({
    id: s._id,
    studentId: s.studentId,
    displayId: s.studentId ? s.studentId.slice(-7).toUpperCase() : "—",
    name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
    program: s.program || "—",
    yearSection: `${s.year || ""} - ${s.section || ""}`.replace(/^ - | - $/g, "").trim() || "—",
    status: s.status || "Regular", 
  }));

  const filtered = formattedStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.displayId.toLowerCase().includes(query.toLowerCase()) ||
      s.program.toLowerCase().includes(query.toLowerCase()) ||
      s.yearSection.toLowerCase().includes(query.toLowerCase()),
  );

  const handleRowClick = (mongoId) => {
    navigate(`/faculty/student/${mongoId}`);
  };

  return (
    <div className={styles.pageRoot}>
      <SideNavbar activeNav={currentPage} onNavigate={setCurrentPage} />

      <div className={styles.pageMain}>
        <TopNavbar activePage={currentPage} />

        <div className={styles.pageContent}>
          
          <div className={styles.pageHeader}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.iconBox}>
                <FaUserGroup size={20} />
              </div>
              <h2 className={styles.pageHeading}>Student List</h2>
            </div>
            
            <div className={styles.controls}>
              <div className={styles.searchWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search students..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <AppButton variant="primary" onClick={() => setIsModalOpen(true)} >
                <FiPlus size={16} /> Add Student
              </AppButton>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID Number</th>
                    <th>Program</th>
                    <th>Year & Section</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={6}>Loading student data...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={6}>No students found.</td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s.id} className={styles.hoverRow}>
                        <td>
                          <div className={styles.studentCell}>
                            <span className={styles.avatarInitials}>
                              {getInitials(s.name)}
                            </span>
                            <span className={styles.studentName}>{s.name}</span>
                          </div>
                        </td>
                        <td className={styles.subText}>{s.displayId}</td>
                        <td className={styles.subText}>{s.program}</td>
                        <td className={styles.subText}>{s.yearSection}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[STATUS_CLASS[s.status] || "badgeActive"]}`}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => handleRowClick(s.id)} 
                          >
                            View <FiArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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