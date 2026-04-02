// components/studentComponents/TabAffiliations.jsx
import styles from "../../pages/studentPages/studentStyles/Tab.module.css";
import { FiUsers, FiActivity } from "react-icons/fi";
import AddButton    from "../../components/ui/AddButton";
import EditButton   from "../../components/ui/EditButton";
import DeleteButton from "../../components/ui/DeleteButton";

const POS_BADGE = {
  "Officer":         `${styles.badge} ${styles.badgeOrange}`,
  "Academic Member": `${styles.badge} ${styles.badgeBlue}`,
  "Sports Member":   `${styles.badge} ${styles.badgeGreen}`,
};

function OrgCard({ affil, onEdit, onDelete }) {
  return (
    <div className={styles.orgCard}>
      <div className={styles.orgHeader}>
        <div
          className={styles.orgInitials}
          style={{ background: affil.color || "#E65100" }}
        >
          {affil.org}
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.orgName}>{affil.fullName}</div>
          <div className={styles.orgCollege}>{affil.college}</div>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignSelf: "flex-start" }}>
          <EditButton iconOnly onClick={onEdit} />
          <DeleteButton iconOnly onClick={onDelete} />
        </div>
      </div>

      <div className={styles.orgRecords}>
        {affil.records.map((rec, i) => (
          <div key={i} className={styles.orgRecord}>
            <span className={styles.recYear}>{rec.schoolYear}</span>
            <span className={POS_BADGE[rec.type] || `${styles.badge} ${styles.badgeBlue}`}>
              {rec.type}
            </span>
            <span className={styles.recPos}>{rec.position}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SportCard({ sport, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{sport.name}</div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <FiActivity size={14} color="#E65100" />
          <EditButton iconOnly onClick={onEdit} />
          <DeleteButton iconOnly onClick={onDelete} />
        </div>
      </div>
      <div className={styles.cardMeta}>{sport.team} · {sport.years}</div>
      {sport.achievements && sport.achievements.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
          {sport.achievements.map((a, i) => (
            <span key={i} className={`${styles.badge} ${styles.badgeAmber}`}>🏆 {a}</span>
          ))}
        </div>
      ) : (
        <div className={styles.cardMeta} style={{ marginTop: "0.3rem" }}>No awards yet.</div>
      )}
    </div>
  );
}

export default function TabAffiliations({ affiliations, onAdd, onEdit, onDelete }) {
  const orgs   = affiliations.filter((a) => a.type === "org");
  const sports = affiliations.filter((a) => a.type === "sport");

  return (
    <div>
      {/* ── Organizations ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FiUsers size={14} style={{ marginRight: "0.3rem" }} />
            Organizations
          </span>
          <AddButton title="Add Organization" onClick={() => onAdd?.("org")} />
        </div>

        {orgs.length === 0 && (
          <p className={styles.emptyState}>No organizations added yet.</p>
        )}
        {orgs.map((o, i) => (
          <OrgCard
            key={i}
            affil={o}
            onEdit={() => onEdit?.(o)}
            onDelete={() => onDelete?.(o)}
          />
        ))}
      </div>

      {/* ── Sports ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            <FiActivity size={14} style={{ marginRight: "0.3rem" }} />
            Sports
          </span>
          <AddButton title="Add Sport" onClick={() => onAdd?.("sport")} />
        </div>

        {sports.length === 0 && (
          <p className={styles.emptyState}>No sports added yet.</p>
        )}
        <div className={styles.cardGrid}>
          {sports.map((s, i) => (
            <SportCard
              key={i}
              sport={s}
              onEdit={() => onEdit?.(s)}
              onDelete={() => onDelete?.(s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}