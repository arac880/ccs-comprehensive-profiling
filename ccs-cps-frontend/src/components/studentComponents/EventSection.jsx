import AppButton from "../../components/ui/AppButton";
import styles from "../../pages/studentPages/studentStyles/EventSection.module.css";
import { BsArrowRight } from "react-icons/bs"; 

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "CSG- Meeting on January 12, 2025",
    createdAt: "March 2, 2026, 3:45 PM",
    month: "JAN",
    day: "12",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci.",
    attachment: { name: "CSG-Meeting.pdf", url: "#" },
    status: "Upcoming"
  },
];

export default function EventsSection({ events = SAMPLE_EVENTS, onShowMore, showMore = true }) {
  return (
    <div className={styles.eventsCard}>
      <div className={styles.eventsContainer}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="bi bi-calendar-x" style={{ fontSize: 32, opacity: 0.2, display: "block", marginBottom: 12 }} />
            <p>No upcoming events.</p>
          </div>
        ) : (
          <div className={styles.timelineList}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventItem}>
                
                {/* Visual Date Block */}
                <div className={styles.dateBlock}>
                  <span className={styles.dateMonth}>{event.month}</span>
                  <span className={styles.dateDay}>{event.day}</span>
                </div>

                {/* Event Content */}
                <div className={styles.eventContent}>
                  <div className={styles.eventHeader}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    {event.status && (
                      <span className={styles.eventBadge}>{event.status}</span>
                    )}
                  </div>
                  
                  <span className={styles.eventMeta}>Posted: {event.createdAt}</span>
                  <p className={styles.eventBody}>{event.body}</p>

                  {event.attachment && (
                    <div className={styles.attachmentWrap}>
                      <button className={styles.attachmentBtn} onClick={() => window.open(event.attachment.url, "_blank")}>
                        <i className="bi bi-file-earmark-pdf-fill" />
                        {event.attachment.name}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sleek Bottom Action Bar */}
      {showMore && (
        <div className={styles.actionBar} onClick={onShowMore}>
          <span className={styles.actionText}>View All Events</span>
          <BsArrowRight className={styles.actionIcon} />
        </div>
      )}
    </div>
  );
}