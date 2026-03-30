import { useState } from "react";
import SideNavbar from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";
import CalendarWidget from "../../components/ui/CalendarWidget";
import CcsLinks from "../../components/studentComponents/CcsLinks";
import EventSection from "../../components/studentComponents/EventSection";
import SearchBar from "../../components/ui/SearchBar";
import FilterDropdown from "../../components/ui/FilterDropdown";
import TitlePages from "../../components/ui/TitlePages";
import Footer from "../../components/studentComponents/Footer";
import styles from "./studentStyles/event.module.css";
import { FaCalendarAlt } from "react-icons/fa";

const ALL_EVENTS = [
  {
    id: 1,
    title: "CSG- Meeting on January 12, 2025",
    createdAt: "March 2, 2026, 3:45 PM",
    date: "April 10, 2026",
    status: "Upcoming",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel mauris quam. Praesent feugiat, lorem non fermentum dictum, justo erat volutpat libero, nec tristique nisl nunc at tortor.",
    attachment: { name: "CSG-Meeting.pdf", url: "#" },
  },
  {
    id: 2,
    title: "CCS Night (General Assembly) 2026",
    createdAt: "March 8, 2026, 8:00 AM",
    date: "April 10, 2026",
    status: "Upcoming",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem vitae justo at sapien facilisis bibendum. Integer vehicula, lorem a hendrerit varius, risus elit ultrices neque, at dignissim libero sapien nec erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.\n\nCurabitur non lorem vel orci pulvinar tincidunt. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel mauris quam. Praesent feugiat, lorem non fermentum dictum, justo erat volutpat libero, nec tristique nisl nunc at tortor.",
    attachment: { name: "CCS NIGHT - GEN.ASSEM.pdf", url: "#" },
  },
];

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

  return (
    <div className={styles.pageRoot}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebarArea}>
        <SideNavbar activeNav="Events" />{" "}
      </aside>

      {/* ── Main column ── */}
      <div className={styles.mainCol}>
        <TopBarNav />

        {/* Scrollable content area */}
        <div className={styles.scrollArea}>
          <div className={styles.contentRow}>
            {/* ── Events column ── */}
            <main className={styles.eventsCol}>
              <div className={styles.eventsCard}>
                {/* Card header: TitlePages left, controls right */}
                <div className={styles.cardHeader}>
                  <TitlePages
                    icon={<FaCalendarAlt size={22} color="#ffffff" />}
                    title="Events"
                    iconBg="#E65100"
                    textColor="#a34100"
                  />
                  <div className={styles.cardControls}>
                    <FilterDropdown
                      value={filter}
                      onChange={setFilter}
                      options={["All Events", "Upcoming", "Past"]}
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

                {/* Events list — no Show More */}
                <EventSection events={filtered} showMore={false} />
              </div>
            </main>

            {/* ── Right column ── */}
            <aside className={styles.rightCol}>
              <CalendarWidget />
              <div className={styles.ccsLinksFixed}>
                <CcsLinks />
              </div>
            </aside>
          </div>
        </div>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </div>
  );
}
