import { useState, useEffect } from "react";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import EditButton from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";

const CAT_COLOR = {
  Competition: `${tabStyles.badge} ${tabStyles.badgeOrange}`,
  Event: `${tabStyles.badge} ${tabStyles.badgeBlue}`,
  Seminar: `${tabStyles.badge} ${tabStyles.badgeGreen}`,
  Workshop: `${tabStyles.badge} ${tabStyles.badgeAmber}`,
};

const EMPTY_FORM = {
  title: "",
  category: "",
  date: "",
  description: "",
};

function ActivityModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _index, year: _year, ...rest } = initialData; // strip both index and year
      setFormData(rest);
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const year = formData.date
      ? new Date(formData.date).getFullYear().toString()
      : "";
    onSave({ ...formData, year }); // year auto-derived from date
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Activity" : "Add Activity"}
      maxWidth="500px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={formStyles.formGroup}>
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Regional ICT Quiz Bee"
            />
          </div>

          <div className={formStyles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Competition</option>
              <option>Event</option>
              <option>Seminar</option>
              <option>Workshop</option>
            </select>
          </div>

          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the activity..."
            />
          </div>
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

export default function TabNonAcademic({ activities = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [activityList, setActivityList] = useState(activities);

  const handleAdd = () => {
    setSelectedActivity(null);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (act, index) => {
    setSelectedActivity(act);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (editIndex !== null) {
      const updated = [...activityList];
      updated[editIndex] = data;
      setActivityList(updated);
    } else {
      setActivityList([...activityList, data]);
    }
  };

  const handleDelete = (index) => {
    setActivityList(activityList.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            Activities & Recognitions
          </div>
          <div className={tabStyles.headerActions}>
            <AddButton title="Add Activity" onClick={handleAdd} />
          </div>
        </div>

        {activityList.length === 0 ? (
          <p className={tabStyles.empty}>No activities recorded.</p>
        ) : (
          <div className={tabStyles.cardGrid}>
            {activityList.map((act, idx) => (
              <div key={idx} className={tabStyles.card}>
                <div className={tabStyles.cardHeader}>
                  <div className={tabStyles.cardTitle}>{act.title}</div>
                  <div className={tabStyles.cardActions}>
                    <DeleteButton iconOnly onClick={() => handleDelete(idx)} />
                    <EditButton iconOnly onClick={() => handleEdit(act, idx)} />
                  </div>
                </div>

                <div className={tabStyles.cardMeta}>
                  <span
                    className={
                      CAT_COLOR[act.category] ||
                      `${tabStyles.badge} ${tabStyles.badgeBlue}`
                    }
                  >
                    {act.category}
                  </span>
                  <span className={tabStyles.cardMetaYear}>{act.year}</span>
                </div>

                {act.description && (
                  <p className={tabStyles.cardDesc}>{act.description}</p>
                )}

                {act.date && (
                  <div className={tabStyles.cardDate}>
                    {new Date(act.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedActivity}
      />
    </div>
  );
}
