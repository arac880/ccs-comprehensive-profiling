import styles from "../../pages/studentPages/studentStyles/CcsLinks.module.css";

const DEFAULT_LINKS = [
  {
    id: 1,
    name: "CCSOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
  {
    id: 2,
    name: "SitesOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
  {
    id: 3,
    name: "AccsOfficial",
    sub: "Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
];

export default function CCSLinks({ links = DEFAULT_LINKS }) {
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.sectionTitle}>CCS Links</h6>
      <div className={styles.linksCard}>
        <div className={styles.linksList}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className={styles.linkItem}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.iconCircle}>
                <i className={`bi ${link.icon} ${styles.platformIcon}`} />
              </div>
              <div className={styles.linkText}>
                <span className={styles.linkName}>{link.name}</span>
                <span className={styles.linkSub}>{link.sub}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
