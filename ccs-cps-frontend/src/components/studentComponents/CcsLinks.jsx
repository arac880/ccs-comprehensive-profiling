import styles from "../../pages/studentPages/studentStyles/CcsLinks.module.css";
// ── Default links (replace or extend as needed) ───────────────
const DEFAULT_LINKS = [
  {
    id: 1,
    name: "CCSOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
    iconBg: "#1877f2",
  },
  {
    id: 2,
    name: "SitesOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
    iconBg: "#1877f2",
  },
  {
    id: 3,
    name: "AccsOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
    iconBg: "#1877f2",
  },
];

export default function CCSLinks({ links = DEFAULT_LINKS }) {
  return (
    <div>
      <h6 className={styles.sectionTitle}>CCS Links</h6>

      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          className={styles.linkItem}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={styles.iconCircle}
            style={{ backgroundColor: link.iconBg }}
          >
            <i className={`bi ${link.icon} ${styles.platformIcon}`} />
          </div>
          <div className={styles.linkText}>
            <span className={styles.linkName}>{link.name}</span>
            <span className={styles.linkSub}>{link.sub}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
