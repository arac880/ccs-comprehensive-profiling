import { useState } from "react";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CcsLinks from "../../components/studentComponents/CcsLinks";
import EventSection from "../../components/studentComponents/EventSection";
import SearchBar from "../../components/ui/SearchBar";
import FilterDropdown from "../../components/ui/FilterDropdown";
import styles from "./studentStyles/event.module.css";
import { FaCalendarAlt } from "react-icons/fa";

const ALL_EVENTS = [
  {
    id: 1,
    title: "CSG — Meeting on January 12, 2025",
    createdAt: "March 2, 2026, 3:45 PM",
    date: "April 10, 2026",
    month: "JAN",
    day: "12",
    status: "Past",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel mauris quam.",
    attachment: { name: "CSG-Meeting.pdf", url: "#" },
  },
  {
    id: 2,
    title: "CCS Night (General Assembly) 2026",
    createdAt: "March 8, 2026, 8:00 AM",
    date: "April 10, 2026",
    month: "APR",
    day: "10",
    status: "Upcoming",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel mauris quam.",
    attachment: { name: "CCS NIGHT - GEN.ASSEM.pdf", url: "#" },
  },
];

const FILTER_OPTIONS = ["All Events", "Upcoming", "Ongoing", "Past"];

export default function StudentEvents() {
  const [filter, setFilter] = useState("All Events");
  const [search, setSearch] = useState("");

  const filtered = ALL_EVENTS.filter((ev) => {
    const matchFilter = filter === "All Events" || ev.status === filter;
    const matchSearch =
      search.trim() === "" ||
      ev.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const upcomingCount = ALL_EVENTS.filter((e) => e.status === "Upcoming").length;
  const pastCount     = ALL_EVENTS.filter((e) => e.status === "Past").length;

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
                <span className={`${styles.statPill} ${styles.statPillNeutral}`}>
                  {ALL_EVENTS.length} Total
                </span>
                <span className={`${styles.statPill} ${styles.statPillOrange}`}>
                  {upcomingCount} Upcoming
                </span>
                {pastCount > 0 && (
                  <span className={`${styles.statPill} ${styles.statPillNeutral}`}>
                    {pastCount} Past
                  </span>
                )}
              </div>
            </div>

            <div className={styles.eventsCard}>

              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  
                </div>
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

              <EventSection events={filtered} showMore={false} />
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
    </div>
  );
}