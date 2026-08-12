import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/banner", icon: "bi-file-earmark-text", label: "Banner" },
  {
    to: "/about",
    icon: "bi-person-lines-fill",
    label: "About Me",
    subLinks: [
      { to: "/about", label: "Personal Info" },
      { to: "/whyChooseUs", label: "Why Choose Us" },
    ]
  },
  { to: "/team", icon: "bi-stars", label: "Our Team" },
  { to: "/techStack", icon: "bi-stars", label: "Technology Stack" },
  { to: "/achievement", icon: "bi-trophy", label: "Achievements" },
  { to: "/portfolio", icon: "bi-collection", label: "Portfolio" },
  {
    to: "/service",
    icon: "bi-gear",
    label: "Services",
    subLinks: [
      { to: "/service", label: "Services" },
      { to: "/subService", label: "Sub Services" }
    ]
  },
  {
    to: "/job",
    icon: "bi-suitcase-lg",
    label: "Jobs",
    subLinks: [
      { to: "companyjob", label: "Company Job" },
      { to: "/placement", label: "Placement Jobs" }
    ]
  },
  { to: "/placedstudent", icon: "bi-envelope-paper", label: "Placed Student" },
  { to: "/blog", icon: "bi-file-earmark-text", label: "Blogs" },
  { to: "/testimonial", icon: "bi-chat-quote", label: "Testimonial" },
  { to: "/newsletter", icon: "bi-envelope-paper", label: "Newsletter" },
  { to: "/user", icon: "bi-people", label: "Users" },
  { to: "/contactUs", icon: "bi-headset", label: "Queries" },
];

export default function Sidebar({ onLinkClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);

  // Tracks which parent menus are expanded
  const [expandedMenus, setExpandedMenus] = useState({});

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

  // Auto-expand a parent menu when landing directly on one of its sub-routes
  // (e.g. refreshing the page on /about/team should show the group open).
  useEffect(() => {
    const parentWithActiveChild = navLinks.find(
      (link) =>
        link.subLinks?.some((sub) => location.pathname.startsWith(sub.to))
    );
    if (parentWithActiveChild) {
      setExpandedMenus((prev) => ({ ...prev, [parentWithActiveChild.label]: true }));
    }
  }, [location.pathname]);

  const name = data?.name || localStorage.getItem("name") || "Admin";

  // Toggles a dropdown open/closed — flips whatever the current state is
  const toggleMenu = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isParentActive = (link) =>
    link.subLinks?.some((sub) => location.pathname.startsWith(sub.to));

  return (
    <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
      <div className="sidebar-header">
        <NavLink className="brand-mark" to="/" aria-label="Dashboard">
          <span className="brand-icon">
            <i className="bi bi-grid-1x2-fill" aria-hidden="true"></i>
          </span>
          <span className="brand-copy">
            <span className="brand-title">adminHMD</span>
            <span className="brand-subtitle">Admin Template</span>
          </span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const { to, icon, label, subLinks } = link;
          const isOpen = !!expandedMenus[label];

          // ── Parent item WITH sub-links: acts purely as an accordion toggle ──
          if (subLinks) {
            return (
              <div key={label} className="nav-item-wrapper">
                <button
                  type="button"
                  className={`nav-link nav-link-toggle${isParentActive(link) ? " active" : ""}`}
                  aria-expanded={isOpen}
                  onClick={() => toggleMenu(label)}
                >
                  <span className="nav-icon">
                    <i className={`bi ${icon}`} aria-hidden="true"></i>
                  </span>
                  <span className="nav-text">{label}</span>
                  <span className="nav-chevron ms-auto" style={{ marginLeft: "auto" }}>
                    <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>
                  </span>
                </button>

                <div
                  className={`nav-sublinks${isOpen ? " open" : ""}`}
                  style={{
                    paddingLeft: "2.5rem",
                    maxHeight: isOpen ? "500px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease",
                  }}
                >
                  {subLinks.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) => `nav-link nav-sub-link${isActive ? " active" : ""}`}
                      style={{ fontSize: "0.9em", padding: "0.5rem 1rem" }}
                      onClick={() => {
                        if (!window.matchMedia("(min-width: 992px)").matches) {
                          onLinkClick?.();
                        }
                      }}
                    >
                      <span className="nav-text">{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          // ── Regular item WITHOUT sub-links: normal navigable link ──
          return (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => {
                if (!window.matchMedia("(min-width: 992px)").matches) {
                  onLinkClick?.();
                }
              }}
            >
              <span className="nav-icon">
                <i className={`bi ${icon}`} aria-hidden="true"></i>
              </span>
              <span className="nav-text">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <img
          className="avatar-img avatar-md sidebar-user-avatar"
          src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
          alt={name}
        />
        <strong>{name}</strong>
        <small>Active Workspace</small>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">System running smoothly</span>
      </div>
    </aside>
  );
}