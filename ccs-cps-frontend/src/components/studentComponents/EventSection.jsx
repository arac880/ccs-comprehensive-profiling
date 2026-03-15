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

export default function EventsSection({ events = SAMPLE_EVENTS }) {
  return (
    <div>
      {/* Section header row */}
      <div className={styles.sectionHeader}>
        <i className={`bi bi-calendar-event-fill ${styles.sectionIcon}`} />
        <h6 className={styles.sectionTitle}>Events</h6>
      </div>

      {/* White card wrapping all events */}
      <div className={styles.eventsCard}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventItem}>
            {/* Title + timestamp row */}
            <div className={styles.eventTopRow}>
              <p className={styles.eventTitle}>{event.title}</p>
              <span className={styles.eventMeta}>
                Created at: {event.createdAt}
              </span>
            </div>

            {/* Body text */}
            <p className={styles.eventBody}>{event.body}</p>

            {/* PDF attachment pill */}
            {event.attachment && (
              <a
                href={event.attachment.url}
                className={styles.attachmentPill}
                target="_blank"
                rel="noreferrer"
              >
                <i
                  className={`bi bi-file-earmark-pdf-fill ${styles.attachmentIcon}`}
                />
                {event.attachment.name}
              </a>
            )}
          </div>
        ))}

        {/* Show More */}
        <div className={styles.showMoreWrap}>
          <button className={styles.showMoreBtn}>SHOW MORE</button>
        </div>
      </div>
    </div>
  );
}
