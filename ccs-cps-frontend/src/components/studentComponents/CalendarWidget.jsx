
import styles from "../../pages/studentPages/studentStyles/CalendarWidget.module.css";

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
 
const DEFAULT_SCHEDULE = [
  "No Scheduled Class for Today",
  "No Scheduled Quiz for Today",
  "No Scheduled Activity for Today",
];
 
export default function CalendarWidget({ scheduleItems = DEFAULT_SCHEDULE }) {
  const today = new Date();
  const day   = today.getDate();
  const dow   = DAYS[today.getDay()];
  const month = MONTHS[today.getMonth()];
  const year  = today.getFullYear();
 
  return (
    <div className={styles.card}>
 
      {/* Orange header: big day number + DOW + month/year */}
      <div className={styles.dateHeader}>
        <span className={styles.dateDay}>{day}</span>
        <div className={styles.dateMeta}>
          <span className={styles.dateDOW}>{dow}</span>
          <span className={styles.dateMonthYear}>{month} {year}</span>
        </div>
      </div>
 
      {/* Schedule items */}
      <div className={styles.scheduleList}>
        {scheduleItems.map((item, i) => (
          <div key={i} className={styles.scheduleItem}>{item}</div>
        ))}
      </div>
 
    </div>
  );
}