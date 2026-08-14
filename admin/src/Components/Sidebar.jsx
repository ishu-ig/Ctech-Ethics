import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const navSections = [
  {
    title: "MAIN",
    links: [
      { to: "/", icon: "bi-speedometer2", label: "Dashboard" },
      { to: "/banner", icon: "bi-layout-three-columns", label: "Hero Banners" },
    ],
  },
  {
    title: "COMPANY & CONTENT",
    links: [
      {
        to: "/about",
        icon: "bi-building",
        label: "About & Story",
        subLinks: [
          { to: "/about", label: "Personal & Company Info" },
          { to: "/whyChooseUs", label: "Why Choose Us" },
        ],
      },
      { to: "/team", icon: "bi-people-fill", label: "Our Team" },
      { to: "/techStack", icon: "bi-cpu-fill", label: "Tech Stack" },
      { to: "/achievement", icon: "bi-trophy-fill", label: "Achievements" },
      { to: "/portfolio", icon: "bi-grid-3x3-gap-fill", label: "Portfolio" },
      {
        to: "/service",
        icon: "bi-gear-wide-connected",
        label: "Services",
        subLinks: [
          { to: "/service", label: "Main Services" },
          { to: "/subService", label: "Sub Services" },
        ],
      },
      { to: "/blog", icon: "bi-journal-richtext", label: "Blogs & News" },
      { to: "/testimonial", icon: "bi-chat-quote-fill", label: "Testimonials" },
    ],
  },
  {
    title: "CAREERS & PLACEMENT",
    links: [
      {
        to: "/job",
        icon: "bi-briefcase-fill",
        label: "Jobs Management",
        subLinks: [
          { to: "/companyjob", label: "Company Jobs" },
          { to: "/placement", label: "Placement Drives" },
        ],
      },
      { to: "/placedstudent", icon: "bi-mortarboard-fill", label: "Placed Students" },
      {
        to: "/applications",
        icon: "bi-file-earmark-person-fill",
        label: "Applications",
        subLinks: [
          { to: "/application", label: "Job Applications" },
          { to: "/placementApplication", label: "Placement Applications" },
        ],
      },
    ],
  },
  {
    title: "SYSTEM & USERS",
    links: [
      { to: "/user", icon: "bi-person-badge-fill", label: "User Access" },
      { to: "/note", icon: "bi-journal-text", label: "Notes" },
      { to: "/newsletter", icon: "bi-envelope-paper-fill", label: "Newsletter" },
      { to: "/contactUs", icon: "bi-chat-dots-fill", label: "Inquiries & Messages" },
    ],
  },
];

export default function Sidebar({ onLinkClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
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

  // Auto-expand parent when landing directly on a sub-route
  useEffect(() => {
    navSections.forEach((section) => {
      section.links.forEach((link) => {
        if (link.subLinks?.some((sub) => location.pathname.startsWith(sub.to))) {
          setExpandedMenus((prev) => ({ ...prev, [link.label]: true }));
        }
      });
    });
  }, [location.pathname]);

  const name = data?.name || localStorage.getItem("name") || "Admin";

  const toggleMenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isParentActive = (link) =>
    link.subLinks?.some((sub) => location.pathname.startsWith(sub.to));

  return (
    <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">

      {/* ── Brand Header ── */}
      <div className="sidebar-header">
        {/* Gradient accent bar at top */}
        <div className="sidebar-header-accent" aria-hidden="true" />

        <NavLink className="sidebar-brand-link text-decoration-none mb-5" to="/" aria-label="Go to Dashboard">
          {/* Logo Badge */}
          <div className="sidebar-brand-badge">
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          {/* Company Info */}
          <div className="sidebar-brand-info">
            <span className="sidebar-brand-name">CTech Ethic</span>
            <span className="sidebar-brand-tagline">Solution Admin</span>
          </div>

          {/* Version pill */}
          <span className="sidebar-brand-version">v2.4</span>
        </NavLink>

        {/* Company Sub-info Row */}
        <div className="sidebar-company-row">
          <span className="sidebar-company-dot"></span>
          <span className="sidebar-company-status">Portal Active</span>
          <span className="sidebar-company-sep">·</span>
          <span className="sidebar-company-domain">ctechethic.com</span>
        </div>
      </div>

      {/* ── Navigation Sections ── */}
      <nav className="sidebar-nav flex-grow-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-section mb-1">
            <div className="sidebar-section-title px-3 py-1">{section.title}</div>

            <div className="d-grid">
              {section.links.map((link) => {
                const { to, icon, label, subLinks } = link;
                const isOpen = !!expandedMenus[label];
                const parentActive = isParentActive(link);

                if (subLinks) {
                  return (
                    <div key={label} className="nav-item-wrapper">
                      <button
                        type="button"
                        className={`nav-link w-100 border-0 text-start bg-transparent d-flex align-items-center${parentActive ? " active" : ""}`}
                        aria-expanded={isOpen}
                        onClick={() => toggleMenu(label)}
                      >
                        <span className="nav-icon flex-shrink-0">
                          <i className={`bi ${icon}`} aria-hidden="true"></i>
                        </span>
                        <span className="nav-text ms-2">{label}</span>
                        <span className="nav-chevron ms-auto">
                          <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>
                        </span>
                      </button>

                      <div
                        style={{
                          maxHeight: isOpen ? "400px" : "0",
                          overflow: "hidden",
                          transition: "max-height 0.28s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      >
                        <div className="sublink-container d-grid gap-1 mt-1 mb-1">
                          {subLinks.map((sub) => (
                            <NavLink
                              key={sub.to}
                              to={sub.to}
                              className={({ isActive }) => `nav-sub-link${isActive ? " active" : ""}`}
                              onClick={() => {
                                if (!window.matchMedia("(min-width: 992px)").matches) {
                                  onLinkClick?.();
                                }
                              }}
                            >
                              <span className="sublink-dot"></span>
                              <span className="nav-text">{sub.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

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
                    <span className="nav-icon flex-shrink-0">
                      <i className={`bi ${icon}`} aria-hidden="true"></i>
                    </span>
                    <span className="nav-text ms-2">{label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User Profile Card ── */}
      {/* <div className="sidebar-user-card mx-3 mb-3 p-3 rounded-4">
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative flex-shrink-0">
            <img
              className="sidebar-user-avatar rounded-circle"
              src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
              alt={name}
            />
            <span className="sidebar-status-online"></span>
          </div>
          <div className="overflow-hidden flex-grow-1">
            <h6 className="sidebar-user-name text-truncate m-0">{name}</h6>
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
      </div> */}

      {/* ── Footer Status ── */}
      <div className="sidebar-footer px-3 py-2 d-flex align-items-center gap-2">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">System • Operational</span>
      </div>

    </aside>
  );
}