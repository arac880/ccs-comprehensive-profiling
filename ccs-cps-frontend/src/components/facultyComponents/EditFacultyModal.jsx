// components/facultyComponents/EditFacultyModal.jsx
import React, { useState, useEffect } from "react";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import ConfirmModal from "../ui/ConfirmModal";
import styles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

/* ───────────── Constants ───────────── */
const DEPARTMENTS = ["BSIT", "BSCS", "BSEMC", "ACT"];

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

  if (formData.email && !formData.email.includes("@")) {
    errors.email = "Email must contain @.";
  }

  return errors;
};

/* ───────────── Component ───────────── */
const EditFacultyModal = ({ isOpen, onClose, faculty, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen && faculty) {
      setActiveTab("personal");
      setErrors({});

      const computeAge = (birthdate) => {
        if (!birthdate) return "";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age.toString();
      };

      setFormData({
        // Personal
        firstName: faculty.firstName || "",
        middleName: faculty.middleName || "",
        lastName: faculty.lastName || "",
        birthdate: faculty.birthdate || "",
        age: computeAge(faculty.birthdate) || "",
        gender: faculty.gender || "",
        civilStatus: faculty.civilStatus || "",

        // Faculty Info
        facultyId: faculty.facultyId || "",
        role: faculty.role || "Faculty",
        department: faculty.department || "",
        status: faculty.status || "",
        officeLocation: faculty.officeLocation || "",
        yearsAsFaculty: faculty.yearsAsFaculty ?? 0,
        yearsAsDean: faculty.yearsAsDean ?? 0,
        yearsAsDepartmentChair: faculty.yearsAsDepartmentChair ?? 0,

        // Contact
        email: faculty.email || "",
        contactNumber: faculty.contactNumber || "",
        address: faculty.address || "",

        // Preserve non-editable fields
        password: faculty.password || "",
        twoFAEnabled: faculty.twoFAEnabled || false,
        schedule: faculty.schedule || [],
      });
    }
  }, [isOpen, faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (
        ["contactNumber", "email", "address"].includes(
          Object.keys(validationErrors)[0],
        )
      ) {
        setActiveTab("contact");
      }
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

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/faculty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update faculty");
      }

      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (onSave) onSave(formData);
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
        title="Edit Faculty Profile"
        icon="bi-pencil-square"
        maxWidth="700px"
      >
        {/* TABS */}
        <div className={styles.modalTabs}>
          {["personal", "faculty", "contact"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "faculty"
                ? "Faculty Info"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          {/* ── PERSONAL TAB ── */}
          {activeTab === "personal" && (
            <div className={styles.formGrid}>
              {[
                { label: "First Name", name: "firstName" },
                { label: "Middle Name", name: "middleName" },
                { label: "Last Name", name: "lastName" },
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
                <label>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Age</label>
                <input value={formData.age || ""} disabled />
              </div>

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

              <div className={styles.formGroup}>
                <label>Civil Status</label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Separated</option>
                  <option>Annulled</option>
                </select>
              </div>
            </div>
          )}

          {/* ── FACULTY INFO TAB ── */}
          {activeTab === "faculty" && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Faculty ID</label>
                <input value={formData.facultyId || ""} disabled />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Dean</option>
                  <option>Department Chair</option>
                  <option>Secretary</option>
                  <option>Faculty</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Employment Status</label>
                <select
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Plantilla</option>
                  <option>Contract of Service</option>
                  <option>Contractual</option>
                  <option>Part time</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Office Location</label>
                <input
                  name="officeLocation"
                  value={formData.officeLocation || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Years as Faculty</label>
                <input
                  type="number"
                  name="yearsAsFaculty"
                  value={formData.yearsAsFaculty ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Years as Dean</label>
                <input
                  type="number"
                  name="yearsAsDean"
                  value={formData.yearsAsDean ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Years as Department Chair</label>
                <input
                  type="number"
                  name="yearsAsDepartmentChair"
                  value={formData.yearsAsDepartmentChair ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>
          )}

          {/* ── CONTACT TAB ── */}
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

              <div className={styles.formGroup}>
                <label>Email Address</label>
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
            {saving ? "Saving…" : "Save Changes"}
          </AppButton>
        </div>
      </AppModal>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Update"
        message="Are you sure you want to save the changes to your profile?"
        isProcessing={saving}
      />
    </>
  );
};

export default EditFacultyModal;
