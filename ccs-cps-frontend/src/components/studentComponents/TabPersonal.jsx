import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import EditButton from "../../components/ui/EditButton";
import EditStudentModal from "../../components/studentComponents/EditStudentModal";
import AppToast from "../../components/ui/AppToast";

/* ───────────── Field: just label + value, no card ───────────── */
function Field({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || "—"}</span>
    </div>
  );
}

/* ───────────── Section block ───────────── */
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

/* ───────────── Component ───────────── */
export default function TabPersonal() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [student, setStudent] = useState(user || null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(!user);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      const id = user?._id;
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  const handleSave = (updatedData) => {
    setStudent((prev) => ({ ...prev, ...updatedData }));
    setToast({
      isVisible: true,
      message: "Personal info updated successfully.",
      type: "success",
    });
  };

  if (loading)
    return (
      <div className={styles.section}>
        <div className={styles.loadingState}>Loading student data…</div>
      </div>
    );

  if (!student)
    return (
      <div className={styles.section}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>
            Unable to load student information.
          </p>
        </div>
      </div>
    );

  return (
    <div className={styles.tabWrapper}>
      {/* ── Basic Information ── */}
      <SectionBlock
        title="Basic Information"
        action={<EditButton iconOnly onClick={() => setIsEditOpen(true)} />}
      >
        <Field label="First Name" value={student.firstName} />
        <Field label="Middle Initial" value={student.middleInitial} />
        <Field label="Last Name" value={student.lastName} />
        <Field label="Date of Birth" value={student.birthdate} />
        <Field label="Age" value={student.age} />
        <Field label="Gender" value={student.gender} />
        <Field label="Nationality" value={student.nationality} />
        <Field label="Religion" value={student.religion} />
        <Field label="Civil Status" value={student.civilStatus} />
        <Field label="Place of Birth" value={student.placeOfBirth} />
        <Field label="Residency" value={student.residency} />
      </SectionBlock>

      {/* ── Academic Status ── */}
      <SectionBlock title="Academic Status">
        <Field label="Student Number" value={student.studentId} />
        <Field label="Program" value={student.program} />
        <Field label="Year Level" value={student.year} />
        <Field label="Section" value={student.section} />
        <Field label="Student Type" value={student.type} />
        <Field label="Student Status" value={student.status} />
        <Field
          label="Student Assistantship"
          value={student.studentAssistantship}
        />
        <Field label="Grantee" value={student.grantee} />
      </SectionBlock>

      {/* ── Contact Information ── */}
      <SectionBlock title="Contact Information">
        <Field label="Present Address" value={student.address} />
        <Field label="Contact Number" value={student.contactNumber} />
        <Field label="Email Address" value={student.email} />
      </SectionBlock>

      {/* ── Mother's Information ── */}
      <SectionBlock title="Mother's Information">
        <Field label="Full Name" value={student.motherName} />
        <Field label="Occupation" value={student.motherOccupation} />
        <Field label="Contact Number" value={student.motherContact} />
        <Field label="Email Address" value={student.motherEmail} />
      </SectionBlock>

      {/* ── Father's Information ── */}
      <SectionBlock title="Father's Information">
        <Field label="Full Name" value={student.fatherName} />
        <Field label="Occupation" value={student.fatherOccupation} />
        <Field label="Contact Number" value={student.fatherContact} />
        <Field label="Email Address" value={student.fatherEmail} />
      </SectionBlock>

      {/* ── Guardian's Information ── */}
      <SectionBlock title="Guardian's Information">
        <Field label="Full Name" value={student.guardianName} />
        <Field label="Occupation" value={student.guardianOccupation} />
        <Field label="Contact Number" value={student.guardianContact} />
        <Field label="Email Address" value={student.guardianEmail} />
      </SectionBlock>

      {/* ── Edit Modal — portaled to body so it covers full screen ── */}
      {isEditOpen &&
        createPortal(
          <EditStudentModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            student={student}
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
