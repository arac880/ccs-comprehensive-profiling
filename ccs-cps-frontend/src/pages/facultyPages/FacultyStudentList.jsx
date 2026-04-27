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

const TYPE_FILTERS = ["All Types", "Regular", "Irregular"];
const STATUS_FILTERS = ["All Status", "Enrolled", "LOA", "Dropped"];

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
  const [activeType, setActiveType] = useState("All Types");
  const [activeStatus, setActiveStatus] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillName, setSkillName] = useState("");
  const [activityCategory, setActivityCategory] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // deleteTarget now stores the raw MongoDB _id string
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, name }

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
    setCurrentPage(1);
  }, [
    query,
    activeType,
    activeStatus,
    skillCategory,
    skillName,
    activityCategory,
    activityTitle,
  ]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteClick = (e, student) => {
    e.stopPropagation();
    setDeleteTarget({ _id: student._id, name: student.name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${deleteTarget._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isDeleted: true,
            deletedAt: new Date().toISOString(),
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Delete failed:", response.status, errText);
        throw new Error("Failed to delete student");
      }

      setDeleteTarget(null);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // ✅ Keep raw _id alongside formatted fields
  const formattedStudents = students.map((s) => ({
    _id: s._id, // raw MongoDB _id — used for delete & navigate
    id: s._id, // keep for backwards compat
    studentId: s.studentId,
    displayId: s.studentId ? s.studentId.slice(-7).toUpperCase() : "—",
    name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
    program: s.program || "—",
    yearSection:
      `${s.year || ""} - ${s.section || ""}`.replace(/^ - | - $/g, "").trim() ||
      "—",
    type: s.type || "Regular",
    status: s.status || "Enrolled",
    skills: s.skills || [],
    activities: s.activities || [],
  }));

  const filtered = formattedStudents.filter((s) => {
    const matchType = activeType === "All Types" || s.type === activeType;
    const matchStatus =
      activeStatus === "All Status" || s.status === activeStatus;
    const matchSearch =
      !query ||
      [s.name, s.displayId, s.program, s.yearSection, s.type, s.status].some(
        (v) => v.toLowerCase().includes(query.toLowerCase()),
      );
    const matchSkillCategory =
      !skillCategory || s.skills.some((sk) => sk.category === skillCategory);
    const matchSkillName =
      !skillName || s.skills.some((sk) => sk.name === skillName);
    const matchActivityCategory =
      !activityCategory ||
      s.activities.some((a) => a.category === activityCategory);
    const matchActivityTitle =
      !activityTitle || s.activities.some((a) => a.title === activityTitle);
    return (
      matchType &&
      matchStatus &&
      matchSearch &&
      matchSkillCategory &&
      matchSkillName &&
      matchActivityCategory &&
      matchActivityTitle
    );
  });

  const allSkillCategories = [
    ...new Set(
      students
        .flatMap((s) => (s.skills || []).map((sk) => sk.category))
        .filter(Boolean),
    ),
  ].sort();

  const allSkillNames = [
    ...new Set(
      students
        .flatMap((s) =>
          (s.skills || [])
            .filter((sk) => !skillCategory || sk.category === skillCategory)
            .map((sk) => sk.name),
        )
        .filter(Boolean),
    ),
  ].sort();

  const allActivityCategories = [
    ...new Set(
      students
        .flatMap((s) => (s.activities || []).map((a) => a.category))
        .filter(Boolean),
    ),
  ].sort();

  const allActivityTitles = [
    ...new Set(
      students
        .flatMap((s) =>
          (s.activities || [])
            .filter((a) => !activityCategory || a.category === activityCategory)
            .map((a) => a.title),
        )
        .filter(Boolean),
    ),
  ].sort();

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

  const hasActiveFilters =
    activeType !== "All Types" ||
    activeStatus !== "All Status" ||
    skillCategory ||
    skillName ||
    activityCategory ||
    activityTitle;

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

        {/* ── Filter Section ── */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Type</span>
            <div className={styles.filterRow}>
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${activeType === f ? styles.filterBtnActive : ""}`}
                  onClick={() => setActiveType(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterDivider} />
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Status</span>
            <div className={styles.filterRow}>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${activeStatus === f ? styles.filterBtnActive : ""}`}
                  onClick={() => setActiveStatus(f)}
                >
                  {f === "All Status" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterDivider} />
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Skill</span>
            <select
              className={`${styles.filterSelect} ${skillCategory ? styles.filterSelectActive : ""}`}
              value={skillCategory}
              onChange={(e) => {
                setSkillCategory(e.target.value);
                setSkillName("");
              }}
            >
              <option value="">All Categories</option>
              {allSkillCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className={`${styles.filterSelect} ${skillName ? styles.filterSelectActive : ""}`}
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            >
              <option value="">All Skills</option>
              {allSkillNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterDivider} />
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Activity</span>
            <select
              className={`${styles.filterSelect} ${activityCategory ? styles.filterSelectActive : ""}`}
              value={activityCategory}
              onChange={(e) => {
                setActivityCategory(e.target.value);
                setActivityTitle("");
              }}
            >
              <option value="">All Categories</option>
              {allActivityCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className={`${styles.filterSelect} ${activityTitle ? styles.filterSelectActive : ""}`}
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
            >
              <option value="">All Activities</option>
              {allActivityTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              className={styles.clearAllBtn}
              onClick={() => {
                setActiveType("All Types");
                setActiveStatus("All Status");
                setSkillCategory("");
                setSkillName("");
                setActivityCategory("");
                setActivityTitle("");
              }}
            >
              ✕ Clear Filters
            </button>
          )}
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
                  paginated.map((s) => (
                    <tr
                      key={s._id}
                      className={styles.hoverRow}
                      onClick={() => navigate(`/faculty/student/${s._id}`)}
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
                          <button
                            className={styles.viewBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/faculty/student/${s._id}`);
                            }}
                          >
                            View <FiArrowRight size={13} />
                          </button>
                          {/* ✅ Pass full student object so _id is available */}
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) => handleDeleteClick(e, s)}
                            title="Delete student"
                          >
                            <FiTrash2 size={16} />
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
              Showing{" "}
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                filtered.length,
              )}
              –{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} students
            </span>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {/* Prev */}
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {/* Page buttons — truncated */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isFirst3 = page <= 3;
                    const isLast3 = page >= totalPages - 2;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1;

                    if (isFirst3 || isLast3 || isNearCurrent) {
                      return (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      );
                    }

                    // Show ellipsis
                    if (page === 4 && currentPage > 5) {
                      return (
                        <span
                          key="ellipsis-start"
                          className={styles.pageEllipsis}
                        >
                          ...
                        </span>
                      );
                    }
                    if (
                      page === totalPages - 3 &&
                      currentPage < totalPages - 4
                    ) {
                      return (
                        <span
                          key="ellipsis-end"
                          className={styles.pageEllipsis}
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  },
                )}

                {/* Next */}
                <button
                  className={styles.pageBtn}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
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
      {/* ✅ Pass _id-based name to modal */}
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
