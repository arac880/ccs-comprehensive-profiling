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
import FilterDropdown from "../../components/ui/FilterDropdown";
import { FiAward, FiCalendar, FiTag } from "react-icons/fi";

/* ── Category badge map ─────────────────────────────────────── */
const CAT_BADGE = {
  Competition: `${tabStyles.badge} ${tabStyles.badgeOrange}`,
  Event: `${tabStyles.badge} ${tabStyles.badgeBlue}`,
  Seminar: `${tabStyles.badge} ${tabStyles.badgeGreen}`,
  Workshop: `${tabStyles.badge} ${tabStyles.badgeAmber}`,
};

const CATEGORIES = ["All", "Competition", "Event", "Seminar", "Workshop"];

const EMPTY_FORM = { title: "", category: "", date: "", description: "" };

/* ── Helpers ─────────────────────────────────────────────────── */
function parseDateParts(dateStr) {
  if (!dateStr) return { month: "—", day: "—" };
  const d = new Date(dateStr);
  if (isNaN(d)) return { month: "—", day: "—" };
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Activity Row ────────────────────────────────────────────── */
function ActivityRow({ act, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const { month, day } = parseDateParts(act.date);
  const desc = act.description || "";
  const isLong = desc.length > 220 || desc.split("\n").length > 3;

  return (
    <div className={tabStyles.naActivityItem}>
      {/* Date block */}
      <div className={tabStyles.naDateBlock}>
        <span className={tabStyles.naDateMonth}>{month}</span>
        <span className={tabStyles.naDateDay}>{day}</span>
      </div>

      {/* Content */}
      <div className={tabStyles.naActivityContent}>
        {/* Title + actions */}
        <div className={tabStyles.naActivityHeader}>
          <h3 className={tabStyles.naActivityTitle}>{act.title}</h3>
          <div className={tabStyles.naActivityActions}>
            <DeleteButton iconOnly onClick={onDelete} />
            <EditButton iconOnly onClick={onEdit} />
          </div>
        </div>

        {/* Badge + year */}
        <div className={tabStyles.naActivityMeta}>
          <span
            className={
              CAT_BADGE[act.category] ||
              `${tabStyles.badge} ${tabStyles.badgeBlue}`
            }
          >
            <FiTag size={9} style={{ marginRight: 3 }} />
            {act.category}
          </span>
          {act.year && (
            <>
              <span className={tabStyles.naMetaDot} />
              <span className={tabStyles.naMetaYear}>{act.year}</span>
            </>
          )}
        </div>

        {/* Description */}
        {desc && (
          <p
            className={`${tabStyles.naActivityBody} ${
              isLong && !expanded ? tabStyles.naActivityBodyCollapsed : ""
            }`}
          >
            {desc}
          </p>
        )}

        {isLong && (
          <button
            className={tabStyles.naReadMoreBtn}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}

        {/* Date footer */}
        {act.date && (
          <div className={tabStyles.naActivityFooter}>
            <span className={tabStyles.naActivityDate}>
              <FiCalendar size={11} />
              {formatFullDate(act.date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [filter, setFilter] = useState("All");
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

  /* ── Count totals by category ───────────────────────────── */
  const countByCategory = activityList.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;

  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setActivityList(data.activities || []);
      } catch (err) {
        console.error(err);
        setActivityList([]);
        setToast({
          isVisible: true,
          message: `Error: ${err.message}`,
          type: "error",
        });
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activities: updated }),
        },
      );
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, activities: updated }),
      );
      return true;
    } catch (err) {
      console.error(err);
      setActivityList([]);
      setToast({
        isVisible: true,
        message: `Error: ${err.message}`,
        type: "error",
      });
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

  /* Filtered list */
  const filtered =
    filter === "All"
      ? activityList
      : activityList.filter((a) => a.category === filter);

  if (loading)
    return (
      <div className={tabStyles.section}>
        <div className={tabStyles.loadingState}>Loading activities…</div>
      </div>
    );

  return (
    <div className={tabStyles.tabWrapper}>
      <div className={tabStyles.section}>
        {/* Section header */}
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiAward size={15} />
            <span>Activities & Recognitions</span>
          </div>
          <div className={tabStyles.headerActions}>
            <FilterDropdown
              value={filter}
              onChange={setFilter}
              options={CATEGORIES}
              label="FILTER"
              placeholder="All"
            />
            <AddButton
              title="Add Activity"
              onClick={handleAdd}
              disabled={saving}
            />
          </div>
        </div>

        {/* Count strip */}
        {activityList.length > 0 && (
          <div className={tabStyles.naCountStrip}>
            <div className={tabStyles.naCountTotal}>
              <span className={tabStyles.naCountPill}>
                {activityList.length} Total
              </span>
            </div>
            <div className={tabStyles.naCountCategories}>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <span
                  key={cat}
                  className={`${tabStyles.naCountPill} ${
                    filter === cat ? tabStyles.naCountPillActive : ""
                  }`}
                >
                  {countByCategory[cat] || 0} {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timeline list */}
        {filtered.length === 0 ? (
          <p className={tabStyles.empty}>
            {activityList.length === 0
              ? "No activities recorded yet."
              : `No ${filter.toLowerCase()} activities found.`}
          </p>
        ) : (
          <div className={tabStyles.naTimelineList}>
            {filtered.map((act) => {
              const realIdx = activityList.indexOf(act);
              return (
                <ActivityRow
                  key={realIdx}
                  act={act}
                  onEdit={() => handleEdit(act, realIdx)}
                  onDelete={() => handleDeleteClick(realIdx)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
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
