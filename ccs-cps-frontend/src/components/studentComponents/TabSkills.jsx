import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import DeleteButton from "../../components/ui/DeleteButton";
import AppToast from "../../components/ui/AppToast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { FiCode } from "react-icons/fi";

const EMPTY_FORM = { name: "", category: "", customCategory: "" };

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Database",
  "Design",
  "Networking",
  "Other",
];

/* Category → badge color */
const CAT_COLOR = {
  Programming: tabStyles.badgeOrange,
  "Web Development": tabStyles.badgeBlue,
  Database: tabStyles.badgeGreen,
  Design: tabStyles.badgePurple,
  Networking: tabStyles.badgeAmber,
};

/* ── Skill Modal ────────────────────────────────────────────── */
function SkillModal({ isOpen, onClose, onConfirmOpen, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _i, ...rest } = initialData;
      const isCustom = rest.category && !CATEGORIES.includes(rest.category);
      setFormData({
        ...rest,
        category: isCustom ? "Other" : rest.category,
        customCategory: isCustom ? rest.category : "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter a skill name.");
      return;
    }
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }
    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim() || "Other"
        : formData.category;
    onConfirmOpen({ name: formData.name.trim(), category: finalCategory });
  };

  if (!isOpen) return null;

  return createPortal(
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Skill"
      maxWidth="450px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Skill Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. React, Python, Figma"
            />
          </div>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {formData.category === "Other" && (
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>Specify Category</label>
              <input
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="e.g. Mobile Development, AI, DevOps"
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
          Add Skill
        </AppButton>
      </div>
    </AppModal>,
    document.body,
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function TabSkills() {
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  useEffect(() => {
    const fetchSkills = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSkillList(data.skills || []);
      } catch (err) {
        console.error(err);
        setSkillList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleConfirmOpen = (skillData) => {
    setPendingSkill(skillData);
    setIsConfirmOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!pendingSkill || !id) return;
    const updated = [...skillList, pendingSkill];
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updated }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, skills: updated }),
      );
      setSkillList(updated);
      setIsConfirmOpen(false);
      setIsModalOpen(false);
      setPendingSkill(null);
      setToast({
        isVisible: true,
        message: "Skill added successfully.",
        type: "success",
      });
    } catch (err) {
      setIsConfirmOpen(false);
      setToast({
        isVisible: true,
        message: `Error: ${err.message}`,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (deleteIndex === null || !id) return;
    const updated = skillList.filter((_, i) => i !== deleteIndex);
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updated }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, skills: updated }),
      );
      setSkillList(updated);
      setIsConfirmDeleteOpen(false);
      setDeleteIndex(null);
      setToast({
        isVisible: true,
        message: "Skill deleted successfully.",
        type: "success",
      });
    } catch (err) {
      setIsConfirmDeleteOpen(false);
      setToast({
        isVisible: true,
        message: `Error: ${err.message}`,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const categories = [...new Set(skillList.map((s) => s.category))];

  if (loading)
    return (
      <div className={tabStyles.section}>
        <div className={tabStyles.loadingState}>Loading skills…</div>
      </div>
    );

  return (
    <div className={tabStyles.tabWrapper}>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiCode size={13} />
            Skills
          </div>
          <div className={tabStyles.headerActions}>
            <AddButton
              title="Add Skill"
              onClick={() => setIsModalOpen(true)}
              disabled={saving}
            />
          </div>
        </div>

        {skillList.length === 0 ? (
          <p className={tabStyles.empty}>No skills recorded yet.</p>
        ) : (
          <div className={tabStyles.skillColumns}>
            {categories.map((cat) => (
              <div key={cat} className={tabStyles.skillColumn}>
                <div className={tabStyles.skillCat}>
                  <span
                    className={`${tabStyles.badge} ${CAT_COLOR[cat] ?? tabStyles.badgeBlue}`}
                    style={{ marginRight: 6 }}
                  >
                    {cat}
                  </span>
                </div>
                <ul className={tabStyles.skillList}>
                  {skillList
                    .filter((s) => s.category === cat)
                    .map((skill) => {
                      const globalIndex = skillList.indexOf(skill);
                      return (
                        <li key={globalIndex} className={tabStyles.skillItem}>
                          <div className={tabStyles.skillInfo}>
                            <span className={tabStyles.skillName}>
                              {skill.name}
                            </span>
                          </div>
                          <div className={tabStyles.skillActions}>
                            <DeleteButton
                              iconOnly
                              onClick={() => handleDeleteClick(globalIndex)}
                            />
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmOpen={handleConfirmOpen}
        initialData={null}
      />

      {isConfirmOpen &&
        createPortal(
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmAdd}
            title="Add Skill"
            message={`Add "${pendingSkill?.name}" under "${pendingSkill?.category}"?`}
            isProcessing={saving}
          />,
          document.body,
        )}

      {isConfirmDeleteOpen &&
        createPortal(
          <ConfirmModal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Skill"
            message={`Delete "${skillList[deleteIndex]?.name}"?`}
            isProcessing={saving}
          />,
          document.body,
        )}

      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((p) => ({ ...p, isVisible: false }))}
      />
    </div>
  );
}
