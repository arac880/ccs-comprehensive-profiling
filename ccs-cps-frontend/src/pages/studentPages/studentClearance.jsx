import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    { isCleared: true, text: "You have fully settled your account balance." },
    { isCleared: true, text: "You have no records of pending book/s borrowed from the University Library." },
    { isCleared: true, text: "You do not have any on-hold records with any department." },
    { isCleared: false, text: "You have not evaluated all of your instructor/s for Second Semester A.Y. 2025-2026." }
  ];

  const clearanceUI = (
    <div className={clearanceStyles.clearanceContainer}>
      
      {/* Header Section */}
      <div className={clearanceStyles.pageHeader}>
        <div className={clearanceStyles.titleWrapper}>
          <div className={clearanceStyles.iconBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
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
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span className={clearanceStyles.statusMainText}>Not yet cleared</span>
        </div>
        <div className={clearanceStyles.statusDivider}></div>
        <div className={clearanceStyles.statusRight}>
          <ul className={clearanceStyles.summaryList}>
            {summaryItems.map((item, idx) => (
              <li key={idx} className={item.isCleared ? clearanceStyles.clearedItem : clearanceStyles.pendingItem}>
                {item.isCleared ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2e7d32" stroke="#2e7d32" className={clearanceStyles.listIcon}>
                    <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#d32f2f" stroke="#d32f2f" className={clearanceStyles.listIcon}>
                    <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2"/>
                  </svg>
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className={clearanceStyles.sectionTitle}>Clearance Details</h3>

      {/* GRADE STATUS (Now Centered) */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
             GRADE STATUS
          </div>
          <div className={clearanceStyles.department}>CCS OFFICE</div>
        </div>
        <div className={clearanceStyles.cardBodyCenter}>
          <h4 className={clearanceStyles.statusFailText}>NOT YET COMPLETE</h4>
          <p className={clearanceStyles.subtext}>Your grades for Second Semester A.Y. 2025-2026 have not all been submitted by your instructor/s yet.</p>
          
          <div className={clearanceStyles.missingItemsWrapper}>
            <div className={clearanceStyles.missingItem}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="#d32f2f"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2"/></svg>
               <span>ITP113 - IT Practicum (400 hours)</span>
            </div>
            <div className={clearanceStyles.missingItem}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="#d32f2f"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2"/></svg>
               <span>ITEW6 - Web Development Frameworks</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT STATUS */}
      <div className={clearanceStyles.detailCard}>
        <div className={clearanceStyles.cardHeader}>
          <div className={clearanceStyles.headerTitle}>
            <span className={clearanceStyles.pesoSign}>₱</span>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
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