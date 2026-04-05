import { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";

import schedStyles from "./studentStyles/schedule.module.css";
import layoutStyles from "./studentStyles/dashboard.module.css";

const MOBILE_BREAKPOINT = 992;

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const scheduleData = [
  { day: "MONDAY", startHour: 8, startMin: 0, duration: 2, course: "ITEW6", title: "Web Development Frameworks", room: "BCH 402", instructor: "Prof. Eusebio", type: "LEC" },
  { day: "MONDAY", startHour: 10, startMin: 0, duration: 3, course: "ITEW6", title: "Web Development Frameworks", room: "ComLab 1", instructor: "Prof. Eusebio", type: "LAB" },
  
  { day: "TUESDAY", startHour: 13, startMin: 0, duration: 2, course: "IT 312", title: "Networking 2", room: "BCH 405", instructor: "Prof. Santos", type: "LEC" },
  { day: "TUESDAY", startHour: 15, startMin: 0, duration: 3, course: "IT 312", title: "Networking 2", room: "ComLab 1", instructor: "Prof. Santos", type: "LAB" },
  
  { day: "WEDNESDAY", startHour: 9, startMin: 0, duration: 3, course: "IT 303", title: "Database Management Systems", room: "ComLab 2", instructor: "Prof. Reyes", type: "LAB" },
  
  { day: "THURSDAY", startHour: 14, startMin: 0, duration: 2.5, course: "IT 303", title: "Database Management Systems", room: "BCH 401", instructor: "Prof. Reyes", type: "LEC" },
  
  { day: "FRIDAY", startHour: 10, startMin: 0, duration: 3, course: "ITP113", title: "IT Practicum", room: "ComLab 3", instructor: "Prof. Cruz", type: "LAB" },
];

const PALETTE = ["#4A90E2", "#E65100", "#43A047", "#8E44AD", "#009688", "#D32F2F", "#F39C12"];

const uniqueCourses = [...new Set(scheduleData.map(c => c.course))];
const courseColors = {};
uniqueCourses.forEach((course, index) => {
  courseColors[course] = PALETTE[index % PALETTE.length];
});

// Helper to create translucent background colors from hex
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function buildTimeSlots() {
  const slots = [];
  for (let i = 6; i <= 20; i++) {
    const fmt = (h) => {
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const suffix = h >= 12 && h < 24 ? "PM" : "AM";
      return `${h12}:00 ${suffix}`;
    };
    const fmtHalf = (h) => {
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const suffix = h >= 12 && h < 24 ? "PM" : "AM";
      return `${h12}:30 ${suffix}`;
    };
    slots.push(fmt(i));
    if (i < 20) slots.push(fmtHalf(i));
  }
  return slots;
}

const timeSlots = buildTimeSlots();

function getCardPosition(startHour, startMin, durationHours) {
  const PERIOD_H = 36; 
  const ROW_H = 30;    
  const BASE_HOUR = 6;

  const startDecimal = startHour + startMin / 60;
  const endDecimal   = startDecimal + durationHours;

  let top = PERIOD_H; 
  top += (Math.min(startDecimal, 12) - BASE_HOUR) * 2 * ROW_H;

  if (startDecimal >= 12) {
    top += PERIOD_H; 
    top += (startDecimal - 12) * 2 * ROW_H;
  }

  let height = durationHours * 2 * ROW_H;
  if (startDecimal < 12 && endDecimal > 12) height += PERIOD_H;

  return { top: `${Math.round(top) + 2}px`, height: `${Math.round(height) - 4}px` };
}

const TODAY_JS = new Date().getDay(); 
const DAY_MAP = { 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY", 0: "SUNDAY" };
const todayName = DAY_MAP[TODAY_JS];

export default function StudentSchedule() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const amSlots = timeSlots.filter((_, i) => i < 12);  
  const pmSlots = timeSlots.filter((_, i) => i >= 12); 

  const scheduleUI = (
    <div className={schedStyles.scheduleContainer}>

      {/* ── Page Header ── */}
      <div className={schedStyles.pageHeader}>
        <div className={schedStyles.titleWrapper}>
          <div className={schedStyles.iconBox}>
            <FaCalendarAlt size={18} color="#ffffff" />
          </div>
          <h2 className={schedStyles.pageTitle}>Class Schedule</h2>
        </div>

        <div className={schedStyles.headerControls}>
          <div className={schedStyles.legendWrap}>
            {uniqueCourses.map((course) => (
              <span key={course} className={schedStyles.legendItem}>
                <span className={schedStyles.legendColorDot} style={{ backgroundColor: courseColors[course] }} />
                {course}
              </span>
            ))}
            <div className={schedStyles.legendDivider} />
            <span className={schedStyles.legendItem}>
              <span className={schedStyles.legendLecBox}>LEC</span> Lecture
            </span>
            <span className={schedStyles.legendItem}>
              <span className={schedStyles.legendLabBox}>LAB</span> Laboratory
            </span>
          </div>
          <div className={schedStyles.headerNote}>
            Class Section: <strong>4IT-D</strong>
          </div>
        </div>
      </div>

      {/* ── Calendar Card (Responsive Wrappers) ── */}
      <div className={schedStyles.calendarOuterLayer}>
        <div className={schedStyles.calendarScrollArea}>
          <div className={schedStyles.calendarTable}>

            {/* Sticky Header */}
            <div className={schedStyles.calendarHeader}>
              <div className={schedStyles.timeHeaderBlock}>TIME</div>
              {days.map((day) => (
                <div key={day} className={`${schedStyles.dayHeaderBlock} ${day === todayName ? schedStyles.dayHeaderToday : ""}`}>
                  {day}
                </div>
              ))}
            </div>

            <div className={schedStyles.calendarBody}>

              {/* Sticky Time Column */}
              <div className={schedStyles.timeColumn}>
                <div className={schedStyles.periodDivider}>
                  <span className={schedStyles.periodLine} /> MORNING <span className={schedStyles.periodLine} />
                </div>
                {amSlots.map((time, idx) => <div key={`am-${idx}`} className={schedStyles.timeText}>{time}</div>)}
                <div className={schedStyles.periodDivider}>
                  <span className={schedStyles.periodLine} /> AFTERNOON <span className={schedStyles.periodLine} />
                </div>
                {pmSlots.map((time, idx) => <div key={`pm-${idx}`} className={schedStyles.timeText}>{time}</div>)}
              </div>

              {/* Day Columns & Grid */}
              {days.map((day) => (
                <div key={day} className={`${schedStyles.dayColumn} ${day === todayName ? schedStyles.dayColumnToday : ""}`}>
                  <div className={schedStyles.periodSpacer} />
                  {amSlots.map((_, idx) => <div key={`am-grid-${idx}`} className={`${schedStyles.gridLine} ${idx % 2 === 1 ? schedStyles.gridLineAlt : ""}`} />)}

                  <div className={schedStyles.periodSpacer} />
                  {pmSlots.map((_, idx) => <div key={`pm-grid-${idx}`} className={`${schedStyles.gridLine} ${idx % 2 === 1 ? schedStyles.gridLineAlt : ""}`} />)}

                  {/* Render Class Cards */}
                  {scheduleData.filter((c) => c.day === day).map((cls, idx) => {
                    const pos = getCardPosition(cls.startHour, cls.startMin, cls.duration);
                    const mainColor = courseColors[cls.course];
                    
                    return (
                      <div 
                        key={idx} 
                        className={schedStyles.classCard} 
                        style={{ 
                          top: pos.top, 
                          height: pos.height, 
                          background: `linear-gradient(${hexToRgba(mainColor, 0.15)}, ${hexToRgba(mainColor, 0.15)}), #ffffff`,
                          borderLeft: `4px solid ${mainColor}`,
                          borderTop: `1px solid ${hexToRgba(mainColor, 0.3)}`,
                          borderRight: `1px solid ${hexToRgba(mainColor, 0.3)}`,
                          borderBottom: `1px solid ${hexToRgba(mainColor, 0.3)}`,
                        }}
                      >
                        <div className={schedStyles.cardTop}>
                          <div className={schedStyles.courseHeaderRow}>
                            <span className={schedStyles.courseCode} style={{ color: mainColor }}>{cls.course}</span>
                            <span 
                              className={cls.type === "LAB" ? schedStyles.tagLab : schedStyles.tagLec}
                              style={{ 
                                color: mainColor, 
                                backgroundColor: cls.type === "LAB" ? "#fff" : hexToRgba(mainColor, 0.15),
                                borderColor: mainColor
                              }}
                            >
                              {cls.type}
                            </span>
                          </div>
                          <span className={schedStyles.courseName}>{cls.title}</span>
                        </div>

                        <div className={schedStyles.cardBottom}>
                          <span className={schedStyles.courseDetails}><FaMapMarkerAlt size={10} color={mainColor}/> {cls.room}</span>
                          <span className={schedStyles.courseDetails}><FaUserTie size={10} color={mainColor}/> {cls.instructor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <main className={isMobile ? layoutStyles.mobileMain : layoutStyles.mainContent}>
      {scheduleUI}
    </main>
  );
}