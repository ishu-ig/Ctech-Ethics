import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deletePlacementApplication,
    getPlacementApplication,
    updatePlacementApplication,
} from "../../Redux/ActionCreators/PlacementAppicationActionCreators";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

// Classes only — actual colors live as CSS variables in the stylesheet below,
// so a theme swap means editing the :root block, not this map.
const STATUS_BADGE = {
    Pending: "status-badge status-pending",
    Reviewed: "status-badge status-reviewed",
    Shortlisted: "status-badge status-shortlisted",
    Rejected: "status-badge status-rejected",
};

export default function AdminShowPlacementApplication() {
    let { _id } = useParams();
    let [data, setData] = useState({});
    let [flag, setFlag] = useState(true);

    let PlacementApplicationStateData = useSelector(
        (state) => state.PlacementApplicationStateData
    );
    let dispatch = useDispatch();
    let navigate = useNavigate();

    function deleteRecord() {
        if (window.confirm("Are you sure you want to delete this application?")) {
            dispatch(deletePlacementApplication({ _id: _id }));
            navigate("/placementApplication");
        }
    }

    function updateStatus(newStatus) {
        if (data.status === newStatus) return;
        if (window.confirm(`Change status to "${newStatus}"?`)) {
            dispatch(updatePlacementApplication({ ...data, status: newStatus }));
            setData((old) => ({ ...old, status: newStatus }));
            setFlag(!flag);
        }
    }

    useEffect(() => {
        dispatch(getPlacementApplication());
        if (PlacementApplicationStateData.length) {
            let item = PlacementApplicationStateData.find((x) => x._id === _id);
            if (item) setData({ ...item });
            else alert("Invalid Application Id");
        }
    }, [PlacementApplicationStateData.length, _id, dispatch]);

    const job = data.jobId; // populated Placement doc, or null for general applications

    // Helper to get initials for the avatar
    const getInitials = (name) => {
        if (!name) return "CA";
        const parts = name.split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    };

    return (
        <main className="dashboard-content pa-detail">
            <style>{`
                /* ===== Theme tokens — bridge to global admin theme ===== */
                .pa-detail {
                    --pa-accent:          var(--admin-primary, #2563eb);
                    --pa-accent-2:        var(--admin-success, #0f766e);
                    --pa-accent-soft:     var(--admin-bg, #f5f7fb);
                    --pa-danger:          var(--admin-danger, #dc2626);
                    --pa-danger-soft:     rgba(220, 38, 38, 0.12);

                    --pa-surface:         var(--admin-surface, #ffffff);
                    --pa-surface-muted:   var(--admin-surface-soft, #f8fafc);
                    --pa-surface-subtle:  var(--admin-bg, #f5f7fb);
                    --pa-border:          var(--admin-border, #dbe4ef);
                    --pa-border-dashed:   var(--admin-border, #dbe4ef);

                    --pa-text:            var(--admin-text, #1f2937);
                    --pa-text-muted:      var(--admin-muted, #6b7280);
                    --pa-text-soft:       var(--admin-text, #1f2937);
                    --pa-text-on-accent:  #ffffff;

                    --pa-radius-lg: 12px;
                    --pa-radius-md: 8px;
                    --pa-radius-pill: 999px;
                    --pa-shadow-card:   var(--admin-shadow-sm, 0 10px 24px rgba(15,23,42,0.06));
                    --pa-shadow-avatar: var(--admin-shadow, 0 18px 46px rgba(15,23,42,0.09));

                    --pa-status-pending-bg:        var(--admin-muted, #6b7280);
                    --pa-status-pending-color:     #ffffff;
                    --pa-status-reviewed-bg:       #0dcaf0;
                    --pa-status-reviewed-color:    #05323d;
                    --pa-status-shortlisted-bg:    var(--admin-primary, #2563eb);
                    --pa-status-shortlisted-color: #ffffff;
                    --pa-status-rejected-bg:       var(--admin-danger, #dc2626);
                    --pa-status-rejected-color:    #ffffff;

                    --pa-font-heading: 'Sora', 'Segoe UI', sans-serif;
                }

                /* ===== Layout / page chrome ===== */
                .pa-detail .page-icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: var(--pa-radius-md);
                    background: var(--pa-surface-subtle);
                    color: var(--pa-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    flex-shrink: 0;
                }
                .pa-detail .eyebrow-label {
                    color: var(--pa-accent);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .pa-detail .page-title {
                    color: var(--pa-text);
                }

                /* ===== Cards ===== */
                .pa-detail .detail-card {
                    background: var(--pa-surface);
                    border: 1px solid var(--pa-border);
                    border-radius: var(--pa-radius-lg);
                    box-shadow: var(--pa-shadow-card);
                    margin-bottom: 20px;
                    overflow: hidden;
                    transition: box-shadow .18s ease, transform .18s ease;
                }
                .pa-detail .detail-card:hover {
                    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.07);
                }
                .pa-detail .detail-card-header {
                    background: var(--pa-surface-muted);
                    border-bottom: 1px solid var(--pa-border);
                    padding: 16px 20px;
                    font-weight: 600;
                    color: var(--pa-text);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .pa-detail .detail-card-header.is-danger {
                    border-bottom-color: var(--pa-danger-soft);
                }
                .pa-detail .detail-card-body {
                    padding: 20px;
                }

                /* ===== Avatar ===== */
                .pa-detail .applicant-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: var(--pa-radius-md);
                    background: linear-gradient(135deg, var(--pa-accent), var(--pa-accent-2));
                    color: var(--pa-text-on-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    font-weight: 700;
                    font-family: var(--pa-font-heading);
                    box-shadow: var(--pa-shadow-avatar);
                    flex-shrink: 0;
                }
                .pa-detail .applicant-name {
                    color: var(--pa-text);
                }
                .pa-detail .applicant-meta {
                    color: var(--pa-text-muted);
                    font-size: 0.9rem;
                }
                .pa-detail .applied-date {
                    color: var(--pa-text-muted);
                    font-size: 0.75rem;
                    margin-top: 8px;
                }

                /* ===== Status badges ===== */
                .pa-detail .status-badge {
                    font-weight: 600;
                    font-size: 0.85rem;
                    padding: 0.5rem 1rem;
                    border-radius: var(--pa-radius-pill);
                    display: inline-block;
                }
                .pa-detail .status-pending {
                    background: var(--pa-status-pending-bg);
                    color: var(--pa-status-pending-color);
                }
                .pa-detail .status-reviewed {
                    background: var(--pa-status-reviewed-bg);
                    color: var(--pa-status-reviewed-color);
                }
                .pa-detail .status-shortlisted {
                    background: var(--pa-status-shortlisted-bg);
                    color: var(--pa-status-shortlisted-color);
                }
                .pa-detail .status-rejected {
                    background: var(--pa-status-rejected-bg);
                    color: var(--pa-status-rejected-color);
                }

                /* ===== Info list ===== */
                .pa-detail .info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .pa-detail .info-list li {
                    display: flex;
                    padding: 12px 0;
                    border-bottom: 1px dashed var(--pa-border-dashed);
                }
                .pa-detail .info-list li:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .pa-detail .info-list .info-label {
                    width: 140px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    flex-shrink: 0;
                }
                .pa-detail .info-list .info-value {
                    
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                .pa-detail .info-value.is-accent {
                  
                    font-weight: 700;
                }

                /* ===== Cover letter ===== */
                .pa-detail .cover-letter-box {
                    padding: 20px;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
                .pa-detail .empty-note {
                    font-style: italic;
                    padding: 12px 0;
                    text-align: center;
                }

                /* ===== Resume card ===== */
                .pa-detail .resume-icon {
                    font-size: 3rem;
                    color: var(--pa-danger);
                    margin-bottom: 8px;
                }
                .pa-detail .resume-icon-empty {
                    font-size: 2rem;
                    color: var(--pa-text-muted);
                }
                .pa-detail .resume-hint {
                    color: var(--pa-text-muted);
                    font-size: 0.85rem;
                }

                /* ===== Actions ===== */
                .pa-detail .status-select-wrapper {
                    background: var(--pa-surface-subtle);
                    padding: 16px;
                    border-radius: var(--pa-radius-md);
                    border: 1px solid var(--pa-border);
                }
                .pa-detail .status-select-label {
                    color: var(--pa-text-muted);
                    font-weight: 700;
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                }
                .pa-detail .icon-accent {
                    color: var(--pa-accent);
                }
                .pa-detail .icon-danger {
                    color: var(--pa-danger);
                }
                .pa-detail .btn-danger-soft {
                    background: var(--pa-surface);
                    border: 1px solid var(--pa-danger-soft);
                    color: var(--pa-danger);
                    font-weight: 700;
                    transition: background .15s ease, color .15s ease;
                }
                .pa-detail .btn-danger-soft:hover {
                    background: var(--pa-danger);
                    color: var(--pa-text-on-accent);
                    border-color: var(--pa-danger);
                }
            `}</style>

            <div className="container-fluid px-3 px-lg-4 py-4">
                {/* PAGE HEADING */}
                <div className="page-heading d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                    <div className="page-heading-copy d-flex align-items-center gap-3">
                        <span className="page-icon-box">
                            <i className="bi bi-briefcase-fill" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p className="eyebrow-label mb-1">Management</p>
                            <h1 className="h4 mb-0 fw-bold page-title">Placement Application</h1>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm rounded-pill px-3" to="/placementApplication">
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
                                        <span className="info-value is-accent">{job?.jobTitle || job?.title || data.jobTitle || "General Application"}</span>
                                    </li>
                                    {job ? (
                                        <>
                                            <li>
                                                <span className="info-label">Company</span>
                                                <span className="info-value">{job.companyName || job.company || "—"}</span>
                                            </li>
                                            <li>
                                                <span className="info-label">Category</span>
                                                <span className="info-value">{job.category || job.department || "—"}</span>
                                            </li>
                                            <li>
                                                <span className="info-label">Job Type</span>
                                                <span className="info-value">{job.type || "—"}</span>
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
                                    <div className="cover-letter-box">
                                        {data.message}
                                    </div>
                                ) : (
                                    <div className="empty-note">
                                        No cover letter or message provided by the candidate.
                                    </div>
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
                                    <label htmlFor="statusSelect" className="form-label status-select-label d-block">
                                        Update Current Status
                                    </label>
                                    <select
                                        id="statusSelect"
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