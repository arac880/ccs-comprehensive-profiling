import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// CSS Imports
import schedStyles from "./studentStyles/schedule.module.css";
import layoutStyles from "./studentStyles/dashboard.module.css";

const MOBILE_BREAKPOINT = 992;

export default function StudentSchedule() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Corrected Time Slots ──
  const timeSlots = [];
  for (let i = 6; i <= 20; i++) {
    const hour = i > 12 ? i - 12 : i;
    const nextHour = i + 1 > 12 ? (i + 1 === 25 ? 1 : i + 1 - 12) : i + 1;
    timeSlots.push(`${hour}:00 - ${hour}:30`);
    timeSlots.push(
      `${hour}:30 - ${nextHour === 12 && i !== 11 ? 1 : nextHour}:00`,
    );
  }

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const scheduleData = [
    {
      day: "MONDAY",
      startHour: 10,
      startMin: 0,
      duration: 3,
      color: "#db8251",
      course: "ITEW6",
      title: "Web Development\nFrameworks",
    },
    {
      day: "TUESDAY",
      startHour: 14,
      startMin: 30,
      duration: 3,
      color: "#b977be",
      course: "ITEW6",
      title: "Web Development\nFrameworks",
    },
    {
      day: "THURSDAY",
      startHour: 8,
      startMin: 30,
      duration: 3,
      color: "#6683b2",
      course: "ITEW6",
      title: "Web Development\nFrameworks",
    },
    {
      day: "FRIDAY",
      startHour: 12,
      startMin: 0,
      duration: 3,
      color: "#5fa9a5",
      course: "ITEW6",
      title: "Web Development\nFrameworks",
    },
    {
      day: "SATURDAY",
      startHour: 16,
      startMin: 30,
      duration: 3,
      color: "#8b9f5e",
      course: "ITEW6",
      title: "Web Development\nFrameworks",
    },
  ];

  const getCardPosition = (startHour, startMin, durationHours) => {
    let top = 40;
    let height = durationHours * 60;
    const startTimeDecimal = startHour + startMin / 60;
    const endTimeDecimal = startTimeDecimal + durationHours;

    if (startTimeDecimal < 12) {
      top += (startTimeDecimal - 6) * 60;
      if (endTimeDecimal > 12) height += 40;
    } else {
      top += 6 * 60 + 40 + (startTimeDecimal - 12) * 60;
    }
    return { top: `${top}px`, height: `${height}px` };
  };

  const scheduleUI = (
    <div className={schedStyles.scheduleContainer}>
      <div className={schedStyles.pageHeader}>
        <div className={schedStyles.titleWrapper}>
          <div className={schedStyles.iconBox}>
            <FaCalendarAlt size={20} color="#ffffff" />
          </div>
          <h2 className={schedStyles.pageTitle}>Class Schedule</h2>
        </div>
        <div className={schedStyles.headerControls}>
          <div className={schedStyles.headerNote}>
            Class Section: <strong>4IT-D</strong>
          </div>
        </div>
      </div>

      <div className={schedStyles.calendarOuterLayer}>
        <div className={schedStyles.calendarTable}>
          <div className={schedStyles.calendarHeader}>
            <div className={schedStyles.timeHeaderBlock}>TIME</div>
            {days.map((day) => (
              <div key={day} className={schedStyles.dayHeaderBlock}>
                {day}
              </div>
            ))}
          </div>

          <div className={schedStyles.calendarBody}>
            <div className={schedStyles.timeColumn}>
              <div className={schedStyles.periodDivider}>
                <span className={schedStyles.periodLine}></span> MORNING{" "}
                <span className={schedStyles.periodLine}></span>
              </div>
              {timeSlots.slice(0, 12).map((time, idx) => (
                <div key={`am-${idx}`} className={schedStyles.timeText}>
                  {time}
                </div>
              ))}
              <div className={schedStyles.periodDivider}>
                <span className={schedStyles.periodLine}></span> AFTERNOON{" "}
                <span className={schedStyles.periodLine}></span>
              </div>
              {timeSlots.slice(12, 30).map((time, idx) => (
                <div key={`pm-${idx}`} className={schedStyles.timeText}>
                  {time}
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={day} className={schedStyles.dayColumn}>
                <div className={schedStyles.periodSpacer}></div>
                {timeSlots.slice(0, 12).map((_, idx) => (
                  <div
                    key={`am-grid-${idx}`}
                    className={schedStyles.gridLine}></div>
                ))}
                <div className={schedStyles.periodSpacer}></div>
                {timeSlots.slice(12, 30).map((_, idx) => (
                  <div
                    key={`pm-grid-${idx}`}
                    className={schedStyles.gridLine}></div>
                ))}

                {scheduleData
                  .filter((c) => c.day === day)
                  .map((cls, idx) => {
                    const styleProps = getCardPosition(
                      cls.startHour,
                      cls.startMin,
                      cls.duration,
                    );
                    return (
                      <div
                        key={idx}
                        className={schedStyles.classCard}
                        style={{
                          top: styleProps.top,
                          height: styleProps.height,
                          backgroundColor: cls.color,
                        }}>
                        <div className={schedStyles.cardTop}>
                          <span className={schedStyles.courseCode}>
                            {cls.course}
                          </span>
                          <span className={schedStyles.courseName}>
                            {cls.title.split("\n").map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </span>
                        </div>
                        <div className={schedStyles.cardBottom}>
                          <span className={schedStyles.courseDetails}>
                            Room: ComLab 3
                          </span>
                          <span className={schedStyles.courseDetails}>
                            Prof. Juntin Eusebio
                          </span>
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
  );

  return (
    <main
      className={isMobile ? layoutStyles.mobileMain : layoutStyles.mainContent}>
      {scheduleUI}
    </main>
  );
}
