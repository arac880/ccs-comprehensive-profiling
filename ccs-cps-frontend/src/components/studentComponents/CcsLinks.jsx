import styles from "../../pages/studentPages/studentStyles/CcsLinks.module.css";

const DEFAULT_LINKS = [
  {
    id: 1,
    name: "CCSOfficial",
    sub: "Official Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
  {
    id: 2,
    name: "SitesOfficial",
    sub: "SITES Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
  {
    id: 3,
    name: "ACCSOfficial",
    sub: "ACCS Facebook Page",
    url: "https://facebook.com",
    icon: "bi-facebook",
  },
  {
    id: 4,
    name: "CCS Portal",
    sub: "Official CCS Website",
    url: "https://ccs.edu",
    icon: "bi-globe2",
  },
];

export default function CCSLinks({ links = DEFAULT_LINKS }) {
  return (
    <div className={styles.wrapper}>
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
              <div className={styles.iconTile}>
                <i className={`bi ${link.icon} ${styles.platformIcon}`} />
              </div>
              <div className={styles.linkText}>
                <span className={styles.linkName}>{link.name}</span>
                <span className={styles.linkSub}>{link.sub}</span>
              </div>
              <i className={`bi bi-arrow-up-right ${styles.arrowIcon}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}