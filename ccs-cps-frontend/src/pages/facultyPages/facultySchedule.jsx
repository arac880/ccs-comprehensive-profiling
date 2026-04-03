import React from "react";
import styles from "../../pages/facultyPages/facultyStyles/schedule.module.css";

const TIMES = ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const CLASSES = [
  { day: 0, start: 1, title: "Data Structures", sub: "BSCS 3A | RM-201", color: "blockRed" },
  { day: 0, start: 5, title: "Intro to Prog.", sub: "BSCS 1C | RM-105", color: "blockAmber" },
  { day: 1, start: 3, title: "OOP", sub: "BSCS 2B | RM-203", color: "blockBlue" },
  { day: 1, start: 7, title: "Database Systems", sub: "BSIT 3A | RM-204", color: "blockGreen" },
  { day: 2, start: 1, title: "Data Structures", sub: "BSCS 3A | RM-201", color: "blockRed" },
  { day: 2, start: 4, title: "Web Development", sub: "BSIT 2B | LAB-1", color: "blockAmber" },
  { day: 3, start: 3, title: "OOP", sub: "BSCS 2B | RM-203", color: "blockBlue" },
  { day: 3, start: 6, title: "Capstone Project", sub: "BSIT 4A | RM-301", color: "blockRed" },
  { day: 4, start: 2, title: "Intro to Prog.", sub: "BSCS 1C | RM-105", color: "blockAmber" },
  { day: 4, start: 8, title: "Database Systems", sub: "BSIT 3A | RM-204", color: "blockGreen" },
];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const LEGEND = [
  { label: "Lecture", cls: "legendDotRed" },
  { label: "Applied", cls: "legendDotAmber" },
  { label: "Seminar", cls: "legendDotBlue" },
  { label: "Lab / IT", cls: "legendDotGreen" },
];

const FacultySchedule = () => {
  return (
    <div className={styles.pageContent}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageHeading}><i className="bi bi-calendar3" /> My Schedule</h2>
      </div>
      <div className={styles.scheduleCard}>
        <div className={styles.scheduleGrid}>
          <div className={styles.schedColHeader} />
          {DAYS.map((d) => <div key={d} className={styles.schedColHeader}>{d}</div>)}
          {TIMES.map((time, row) => (
            <React.Fragment key={time}>
              <div className={styles.schedTimeCell}>{time}</div>
              {[0, 1, 2, 3, 4].map((col) => {
                const cls = CLASSES.find((c) => c.day === col && c.start === row);
                return (
                  <div key={col} className={styles.schedCell}>
                    {cls && (
                      <div className={`${styles.schedBlock} ${styles[cls.color]}`}>
                        <div className={styles.schedBlockTitle}>{cls.title}</div>
                        <div className={styles.schedBlockSub}>{cls.sub}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={styles.legend}>
        {LEGEND.map((l) => (
          <div key={l.label} className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles[l.cls]}`} />{l.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultySchedule;