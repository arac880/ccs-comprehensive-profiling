import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import EditButton from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";
import ConfirmModal from "../../components/ui/ConfirmModal";
import AppToast from "../../components/ui/AppToast";
import { FiAward, FiCalendar, FiTag } from "react-icons/fi";

const CAT_COLOR = {
  Competition: `${tabStyles.badge} ${tabStyles.badgeOrange}`,
  Event: `${tabStyles.badge} ${tabStyles.badgeBlue}`,
  Seminar: `${tabStyles.badge} ${tabStyles.badgeGreen}`,
  Workshop: `${tabStyles.badge} ${tabStyles.badgeAmber}`,
};

const EMPTY_FORM = { title: "", category: "", date: "", description: "" };

/* ── Activity Modal ─────────────────────────────────────────── */
function ActivityModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _i, year: _y, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
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

  return createPortal(
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
    </AppModal>,
    document.body,
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function TabNonAcademic() {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingActivity, setPendingActivity] = useState(null);
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
        console.error(err);
        setActivityList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const saveActivitiesToDB = async (updated) => {
    if (!id) return false;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities: updated }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, activities: updated }),
      );
      return true;
    } catch (err) {
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
  const handleSave = (data) => {
    setPendingActivity(data);
    setIsConfirmSaveOpen(true);
  };

  const handleConfirmSave = async () => {
    const updated =
      editIndex !== null
        ? activityList.map((a, i) => (i === editIndex ? pendingActivity : a))
        : [...activityList, pendingActivity];
    const ok = await saveActivitiesToDB(updated);
    if (ok) {
      setActivityList(updated);
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

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    const updated = activityList.filter((_, i) => i !== deleteIndex);
    const ok = await saveActivitiesToDB(updated);
    if (ok) {
      setActivityList(updated);
      setIsConfirmDeleteOpen(false);
      setDeleteIndex(null);
      setToast({
        isVisible: true,
        message: "Activity deleted successfully.",
        type: "success",
      });
    }
  };

  if (loading)
    return (
      <div className={tabStyles.section}>
        <div className={tabStyles.loadingState}>Loading activities…</div>
      </div>
    );

  return (
    <div className={tabStyles.tabWrapper}>
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiAward size={13} />
            Activities &amp; Recognitions
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
          <p className={tabStyles.empty}>No activities recorded yet.</p>
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
                    <FiTag size={9} style={{ marginRight: 3 }} />
                    {act.category}
                  </span>
                  <span className={tabStyles.cardMetaYear}>{act.year}</span>
                </div>

                {act.description && (
                  <p className={tabStyles.cardDesc}>{act.description}</p>
                )}

                {act.date && (
                  <div className={tabStyles.cardFooter}>
                    <span className={tabStyles.cardDate}>
                      <FiCalendar
                        size={10}
                        style={{ marginRight: 4, verticalAlign: "middle" }}
                      />
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

      {isConfirmSaveOpen &&
        createPortal(
          <ConfirmModal
            isOpen={isConfirmSaveOpen}
            onClose={() => setIsConfirmSaveOpen(false)}
            onConfirm={handleConfirmSave}
            title={editIndex !== null ? "Confirm Edit" : "Confirm Add"}
            message={
              editIndex !== null
                ? `Update "${pendingActivity?.title}"?`
                : `Add "${pendingActivity?.title}"?`
            }
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
            title="Delete Activity"
            message={`Delete "${activityList[deleteIndex]?.title}"?`}
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
