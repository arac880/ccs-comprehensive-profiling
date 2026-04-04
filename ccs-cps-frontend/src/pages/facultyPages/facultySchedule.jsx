import React, { useState } from "react";
import styles from "../../pages/facultyPages/facultyStyles/schedule.module.css";

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
  { label: "Applied", color: "#e65100" },
  { label: "Seminar", color: "#185fa5" },
  { label: "Lab / IT", color: "#2d7a3c" },
];

const classesPerDay = DAYS.map(
  (_, i) => CLASSES.filter((c) => c.day === i).length,
);

const FacultySchedule = () => {
  const totalClasses = CLASSES.length;
  const totalHours = CLASSES.reduce((acc, c) => acc + (c.span || 1), 0);

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

      {/* ── Schedule Card (scrollable body) ── */}
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
                {/* Time label */}
                <div className={styles.schedTimeCell}>
                  <span className={styles.timeLabelText}>{time}</span>
                  <div className={styles.timeTickLine} />
                </div>

                {/* Day cells */}
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
    </div>
  );
};

export default FacultySchedule;
