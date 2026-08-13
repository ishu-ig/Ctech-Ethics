import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteApplication,
    getApplication,
    updateApplication,
} from "../../Redux/ActionCreators/ApplicationActionCreators";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

// Classes only — actual colors live as CSS variables below.
const STATUS_BADGE = {
    Pending:     "status-badge status-pending",
    Reviewed:    "status-badge status-reviewed",
    Shortlisted: "status-badge status-shortlisted",
    Rejected:    "status-badge status-rejected",
};

export default function AdminShowApplication() {
    let { _id } = useParams();
    let [data, setData] = useState({});
    let [flag, setFlag] = useState(true);

    let ApplicationStateData = useSelector((state) => state.ApplicationStateData);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    function deleteRecord() {
        if (window.confirm("Are you sure you want to delete this application?")) {
            dispatch(deleteApplication({ _id: _id }));
            navigate("/application");
        }
    }

    function updateStatus(newStatus) {
        if (data.status === newStatus) return;
        if (window.confirm(`Change status to "${newStatus}"?`)) {
            dispatch(updateApplication({ ...data, status: newStatus }));
            setData((old) => ({ ...old, status: newStatus }));
            setFlag(!flag);
        }
    }

    useEffect(() => {
        dispatch(getApplication());
        if (ApplicationStateData.length) {
            let item = ApplicationStateData.find((x) => x._id === _id);
            if (item) setData({ ...item });
            else alert("Invalid Application Id");
        }
    }, [ApplicationStateData.length, _id, dispatch]);

    const job = data.jobId;

    const getInitials = (name) => {
        if (!name) return "CA";
        const parts = name.split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    };

    return (
        <main className="dashboard-content app-detail">
            <style>{`
                /* ===== Theme tokens — bridged to global admin theme ===== */
                .app-detail {
                    --ad-accent:          var(--admin-primary, #2563eb);
                    --ad-accent-2:        var(--admin-success, #0f766e);
                    --ad-danger:          var(--admin-danger, #dc2626);
                    --ad-danger-soft:     rgba(220, 38, 38, 0.12);

                    --ad-surface:         var(--admin-surface, #ffffff);
                    --ad-surface-muted:   var(--admin-surface-soft, #f8fafc);
                    --ad-surface-subtle:  var(--admin-bg, #f5f7fb);
                    --ad-border:          var(--admin-border, #dbe4ef);

                    --ad-text:            var(--admin-text, #1f2937);
                    --ad-text-muted:      var(--admin-muted, #6b7280);
                    --ad-text-on-accent:  #ffffff;

                    --ad-radius-lg:       12px;
                    --ad-radius-md:       8px;
                    --ad-radius-pill:     999px;
                    --ad-shadow-card:     var(--admin-shadow-sm, 0 10px 24px rgba(15,23,42,0.06));
                    --ad-shadow-hover:    var(--admin-shadow-lg, 0 26px 70px rgba(15,23,42,0.12));
                    --ad-shadow-avatar:   var(--admin-shadow, 0 18px 46px rgba(15,23,42,0.09));

                    --ad-status-pending-bg:        var(--admin-muted, #6b7280);
                    --ad-status-pending-color:     #ffffff;
                    --ad-status-reviewed-bg:       #0dcaf0;
                    --ad-status-reviewed-color:    #05323d;
                    --ad-status-shortlisted-bg:    var(--admin-primary, #2563eb);
                    --ad-status-shortlisted-color: #ffffff;
                    --ad-status-rejected-bg:       var(--admin-danger, #dc2626);
                    --ad-status-rejected-color:    #ffffff;

                    --ad-font-heading: 'Sora', 'Segoe UI', sans-serif;
                }

                /* ===== Page chrome ===== */
                .app-detail .page-icon-box {
                    width: 50px; height: 50px;
                    border-radius: var(--ad-radius-md);
                    background: var(--ad-surface-subtle);
                    color: var(--ad-accent);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.4rem; flex-shrink: 0;
                }
                .app-detail .eyebrow-label {
                    color: var(--ad-accent);
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 1px; text-transform: uppercase;
                }
                .app-detail .page-title { color: var(--ad-text); }

                /* ===== Cards ===== */
                .app-detail .detail-card {
                    background: var(--ad-surface);
                    border: 1px solid var(--ad-border);
                    border-radius: var(--ad-radius-lg);
                    box-shadow: var(--ad-shadow-card);
                    margin-bottom: 20px; overflow: hidden;
                    transition: box-shadow .18s ease;
                }
                .app-detail .detail-card:hover { box-shadow: var(--ad-shadow-hover); }
                .app-detail .detail-card-header {
                    background: var(--ad-surface-muted);
                    border-bottom: 1px solid var(--ad-border);
                    padding: 16px 20px; font-weight: 600;
                    color: var(--ad-text);
                    display: flex; align-items: center; gap: 10px;
                }
                .app-detail .detail-card-header.is-danger { border-bottom-color: var(--ad-danger-soft); }
                .app-detail .detail-card-body { padding: 20px; }

                /* ===== Avatar ===== */
                .app-detail .applicant-avatar {
                    width: 72px; height: 72px;
                    border-radius: var(--ad-radius-md);
                    background: linear-gradient(135deg, var(--ad-accent), var(--ad-accent-2));
                    color: var(--ad-text-on-accent);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.8rem; font-weight: 700;
                    font-family: var(--ad-font-heading);
                    box-shadow: var(--ad-shadow-avatar); flex-shrink: 0;
                }
                .app-detail .applicant-name  { color: var(--ad-text); }
                .app-detail .applicant-meta  { color: var(--ad-text-muted); font-size: 0.9rem; }
                .app-detail .applied-date    { color: var(--ad-text-muted); font-size: 0.75rem; margin-top: 8px; }

                /* ===== Status badges ===== */
                .app-detail .status-badge {
                    font-weight: 600; font-size: 0.85rem;
                    padding: 0.45rem 1rem;
                    border-radius: var(--ad-radius-pill);
                    display: inline-block;
                }
                .app-detail .status-pending     { background: var(--ad-status-pending-bg);     color: var(--ad-status-pending-color); }
                .app-detail .status-reviewed    { background: var(--ad-status-reviewed-bg);    color: var(--ad-status-reviewed-color); }
                .app-detail .status-shortlisted { background: var(--ad-status-shortlisted-bg); color: var(--ad-status-shortlisted-color); }
                .app-detail .status-rejected    { background: var(--ad-status-rejected-bg);    color: var(--ad-status-rejected-color); }

                /* ===== Info list ===== */
                .app-detail .info-list { list-style: none; padding: 0; margin: 0; }
                .app-detail .info-list li {
                    display: flex; padding: 12px 0;
                    border-bottom: 1px dashed var(--ad-border);
                }
                .app-detail .info-list li:last-child { border-bottom: none; padding-bottom: 0; }
                .app-detail .info-list .info-label {
                    width: 140px; color: var(--ad-text-muted);
                    font-size: 0.9rem; font-weight: 500; flex-shrink: 0;
                }
                .app-detail .info-list .info-value {
                    color: var(--ad-text); font-weight: 500; font-size: 0.95rem;
                }
                .app-detail .info-value.is-accent { color: var(--ad-accent); font-weight: 700; }

                /* ===== Cover letter ===== */
                .app-detail .cover-letter-box {
                    background: var(--ad-surface-muted);
                    border: 1px solid var(--ad-border);
                    border-radius: var(--ad-radius-md);
                    padding: 20px; font-size: 0.95rem;
                    line-height: 1.6; color: var(--ad-text);
                    white-space: pre-wrap;
                }
                .app-detail .empty-note {
                    color: var(--ad-text-muted);
                    font-style: italic; padding: 12px 0; text-align: center;
                }

                /* ===== Resume card ===== */
                .app-detail .resume-icon       { font-size: 3rem; color: var(--ad-danger); margin-bottom: 8px; }
                .app-detail .resume-icon-empty { font-size: 2rem; color: var(--ad-text-muted); }
                .app-detail .resume-hint       { color: var(--ad-text-muted); font-size: 0.85rem; }

                /* ===== Actions ===== */
                .app-detail .status-select-wrapper {
                    background: var(--ad-surface-subtle);
                    padding: 16px;
                    border-radius: var(--ad-radius-md);
                    border: 1px solid var(--ad-border);
                }
                .app-detail .status-select-label {
                    color: var(--ad-text-muted); font-weight: 700;
                    font-size: 0.85rem; margin-bottom: 8px;
                }
                .app-detail .icon-accent { color: var(--ad-accent); }
                .app-detail .icon-danger { color: var(--ad-danger); }
                .app-detail .btn-danger-soft {
                    background: var(--ad-surface);
                    border: 1px solid var(--ad-danger-soft);
                    color: var(--ad-danger);
                    font-weight: 700;
                    border-radius: var(--ad-radius-md);
                    transition: background .15s ease, color .15s ease;
                }
                .app-detail .btn-danger-soft:hover {
                    background: var(--ad-danger);
                    color: var(--ad-text-on-accent);
                    border-color: var(--ad-danger);
                }
            `}</style>

            <div className="container-fluid px-3 px-lg-4 py-4">
                {/* PAGE HEADING */}
                <div className="page-heading d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                    <div className="page-heading-copy d-flex align-items-center gap-3">
                        <span className="page-icon-box">
                            <i className="bi bi-person-badge-fill" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p className="eyebrow-label mb-1">Management</p>
                            <h1 className="h4 mb-0 fw-bold page-title">Job Application Details</h1>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm rounded-pill px-3" to="/application">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to List
                        </Link>
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT COLUMN: CANDIDATE INFO, JOB INFO & COVER LETTER */}
                    <div className="col-12 col-xl-8">

                        {/* 1. Candidate Profile Header */}
                        <div className="detail-card">
                            <div className="detail-card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="applicant-avatar">
                                        {getInitials(data.name)}
                                    </div>
                                    <div>
                                        <h2 className="h4 fw-bold mb-1 applicant-name">{data.name || "Unknown Candidate"}</h2>
                                        <div className="d-flex flex-wrap gap-3 applicant-meta">
                                            <span className="d-flex align-items-center gap-1"><i className="bi bi-envelope"></i> {data.email}</span>
                                            <span className="d-flex align-items-center gap-1"><i className="bi bi-telephone"></i> {data.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xl-end">
                                    <span className={STATUS_BADGE[data.status] || "status-badge status-pending"}>
                                        {data.status || "Pending"}
                                    </span>
                                    <div className="applied-date">
                                        Applied: {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Job Information */}
                        <div className="detail-card">
                            <div className="detail-card-header">
                                <i className="bi bi-info-circle icon-accent"></i> Job Information
                            </div>
                            <div className="detail-card-body p-0">
                                <ul className="info-list px-4 py-2">
                                    <li>
                                        <span className="info-label">Applied For</span>
                                        <span className="info-value is-accent">{job?.title || data.jobTitle || "General Application"}</span>
                                    </li>
                                    {job ? (
                                        <>
                                            <li>
                                                <span className="info-label">Department</span>
                                                <span className="info-value">{job.department || "—"}</span>
                                            </li>
                                            <li>
                                                <span className="info-label">Job Type</span>
                                                <span className="info-value">{job.type || "—"}</span>
                                            </li>
                                            <li>
                                                <span className="info-label">Experience</span>
                                                <span className="info-value">{job.experience || "—"}</span>
                                            </li>
                                            <li>
                                                <span className="info-label">Location</span>
                                                <span className="info-value">
                                                    {typeof job.location === "string"
                                                        ? job.location
                                                        : [job.location?.city, job.location?.state].filter(Boolean).join(", ") || "Remote"}
                                                </span>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <span className="info-label">Type</span>
                                            <span className="info-value">Open / General Interest</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* 3. Cover Letter / Message */}
                        <div className="detail-card">
                            <div className="detail-card-header">
                                <i className="bi bi-chat-left-text icon-accent"></i> Cover Letter / Message
                            </div>
                            <div className="detail-card-body">
                                {data.message ? (
                                    <div className="cover-letter-box">{data.message}</div>
                                ) : (
                                    <div className="empty-note">No cover letter or message provided by the candidate.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESUME & ACTIONS */}
                    <div className="col-12 col-xl-4">

                        {/* 4. Resume Card */}
                        <div className="detail-card">
                            <div className="detail-card-header">
                                <i className="bi bi-file-earmark-person icon-accent"></i> Attached Resume
                            </div>
                            <div className="detail-card-body text-center">
                                {data.resume ? (
                                    <>
                                        <i className="bi bi-file-earmark-pdf resume-icon"></i>
                                        <p className="resume-hint mb-3">Candidate has uploaded a resume document.</p>
                                        <a href={data.resume} target="_blank" rel="noreferrer" className="btn btn-outline-primary w-100 rounded-pill fw-bold">
                                            <i className="bi bi-cloud-download me-2"></i> View &amp; Download Resume
                                        </a>
                                    </>
                                ) : (
                                    <div className="py-3">
                                        <i className="bi bi-file-earmark-x resume-icon-empty"></i>
                                        <p className="resume-hint mt-2 mb-0">No resume file attached.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. Actions Card */}
                        <div className="detail-card">
                            <div className="detail-card-header is-danger">
                                <i className="bi bi-gear icon-danger"></i> Application Actions
                            </div>
                            <div className="detail-card-body">
                                <div className="status-select-wrapper mb-3">
                                    <label htmlFor="appStatusSelect" className="form-label status-select-label d-block">
                                        Update Current Status
                                    </label>
                                    <select
                                        id="appStatusSelect"
                                        className="form-select fw-semibold"
                                        value={data.status || "Pending"}
                                        onChange={(e) => updateStatus(e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="btn btn-danger-soft w-100" onClick={deleteRecord}>
                                    <i className="bi bi-trash3 me-2" aria-hidden="true"></i> Delete Application
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}