import React, { useState, useEffect } from "react";
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

const InfoItem = ({ label, value, fullWidth }) => (
  <div className={`${styles.infoItem} ${fullWidth ? styles.fullWidth : ""}`}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value || "—"}</span>
  </div>
);

const TABS = [
  { key: "personal", label: "Personal Info", icon: "bi-person-lines-fill" },
  { key: "academic", label: "Academic Details", icon: "bi-mortarboard-fill" },
  { key: "contact", label: "Contact Info", icon: "bi-telephone-fill" },
];

const FacultyStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

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
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Update failed.");
      setStudent(editData);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast("Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(student);
    setIsEditing(false);
  };

  const fullName = student ? `${student.firstName || ""} ${student.lastName || ""}`.trim() : "";
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <>
      <AppToast isVisible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />
      <div className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate("/faculty/student-list")}>
            <i className="bi bi-arrow-left" /> Back to Student List
          </button>
          {!isLoading && !error && (
            <div className={styles.headerActions}>
              {!isEditing && (
                <AppButton variant="primary" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-fill" style={{ marginRight: "6px" }} /> Edit Profile
                </AppButton>
              )}
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
            <AppButton variant="secondary" onClick={() => navigate("/faculty/student-list")}>Return to Student List</AppButton>
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
              
              {/* Display badging for both Type and Status natively. Edits are handled in the Academic Form */}
              <div style={{ display: 'flex', gap: '8px' }}>
                 <span className={`${styles.badge} ${styles.badgeActive}`}>{student.type || "Regular"}</span>
                 <span className={`${styles.badge} ${student.status === "Dropped" ? styles.badgeAtRisk : styles.badgeActive}`}>{student.status || "Enrolled"}</span>
              </div>
            </div>

            <div className={styles.profileBody}>
              <div className={styles.tabSidebar}>
                <div className={styles.tabSidebarHeader}>Sections</div>
                {TABS.map((tab) => (
                  <div key={tab.key} className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ""}`} onClick={() => setActiveTab(tab.key)}>
                    <i className={`bi ${tab.icon}`} />{tab.label}
                  </div>
                ))}
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}><i className={`bi ${TABS.find((t) => t.key === activeTab)?.icon}`} />{TABS.find((t) => t.key === activeTab)?.label}</h3>
                  {isEditing && <span style={{ fontSize: "12px", color: "#e65100", fontWeight: 600 }}><i className="bi bi-pencil-fill" style={{ marginRight: 4 }} />Editing</span>}
                </div>

                <div className={styles.detailCardBody}>
                  {activeTab === "personal" && (
                    <>
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="First Name" value={student.firstName} />
                          <InfoItem label="Last Name" value={student.lastName} />
                          <InfoItem label="Birthdate" value={formatDate(student.birthdate)} />
                          <InfoItem label="Age" value={student.age} />
                          <InfoItem label="Gender" value={student.gender} />
                          <InfoItem label="Address" value={student.address} fullWidth />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>First Name</label><input name="firstName" value={editData.firstName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Last Name</label><input name="lastName" value={editData.lastName || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Birthdate</label><input type="date" name="birthdate" value={editData.birthdate || ""} onChange={handleChange} max={todayString} /></div>
                          <div className={styles.formGroup}><label>Age (auto-calculated)</label><input value={editData.age || ""} disabled /></div>
                          <div className={styles.formGroup}><label>Gender</label><select name="gender" value={editData.gender || ""} onChange={handleChange}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                          <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Address</label><input name="address" value={editData.address || ""} onChange={handleChange} /></div>
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "academic" && (
                    <>
                      {!isEditing ? (
                        <div className={styles.infoGrid}>
                          <InfoItem label="Student ID" value={student.studentId} />
                          <InfoItem label="Program" value={student.program} />
                          <InfoItem label="Year" value={student.year} />
                          <InfoItem label="Section" value={student.section} />
                          <InfoItem label="Type" value={student.type || "Regular"} />
                          <InfoItem label="Status" value={student.status || "Enrolled"} />
                        </div>
                      ) : (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label>Student ID</label><input name="studentId" value={editData.studentId || ""} onChange={handleChange} /></div>
                          <div className={styles.formGroup}><label>Program</label><select name="program" value={editData.program || ""} onChange={handleChange}><option value="">Select Program</option><option value="BS Computer Science">BS Computer Science</option><option value="BS Information Technology">BS Information Technology</option></select></div>
                          <div className={styles.formGroup}><label>Year</label><select name="year" value={editData.year || ""} onChange={handleChange}><option value="">Select Year</option><option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option></select></div>
                          <div className={styles.formGroup}><label>Section</label><input name="section" value={editData.section || ""} onChange={handleChange} /></div>
                          
                          <div className={styles.formGroup}>
                            <label>Type</label>
                            <select name="type" value={editData.type || "Regular"} onChange={handleChange}>
                              <option value="Regular">Regular</option>
                              <option value="Irregular">Irregular</option>
                            </select>
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label>Status</label>
                            <select name="status" value={editData.status || "Enrolled"} onChange={handleChange}>
                              <option value="Enrolled">Enrolled</option>
                              <option value="LOA">LOA</option>
                              <option value="Dropped">Dropped</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "contact" && (
                    <>
                      {!isEditing ? (
                        <div className={styles.infoGrid}><InfoItem label="Email Address" value={student.email} /></div>
                      ) : (
                        <div className={styles.formGrid}><div className={styles.formGroup}><label>Email Address</label><input type="email" name="email" value={editData.email || ""} onChange={handleChange} /></div></div>
                      )}
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className={styles.editFooter}>
                    <AppButton variant="secondary" onClick={handleCancel} disabled={isSaving}><i className="bi bi-x-circle" style={{ marginRight: "6px" }} />Cancel</AppButton>
                    <AppButton variant="primary" onClick={handleSave} loading={isSaving} disabled={isSaving}><i className="bi bi-check2-circle" style={{ marginRight: "6px" }} />Save Changes</AppButton>
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