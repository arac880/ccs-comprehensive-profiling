// components/studentComponents/TabPersonal.jsx
import { useState } from "react";
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiEdit2 } from "react-icons/fi";

function Field({ label, value }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || "—"}</span>
    </div>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.infoGrid}>{children}</div>
    </div>
  );
}

export default function TabPersonal({ student }) {
  return (
    <div>
      {/* ── Single Edit button for the entire Personal Information tab ── */}
      <div className={styles.tabTopBar}>
        <button className={styles.editBtn} title="Edit Personal Information">
          <FiEdit2 size={13} />
          <span>Edit</span>
        </button>
      </div>

      <SectionBlock title="Basic Information">
        <Field label="First Name" value={student.firstName} />
        <Field label="Middle Initial" value={student.middleInitial} />
        <Field label="Last Name" value={student.lastName} />
        <Field label="Date of Birth" value={student.dateOfBirth} />
        <Field label="Age" value={student.age} />
        <Field label="Gender" value={student.gender} />
        <Field label="Nationality" value={student.nationality} />
        <Field label="Religion" value={student.religion} />
        <Field label="Civil Status" value={student.civilStatus} />
        <Field label="Place of Birth" value={student.placeOfBirth} />
        <Field label="Residency" value={student.residency} />
      </SectionBlock>

      <SectionBlock title="Academic Status">
        <Field label="Student Number" value={student.studentNumber} />
        <Field label="Program" value={student.program} />
        <Field label="Year Level" value={student.yearLevel} />
        <Field label="Section" value={student.section} />
        <Field label="Student Type" value={student.type} />
        <Field label="Student Status" value={student.studentStatus} />
        <Field
          label="Student Assistantship"
          value={student.studentAssistantship}
        />
        <Field label="Grantee" value={student.grantee} />
      </SectionBlock>

      <SectionBlock title="Contact Information">
        <Field label="Present Address" value={student.address} />
        <Field label="Contact Number" value={student.contactNumber} />
        <Field label="Email Address" value={student.email} />
      </SectionBlock>

      <SectionBlock title="Mother's Information">
        <Field label="Full Name" value={student.motherName} />
        <Field label="Occupation" value={student.motherOccupation} />
        <Field label="Contact Number" value={student.motherContact} />
        <Field label="Email Address" value={student.motherEmail} />
      </SectionBlock>

      <SectionBlock title="Father's Information">
        <Field label="Full Name" value={student.fatherName} />
        <Field label="Occupation" value={student.fatherOccupation} />
        <Field label="Contact Number" value={student.fatherContact} />
        <Field label="Email Address" value={student.fatherEmail} />
      </SectionBlock>

      <SectionBlock title="Guardian's Information">
        <Field label="Full Name" value={student.fatherName} />
        <Field label="Occupation" value={student.fatherOccupation} />
        <Field label="Contact Number" value={student.fatherContact} />
        <Field label="Email Address" value={student.fatherEmail} />
      </SectionBlock>
    </div>
  );
}
