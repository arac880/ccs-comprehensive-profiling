import { useState, useEffect } from "react";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import EditButton from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";
import ConfirmModal from "../../components/ui/ConfirmModal";
import AppToast from "../../components/ui/AppToast";

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

/* ───────────── Activity Modal ───────────── */
function ActivityModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _index, year: _year, ...rest } = initialData;
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
    if (!formData.title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }
    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    const year = new Date(formData.date).getFullYear().toString();
    onSave({ ...formData, year });
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
          {initialData ? "Save Changes" : "Add Activity"}
        </AppButton>
      </div>
    </AppModal>
  );
}

/* ───────────── Main Component ───────────── */
export default function TabNonAcademic() {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Confirm add/edit
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingActivity, setPendingActivity] = useState(null);

  // Confirm delete
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Toast
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  /* ── Fetch activities on mount ── */
  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setActivityList(data.activities || []);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setActivityList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  /* ── Save activities array to MongoDB ── */
  const saveActivitiesToDB = async (updatedActivities) => {
    if (!id) return false;

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities: updatedActivities }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save activity");
      }

      const updatedUser = { ...user, activities: updatedActivities };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return true;
    } catch (err) {
      console.error("Save activity error:", err);
      setToast({
        isVisible: true,
        message: `Error: ${err.message}`,
        type: "error",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  /* ── Add / Edit handlers ── */
  const handleAdd = () => {
    setSelectedActivity(null);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (act, index) => {
    setSelectedActivity({ ...act, index });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Called from ActivityModal after validation passes
  const handleSave = (data) => {
    setPendingActivity(data);
    setIsConfirmSaveOpen(true);
  };

  // Called after confirm
  const handleConfirmSave = async () => {
    let updatedActivities;

    if (editIndex !== null) {
      updatedActivities = [...activityList];
      updatedActivities[editIndex] = pendingActivity;
    } else {
      updatedActivities = [...activityList, pendingActivity];
    }

    const success = await saveActivitiesToDB(updatedActivities);
    if (success) {
      setActivityList(updatedActivities);
      setIsConfirmSaveOpen(false);
      setIsModalOpen(false);
      setPendingActivity(null);
      setEditIndex(null);
      setSelectedActivity(null);

      setToast({
        isVisible: true,
        message:
          editIndex !== null
            ? "Activity updated successfully."
            : "Activity added successfully.",
        type: "success",
      });
    }
  };

  /* ── Delete handlers ── */
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedActivities = activityList.filter((_, i) => i !== deleteIndex);

    const success = await saveActivitiesToDB(updatedActivities);
    if (success) {
      setActivityList(updatedActivities);
      setIsConfirmDeleteOpen(false);
      setDeleteIndex(null);

      setToast({
        isVisible: true,
        message: "Activity deleted successfully.",
        type: "success",
      });
    }
  };

  if (loading) {
    return <div className={tabStyles.section}>Loading activities...</div>;
  }

  return (
    <div>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            Activities & Recognitions
          </div>
          <div className={tabStyles.headerActions}>
            <AddButton
              title="Add Activity"
              onClick={handleAdd}
              disabled={saving}
            />
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
                    <DeleteButton
                      iconOnly
                      onClick={() => handleDeleteClick(idx)}
                    />
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

                {/* ── Date bottom right ── */}
                {act.date && (
                  <div className={tabStyles.cardFooter}>
                    <span className={tabStyles.cardDate}>
                      {new Date(act.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
          setEditIndex(null);
        }}
        onSave={handleSave}
        initialData={selectedActivity}
      />

      {/* Confirm Add/Edit Modal */}
      <ConfirmModal
        isOpen={isConfirmSaveOpen}
        onClose={() => setIsConfirmSaveOpen(false)}
        onConfirm={handleConfirmSave}
        title={editIndex !== null ? "Confirm Edit" : "Confirm Add"}
        message={
          editIndex !== null
            ? `Are you sure you want to update "${pendingActivity?.title}"?`
            : `Are you sure you want to add "${pendingActivity?.title}"?`
        }
        isProcessing={saving}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        message={`Are you sure you want to delete "${activityList[deleteIndex]?.title}"?`}
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
