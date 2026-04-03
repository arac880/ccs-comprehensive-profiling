import { useState, useEffect } from "react";
import tabStyles from "../../pages/studentPages/studentStyles/Tab.module.css";
import formStyles from "../../pages/facultyPages/facultyStyles/studentList.module.css";
import { FiUsers, FiActivity, FiPlus, FiTrash2 } from "react-icons/fi";
import AppModal from "../ui/Modal";
import AppButton from "../ui/AppButton";
import AddButton from "../../components/ui/AddButton";
import EditButton from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";

// ─── Constants ───────────────────────────────────────────────
const POS_BADGE = {
  Officer: `${tabStyles.badge} ${tabStyles.badgeOrange}`,
  "Academic Member": `${tabStyles.badge} ${tabStyles.badgeBlue}`,
  "Sports Member": `${tabStyles.badge} ${tabStyles.badgeGreen}`,
};

const RECORD_TYPES = ["Officer", "Academic Member", "Sports Member"];

const CCS_DEFAULT = {
  type: "org",
  org: "CCS",
  fullName: "College of Computing Studies Student",
  college: "College of Computing Studies",
  color: "#E65100",
  records: [],
  locked: true,
};

const CCS_ORGS = [
  {
    value: "SITES",
    org: "SITES",
    fullName: "Society of Information Technology Students",
    college: "College of Computing Studies",
    color: "#2563eb",
  },
  {
    value: "ACSS",
    org: "ACSS",
    fullName: "Association of Computer Science Students",
    college: "College of Computing Studies",
    color: "#E65100",
  },
  {
    value: "other",
    org: "",
    fullName: "",
    college: "",
    color: "#E65100",
  },
];
const ORG_COLORS = [
  "#E65100",
  "#2563eb",
  "#16a34a",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#be185d",
];

const EMPTY_ORG = {
  orgChoice: "",
  org: "",
  fullName: "",
  college: "",
  color: "#E65100",
  records: [{ schoolYear: "", type: "", position: "" }],
};

const EMPTY_SPORT = {
  name: "",
  team: "",
  years: "",
  achievements: [],
};

// ─── Org Modal ────────────────────────────────────────────────
function OrgModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_ORG);

  useEffect(() => {
    if (initialData) {
      const { index: _i, type: _t, ...rest } = initialData;

      // detect if it was a CCS org or custom
      const matched = CCS_ORGS.find(
        (o) => o.value !== "other" && o.org === rest.org,
      );

      setFormData({
        ...rest,
        orgChoice: matched ? matched.value : "other",
        records: rest.records?.length
          ? rest.records
          : [{ schoolYear: "", type: "", position: "" }],
      });
    } else {
      setFormData(EMPTY_ORG);
    }
  }, [initialData, isOpen]);

  const handleDeleteOrg = (item) => {
    if (item.locked) return;
    setList((prev) => prev.filter((a) => a !== item));
  };

  const handleOrgChoice = (value) => {
    if (value === "other") {
      setFormData((prev) => ({
        ...prev,
        orgChoice: "other",
        org: "",
        fullName: "",
        college: "",
        color: "#E65100",
      }));
    } else {
      const preset = CCS_ORGS.find((o) => o.value === value);
      setFormData((prev) => ({
        ...prev,
        orgChoice: value,
        org: preset.org,
        fullName: preset.fullName,
        college: preset.college,
        color: preset.color,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordChange = (index, field, value) => {
    const updated = formData.records.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    setFormData((prev) => ({ ...prev, records: updated }));
  };

  const addRecord = () => {
    setFormData((prev) => ({
      ...prev,
      records: [...prev.records, { schoolYear: "", type: "", position: "" }],
    }));
  };

  const removeRecord = (index) => {
    setFormData((prev) => ({
      ...prev,
      records: prev.records.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const { orgChoice: _oc, ...rest } = formData;
    onSave({ ...rest, type: "org" });
    onClose();
  };

  if (!isOpen) return null;

  const isCustom = formData.orgChoice === "other";

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Organization" : "Add Organization"}
      maxWidth="580px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          {/* Organization Selector */}
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Organization</label>
            <select
              value={formData.orgChoice}
              onChange={(e) => handleOrgChoice(e.target.value)}
            >
              <option value="">Select Organization</option>
              <option value="SITES">
                SITES — Society of Information Technology Students
              </option>
              <option value="ACSS">
                ACSS — Association of Computer Science Students
              </option>
              <option value="other">Other (Outside CCS)</option>
            </select>
          </div>

          {/* Custom org fields — only show when "Other" is selected */}
          {isCustom && (
            <>
              <div className={formStyles.formGroup}>
                <label>Abbreviation</label>
                <input
                  name="org"
                  value={formData.org}
                  onChange={handleChange}
                  placeholder="e.g. JPIA"
                />
              </div>

              <div className={formStyles.formGroup}>
                <label>Color</label>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    paddingTop: "6px",
                  }}
                >
                  {ORG_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: c }))
                      }
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: c,
                        border:
                          formData.color === c
                            ? "2.5px solid #111"
                            : "2px solid transparent",
                        cursor: "pointer",
                        padding: 0,
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                className={`${formStyles.formGroup} ${formStyles.fullWidth}`}
              >
                <label>Full Organization Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Junior Philippine Institute of Accountants"
                />
              </div>

              <div
                className={`${formStyles.formGroup} ${formStyles.fullWidth}`}
              >
                <label>College / Department</label>
                <input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. College of Business Administration"
                />
              </div>
            </>
          )}

          {/* Preview for CCS orgs */}
          {!isCustom && formData.orgChoice && (
            <div
              className={`${formStyles.formGroup} ${formStyles.fullWidth}`}
              style={{
                background: "#fdfaf7",
                border: "1px solid #e8ddd5",
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: formData.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {formData.org}
              </div>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}
                >
                  {formData.fullName}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {formData.college}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Records — only show after org is chosen */}
        {formData.orgChoice && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Membership Records
              </span>
              <button
                type="button"
                onClick={addRecord}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#e65100",
                  background: "#fff8f5",
                  border: "1px solid #fde8d8",
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                <FiPlus size={12} /> Add Record
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {formData.records.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 8,
                    alignItems: "end",
                    background: "#fdfaf7",
                    border: "1px solid #e8ddd5",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div className={formStyles.formGroup}>
                    <label>School Year</label>
                    <input
                      value={rec.schoolYear}
                      onChange={(e) =>
                        handleRecordChange(idx, "schoolYear", e.target.value)
                      }
                      placeholder="2023–2024"
                    />
                  </div>
                  <div className={formStyles.formGroup}>
                    <label>Type</label>
                    <select
                      value={rec.type}
                      onChange={(e) =>
                        handleRecordChange(idx, "type", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {RECORD_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className={formStyles.formGroup}>
                    <label>Position</label>
                    <input
                      value={rec.position}
                      onChange={(e) =>
                        handleRecordChange(idx, "position", e.target.value)
                      }
                      placeholder="e.g. President"
                    />
                  </div>
                  <DeleteButton
                    iconOnly
                    onClick={() => removeRecord(idx)}
                    disabled={formData.records.length === 1}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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

// ─── Sport Modal ──────────────────────────────────────────────
function SportModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_SPORT);
  const [achievementInput, setAchievementInput] = useState("");

  useEffect(() => {
    if (initialData) {
      const { index: _i, type: _t, ...rest } = initialData;
      setFormData({ ...rest, achievements: rest.achievements || [] });
    } else {
      setFormData(EMPTY_SPORT);
    }
    setAchievementInput("");
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addAchievement = () => {
    const val = achievementInput.trim();
    if (!val) return;
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, val],
    }));
    setAchievementInput("");
  };

  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSave({ ...formData, type: "sport" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Sport" : "Add Sport"}
      maxWidth="480px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Sport Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Basketball"
            />
          </div>

          <div className={formStyles.formGroup}>
            <label>Team</label>
            <input
              name="team"
              value={formData.team}
              onChange={handleChange}
              placeholder="e.g. CCS Varsity"
            />
          </div>

          <div className={formStyles.formGroup}>
            <label>Years Active</label>
            <input
              name="years"
              value={formData.years}
              onChange={handleChange}
              placeholder="e.g. 2022–2024"
            />
          </div>

          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Achievements</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                placeholder="Type and press Enter or Add"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={addAchievement}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#e65100",
                  background: "#fff8f5",
                  border: "1px solid #fde8d8",
                  borderRadius: 8,
                  padding: "0 14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <FiPlus size={12} /> Add
              </button>
            </div>

            {formData.achievements.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                {formData.achievements.map((a, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      color: "#d97706",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    🏆 {a}
                    <button
                      type="button"
                      onClick={() => removeAchievement(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#d97706",
                        padding: 0,
                        fontSize: 14,
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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

// ─── Sub-cards ────────────────────────────────────────────────
function OrgCard({ affil, onEdit, onDelete }) {
  return (
    <div className={tabStyles.orgCard}>
      <div className={tabStyles.orgHeader}>
        <div
          className={tabStyles.orgInitials}
          style={{ background: affil.color || "#E65100" }}
        >
          {affil.org}
        </div>
        <div style={{ flex: 1 }}>
          <div className={tabStyles.orgName}>{affil.fullName}</div>
          <div className={tabStyles.orgCollege}>{affil.college}</div>
        </div>
        <div
          style={{ display: "flex", gap: "0.4rem", alignSelf: "flex-start" }}
        >
          <EditButton iconOnly onClick={onEdit} />
          {!affil.locked && ( // ← only show delete if not locked
            <DeleteButton iconOnly onClick={onDelete} />
          )}
        </div>
      </div>

      <div className={tabStyles.orgRecords}>
        {affil.records.length === 0 && (
          <p
            className={tabStyles.emptyState}
            style={{ padding: "0.5rem 1.1rem" }}
          >
            No records yet.
          </p>
        )}
        {affil.records.map((rec, i) => (
          <div key={i} className={tabStyles.orgRecord}>
            <span className={tabStyles.recYear}>{rec.schoolYear}</span>
            <span
              className={
                POS_BADGE[rec.type] ||
                `${tabStyles.badge} ${tabStyles.badgeBlue}`
              }
            >
              {rec.type}
            </span>
            <span className={tabStyles.recPos}>{rec.position}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SportCard({ sport, onEdit, onDelete }) {
  return (
    <div className={tabStyles.card}>
      <div className={tabStyles.cardHeader}>
        <div className={tabStyles.cardTitle}>{sport.name}</div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <FiActivity size={14} color="#E65100" />
          <EditButton iconOnly onClick={onEdit} />
          <DeleteButton iconOnly onClick={onDelete} />
        </div>
      </div>
      <div className={tabStyles.cardMeta}>
        {sport.team} · {sport.years}
      </div>
      {sport.achievements?.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
            marginTop: "0.5rem",
          }}
        >
          {sport.achievements.map((a, i) => (
            <span
              key={i}
              className={`${tabStyles.badge} ${tabStyles.badgeAmber}`}
            >
              🏆 {a}
            </span>
          ))}
        </div>
      ) : (
        <div className={tabStyles.cardMeta} style={{ marginTop: "0.3rem" }}>
          No awards yet.
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function TabAffiliations({ affiliations = [] }) {
  const [list, setList] = useState(
    affiliations.length > 0 ? affiliations : [CCS_DEFAULT],
  );
  const [orgModal, setOrgModal] = useState({
    open: false,
    data: null,
    index: null,
  });
  const [sportModal, setSportModal] = useState({
    open: false,
    data: null,
    index: null,
  });

  const orgs = list.filter((a) => a.type === "org");
  const sports = list.filter((a) => a.type === "sport");

  const handleAddOrg = () =>
    setOrgModal({ open: true, data: null, index: null });
  const handleEditOrg = (item) =>
    setOrgModal({ open: true, data: item, index: list.indexOf(item) });
  const handleDeleteOrg = (item) =>
    setList((prev) => prev.filter((a) => a !== item));
  const handleSaveOrg = (data) => {
    if (orgModal.index !== null) {
      setList((prev) => prev.map((a, i) => (i === orgModal.index ? data : a)));
    } else {
      setList((prev) => [...prev, data]);
    }
  };

  const handleAddSport = () =>
    setSportModal({ open: true, data: null, index: null });
  const handleEditSport = (item) =>
    setSportModal({ open: true, data: item, index: list.indexOf(item) });
  const handleDeleteSport = (item) =>
    setList((prev) => prev.filter((a) => a !== item));
  const handleSaveSport = (data) => {
    if (sportModal.index !== null) {
      setList((prev) =>
        prev.map((a, i) => (i === sportModal.index ? data : a)),
      );
    } else {
      setList((prev) => [...prev, data]);
    }
  };

  return (
    <div>
      {/* ── Organizations ── */}
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <span className={tabStyles.sectionTitle}>
            <FiUsers size={14} style={{ marginRight: "0.3rem" }} />
            Organizations
          </span>
          <AddButton title="Add Organization" onClick={handleAddOrg} />
        </div>

        {orgs.length === 0 && (
          <p className={tabStyles.emptyState}>No organizations added yet.</p>
        )}
        {orgs.map((o, i) => (
          <OrgCard
            key={i}
            affil={o}
            onEdit={() => handleEditOrg(o)}
            onDelete={() => handleDeleteOrg(o)}
          />
        ))}
      </div>

      {/* ── Sports ── */}
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <span className={tabStyles.sectionTitle}>
            <FiActivity size={14} style={{ marginRight: "0.3rem" }} />
            Sports
          </span>
          <AddButton title="Add Sport" onClick={handleAddSport} />
        </div>

        {sports.length === 0 && (
          <p className={tabStyles.emptyState}>No sports added yet.</p>
        )}
        <div className={tabStyles.cardGrid}>
          {sports.map((s, i) => (
            <SportCard
              key={i}
              sport={s}
              onEdit={() => handleEditSport(s)}
              onDelete={() => handleDeleteSport(s)}
            />
          ))}
        </div>
      </div>

      <OrgModal
        isOpen={orgModal.open}
        onClose={() => setOrgModal({ open: false, data: null, index: null })}
        onSave={handleSaveOrg}
        initialData={orgModal.data}
      />

      <SportModal
        isOpen={sportModal.open}
        onClose={() => setSportModal({ open: false, data: null, index: null })}
        onSave={handleSaveSport}
        initialData={sportModal.data}
      />
    </div>
  );
}
