import { useState, useEffect } from "react";
import SearchBar from "../../components/ui/SearchBar";
import ResearchCard from "../../components/studentComponents/ResearchCard";
import styles from "./studentStyles/collegeResearch.module.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { PiBookOpenTextFill } from "react-icons/pi";
import { BsGraphUp } from "react-icons/bs";
import { MdOutlineInfo } from "react-icons/md";

const ALL_RESEARCH = [
  {
    id: 1,
    title: "Web-Based Delivery Tracking System",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Comprehensive Student Profiling System",
    uploadedAt: "March 5, 2026, 10:15 AM",
    fileUrl: "#",
  },
  {
    id: 3,
    title: "AI-Powered Grade Prediction Model",
    uploadedAt: "April 1, 2026, 1:20 PM",
    fileUrl: "#",
  },
];

// Most recently uploaded (last in array by date)
const LATEST = ALL_RESEARCH[ALL_RESEARCH.length - 1];

export default function CollegeResearch() {
  const [search, setSearch] = useState("");

  const filtered = ALL_RESEARCH.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.pageWrapper}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}>
            <PiBookOpenTextFill size={20} color="#ffffff" />
          </div>
          <h2 className={styles.pageTitle}>College Research</h2>
        </div>
        <span className={styles.headerNote}>
          <PiBookOpenTextFill size={13} />
          {ALL_RESEARCH.length} papers published
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className={styles.contentGrid}>

        {/* ── Left: main repository ── */}
        <div className={styles.repositoryWidget}>

          {/* Toolbar */}
          <div className={styles.widgetToolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.toolbarIcon}>
                <PiBookOpenTextFill size={15} />
              </span>
              <span className={styles.widgetTitle}>Research Repository</span>
              <span className={styles.countBadge}>{filtered.length} Documents</span>
            </div>
            <div className={styles.toolbarRight}>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search a research title..."
              />
            </div>
          </div>

          {/* List */}
          <div className={styles.documentList}>
            {filtered.length > 0 ? (
              filtered.map((r, i) => (
                <ResearchCard
                  key={r.id}
                  index={i + 1}
                  title={r.title}
                  uploadedAt={r.uploadedAt}
                  fileUrl={r.fileUrl}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrap}>
                  <FaSearch size={24} />
                </div>
                <p className={styles.emptyText}>No matching research found.</p>
                <p className={styles.emptyHint}>Try a different keyword.</p>
              </div>
            )}
          </div>

        </div>

        {/* ── Right: stats + info ── */}
        <aside className={styles.rightCol}>

          {/* Stats card */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHeader}>
              <span className={styles.sideCardIcon}>
                <BsGraphUp size={14} />
              </span>
              <span className={styles.sideCardTitle}>Repository Stats</span>
            </div>
            <div className={styles.sideCardBody}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Total Papers</span>
                <span className={styles.statValue}>{ALL_RESEARCH.length}</span>
              </div>
              <hr className={styles.statDivider} />
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Showing</span>
                <span className={styles.statValue}>{filtered.length}</span>
              </div>
              <hr className={styles.statDivider} />
              {/* Latest upload highlight */}
              <div className={styles.latestWrap}>
                <span className={styles.latestLabel}>Latest Upload</span>
                <span className={styles.latestTitle}>{LATEST.title}</span>
                <span className={styles.latestDate}>
                  <FaCalendarAlt size={10} style={{ marginRight: 4 }} />
                  {LATEST.uploadedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Info tip card */}
          <div className={styles.tipCard}>
            <strong>How to use:</strong> Click any research paper to open and read the full PDF document in a new tab.
          </div>

        </aside>
      </div>

    </main>
  );
}