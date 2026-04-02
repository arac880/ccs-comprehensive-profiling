import "../../pages/facultyPages/facultyStyles/TopNavbar.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-logo-text">CCS</div>
        <div className="topbar-logo-sub">Comprehensive Profiling System</div>
      </div>
      <div className="topbar-actions">
        <i className="bi bi-bell topbar-bell" />
        <div className="topbar-search">
          <input type="text" placeholder="" />
          <button>
            <i className="bi bi-search" />
          </button>
        </div>
      </div>
    </div>
  );
}
