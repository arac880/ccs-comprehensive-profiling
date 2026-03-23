import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBarNav from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";
import Footer from "../../components/studentComponents/Footer";
import SearchBar from "../../components/ui/SearchBar";
import TitlePages from "../../components/ui/TitlePages";
import ResearchCard from "../../components/studentComponents/ResearchCard";
import styles from "./studentStyles/collegeResearch.module.css";
import { FaSearch } from "react-icons/fa";
import { PiBookOpenTextFill } from "react-icons/pi";

const MOBILE_BREAKPOINT = 992;

// Google Drive PDF links format:
// View:     https://drive.google.com/file/d/FILE_ID/view
// Direct:   https://drive.google.com/uc?export=download&id=FILE_ID
// Replace FILE_ID with the actual ID from your Google Drive share link.

const ALL_RESEARCH = [
  { id: 1,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_1/view" },
  { id: 2,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_2/view" },
  { id: 3,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_3/view" },
  { id: 4,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_4/view" },
  { id: 5,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_5/view" },
  { id: 6,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_6/view" },
  { id: 7,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_7/view" },
  { id: 8,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_8/view" },
  { id: 9,  title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_9/view" },
  { id: 10, title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_10/view" },
  { id: 11, title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_11/view" },
  { id: 12, title: "Web-Based Delivery Tracking",  uploadedAt: "March 2, 2026, 3:45 PM", fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_12/view" },
];

export default function CollegeResearch() {
  const navigate = useNavigate();
  const [search, setSearch]   = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = () => navigate("/");

  const filtered = ALL_RESEARCH.filter(
    (r) =>
      search.trim() === "" ||
      r.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Shared page body ───────────────────────────────────── */
  const ResearchContent = () => (
    <div className={styles.researchContainer}>
      {/* White card */}
      <div className={styles.researchCard}>
        {/* Header row */}
        <div className={styles.cardHeader}>
          <TitlePages
            icon={<PiBookOpenTextFill size={22} color="#ffffff" />}
            title="College Research"
            iconBg="#E65100"
            textColor="#a34100"
          />
          <div className={styles.cardControls}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search a research"
            />
          </div>
        </div>

        {/* Grid or empty state */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((r) => (
              <ResearchCard
                key={r.id}
                title={r.title}
                uploadedAt={r.uploadedAt}
                fileUrl={r.fileUrl}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <FaSearch size={32} color="#e0b49a" />
            <p>No research found.</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Mobile layout ──────────────────────────────────────── */
  if (isMobile) {
    return (
      <>
        <SideBarNav activeNav="CollegeResearch" />
        <main className={styles.mobileMain}>
          <ResearchContent />
        </main>
        <Footer />
      </>
    );
  }

  /* ── Desktop layout ─────────────────────────────────────── */
  return (
    <div className={styles.dashboardWrapper}>
      <SideBarNav activeNav="CollegeResearch" />
      <div className={styles.rightColumn}>
        <TopBarNav onSignOut={handleSignOut} />
        <main className={styles.mainContent}>
          <ResearchContent />
        </main>
        <Footer />
      </div>
    </div>
  );
}