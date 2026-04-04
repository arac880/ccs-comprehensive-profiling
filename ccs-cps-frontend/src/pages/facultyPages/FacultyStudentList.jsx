import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiArrowRight, FiTrash2 } from "react-icons/fi";
import { FaUserGroup } from "react-icons/fa6";
import AddStudentModal from "../../components/facultyComponents/AddStudentModal";
import ConfirmationModal from "../../components/facultyComponents/ConfirmationModal";
import AppButton from "../../components/ui/AppButton";
import styles from "./facultyStyles/studentList.module.css";

const TYPE_CLASS = { Regular: "badgeActive", Irregular: "badgeIrregular" };
const STATUS_CLASS = {
  Enrolled: "badgeEnrolled",
  LOA: "badgeLOA",
  Dropped: "badgeDropped",
};

const FILTERS = ["All", "Regular", "Irregular", "Enrolled", "LOA", "Dropped"];

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
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

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

  const handleDeleteClick = (e, student) => {
    e.stopPropagation(); // prevent row navigation
    setDeleteTarget({ id: student.id, name: student.name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete student");
      setDeleteTarget(null);
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const formattedStudents = students.map((s) => ({
    id: s._id,
    studentId: s.studentId,
    displayId: s.studentId ? s.studentId.slice(-7).toUpperCase() : "—",
    name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
    program: s.program || "—",
    yearSection:
      `${s.year || ""} - ${s.section || ""}`.replace(/^ - | - $/g, "").trim() ||
      "—",
    type: s.type || "Regular",
    status: s.status || "Enrolled",
  }));

  const filtered = formattedStudents.filter((s) => {
    const matchFilter =
      activeFilter === "All" ||
      s.type === activeFilter ||
      s.status === activeFilter;
    const matchSearch =
      !query ||
      [s.name, s.displayId, s.program, s.yearSection, s.type, s.status].some(
        (v) => v.toLowerCase().includes(query.toLowerCase()),
      );
    return matchFilter && matchSearch;
  });

  const totalCount = formattedStudents.length;
  const regularCount = formattedStudents.filter(
    (s) => s.type === "Regular",
  ).length;
  const enrolledCount = formattedStudents.filter(
    (s) => s.status === "Enrolled",
  ).length;
  const pendingCount = formattedStudents.filter(
    (s) => s.status === "LOA" || s.status === "Dropped",
  ).length;

  return (
    <>
      <div className={styles.pageContent}>
        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.iconBox}>
              <FaUserGroup size={20} />
            </div>
            <div className={styles.headingWrap}>
              <h2 className={styles.pageHeading}>Student List</h2>
              <span className={styles.pageSubheading}>
                College of Computer Studies
              </span>
            </div>
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
            <AppButton
              variant="primary"
              className={styles.addBtn}
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus size={16} /> Add Student
            </AppButton>
          </div>
        </div>

        {/* ── Stat Pills ── */}
        <div className={styles.statsRow}>
          <div
            className={styles.statPill}
            style={{ "--pill-color": "#e65100" }}
          >
            <div className={styles.statPillNum}>{totalCount}</div>
            <div className={styles.statPillLbl}>Total Students</div>
          </div>
          <div
            className={styles.statPill}
            style={{ "--pill-color": "#1b5e20" }}
          >
            <div className={styles.statPillNum}>{regularCount}</div>
            <div className={styles.statPillLbl}>Regular</div>
          </div>
          <div
            className={styles.statPill}
            style={{ "--pill-color": "#0d47a1" }}
          >
            <div className={styles.statPillNum}>{enrolledCount}</div>
            <div className={styles.statPillLbl}>Enrolled</div>
          </div>
          <div
            className={styles.statPill}
            style={{ "--pill-color": "#b45309" }}
          >
            <div className={styles.statPillNum}>{pendingCount}</div>
            <div className={styles.statPillLbl}>LOA / Dropped</div>
          </div>
        </div>

        {/* ── Filter Buttons ── */}
        <div className={styles.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID Number</th>
                  <th>Program</th>
                  <th>Year & Section</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={7}>Loading student data...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={7}>No students found.</td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className={styles.hoverRow}
                      onClick={() => navigate(`/faculty/student/${s.id}`)}
                    >
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
                        <span
                          className={`${styles.badge} ${styles[TYPE_CLASS[s.type] || "badgeActive"]}`}
                        >
                          {s.type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${styles[STATUS_CLASS[s.status] || "badgeEnrolled"]}`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.actionBtns}>
                          {/* View button */}
                          <button
                            className={styles.viewBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/faculty/student/${s.id}`);
                            }}
                          >
                            View <FiArrowRight size={13} />
                          </button>

                          {/* Delete button */}
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) => handleDeleteClick(e, s)}
                            title="Delete student"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div className={styles.tableFooter}>
            <span className={styles.tableFooterText}>
              Showing {filtered.length} of {totalCount} students
            </span>
            <div className={styles.pagination}>
              <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
                1
              </button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>›</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Student Modal — unchanged ── */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchStudents();
        }}
      />

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        studentName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default FacultyStudentList;
