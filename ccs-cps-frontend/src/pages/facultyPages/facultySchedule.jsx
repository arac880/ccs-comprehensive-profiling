import React, { useState } from "react";
import styles from "../../pages/facultyPages/facultyStyles/schedule.module.css";
import {
  FaBook,
  FaChalkboardUser,
  FaLaptopCode,
  FaClock,
  FaLocationDot,
  FaUserGroup,
  FaClipboardList,
} from "react-icons/fa6";

const TIMES = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

const CLASSES = [
  {
    day: 0,
    start: 1,
    span: 2,
    title: "Data Structures",
    sub: "BSCS 3A",
    room: "RM-201",
    color: "blockRed",
    type: "Lecture",
  },
  {
    day: 1,
    start: 3,
    span: 2,
    title: "OOP",
    sub: "BSCS 2B",
    room: "RM-203",
    color: "blockBlue",
    type: "Seminar",
  },
  {
    day: 2,
    start: 1,
    span: 2,
    title: "Data Structures",
    sub: "BSCS 3A",
    room: "RM-201",
    color: "blockRed",
    type: "Lecture",
  },
  {
    day: 2,
    start: 4,
    span: 2,
    title: "Web Development",
    sub: "BSIT 2B",
    room: "LAB-1",
    color: "blockAmber",
    type: "Applied",
  },
  {
    day: 3,
    start: 3,
    span: 2,
    title: "OOP",
    sub: "BSCS 2B",
    room: "RM-203",
    color: "blockBlue",
    type: "Seminar",
  },
  {
    day: 3,
    start: 6,
    span: 2,
    title: "Capstone Project",
    sub: "BSIT 4A",
    room: "RM-301",
    color: "blockRed",
    type: "Lecture",
  },
  {
    day: 4,
    start: 2,
    span: 1,
    title: "Intro to Prog.",
    sub: "BSCS 1C",
    room: "RM-105",
    color: "blockAmber",
    type: "Applied",
  },
  {
    day: 4,
    start: 12,
    span: 1,
    title: "Thesis Writing",
    sub: "BSIT 4A",
    room: "RM-301",
    color: "blockAmber",
    type: "Applied",
  },
];

const DAYS = [
  { short: "MON", full: "Monday" },
  { short: "TUE", full: "Tuesday" },
  { short: "WED", full: "Wednesday" },
  { short: "THU", full: "Thursday" },
  { short: "FRI", full: "Friday" },
];

const LEGEND = [
  { label: "Lecture", color: "#c0390a" },
  { label: "Seminar", color: "#185fa5" },
  { label: "Lab / IT", color: "#2d7a3c" },
];

const TYPE_META = {
  Lecture: { icon: <FaBook size={18} />, bg: "#fde8e8", color: "#c0390a" },
  Seminar: {
    icon: <FaChalkboardUser size={18} />,
    bg: "#e6f1fb",
    color: "#185fa5",
  },
  Applied: {
    icon: <FaLaptopCode size={18} />,
    bg: "#fff0e0",
    color: "#e65100",
  },
};

const classesPerDay = DAYS.map(
  (_, i) => CLASSES.filter((c) => c.day === i).length,
);

const FacultySchedule = () => {
  const [selected, setSelected] = useState(null);

  const totalClasses = CLASSES.length;

  const closeModal = () => setSelected(null);

  return (
    <div className={styles.pageContent}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <i className="bi bi-calendar3" />
          </div>
          <div className={styles.headingWrap}>
            <h2 className={styles.pageHeading}>My Schedule</h2>
            <span className={styles.pageSubheading}>
              A.Y. 2024–2025 · 2nd Semester
            </span>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>{totalClasses}</span>
            <span className={styles.headerStatLbl}>Classes</span>
          </div>
          <div className={styles.headerStatDiv} />
          <div className={styles.headerStatDiv} />
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>5</span>
            <span className={styles.headerStatLbl}>Subjects</span>
          </div>
        </div>
      </div>

      {/* ── Schedule Card ── */}
      <div className={styles.scheduleCard}>
        {/* Sticky day-header row */}
        <div className={styles.stickyHeader}>
          <div className={styles.schedTimeHeader}>
            <span>TIME</span>
          </div>
          {DAYS.map((d, i) => (
            <div key={d.short} className={styles.schedColHeader}>
              <span className={styles.colHeaderShort}>{d.short}</span>
              <span className={styles.colHeaderFull}>{d.full}</span>
              {classesPerDay[i] > 0 && (
                <span className={styles.colHeaderBadge}>
                  {classesPerDay[i]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Scrollable time rows */}
        <div className={styles.scheduleScrollArea}>
          <div className={styles.scheduleGrid}>
            {TIMES.map((time, row) => (
              <React.Fragment key={time}>
                <div className={styles.schedTimeCell}>
                  <span className={styles.timeLabelText}>{time}</span>
                  <div className={styles.timeTickLine} />
                </div>

                {[0, 1, 2, 3, 4].map((col) => {
                  const cls = CLASSES.find(
                    (c) => c.day === col && c.start === row,
                  );
                  const isCovered = CLASSES.some(
                    (c) =>
                      c.day === col &&
                      c.start < row &&
                      c.start + (c.span || 1) > row,
                  );
                  if (isCovered) return null;

                  return (
                    <div
                      key={col}
                      className={styles.schedCell}
                      style={
                        cls?.span > 1 ? { gridRow: `span ${cls.span}` } : {}
                      }
                    >
                      {cls && (
                        <div
                          className={`${styles.schedBlock} ${styles[cls.color]}`}
                          onClick={() => setSelected({ cls, rowIndex: row })}
                        >
                          <div className={styles.schedBlockInner}>
                            <div className={styles.schedBlockType}>
                              {cls.type}
                            </div>
                            <div className={styles.schedBlockTitle}>
                              {cls.title}
                            </div>
                            <div className={styles.schedBlockMeta}>
                              <span className={styles.schedBlockGroup}>
                                {cls.sub}
                              </span>
                              <span className={styles.schedBlockRoom}>
                                <i className="bi bi-geo-alt-fill" /> {cls.room}
                              </span>
                            </div>
                            {cls.span > 1 && (
                              <div className={styles.schedBlockDuration}>
                                {cls.span} hr{cls.span > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className={styles.footer}>
        <div className={styles.legend}>
          {LEGEND.map((l) => (
            <div key={l.label} className={styles.legendItem}>
              <div
                className={styles.legendDot}
                style={{ background: l.color }}
              />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
        <span className={styles.footerNote}>
          <i className="bi bi-info-circle" /> Scroll to view full day · 7:00 AM
          – 9:00 PM
        </span>
      </div>

      {/* ── Class Detail Modal ── */}
      {selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHead}>
              <div
                className={styles.modalIcon}
                style={{
                  background: TYPE_META[selected.cls.type]?.bg,
                  color: TYPE_META[selected.cls.type]?.color,
                }}
              >
                {TYPE_META[selected.cls.type]?.icon}
              </div>
              <div className={styles.modalInfo}>
                <div
                  className={styles.modalTypeTag}
                  style={{ color: TYPE_META[selected.cls.type]?.color }}
                >
                  {selected.cls.type}
                </div>
                <div className={styles.modalTitle}>{selected.cls.title}</div>
                <div className={styles.modalSub}>{selected.cls.sub}</div>
              </div>
              <button className={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className={styles.modalDivider} />

            {/* Modal Rows */}
            <div className={styles.modalRows}>
              <div className={styles.modalRow}>
                <div
                  className={styles.modalRowIcon}
                  style={{ background: "#fff0e0", color: "#e65100" }}
                >
                  <FaClock size={15} />
                </div>
                <div>
                  <div className={styles.modalRowLabel}>Time</div>
                  <div className={styles.modalRowVal}>
                    {TIMES[selected.rowIndex]} –{" "}
                    {TIMES[selected.rowIndex + selected.cls.span] ?? "End"}
                  </div>
                </div>
              </div>

              <div className={styles.modalRow}>
                <div
                  className={styles.modalRowIcon}
                  style={{ background: "#e6f1fb", color: "#185fa5" }}
                >
                  <FaLocationDot size={15} />
                </div>
                <div>
                  <div className={styles.modalRowLabel}>Room</div>
                  <div className={styles.modalRowVal}>{selected.cls.room}</div>
                </div>
              </div>

              <div className={styles.modalRow}>
                <div
                  className={styles.modalRowIcon}
                  style={{ background: "#e6f4ea", color: "#2d7a3c" }}
                >
                  <FaUserGroup size={15} />
                </div>
                <div>
                  <div className={styles.modalRowLabel}>Section</div>
                  <div className={styles.modalRowVal}>{selected.cls.sub}</div>
                </div>
              </div>

              <div className={styles.modalRow}>
                <div
                  className={styles.modalRowIcon}
                  style={{ background: "#fde8e8", color: "#c0390a" }}
                >
                  <FaClipboardList size={15} />
                </div>
                <div>
                  <div className={styles.modalRowLabel}>Duration</div>
                  <div className={styles.modalRowVal}>
                    {selected.cls.span} hour{selected.cls.span > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalDivider} />

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnSec}`}
                onClick={closeModal}
              >
                Close
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultySchedule;
