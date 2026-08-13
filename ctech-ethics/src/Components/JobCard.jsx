import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    MapPin, Briefcase, IndianRupee, Send, X, ArrowRight,
    UploadCloud, CheckCircle2,
    GraduationCap, Clock3, Building2, User, Mail, Phone, FileText, Sparkles, Loader2
} from "lucide-react";
import { createApplication } from "../Redux/ActionCreators/ApplicationActionCreators";
import { createPlacementApplication } from "../Redux/ActionCreators/PlacementAppicationActionCreator";

// --- Import Swiper ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';

/* ------------------------------------------------------------------ */
/*  SHARED HOOKS                                                       */
/* ------------------------------------------------------------------ */

export function useInView(options = { threshold: 0.2 }) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { setInView(true); return; }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
        }, options);
        observer.observe(node);
        return () => observer.disconnect();
    }, [options]);

    return [ref, inView];
}

/* ------------------------------------------------------------------ */
/*  DATE HELPERS                                                       */
/* ------------------------------------------------------------------ */

const DAY = 1000 * 60 * 60 * 24;

export function daysBetween(dateStr) {
    if (!dateStr) return 7;
    const target = new Date(typeof dateStr === "string" && !dateStr.includes("T") ? dateStr + "T00:00:00" : dateStr);
    if (isNaN(target.getTime())) return 7;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((target - now) / DAY);
}

export function formatPosted(dateStr) {
    if (!dateStr) return "Posted recently";
    const diff = -daysBetween(dateStr);
    if (diff <= 0) return "Posted today";
    if (diff === 1) return "Posted yesterday";
    if (diff < 30) return `Posted ${diff} days ago`;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Posted recently";
    return `Posted ${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;
}

export function formatDeadline(dateStr) {
    if (!dateStr) return "Open";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Open";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  SHARED PRESENTATIONAL PIECES                                       */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children }) {
    return (
        <div className="eyebrow">
            <span className="eyebrow-dot" />
            {children}
        </div>
    );
}

export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
    const [ref, inView] = useInView();
    return (
        <Tag
            ref={ref}
            className={`reveal ${inView ? "in-view" : ""} ${className}`}
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

const LOGO_THEMES = [
    ["#6ea8ff", "#4fd1c5"], ["#a78bfa", "#6ea8ff"], ["#4fd1c5", "#34d399"],
    ["#f6ad55", "#f687b3"], ["#6ea8ff", "#a78bfa"], ["#4fd1c5", "#6ea8ff"],
];

export function CompanyLogo({ company = "Company", theme = 0, size = 46 }) {
    const themeIdx = Math.abs(parseInt(theme, 10) || 0) % LOGO_THEMES.length;
    const colors = LOGO_THEMES[themeIdx] || LOGO_THEMES[0];
    const c1 = colors[0];
    const c2 = colors[1];
    const safeCompany = typeof company === "string" && company.trim() ? company : "Company";
    const initials = safeCompany
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "CO";

    return (
        <div
            className="company-logo"
            style={{ width: size, height: size, background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            aria-hidden="true"
        >
            {initials}
        </div>
    );
}

export function UrgencyChip({ deadline }) {
    const daysLeft = daysBetween(deadline);
    if (daysLeft < 0) return <span className="urgency-chip closed">Applications closed</span>;
    if (daysLeft <= 5) return <span className="urgency-chip warn">{daysLeft === 0 ? "Closes today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}</span>;
    return <span className="urgency-chip">{daysLeft} days left</span>;
}

/* ------------------------------------------------------------------ */
/*  COMMON JOB CARD                                                     */
/* ------------------------------------------------------------------ */

export default function JobCard({
    job = {},
    delay = 0,
    variant = "internal", // "internal" | "placement"
    detailsLink
}) {
    const isPlacement = variant === "placement";
    const link = detailsLink || `/jobdetails/${job?.id || job?._id || ''}`;
    const skillsList = Array.isArray(job?.skills) ? job.skills : [];

    const displayTitle = job?.jobTitle || job?.title || "Untitled Role";
    const displayCompany = job?.companyName || job?.company || (isPlacement ? "Partner Tech Firm" : "CTech Ethic");
    const displayCategory = job?.category || job?.department || "Technical";
    const displayDescription = job?.shortDescription || job?.description || "";

    let displayLocation = "Remote";
    if (typeof job?.location === "string" && job.location) {
        displayLocation = job.location;
    } else if (job?.location && typeof job.location === "object") {
        const locParts = [job.location.city, job.location.state].filter(Boolean);
        displayLocation = locParts.length > 0 ? locParts.join(", ") : "Remote";
    }

    return (
        <Reveal className="glass-card job-card d-flex flex-column h-100" delay={delay}>

            {/* --- HEADER --- */}
            {isPlacement ? (
                <div className="job-card-top mb-2 mb-md-3">
                    <div className="d-none d-md-block">
                        <CompanyLogo company={displayCompany} theme={job?.theme} />
                    </div>
                    <div className="job-card-heading">
                        <span className="job-dept-pill mb-1">{displayCategory}</span>
                        <h3 className="job-card-title text-truncate">{displayTitle}</h3>
                        <span className="job-company text-truncate d-block">
                            <Building2 size={13} /> {displayCompany}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="job-card-header mb-2 mb-md-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-2">
                        <span className="job-dept-pill">{displayCategory}</span>
                        {job?.salary && (
                            <span className="job-salary-badge">
                                <IndianRupee size={12} className="me-1" />
                                {typeof job.salary === 'string' ? job.salary.replace(/₹/g, "") : job.salary}
                            </span>
                        )}
                    </div>
                    <h3 className="job-card-title text-truncate">{displayTitle}</h3>
                </div>
            )}

            {/* --- BODY --- */}
            {/* Description is strictly hidden on mobile to save vertical space */}
            <p className="job-desc mb-3 d-none d-md-block">{displayDescription}</p>

            <div className="job-meta-row mb-2 mb-md-3">
                {/* Hide Type & Experience on Mobile */}
                <span className="meta-pill d-none d-md-inline-flex">
                    <Briefcase size={12} /> {job?.type || "Full-Time"}
                </span>
                <span className="meta-pill d-none d-md-inline-flex">
                    <GraduationCap size={12} /> {job?.experience || "Fresher"}
                </span>
                {/* Show only Location on Mobile */}
                <span className="meta-pill text-truncate" style={{ maxWidth: '100%' }}>
                    <MapPin size={12} /> {displayLocation}
                </span>

                {/* Placement Salary visibility rules */}
                {isPlacement && job?.salary && (
                    <span className="job-salary-badge d-inline-flex d-md-none text-truncate" style={{ maxWidth: '100%' }}>
                        <IndianRupee size={12} className="me-1" />
                        {job.salary}
                    </span>
                )}
            </div>

            {/* --- SKILLS CAROUSEL --- */}
            <div className="mb-2 mb-md-3 w-100 skill-pills-carousel" style={{ overflow: 'hidden' }}>
                <Swiper
                    modules={[FreeMode]}
                    slidesPerView="auto"
                    spaceBetween={8}
                    freeMode={true}
                    grabCursor={true}
                    className="w-100"
                >
                    {skillsList.map((s) => (
                        <SwiperSlide key={s} style={{ width: "auto" }}>
                            <span className="skill-pill d-inline-block text-nowrap">{s}</span>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* --- FOOTER / ACTIONS --- */}
            {isPlacement ? (
                <div className="job-card-footer mt-auto pt-2 pt-md-3 border-top">
                    <div className="job-footer-meta mb-2 d-none d-md-flex">
                        <span className="posted-date">
                            <Clock3 size={12} /> {formatPosted(job.posted)}
                        </span>
                        <UrgencyChip deadline={job.deadline} />
                    </div>
                    <Link to={link} className="btn btn-primary btn-block w-100">
                        <span>Apply</span>
                        <Send size={14} className="d-none d-md-inline-block" />
                    </Link>
                </div>
            ) : (
                <div className="mt-auto pt-1 pt-md-2">
                    <Link to={link} className="btn btn-primary btn-block w-100">
                        <span>Details</span>
                        <Send size={14} className="d-none d-md-inline-block" />
                    </Link>
                </div>
            )}
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  SHARED APPLY MODAL                                                  */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

export function ApplyModal({ open, job, onClose, isPlacement = false }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState(EMPTY_FORM);
    const [fileName, setFileName] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setForm(EMPTY_FORM);
            setFileName("");
            setResumeFile(null);
            setSubmitted(false);
            setLoading(false);
            setError("");
        }
    }, [open, job]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            setError("Please upload your resume to continue.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("message", form.message);
            formData.append("resume", resumeFile);
            formData.append("jobId", job?._id || job?.id || "");
            formData.append("jobTitle", job?.jobTitle || job?.title || "General Application");

            if (isPlacement) {
                dispatch(createPlacementApplication(formData));
            } else {
                dispatch(createApplication(formData));
            }
            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resolvedTitle = job?.jobTitle || job?.title;
    const resolvedCompany = job?.companyName || job?.company;
    const jobLabel = job
        ? `${resolvedTitle || 'Application'}${resolvedCompany ? ` · ${resolvedCompany}` : ""}`
        : "General Application";

    return (
        <div className="cjd-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="cjd-modal-card" role="dialog" aria-modal="true">
                <div className="cjd-modal-accent" />
                <button className="cjd-modal-close" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>

                {!submitted ? (
                    <>
                        <div className="cjd-modal-header">
                            <div className="cjd-modal-badge">
                                <Sparkles size={14} />
                                <span>{job ? "Direct Application" : "General Application"}</span>
                            </div>
                            <h3 className="cjd-modal-title">{jobLabel}</h3>
                            <p className="cjd-modal-sub">
                                {job
                                    ? "Tell us a bit about yourself — it takes less than two minutes."
                                    : "Tell us a bit about you and we'll match you to open roles."}
                            </p>
                        </div>

                        <form className="cjd-form" onSubmit={handleSubmit}>
                            <div className="cjd-field">
                                <label><User size={14} /> Full Name</label>
                                <input required type="text" placeholder="e.g. Jane Cooper" value={form.name} onChange={update("name")} />
                            </div>

                            <div className="cjd-field-row">
                                <div className="cjd-field">
                                    <label><Mail size={14} /> Email Address</label>
                                    <input required type="email" placeholder="jane@example.com" value={form.email} onChange={update("email")} />
                                </div>
                                <div className="cjd-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} />
                                </div>
                            </div>

                            <div className="cjd-field">
                                <label><FileText size={14} /> Resume / CV</label>
                                <label className={`cjd-file-drop ${fileName ? 'has-file' : ''}`}>
                                    {fileName ? (
                                        <div className="cjd-file-selected">
                                            <div className="cjd-file-icon">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div className="cjd-file-info">
                                                <span className="cjd-file-name">{fileName}</span>
                                                <span className="cjd-file-sub">Resume attached</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="cjd-file-remove"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setResumeFile(null);
                                                    setFileName("");
                                                }}
                                                title="Remove file"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="cjd-file-placeholder">
                                            <div className="cjd-upload-icon-box">
                                                <UploadCloud size={20} />
                                            </div>
                                            <div>
                                                <span className="cjd-upload-main">Click to upload resume</span>
                                                <span className="cjd-upload-sub">PDF or DOCX (Max 5MB)</span>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        required={!resumeFile}
                                        accept=".pdf,.doc,.docx"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            <div className="cjd-field">
                                <label><FileText size={14} /> Cover Note <em>(optional)</em></label>
                                <textarea rows={3} placeholder="Why are you a great fit for this role?" value={form.message} onChange={update("message")} />
                            </div>

                            {error && (
                                <p style={{ color: "#f87171", fontSize: "0.85rem", margin: 0 }}>{error}</p>
                            )}

                            <button type="submit" className="cjd-submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="cjd-spinner" /> Submitting Application...
                                    </>
                                ) : (
                                    <>Submit Application <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="cjd-success">
                        <div className="cjd-success-icon"><CheckCircle2 size={30} /></div>
                        <h3>Application Submitted!</h3>
                        <p>
                            Thanks, <strong>{form.name.split(" ")[0] || "there"}</strong> — our recruitment team will review
                            {job ? <> your profile for <strong>{jobLabel}</strong></> : " your details"} and
                            get back to you within 3–5 business days.
                        </p>
                        <button className="cjd-submit-btn" onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}