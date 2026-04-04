import { useState, useEffect } from "react";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import DeleteButton from "../../components/ui/DeleteButton";
import AppToast from "../../components/ui/AppToast";
import ConfirmModal from "../../components/ui/ConfirmModal";

const EMPTY_FORM = {
  name: "",
  category: "",
  customCategory: "",
};

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Database",
  "Design",
  "Networking",
  "Other",
];

/* ───────────── Skill Modal ───────────── */
function SkillModal({ isOpen, onClose, onConfirmOpen, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _index, ...rest } = initialData;
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Pass data up to parent to show confirm modal
    onConfirmOpen({ name: formData.name.trim(), category: finalCategory });
  };

  if (!isOpen) return null;

  return (
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
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
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
    </AppModal>
  );
}

/* ───────────── Main Component ───────────── */
export default function TabSkills() {
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  /* ── Fetch skills on mount ── */
  useEffect(() => {
    const fetchSkills = async () => {
      if (!id) { setLoading(false); return; }

      try {
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setSkillList(data.skills || []);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setSkillList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  /* ── Open confirm modal with pending skill data ── */
  const handleConfirmOpen = (skillData) => {
    setPendingSkill(skillData);
    setIsConfirmOpen(true);
  };

  /* ── Confirmed — save to MongoDB ── */
  const handleConfirmAdd = async () => {
    if (!pendingSkill || !id) return;

    const updatedSkills = [...skillList, pendingSkill];

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updatedSkills }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save skill");
      }

      // Update localStorage
      const updatedUser = { ...user, skills: updatedSkills };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update UI
      setSkillList(updatedSkills);

      // Close both modals
      setIsConfirmOpen(false);
      setIsModalOpen(false);
      setPendingSkill(null);

      // Show toast
      setToast({
        isVisible: true,
        message: "Skill added successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Save skill error:", err);
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

  const categories = [...new Set(skillList.map((s) => s.category))];

  if (loading) {
    return <div className={tabStyles.section}>Loading skills...</div>;
  }

  return (
    <div>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>Skills</div>
          <div className={tabStyles.headerActions}>
            <AddButton
              title="Add Skill"
              onClick={() => setIsModalOpen(true)}
              disabled={saving}
            />
          </div>
        </div>

        {skillList.length === 0 ? (
          <p className={tabStyles.empty}>No skills recorded.</p>
        ) : (
          <div className={tabStyles.skillColumns}>
            {categories.map((cat) => (
              <div key={cat} className={tabStyles.skillColumn}>
                <div className={tabStyles.skillCat}>{cat}</div>
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
                            {/* Delete button kept but no function yet */}
                            <DeleteButton iconOnly />
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

      {/* Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmOpen={handleConfirmOpen}
        initialData={null}
      />

      {/* Confirm Add Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAdd}
        title="Add Skill"
        message={`Are you sure you want to add "${pendingSkill?.name}" under "${pendingSkill?.category}"?`}
        isProcessing={saving}
      />

      {/* Toast */}
      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}