import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const notifications = [
  { to: "/applications", title: "New Job Application received", time: "5 minutes ago", icon: "bi-file-earmark-person" },
  { to: "/contactUs", title: "New Inquiry from Contact Us", time: "25 minutes ago", icon: "bi-envelope" },
  { to: "/placementApplication", title: "Drive application submitted", time: "1 hour ago", icon: "bi-mortarboard" },
];

const THEME_KEY = "adminHMD.colorTheme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        response = await response.json();
        if (response.data) setData(response.data);
        else navigate("/login");
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  useEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  function handleThemeToggle() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar admin-navbar sticky-top border-bottom">
        <div className="container-fluid px-3 px-lg-4">

          {/* ── Left: Sidebar Toggle + Search ── */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <button
              className="sidebar-toggle"
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle Sidebar"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Desktop/Tablet search — hidden on mobile */}
            <div className="admin-search-wrapper d-none d-md-flex align-items-center">
              <i className="bi bi-search search-icon me-2"></i>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Search sections, jobs, applications..."
                aria-label="Search"
              />
              <span className="search-shortcut ms-2 d-none d-lg-inline">⌘K</span>
            </div>
          </div>

          {/* ── Right: Actions ── */}
          <div className="navbar-actions d-flex align-items-center gap-2 gap-sm-3 ms-auto">

            {/* Live badge — desktop only */}
            <div className="admin-live-badge d-none d-xl-flex align-items-center gap-2 px-3 rounded-pill">
              <span className="pulse-dot"></span>
              <span>CTech Portal</span>
            </div>

            {/* Mobile search toggle — shows only on mobile */}
            <button
              className="icon-button d-flex d-md-none align-items-center justify-content-center"
              type="button"
              onClick={() => setMobileSearchOpen(o => !o)}
              aria-label="Search"
              title="Search"
            >
              <i className={`bi ${mobileSearchOpen ? 'bi-x-lg' : 'bi-search'}`} style={{ fontSize: '1rem' }}></i>
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-button theme-toggle d-flex align-items-center justify-content-center"
              type="button"
              onClick={handleThemeToggle}
              aria-label="Switch color theme"
              title="Toggle Light / Dark Mode"
            >
              <ThemeIcon />
            </button>

            {/* Notifications */}
            <div className="dropdown">
              <button
                className="icon-button d-flex align-items-center justify-content-center position-relative"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Notifications"
              >
                <span className="notification-dot"></span>
                <i className="bi bi-bell" aria-hidden="true"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end notification-menu shadow-lg p-0 rounded-4 overflow-hidden mt-2">
                <div className="dropdown-header border-bottom py-3 px-3 d-flex align-items-center justify-content-between">
                  <span className="fw-bold fs-6 m-0">Notifications</span>
                  <span className="badge bg-primary rounded-pill">3 New</span>
                </div>
                <div className="notification-list py-1">
                  {notifications.map(({ to, title, time, icon }) => (
                    <Link key={title} className="dropdown-item px-3 py-2 d-flex align-items-start gap-3" to={to}>
                      <div className="notification-icon-box flex-shrink-0 mt-1">
                        <i className={`bi ${icon || 'bi-info-circle'}`}></i>
                      </div>
                      <div>
                        <span className="notification-title d-block fw-semibold" style={{ fontSize: '0.88rem' }}>{title}</span>
                        <span className="notification-time text-muted" style={{ fontSize: '0.78rem' }}>{time}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-2 text-center border-top">
                  <Link to="/contactUs" className="small fw-bold text-primary text-decoration-none">View All Activity</Link>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="dropdown">
              <button
                className="profile-button dropdown-toggle border-0 bg-transparent p-1 d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  className="avatar-img avatar-sm rounded-circle"
                  src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
                  alt="Admin"
                />
                {/* Name + role — hidden on small screens */}
                <div className="text-start d-none d-lg-block">
                  <span className="profile-name d-block fw-bold" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                    {data?.name || localStorage.getItem("name") || "Admin"}
                  </span>
                  <span className="profile-role text-muted" style={{ fontSize: '0.75rem' }}>Super Admin</span>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg rounded-4 p-2 mt-2" style={{ minWidth: '200px' }}>
                <li>
                  <div className="px-3 py-2 border-bottom mb-1">
                    <p className="fw-bold m-0" style={{ fontSize: '0.9rem' }}>{data?.name || "Admin"}</p>
                    <p className="text-muted small m-0 text-truncate">{data?.email || "admin@ctechethics.com"}</p>
                  </div>
                </li>
                <li>
                  <Link className="dropdown-item rounded-3 py-2" to="/profile">
                    <i className="bi bi-person-gear me-2 text-primary"></i> Profile Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-3 py-2" to="/applications">
                    <i className="bi bi-file-earmark-person me-2 text-info"></i> Applications
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger rounded-3 py-2 w-100 text-start border-0 bg-transparent fw-semibold"
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Mobile Search Overlay (below main row) ── */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar d-md-none px-3 pb-3">
            <div className="admin-search-wrapper d-flex align-items-center w-100">
              <i className="bi bi-search search-icon me-2"></i>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Search sections, jobs..."
                aria-label="Search"
                autoFocus
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function ThemeIcon() {
  const [theme, setTheme] = React.useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <i
      className={theme === "dark" ? "bi bi-sun-fill text-warning" : "bi bi-moon-stars-fill text-primary"}
      aria-hidden="true"
      style={{ fontSize: '1.1rem' }}
    />
  );
}
