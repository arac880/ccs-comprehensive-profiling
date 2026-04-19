// components/facultyComponents/FacultyTabPersonal.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import EditButton from "../../components/ui/EditButton";
import EditFacultyModal from "../../components/facultyComponents/EditFacultyModal";
import AppToast from "../../components/ui/AppToast";

/* ── Field ── */
function Field({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || "—"}</span>
    </div>
  );
}

/* ── Section block ── */
function SectionBlock({ title, children, action }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>{title}</div>
        {action && <div>{action}</div>}
      </div>
      <div className={styles.infoGrid}>{children}</div>
    </div>
  );
}

export default function FacultyTabPersonal() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [faculty, setFaculty] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      const id = user?._id;
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/faculty/${id}`);
        if (!res.ok) throw new Error("Failed to fetch faculty");
        const data = await res.json();
        setFaculty(data);
      } catch (err) {
        console.error("Error fetching faculty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const handleSave = (updatedData) => {
    setFaculty((prev) => ({ ...prev, ...updatedData }));
    setToast({
      isVisible: true,
      message: "Profile updated successfully.",
      type: "success",
    });
  };

  if (loading)
    return (
      <div className={styles.section}>
        <div className={styles.loadingState}>Loading faculty data…</div>
      </div>
    );

  if (!faculty)
    return (
      <div className={styles.section}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>
            Unable to load faculty information.
          </p>
        </div>
      </div>
    );

  function computeAge(birthdate) {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  return (
    <div className={styles.tabWrapper}>
      {/* ── Basic Information ── */}
      <SectionBlock
        title="Basic Information"
        action={<EditButton iconOnly onClick={() => setIsEditOpen(true)} />}
      >
        <Field label="First Name" value={faculty.firstName} />
        <Field label="Middle Name" value={faculty.middleName} />
        <Field label="Last Name" value={faculty.lastName} />
        <Field label="Date of Birth" value={faculty.birthdate} />
        <Field label="Age" value={computeAge(faculty.birthdate)} />{" "}
        <Field label="Gender" value={faculty.gender} />
        <Field label="Civil Status" value={faculty.civilStatus} />
      </SectionBlock>

      {/* ── Faculty Information ── */}
      <SectionBlock title="Faculty Information">
        <Field label="Faculty ID" value={faculty.facultyId} />
        <Field label="Role" value={faculty.role} />
        <Field label="Department" value={faculty.department} />
        <Field label="Employment Status" value={faculty.status} />
        <Field label="Office Location" value={faculty.officeLocation} />
        <Field label="Years as Faculty" value={faculty.yearsAsFaculty} />
        <Field label="Years as Dean" value={faculty.yearsAsDean} />
        <Field
          label="Years as Department Chair"
          value={faculty.yearsAsDepartmentChair}
        />
      </SectionBlock>

      {/* ── Contact Information ── */}
      <SectionBlock title="Contact Information">
        <Field label="Email Address" value={faculty.email} />
        <Field label="Contact Number" value={faculty.contactNumber} />
        <Field label="Address" value={faculty.address} />
      </SectionBlock>

      {/* ── Schedule ── */}
      <SectionBlock title="Schedule">
        {faculty.schedule && faculty.schedule.length > 0 ? (
          faculty.schedule.map((s, i) => (
            <Field key={i} label={s.day} value={s.time} />
          ))
        ) : (
          <Field label="Schedule" value="No schedule set" />
        )}
      </SectionBlock>

      {/* ── Edit Modal ── */}
      {isEditOpen &&
        createPortal(
          <EditFacultyModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            faculty={faculty}
            onSave={handleSave}
          />,
          document.body,
        )}

      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
