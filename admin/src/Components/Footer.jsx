import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer py-3 border-top mt-auto">
      <div className="container-fluid px-3 px-lg-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="status-dot"></span>
          <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
            CTech Ethic Solution Admin Portal
          </span>
          <span className="text-muted opacity-50">|</span>
          <span className="text-muted small">© {currentYear} All Rights Reserved.</span>
        </div>

        <div className="d-flex align-items-center gap-3 small text-muted">
          <span className="d-none d-md-inline">System Status: <strong className="text-success">Operational</strong></span>
          <span className="text-muted opacity-50 d-none d-md-inline">•</span>
          <a href="#!" className="text-muted text-decoration-none hover-primary">Help & Support</a>
          <span className="text-muted opacity-50">•</span>
          <a href="#!" className="text-muted text-decoration-none hover-primary">Documentation</a>
        </div>
      </div>
    </footer>
  );
}