import { useState, useEffect } from "react";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CcsLinks from "../../components/studentComponents/CcsLinks";
import EventSection from "../../components/studentComponents/EventSection";
import SearchBar from "../../components/ui/SearchBar";
import FilterDropdown from "../../components/ui/FilterDropdown";
import styles from "./studentStyles/event.module.css";
import { FaCalendarAlt } from "react-icons/fa";

const FILTER_OPTIONS = ["All Events", "Upcoming", "Ongoing", "Past"];

export default function StudentEvents() {
  const [filter, setFilter] = useState("All Events");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLink, setPreviewLink] = useState(null);

  function handlePreview(link) {
    if (!link) return;
    setPreviewLink(link);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const data = await res.json();

        // 🔥 map backend → frontend format
        const mapped = (Array.isArray(data) ? data : []).map((e, i) => {
          const eventDate = new Date(e.date);

          const today = new Date();
          const status = eventDate < today ? "Past" : "Upcoming";

          return {
            id: e._id || i,
            title: e.title,
            createdAt: new Date(e.createdAt).toLocaleString(),
            date: eventDate.toDateString(),
            month: e.month,
            day: e.day,
            status,
            body: e.description || "",
            driveLink: e.driveLink || null,
            location: e.location,
            time: e.time,
            type: e.type,
          };
        });

        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = events.filter((ev) => {
    const matchFilter = filter === "All Events" || ev.status === filter;

    const matchSearch =
      search.trim() === "" ||
      ev.title.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;
  const pastCount = events.filter((e) => e.status === "Past").length;

  return (
    <div className={styles.pageRoot}>
      <div className={styles.scrollArea}>
        <div className={styles.contentRow}>
          {/* ── Events column ── */}
          <main className={styles.eventsCol}>
            <div className={styles.pageHeader}>
              <div className={styles.pageTitleWrap}>
                <div className={styles.pageTitleIcon}>
                  <FaCalendarAlt size={18} color="#ffffff" />
                </div>
                <h2 className={styles.pageTitle}>Events</h2>
              </div>

              <div className={styles.statsStrip}>
                <span
                  className={`${styles.statPill} ${styles.statPillNeutral}`}
                >
                  {events.length} Total
                </span>
                <span className={`${styles.statPill} ${styles.statPillOrange}`}>
                  {upcomingCount} Upcoming
                </span>
                {pastCount > 0 && (
                  <span
                    className={`${styles.statPill} ${styles.statPillNeutral}`}
                  >
                    {pastCount} Past
                  </span>
                )}
              </div>
            </div>

            <div className={styles.eventsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}></div>
                <div className={styles.cardControls}>
                  <FilterDropdown
                    value={filter}
                    onChange={setFilter}
                    options={FILTER_OPTIONS}
                    label="SHOW EVENTS"
                    placeholder="All Events"
                  />
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search an event"
                  />
                </div>
              </div>

              {(search.trim() !== "" || filter !== "All Events") && (
                <p className={styles.resultsLabel}>
                  {filtered.length === 0
                    ? "No results found"
                    : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
                </p>
              )}

              {loading ? (
                <p>Loading events...</p>
              ) : (
                <EventSection
                  events={filtered}
                  showMore={false}
                  onPreview={handlePreview}
                />
              )}
            </div>
          </main>

          <aside className={styles.rightCol}>
            <CalendarWidget />
            <div className={styles.ccsLinksFixed}>
              <CcsLinks />
            </div>
          </aside>
        </div>
      </div>
      {previewLink && (
        <div
          className={styles.pdfModalOverlay}
          onClick={() => setPreviewLink(null)}
        >
          <div
            className={styles.pdfModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.pdfHeader}>
              <button
                className={styles.pdfCloseBtn}
                onClick={() => setPreviewLink(null)}
              >
                ✕
              </button>
            </div>

            <iframe src={previewLink} className={styles.pdfFrame} />
          </div>
        </div>
      )}
    </div>
  );
}
