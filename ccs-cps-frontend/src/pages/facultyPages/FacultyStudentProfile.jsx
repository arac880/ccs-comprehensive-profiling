import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppButton from "../../components/ui/AppButton";
import AppToast from "../../components/ui/AppToast";
import styles from "./facultyStyles/FacultyStudentProfile.module.css";

function getInitials(name) {
  if (!name) return "??";
  return name.split(" ").map((n) => (n && n[0] ? n[0] : "")).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}

function getCategoryColor(category) {
  const colors = {
    "Programming": "#E59346",
    "Web Development": "#2F8F52",
    "Database": "#4F8BC4",
    "Design": "#C45587",
    "Networking": "#C7B302",
    "Other": "#6b7280"
  };
  return colors[category] || "#9333ea";
}

function gradeColor(grade) {
  const g = parseFloat(grade);
  if (isNaN(g)) return "";
  if (g <= 1.5) return styles.gradeExcellent;
  if (g <= 2.0) return styles.gradeGood;
  if (g <= 3.0) return styles.gradePassing;
  return styles.gradeFailed;
}

function remarkClass(remark) {
  if (!remark) return styles.remarkNeutral;
  switch (remark.toUpperCase()) {
    case "PASSED": return styles.remarkPassed;
    case "FAILED": return styles.remarkFailed;
    case "INC":    return styles.remarkInc;
    case "IP":     return styles.remarkIp;
    case "OD":
    case "UD":     return styles.remarkDropped;
    default:       return styles.remarkNeutral;
  }
}

function severityClass(severity) {
  if (!severity) return styles.severityMinor;
  return severity.toLowerCase() === "major" ? styles.severityMajor : styles.severityMinor;
}

function safeArray(val) {
  return Array.isArray(val) ? val : [];
}

function normalizeSkill(item) {
  if (!item) return null;
  if (typeof item === "string") return { name: item, category: "" };
  if (typeof item === "object") return { name: item.name || "", category: item.category || "" };
  return null;
}

function normalizeOrg(item) {
  if (!item) return null;
  if (typeof item === "string") return { organization: item, memberType: "", yearAdded: "" };
  if (typeof item === "object") {
    return {
      // Look for the new 'organization' key, fallback to the old ones
      organization: item.organization || item.orgName || item.name || "",
      memberType: item.memberType || "",
      // Look for the new 'yearAdded' key, fallback to the old one
      yearAdded: item.yearAdded || item.membershipDate || "",
    };
  }
  return null;
}

function normalizeSport(item) {
  if (!item) return null;
  if (typeof item === "string") return { sport: item, role: "", level: "", yearAdded: "" };
  if (typeof item === "object") {
    return {
      // Look for the new 'sport' key, fallback to the old ones
      sport: item.sport || item.sportName || item.name || "",
      // Look for the new 'role' key, fallback to the old one
      role: item.role || item.position || "",
      level: item.level || "",
      // Pass the yearAdded key through
      yearAdded: item.yearAdded || "",
    };
  }
  return null;
}

function normalizeActivity(item) {
  if (!item) return null;
  if (typeof item === "string") return { title: item, category: "", date: "", description: "" };
  if (typeof item === "object") {
    return {
      title: item.title || item.name || "",
      category: item.category || "",
      date: item.date || "",
      description: item.description || "",
    };
  }
  return null;
}

const InfoItem = ({ label, value, fullWidth }) => (
  <div className={`${styles.infoItem} ${fullWidth ? styles.fullWidth : ""}`}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value || "—"}</span>
  </div>
);

const SectionDivider = ({ title, icon }) => (
  <div className={styles.sectionDivider}>
    <i className={`bi ${icon}`} />
    <span>{title}</span>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className={styles.emptyState}>
    <i className={`bi ${icon}`} />
    <p>{message}</p>
  </div>
);

const ReadOnlyBanner = () => (
  <div className={styles.readOnlyNote}>
    <i className="bi bi-info-circle" />
    This section is managed by the student and is read-only.
  </div>
);

const AccordionBlock = ({ group, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);

  const numericGrades = group.courses.map((c) => parseFloat(c.grade)).filter((g) => !isNaN(g));
  const gwa = numericGrades.length
    ? (numericGrades.reduce((s, g) => s + g, 0) / numericGrades.length).toFixed(2)
    : "—";
  const totalUnits = group.courses.reduce((s, c) => s + (parseInt(c.units) || 0), 0);

  return (
    <div className={`${styles.semesterBlock} ${open ? styles.semesterBlockOpen : ""}`}>
      <div className={styles.semesterHeader} onClick={() => setOpen((o) => !o)} role="button">
        <div className={styles.semesterLeft}>
          <i className={`bi ${open ? "bi-chevron-down" : "bi-chevron-right"} ${styles.accordionChevron}`} />
          <span className={styles.semesterSchoolYear}>S.Y. {group.schoolYear}</span>
          <span className={styles.semesterTitle}>{group.yearLevel} — {group.semester}</span>
          {group.section && <span className={styles.semesterSectionBadge}>{group.section}</span>}
        </div>
        <div className={styles.semesterStats}>
          <div className={styles.semesterStat}>
            <span className={styles.semesterStatLabel}>GWA</span>
            <span className={`${styles.semesterStatValue} ${gradeColor(gwa)}`}>{gwa}</span>
          </div>
          <div className={styles.semesterStat}>
            <span className={styles.semesterStatLabel}>UNITS</span>
            <span className={styles.semesterStatValue}>{totalUnits}</span>
          </div>
        </div>
      </div>

      {open && (
        <table className={styles.gradesTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th className={styles.centered}>Units</th>
              <th className={styles.centered}>Grade</th>
              <th className={styles.centered}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {group.courses.map((course, i) => (
              <tr key={i}>
                <td className={styles.courseCode}>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td className={styles.centered}>{course.units}</td>
                <td className={`${styles.centered} ${gradeColor(course.grade)}`}>{course.grade}</td>
                <td className={styles.centered}>
                  <span className={`${styles.remarkBadge} ${remarkClass(course.remarks)}`}>
                    {course.remarks || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const TABS = [
  { key: "student-info",     label: "Student Info",     icon: "bi-person-lines-fill" },
  { key: "academic-history", label: "Academic History", icon: "bi-journal-text" },
  { key: "violations",       label: "Violations",       icon: "bi-exclamation-triangle-fill" },
  { key: "skills",           label: "Skills",           icon: "bi-stars" },
  { key: "affiliations",     label: "Affiliations",     icon: "bi-people-fill" },
  { key: "non-academic",     label: "Non-Academic",     icon: "bi-calendar-event-fill" },
];

const FacultyStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("student-info");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const [isAddingViolation, setIsAddingViolation] = useState(false);
  const [isSavingViolation, setIsSavingViolation] = useState(false);
  const [violationForm, setViolationForm] = useState({ description: "", date: "", severity: "Minor" });

  const todayString = new Date().toISOString().split("T")[0];
  const showToast = (message, type = "success") => setToast({ visible: true, message, type });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Student not found.");
        const data = await res.json();
        setStudent(data);
        setEditData(data);
      } catch (err) {
        setError(err.message || "Failed to load student profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthdate") {
      const today = new Date();
      const birth = new Date(value);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      setEditData((prev) => ({ ...prev, birthdate: value, age: age > 0 ? String(age) : "0" }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        _id, violations, academicHistory, password, role,
        skills, activities, organizations, sports,
        ...safeData
      } = editData;
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeData),
      });
      if (!res.ok) throw new Error("Update failed.");
      setStudent((prev) => ({ ...prev, ...safeData }));
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch {
      showToast("Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(student);
    setIsEditing(false);
  };

  const handleAddViolation = async () => {
    if (!violationForm.description.trim() || !violationForm.date) {
      showToast("Please fill in description and date.", "error");
      return;
    }
    setIsSavingViolation(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}/violations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(violationForm),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStudent((prev) => ({ ...prev, violations: updated.violations }));
      setViolationForm({ description: "", date: "", severity: "Minor" });
      setIsAddingViolation(false);
      showToast("Violation recorded.", "success");
    } catch {
      showToast("Failed to record violation.", "error");
    } finally {
      setIsSavingViolation(false);
    }
  };

  const handleDeleteViolation = async (index) => {
    if (!window.confirm("Remove this violation record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}/violations/${index}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStudent((prev) => ({ ...prev, violations: updated.violations }));
      showToast("Violation removed.", "success");
    } catch {
      showToast("Failed to remove violation.", "error");
    }
  };

  const fullName = student
    ? [student.firstName, student.middleInitial ? student.middleInitial + "." : "", student.lastName]
        .filter(Boolean).join(" ").trim()
    : "";

  const groupedHistory = useMemo(() => {
    const records = safeArray(student?.academicHistory);
    const map = {};
    records.forEach((r) => {
      const key = `${r.schoolYear}||${r.yearLevel}||${r.semester}||${r.section || ""}`;
      if (!map[key]) {
        map[key] = { schoolYear: r.schoolYear, yearLevel: r.yearLevel, semester: r.semester, section: r.section || "", courses: [] };
      }
      map[key].courses.push(r);
    });
    return Object.values(map).sort((a, b) => (b.schoolYear || "").localeCompare(a.schoolYear || ""));
  }, [student]);

  const activeTabMeta  = TABS.find((t) => t.key === activeTab);
  const violationCount = safeArray(student?.violations).length;

  const skills        = safeArray(student?.skills).map(normalizeSkill).filter(Boolean);
  const organizations = safeArray(student?.organizations).map(normalizeOrg).filter(Boolean);
  const sports        = safeArray(student?.sports).map(normalizeSport).filter(Boolean);
  const activities    = safeArray(student?.activities).map(normalizeActivity).filter(Boolean);

  return (
    <>
      <AppToast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <div className={styles.pageContent}>

        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate("/faculty/student-list")}>
            <i className="bi bi-arrow-left" /> Back to Student List
          </button>
          {!isLoading && !error && activeTab === "student-info" && !isEditing && (
            <div className={styles.headerActions}>
              <AppButton variant="primary" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil-fill" style={{ marginRight: "6px" }} /> Edit Profile
              </AppButton>
            </div>
          )}
        </div>

        {isLoading && (
          <div className={styles.stateBox}>
            <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
            <p>Loading student profile...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className={`${styles.stateBox} ${styles.errorState}`}>
            <i className="bi bi-exclamation-triangle-fill" />
            <p>{error}</p>
            <AppButton variant="secondary" onClick={() => navigate("/faculty/student-list")}>
              Return to Student List
            </AppButton>
          </div>
        )}

        {!isLoading && !error && student && (
          <>
            <div className={styles.heroCard}>
              <div className={styles.heroAvatar}>{getInitials(fullName)}</div>
              <div className={styles.heroInfo}>
                <h2 className={styles.heroName}>{fullName}</h2>
                <div className={styles.heroMeta}>
                  <span className={styles.heroMetaItem}><i className="bi bi-card-text" />{student.studentId || "—"}</span>
                  <span className={styles.heroMetaItem}><i className="bi bi-journal-bookmark" />{student.program || "—"}</span>
                  <span className={styles.heroMetaItem}><i className="bi bi-diagram-2" />{student.year} — Section {student.section}</span>
                  <span className={styles.heroMetaItem}><i className="bi bi-envelope" />{student.email || "—"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <span className={`${styles.badge} ${styles.badgeActive}`}>{student.type || "Regular"}</span>
                <span className={`${styles.badge} ${student.status === "Dropped" ? styles.badgeAtRisk : styles.badgeActive}`}>
                  {student.status || "Enrolled"}
                </span>
              </div>
            </div>

            <div className={styles.profileBody}>

              <div className={styles.tabSidebar}>
                <div className={styles.tabSidebarHeader}>Sections</div>
                {TABS.map((tab) => (
                  <div
                    key={tab.key}
                    className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ""}`}
                    onClick={() => { setActiveTab(tab.key); setIsEditing(false); }}
                  >
                    <i className={`bi ${tab.icon}`} />
                    {tab.label}
                    {tab.key === "violations" && violationCount > 0 && (
                      <span className={styles.violationBadge}>{violationCount}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>
                    <i className={`bi ${activeTabMeta?.icon}`} />
                    {activeTabMeta?.label}
                  </h3>
                  {isEditing && activeTab === "student-info" && (
                    <span style={{ fontSize: "12px", color: "#ffd0b3", fontWeight: 600 }}>
                      <i className="bi bi-pencil-fill" style={{ marginRight: 4 }} />Editing
                    </span>
                  )}
                </div>

                <div className={styles.detailCardBody}>

                  {/* ══════════════════════════════════════════
                      STUDENT INFO
                  ══════════════════════════════════════════ */}
                  {activeTab === "student-info" && (
                    <>
                      <SectionDivider title="Personal Information" icon="bi-person-fill" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="First Name"     value={student.firstName} />
                          <InfoItem label="Last Name"      value={student.lastName} />
                          <InfoItem label="Middle Initial" value={student.middleInitial} />
                          <InfoItem label="Birthdate"      value={formatDate(student.birthdate)} />
                          <InfoItem label="Age"            value={student.age} />
                          <InfoItem label="Gender"         value={student.gender} />
                          <InfoItem label="Civil Status"   value={student.civilStatus} />
                          <InfoItem label="Nationality"    value={student.nationality} />
                          <InfoItem label="Religion"       value={student.religion} />
                          <InfoItem label="Place of Birth" value={student.placeOfBirth} />
                          <InfoItem label="Residency"      value={student.residency} />
                          <InfoItem label="Address"        value={student.address} fullWidth />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>First Name</label><input name="firstName" value={editData.firstName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Last Name</label><input name="lastName" value={editData.lastName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Middle Initial</label><input name="middleInitial" value={editData.middleInitial || ""} onChange={handleChange} maxLength={2} /></div>
                          <div className={styles.formGroup}><label>Birthdate</label><input type="date" name="birthdate" value={editData.birthdate || ""} onChange={handleChange} max={todayString} /></div>
                          <div className={styles.formGroup}><label>Age (auto-calculated)</label><input value={editData.age || ""} disabled /></div>
                          <div className={styles.formGroup}>
                            <label>Gender</label>
                            <select name="gender" value={editData.gender || ""} onChange={handleChange}>
                              <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Civil Status</label>
                            <select name="civilStatus" value={editData.civilStatus || ""} onChange={handleChange}>
                              <option value="">Select</option><option>Single</option><option>Married</option><option>Widowed</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}><label>Nationality</label><input name="nationality" value={editData.nationality || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Religion</label><input name="religion" value={editData.religion || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Place of Birth</label><input name="placeOfBirth" value={editData.placeOfBirth || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}>
                            <label>Residency</label>
                            <select name="residency" value={editData.residency || ""} onChange={handleChange}>
                              <option value="">Select</option><option>Boarder</option><option>With Parents</option><option>With Relatives</option><option>Own Home</option>
                            </select>
                          </div>
                          <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Address</label><input name="address" value={editData.address || ""} onChange={handleChange} /></div>
                        </div>
                      )}

                      <SectionDivider title="Academic Details" icon="bi-mortarboard-fill" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Student ID" value={student.studentId} />
                          <InfoItem label="Program"    value={student.program} />
                          <InfoItem label="Year"       value={student.year} />
                          <InfoItem label="Section"    value={student.section} />
                          <InfoItem label="Type"       value={student.type || "Regular"} />
                          <InfoItem label="Status"     value={student.status || "Enrolled"} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Student ID</label><input name="studentId" value={editData.studentId || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}>
                            <label>Program</label>
                            <select name="program" value={editData.program || ""} onChange={handleChange}>
                              <option value="">Select Program</option>
                              <option value="BS Computer Science">BS Computer Science</option>
                              <option value="BS Information Technology">BS Information Technology</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Year</label>
                            <select name="year" value={editData.year || ""} onChange={handleChange}>
                              <option value="">Select Year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}><label>Section</label><input name="section" value={editData.section || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}>
                            <label>Type</label>
                            <select name="type" value={editData.type || "Regular"} onChange={handleChange}>
                              <option>Regular</option><option>Irregular</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Status</label>
                            <select name="status" value={editData.status || "Enrolled"} onChange={handleChange}>
                              <option>Enrolled</option><option>LOA</option><option>Dropped</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <SectionDivider title="Contact Information" icon="bi-telephone-fill" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Email Address"  value={student.email} />
                          <InfoItem label="Contact Number" value={student.contactNumber} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Email Address</label><input type="email" name="email" value={editData.email || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Contact Number</label><input name="contactNumber" value={editData.contactNumber || ""} onChange={handleChange} /></div>
                        </div>
                      )}

                      <SectionDivider title="Mother's Information" icon="bi-person-heart" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Full Name"   value={student.motherName} />
                          <InfoItem label="Occupation"  value={student.motherOccupation} />
                          <InfoItem label="Contact No." value={student.motherContact} />
                          <InfoItem label="Email"       value={student.motherEmail} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Full Name</label><input name="motherName" value={editData.motherName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Occupation</label><input name="motherOccupation" value={editData.motherOccupation || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Contact No.</label><input name="motherContact" value={editData.motherContact || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Email</label><input name="motherEmail" value={editData.motherEmail || ""} onChange={handleChange} /></div>
                        </div>
                      )}

                      <SectionDivider title="Father's Information" icon="bi-person-badge" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Full Name"   value={student.fatherName} />
                          <InfoItem label="Occupation"  value={student.fatherOccupation} />
                          <InfoItem label="Contact No." value={student.fatherContact} />
                          <InfoItem label="Email"       value={student.fatherEmail} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Full Name</label><input name="fatherName" value={editData.fatherName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Occupation</label><input name="fatherOccupation" value={editData.fatherOccupation || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Contact No.</label><input name="fatherContact" value={editData.fatherContact || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Email</label><input name="fatherEmail" value={editData.fatherEmail || ""} onChange={handleChange} /></div>
                        </div>
                      )}

                      <SectionDivider title="Guardian's Information" icon="bi-shield-person" />
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Full Name"   value={student.guardianName} />
                          <InfoItem label="Occupation"  value={student.guardianOccupation} />
                          <InfoItem label="Contact No." value={student.guardianContact} />
                          <InfoItem label="Email"       value={student.guardianEmail} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Full Name</label><input name="guardianName" value={editData.guardianName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Occupation</label><input name="guardianOccupation" value={editData.guardianOccupation || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Contact No.</label><input name="guardianContact" value={editData.guardianContact || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Email</label><input name="guardianEmail" value={editData.guardianEmail || ""} onChange={handleChange} /></div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ══════════════════════════════════════════
                      ACADEMIC HISTORY
                  ══════════════════════════════════════════ */}
                  {activeTab === "academic-history" && (
                    <>
                      <div className={styles.gradingLegend}>
                        <div className={styles.gradingLegendHeader}>
                          <i className="bi bi-mortarboard-fill" />
                          <span>Grading System</span>
                        </div>
                        <div className={styles.gradingLegendGrid}>
                          {[
                            ["1.00", "96–100", "gradeExcellent"],
                            ["1.25", "92–95",  "gradeExcellent"],
                            ["1.50", "88–91",  "gradeExcellent"],
                            ["1.75", "84–87",  "gradeGood"],
                            ["2.00", "80–83",  "gradeGood"],
                            ["2.25", "75–79",  "gradePassing"],
                            ["2.50", "70–74",  "gradePassing"],
                            ["2.75", "65–69",  "gradePassing"],
                            ["3.00", "60–64",  "gradePassing"],
                            ["5.00", "0–59",   "gradeFailed"],
                          ].map(([g, r, cls]) => (
                            <div key={g} className={styles.gradingLegendItem}>
                              <span className={`${styles.gradingGradeVal} ${styles[cls]}`}>{g}</span>
                              <span className={styles.gradingRange}>{r}</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.gradingLegendRemarks}>
                          <span><b>INC</b> — Incomplete</span>
                          <span><b>IP</b> — In Progress</span>
                          <span><b>OD</b> — Officially Dropped</span>
                          <span><b>UD</b> — Unofficially Dropped</span>
                        </div>
                      </div>

                      {groupedHistory.length === 0 ? (
                        <EmptyState icon="bi-journal-x" message="No academic records on file." />
                      ) : (
                        <div className={styles.accordionList}>
                          {groupedHistory.map((group, idx) => (
                            <AccordionBlock
                              key={`${group.schoolYear}-${group.yearLevel}-${group.semester}`}
                              group={group}
                              defaultOpen={idx === 0}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ══════════════════════════════════════════
                      VIOLATIONS
                  ══════════════════════════════════════════ */}
                  {activeTab === "violations" && (
                    <>
                      <div className={styles.violationsToolbar}>
                        {!isAddingViolation && (
                          <AppButton variant="primary" onClick={() => setIsAddingViolation(true)}>
                            <i className="bi bi-plus-circle" style={{ marginRight: "6px" }} />Add Violation
                          </AppButton>
                        )}
                      </div>

                      {isAddingViolation && (
                        <div className={styles.violationForm}>
                          <h4 className={styles.violationFormTitle}>
                            <i className="bi bi-exclamation-triangle" /> New Violation Record
                          </h4>
                          <div className={styles.formGrid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                              <label>Description</label>
                              <textarea
                                className={styles.violationTextarea}
                                rows={3}
                                value={violationForm.description}
                                onChange={(e) =>
                                  setViolationForm((p) => ({ ...p, description: e.target.value }))
                                }
                                placeholder="Describe the violation..."
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>Date of Violation</label>
                              <input
                                type="date"
                                value={violationForm.date}
                                max={todayString}
                                onChange={(e) =>
                                  setViolationForm((p) => ({ ...p, date: e.target.value }))
                                }
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>Severity</label>
                              <select
                                value={violationForm.severity}
                                onChange={(e) =>
                                  setViolationForm((p) => ({ ...p, severity: e.target.value }))
                                }
                              >
                                <option value="Minor">Minor</option>
                                <option value="Major">Major</option>
                              </select>
                            </div>
                          </div>
                          <div className={styles.editFooter}>
                            <AppButton variant="secondary" onClick={() => setIsAddingViolation(false)} disabled={isSavingViolation}>
                              <i className="bi bi-x-circle" style={{ marginRight: "6px" }} />Cancel
                            </AppButton>
                            <AppButton variant="primary" onClick={handleAddViolation} loading={isSavingViolation} disabled={isSavingViolation}>
                              <i className="bi bi-check2-circle" style={{ marginRight: "6px" }} />Save Violation
                            </AppButton>
                          </div>
                        </div>
                      )}

                      {safeArray(student.violations).length === 0 ? (
                        <EmptyState icon="bi-shield-check" message="No violations on record." />
                      ) : (
                        <div className={styles.violationList}>
                          {student.violations.map((v, i) => (
                            <div
                              key={i}
                              className={`${styles.violationCard} ${v.severity?.toLowerCase() === "major" ? styles.violationCardMajor : ""}`}
                            >
                              <div className={styles.violationCardLeft}>
                                <span className={`${styles.severityBadge} ${severityClass(v.severity)}`}>
                                  {v.severity || "Minor"}
                                </span>
                                <div className={styles.violationCardBody}>
                                  <p className={styles.violationDescription}>{v.description}</p>
                                  <span className={styles.violationDate}>
                                    <i className="bi bi-calendar3" /> {formatDate(v.date)}
                                  </span>
                                </div>
                              </div>
                              <button
                                className={styles.violationDeleteBtn}
                                onClick={() => handleDeleteViolation(i)}
                                title="Remove violation"
                              >
                                <i className="bi bi-trash3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ══════════════════════════════════════════
                      SKILLS
                  ══════════════════════════════════════════ */}
                  {activeTab === "skills" && (
                    <>
                      <ReadOnlyBanner />
                      {skills.length === 0 ? (
                        <EmptyState icon="bi-stars" message="No skills listed yet." />
                      ) : (
                        <div className={styles.skillsGrid}>
                          {skills.map((skill, i) => (
                            <div key={i} className={styles.skillCard}>
                              <div className={styles.skillCardIcon}>
                                <i className="bi bi-check2-circle" />
                              </div>
                            <div className={styles.skillCardBody}>
                                <span className={styles.skillName}>{skill.name || "—"}</span>
                                {skill.category ? (
                                 <span 
                                    className={styles.skillCategory}
                                    style={{ 
                                      color: getCategoryColor(skill.category),
                                      backgroundColor: `${getCategoryColor(skill.category)}1A` 
                                    }}
                                  >
                                    {skill.category}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ══════════════════════════════════════════
                      AFFILIATIONS — organizations + sports
                  ══════════════════════════════════════════ */}
                  {activeTab === "affiliations" && (
                    <>
                      <ReadOnlyBanner />

                      <SectionDivider title="Organizations" icon="bi-building" />
                      {organizations.length === 0 ? (
                        <EmptyState icon="bi-building-slash" message="No organizations listed." />
                      ) : (
                        <div className={styles.affiliationList}>
                          {organizations.map((org, i) => (
                            <div key={i} className={styles.affiliationCard}>
                              <div
                                className={styles.affiliationIconWrap}
                                style={{ background: "#fff3e0", color: "#e65100" }}
                              >
                                <i className="bi bi-building" />
                              </div>
                              <div className={styles.affiliationCardBody}>
                                {/* FIX: Using org.organization */}
                                <span className={styles.affiliationName}>{org.organization || org.orgName || "—"}</span>
                                <div className={styles.affiliationMeta}>
                                  {org.memberType && (
                                    <span
                                      className={styles.affiliationMetaBadge}
                                      style={{ background: "#fff3e0", color: "#bf360c", borderColor: "#ffcc80" }}
                                    >
                                      <i className="bi bi-person-badge" /> {org.memberType}
                                    </span>
                                  )}
                                  {/* FIX: Using org.yearAdded */}
                                  {(org.yearAdded || org.membershipDate) && (
                                    <span className={styles.affiliationMetaDate}>
                                      <i className="bi bi-calendar3" /> Member since {org.yearAdded || formatDate(org.membershipDate)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <SectionDivider title="Sports" icon="bi-trophy" />
                      {sports.length === 0 ? (
                        <EmptyState icon="bi-trophy" message="No sports listed." />
                      ) : (
                        <div className={styles.affiliationList}>
                          {sports.map((sport, i) => (
                            <div key={i} className={styles.affiliationCard}>
                              <div
                                className={styles.affiliationIconWrap}
                                style={{ background: "#e8f5e9", color: "#2e7d32" }}
                              >
                                <i className="bi bi-trophy" />
                              </div>
                              <div className={styles.affiliationCardBody}>
                                {/* FIX: Using sport.sport */}
                                <span className={styles.affiliationName}>{sport.sport || sport.sportName || "—"}</span>
                                <div className={styles.affiliationMeta}>
                                  {/* FIX: Using sport.role */}
                                  {(sport.role || sport.position) && (
                                    <span
                                      className={styles.affiliationMetaBadge}
                                      style={{ background: "#e8f5e9", color: "#1b5e20", borderColor: "#a5d6a7" }}
                                    >
                                      <i className="bi bi-person-check" /> {sport.role || sport.position}
                                    </span>
                                  )}
                                  {sport.level && (
                                    <span
                                      className={styles.affiliationMetaBadge}
                                      style={{ background: "#e3f2fd", color: "#0d47a1", borderColor: "#90caf9" }}
                                    >
                                      <i className="bi bi-bar-chart-steps" /> {sport.level}
                                    </span>
                                  )}
                                  {/* FIX: Added yearAdded for sports */}
                                  {sport.yearAdded && (
                                    <span className={styles.affiliationMetaDate}>
                                      <i className="bi bi-calendar3" /> Since {sport.yearAdded}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ══════════════════════════════════════════
                      NON-ACADEMIC ACTIVITIES
                  ══════════════════════════════════════════ */}
                  {activeTab === "non-academic" && (
                    <>
                      <ReadOnlyBanner />
                      <SectionDivider title="Non-Academic Activities" icon="bi-calendar-event" />
                      {activities.length === 0 ? (
                        <EmptyState icon="bi-calendar-x" message="No activities listed." />
                      ) : (
                        <div className={styles.activityList}>
                          {activities.map((act, i) => (
                            <div key={i} className={styles.activityCard}>
                              <div className={styles.activityCardHeader}>
                                <span className={styles.activityTitle}>{act.title || "—"}</span>
                                <div className={styles.activityHeaderRight}>
                                  {act.category && (
                                    <span className={styles.activityCategoryBadge}>{act.category}</span>
                                  )}
                                  {act.date && (
                                    <span className={styles.activityDate}>
                                      <i className="bi bi-calendar3" /> {formatDate(act.date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {act.description && (
                                <p className={styles.activityDescription}>{act.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                </div>

                {isEditing && activeTab === "student-info" && (
                  <div className={styles.editFooter}>
                    <AppButton variant="secondary" onClick={handleCancel} disabled={isSaving}>
                      <i className="bi bi-x-circle" style={{ marginRight: "6px" }} />Cancel
                    </AppButton>
                    <AppButton variant="primary" onClick={handleSave} loading={isSaving} disabled={isSaving}>
                      <i className="bi bi-check2-circle" style={{ marginRight: "6px" }} />Save Changes
                    </AppButton>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FacultyStudentProfile;