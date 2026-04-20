import { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaRegClock, FaMugHot } from "react-icons/fa";

import schedStyles from "./studentStyles/schedule.module.css";
import layoutStyles from "./studentStyles/dashboard.module.css";

const MOBILE_BREAKPOINT = 992;

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

// Schedule from COR — Section 4IT-D
const scheduleData = [
  // ITP113 — LEC: M/W/Th 14:00–17:00
  { day: "MONDAY",    startHour: 14, startMin: 0, duration: 3, course: "ITP113", title: "IT Practicum (500 hours)",    room: "VRCCS-1",        instructor: "Prof. Montecillo",    type: "LEC" },
  { day: "WEDNESDAY", startHour: 14, startMin: 0, duration: 3, course: "ITP113", title: "IT Practicum (500 hours)",    room: "VRCCS-1",        instructor: "Prof. Montecillo",    type: "LEC" },
  { day: "THURSDAY",  startHour: 14, startMin: 0, duration: 3, course: "ITP113", title: "IT Practicum (500 hours)",    room: "VRCCS-1",        instructor: "Prof. Montecillo",    type: "LEC" },

  // ITP113 — LAB: Th 13:00–16:00
  { day: "THURSDAY",  startHour: 13, startMin: 0, duration: 3, course: "ITP113", title: "IT Practicum (500 hours)",    room: "VRCCS-1/VRCCS-1", instructor: "Prof. Montecillo",   type: "LAB" },

  // ITEW6 — LEC: M 10:00–13:00
  { day: "MONDAY",    startHour: 10, startMin: 0, duration: 3, course: "ITEW6",  title: "Web Development Frameworks", room: "COMLAB 3",       instructor: "Prof. Eusebio", type: "LEC" },
];

const PALETTE = ["#4A90E2", "#E65100", "#43A047", "#8E44AD", "#009688", "#D32F2F", "#F39C12"];

const uniqueCourses = [...new Set(scheduleData.map(c => c.course))];
const courseColors = {};
uniqueCourses.forEach((course, index) => {
  courseColors[course] = PALETTE[index % PALETTE.length];
});

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatTime = (hour, min) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  const m = min === 0 ? "00" : min < 10 ? `0${min}` : min;
  return `${h12}:${m} ${ampm}`;
};

const getEndTime = (startHour, startMin, durationHours) => {
  let endH = startHour + Math.floor(durationHours);
  let endM = startMin + (durationHours % 1) * 60;
  if (endM >= 60) { endH += 1; endM -= 60; }
  return formatTime(endH, endM);
};

export default function StudentSchedule() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  
  const TODAY_JS = new Date().getDay(); 
  const DAY_MAP = { 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY", 0: "SUNDAY" };
  const initialDay = DAY_MAP[TODAY_JS] || "MONDAY";
  const [activeDay, setActiveDay] = useState(initialDay);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const todaysClasses = scheduleData
    .filter((c) => c.day === activeDay)
    .sort((a, b) => (a.startHour + a.startMin / 60) - (b.startHour + b.startMin / 60));

  const scheduleUI = (
    <div className={schedStyles.scheduleContainer}>

      {/* ── Page Header ── */}
      <div className={schedStyles.pageHeader}>
        <div className={schedStyles.titleWrapper}>
          <div className={schedStyles.iconBox}>
            <FaCalendarAlt size={18} color="#ffffff" />
          </div>
          <h2 className={schedStyles.pageTitle}>Daily Class Schedule</h2>
        </div>

        <div className={schedStyles.headerControls}>
          <div className={schedStyles.headerNote}>
            Class Section: <strong>4IT-D</strong>
          </div>
        </div>
      </div>

      {/* ── Main Agenda Widget ── */}
      <div className={schedStyles.agendaWidget}>
        
        {/* 1. Interactive Day Picker */}
        <div className={schedStyles.dayNavScroll}>
          <div className={schedStyles.dayNav}>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`${schedStyles.dayBtn} ${activeDay === day ? schedStyles.activeDayBtn : ""}`}
              >
                <span className={schedStyles.dayNameFull}>{day}</span>
                <span className={schedStyles.dayNameShort}>{day.substring(0, 3)}</span>
                {scheduleData.some(c => c.day === day) && <span className={schedStyles.classIndicatorDot}></span>}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Timeline Layout for the Selected Day */}
        <div className={schedStyles.agendaContent}>
          {todaysClasses.length > 0 ? (
            <div className={schedStyles.timeline}>
              {todaysClasses.map((cls, idx) => {
                const mainColor = courseColors[cls.course];
                const startTime = formatTime(cls.startHour, cls.startMin);
                const endTime = getEndTime(cls.startHour, cls.startMin, cls.duration);

                return (
                  <div key={idx} className={schedStyles.timelineRow}>
                    
                    <div className={schedStyles.timeTrack}>
                      <span className={schedStyles.timeStart}>{startTime}</span>
                      <span className={schedStyles.timeEnd}>{endTime}</span>
                    </div>

                    <div className={schedStyles.nodeTrack}>
                      <div className={schedStyles.nodeLine}></div>
                      <div className={schedStyles.nodeDot} style={{ borderColor: mainColor }}></div>
                    </div>

                    <div className={schedStyles.cardTrack}>
                      <div 
                        className={schedStyles.agendaCard}
                        style={{ 
                          background: `linear-gradient(${hexToRgba(mainColor, 0.08)}, ${hexToRgba(mainColor, 0.08)}), #ffffff`,
                          borderLeft: `4px solid ${mainColor}`,
                          borderTop: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                          borderRight: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                          borderBottom: `1px solid ${hexToRgba(mainColor, 0.2)}`,
                        }}
                      >
                        <div className={schedStyles.cardHeaderRow}>
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
                        
                        <h3 className={schedStyles.courseTitle}>{cls.title}</h3>
                        
                        <div className={schedStyles.cardMetaRow}>
                          <div className={schedStyles.metaItem}>
                            <FaRegClock color={mainColor} /> {cls.duration} Hours
                          </div>
                          <div className={schedStyles.metaItem}>
                            <FaMapMarkerAlt color={mainColor} /> {cls.room}
                          </div>
                          <div className={schedStyles.metaItem}>
                            <FaUserTie color={mainColor} /> {cls.instructor}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className={schedStyles.emptyState}>
              <div className={schedStyles.emptyIconWrap}>
                <FaMugHot size={32} />
              </div>
              <h3 className={schedStyles.emptyTitle}>Free Day!</h3>
              <p className={schedStyles.emptyText}>You have no classes scheduled for {activeDay.toLowerCase()}. Enjoy your break or use this time to catch up on research.</p>
            </div>
          )}
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