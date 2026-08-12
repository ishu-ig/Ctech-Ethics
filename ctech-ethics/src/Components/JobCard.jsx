import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MapPin, Briefcase, IndianRupee, Send, X, ArrowRight,
    UploadCloud, CheckCircle2,
    GraduationCap, Clock3, Building2
} from "lucide-react";

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

    return (
        <Reveal className="glass-card job-card d-flex flex-column h-100" delay={delay}>

            {/* --- HEADER --- */}
            {isPlacement ? (
                <div className="job-card-top mb-2 mb-md-3">
                    <div className="d-none d-md-block">
                        <CompanyLogo company={job?.company} theme={job?.theme} />
                    </div>
                    <div className="job-card-heading">
                        <span className="job-dept-pill mb-1">{job?.category}</span>
                        <h3 className="job-card-title text-truncate">{job?.title}</h3>
                        <span className="job-company text-truncate d-block">
                            <Building2 size={13} /> {job?.company}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="job-card-header mb-2 mb-md-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-2">
                        <span className="job-dept-pill">{job?.department || job?.category}</span>
                        {job?.salary && (
                            <span className="job-salary-badge">
                                <IndianRupee size={12} className="me-1" />
                                {typeof job.salary === 'string' ? job.salary.replace(/₹/g, "") : job.salary}
                            </span>
                        )}
                    </div>
                    <h3 className="job-card-title text-truncate">{job?.title}</h3>
                </div>
            )}

            {/* --- BODY --- */}
            {/* Description is strictly hidden on mobile to save vertical space */}
            <p className="job-desc mb-3 d-none d-md-block">{job?.description}</p>

            <div className="job-meta-row mb-2 mb-md-3">
                {/* Hide Type & Experience on Mobile */}
                <span className="meta-pill d-none d-md-inline-flex">
                    <Briefcase size={12} /> {job?.type}
                </span>
                <span className="meta-pill d-none d-md-inline-flex">
                    <GraduationCap size={12} /> {job?.experience}
                </span>
                {/* Show only Location on Mobile */}
                <span className="meta-pill text-truncate" style={{ maxWidth: '100%' }}>
                    <MapPin size={12} /> {job?.location}
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
            <div className="mb-2 mb-md-4" style={{ overflow: 'hidden' }}>

                {/* Desktop View: Normal Wrap Layout */}
                <div className="d-none d-md-flex flex-wrap gap-2">
                    {skillsList.map((s) => (
                        <span key={s} className="skill-pill">{s}</span>
                    ))}
                </div>

                {/* Mobile View: Swiper Carousel */}
                <div className="d-block d-md-none w-100">
                    <Swiper
                        modules={[FreeMode]}
                        slidesPerView="auto"
                        spaceBetween={6}
                        freeMode={true}
                        grabCursor={true}
                    >
                        {skillsList.map((s) => (
                            <SwiperSlide key={s} style={{ width: "auto" }}>
                                <span className="skill-pill d-block">{s}</span>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

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

export function ApplyModal({ open, job, onClose }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [fileName, setFileName] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(EMPTY_FORM);
            setFileName("");
            setSubmitted(false);
        }
    }, [open, job]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const jobLabel = job
        ? `${job.title}${job.company ? ` · ${job.company}` : ""}`
        : "General Application";

    return (
        <div className="cjd-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="cjd-modal-card" role="dialog" aria-modal="true">
                <div className="cjd-modal-accent" />
                <button className="cjd-modal-close" onClick={onClose} aria-label="Close">
                    <X size={16} />
                </button>

                {!submitted ? (
                    <>
                        <div className="cjd-modal-header">
                            <span className="cjd-modal-eyebrow">{job ? "Apply for" : "Application"}</span>
                            <h3 className="cjd-modal-title">{jobLabel}</h3>
                            <p className="cjd-modal-sub">
                                {job
                                    ? "Tell us a bit about yourself — it takes less than two minutes."
                                    : "Tell us a bit about you and we'll match you to open roles."}
                            </p>
                        </div>

                        <form className="cjd-form" onSubmit={handleSubmit}>
                            <div className="cjd-field">
                                <label>Full Name</label>
                                <input required type="text" placeholder="Jane Cooper" value={form.name} onChange={update("name")} />
                            </div>

                            <div className="cjd-field-row">
                                <div className="cjd-field">
                                    <label>Email</label>
                                    <input required type="email" placeholder="jane@email.com" value={form.email} onChange={update("email")} />
                                </div>
                                <div className="cjd-field">
                                    <label>Phone Number</label>
                                    <input required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} />
                                </div>
                            </div>

                            <div className="cjd-field">
                                <label>Resume</label>
                                <label className="cjd-file-drop">
                                    <UploadCloud size={16} />
                                    <span>{fileName || "Upload PDF or DOCX (max 5MB)"}</span>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx"
                                        hidden
                                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                                    />
                                </label>
                            </div>

                            <div className="cjd-field">
                                <label>Cover Message <em>(optional)</em></label>
                                <textarea rows={4} placeholder="Why are you a great fit for this role?" value={form.message} onChange={update("message")} />
                            </div>

                            <button type="submit" className="cjd-submit-btn">
                                Submit Application <ArrowRight size={16} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="cjd-success">
                        <div className="cjd-success-icon"><CheckCircle2 size={26} /></div>
                        <h3>Application sent</h3>
                        <p>
                            Thanks, {form.name.split(" ")[0] || "there"} — our team will review
                            {job ? <> your application for <strong>{jobLabel}</strong></> : " your profile"} and
                            reach out within 3–5 business days.
                        </p>
                        <button className="cjd-submit-btn" onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}