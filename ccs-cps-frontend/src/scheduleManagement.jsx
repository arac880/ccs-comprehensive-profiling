import React, { useState, useEffect, useCallback } from "react";
import styles from "./scheduleManagement.module.css";
import {
  FaCalendarPlus,
  FaTrash,
  FaChalkboardUser,
  FaBook,
  FaLaptopCode,
  FaChevronDown,
  FaXmark,
  FaFloppyDisk,
  FaCircleExclamation,
} from "react-icons/fa6";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIMES = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const CLASS_TYPES = ["Lecture", "Lab", "Seminar"];

const TYPE_COLORS = {
  Lecture: { bg: "#fff0f0", color: "#c0390a", icon: <FaBook size={12} /> },
  Lab: { bg: "#f0f7ff", color: "#185fa5", icon: <FaLaptopCode size={12} /> },
  Seminar: {
    bg: "#f0faf4",
    color: "#2d7a3c",
    icon: <FaChalkboardUser size={12} />,
  },
};

const DAY_COLORS = {
  Monday: "#c0390a",
  Tuesday: "#185fa5",
  Wednesday: "#2d7a3c",
  Thursday: "#7c3aed",
  Friday: "#b45309",
  Saturday: "#0891b2",
};

const EMPTY_FORM = {
  program: "",
  yearLevel: "",
  section: "",
  subject: { code: "", title: "", units: 0 },
  faculty: { facultyId: "", name: "" },
  day: "",
  timeStart: "",
  timeEnd: "",
  room: "",
  type: "Lecture",
  academicYear: "2024-2025",
  semester: "2nd Semester",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const API = (path) => `http://localhost:5000/api${path}`;

async function apiFetch(path, opts = {}) {
  const res = await fetch(API(path), {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, children, disabled }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">— Select —</option>
          {children}
        </select>
        <FaChevronDown className={styles.selectIcon} size={11} />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`${styles.toast} ${styles[`toast_${type}`]}`}>
      <FaCircleExclamation size={14} />
      <span>{message}</span>
      <button className={styles.toastClose} onClick={onClose}>
        <FaXmark size={12} />
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ScheduleManagement() {
  // Programs data (from backend or local)
  const [programs, setPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // Derived selections
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");

  // Schedules for the selected section
  const [schedules, setSchedules] = useState([]);

  // Form state
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ── Load programs & faculties ──────────────────────────────────────────────
  useEffect(() => {
    apiFetch("/programs")
      .then(setPrograms)
      .catch(() => {});
    apiFetch("/faculty")
      .then((data) =>
        setFaculties(Array.isArray(data) ? data : data.faculty || []),
      )
      .catch(() => {});
  }, []);

  // ── Load schedules when section changes ────────────────────────────────────
  const loadSchedules = useCallback(async () => {
    if (!selectedProgram || !selectedYear || !selectedSection) return;
    setLoading(true);
    try {
      const data = await apiFetch(
        `/schedules?program=${selectedProgram.code}&yearLevel=${encodeURIComponent(selectedYear.year)}&section=${selectedSection}`,
      );
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProgram, selectedYear, selectedSection]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const yearOptions = selectedProgram?.years || [];
  const sectionOptions = selectedYear?.sections || [];
  const subjectOptions = selectedYear?.subjects || [];

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleProgramChange(code) {
    const prog = programs.find((p) => p.code === code) || null;
    setSelectedProgram(prog);
    setSelectedYear(null);
    setSelectedSection("");
    setSchedules([]);
  }

  function handleYearChange(yearStr) {
    const yr = yearOptions.find((y) => y.year === yearStr) || null;
    setSelectedYear(yr);
    setSelectedSection("");
    setSchedules([]);
  }

  function handleSectionChange(sec) {
    setSelectedSection(sec);
  }

  function openForm() {
    setForm({
      ...EMPTY_FORM,
      program: selectedProgram?.code || "",
      yearLevel: selectedYear?.year || "",
      section: selectedSection,
    });
    setShowForm(true);
  }

  function setSubject(code) {
    const subj = subjectOptions.find((s) => s.code === code);
    if (subj) setForm((f) => ({ ...f, subject: subj }));
    else setForm((f) => ({ ...f, subject: EMPTY_FORM.subject }));
  }

  function setFacultyById(facultyId) {
    const fac = faculties.find((f) => f.facultyId === facultyId);
    if (fac) {
      const name = [
        fac.firstName,
        fac.middleName ? fac.middleName[0] + "." : "",
        fac.lastName,
      ]
        .filter(Boolean)
        .join(" ");
      setForm((f) => ({ ...f, faculty: { facultyId: fac.facultyId, name } }));
    } else {
      setForm((f) => ({ ...f, faculty: EMPTY_FORM.faculty }));
    }
  }

  async function handleSave() {
    const { subject, faculty, day, timeStart, timeEnd, room } = form;
    if (
      !subject.code ||
      !faculty.facultyId ||
      !day ||
      !timeStart ||
      !timeEnd ||
      !room
    ) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    if (timeStart >= timeEnd) {
      setToast({
        message: "End time must be after start time.",
        type: "error",
      });
      return;
    }
    setSaving(true);
    try {
      await apiFetch("/schedules", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToast({ message: "Schedule saved successfully!", type: "success" });
      setShowForm(false);
      loadSchedules();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleteId(id);
    try {
      await apiFetch(`/schedules/${id}`, { method: "DELETE" });
      setToast({ message: "Schedule removed.", type: "success" });
      loadSchedules();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setDeleteId(null);
    }
  }

  // ── Group schedules by day ─────────────────────────────────────────────────
  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedules.filter((s) => s.day === day);
    return acc;
  }, {});

  const hasSelection = selectedProgram && selectedYear && selectedSection;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <FaCalendarPlus size={20} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Schedule Management</h1>
            <p className={styles.pageSubtitle}>
              Assign subjects, faculty, and time slots per section
            </p>
          </div>
        </div>
        {hasSelection && (
          <button className={styles.addBtn} onClick={openForm}>
            <FaCalendarPlus size={14} />
            Add Schedule
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersRow}>
          <SelectField
            label="Program"
            value={selectedProgram?.code || ""}
            onChange={handleProgramChange}
          >
            {programs.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code} — {p.program}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Year Level"
            value={selectedYear?.year || ""}
            onChange={handleYearChange}
            disabled={!selectedProgram}
          >
            {yearOptions.map((y) => (
              <option key={y.year} value={y.year}>
                {y.year}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Section"
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedYear}
          >
            {sectionOptions.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </SelectField>
        </div>

        {hasSelection && (
          <div className={styles.selectionBadge}>
            <span className={styles.badgePill}>{selectedProgram.code}</span>
            <span className={styles.badgeSep}>›</span>
            <span className={styles.badgePill}>{selectedYear.year}</span>
            <span className={styles.badgeSep}>›</span>
            <span className={styles.badgePill}>Section {selectedSection}</span>
            <span className={styles.badgeCount}>
              {schedules.length} schedule{schedules.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Empty State ── */}
      {!hasSelection && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <p className={styles.emptyTitle}>
            Select a Program, Year, and Section
          </p>
          <p className={styles.emptyDesc}>
            Choose the filters above to view and manage schedules for a section.
          </p>
        </div>
      )}

      {/* ── Schedule Grid ── */}
      {hasSelection && (
        <div className={styles.scheduleArea}>
          {loading ? (
            <div className={styles.loadingState}>Loading schedules…</div>
          ) : (
            <div className={styles.dayColumns}>
              {DAYS.map((day) => (
                <div key={day} className={styles.dayCol}>
                  <div
                    className={styles.dayHeader}
                    style={{ borderColor: DAY_COLORS[day] }}
                  >
                    <span
                      className={styles.dayDot}
                      style={{ background: DAY_COLORS[day] }}
                    />
                    {day}
                    {byDay[day].length > 0 && (
                      <span
                        className={styles.dayBadge}
                        style={{
                          background: DAY_COLORS[day] + "22",
                          color: DAY_COLORS[day],
                        }}
                      >
                        {byDay[day].length}
                      </span>
                    )}
                  </div>

                  <div className={styles.daySlots}>
                    {byDay[day].length === 0 ? (
                      <div className={styles.noSlot}>No classes</div>
                    ) : (
                      byDay[day]
                        .sort((a, b) => (a.timeStart > b.timeStart ? 1 : -1))
                        .map((sched) => {
                          const meta =
                            TYPE_COLORS[sched.type] || TYPE_COLORS.Lecture;
                          return (
                            <div
                              key={sched._id}
                              className={styles.schedCard}
                              style={{ borderLeft: `3px solid ${meta.color}` }}
                            >
                              <div className={styles.schedCardTop}>
                                <span
                                  className={styles.schedType}
                                  style={{
                                    background: meta.bg,
                                    color: meta.color,
                                  }}
                                >
                                  {meta.icon}
                                  {sched.type}
                                </span>
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() => handleDelete(sched._id)}
                                  disabled={deleteId === sched._id}
                                  title="Remove"
                                >
                                  <FaTrash size={11} />
                                </button>
                              </div>

                              <div className={styles.schedTitle}>
                                {sched.subject.title}
                              </div>
                              <div className={styles.schedCode}>
                                {sched.subject.code}
                              </div>

                              <div className={styles.schedMeta}>
                                <span className={styles.schedMetaItem}>
                                  🕐 {sched.timeStart} – {sched.timeEnd}
                                </span>
                                <span className={styles.schedMetaItem}>
                                  📍 {sched.room}
                                </span>
                                <span className={styles.schedMetaItem}>
                                  👤 {sched.faculty.name}
                                </span>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add Schedule Modal ── */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <FaCalendarPlus size={16} />
                <div>
                  <div className={styles.modalTitle}>New Schedule Entry</div>
                  <div className={styles.modalSub}>
                    {form.program} · {form.yearLevel} · Sec {form.section}
                  </div>
                </div>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setShowForm(false)}
              >
                <FaXmark size={16} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Subject */}
              <SelectField
                label="Subject *"
                value={form.subject.code}
                onChange={setSubject}
              >
                {subjectOptions.map((s) => (
                  <option key={s.code} value={s.code}>
                    [{s.code}] {s.title} — {s.units} units
                  </option>
                ))}
              </SelectField>

              {/* Faculty */}
              <SelectField
                label="Faculty *"
                value={form.faculty.facultyId}
                onChange={setFacultyById}
              >
                {faculties.map((f) => (
                  <option key={f.facultyId} value={f.facultyId}>
                    {f.lastName}, {f.firstName} ({f.role || "Faculty"})
                  </option>
                ))}
              </SelectField>

              <div className={styles.formRow}>
                {/* Day */}
                <SelectField
                  label="Day *"
                  value={form.day}
                  onChange={(v) => setForm((f) => ({ ...f, day: v }))}
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </SelectField>

                {/* Type */}
                <SelectField
                  label="Type *"
                  value={form.type}
                  onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                >
                  {CLASS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className={styles.formRow}>
                {/* Time Start */}
                <SelectField
                  label="Time Start *"
                  value={form.timeStart}
                  onChange={(v) => setForm((f) => ({ ...f, timeStart: v }))}
                >
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectField>

                {/* Time End */}
                <SelectField
                  label="Time End *"
                  value={form.timeEnd}
                  onChange={(v) => setForm((f) => ({ ...f, timeEnd: v }))}
                >
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectField>
              </div>

              {/* Room */}
              <InputField
                label="Room *"
                value={form.room}
                onChange={(v) => setForm((f) => ({ ...f, room: v }))}
                placeholder="e.g. RM-201, LAB-1"
              />

              <div className={styles.formRow}>
                <InputField
                  label="Academic Year"
                  value={form.academicYear}
                  onChange={(v) => setForm((f) => ({ ...f, academicYear: v }))}
                  placeholder="2024-2025"
                />
                <SelectField
                  label="Semester"
                  value={form.semester}
                  onChange={(v) => setForm((f) => ({ ...f, semester: v }))}
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </SelectField>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                <FaFloppyDisk size={13} />
                {saving ? "Saving…" : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
