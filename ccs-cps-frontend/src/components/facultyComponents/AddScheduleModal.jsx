import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaLaptopCode,
  FaClock,
  FaLocationDot,
  FaGraduationCap,
  FaLayerGroup,
  FaCheck,
  FaUserTie,
} from "react-icons/fa6";
import AppButton from "../ui/AppButton";
import AppModal from "../ui/Modal";
import PROGRAM_DATA from "../../data/programData";
import styles from "../../pages/facultyPages/facultyStyles/AddScheduleModal.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
];
const DURATIONS = [1, 1.5, 2, 2.5, 3];
const CLASS_TYPES = [
  {
    label: "Lecture",
    icon: <FaBook size={12} />,
    color: "#c44e0a",
    bg: "#fff3eb",
  },
  {
    label: "Laboratory",
    icon: <FaLaptopCode size={12} />,
    color: "#b35c00",
    bg: "#fff7ed",
  },
];
const STEPS = [
  { label: "Program", icon: <FaLayerGroup size={12} /> },
  { label: "Year & Section", icon: <FaGraduationCap size={12} /> },
  { label: "Subject", icon: <FaBook size={12} /> },
  { label: "Faculty", icon: <FaUserTie size={12} /> },
  { label: "Schedule", icon: <FaClock size={12} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AddScheduleModal = ({ onClose, onSave, onSaveError }) => {
  const [step, setStep] = useState(0);

  const programs = PROGRAM_DATA.map(({ program, code }) => ({ program, code }));
  const [yearData, setYearData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selProgram, setSelProgram] = useState(null);
  const [selYear, setSelYear] = useState(null);
  const [selSection, setSelSection] = useState(null);
  const [selSubject, setSelSubject] = useState(null);
  const [selFaculty, setSelFaculty] = useState(null);
  const [selType, setSelType] = useState("Lecture");

  const [room, setRoom] = useState("");
  const [day, setDay] = useState(DAYS[0]);
  const [startTime, setStartTime] = useState(TIMES[2]);
  const [duration, setDuration] = useState(1);
  const [saving, setSaving] = useState(false);

  const [faculties, setFaculties] = useState([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [existingSchedules, setExistingSchedules] = useState([]);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selProgram) return;
    const found = PROGRAM_DATA.find((p) => p.code === selProgram.code);
    setYearData(
      found
        ? found.years.map(({ year, sections }) => ({ year, sections }))
        : [],
    );
    setSelYear(null);
    setSelSection(null);
    setSelSubject(null);
    setSubjects([]);
  }, [selProgram]);

  useEffect(() => {
    if (!selProgram || !selYear) return;
    const found = PROGRAM_DATA.find((p) => p.code === selProgram.code);
    const yearObj = found?.years.find((y) => y.year === selYear.year);
    setSubjects(yearObj ? yearObj.subjects : []);
    setSelSubject(null);
  }, [selYear]);

  useEffect(() => {
    fetch("http://localhost:5000/api/schedules")
      .then((res) => res.json())
      .then((data) => setExistingSchedules(Array.isArray(data) ? data : []))
      .catch(() => setExistingSchedules([]));
  }, []);

  useEffect(() => {
    if (step !== 3) return;
    setFacultyLoading(true);
    fetch("http://localhost:5000/api/faculty")
      .then((res) => res.json())
      .then((data) => setFaculties(Array.isArray(data) ? data : []))
      .catch(() => setFaculties([]))
      .finally(() => setFacultyLoading(false));
  }, [step]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const filteredFaculties = faculties.filter((f) =>
    `${f.firstName} ${f.lastName}`
      .toLowerCase()
      .includes(facultySearch.toLowerCase()),
  );

  // ── Get unavailable start times ───────────────────────────────────────────
  const getUnavailableTimes = () => {
    if (!selFaculty || !selSection || !selProgram || !selYear) return new Set();

    const selectedDay = DAYS.indexOf(day);
    const unavailable = new Set();

    TIMES.forEach((time, startIdx) => {
      const newStart = startIdx;
      const newEnd = newStart + Math.round(duration);

      const conflict = existingSchedules.some((s) => {
        if (Number(s.day) !== selectedDay) return false;

        const exStart = Number(s.start);
        const exEnd = exStart + Number(s.span);
        const overlap = newStart < exEnd && newEnd > exStart;
        if (!overlap) return false;

        const sameFaculty =
          s.facultyId?.toString() === selFaculty._id?.toString();

        // ✅ FIX — program + year + section lahat dapat match
        const sameSection =
          s.section === selSection &&
          s.program === selProgram.code &&
          s.year === selYear.year;

        const sameRoom =
          room.trim() &&
          s.room?.trim().toLowerCase() === room.trim().toLowerCase();

        return sameFaculty || sameSection || sameRoom;
      });

      if (conflict) unavailable.add(time);
    });

    return unavailable;
  };

  // ── Auto-reset startTime if it becomes unavailable ────────────────────────
  // NOTE: dapat AFTER ng getUnavailableTimes definition
  useEffect(() => {
    if (step !== 4) return;
    const unavailable = getUnavailableTimes();
    if (unavailable.has(startTime)) {
      const firstAvailable = TIMES.find((t) => !unavailable.has(t));
      if (firstAvailable) setStartTime(firstAvailable);
    }
  }, [day, duration, selFaculty, selSection, room, step]);

  // ── Auto-reset startTime if it becomes unavailable ──────────────────────
  useEffect(() => {
    if (step !== 4) return;
    const unavailable = getUnavailableTimes();
    if (unavailable.has(startTime)) {
      // Find first available time
      const firstAvailable = TIMES.find((t) => !unavailable.has(t));
      if (firstAvailable) setStartTime(firstAvailable);
    }
  }, [day, duration, selFaculty, selSection, room]);

  const canNext = () => {
    if (step === 0) return !!selProgram;
    if (step === 1) return !!selYear && !!selSection;
    if (step === 2) return !!selSubject;
    if (step === 3) return !!selFaculty;
    if (step === 4) return room.trim().length > 0;
    return false;
  };

  const next = () => {
    if (canNext()) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  // ── Conflict checker ──────────────────────────────────────────────────────
  const hasConflict = (newSched) => {
    for (const s of existingSchedules) {
      const sameDay = Number(s.day) === Number(newSched.day);
      if (!sameDay) continue;

      const existingStart = Number(s.start);
      const existingEnd = existingStart + Number(s.span);
      const newStart = Number(newSched.start);
      const newEnd = newStart + Number(newSched.span);
      const overlap = newStart < existingEnd && newEnd > existingStart;
      if (!overlap) continue;

      // Faculty conflict
      const sameFaculty =
        s.facultyId?.toString() === newSched.facultyId?.toString();
      if (sameFaculty) {
        onSaveError?.(
          `Schedule conflict! ${newSched.facultyName} already has a class at this time on ${DAYS[newSched.day]}.`,
        );
        return true;
      }

      const sameSection =
        s.section === newSched.section &&
        s.program === newSched.program &&
        s.year === newSched.year;

      if (sameSection) {
        onSaveError?.(
          `Schedule conflict! ${newSched.program} ${newSched.year} Section ${newSched.section} already has a class at this time on ${DAYS[newSched.day]}.`,
        );
        return true;
      }

      // Room conflict
      const sameRoom =
        s.room?.trim().toLowerCase() === newSched.room?.trim().toLowerCase();
      if (sameRoom && newSched.room?.trim()) {
        onSaveError?.(
          `Schedule conflict! Room ${newSched.room} is already occupied at this time on ${DAYS[newSched.day]}.`,
        );
        return true;
      }
    }

    return false;
  };

  const handleSave = async () => {
    setSaving(true);

    const scheduleData = {
      day: DAYS.indexOf(day),
      start: TIMES.indexOf(startTime),
      span: Math.round(duration),
      title: selSubject.title,
      subjectCode: selSubject.code,
      sub: `${selProgram.code} ${selYear.year.replace(/[^0-9]/g, "")}${selSection}`,
      room: room.trim(),
      type: selType,
      program: selProgram.code,
      year: selYear.year,
      section: selSection,
      facultyId: selFaculty._id,
      facultyName: `${selFaculty.firstName} ${selFaculty.lastName}`,
    };

    // hasConflict na mismo nagtatawag ng onSaveError with specific message
    if (hasConflict(scheduleData)) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      const data = await res.json();

      if (res.ok) {
        setExistingSchedules((prev) => [...prev, scheduleData]);
        onSave({ ...scheduleData, ...data });
      } else {
        onSaveError?.(data.message || "Failed to save schedule.");
      }
    } catch (err) {
      onSaveError?.("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AppModal
      isOpen={true}
      onClose={onClose}
      title="Add Class Schedule"
      icon="bi-calendar-plus-fill"
      maxWidth="560px"
    >
      {/* ── Stepper ── */}
      <div className={styles.stepper}>
        {STEPS.map((st, i) => (
          <React.Fragment key={st.label}>
            <div className={styles.stepItem}>
              <div
                className={`${styles.stepCircle} ${
                  i < step
                    ? styles.done
                    : i === step
                      ? styles.active
                      : styles.pending
                }`}
              >
                {i < step ? <FaCheck size={10} /> : st.icon}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  i < step
                    ? styles.done
                    : i === step
                      ? styles.active
                      : styles.pending
                }`}
              >
                {st.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`${styles.stepLine} ${i < step ? styles.done : styles.pending}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* STEP 0 — Program */}
        {step === 0 && (
          <StepSection title="Select Program" icon={<FaLayerGroup size={13} />}>
            <div className={styles.cardGrid}>
              {programs.map((p) => (
                <ProgramCard
                  key={p.code}
                  label={p.program}
                  sub={p.code}
                  selected={selProgram?.code === p.code}
                  onClick={() => setSelProgram(p)}
                />
              ))}
            </div>
          </StepSection>
        )}

        {/* STEP 1 — Year & Section */}
        {step === 1 && (
          <StepSection
            title="Select Year Level & Section"
            icon={<FaGraduationCap size={13} />}
          >
            <label className={styles.fieldLabel}>Year Level</label>
            <div className={styles.chipRow}>
              {yearData.map((y) => (
                <Chip
                  key={y.year}
                  label={y.year}
                  selected={selYear?.year === y.year}
                  onClick={() => {
                    setSelYear(y);
                    setSelSection(null);
                  }}
                />
              ))}
            </div>
            {selYear && (
              <>
                <label className={styles.fieldLabel} style={{ marginTop: 16 }}>
                  Section
                </label>
                <div className={styles.chipRow}>
                  {selYear.sections.map((sec) => (
                    <Chip
                      key={sec}
                      label={`Section ${sec}`}
                      selected={selSection === sec}
                      onClick={() => setSelSection(sec)}
                    />
                  ))}
                </div>
              </>
            )}
          </StepSection>
        )}

        {/* STEP 2 — Subject */}
        {step === 2 && (
          <StepSection title="Select Course" icon={<FaBook size={13} />}>
            <div className={styles.subjectList}>
              {subjects.map((sub) => (
                <button
                  key={sub.code}
                  className={`${styles.subjectRow} ${selSubject?.code === sub.code ? styles.selected : ""}`}
                  onClick={() => setSelSubject(sub)}
                >
                  <div className={styles.subjectInfo}>
                    <span className={styles.subjectCode}>{sub.code}</span>
                    <span className={styles.subjectTitle}>{sub.title}</span>
                  </div>
                  <span className={styles.subjectUnits}>{sub.units} units</span>
                  {selSubject?.code === sub.code && (
                    <FaCheck size={12} className={styles.checkIcon} />
                  )}
                </button>
              ))}
            </div>
          </StepSection>
        )}

        {/* STEP 3 — Faculty */}
        {step === 3 && (
          <StepSection title="Assign Faculty" icon={<FaUserTie size={13} />}>
            <div className={styles.inputWrap}>
              <i
                className="bi bi-search"
                style={{ padding: "0 10px", color: "#a8917f", fontSize: 13 }}
              />
              <input
                className={styles.inputWithIcon}
                placeholder="Search faculty by name…"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
              />
            </div>

            {facultyLoading && <Loader />}
            {!facultyLoading && filteredFaculties.length === 0 && (
              <div className={styles.emptyMsg}>
                <i
                  className="bi bi-person-x"
                  style={{
                    fontSize: 28,
                    color: "#f0d0c0",
                    display: "block",
                    marginBottom: 6,
                  }}
                />
                No faculty found.
              </div>
            )}

            <div className={styles.facultyList}>
              {filteredFaculties.map((f) => {
                const fullName = `${f.firstName} ${f.lastName}`;
                const isSelected = selFaculty?._id === f._id;
                return (
                  <button
                    key={f._id}
                    className={`${styles.facultyRow} ${isSelected ? styles.selected : ""}`}
                    onClick={() => setSelFaculty(f)}
                  >
                    <div
                      className={`${styles.facultyAvatar} ${isSelected ? styles.active : styles.default}`}
                    >
                      {f.firstName?.[0]}
                      {f.lastName?.[0]}
                    </div>
                    <div className={styles.facultyInfo}>
                      <span className={styles.facultyName}>{fullName}</span>
                      <span className={styles.facultyDept}>
                        {f.department ?? f.specialization ?? "—"}
                      </span>
                    </div>
                    {isSelected && (
                      <FaCheck
                        size={13}
                        style={{ color: "var(--ccs-primary)", flexShrink: 0 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </StepSection>
        )}

        {/* STEP 4 — Schedule */}
        {step === 4 && (
          <StepSection
            title="Set Schedule Details"
            icon={<FaClock size={13} />}
          >
            {/* Class Type */}
            <label className={styles.fieldLabel}>Class Type</label>
            <div className={styles.chipRow} style={{ marginBottom: 16 }}>
              {CLASS_TYPES.map((t) => (
                <button
                  key={t.label}
                  className={styles.typeChip}
                  style={{
                    background:
                      selType === t.label ? t.bg : "var(--ccs-bg-card)",
                    borderColor:
                      selType === t.label ? t.color : "var(--ccs-border)",
                    color:
                      selType === t.label
                        ? t.color
                        : "var(--ccs-text-secondary)",
                  }}
                  onClick={() => setSelType(t.label)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Room */}
            <label className={styles.fieldLabel}>
              <FaLocationDot
                size={10}
                style={{ color: "var(--ccs-primary)" }}
              />{" "}
              Room
            </label>
            <div className={styles.inputWrap}>
              <i
                className="bi bi-geo-alt"
                style={{ padding: "0 10px", color: "#a8917f", fontSize: 13 }}
              />
              <input
                className={styles.inputWithIcon}
                placeholder="e.g. RM-201, LAB-1"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>

            {/* Day */}
            <label className={styles.fieldLabel}>Day</label>
            <div className={styles.chipRow} style={{ marginBottom: 16 }}>
              {DAYS.map((d) => (
                <button
                  key={d}
                  className={`${styles.dayChip} ${day === d ? styles.selected : ""}`}
                  onClick={() => setDay(d)}
                >
                  {d.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>

            {/* Time + Duration */}
            {/* Time + Duration */}
            <div className={styles.row2col}>
              <div style={{ flex: 1 }}>
                <label className={styles.fieldLabel}>
                  <i className="bi bi-clock" /> Start Time
                </label>
                <select
                  className={styles.select}
                  style={{ fontSize: 12, padding: "6px 10px" }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {(() => {
                    const unavailable = getUnavailableTimes();
                    return TIMES.map((t) => {
                      const isUnavailable = unavailable.has(t);
                      return (
                        <option
                          key={t}
                          value={t}
                          disabled={isUnavailable}
                          style={{
                            color: isUnavailable ? "#bbb" : "inherit",
                            background: isUnavailable ? "#f9f4f2" : "inherit",
                            fontSize: 12,
                          }}
                        >
                          {isUnavailable ? `⛔ ${t}` : t}
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className={styles.fieldLabel}>
                  <i className="bi bi-hourglass-split" /> Duration (hrs)
                </label>
                <select
                  className={styles.select}
                  style={{ fontSize: 12, padding: "6px 10px" }}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} hr{d !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 4,
                fontSize: 10,
                color: "#b89e94",
              }}
            >
              
            </div>

            {/* Summary Preview */}
            <div className={styles.previewCard}>
              <div className={styles.previewTitle}>
                <i className="bi bi-card-checklist" /> Summary
              </div>
              <PRow label="Subject" val={selSubject?.title} />
              <PRow
                label="Section"
                val={`${selProgram?.code} ${selYear?.year?.replace(/[^0-9]/g, "")}${selSection}`}
              />
              <PRow
                label="Faculty"
                val={
                  selFaculty
                    ? `${selFaculty.firstName} ${selFaculty.lastName}`
                    : "—"
                }
              />
              <PRow
                label="Schedule"
                val={`${day} · ${startTime} (${duration} hr${duration !== 1 ? "s" : ""})`}
              />
              <PRow label="Room" val={room || "—"} />
            </div>
          </StepSection>
        )}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        {step > 0 ? (
          <AppButton variant="secondary" onClick={back}>
            <i className="bi bi-arrow-left" style={{ marginRight: 6 }} /> Back
          </AppButton>
        ) : (
          <AppButton variant="secondary" onClick={onClose}>
            <i className="bi bi-x-circle" style={{ marginRight: 6 }} /> Cancel
          </AppButton>
        )}

        {step < STEPS.length - 1 ? (
          <AppButton variant="primary" onClick={next} disabled={!canNext()}>
            Next <i className="bi bi-arrow-right" style={{ marginLeft: 6 }} />
          </AppButton>
        ) : (
          <AppButton
            variant="primary"
            onClick={handleSave}
            disabled={!canNext() || saving}
          >
            {saving ? (
              <>
                <i
                  className="bi bi-hourglass-split"
                  style={{ marginRight: 6 }}
                />{" "}
                Saving…
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle" style={{ marginRight: 6 }} />{" "}
                Save Schedule
              </>
            )}
          </AppButton>
        )}
      </div>
    </AppModal>
  );
};;;;;;;

// ─── Sub-components ───────────────────────────────────────────────────────────
const StepSection = ({ title, icon, children }) => (
  <div>
    <div className={styles.stepTitle}>
      <span className={styles.stepTitleIcon}>{icon}</span>
      {title}
    </div>
    {children}
  </div>
);

const ProgramCard = ({ label, sub, selected, onClick }) => (
  <button
    className={`${styles.programCard} ${selected ? styles.selected : ""}`}
    onClick={onClick}
  >
    <div className={styles.programCardLabel}>{label}</div>
    <div className={styles.programCardSub}>{sub}</div>
  </button>
);

const Chip = ({ label, selected, onClick }) => (
  <button
    className={`${styles.chip} ${selected ? styles.selected : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const Loader = () => (
  <div className={styles.loaderWrap}>
    <div className={styles.spinner} />
    <span className={styles.loaderText}>Loading faculty…</span>
  </div>
);

const PRow = ({ label, val }) => (
  <div className={styles.previewRow}>
    <span className={styles.previewLabel}>{label}</span>
    <span className={styles.previewVal}>{val}</span>
  </div>
);

export default AddScheduleModal;
