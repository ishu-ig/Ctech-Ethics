import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("token"),
          },
        }
      );
      response = await response.json();
      if (response.data) setData(response.data);
      else navigate("/login");
    })();
  }, [navigate]);

  const { name = "", username = "", email = "", phone = "", pic = "", role = "", company = "" } = data;

  const initials = name
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  const joinedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
    : "—";

  const roleBadgeColor = {
    "Super Admin": "text-bg-danger",
    Admin: "text-bg-primary",
    Recruiter: "text-bg-warning",
    JobSeeker: "text-bg-success",
  }[role] || "text-bg-secondary";

  const isRecruiter = role === "Recruiter";

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">

      {/* Page Heading */}
      <div className="page-heading mb-4">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i className="bi bi-person-badge" aria-hidden="true"></i>
          </span>
          <div>
            <p className="eyebrow mb-1">Account</p>
            <h1 className="h3 mb-1">My Profile</h1>
            <p className="text-muted mb-0 d-none d-sm-block">View your account details and role information.</p>
          </div>
        </div>
        <div className="page-heading-actions">
          <button className="btn btn-primary" onClick={() => navigate("/update-profile")}>
            <i className="bi bi-pencil-square me-sm-1" aria-hidden="true"></i>
            <span className="d-none d-sm-inline">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Cover Hero Banner */}
      <div className="profile-hero-banner mb-4">
        <div className="profile-hero-cover">
          <img src="/images/png/dasher-ui-bootstrap-5.jpg" alt="profile cover" />
          <div className="profile-hero-overlay"></div>
        </div>
        <div className="profile-hero-info px-3 px-md-4">
          <div className="profile-hero-avatar-wrap">
            {pic ? (
              <img
                className="profile-hero-avatar"
                src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
                alt={name}
              />
            ) : (
              <div
                className="profile-hero-avatar profile-hero-avatar-initials d-flex align-items-center justify-content-center fw-bold"
                style={{ background: "var(--bs-primary)", color: "#fff", userSelect: "none" }}
              >
                {initials}
              </div>
            )}
            <span className="profile-online-dot" title="Active"></span>
          </div>
          <div className="profile-hero-meta">
            <h2 className="profile-hero-name">{name || "—"}</h2>
            <p className="profile-hero-sub text-muted mb-2">
              {role === "JobSeeker" ? "Job Seeker" : role || "—"}
              {email && <span className="d-none d-md-inline ms-2">· {email}</span>}
            </p>
            <div className="d-flex flex-wrap gap-2">
              {role && <span className={`badge ${roleBadgeColor}`}>{role}</span>}
              <span className="badge text-bg-success">
                <i className="bi bi-patch-check-fill me-1"></i>Active
              </span>
              {joinedDate !== "—" && (
                <span className="badge text-bg-secondary d-none d-sm-inline">
                  <i className="bi bi-calendar3 me-1"></i>Joined {joinedDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-col layout */}
      <div className="row g-3 align-items-start">

        {/* Left: sidebar profile card */}
        <div className="col-12 col-xl-4 profile-col-sidebar">
          <div className="panel profile-sidebar-card text-center">

            <div className="mb-3">
              {pic ? (
                <img
                  className="profile-sidebar-avatar"
                  src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
                  alt={name}
                />
              ) : (
                <div
                  className="profile-sidebar-avatar profile-sidebar-avatar-initials d-flex align-items-center justify-content-center fw-bold mx-auto"
                  style={{ background: "var(--bs-primary)", color: "#fff", userSelect: "none" }}
                >
                  {initials}
                </div>
              )}
            </div>

            <h3 className="h5 mb-1">{name || "—"}</h3>
            <p className="text-muted small mb-3">{role === "JobSeeker" ? "Job Seeker" : role || "—"}</p>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
              {role && <span className={`badge ${roleBadgeColor}`}>{role}</span>}
              <span className="badge text-bg-success">
                <i className="bi bi-patch-check-fill me-1"></i>Active
              </span>
            </div>

            <div className="profile-sidebar-list text-start">
              {email && (
                <div className="profile-sidebar-row">
                  <span className="profile-sidebar-icon"><i className="bi bi-envelope"></i></span>
                  <div className="overflow-hidden">
                    <small className="text-muted d-block">Email</small>
                    <strong className="text-truncate d-block">{email}</strong>
                  </div>
                </div>
              )}
              {username && (
                <div className="profile-sidebar-row">
                  <span className="profile-sidebar-icon"><i className="bi bi-at"></i></span>
                  <div>
                    <small className="text-muted d-block">Username</small>
                    <strong>@{username}</strong>
                  </div>
                </div>
              )}
              {phone && (
                <div className="profile-sidebar-row">
                  <span className="profile-sidebar-icon"><i className="bi bi-telephone"></i></span>
                  <div>
                    <small className="text-muted d-block">Phone</small>
                    <strong>{phone}</strong>
                  </div>
                </div>
              )}
              {isRecruiter && company && (
                <div className="profile-sidebar-row">
                  <span className="profile-sidebar-icon"><i className="bi bi-building"></i></span>
                  <div>
                    <small className="text-muted d-block">Company</small>
                    <strong>{company}</strong>
                  </div>
                </div>
              )}
              {joinedDate !== "—" && (
                <div className="profile-sidebar-row profile-sidebar-row-last">
                  <span className="profile-sidebar-icon"><i className="bi bi-calendar3"></i></span>
                  <div>
                    <small className="text-muted d-block">Member Since</small>
                    <strong>{joinedDate}</strong>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right: detail panels */}
        <div className="col-12 col-xl-8 d-flex flex-column gap-3">

          {/* Account Overview */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-person-lines-fill" aria-hidden="true"></i>
                  <span>Account Overview</span>
                </h2>
                <p className="text-muted mb-0 small">A summary of your profile and access level.</p>
              </div>
            </div>
            <div className="row g-3 mt-1">
              <InfoRow icon="bi-person" label="Full Name" value={name || "—"} />
              <InfoRow icon="bi-at" label="Username" value={username ? `@${username}` : "—"} />
              <InfoRow icon="bi-envelope" label="Email" value={email || "—"} />
              <InfoRow icon="bi-telephone" label="Phone" value={phone || "—"} />
              {isRecruiter && (
                <InfoRow icon="bi-building" label="Company" value={company || "—"} />
              )}
              <InfoRow icon="bi-shield-check" label="Role" value={role || "—"} />
              <InfoRow icon="bi-toggle-on" label="Status" value="Active" />
              <InfoRow icon="bi-calendar3" label="Member Since" value={joinedDate} />
            </div>
          </div>

          {/* Security & Access */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-shield-lock" aria-hidden="true"></i>
                  <span>Security &amp; Access</span>
                </h2>
                <p className="text-muted mb-0 small">Your current permissions and access level.</p>
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-6 col-md-4">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon text-success">
                    <i className="bi bi-shield-check-fill"></i>
                  </div>
                  <div className="profile-stat-label">Account Status</div>
                  <div className="profile-stat-value text-success">Active</div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon text-primary">
                    <i className="bi bi-person-badge-fill"></i>
                  </div>
                  <div className="profile-stat-label">Access Role</div>
                  <div className="profile-stat-value">{role || "—"}</div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon text-warning">
                    <i className="bi bi-lock-fill"></i>
                  </div>
                  <div className="profile-stat-label">2FA Status</div>
                  <div className="profile-stat-value text-muted">Not Set</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-lightning-charge" aria-hidden="true"></i>
                  <span>Quick Actions</span>
                </h2>
                <p className="text-muted mb-0 small">Manage your account settings and security.</p>
              </div>
            </div>
            <div className="row g-2 mt-1">
              <div className="col-12 col-sm-4">
                <button
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate("/update-profile")}
                >
                  <i className="bi bi-pencil-square"></i>
                  <span>Update Profile</span>
                </button>
              </div>
              <div className="col-12 col-sm-4">
                <button
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate("/forgot-password")}
                >
                  <i className="bi bi-key"></i>
                  <span>Change Password</span>
                </button>
              </div>
              <div className="col-12 col-sm-4">
                <button
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => { localStorage.clear(); navigate("/login"); }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="col-12 col-sm-6">
      <div className="profile-info-row d-flex align-items-start gap-3">
        <span
          className="profile-info-icon d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
          style={{
            width: 36, height: 36,
            background: "var(--bs-primary-bg-subtle, rgba(var(--bs-primary-rgb),.1))",
            color: "var(--bs-primary)",
          }}
        >
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </span>
        <div className="overflow-hidden">
          <div className="text-muted small">{label}</div>
          <div className="fw-semibold text-truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}
