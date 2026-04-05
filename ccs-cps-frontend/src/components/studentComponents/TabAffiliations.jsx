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
import { FiUsers, FiShield, FiLock } from "react-icons/fi";

/* ── Constants ───────────────────────────────────────────────── */
const MEMBER_TYPES = [
  "President",
  "VP",
  "Secretary",
  "Treasurer",
  "Member",
  "Other",
];
const SPORT_TYPES = [
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Swimming",
  "Athletics",
  "Football",
  "Other",
];
const SPORT_ROLES = [
  "Player",
  "Captain",
  "Co-Captain",
  "Coach",
  "Manager",
  "Other",
];

const LEVEL_BADGE = {
  Intramural: tabStyles.badgeAmber,
  Intercollege: tabStyles.badgeBlue,
  Regional: tabStyles.badgeGreen,
  National: tabStyles.badgePurple,
};

const ROLE_EMOJI = {
  President: "",
  VP: "",
  Secretary: "",
  Treasurer: "",
  Captain: "",
  Coach: "",
  Manager: "",
  Member: "",
};

const SPORT_EMOJI = {
  Basketball: "",
  Volleyball: "",
  Badminton: "",
  "Table Tennis": "",
  Chess: "♟️",
  Swimming: "",
  Athletics: "",
  Football: "",
};

const getAutoOrg = (program = "") => {
  const p = program.toLowerCase();
  if (p.includes("information technology"))
    return "SITES - Society of Information Technology Students";
  if (p.includes("computer science"))
    return "ACCS - Association of Computer Science Students";
  return null;
};

const EMPTY_ORG_FORM = {
  organization: "",
  memberType: "",
  customMemberType: "",
};
const EMPTY_SPORT_FORM = {
  sport: "",
  customSport: "",
  role: "",
  customRole: "",
  level: "",
};

/* ── Org Modal ──────────────────────────────────────────────── */
function OrgModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_ORG_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _i, yearAdded: _y, ...rest } = initialData;
      const isCustom =
        rest.memberType && !MEMBER_TYPES.includes(rest.memberType);
      setFormData({
        organization: rest.organization || "",
        memberType: isCustom ? "Other" : rest.memberType || "",
        customMemberType: isCustom ? rest.memberType : "",
      });
    } else {
      setFormData(EMPTY_ORG_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.organization.trim()) {
      alert("Please enter an organization name.");
      return;
    }
    if (!formData.memberType) {
      alert("Please select a member type.");
      return;
    }
    if (formData.memberType === "Other" && !formData.customMemberType.trim()) {
      alert("Please specify the member type.");
      return;
    }
    const finalType =
      formData.memberType === "Other"
        ? formData.customMemberType.trim()
        : formData.memberType;
    onSave({
      organization: formData.organization.trim(),
      memberType: finalType,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Organization" : "Add Organization"}
      maxWidth="500px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Organization Name</label>
            <input
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. Math Club, Red Cross, Rotaract"
              disabled={!!initialData}
            />
          </div>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Member Type</label>
            <select
              name="memberType"
              value={formData.memberType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {MEMBER_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          {formData.memberType === "Other" && (
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>Specify Member Type</label>
              <input
                name="customMemberType"
                value={formData.customMemberType}
                onChange={handleChange}
                placeholder="e.g. Adviser, Volunteer"
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
          {initialData ? "Save Changes" : "Add Organization"}
        </AppButton>
      </div>
    </AppModal>,
    document.body,
  );
}

/* ── Sport Modal ────────────────────────────────────────────── */
function SportModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_SPORT_FORM);

  useEffect(() => {
    if (initialData) {
      const { index: _i, yearAdded: _y, ...rest } = initialData;
      const isCustomSport = rest.sport && !SPORT_TYPES.includes(rest.sport);
      const isCustomRole = rest.role && !SPORT_ROLES.includes(rest.role);
      setFormData({
        sport: isCustomSport ? "Other" : rest.sport || "",
        customSport: isCustomSport ? rest.sport : "",
        role: isCustomRole ? "Other" : rest.role || "",
        customRole: isCustomRole ? rest.role : "",
        level: rest.level || "",
      });
    } else {
      setFormData(EMPTY_SPORT_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.sport) {
      alert("Please select a sport.");
      return;
    }
    if (formData.sport === "Other" && !formData.customSport.trim()) {
      alert("Please specify the sport.");
      return;
    }
    if (!formData.role) {
      alert("Please select a role.");
      return;
    }
    if (formData.role === "Other" && !formData.customRole.trim()) {
      alert("Please specify the role.");
      return;
    }
    const finalSport =
      formData.sport === "Other" ? formData.customSport.trim() : formData.sport;
    const finalRole =
      formData.role === "Other" ? formData.customRole.trim() : formData.role;
    onSave({ sport: finalSport, role: finalRole, level: formData.level });
  };

  if (!isOpen) return null;

  return createPortal(
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Sport" : "Add Sport"}
      maxWidth="500px"
    >
      <div className={formStyles.modalBody}>
        <div className={formStyles.formGrid}>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Sport</label>
            <select name="sport" value={formData.sport} onChange={handleChange}>
              <option value="">Select</option>
              {SPORT_TYPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {formData.sport === "Other" && (
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>Specify Sport</label>
              <input
                name="customSport"
                value={formData.customSport}
                onChange={handleChange}
                placeholder="e.g. Arnis, Sepak Takraw"
              />
            </div>
          )}
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select</option>
              {SPORT_ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          {formData.role === "Other" && (
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>Specify Role</label>
              <input
                name="customRole"
                value={formData.customRole}
                onChange={handleChange}
                placeholder="e.g. Statistician, Assistant Coach"
              />
            </div>
          )}
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label>Level</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="">Select</option>
              <option>Intramural</option>
              <option>Intercollege</option>
              <option>Regional</option>
              <option>National</option>
            </select>
          </div>
        </div>
      </div>
      <div className={formStyles.modalFooter}>
        <AppButton variant="secondary" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton variant="primary" onClick={handleSubmit}>
          {initialData ? "Save Changes" : "Add Sport"}
        </AppButton>
      </div>
    </AppModal>,
    document.body,
  );
}

/* ── Org Card ───────────────────────────────────────────────── */
function OrgCard({ org, isDefault = false, onEdit, onDelete }) {
  const roleEmoji = ROLE_EMOJI[org.memberType] || "";
  const initials = org.organization
    .split(/[\s\-–]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`${tabStyles.orgCard} ${isDefault ? tabStyles.orgCardDefault : ""}`}
    >
      <div className={tabStyles.orgCardAccent} />

      <div className={tabStyles.orgAvatarWrap}>
        <div className={tabStyles.orgAvatar}>{initials || ""}</div>
        {isDefault && (
          <span className={tabStyles.orgLockBadge} title="Default organization">
            <FiLock size={9} />
          </span>
        )}
      </div>

      <div className={tabStyles.orgCardBody}>
        <p className={tabStyles.orgName}>{org.organization}</p>
        <div className={tabStyles.orgMeta}>
          <span className={tabStyles.orgRoleChip}>
            <span className={tabStyles.orgRoleEmoji}>{roleEmoji}</span>
            {org.memberType}
          </span>
        </div>
      </div>

      <div className={tabStyles.orgCardFooter}>
        <span className={tabStyles.orgSince}>Since {org.yearAdded}</span>
        {!isDefault && (
          <div className={tabStyles.orgActions}>
            <DeleteButton iconOnly onClick={onDelete} />
            <EditButton iconOnly onClick={onEdit} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sport Card ─────────────────────────────────────────────── */
function SportCard({ sport, onEdit, onDelete }) {
  return (
    <div className={tabStyles.sportCard}>
      <div className={tabStyles.sportCardBody}>
        <p className={tabStyles.sportName}>{sport.sport}</p>
        <div className={tabStyles.sportBadges}>
          <span className={`${tabStyles.badge} ${tabStyles.badgeOrange}`}>
            {sport.role}
          </span>
          {sport.level && (
            <span
              className={`${tabStyles.badge} ${LEVEL_BADGE[sport.level] ?? tabStyles.badgeBlue}`}
            >
              {sport.level}
            </span>
          )}
        </div>
      </div>

      <div className={tabStyles.sportCardFooter}>
        <span className={tabStyles.sportSince}>Since {sport.yearAdded}</span>
        <div className={tabStyles.sportActions}>
          <DeleteButton iconOnly onClick={onDelete} />
          <EditButton iconOnly onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function TabOrganization() {
  const [orgList, setOrgList] = useState([]);
  const [sportList, setSportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgEditIndex, setOrgEditIndex] = useState(null);
  const [isConfirmOrgSave, setIsConfirmOrgSave] = useState(false);
  const [pendingOrg, setPendingOrg] = useState(null);
  const [isConfirmOrgDel, setIsConfirmOrgDel] = useState(false);
  const [orgDelIndex, setOrgDelIndex] = useState(null);

  const [isSportModalOpen, setIsSportModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [sportEditIndex, setSportEditIndex] = useState(null);
  const [isConfirmSportSave, setIsConfirmSportSave] = useState(false);
  const [pendingSport, setPendingSport] = useState(null);
  const [isConfirmSportDel, setIsConfirmSportDel] = useState(false);
  const [sportDelIndex, setSportDelIndex] = useState(null);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;
  const autoOrg = getAutoOrg(user?.program);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setOrgList(data.organizations || []);
        setSportList(data.sports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveToDB = async (payload) => {
    if (!id) return false;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      localStorage.setItem("user", JSON.stringify({ ...user, ...payload }));
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

  const handleOrgSave = (data) => {
    const yearAdded =
      orgEditIndex !== null
        ? orgList[orgEditIndex].yearAdded
        : new Date().getFullYear().toString();
    setPendingOrg({ ...data, yearAdded });
    setIsConfirmOrgSave(true);
  };
  const handleConfirmOrgSave = async () => {
    const updated =
      orgEditIndex !== null
        ? orgList.map((o, i) => (i === orgEditIndex ? pendingOrg : o))
        : [...orgList, pendingOrg];
    const ok = await saveToDB({ organizations: updated });
    if (ok) {
      setOrgList(updated);
      setIsConfirmOrgSave(false);
      setIsOrgModalOpen(false);
      setPendingOrg(null);
      setOrgEditIndex(null);
      setSelectedOrg(null);
      setToast({
        isVisible: true,
        message:
          orgEditIndex !== null
            ? "Organization updated."
            : "Organization added.",
        type: "success",
      });
    }
  };
  const handleConfirmOrgDelete = async () => {
    const updated = orgList.filter((_, i) => i !== orgDelIndex);
    const ok = await saveToDB({ organizations: updated });
    if (ok) {
      setOrgList(updated);
      setIsConfirmOrgDel(false);
      setOrgDelIndex(null);
      setToast({
        isVisible: true,
        message: "Organization removed.",
        type: "success",
      });
    }
  };

  const handleSportSave = (data) => {
    const yearAdded =
      sportEditIndex !== null
        ? sportList[sportEditIndex].yearAdded
        : new Date().getFullYear().toString();
    setPendingSport({ ...data, yearAdded });
    setIsConfirmSportSave(true);
  };
  const handleConfirmSportSave = async () => {
    const updated =
      sportEditIndex !== null
        ? sportList.map((s, i) => (i === sportEditIndex ? pendingSport : s))
        : [...sportList, pendingSport];
    const ok = await saveToDB({ sports: updated });
    if (ok) {
      setSportList(updated);
      setIsConfirmSportSave(false);
      setIsSportModalOpen(false);
      setPendingSport(null);
      setSportEditIndex(null);
      setSelectedSport(null);
      setToast({
        isVisible: true,
        message: sportEditIndex !== null ? "Sport updated." : "Sport added.",
        type: "success",
      });
    }
  };
  const handleConfirmSportDelete = async () => {
    const updated = sportList.filter((_, i) => i !== sportDelIndex);
    const ok = await saveToDB({ sports: updated });
    if (ok) {
      setSportList(updated);
      setIsConfirmSportDel(false);
      setSportDelIndex(null);
      setToast({ isVisible: true, message: "Sport removed.", type: "success" });
    }
  };

  const defaultOrgs = [
    {
      organization: "CCS - College of Computing Studies",
      memberType: "Member",
      yearAdded: new Date().getFullYear().toString(),
    },
    ...(autoOrg
      ? [
          {
            organization: autoOrg,
            memberType: "Member",
            yearAdded: new Date().getFullYear().toString(),
          },
        ]
      : []),
  ];

  if (loading)
    return (
      <div className={tabStyles.section}>
        <div className={tabStyles.loadingState}>Loading…</div>
      </div>
    );

  return (
    <div className={tabStyles.tabWrapper}>
      {/* ── Organizations ── */}
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiUsers size={13} /> Organizations
          </div>
          <div className={tabStyles.headerActions}>
            <AddButton
              title="Add Organization"
              onClick={() => {
                setSelectedOrg(null);
                setOrgEditIndex(null);
                setIsOrgModalOpen(true);
              }}
              disabled={saving}
            />
          </div>
        </div>

        <div className={tabStyles.orgGrid}>
          {defaultOrgs.map((org, idx) => (
            <OrgCard key={`def-${idx}`} org={org} isDefault />
          ))}
          {orgList.map((org, idx) => (
            <OrgCard
              key={`org-${idx}`}
              org={org}
              onDelete={() => {
                setOrgDelIndex(idx);
                setIsConfirmOrgDel(true);
              }}
              onEdit={() => {
                setSelectedOrg({ ...org, index: idx });
                setOrgEditIndex(idx);
                setIsOrgModalOpen(true);
              }}
            />
          ))}
          {orgList.length === 0 && (
            <p className={tabStyles.empty} style={{ gridColumn: "1 / -1" }}>
              No additional organizations recorded.
            </p>
          )}
        </div>
      </div>

      {/* ── Sports ── */}
      <div className={tabStyles.section}>
        <div className={tabStyles.sectionHeader}>
          <div className={tabStyles.sectionTitle}>
            <FiShield size={13} /> Sports
          </div>
          <div className={tabStyles.headerActions}>
            <AddButton
              title="Add Sport"
              onClick={() => {
                setSelectedSport(null);
                setSportEditIndex(null);
                setIsSportModalOpen(true);
              }}
              disabled={saving}
            />
          </div>
        </div>

        {sportList.length === 0 ? (
          <p className={tabStyles.empty}>No sports recorded yet.</p>
        ) : (
          <div className={tabStyles.sportGrid}>
            {sportList.map((sp, idx) => (
              <SportCard
                key={`sp-${idx}`}
                sport={sp}
                onDelete={() => {
                  setSportDelIndex(idx);
                  setIsConfirmSportDel(true);
                }}
                onEdit={() => {
                  setSelectedSport({ ...sp, index: idx });
                  setSportEditIndex(idx);
                  setIsSportModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Portaled Modals ── */}
      <OrgModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        onSave={handleOrgSave}
        initialData={selectedOrg}
      />
      <SportModal
        isOpen={isSportModalOpen}
        onClose={() => setIsSportModalOpen(false)}
        onSave={handleSportSave}
        initialData={selectedSport}
      />

      {isConfirmOrgSave &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmOrgSave(false)}
            onConfirm={handleConfirmOrgSave}
            title={orgEditIndex !== null ? "Confirm Edit" : "Confirm Add"}
            message={
              orgEditIndex !== null
                ? `Update "${pendingOrg?.organization}"?`
                : `Add "${pendingOrg?.organization}"?`
            }
            isProcessing={saving}
          />,
          document.body,
        )}
      {isConfirmOrgDel &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmOrgDel(false)}
            onConfirm={handleConfirmOrgDelete}
            title="Remove Organization"
            message={`Remove "${orgList[orgDelIndex]?.organization}"?`}
            isProcessing={saving}
          />,
          document.body,
        )}
      {isConfirmSportSave &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmSportSave(false)}
            onConfirm={handleConfirmSportSave}
            title={sportEditIndex !== null ? "Confirm Edit" : "Confirm Add"}
            message={
              sportEditIndex !== null
                ? `Update "${pendingSport?.sport}"?`
                : `Add "${pendingSport?.sport}"?`
            }
            isProcessing={saving}
          />,
          document.body,
        )}
      {isConfirmSportDel &&
        createPortal(
          <ConfirmModal
            isOpen
            onClose={() => setIsConfirmSportDel(false)}
            onConfirm={handleConfirmSportDelete}
            title="Remove Sport"
            message={`Remove "${sportList[sportDelIndex]?.sport}"?`}
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
