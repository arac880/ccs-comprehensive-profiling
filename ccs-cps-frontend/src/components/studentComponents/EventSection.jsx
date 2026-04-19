import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../pages/studentPages/studentStyles/EventSection.module.css";
import { BsArrowRight } from "react-icons/bs";

function parseDateParts(dateStr) {
  if (!dateStr) return { month: "—", day: "—" };
  const d = new Date(dateStr);
  if (isNaN(d)) return { month: "—", day: "—" };
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

function getBadgeClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "upcoming") return styles.badgeUpcoming;
  if (s === "past") return styles.badgePast;
  if (s === "ongoing") return styles.badgeOngoing;
  return styles.badgeUpcoming;
}

function getDriveFileId(link) {
  if (!link) return null;

  const match = link.match(/\/d\/([^/]+)/);
  return match ? match[1] : null;
}

function getDrivePreviewLink(link) {
  const id = getDriveFileId(link);
  if (!id) return null;

  return `https://drive.google.com/file/d/${id}/preview`;
}

function getDriveFileName(link) {
  if (!link) return "View PDF";

  const match = link.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `PDF File (${match[1].slice(0, 6)})`;
  }

  return "View PDF";
}

function EventItem({ event, onPreview }) {
  const [expanded, setExpanded] = useState(false);

  const { month, day } =
    event.month && event.day
      ? { month: event.month, day: event.day }
      : parseDateParts(event.date);

  const body = event.body || "";
  const isLong = body.length > 280 || body.split("\n").length > 3;

  return (
    <div className={styles.eventItem}>
      <div className={styles.dateBlock}>
        <span className={styles.dateMonth}>{month}</span>
        <span className={styles.dateDay}>{day}</span>
      </div>

      <div className={styles.eventContent}>
        <div className={styles.eventHeader}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          {event.status && (
            <span
              className={`${styles.eventBadge} ${getBadgeClass(event.status)}`}
            >
              {event.status}
            </span>
          )}
        </div>

        <div className={styles.eventMeta}>
          <span>Posted: {event.createdAt}</span>
          {event.date && (
            <>
              <span className={styles.metaDot} />
              <span>{event.date}</span>
            </>
          )}
        </div>

        <p
          className={`${styles.eventBody} ${isLong && !expanded ? styles.eventBodyCollapsed : ""}`}
        >
          {body}
        </p>

        {isLong && (
          <button
            className={styles.readMoreBtn}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}

        <div className={styles.eventFooter}>
          {event.driveLink && (
            <button
              className={styles.previewBtn}
              onClick={() => {
                const link = getDrivePreviewLink(event.driveLink);

                console.log("PDF LINK:", link); // 👈 DEBUG

                if (onPreview && link) {
                  onPreview(link);
                }
              }}
            >
              <i className="bi bi-file-earmark-pdf-fill" />
              <span>{getDriveFileName(event.driveLink)}</span>
            </button>
          )}
          {event.date && (
            <span className={styles.eventDate}>
              <i className="bi bi-calendar3" style={{ marginRight: 5 }} />
              {event.date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "CSG — Meeting on January 12, 2025",
    createdAt: "March 2, 2026, 3:45 PM",
    month: "JAN",
    day: "12",
    date: "April 10, 2026",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci.",
    attachment: { name: "CSG-Meeting.pdf", url: "#" },
    status: "Upcoming",
  },
];

export default function EventsSection({
  events = [],
  showMore = true,
  onPreview,
}) {
  return (
    <div className={styles.eventsCard}>
      <div className={styles.eventsContainer}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <i
              className="bi bi-calendar-x"
              style={{
                fontSize: 36,
                opacity: 0.18,
                display: "block",
                marginBottom: 14,
              }}
            />
            <p>No events found.</p>
          </div>
        ) : (
          <div className={styles.timelineList}>
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {showMore && (
        <Link to="/student/events" className={styles.actionBar}>
          <span className={styles.actionText}>View All Events</span>
          <BsArrowRight className={styles.actionIcon} />
        </Link>
      )}
    </div>
  );
}
