// components/studentComponents/TabSkills.jsx
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";

import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import DeleteButton from "../../components/ui/DeleteButton";
import AppToast from "../../components/ui/AppToast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import FilterDropdown from "../../components/ui/FilterDropdown";

import { FiCode } from "react-icons/fi";

const EMPTY_FORM = { name: "", category: "", customCategory: "" };

const CATEGORIES = [
  "All",
  "Programming",
  "Web Development",
  "Database",
  "Design",
  "Networking",
  "Other",
];

/* ───────────────────────────── */
/* MODAL */
/* ───────────────────────────── */
/* MODAL (self-contained, no AppModal) */
function SkillModal({ isOpen, onClose, onConfirmOpen, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return alert("Please enter a skill name");
    if (!formData.category) return alert("Please select a category");

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim() || "Other"
        : formData.category;

    onConfirmOpen({ ...formData, category: finalCategory });
  };

  if (!isOpen) return null;

  return createPortal(
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Skill" : "Add Skill"}
      maxWidth="450px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={formStyles.formGroup}>
            <label>Skill Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. React, Node.js"
            />
          </div>

          <div className={formStyles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {formData.category === "Other" && (
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>Custom Category</label>
              <input
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Enter custom category"
              />
            </div>
          )}
        </div>
      </div>

      <div className={formStyles.modalFooter}>
        <AppButton variant="secondary" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton variant="primary" onClick={handleSubmit}>
          {initialData ? "Save Changes" : "Add Skill"}
        </AppButton>
      </div>
    </AppModal>,
    document.body,
  );
}

/* ───────────────────────────── */
/* MAIN */
export default function TabSkills() {
  const [skillList, setSkillList] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(null);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  /* ── FETCH ── */
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${id}`,
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setSkillList(data.skills || []);
      } catch (err) {
        setToast({ isVisible: true, message: err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSkills();
  }, [id]);

  /* ── COUNTS ── */
  const countByCategory = useMemo(() => {
    return skillList.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {});
  }, [skillList]);

  /* ── FILTER ── */
  const filteredSkills =
    filter === "All"
      ? skillList
      : skillList.filter((s) => s.category === filter);

  /* ── ADD ── */
  const handleConfirmAdd = async () => {
    const updated = [...skillList, pendingSkill];

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updated }),
      });

      setSkillList(updated);
      setToast({ isVisible: true, message: "Skill added!", type: "success" });
    } catch (err) {
      setToast({ isVisible: true, message: err.message, type: "error" });
    }

    setIsConfirmOpen(false);
    setIsModalOpen(false);
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    const updated = skillList.filter((_, i) => i !== deleteIndex);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updated }),
      });

      setSkillList(updated);
      setToast({ isVisible: true, message: "Deleted!", type: "success" });
    } catch (err) {
      setToast({ isVisible: true, message: err.message, type: "error" });
    }

    setIsConfirmDeleteOpen(false);
  };

  if (loading) return <div>Loading skills...</div>;

  const categoryOptionsWithCount = CATEGORIES.map((cat) => {
    if (cat === "All") return `${cat} (${skillList.length})`;
    return `${cat} (${countByCategory[cat] || 0})`;
  });

  return (
    <div className={tabStyles.tabWrapper}>
      <div className={tabStyles.section}>
        {/* HEADER */}
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiCode /> Skills
          </div>

          <div className={tabStyles.headerActions}>
            <FilterDropdown
              value={filter}
              onChange={(val) => {
                const cat = val.split(" (")[0];
                setFilter(cat);
              }}
              options={categoryOptionsWithCount}
            />

            <AddButton onClick={() => setIsModalOpen(true)} />
          </div>
        </div>

        {/* LIST */}
        <div className={tabStyles.skillNumberedList}>
          {filteredSkills.length === 0 ? (
            <p className={tabStyles.empty}>No skills found.</p>
          ) : (
            filteredSkills.map((skill, i) => (
              <div key={i} className={tabStyles.skillNumberedRow}>
                <span className={tabStyles.skillRowNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className={tabStyles.skillIconBox}>
                  <FiCode size={16} />
                </div>

                <div className={tabStyles.skillRowInfo}>
                  <span className={tabStyles.skillRowName}>{skill.name}</span>
                  <span className={tabStyles.skillCategoryPill}>
                    {skill.category}
                  </span>
                </div>

                <DeleteButton
                  iconOnly
                  onClick={() => {
                    setDeleteIndex(i);
                    setIsConfirmDeleteOpen(true);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmOpen={(data) => {
          setPendingSkill(data);
          setIsConfirmOpen(true);
        }}
        initialData={null} // set skill object here if editing
      />

      {/* CONFIRM ADD */}
      {isConfirmOpen &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmAdd}
            message={`Add "${pendingSkill?.name}"?`}
          />,
          document.body,
        )}

      {/* CONFIRM DELETE */}
      {isConfirmDeleteOpen &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleDelete}
            message="Delete this skill?"
          />,
          document.body,
        )}

      {/* TOAST */}
      {toast.isVisible &&
        createPortal(
          <AppToast
            isVisible={toast.isVisible}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((p) => ({ ...p, isVisible: false }))}
          />,
          document.body,
        )}
    </div>
  );
}
