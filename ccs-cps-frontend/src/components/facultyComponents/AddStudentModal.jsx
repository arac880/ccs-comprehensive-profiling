import React, { useState, useEffect } from "react";
import AppButton from "../ui/AppButton";
import AppModal from "../ui/Modal";
import AppToast from "../ui/AppToast";
import ConfirmModal from "../ui/ConfirmModal";
import ErrorModal from "../ui/ErrorModal";
import styles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

const initialFormState = {
  studentId: "",
  firstName: "",
  lastName: "",
  birthdate: "",
  age: "",
  gender: "",
  address: "",
  program: "",
  year: "",
  section: "",
  type: "",
  status: "",
  email: "",
  phone: "", // Added Phone state
};

const AddStudentModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors({});
      setActiveTab("personal");
    }
  }, [isOpen]);

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    // Restriction: Remove numbers from First and Last Name
    if (name === "firstName" || name === "lastName") {
      nextValue = value.replace(/[0-9]/g, "");
    }

    // Restriction: Only allow numbers in Phone
    if (name === "phone") {
      nextValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "birthdate") {
      const newAge = calculateAge(nextValue);
      setFormData((prev) => ({
        ...prev,
        birthdate: nextValue,
        age: newAge.toString(),
      }));
      setErrors((prev) => ({ ...prev, birthdate: "", age: "" }));
    } else if (name === "type") {
      // Clear the section if type changes to prevent invalid states
      setFormData((prev) => ({ ...prev, type: nextValue, section: "" }));
      if (errors.type)
        setErrors((prev) => ({ ...prev, type: "", section: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "studentId",
      "firstName",
      "lastName",
      "birthdate",
      "gender",
      "address",
      "program",
      "year",
      "section",
      "type",
      "status",
      "email",
      "phone", // Added to required
    ];

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        formData[field].toString().startsWith("Select ")
      ) {
        newErrors[field] = "This field is required";
      }
    });

    // Stricter Email Validation (requires @ and a domain like .com, .net, etc.)
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email =
        "Please enter a valid email address (e.g., name@domain.com)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const personalFields = [
        "firstName",
        "lastName",
        "birthdate",
        "gender",
        "address",
      ];
      const academicFields = [
        "studentId",
        "program",
        "year",
        "section",
        "type",
        "status",
      ];

      if (personalFields.some((field) => newErrors[field])) {
        setActiveTab("personal");
      } else if (academicFields.some((field) => newErrors[field])) {
        setActiveTab("academic");
      } else {
        setActiveTab("contact");
      }
      return false;
    }
    return true;
  };

  const handleInitialSubmit = () => {
    if (!validateForm()) {
      showToast("Please fill out all required fields correctly.", "error");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeSave = async () => {
    setIsSubmitting(true);
    try {
      const sanitizedData = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        studentId: formData.studentId.trim(),
        email: formData.email.trim(),
        section: formData.section.trim(),
      };

      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save student.");
      }

      setIsConfirmOpen(false);
      showToast("Student profile saved successfully!", "success");

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      setIsConfirmOpen(false);
      setErrorMessage(
        error.message || "An error occurred while connecting to the server.",
      );
      setIsErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequiredMark = () => (
    <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
  );

  const ErrorText = ({ message }) =>
    message ? (
      <span
        style={{
          color: "#dc3545",
          fontSize: "11px",
          marginTop: "4px",
          display: "block",
        }}
      >
        {message}
      </span>
    ) : null;

  if (!isOpen) return null;

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <>
      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <AppModal
        isOpen={isOpen}
        onClose={onClose}
        title="New Student Profile"
        icon="bi-person-plus-fill"
        maxWidth="650px"
      >
        <div className={styles.modalTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "personal" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("personal")}
            type="button"
          >
            <i
              className="bi bi-person-lines-fill"
              style={{ marginRight: "6px" }}
            />
            Personal Info
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "academic" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("academic")}
            type="button"
          >
            <i
              className="bi bi-mortarboard-fill"
              style={{ marginRight: "6px" }}
            />
            Academic Details
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "contact" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("contact")}
            type="button"
          >
            <i
              className="bi bi-telephone-fill"
              style={{ marginRight: "6px" }}
            />
            Contact Info
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* PERSONAL INFO TAB */}
          {activeTab === "personal" && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  <i className="bi bi-person" style={{ marginRight: "4px" }} />
                  First Name <RequiredMark />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Juan"
                  style={{ borderColor: errors.firstName ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.firstName} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i className="bi bi-person" style={{ marginRight: "4px" }} />
                  Last Name <RequiredMark />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Dela Cruz"
                  style={{ borderColor: errors.lastName ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.lastName} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-calendar-date"
                    style={{ marginRight: "4px" }}
                  />
                  Birthdate <RequiredMark />
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate || ""}
                  onChange={handleChange}
                  max={todayString}
                  onClick={(e) => {
                    if (e.target.showPicker) e.target.showPicker();
                  }}
                  style={{
                    borderColor: errors.birthdate ? "#dc3545" : "",
                    cursor: "pointer",
                  }}
                />
                <ErrorText message={errors.birthdate} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i className="bi bi-123" style={{ marginRight: "4px" }} /> Age{" "}
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  disabled
                  placeholder="Auto-calculated"
                  style={{
                    backgroundColor: "#e8ddd5",
                    color: "#666",
                    cursor: "not-allowed",
                    borderColor: errors.age ? "#dc3545" : "",
                  }}
                />
                <ErrorText message={errors.age} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-gender-ambiguous"
                    style={{ marginRight: "4px" }}
                  />
                  Gender <RequiredMark />
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ borderColor: errors.gender ? "#dc3545" : "" }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ErrorText message={errors.gender} />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  <i className="bi bi-geo-alt" style={{ marginRight: "4px" }} />
                  Address <RequiredMark />
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete home address"
                  style={{ borderColor: errors.address ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.address} />
              </div>
            </div>
          )}

          {/* ACADEMIC DETAILS TAB */}
          {activeTab === "academic" && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-card-text"
                    style={{ marginRight: "4px" }}
                  />
                  Student ID <RequiredMark />
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. 2201001"
                  style={{ borderColor: errors.studentId ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.studentId} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-activity"
                    style={{ marginRight: "4px" }}
                  />
                  Status <RequiredMark />
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ borderColor: errors.status ? "#dc3545" : "" }}
                >
                  <option value="">Select Status</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="LOA">LOA</option>
                  <option value="Dropped">Dropped</option>
                </select>
                <ErrorText message={errors.status} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-person-badge"
                    style={{ marginRight: "4px" }}
                  />
                  Type <RequiredMark />
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: errors.type ? "#dc3545" : "" }}
                >
                  <option value="">Select Type</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
                <ErrorText message={errors.type} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-journal-bookmark"
                    style={{ marginRight: "4px" }}
                  />
                  Program <RequiredMark />
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  style={{ borderColor: errors.program ? "#dc3545" : "" }}
                >
                  <option value="">Select Program</option>
                  <option value="BS Computer Science">
                    BS Computer Science
                  </option>
                  <option value="BS Information Technology">
                    BS Information Technology
                  </option>
                </select>
                <ErrorText message={errors.program} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-bar-chart-steps"
                    style={{ marginRight: "4px" }}
                  />
                  Year <RequiredMark />
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  style={{ borderColor: errors.year ? "#dc3545" : "" }}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                <ErrorText message={errors.year} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-diagram-2"
                    style={{ marginRight: "4px" }}
                  />
                  Section <RequiredMark />
                </label>
                {formData.type === "Irregular" ? (
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A, C (Type manually)"
                    style={{ borderColor: errors.section ? "#dc3545" : "" }}
                  />
                ) : (
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    style={{ borderColor: errors.section ? "#dc3545" : "" }}
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                )}
                <ErrorText message={errors.section} />
              </div>
            </div>
          )}

          {/* CONTACT INFO TAB */}
          {activeTab === "contact" && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-envelope"
                    style={{ marginRight: "4px" }}
                  />
                  Email <RequiredMark />
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student00@gmail.com"
                  style={{ borderColor: errors.email ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.email} />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <i
                    className="bi bi-telephone"
                    style={{ marginRight: "4px" }}
                  />
                  Phone Number <RequiredMark />
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 09123456789"
                  style={{ borderColor: errors.phone ? "#dc3545" : "" }}
                />
                <ErrorText message={errors.phone} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <AppButton
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <i className="bi bi-x-circle" style={{ marginRight: "6px" }} />
            Cancel
          </AppButton>

          <AppButton
            variant="primary"
            onClick={handleInitialSubmit}
            disabled={isSubmitting}
          >
            <i className="bi bi-check2-circle" style={{ marginRight: "6px" }} />
            Save Student
          </AppButton>
        </div>
      </AppModal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeSave}
        title="Confirm Student Profile"
        message="Are you sure you want to add this student to the system? Please double check all details."
        isProcessing={isSubmitting}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Registration Failed"
        message={errorMessage}
      />
    </>
  );
};

export default AddStudentModal;
