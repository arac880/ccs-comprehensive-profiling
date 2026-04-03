// components/studentComponents/TabPersonal.jsx
import { useState, useEffect } from "react";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import EditButton from "../../components/ui/EditButton";
import EditStudentModal from "../../components/studentComponents/EditStudentModal";

/* ───────────── Helpers ───────────── */
function Field({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      {/* Display empty string if no value */}
      <span className={styles.infoValue}>{value ?? ""}</span>
    </div>
  );
}

function SectionBlock({ title, children, action }) {
  return (
    <div className={styles.section}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className={styles.sectionTitle}>{title}</div>
        {action && <div>{action}</div>}
      </div>

      <div className={styles.infoGrid}>{children}</div>
    </div>
  );
}

/* ───────────── Component ───────────── */
export default function TabPersonal() {
  const [student, setStudent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/students/${user._id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch student");

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student:", err);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return <div className={styles.section}>Loading student data...</div>;
  }

  if (!student) {
    return (
      <div className={styles.section}>Unable to load student information.</div>
    );
  }

  return (
    <div>
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

      {/* ── Edit Modal ── */}
      <EditStudentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        student={student}
      />
    </div>
  );
}
