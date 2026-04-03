import { useState, useEffect } from "react";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import DeleteButton from "../../components/ui/DeleteButton";

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

function SkillModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _index, ...rest } = initialData;
      // if the saved category isn't in the predefined list, treat it as "Other"
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
    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim() || "Other"
        : formData.category;

    onSave({ name: formData.name, category: finalCategory });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Skill" : "Add Skill"}
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
          Save
        </AppButton>
      </div>
    </AppModal>
  );
}

export default function TabSkills({ skills = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [skillList, setSkillList] = useState(skills);

  const categories = [...new Set(skillList.map((s) => s.category))];

  const handleAdd = () => {
    setSelectedSkill(null);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill, index) => {
    setSelectedSkill(skill);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (editIndex !== null) {
      const updated = [...skillList];
      updated[editIndex] = data;
      setSkillList(updated);
    } else {
      setSkillList([...skillList, data]);
    }
  };

  const handleDelete = (index) => {
    setSkillList(skillList.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>Skills</div>
          <div className={tabStyles.headerActions}>
            <AddButton title="Add Skill" onClick={handleAdd} />
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
                            <DeleteButton
                              iconOnly
                              onClick={() => handleDelete(globalIndex)}
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
        onSave={handleSave}
        initialData={selectedSkill}
      />
    </div>
  );
}
