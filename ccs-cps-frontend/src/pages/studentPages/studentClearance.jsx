import { useState, useEffect } from "react";
import {
  FaPercent,
  FaBook,
  FaFileLines,
  FaPesoSign,
  FaClipboardCheck,
} from "react-icons/fa6";
import { MdOutlineCancel, MdCheckCircle, MdCancel } from "react-icons/md";

import styles from "./studentStyles/Clearance.module.css";

const MOBILE_BREAKPOINT = 992;

export default function StudentClearance({ studentId }) {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [clearanceData, setClearanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Dynamic Fetching with localStorage fallback
  useEffect(() => {
    const fetchClearance = async () => {
      try {
        let currentId = studentId;

        // If no ID prop is passed, check localStorage for the logged-in user
        if (!currentId) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            currentId = parsedUser._id;
          }
        }

        if (!currentId) {
          console.warn("No student ID provided for clearance fetch.");
          setIsLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${currentId}`,
        );
        const data = await res.json();

        if (data && data.clearance) {
          setClearanceData(data.clearance);
        }
      } catch (error) {
        console.error("Failed to fetch clearance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClearance();
  }, [studentId]);

  if (isLoading) {
    return (
      <main className={styles.clearanceContainer}>
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading your clearance data...
        </div>
      </main>
    );
  }

  if (!clearanceData) {
    return (
      <main className={styles.clearanceContainer}>
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Clearance data is currently unavailable.
        </div>
      </main>
    );
  }

  const { summaryItems, pathway } = clearanceData;
  const isOverallCleared = summaryItems.every((item) => item.isCleared);

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
            {isOverallCleared ? (
              <MdCheckCircle size={48} color="#2E7D32" />
            ) : (
              <MdOutlineCancel size={48} color="#E65100" />
            )}
          </div>
          <span className={styles.statusMainText}>
            {isOverallCleared ? "Fully Cleared" : "Not Yet Cleared"}
          </span>
          <span className={styles.statusSubText}>
            {isOverallCleared
              ? "You have met all requirements."
              : "Action required on pending items."}
          </span>
        </div>

        <div className={styles.statusDivider}></div>

        <div className={styles.statusRight}>
          <ul className={styles.summaryList}>
            {summaryItems.map((item, idx) => (
              <li
                key={idx}
                className={
                  item.isCleared ? styles.clearedItem : styles.pendingItem
                }
              >
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
            <div
              className={`${styles.timelineNode} ${pathway.gradeStatus.isCleared ? styles.nodeCleared : styles.nodePending}`}
            >
              {pathway.gradeStatus.isCleared ? (
                <MdCheckCircle size={24} />
              ) : (
                <MdCancel size={24} />
              )}
            </div>
            <div className={styles.timelineLine}></div>
          </div>

          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}>
                    <FaPercent />
                  </div>
                  <span className={styles.widgetTitle}>Grade Status</span>
                </div>
                <div className={styles.departmentBadge}>CCS OFFICE</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4
                    className={
                      pathway.gradeStatus.isCleared
                        ? styles.statusPassText
                        : styles.statusFailText
                    }
                  >
                    {pathway.gradeStatus.statusText}
                  </h4>
                  <p className={styles.subtext}>
                    {pathway.gradeStatus.subtext}
                  </p>
                </div>
                {pathway.gradeStatus.missingItems &&
                  pathway.gradeStatus.missingItems.length > 0 && (
                    <div className={styles.missingItemsWrapper}>
                      {pathway.gradeStatus.missingItems.map((item, idx) => (
                        <div key={idx} className={styles.missingItem}>
                          <MdCancel size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* STOP 2: ACCOUNT STATUS */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div
              className={`${styles.timelineNode} ${pathway.accountStatus.isCleared ? styles.nodeCleared : styles.nodePending}`}
            >
              {pathway.accountStatus.isCleared ? (
                <MdCheckCircle size={24} />
              ) : (
                <MdCancel size={24} />
              )}
            </div>
            <div className={styles.timelineLine}></div>
          </div>

          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}>
                    <FaPesoSign />
                  </div>
                  <span className={styles.widgetTitle}>Account Status</span>
                </div>
                <div className={styles.departmentBadge}>OUR</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4
                    className={
                      pathway.accountStatus.isCleared
                        ? styles.statusPassText
                        : styles.statusFailText
                    }
                  >
                    {pathway.accountStatus.statusText}
                  </h4>
                  <p className={styles.subtext}>
                    {pathway.accountStatus.subtext}
                  </p>
                </div>
                {pathway.accountStatus.tags &&
                  pathway.accountStatus.tags.length > 0 && (
                    <div className={styles.extraDetailsRow}>
                      {pathway.accountStatus.tags.map((tag, idx) => {
                        const isPending = tag.toLowerCase().includes("pending");
                        return (
                          <span
                            key={idx}
                            className={
                              isPending ? styles.missingItem : styles.successTag
                            }
                          >
                            {isPending ? (
                              <MdCancel
                                size={14}
                                style={{ marginRight: "4px" }}
                              />
                            ) : (
                              "✓"
                            )}{" "}
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* STOP 3: LIBRARY */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div
              className={`${styles.timelineNode} ${pathway.libraryStatus.isCleared ? styles.nodeCleared : styles.nodePending}`}
            >
              {pathway.libraryStatus.isCleared ? (
                <MdCheckCircle size={24} />
              ) : (
                <MdCancel size={24} />
              )}
            </div>
            <div className={styles.timelineLine}></div>
          </div>

          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}>
                    <FaBook />
                  </div>
                  <span className={styles.widgetTitle}>Library Status</span>
                </div>
                <div className={styles.departmentBadge}>LIBRARY</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4
                    className={
                      pathway.libraryStatus.isCleared
                        ? styles.statusPassText
                        : styles.statusFailText
                    }
                  >
                    {pathway.libraryStatus.statusText}
                  </h4>
                  <p className={styles.subtext}>
                    {pathway.libraryStatus.subtext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STOP 4: REQUIREMENTS */}
        <div className={styles.timelineRow}>
          <div className={styles.timelineNodeBox}>
            <div
              className={`${styles.timelineNode} ${pathway.requirements.isCleared ? styles.nodeCleared : styles.nodePending}`}
            >
              {pathway.requirements.isCleared ? (
                <MdCheckCircle size={24} />
              ) : (
                <MdCancel size={24} />
              )}
            </div>
          </div>

          <div className={styles.timelineContent}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetHeader}>
                <div className={styles.widgetTitleWrap}>
                  <div className={styles.widgetIcon}>
                    <FaFileLines />
                  </div>
                  <span className={styles.widgetTitle}>Requirements</span>
                </div>
                <div className={styles.departmentBadge}>OUR</div>
              </div>
              <div className={styles.widgetBody}>
                <div className={styles.bodyLeft}>
                  <h4
                    className={
                      pathway.requirements.isCleared
                        ? styles.statusPassText
                        : styles.statusFailText
                    }
                  >
                    {pathway.requirements.statusText}
                  </h4>
                  <p className={styles.subtext}>
                    {pathway.requirements.subtext}
                  </p>
                </div>
                {pathway.requirements.tags &&
                  pathway.requirements.tags.length > 0 && (
                    <div className={styles.extraDetailsRow}>
                      {pathway.requirements.tags.map((tag, idx) => {
                        const isMissing = tag.toLowerCase().includes("missing");
                        return (
                          <span
                            key={idx}
                            className={
                              isMissing ? styles.missingItem : styles.successTag
                            }
                          >
                            {isMissing ? (
                              <MdCancel
                                size={14}
                                style={{ marginRight: "4px" }}
                              />
                            ) : (
                              "✓"
                            )}{" "}
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
