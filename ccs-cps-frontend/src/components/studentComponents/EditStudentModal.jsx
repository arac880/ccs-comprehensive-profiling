import React, { useState, useEffect } from "react";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import ConfirmModal from "../ui/ConfirmModal";
import styles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

/* ───────────── Constants ───────────── */
const NATIONALITIES = [
  "Filipino",
  "American",
  "Australian",
  "Brazilian",
  "British",
  "Canadian",
  "Chinese",
  "Dutch",
  "French",
  "German",
  "Indian",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Malaysian",
  "Mexican",
  "New Zealander",
  "Nigerian",
  "Pakistani",
  "Portuguese",
  "Russian",
  "Saudi Arabian",
  "Singaporean",
  "Spanish",
  "Thai",
  "Turkish",
  "Vietnamese",
  "Other",
];

const RELIGIONS = [
  "Roman Catholic",
  "Islam",
  "Iglesia ni Cristo",
  "Born Again Christian",
  "Seventh-day Adventist",
  "United Church of Christ in the Philippines",
  "Philippine Independent Church (Aglipayan)",
  "Jesus Is Lord Church",
  "Buddhism",
  "Hinduism",
  "Judaism",
  "Other",
];

/* ───────────── Validation ───────────── */
const validate = (formData) => {
  const errors = {};

  if (formData.contactNumber) {
    const contact = formData.contactNumber.replace(/\s/g, "");
    if (!contact.startsWith("09") || contact.length !== 11) {
      errors.contactNumber =
        "Contact number must start with 09 and be 11 digits.";
    }
  }

  if (formData.email) {
    if (!formData.email.includes("@")) {
      errors.email = "Email must contain @.";
    }
  }

  if (formData.motherContact) {
    const contact = formData.motherContact.replace(/\s/g, "");
    if (contact && (!contact.startsWith("09") || contact.length !== 11)) {
      errors.motherContact =
        "Mother's contact must start with 09 and be 11 digits.";
    }
  }

  if (formData.fatherContact) {
    const contact = formData.fatherContact.replace(/\s/g, "");
    if (contact && (!contact.startsWith("09") || contact.length !== 11)) {
      errors.fatherContact =
        "Father's contact must start with 09 and be 11 digits.";
    }
  }

  if (formData.guardianContact) {
    const contact = formData.guardianContact.replace(/\s/g, "");
    if (contact && (!contact.startsWith("09") || contact.length !== 11)) {
      errors.guardianContact =
        "Guardian's contact must start with 09 and be 11 digits.";
    }
  }

  if (formData.motherEmail && !formData.motherEmail.includes("@")) {
    errors.motherEmail = "Mother's email must contain @.";
  }

  if (formData.fatherEmail && !formData.fatherEmail.includes("@")) {
    errors.fatherEmail = "Father's email must contain @.";
  }

  if (formData.guardianEmail && !formData.guardianEmail.includes("@")) {
    errors.guardianEmail = "Guardian's email must contain @.";
  }

  return errors;
};

/* ───────────── Component ───────────── */
const EditStudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showOtherReligion, setShowOtherReligion] = useState(false);
  const [otherReligion, setOtherReligion] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (isOpen && student) {
      setActiveTab("personal");
      setErrors({});

      // Check if saved religion is in the list or is "Other"
      const isKnownReligion = RELIGIONS.includes(student.religion);
      const isOther = student.religion && !isKnownReligion;
      setShowOtherReligion(isOther);
      setOtherReligion(isOther ? student.religion : "");

      setFormData({
        firstName: student.firstName || "",
        middleInitial: student.middleInitial || "",
        lastName: student.lastName || "",
        birthdate: student.birthdate || "",
        age: student.age || "",
        gender: student.gender || "",
        nationality: student.nationality || "Filipino",
        religion: isOther ? "Other" : student.religion || "",
        civilStatus: student.civilStatus || "",
        placeOfBirth: student.placeOfBirth || "",
        residency: student.residency || "",
        studentAssistantship: student.studentAssistantship || "",
        grantee: student.grantee || "",
        address: student.address || "",
        contactNumber: student.contactNumber || "",
        email: student.email || "",
        motherName: student.motherName || "",
        motherOccupation: student.motherOccupation || "",
        motherContact: student.motherContact || "",
        motherEmail: student.motherEmail || "",
        fatherName: student.fatherName || "",
        fatherOccupation: student.fatherOccupation || "",
        fatherContact: student.fatherContact || "",
        fatherEmail: student.fatherEmail || "",
        guardianName: student.guardianName || "",
        guardianOccupation: student.guardianOccupation || "",
        guardianContact: student.guardianContact || "",
        guardianEmail: student.guardianEmail || "",

        // ← ADD THESE so they are never lost on save
        type: student.type || "Regular",
        status: student.status || "Enrolled",
        program: student.program || "",
        year: student.year || "",
        section: student.section || "",
        studentId: student.studentId || "",
        role: student.role || "student",
        skills: student.skills || [],
      });
    }
  }, [isOpen, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "birthdate") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((prev) => ({
        ...prev,
        birthdate: value,
        age: age.toString(),
      }));
    } else if (name === "religion") {
      setShowOtherReligion(value === "Other");
      if (value !== "Other") setOtherReligion("");
      setFormData((prev) => ({ ...prev, religion: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = () => {
    // Build final data with "Other" religion resolved
    const finalData = {
      ...formData,
      religion:
        formData.religion === "Other" ? otherReligion : formData.religion,
    };

    const validationErrors = validate(finalData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Switch to the tab that has the first error
      const errorField = Object.keys(validationErrors)[0];
      if (["contactNumber", "email"].includes(errorField))
        setActiveTab("contact");
      if (
        [
          "motherContact",
          "motherEmail",
          "fatherContact",
          "fatherEmail",
          "guardianContact",
          "guardianEmail",
        ].includes(errorField)
      )
        setActiveTab("family");

      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;

    if (!id) {
      setIsConfirmOpen(false);
      return;
    }

    const finalData = {
      ...formData,
      religion:
        formData.religion === "Other" ? otherReligion : formData.religion,
    };

    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update student");
      }

      const updatedUser = { ...user, ...finalData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (onSave) onSave(finalData);
      setIsConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      setIsConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AppModal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Student Profile"
        icon="bi-pencil-square"
        maxWidth="700px"
      >
        {/* TABS */}
        <div className={styles.modalTabs}>
          {["personal", "academic", "contact", "family"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          {/* PERSONAL */}
          {activeTab === "personal" && (
            <div className={styles.formGrid}>
              {[
                { label: "First Name", name: "firstName" },
                { label: "Middle Initial", name: "middleInitial" },
                { label: "Last Name", name: "lastName" },
                { label: "Place of Birth", name: "placeOfBirth" },
              ].map((field) => (
                <div className={styles.formGroup} key={field.name}>
                  <label>{field.label}</label>
                  <input
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label>Civil Status</label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Annulled">Annulled</option>
                </select>
              </div>

              {/* Birthdate */}
              <div className={styles.formGroup}>
                <label>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Age */}
              <div className={styles.formGroup}>
                <label>Age</label>
                <input value={formData.age || ""} disabled />
              </div>

              {/* Gender */}
              <div className={styles.formGroup}>
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              {/* Nationality */}
              <div className={styles.formGroup}>
                <label>Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality || "Filipino"}
                  onChange={handleChange}
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Religion */}
              <div className={styles.formGroup}>
                <label>Religion</label>
                <select
                  name="religion"
                  value={formData.religion || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {RELIGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other Religion input — shows only when "Other" is selected */}
              {showOtherReligion && (
                <div className={styles.formGroup}>
                  <label>Please specify Religion</label>
                  <input
                    name="otherReligion"
                    placeholder="Type your religion..."
                    value={otherReligion}
                    onChange={(e) => setOtherReligion(e.target.value)}
                  />
                </div>
              )}

              {/* Residency */}
              <div className={styles.formGroup}>
                <label>Residency</label>
                <select
                  name="residency"
                  value={formData.residency || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Cabuyao">Cabuyao</option>
                  <option value="Non-Cabuyao">Non-Cabuyao</option>
                </select>
              </div>
            </div>
          )}

          {/* ACADEMIC */}
          {activeTab === "academic" && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Assistantship</label>
                <input
                  name="studentAssistantship"
                  value={formData.studentAssistantship || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Grantee</label>
                <select
                  name="grantee"
                  value={formData.grantee || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {activeTab === "contact" && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Number */}
              <div className={styles.formGroup}>
                <label>Contact Number</label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
                {errors.contactNumber && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.contactNumber}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* FAMILY */}
          {activeTab === "family" && (
            <div className={styles.formGrid}>
              {/* Mother */}
              {[
                { label: "Mother Name", name: "motherName" },
                { label: "Mother Occupation", name: "motherOccupation" },
              ].map((field) => (
                <div className={styles.formGroup} key={field.name}>
                  <label>{field.label}</label>
                  <input
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label>Mother Contact</label>
                <input
                  name="motherContact"
                  value={formData.motherContact || ""}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
                {errors.motherContact && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.motherContact}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Mother Email</label>
                <input
                  name="motherEmail"
                  value={formData.motherEmail || ""}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.motherEmail && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.motherEmail}
                  </span>
                )}
              </div>

              {/* Father */}
              {[
                { label: "Father Name", name: "fatherName" },
                { label: "Father Occupation", name: "fatherOccupation" },
              ].map((field) => (
                <div className={styles.formGroup} key={field.name}>
                  <label>{field.label}</label>
                  <input
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label>Father Contact</label>
                <input
                  name="fatherContact"
                  value={formData.fatherContact || ""}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
                {errors.fatherContact && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.fatherContact}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Father Email</label>
                <input
                  name="fatherEmail"
                  value={formData.fatherEmail || ""}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.fatherEmail && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.fatherEmail}
                  </span>
                )}
              </div>

              {/* Guardian */}
              {[
                { label: "Guardian Name", name: "guardianName" },
                { label: "Guardian Occupation", name: "guardianOccupation" },
              ].map((field) => (
                <div className={styles.formGroup} key={field.name}>
                  <label>{field.label}</label>
                  <input
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label>Guardian Contact</label>
                <input
                  name="guardianContact"
                  value={formData.guardianContact || ""}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
                {errors.guardianContact && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.guardianContact}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Guardian Email</label>
                <input
                  name="guardianEmail"
                  value={formData.guardianEmail || ""}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.guardianEmail && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.guardianEmail}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.modalFooter}>
          <AppButton variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            onClick={handleSaveClick}
            disabled={saving}
          >
            Save Changes
          </AppButton>
        </div>
      </AppModal>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Update"
        message="Are you sure you want to save the changes to your personal information?"
        isProcessing={saving}
      />
    </>
  );
};

export default EditStudentModal;
