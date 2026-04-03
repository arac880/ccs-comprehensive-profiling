import React, { useState, useEffect } from "react";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import styles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

const EditStudentModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setActiveTab("personal");

      setFormData({
        firstName: "Jessa",
        middleInitial: "V.",
        lastName: "Cariñaga",
        birthdate: "2004-03-19",
        age: "21",
        gender: "Female",
        nationality: "Filipino",
        religion: "Roman Catholic",
        civilStatus: "Single",
        placeOfBirth: "Santa Rosa, Laguna",
        residency: "Non-Cabutao",

        studentAssistantship: "None",
        grantee: "No",

        address: "Blk 4 Lot 12, Sampaguita St., Santa Rosa, Laguna",
        contactNumber: "+63 912 345 6789",
        email: "jessa.carinaga@ccs.edu.ph",

        motherName: "Maria V. Cariñaga",
        motherOccupation: "Teacher",
        motherContact: "+63 918 765 4321",
        motherEmail: "maria.carinaga@gmail.com",

        fatherName: "Roberto C. Cariñaga",
        fatherOccupation: "Engineer",
        fatherContact: "+63 917 234 5678",
        fatherEmail: "roberto.carinaga@gmail.com",

        guardianName: "Roberto C. Cariñaga",
        guardianOccupation: "Engineer",
        guardianContact: "+63 917 234 5678",
        guardianEmail: "roberto.carinaga@gmail.com",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthdate") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData((prev) => ({
        ...prev,
        birthdate: value,
        age: age.toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    alert("Student updated successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            className={`${styles.tabBtn} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
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
              { label: "Nationality", name: "nationality" },
              { label: "Religion", name: "religion" },
              { label: "Civil Status", name: "civilStatus" },
              { label: "Place of Birth", name: "placeOfBirth" },
              { label: "Residency", name: "residency" },
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
          </div>
        )}

        {/* ACADEMIC */}
        {activeTab === "academic" && (
          <div className={styles.formGrid}>
            {[
              { label: "Assistantship", name: "studentAssistantship" },
              { label: "Grantee", name: "grantee" },
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

            {[
              { label: "Contact Number", name: "contactNumber" },
              { label: "Email", name: "email" },
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
          </div>
        )}

        {/* FAMILY */}
        {activeTab === "family" && (
          <div className={styles.formGrid}>
            {[
              // Mother
              { label: "Mother Name", name: "motherName" },
              { label: "Mother Occupation", name: "motherOccupation" },
              { label: "Mother Contact", name: "motherContact" },
              { label: "Mother Email", name: "motherEmail" },

              // Father
              { label: "Father Name", name: "fatherName" },
              { label: "Father Occupation", name: "fatherOccupation" },
              { label: "Father Contact", name: "fatherContact" },
              { label: "Father Email", name: "fatherEmail" },

              // Guardian
              { label: "Guardian Name", name: "guardianName" },
              { label: "Guardian Occupation", name: "guardianOccupation" },
              { label: "Guardian Contact", name: "guardianContact" },
              { label: "Guardian Email", name: "guardianEmail" },
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
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className={styles.modalFooter}>
        <AppButton variant="secondary" onClick={onClose}>
          Cancel
        </AppButton>

        <AppButton variant="primary" onClick={handleSave}>
          Save Changes
        </AppButton>
      </div>
    </AppModal>
  );
};

export default EditStudentModal;