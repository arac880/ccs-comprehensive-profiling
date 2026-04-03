import { useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import TitlePages from "../../components/ui/TitlePages";
import ResearchCard from "../../components/studentComponents/ResearchCard";
import styles from "./studentStyles/collegeResearch.module.css";
import { FaSearch } from "react-icons/fa";
import { PiBookOpenTextFill } from "react-icons/pi";

// Sample data (replace with backend later)
const ALL_RESEARCH = [
  {
    id: 1,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_1/view",
  },
  {
    id: 2,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_2/view",
  },
  {
    id: 3,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_3/view",
  },
  {
    id: 4,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_4/view",
  },
  {
    id: 5,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_5/view",
  },
  {
    id: 6,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_6/view",
  },
  {
    id: 7,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_7/view",
  },
  {
    id: 8,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_8/view",
  },
  {
    id: 9,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_9/view",
  },
  {
    id: 10,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_10/view",
  },
  {
    id: 11,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_11/view",
  },
  {
    id: 12,
    title: "Web-Based Delivery Tracking",
    uploadedAt: "March 2, 2026, 3:45 PM",
    fileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID_12/view",
  },
];

export default function CollegeResearch() {
  const [search, setSearch] = useState("");

  // Filter logic
  const filteredResearch = ALL_RESEARCH.filter((research) =>
    research.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.researchContainer}>
        <div className={styles.researchCard}>
          
          {/* Header */}
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

          {/* Content */}
          {filteredResearch.length > 0 ? (
            <div className={styles.grid}>
              {filteredResearch.map((research) => (
                <ResearchCard
                  key={research.id}
                  title={research.title}
                  uploadedAt={research.uploadedAt}
                  fileUrl={research.fileUrl}
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
    </main>
  );
}