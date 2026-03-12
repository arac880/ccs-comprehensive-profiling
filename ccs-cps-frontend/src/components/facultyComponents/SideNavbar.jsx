import "../../pages/facultyPages/facultyStyles/SideNavbar.css";
import ccsLogo from "../../assets/ccs_logo.png";


const navItems = [
  { name: "Dashboard",   label: "Dashboard",   icon: "bi-grid-fill" },
  { name: "StudentList", label: "Student List", icon: "bi-justify" },
  { name: "Schedule",    label: "Schedule",     icon: "bi-calendar3" },
  { name: "Events",      label: "Events",       icon: "bi-calendar-event" },
  { name: "SignOut",     label: "Sign Out",     icon: "bi-arrow-left-circle" },
];

const faculty = {
  name: "Miriam B. Mulawin",
  id: "2203375",
};

export default function SidebarNav({ activeNav = "Dashboard", onNavigate }) {
  return (
    <div className="sidebar">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3">
        <span
          className="text-white fw-bold fs-3"
          style={{ fontFamily: "Gabarito, sans-serif" }}
        >
          Faculty
        </span>
        <i className="bi bi-list text-white fs-2" style={{ cursor: "pointer" }} />
      </div>

      {/* Profile */}
      <div className="profile-section">
        <i className="bi bi-pencil-square profile-edit-icon" />
        <div className="d-flex align-items-center gap-3">
          <div className="profile-avatar" />
          <div>
            <p className="profile-name">{faculty.name}</p>
            <p className="profile-id">{faculty.id}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <div key={item.name}>
            <div
              className={`nav-item-row gap-4${activeNav === item.name ? " active-nav" : ""}`}
              onClick={() => onNavigate?.(item.name)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </div>
            {index < navItems.length - 1 && <hr className="nav-divider" />}
          </div>
        ))}
      </nav>

      {/* Watermark */}
      <div className="sidebar-watermark">
        <img
          src={ccsLogo}
          alt="CCS"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

    </div>
  );
}