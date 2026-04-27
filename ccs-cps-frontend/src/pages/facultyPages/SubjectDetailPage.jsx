// pages/facultyPages/SubjectDetailPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "../../pages/facultyPages/facultyStyles/SubjectDetail.module.css";
import {
  FiArrowLeft,
  FiUpload,
  FiClock,
  FiMapPin,
  FiUsers,
  FiAlertCircle,
  FiBook,
  FiCheckSquare,
  FiPaperclip,
  FiTrash2,
  FiFileText,
  FiImage,
  FiFile,
  FiBell,
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiLayers,
  FiEdit2,
  FiDownload,
  FiX,
  FiSend,
  FiStar,
  FiMessageCircle,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
} from "react-icons/fi";
import AppToast from "../../components/ui/AppToast";

const API = "http://localhost:5000";

const getUserRole = () => {
  try {
    return localStorage.getItem("role");
  } catch {
    return null;
  }
};

const getUser = () => {
  try {
    const r = localStorage.getItem("user");
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};

const getFileIcon = (name = "") => {
  const ext = (name || "").split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FiFileText style={{ color: "#c0390a" }} />;
  if (["doc", "docx"].includes(ext))
    return <FiFileText style={{ color: "#185fa5" }} />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
    return <FiImage style={{ color: "#b45309" }} />;
  return <FiFile style={{ color: "#6b5a4e" }} />;
};

const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDueDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const diff = d - now;
  return {
    formatted: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOverdue: diff < 0,
    diff,
  };
};

const POST_TYPES = [
  {
    key: "announcement",
    label: "Announcement",
    icon: () => <FiBell size={13} />,
    badge: "badgeAnnouncement",
  },
  {
    key: "activity",
    label: "Activity",
    icon: () => <FiActivity size={13} />,
    badge: "badgeActivity",
  },
  {
    key: "lesson",
    label: "Lesson",
    icon: () => <FiBookOpen size={13} />,
    badge: "badgeLesson",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SubmissionBin — shown inside activity posts
// ─────────────────────────────────────────────────────────────────────────────
const SubmissionBin = ({ post, user, userRole, showToast }) => {
  const isStudent = userRole === "student";
  const isFaculty = ["dean", "chair", "faculty"].includes(userRole);

  const [mySubmission, setMySubmission] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [gradingId, setGradingId] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const studentId = user?.studentId ?? user?._id ?? user?.id ?? "";
  const studentName = user ? `${user.firstName} ${user.lastName}` : "Student";

  const fetchData = useCallback(async () => {
    if (!post?._id) return;
    setLoadingSub(true);
    try {
      if (isStudent && studentId) {
        const res = await fetch(
          `${API}/api/submissions/student/${studentId}/post/${post._id}`,
        );
        const data = await res.json();
        setMySubmission(data);
      }
      if (isFaculty) {
        const res = await fetch(`${API}/api/submissions/post/${post._id}`);
        const data = await res.json();
        setAllSubmissions(Array.isArray(data) ? data : []);
      }
    } catch {
      /* silent */
    } finally {
      setLoadingSub(false);
    }
  }, [post?._id, isStudent, isFaculty, studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    if (!studentId) {
      showToast("Student ID not found. Please log in again.", "error");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("postId", post._id);
    fd.append("studentId", studentId);
    fd.append("studentName", studentName);
    Array.from(files).forEach((f) => fd.append("files", f));

    try {
      const res = await fetch(`${API}/api/submissions`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }
      setMySubmission(await res.json());
      showToast("Files submitted successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to submit files.", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemoveFile = async (fileIndex) => {
    if (!mySubmission?._id) return;
    try {
      const res = await fetch(
        `${API}/api/submissions/${mySubmission._id}/file/${fileIndex}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      setMySubmission(await res.json());
      showToast("File removed.", "info");
    } catch {
      showToast("Failed to remove file.", "error");
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleGrade = async () => {
    if (!gradingId) return;
    setSubmittingGrade(true);
    try {
      const res = await fetch(`${API}/api/submissions/${gradingId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gradeForm),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setAllSubmissions((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s)),
      );
      setGradingId(null);
      setGradeForm({ grade: "", feedback: "" });
      showToast("Grade saved!", "success");
    } catch {
      showToast("Failed to save grade.", "error");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const due = formatDueDate(post.dueDate);

  // ── Student view ──────────────────────────────────────────
  if (isStudent) {
    const hasSubmitted = mySubmission && mySubmission.files?.length > 0;
    const isGraded = mySubmission?.status === "graded";

    return (
      <div className={styles.submissionBin}>
        {due && (
          <div
            className={`${styles.dueBanner} ${due.isOverdue ? styles.dueBannerOverdue : ""}`}
          >
            <FiAlertTriangle size={13} />
            {due.isOverdue ? "Overdue — " : "Due: "}
            <strong>{due.formatted}</strong>
          </div>
        )}

        <div className={styles.submissionBinTitle}>
          <FiSend size={14} /> Your Submission
        </div>

        {loadingSub ? (
          <div className={styles.subLoading}>Loading submission…</div>
        ) : (
          <>
            {isGraded && (
              <div className={styles.gradeDisplay}>
                <div className={styles.gradeScore}>
                  <FiStar size={14} style={{ color: "#f59e0b" }} />
                  Grade: <strong>{mySubmission.grade ?? "—"}</strong>
                </div>
                {mySubmission.feedback && (
                  <div className={styles.gradeFeedback}>
                    <FiMessageCircle size={12} /> {mySubmission.feedback}
                  </div>
                )}
              </div>
            )}

            {hasSubmitted && (
              <div className={styles.submittedFiles}>
                {mySubmission.files.map((f, i) => (
                  <div key={i} className={styles.submittedFile}>
                    <span className={styles.attachmentIcon}>
                      {getFileIcon(f.originalName)}
                    </span>
                    <span className={styles.submittedFileName}>
                      {f.originalName}
                    </span>
                    <span className={styles.submittedFileSize}>{f.size}</span>
                    <a
                      href={`${API}${f.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.fileActionBtn}
                      title="Download"
                    >
                      <FiDownload size={13} />
                    </a>
                    {!isGraded && (
                      <button
                        className={styles.fileActionBtn}
                        onClick={() => handleRemoveFile(i)}
                        title="Remove"
                      >
                        <FiX size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isGraded && !(due?.isOverdue && !hasSubmitted) && (
              <div
                className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleUpload(e.target.files)}
                />
                {uploading ? (
                  <div className={styles.subLoading}>
                    <div className={styles.spinner} /> Uploading…
                  </div>
                ) : (
                  <>
                    <FiUpload size={22} className={styles.dropZoneIcon} />
                    <div className={styles.dropZoneText}>
                      {hasSubmitted
                        ? "Add more files"
                        : "Click or drag files here to submit"}
                    </div>
                    <div className={styles.dropZoneHint}>
                      PDF, DOCX, images, ZIP — max 50 MB each
                    </div>
                  </>
                )}
              </div>
            )}

            {due?.isOverdue && !hasSubmitted && (
              <div className={styles.overdueNote}>
                Submission deadline has passed.
              </div>
            )}
            {!hasSubmitted && !due?.isOverdue && (
              <div className={styles.notSubmittedNote}>
                No files submitted yet.
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Faculty view ──────────────────────────────────────────
  if (isFaculty) {
    return (
      <div className={styles.submissionBin}>
        {due && (
          <div
            className={`${styles.dueBanner} ${due.isOverdue ? styles.dueBannerOverdue : ""}`}
          >
            <FiAlertTriangle size={13} />
            {due.isOverdue ? "Overdue — " : "Due: "}
            <strong>{due.formatted}</strong>
          </div>
        )}

        <button
          className={styles.submissionBinToggle}
          onClick={() => setExpanded((v) => !v)}
        >
          <FiUsers size={13} />
          {loadingSub
            ? "Loading…"
            : `${allSubmissions.length} Submission${allSubmissions.length !== 1 ? "s" : ""}`}
          {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
        </button>

        {expanded && (
          <div className={styles.allSubmissions}>
            {allSubmissions.length === 0 ? (
              <div className={styles.notSubmittedNote}>No submissions yet.</div>
            ) : (
              allSubmissions.map((sub) => (
                <div key={sub._id} className={styles.submissionRow}>
                  <div className={styles.submissionStudentInfo}>
                    <div className={styles.submissionStudentName}>
                      {sub.studentName}
                    </div>
                    <div className={styles.submissionStudentMeta}>
                      {sub.files.length} file{sub.files.length !== 1 ? "s" : ""}{" "}
                      ·{" "}
                      {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ·{" "}
                      <span
                        className={`${styles.subStatus} ${styles[`subStatus_${sub.status}`]}`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  <div
                    className={styles.submittedFiles}
                    style={{ marginBottom: 8 }}
                  >
                    {sub.files.map((f, i) => (
                      <div key={i} className={styles.submittedFile}>
                        <span className={styles.attachmentIcon}>
                          {getFileIcon(f.originalName)}
                        </span>
                        <span className={styles.submittedFileName}>
                          {f.originalName}
                        </span>
                        <span className={styles.submittedFileSize}>
                          {f.size}
                        </span>
                        <a
                          href={`${API}${f.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.fileActionBtn}
                          title="Download"
                        >
                          <FiDownload size={13} />
                        </a>
                      </div>
                    ))}
                  </div>

                  {gradingId === sub._id ? (
                    <div className={styles.gradeForm}>
                      <input
                        className={styles.gradeInput}
                        placeholder="Grade (e.g. 95/100)"
                        value={gradeForm.grade}
                        onChange={(e) =>
                          setGradeForm((f) => ({ ...f, grade: e.target.value }))
                        }
                      />
                      <textarea
                        className={styles.gradeFeedbackInput}
                        placeholder="Feedback (optional)"
                        value={gradeForm.feedback}
                        onChange={(e) =>
                          setGradeForm((f) => ({
                            ...f,
                            feedback: e.target.value,
                          }))
                        }
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className={styles.btnPrimary}
                          style={{ fontSize: 12, padding: "6px 14px" }}
                          onClick={handleGrade}
                          disabled={submittingGrade}
                        >
                          {submittingGrade ? "Saving…" : "Save Grade"}
                        </button>
                        <button
                          className={styles.btnSecondary}
                          style={{ fontSize: 12, padding: "6px 14px" }}
                          onClick={() => {
                            setGradingId(null);
                            setGradeForm({ grade: "", feedback: "" });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {sub.grade && (
                        <span className={styles.gradeTag}>
                          <FiStar size={11} /> {sub.grade}
                        </span>
                      )}
                      <button
                        className={styles.gradeBtn}
                        onClick={() => {
                          setGradingId(sub._id);
                          setGradeForm({
                            grade: sub.grade ?? "",
                            feedback: sub.feedback ?? "",
                          });
                        }}
                      >
                        {sub.grade ? "Edit Grade" : "Grade"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const SubjectDetailPage = ({ cls, onBack }) => {
  const userRole = getUserRole();
  const user = getUser();
  const canPost = ["dean", "chair", "faculty"].includes(userRole);
  const authorName = user ? `${user.firstName} ${user.lastName}` : "Instructor";
  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("announcement");
  const [form, setForm] = useState({ title: "", content: "", dueDate: "" });

  // attachments now stores objects with { name, size, file? (File object for new), url? (for existing) }
  const [attachments, setAttachments] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const fileRef = useRef();

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const closeToast = () => setToast((t) => ({ ...t, isVisible: false }));

  // ── Fetch posts ───────────────────────────────────────────
  useEffect(() => {
    if (!cls?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API}/api/posts/subject/${cls._id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => showToast("Failed to load posts.", "error"))
      .finally(() => setLoading(false));
  }, [cls?._id]);

  // ── Fetch students ─────────────────────────────────────────
  useEffect(() => {
    if (userRole === "student") {
      setLoadingStudents(false);
      return;
    }
    if (!cls?.section || !cls?.program || !cls?.year) {
      setLoadingStudents(false);
      return;
    }
    setLoadingStudents(true);
    const params = new URLSearchParams({
      section: cls.section,
      program: cls.program,
      year: cls.year,
    });
    fetch(`${API}/api/students?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setStudents(Array.isArray(d) ? d : (d.students ?? [])))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, [cls?.section, cls?.program, cls?.year, userRole]);

  // ── Modal open ─────────────────────────────────────────────
  const openModal = (tab = "announcement", postToEdit = null) => {
    setActiveTab(tab);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setForm({
        title: postToEdit.title,
        content: postToEdit.content,
        dueDate: postToEdit.dueDate
          ? new Date(postToEdit.dueDate).toISOString().slice(0, 16)
          : "",
      });
      // Load existing attachments as "kept" (no File object)
      setAttachments(
        (postToEdit.attachments ?? []).map((a) => ({
          name: a.name,
          size: a.size,
          url: a.url,
          storedName: a.storedName,
          isExisting: true,
        })),
      );
    } else {
      setEditingPost(null);
      setForm({ title: "", content: "", dueDate: "" });
      setAttachments([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setForm({ title: "", content: "", dueDate: "" });
    setAttachments([]);
  };

  // ── File picker for post attachments ───────────────────────
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      file: f, // actual File object — will be sent via FormData
      isExisting: false,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // ── Submit post (FormData, supports real file upload) ──────
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);

    console.log("cls data:", {
      section: cls?.section,
      program: cls?.program,
      year: cls?.year,
    });
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      fd.append("type", activeTab);
      fd.append("subjectId", cls?._id);

      console.log("subjectId being sent:", cls?._id);

      fd.append("author", authorName);

      fd.append("section", cls?.section ?? "");
      fd.append("program", cls?.program ?? "");
      fd.append("year", cls?.year ?? "");

      if (activeTab === "activity" && form.dueDate) {
        fd.append("dueDate", form.dueDate);
      }

      // Existing attachments to keep (no File object)
      const kept = attachments
        .filter((a) => a.isExisting)
        .map(({ name, size, url, storedName }) => ({
          name,
          size,
          url,
          storedName,
        }));
      fd.append("keepAttachments", JSON.stringify(kept));

      // New files to upload
      attachments
        .filter((a) => !a.isExisting && a.file)
        .forEach((a) => fd.append("attachments", a.file));

      let res;
      if (editingPost) {
        res = await fetch(`${API}/api/posts/${editingPost._id}`, {
          method: "PUT",
          body: fd,
        });
      } else {
        res = await fetch(`${API}/api/posts`, { method: "POST", body: fd });
      }

      if (!res.ok) throw new Error();
      const saved = await res.json();

      if (editingPost) {
        setPosts((prev) => prev.map((p) => (p._id === saved._id ? saved : p)));
        showToast("Post updated successfully!", "success");
      } else {
        setPosts((prev) => [saved, ...prev]);
        showToast("Post published!", "success");
      }
      closeModal();
    } catch {
      showToast("Failed to save post.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete post ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${API}/api/posts/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p._id !== deletingId));
      showToast("Post deleted.", "info");
    } catch {
      showToast("Failed to delete post.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const TypeBadge = ({ type }) => {
    const t = POST_TYPES.find((x) => x.key === type) || POST_TYPES[0];
    return (
      <span className={`${styles.postTypeBadge} ${styles[t.badge]}`}>
        {t.icon()} {t.label}
      </span>
    );
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <button className={styles.heroBack} onClick={onBack}>
          <FiArrowLeft size={12} /> Back to Schedule
        </button>
        <div className={styles.heroBadge}>
          <FiLayers size={10} /> {cls?.type ?? "Subject"}
        </div>
        <h1 className={styles.heroTitle}>{cls?.title ?? "Subject Title"}</h1>
        <p className={styles.heroSub}>{cls?.sub ?? "Section"}</p>
        <div className={styles.heroMeta}>
          <span className={styles.heroMetaItem}>
            <FiClock size={13} /> {cls?.timeLabel ?? "TBA"}
          </span>
          <span className={styles.heroMetaItem}>
            <FiMapPin size={13} /> {cls?.room ?? "TBA"}
          </span>
          {userRole !== "student" && (
            <span className={styles.heroMetaItem}>
              <FiUsers size={13} /> {loadingStudents ? "..." : students.length}{" "}
              Students
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          {
            icon: <FiAlertCircle />,
            cls: "statIconOrange",
            num: posts.filter((p) => p.type === "announcement").length,
            lbl: "Announcements",
          },
          {
            icon: <FiBook />,
            cls: "statIconBlue",
            num: posts.filter((p) => p.type === "lesson").length,
            lbl: "Lessons",
          },
          {
            icon: <FiCheckSquare />,
            cls: "statIconGreen",
            num: posts.filter((p) => p.type === "activity").length,
            lbl: "Activities",
          },
          {
            icon: <FiPaperclip />,
            cls: "statIconAmber",
            num: posts.reduce((a, p) => a + (p.attachments?.length ?? 0), 0),
            lbl: "Files",
          },
        ].map((s) => (
          <div key={s.lbl} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[s.cls]}`}>
              {s.icon}
            </div>
            <div>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLbl}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className={styles.main}>
        <div>
          {/* Create box */}
          {canPost && (
            <div className={styles.createBox}>
              <div className={styles.createBoxTop}>
                <div className={styles.avatar}>{initials(authorName)}</div>
                <div
                  className={styles.createInput}
                  onClick={() => openModal("announcement")}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && openModal("announcement")
                  }
                >
                  Share something with your class...
                </div>
              </div>
              <div className={styles.createActions}>
                {POST_TYPES.map((t) => (
                  <button
                    key={t.key}
                    className={styles.createAction}
                    onClick={() => openModal(t.key)}
                  >
                    {t.icon()} {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className={styles.filterBar}>
            {["all", ...POST_TYPES.map((t) => t.key)].map((f) => (
              <button
                key={f}
                className={`${styles.filterChip} ${filter === f ? styles.active : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All Posts"
                  : POST_TYPES.find((t) => t.key === f)?.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#b0a099",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  border: "2.5px solid #fde0cc",
                  borderTop: "2.5px solid #e8641a",
                  borderRadius: "50%",
                  animation: "sdSpin .75s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              <style>{`@keyframes sdSpin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontSize: 13 }}>Loading posts…</div>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  viewBox="0 0 64 64"
                  width="56"
                  height="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="8" y="12" width="48" height="40" rx="6" />
                  <line x1="20" y1="26" x2="44" y2="26" />
                  <line x1="20" y1="34" x2="36" y2="34" />
                </svg>
              </div>
              <div className={styles.emptyText}>Nothing here yet</div>
              <div className={styles.emptyHint}>
                {canPost
                  ? 'Click "Share something" to create the first post.'
                  : "Check back later for updates."}
              </div>
            </div>
          )}

          {/* Posts */}
          {!loading &&
            filtered.map((post) => (
              <div
                key={post._id}
                className={styles.postCard}
                data-type={post.type}
              >
                <div className={styles.postCardHeader}>
                  <div
                    className={styles.avatar}
                    style={{ width: 40, height: 40, fontSize: 13 }}
                  >
                    {initials(post.author)}
                  </div>
                  <div className={styles.postMeta}>
                    <div className={styles.postAuthor}>{post.author}</div>
                    <div className={styles.postTime}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                  <TypeBadge type={post.type} />
                  {canPost && (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginLeft: "auto",
                        paddingLeft: 8,
                      }}
                    >
                      <button
                        className={styles.editBtn}
                        onClick={() => openModal(post.type, post)}
                        title="Edit"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeletingId(post._id)}
                        title="Delete"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.postBody}>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.postContent}>{post.content}</p>
                </div>

                {/* Due date badge */}
                {post.type === "activity" &&
                  post.dueDate &&
                  (() => {
                    const due = formatDueDate(post.dueDate);
                    return (
                      <div
                        className={`${styles.postDueDateBadge} ${due.isOverdue ? styles.postDueDateBadgeOverdue : ""}`}
                      >
                        <FiCalendar size={12} />
                        Due: {due.formatted}
                        {due.isOverdue && (
                          <span className={styles.overdueTag}>Overdue</span>
                        )}
                      </div>
                    );
                  })()}

                {/* Post attachments (faculty-uploaded files) */}
                {post.attachments?.length > 0 && (
                  <>
                    <div className={styles.postDivider} />
                    <div className={styles.postAttachments}>
                      <div className={styles.postAttachmentsLabel}>
                        {post.attachments.length} Attachment
                        {post.attachments.length > 1 ? "s" : ""}
                      </div>
                      {post.attachments.map((a, i) => (
                        <a
                          key={i}
                          href={a.url ? `${API}${a.url}` : undefined}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.attachmentChip}
                          style={{
                            textDecoration: "none",
                            cursor: a.url ? "pointer" : "default",
                          }}
                        >
                          <span className={styles.attachmentIcon}>
                            {getFileIcon(a.name)}
                          </span>
                          {a.name}
                          <span
                            style={{
                              color: "#b0a099",
                              marginLeft: 4,
                              fontSize: 11,
                            }}
                          >
                            {a.size}
                          </span>
                          {a.url && (
                            <FiDownload
                              size={11}
                              style={{ marginLeft: 4, color: "#b0a099" }}
                            />
                          )}
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {/* Submission Bin for activities */}
                {post.type === "activity" && (
                  <>
                    <div className={styles.postDivider} />
                    <SubmissionBin
                      post={post}
                      user={user}
                      userRole={userRole}
                      showToast={showToast}
                    />
                  </>
                )}
              </div>
            ))}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <span className={styles.sideCardTitle}>
                <FiCalendar
                  size={12}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Class Schedule
              </span>
            </div>
            <div className={styles.sideCardBody}>
              <div className={styles.schedItem}>
                <div className={styles.schedDay}>
                  {["MON", "TUE", "WED", "THU", "FRI"][cls?.day ?? 0]}
                </div>
                <div className={styles.schedInfo}>
                  <div className={styles.schedTime}>
                    {cls?.timeLabel ?? "TBA"}
                  </div>
                  <div className={styles.schedRoom}>
                    {cls?.room ?? "No room assigned"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userRole !== "student" && (
            <div className={styles.sideCard}>
              <div className={styles.sideCardHead}>
                <span className={styles.sideCardTitle}>
                  <FiUsers
                    size={12}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Students ({loadingStudents ? "…" : students.length})
                </span>
              </div>
              <div className={styles.sideCardBody}>
                {loadingStudents && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "16px 0",
                      color: "#b0a099",
                      fontSize: 13,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #fde0cc",
                        borderTop: "2px solid #e8641a",
                        borderRadius: "50%",
                        animation: "sdSpin .75s linear infinite",
                        margin: "0 auto 8px",
                      }}
                    />
                    Loading students…
                  </div>
                )}
                {!loadingStudents && students.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "16px 0",
                      color: "#b0a099",
                      fontSize: 13,
                    }}
                  >
                    No students found for this section.
                  </div>
                )}
                {!loadingStudents &&
                  students.map((s) => {
                    const fullName = `${s.firstName} ${s.lastName}`;
                    return (
                      <div
                        key={s._id ?? s.studentId}
                        className={styles.studentItem}
                      >
                        <div className={styles.studentAvatar}>
                          {initials(fullName)}
                        </div>
                        <div>
                          <div className={styles.studentName}>{fullName}</div>
                          <div className={styles.studentId}>{s.studentId}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>
                {editingPost ? "Edit Post" : "Create Post"}
              </span>
              <button className={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalTabs}>
                {POST_TYPES.map((t) => (
                  <button
                    key={t.key}
                    className={`${styles.modalTab} ${activeTab === t.key ? styles.active : ""}`}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.icon()} {t.label}
                  </button>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title *</label>
                <input
                  className={styles.formInput}
                  placeholder="Enter a title..."
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Content *</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Write your message here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                />
              </div>

              {/* Due Date — only for Activity */}
              {activeTab === "activity" && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FiCalendar
                      size={13}
                      style={{ marginRight: 5, verticalAlign: "middle" }}
                    />
                    Due Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                  />
                  {form.dueDate && (
                    <div
                      style={{ fontSize: 12, color: "#b0a099", marginTop: 4 }}
                    >
                      Due:{" "}
                      {new Date(form.dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Attachments (optional)
                </label>
                <div
                  className={styles.fileUpload}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className={styles.fileUploadIcon}>
                    <FiUpload size={26} />
                  </div>
                  <div className={styles.fileUploadText}>
                    <span>Click to upload</span> or drag and drop
                    <br />
                    PDF, DOCX, images, ZIP, and more
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {attachments.map((a, i) => (
                  <div key={i} className={styles.attachedFile}>
                    <span className={styles.attachedFileIcon}>
                      {getFileIcon(a.name)}
                    </span>
                    <span style={{ flex: 1 }}>
                      {a.name}
                      {a.isExisting && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#b0a099",
                            marginLeft: 6,
                          }}
                        >
                          (uploaded)
                        </span>
                      )}
                    </span>
                    <span style={{ color: "#b0a099", fontSize: 12 }}>
                      {a.size}
                    </span>
                    <button
                      className={styles.attachedFileRemove}
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleSubmit}
                disabled={
                  submitting || !form.title.trim() || !form.content.trim()
                }
              >
                {submitting ? (
                  <>
                    <div
                      style={{
                        width: 13,
                        height: 13,
                        border: "2px solid rgba(255,255,255,.4)",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        animation: "sdSpin .7s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                    {editingPost ? "Saving…" : "Posting…"}
                  </>
                ) : editingPost ? (
                  "Save Changes"
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingId && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeletingId(null)}
        >
          <div
            className={styles.modal}
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Delete Post</span>
              <button
                className={styles.modalClose}
                onClick={() => setDeletingId(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div
                style={{
                  background: "#fff5f0",
                  border: "1.5px solid #fde0cc",
                  borderRadius: 12,
                  padding: "16px 18px",
                  fontSize: 14,
                  color: "#5a2a1a",
                  lineHeight: 1.7,
                }}
              >
                ⚠️ This post will be <strong>permanently deleted</strong> and
                cannot be recovered. All student submissions for this activity
                will also be deleted.
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                style={{
                  background: "linear-gradient(135deg,#b91c1c,#dc2626)",
                  boxShadow: "0 3px 12px rgba(185,28,28,.35)",
                }}
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AppToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        duration={3500}
      />
    </div>
  );
};

export default SubjectDetailPage;
