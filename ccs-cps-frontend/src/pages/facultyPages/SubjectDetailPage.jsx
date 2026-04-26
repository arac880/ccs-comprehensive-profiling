import React, { useState, useRef } from "react";
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
  FiThumbsUp,
  FiMessageSquare,
  FiShare2,
  FiTrash2,
  FiFileText,
  FiImage,
  FiFile,
  FiBell,
  FiActivity,
  FiBookOpen,
  FiFolder,
  FiCalendar,
  FiZap,
  FiLayers,
} from "react-icons/fi";
import { useEffect } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getUserRole = () => {
  try {
    return localStorage.getItem("role");
  } catch {
    return null;
  }
};

const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FiFileText style={{ color: "#c0390a" }} />;
  if (["doc", "docx"].includes(ext))
    return <FiFileText style={{ color: "#185fa5" }} />;
  if (["jpg", "jpeg", "png", "gif"].includes(ext))
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

// icon is a render function so JSX can be used outside component scope
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
  {
    key: "material",
    label: "Material",
    icon: () => <FiFolder size={13} />,
    badge: "badgeMaterial",
  },
];

const SAMPLE_STUDENTS = [
  { id: "2201001", name: "Anna Reyes" },
  { id: "2201002", name: "Ben Santos" },
  { id: "2201003", name: "Cara Lim" },
  { id: "2201004", name: "Dan Cruz" },
  { id: "2201005", name: "Eva Gomez" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SubjectDetailPage = ({ cls, onBack }) => {
 
  const userRole = getUserRole();
  const user = getUser();
  const canPost = ["dean", "chair", "faculty"].includes(userRole);

  const authorName = user ? `${user.firstName} ${user.lastName}` : "Instructor";
  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // ── State ────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "announcement",
      title: "Welcome to the Class!",
      content:
        "Hello everyone! This is your class board for this subject. Please check here regularly for updates, activities, and learning materials. Looking forward to a great semester with all of you.",
      author: authorName,
      createdAt: new Date(Date.now() - 3600000 * 2),
      attachments: [],
    },
    {
      id: 2,
      type: "lesson",
      title: "Week 1 — Introduction to the Subject",
      content:
        "Please review the attached slides and reading materials before our next session. We will be covering the foundational concepts, historical background, and core principles that will frame the entire course.",
      author: authorName,
      createdAt: new Date(Date.now() - 86400000),
      attachments: [
        { name: "Week1_Slides.pdf", size: "2.4 MB" },
        { name: "Intro_Reading.docx", size: "540 KB" },
      ],
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("announcement");
  const [form, setForm] = useState({ title: "", content: "" });
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openModal = (tab = "announcement") => {
    setActiveTab(tab);
    setForm({ title: "", content: "" });
    setAttachments([]);
    setShowModal(true);
  };

  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mapped = files.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      file: f,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

const handleSubmit = async () => {
  if (!form.title.trim() || !form.content.trim()) return;

  setSubmitting(true);

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        type: activeTab,
        subjectId: cls?._id,
        author: authorName,
        attachments: attachments.map(({ name, size }) => ({ name, size })),
      }),
    });

    const newPost = await res.json();

    setPosts((prev) => [newPost, ...prev]);
    setShowModal(false);
  } catch (err) {
    console.error(err);
  }

  setSubmitting(false);
};

 const deletePost = async (id) => {
   try {
     await fetch(`http://localhost:5000/api/posts/${id}`, {
       method: "DELETE",
     });

     setPosts((prev) => prev.filter((p) => p._id !== id));
   } catch (err) {
     console.error(err);
   }
 };

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  // ── Type Badge ────────────────────────────────────────────────────────────
  const TypeBadge = ({ type }) => {
    const t = POST_TYPES.find((x) => x.key === type) || POST_TYPES[0];
    return (
      <span className={`${styles.postTypeBadge} ${styles[t.badge]}`}>
        {t.icon()} {t.label}
      </span>
    );
  };

 

  useEffect(() => {
    if (!cls?._id) return;

    fetch(`http://localhost:5000/api/posts/${cls._id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [cls]);
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <button className={styles.heroBack} onClick={onBack}>
          <FiArrowLeft size={13} /> Back to Schedule
        </button>
        <div className={styles.heroBadge}>
          <FiLayers size={11} /> {cls?.type ?? "Subject"}
        </div>
        <h1 className={styles.heroTitle}>{cls?.title ?? "Subject Title"}</h1>
        <p className={styles.heroSub}>{cls?.sub ?? "Section"}</p>
        <div className={styles.heroMeta}>
          <span className={styles.heroMetaItem}>
            <FiClock size={14} /> {cls?.timeLabel ?? "TBA"}
          </span>
          <span className={styles.heroMetaItem}>
            <FiMapPin size={14} /> {cls?.room ?? "TBA"}
          </span>
          <span className={styles.heroMetaItem}>
            <FiUsers size={14} /> {SAMPLE_STUDENTS.length} Students
          </span>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
            <FiAlertCircle />
          </div>
          <div>
            <div className={styles.statNum}>
              {posts.filter((p) => p.type === "announcement").length}
            </div>
            <div className={styles.statLbl}>Announcements</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <FiBook />
          </div>
          <div>
            <div className={styles.statNum}>
              {posts.filter((p) => p.type === "lesson").length}
            </div>
            <div className={styles.statLbl}>Lessons</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <FiCheckSquare />
          </div>
          <div>
            <div className={styles.statNum}>
              {posts.filter((p) => p.type === "activity").length}
            </div>
            <div className={styles.statLbl}>Activities</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAmber}`}>
            <FiPaperclip />
          </div>
          <div>
            <div className={styles.statNum}>
              {posts.reduce((a, p) => a + p.attachments.length, 0)}
            </div>
            <div className={styles.statLbl}>Files</div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Feed */}
        <div>
          {/* Create Post Box */}
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

          {/* Filter Bar */}
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

          {/* Posts */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  viewBox="0 0 64 64"
                  width="52"
                  height="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="8" y="12" width="48" height="40" rx="4" />
                  <line x1="20" y1="26" x2="44" y2="26" />
                  <line x1="20" y1="34" x2="36" y2="34" />
                </svg>
              </div>
              <div className={styles.emptyText}>No posts yet</div>
              <div className={styles.emptyHint}>
                {canPost
                  ? 'Click "Share something" to create the first post.'
                  : "Check back later for updates."}
              </div>
            </div>
          ) : (
            filtered.map((post) => (
              <div key={post._id} className={styles.postCard}>
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
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deletePost(post._id)}
                      title="Delete post"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>

                <div className={styles.postBody}>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.postContent}>{post.content}</p>
                </div>

                {post.attachments.length > 0 && (
                  <>
                    <div className={styles.postDivider} />
                    <div className={styles.postAttachments}>
                      <div className={styles.postAttachmentsLabel}>
                        Attachments
                      </div>
                      {post.attachments.map((a, i) => (
                        <span key={i} className={styles.attachmentChip}>
                          <span className={styles.attachmentIcon}>
                            {getFileIcon(a.name)}
                          </span>
                          {a.name}
                          <span
                            style={{
                              color: "#a89388",
                              marginLeft: 2,
                              fontSize: 11,
                            }}
                          >
                            {a.size}
                          </span>
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className={styles.postFooter}>
                  <button className={styles.postAction}>
                    <FiThumbsUp size={13} /> Like
                  </button>
                  <button className={styles.postAction}>
                    <FiMessageSquare size={13} /> Comment
                  </button>
                  <button className={styles.postAction}>
                    <FiShare2 size={13} /> Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Schedule Info */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <span className={styles.sideCardTitle}>
                <FiCalendar
                  size={13}
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

          {/* Students */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <span className={styles.sideCardTitle}>
                <FiUsers
                  size={13}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Students ({SAMPLE_STUDENTS.length})
              </span>
              <span className={styles.sideCardMore}>View all</span>
            </div>
            <div className={styles.sideCardBody}>
              {SAMPLE_STUDENTS.map((s) => (
                <div key={s.id} className={styles.studentItem}>
                  <div className={styles.studentAvatar}>{initials(s.name)}</div>
                  <div>
                    <div className={styles.studentName}>{s.name}</div>
                    <div className={styles.studentId}>{s.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {canPost && (
            <div className={styles.sideCard}>
              <div className={styles.sideCardHead}>
                <span className={styles.sideCardTitle}>
                  <FiZap
                    size={13}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Quick Post
                </span>
              </div>
              <div
                className={styles.sideCardBody}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {POST_TYPES.map((t) => (
                  <button
                    key={t.key}
                    className={styles.createAction}
                    style={{
                      justifyContent: "flex-start",
                      width: "100%",
                      borderRadius: 10,
                    }}
                    onClick={() => openModal(t.key)}
                  >
                    {t.icon()} {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Post Modal ── */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Create Post</span>
              <button
                className={styles.modalClose}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Type tabs */}
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

              {/* Title */}
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

              {/* Content */}
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

              {/* File Upload */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Attachments (optional)
                </label>
                <div
                  className={styles.fileUpload}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className={styles.fileUploadIcon}>
                    <FiUpload size={28} />
                  </div>
                  <div className={styles.fileUploadText}>
                    <span>Click to upload</span> or drag and drop
                    <br />
                    PDF, DOCX, images, and more
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
                    <span style={{ flex: 1 }}>{a.name}</span>
                    <span style={{ color: "#a89388", fontSize: 12 }}>
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
              <button
                className={styles.btnSecondary}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleSubmit}
                disabled={
                  submitting || !form.title.trim() || !form.content.trim()
                }
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDetailPage;
