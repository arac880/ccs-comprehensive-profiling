// pages/studentProfile.jsx
import { useState } from "react";
import SideNavbar from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";
import Footer from "../../components/studentComponents/Footer";

import ProfileCard from "../../components/studentComponents/ProfileCard";
import TabPersonal from "../../components/studentComponents/TabPersonal";
import TabAcademic from "../../components/studentComponents/TabAcademic";
import TabNonAcademic from "../../components/studentComponents/TabNonAcademic";
import TabViolations from "../../components/studentComponents/TabViolations";
import TabSkills from "../../components/studentComponents/TabSkills";
import TabAffiliations from "../../components/studentComponents/TabAffiliations";
import TabSecurity from "../../components/studentComponents/TabSecurity";

import TitlePages from "../../components/ui/TitlePages";
import { FaUserAlt } from "react-icons/fa";
import styles from "./studentStyles/Profile.module.css";

/* ═══════════════════════════════════════════
   STUDENT DATA
═══════════════════════════════════════════ */
const STUDENT = {
  studentNumber: "2001518",
  type: "Regular", // Regular | Irregular | Dropout | LOA | Graduated
  yearLevel: "4th Year",
  section: "4IT-D",
  civilStatus: "Single",
  fullName: "Jessa V. Cariñaga",
  firstName: "Jessa",
  middleInitial: "V.",
  lastName: "Cariñaga",
  nationality: "Filipino",
  religion: "Roman Catholic",
  residency: "Non-Cabutao",
  dateOfBirth: "March 19, 2004",
  placeOfBirth: "Santa Rosa, Laguna",
  age: 21,
  gender: "Female",
  address: "Blk 4 Lot 12, Sampaguita St., Santa Rosa, Laguna",
  contactNumber: "+63 912 345 6789",
  email: "jessa.carinaga@ccs.edu.ph",
  guardianName: "Maria V. Cariñaga",
  guardianRelation: "Mother",
  guardianContact: "+63 918 765 4321",
  program: "Bachelor of Science in Information Technology",
  studentStatus: "Enrolled",
  studentAssistantship: "None",
  grantee: "No",
  // Mother
  motherName: "Maria V. Cariñaga",
  motherOccupation: "Teacher",
  motherContact: "+63 918 765 4321",
  motherEmail: "maria.carinaga@gmail.com",
  motherEducation: "Bachelor of Secondary Education",
  // Father
  fatherName: "Roberto C. Cariñaga",
  fatherOccupation: "Engineer",
  fatherContact: "+63 917 234 5678",
  fatherEmail: "roberto.carinaga@gmail.com",
  fatherEducation: "Bachelor of Science in Civil Engineering",

  lastPasswordChange: "January 5, 2026",
  twoFAEnabled: false,
};

const ACADEMIC_HISTORY = [
  {
    schoolYear: "S.Y. 2025–2026",
    yearLevel: "4th Year",
    semester: "1st Semester",
    section: "4IT-D",
    gwa: "1.45",
    standing: "Dean's List",
    latin: "Magna Cum Laude",
    subjects: [
      {
        code: "IT401",
        name: "Capstone Project 1",
        units: 3,
        grade: "1.25",
        remarks: "Passed",
      },
      {
        code: "IT402",
        name: "Cloud Computing",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT403",
        name: "Artificial Intelligence",
        units: 3,
        grade: "1.25",
        remarks: "Passed",
      },
      {
        code: "IT404",
        name: "IT Service Management",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT405",
        name: "Elective 1: Machine Learning",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2024–2025",
    yearLevel: "3rd Year",
    semester: "2nd Semester",
    section: "3IT-B",
    gwa: "1.52",
    standing: "Dean's List",
    latin: "Magna Cum Laude",
    subjects: [
      {
        code: "IT307",
        name: "Software Engineering 2",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT308",
        name: "Systems Administration",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT309",
        name: "Network Security",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT310",
        name: "IT Research Methods",
        units: 3,
        grade: "1.25",
        remarks: "Passed",
      },
      {
        code: "IT311",
        name: "Practicum / OJT",
        units: 6,
        grade: "1.25",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2024–2025",
    yearLevel: "3rd Year",
    semester: "1st Semester",
    section: "3IT-B",
    gwa: "1.58",
    standing: "Dean's List",
    subjects: [
      {
        code: "IT301",
        name: "Mobile Application Development",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT302",
        name: "Software Engineering 1",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT303",
        name: "Information Assurance & Security",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT304",
        name: "Social & Professional Issues in IT",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT305",
        name: "Integrative Programming & Technology",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT306",
        name: "Technopreneurship",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2023–2024",
    yearLevel: "2nd Year",
    semester: "2nd Semester",
    section: "2IT-A",
    gwa: "1.75",
    standing: "Dean's List",
    subjects: [
      {
        code: "IT205",
        name: "System Analysis & Design",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT206",
        name: "Web Development 2",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "IT207",
        name: "Operating Systems",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT208",
        name: "Human Computer Interaction",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT209",
        name: "Advanced Database Systems",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "PE202",
        name: "Physical Education 4",
        units: 2,
        grade: "1.25",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2023–2024",
    yearLevel: "2nd Year",
    semester: "1st Semester",
    section: "2IT-A",
    gwa: "1.80",
    standing: "Good Standing",
    subjects: [
      {
        code: "IT201",
        name: "Object-Oriented Programming",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT202",
        name: "Database Management Systems",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT203",
        name: "Computer Networks",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT204",
        name: "Web Development 1",
        units: 3,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "MATH201",
        name: "Calculus-based Physics",
        units: 3,
        grade: "2.25",
        remarks: "Passed",
      },
      {
        code: "PE201",
        name: "Physical Education 3",
        units: 2,
        grade: "1.50",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2022–2023",
    yearLevel: "1st Year",
    semester: "2nd Semester",
    section: "1IT-C",
    gwa: "1.88",
    standing: "Good Standing",
    subjects: [
      {
        code: "IT103",
        name: "Computer Programming 2",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT104",
        name: "Data Structures & Algorithms",
        units: 3,
        grade: "2.00",
        remarks: "Passed",
      },
      {
        code: "MATH102",
        name: "Discrete Mathematics",
        units: 3,
        grade: "2.00",
        remarks: "Passed",
      },
      {
        code: "ENG102",
        name: "Writing in the Discipline",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "GE102",
        name: "Readings in Philippine History",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "PE102",
        name: "Physical Education 2",
        units: 2,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "NSTP102",
        name: "NSTP 2",
        units: 3,
        grade: "1.25",
        remarks: "Passed",
      },
    ],
  },
  {
    schoolYear: "S.Y. 2022–2023",
    yearLevel: "1st Year",
    semester: "1st Semester",
    section: "1IT-C",
    gwa: "1.92",
    standing: "Good Standing",
    subjects: [
      {
        code: "IT101",
        name: "Introduction to Computing",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "IT102",
        name: "Computer Programming 1",
        units: 3,
        grade: "2.00",
        remarks: "Passed",
      },
      {
        code: "MATH101",
        name: "Mathematics in the Modern World",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "ENG101",
        name: "Purposive Communication",
        units: 3,
        grade: "2.25",
        remarks: "Passed",
      },
      {
        code: "GE101",
        name: "Understanding the Self",
        units: 3,
        grade: "1.75",
        remarks: "Passed",
      },
      {
        code: "PE101",
        name: "Physical Education 1",
        units: 2,
        grade: "1.50",
        remarks: "Passed",
      },
      {
        code: "NSTP101",
        name: "NSTP 1",
        units: 3,
        grade: "1.25",
        remarks: "Passed",
      },
    ],
  },
];

const NON_ACADEMIC = [
  {
    category: "Competition",
    year: "2025",
    title: "Regional ICT Quiz Bee",
    role: "Contestant",
    placement: "1st Place",
    description:
      "Represented CCS at the Regional ICT Quiz Bee held at DLSU Manila.",
  },
  {
    category: "Event",
    year: "2025",
    title: "CCS Night 2025",
    role: "Committee Head",
    placement: null,
    description:
      "Headed the Logistics Committee for the annual CCS Night gala.",
  },
  {
    category: "Competition",
    year: "2024",
    title: "Hackathon PH 2024",
    role: "Team Leader",
    placement: "Runner-up",
    description: "Led a 4-person team building an AI-powered health app.",
  },
  {
    category: "Seminar",
    year: "2024",
    title: "Cybersecurity Awareness Week",
    role: "Participant",
    placement: null,
    description: null,
  },
  {
    category: "Competition",
    year: "2023",
    title: "Web Dev Challenge",
    role: "Participant",
    placement: "3rd Place",
    description: "Built a full-stack web app in 8 hours.",
  },
];

const VIOLATIONS = [
  {
    offense: "Late Submission",
    date: "March 10, 2026",
    sanction: "Verbal Warning",
    warningLevel: "1st Warning",
  },
];

const SKILLS = [
  {
    category: "Programming",
    name: "JavaScript / React",
    level: "Advanced",
    percent: 80,
  },
  {
    category: "Programming",
    name: "Python",
    level: "Intermediate",
    percent: 60,
  },
  { category: "Programming", name: "Java", level: "Intermediate", percent: 55 },
  {
    category: "Programming",
    name: "PHP / Laravel",
    level: "Elementary",
    percent: 40,
  },
  { category: "Database", name: "MySQL", level: "Advanced", percent: 78 },
  { category: "Database", name: "MongoDB", level: "Intermediate", percent: 58 },
  { category: "Design", name: "Figma / UI-UX", level: "Advanced", percent: 82 },
  {
    category: "Design",
    name: "Adobe Photoshop",
    level: "Intermediate",
    percent: 55,
  },
  { category: "Sports", name: "Badminton", level: "Advanced", percent: 85 },
  {
    category: "Sports",
    name: "Basketball",
    level: "Intermediate",
    percent: 60,
  },
];

const AFFILIATIONS = [
  {
    type: "org",
    org: "ACSS",
    fullName: "Association of Computer Science Students",
    college: "College of Computing Studies",
    color: "#1565C0",
    records: [
      {
        schoolYear: "2025–2026",
        position: "Vice President for External Affairs",
        type: "Officer",
      },
      { schoolYear: "2024–2025", position: "Secretary", type: "Officer" },
      {
        schoolYear: "2023–2024",
        position: "Academic Committee Member",
        type: "Academic Member",
      },
    ],
  },
  {
    type: "org",
    org: "SITES",
    fullName: "Society of Information Technology Enthusiasts",
    college: "College of Computing Studies",
    color: "#2E7D32",
    records: [
      {
        schoolYear: "2025–2026",
        position: "General Member",
        type: "Academic Member",
      },
      {
        schoolYear: "2024–2025",
        position: "Badminton Representative",
        type: "Sports Member",
      },
    ],
  },
  {
    type: "org",
    org: "CCS",
    fullName: "College of Computing Studies Student Council",
    college: "College of Computing Studies",
    color: "#E65100",
    records: [
      {
        schoolYear: "2025–2026",
        position: "Council Representative",
        type: "Officer",
      },
    ],
  },
  {
    type: "sport",
    name: "Badminton",
    team: "CCS Women's Badminton Team",
    years: "2023–2026",
    achievements: ["Intramural Champion 2025", "College Cup Finalist 2024"],
  },
  {
    type: "sport",
    name: "Basketball (3x3)",
    team: "CCS 3x3 Basketball Team",
    years: "2024–2025",
    achievements: [],
  },
];

/* ═══════════════════════════════════════════
   TABS
═══════════════════════════════════════════ */
const TABS = [
  { key: "personal", label: "Personal Information" },
  { key: "academic", label: "Academic History" },
  { key: "nonacademic", label: "Non-Academic" },
  { key: "violations", label: "Violations" },
  { key: "skills", label: "Skills" },
  { key: "affiliations", label: "Affiliations" },
  { key: "security", label: "Account Security" },
];

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function studentProfile() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderTab = () => {
    switch (activeTab) {
      case "personal":
        return <TabPersonal student={STUDENT} />;
      case "academic":
        return <TabAcademic history={ACADEMIC_HISTORY} />;
      case "nonacademic":
        return <TabNonAcademic activities={NON_ACADEMIC} />;
      case "violations":
        return <TabViolations violations={VIOLATIONS} />;
      case "skills":
        return <TabSkills skills={SKILLS} />;
      case "affiliations":
        return <TabAffiliations affiliations={AFFILIATIONS} />;
      case "security":
        return <TabSecurity student={STUDENT} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageRoot}>
      <aside className={styles.sidebarArea}>
        <SideNavbar activeNav="Profile" />
      </aside>

      <div className={styles.mainCol}>
        <TopBarNav />

        <div className={styles.scrollArea}>
          <TitlePages
            icon={<FaUserAlt size={18} color="#ffffff" />}
            title="My Profile"
            iconBg="#E65100"
            textColor="#a34100"
          />

          {/* ── Profile banner — full width, above tabs ── */}
          <ProfileCard student={STUDENT} />

          {/* ── Tab content card ── */}
          <div className={styles.contentArea}>
            {/* Tab bar */}
            <div className={styles.tabBar}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  {t.key === "violations" && VIOLATIONS.length > 0 && (
                    <span className={styles.tabBadge}>{VIOLATIONS.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className={styles.panel}>{renderTab()}</div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
