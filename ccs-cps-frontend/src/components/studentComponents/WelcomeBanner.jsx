
import styles from "../../pages/studentPages/studentStyles/WelcomeBanner.module.css";

 
export default function WelcomeBanner() {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>
        Welcome&nbsp;to&nbsp;the&nbsp;<span className={styles.accentCCS}>CCS</span>
      </h2>
      <p className={styles.sub}>Comprehensive Profiling System</p>
    </div>
  );
}
 