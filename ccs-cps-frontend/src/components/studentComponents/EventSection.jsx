import AppButton from "../../components/ui/AppButton";
import styles from "../../pages/studentPages/studentStyles/EventSection.module.css";

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "CSG- Meeting on January 12, 2025",
    createdAt: "March 2, 2026, 3:45 PM",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel mauris quam. Praesent feugiat, lorem nan fermentum dictum, justo erat volutpat libero, nec tristique nisl nunc at tortor.",
    attachment: { name: "CSG-Meeting.pdf", url: "#" },
  },
];

export default function EventsSection({ events = SAMPLE_EVENTS, onShowMore }) {
  return (
    <div className={styles.eventsCard}>
      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <i
            className="bi bi-calendar-x"
            style={{ fontSize: 28, opacity: 0.3, display: "block", marginBottom: 8 }}
          />
          No events available at the moment.
        </div>
      ) : (
        events.map((event) => (
          <div key={event.id} className={styles.eventItem}>
            <div className={styles.eventTopRow}>
              <p className={styles.eventTitle}>{event.title}</p>
              <span className={styles.eventMeta}>Created at: {event.createdAt}</span>
            </div>

            <p className={styles.eventBody}>{event.body}</p>

            {event.attachment && (
              /* PDF pill — AppButton primary md, opens the file */
              <AppButton
                variant="primary"
                size="md"
                onClick={() => window.open(event.attachment.url, "_blank")}
              >
                <i className="bi bi-file-earmark-pdf-fill" style={{ marginRight: 6 }} />
                {event.attachment.name}
              </AppButton>
            )}
          </div>
        ))
      )}

      {/* Show More — AppButton outline md, centered */}
      <div className={styles.showMoreWrap}>
        <AppButton
          variant="primary"
          size="md"
          onClick={onShowMore}
        >
          SHOW MORE
        </AppButton>
      </div>
    </div>
  );
}