// pages/facultyPages/FacultyProfile.jsx
import { useState } from "react";
import FacultyProfileCard from "../../components/facultyComponents/facultyProfileCard";
import FacultyTabPersonal from "../../components/facultyComponents/facultyTabPersonal";
import FacultyTabSecurity from "../../components/facultyComponents/facultyTabSecurity";
import TitlePages from "../../components/ui/TitlePages";
import { FaChalkboardTeacher } from "react-icons/fa";
import styles from "../studentPages/studentStyles/Profile.module.css";

const TABS = [
  { key: "personal", label: "Personal Information" },
  { key: "security", label: "Account Security" },
];

export default function FacultyProfile() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderTab = () => {
    switch (activeTab) {
      case "personal":
        return <FacultyTabPersonal />;
      case "security":
        return <FacultyTabSecurity />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.scrollArea}>
        <TitlePages
          icon={<FaChalkboardTeacher size={18} color="#ffffff" />}
          title="My Profile"
          iconBg="#E65100"
          textColor="#a34100"
        />

        {/* Profile banner */}
        <FacultyProfileCard />

        {/* Tab content */}
        <div className={styles.contentArea}>
          <div className={styles.tabBar}>
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`${styles.tabBtn} ${
                  activeTab === t.key ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.panel}>{renderTab()}</div>
        </div>
      </div>
    </div>
  );
}
