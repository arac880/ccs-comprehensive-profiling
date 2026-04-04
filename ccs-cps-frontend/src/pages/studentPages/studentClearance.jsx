import { useState, useEffect } from "react";
import { FaPercent, FaBook, FaFileLines } from "react-icons/fa6";
import { FaPesoSign, FaClipboardCheck } from "react-icons/fa6";
import { MdOutlineCancel, MdCheckCircle, MdCancel } from "react-icons/md"; 

import styles from "./studentStyles/Clearance.module.css";

const MOBILE_BREAKPOINT = 992;

export default function StudentClearance() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const summaryItems = [
    { isCleared: false, text: "Your grades for Second Semester have not all been submitted." },
    { isCleared: true, text: "You have fully settled your account balance." },
    { isCleared: true, text: "You have no records of pending book/s borrowed." },
    { isCleared: true, text: "You do not have any on-hold records." },
    { isCleared: false, text: "You have not evaluated all of your instructor/s." },
  ];

  return (
    <main className={styles.clearanceContainer}>
      
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}>
            <FaClipboardCheck size={20} color="#ffffff" />
          </div>
          <h2 className={styles.pageTitle}>Overall Clearance</h2>
        </div>
        <span className={styles.headerNote}>
          <i className="bi bi-clock-history" style={{ marginRight: "6px" }}></i>
          Updates reflect within 30 minutes
        </span>
      </div>

      {/* ── Main Status Banner ── */}
      <div className={styles.statusBanner}>
        <div className={styles.statusLeft}>
          <div className={styles.statusIconWrap}>
            <MdOutlineCancel size={48} color="#E65100" />
          </div>
          <span className={styles.statusMainText}>Not Yet Cleared</span>
          <span className={styles.statusSubText}>Action required on pending items.</span>
        </div>
        
        <div className={styles.statusDivider}></div>
        
        <div className={styles.statusRight}>
          <ul className={styles.summaryList}>
            {summaryItems.map((item, idx) => (
              <li key={idx} className={item.isCleared ? styles.clearedItem : styles.pendingItem}>
                {item.isCleared ? (
                  <MdCheckCircle size={18} className={styles.listIcon} />
                ) : (
                  <MdCancel size={18} className={styles.listIcon} />
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>The Clearance Pathway</h3>

      {/* ── Vertical Timeline Journey ── */}
      <div className={styles.timelineWrapper}>
        
        {/* STOP 1: GRADE STATUS */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div className={`${styles.timelineNode} ${styles.nodePending}`}>
              <MdCancel size={24} />
            </div>
            <div className={styles.timelineLine}></div>
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}><FaPercent /></div>
                  <span className={styles.widgetTitle}>Grade Status</span>
                </div>
                <div className={styles.departmentBadge}>CCS OFFICE</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4 className={styles.statusFailText}>NOT YET COMPLETE</h4>
                  <p className={styles.subtext}>Grades for the current semester have not all been submitted.</p>
                </div>
                <div className={styles.missingItemsWrapper}>
                  <div className={styles.missingItem}>
                    <MdCancel size={16} /><span>ITP113 - IT Practicum (400 hours)</span>
                  </div>
                  <div className={styles.missingItem}>
                    <MdCancel size={16} /><span>ITEW6 - Web Development Frameworks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STOP 2: ACCOUNT STATUS */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div className={`${styles.timelineNode} ${styles.nodeCleared}`}>
              <MdCheckCircle size={24} />
            </div>
            <div className={styles.timelineLine}></div>
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}><FaPesoSign /></div>
                  <span className={styles.widgetTitle}>Account Status</span>
                </div>
                <div className={styles.departmentBadge}>OUR</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4 className={styles.statusPassText}>REMAINING BALANCE: ₱0.00</h4>
                  <p className={styles.subtext}>All financial obligations have been met for this semester.</p>
                </div>
                <div className={styles.extraDetailsRow}>
                  <span className={styles.successTag}>✓ Tuition Fee Settled</span>
                  <span className={styles.successTag}>✓ Misc Fee Settled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STOP 3: LIBRARY */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div className={`${styles.timelineNode} ${styles.nodeCleared}`}>
              <MdCheckCircle size={24} />
            </div>
            <div className={styles.timelineLine}></div>
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}><FaBook /></div>
                  <span className={styles.widgetTitle}>Library Status</span>
                </div>
                <div className={styles.departmentBadge}>LIBRARY</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4 className={styles.statusPassText}>CLEARED</h4>
                  <p className={styles.subtext}>No unreturned books or outstanding fines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STOP 4: REQUIREMENTS (Last item, no trailing line) */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div className={`${styles.timelineNode} ${styles.nodeCleared}`}>
              <MdCheckCircle size={24} />
            </div>
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}><FaFileLines /></div>
                  <span className={styles.widgetTitle}>Requirements</span>
                </div>
                <div className={styles.departmentBadge}>OUR</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4 className={styles.statusPassText}>ALL SUBMITTED</h4>
                  <p className={styles.subtext}>All hardcopy documents have been submitted and verified.</p>
                </div>
                <div className={styles.extraDetailsRow}>
                  <span className={styles.successTag}>✓ Form 138</span>
                  <span className={styles.successTag}>✓ PSA Birth Cert</span>
                  <span className={styles.successTag}>✓ Good Moral</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}