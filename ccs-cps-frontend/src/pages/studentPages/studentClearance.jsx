import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


// React Icons
import { FaPercent } from "react-icons/fa";
import { FaPesoSign } from "react-icons/fa6";
import { FaBook } from "react-icons/fa6";
import { FaFileLines } from "react-icons/fa6";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";   // not-cleared circle
import { MdCheckCircle } from "react-icons/md";   // cleared circle (summary list)
import { MdCancel } from "react-icons/md";   // pending circle (summary list)

// Layout Components
import SideBarNav from "../../components/studentComponents/SideBarNav";
import TopBarNav from "../../components/studentComponents/TopBarNav";

// CSS Imports
import layoutStyles from "./studentStyles/dashboard.module.css";
import clearanceStyles from "./studentStyles/Clearance.module.css";

const MOBILE_BREAKPOINT = 992;

export default function StudentClearance() {
  const navigate = useNavigate();
  const [currentNav, setCurrentNav] = useState("Clearance");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = () => navigate("/");

  // Summary data for the top banner
  const summaryItems = [
    { isCleared: false, text: "Your grades for Second Semester A.Y. 2025-2026 have not all been submitted by your instructor/s yet." },
    { isCleared: true,  text: "You have fully settled your account balance." },
    { isCleared: true,  text: "You have no records of pending book/s borrowed from the University Library." },
    { isCleared: true,  text: "You do not have any on-hold records with any department." },
    { isCleared: false, text: "You have not evaluated all of your instructor/s for Second Semester A.Y. 2025-2026." },
  ];

  const clearanceUI = (
    <div className={clearanceStyles.clearanceContainer}>

      {/* Header Section */}
      <div className={clearanceStyles.pageHeader}>
        <div className={clearanceStyles.titleWrapper}>
          <div className={clearanceStyles.iconBox}>
            <FaRegCircleCheck size={22} color="#ffffff" />
          </div>
          <h2 className={clearanceStyles.pageTitle}>Clearance</h2>
        </div>
        <span className="text-muted fst-italic fw-700">
          NOTE: Updates in any part of the clearance will be reflected in not more than 30 minutes.
        </span>
      </div>

      {/* Main Status Banner */}
      <div className={clearanceStyles.statusBanner}>
        <div className={clearanceStyles.statusLeft}>
          <MdOutlineCancel size={64} color="#d32f2f" />
          <span className={clearanceStyles.statusMainText}>Not yet cleared</span>
        </div>
        <div className={clearanceStyles.statusDivider}></div>
        <div className={clearanceStyles.statusRight}>
          <ul className={clearanceStyles.summaryList}>
            {summaryItems.map((item, idx) => (
              <li key={idx} className={item.isCleared ? clearanceStyles.clearedItem : clearanceStyles.pendingItem}>
                {item.isCleared ? (
                  <MdCheckCircle size={18} color="#2e7d32" className={clearanceStyles.listIcon} />
                ) : (
                  <MdCancel size={18} color="#d32f2f" className={clearanceStyles.listIcon} />
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className={clearanceStyles.sectionTitle}>Clearance Details</h3>

      {/* GRADE STATUS */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
            <FaPercent size={18} color="white" />
            GRADE STATUS
          </div>
          <div className={clearanceStyles.department}>CCS OFFICE</div>
        </div>
        <div className={clearanceStyles.cardBodyCenter}>
          <h4 className={clearanceStyles.statusFailText}>NOT YET COMPLETE</h4>
          <p className={clearanceStyles.subtext}>
            Your grades for Second Semester A.Y. 2025-2026 have not all been submitted by your instructor/s yet.
          </p>
          <div className={clearanceStyles.missingItemsWrapper}>
            <div className={clearanceStyles.missingItem}>
              <MdCancel size={16} color="#d32f2f" />
              <span>ITP113 - IT Practicum (400 hours)</span>
            </div>
            <div className={clearanceStyles.missingItem}>
              <MdCancel size={16} color="#d32f2f" />
              <span>ITEW6 - Web Development Frameworks</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT STATUS */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
            <FaPesoSign size={18} color="white" />
            ACCOUNT STATUS
          </div>
          <div className={clearanceStyles.department}>OUR</div>
        </div>
        <div className={clearanceStyles.cardBodyCenter}>
          <h4 className={clearanceStyles.statusPassText}>REMAINING BALANCE: ₱0.00</h4>
          <div className={clearanceStyles.extraDetails}>
            <p className={clearanceStyles.successText}>✓ Tuition Fee: Fully Settled</p>
            <p className={clearanceStyles.successText}>✓ Miscellaneous Fee: Fully Settled</p>
          </div>
        </div>
      </div>

      {/* BOOK-BORROWING STATUS */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
            <FaBook size={18} color="white" />
            BOOK-BORROWING STATUS
          </div>
          <div className={clearanceStyles.department}>LIBRARY</div>
        </div>
        <div className={clearanceStyles.cardBodyCenter}>
          <h4 className={clearanceStyles.statusPassText}>CLEARED</h4>
          <div className={clearanceStyles.extraDetails}>
            <p className={clearanceStyles.neutralText}>No unreturned books or outstanding fines.</p>
            <p className={clearanceStyles.mutedText}>Last borrowed: Systems Analysis and Design (Returned: Feb 14, 2026)</p>
          </div>
        </div>
      </div>

      {/* REQUIREMENT STATUS */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
            <FaFileLines size={18} color="white" />
            REQUIREMENT STATUS
          </div>
          <div className={clearanceStyles.department}>OUR</div>
        </div>
        <div className={clearanceStyles.cardBodyCenter}>
          <h4 className={clearanceStyles.statusPassText}>ALL REQUIREMENTS SUBMITTED</h4>
          <div className={clearanceStyles.extraDetailsRow}>
            <span className={clearanceStyles.successTag}>✓ Form 138</span>
            <span className={clearanceStyles.successTag}>✓ PSA Birth Certificate</span>
            <span className={clearanceStyles.successTag}>✓ Good Moral Character</span>
          </div>
        </div>
      </div>

    </div>
  );

  if (isMobile) {
    return (
      <>
        <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />
        <main className={layoutStyles.mobileMain}>{clearanceUI}</main>
      </>
    );
  }

  return (
    <div className={layoutStyles.dashboardWrapper}>
      <SideBarNav activeNav={currentNav} onNavigate={setCurrentNav} />
      <div className={layoutStyles.rightColumn}>
        <TopBarNav notifCount={3} onSignOut={handleSignOut} />
        <main className={layoutStyles.mainContent}>{clearanceUI}</main>
      </div>
    </div>
  );
}