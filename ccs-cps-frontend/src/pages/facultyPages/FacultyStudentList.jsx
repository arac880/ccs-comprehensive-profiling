import React, { useState } from "react";
import SideNavbar from "../../components/facultyComponents/SideNavbar";
import TopNavbar from "../../components/facultyComponents/TopNavbar";
import styles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

/* ── Sample data ── */
const STUDENTS = [
  {
    name: "Alejandro Santos",
    id: "2201001",
    year: "BSCS 3A",
  
    status: "Active",
  },
  {
    name: "Bianca Reyes",
    id: "2201042",
    year: "BSIT 2B",

    status: "Active",
  },
  {
    name: "Carlo Mendez",
    id: "2201088",
    year: "BSCS 3A",

    status: "Inactive",
  },
  {
    name: "Danica Cruz",
    id: "2201119",
    year: "BSCS 1C",

    status: "Active",
  },
  {
    name: "Erika Flores",
    id: "2201205",
    year: "BSIT 4A",
    
    status: "Active",
  },
  {
    name: "Franco Lim",
    id: "2201231",
    year: "BSCS 2B",
   
    status: "At Risk",
  },
  {
    name: "Grace Tan",
    id: "2201277",
    year: "BSIT 2B",
 
    status: "Active",
  },
  {
    name: "Harold Dela Cruz",
    id: "2201302",
    year: "BSCS 3A",

    status: "Active",
  },
  {
    name: "Isabel Garcia",
    id: "2201349",
    year: "BSCS 1C",

    status: "At Risk",
  },
  {
    name: "Jerome Ramos",
    id: "2201388",
    year: "BSIT 4A",

    status: "Active",
  },
  {
    name: "Karen Villanueva",
    id: "2201410",
    year: "BSCS 2B",
  
    status: "Active",
  },
  {
    name: "Luis Bautista",
    id: "2201455",
    year: "BSIT 3A",
   
    status: "Inactive",
  },
];

const STATUS_CLASS = {
  Active: "badgeActive",
  Inactive: "badgeInactive",
  "At Risk": "badgeAtRisk",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Student List Page ── */
const FacultyStudentList = () => {
  const [currentPage, setCurrentPage] = useState("StudentList");
  const [query, setQuery] = useState("");

  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.includes(query) ||
      s.year.toLowerCase().includes(query.toLowerCase()) 
      
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
            <div className={styles.searchBar}>
              <i className="bi bi-search" />
              <input
                className={styles.searchInput}
                placeholder="Search student, ID, "
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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
                {filtered.length === 0 ? (
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
                      <td>{s.id}</td>
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
    </div>
  );
};

export default FacultyStudentList;
