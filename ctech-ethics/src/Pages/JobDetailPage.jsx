import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft, Clock3, TrendingUp, MapPin, Coffee,
  Search, Building2, CalendarDays
} from "lucide-react";

import { JOBS, PROCESS_STEPS, BENEFITS } from "./CareerPage";
import { PLACEMENT_JOBS } from "./PlacementJobsPage";
import { ApplyModal, UrgencyChip, formatDeadline } from "../Components/JobCard";
import { getCareer } from "../Redux/ActionCreators/CareerActionCreators";
import { getPlacement } from "../Redux/ActionCreators/PlacementActionCreators";

/* ------------------------------------------------------------------ */
/*  GENERIC CONTENT SHARED ACROSS BOTH VARIANTS                        */
/* ------------------------------------------------------------------ */

const VALUE_PILLS = [
  { title: "Ownership", copy: "Act like a founder" },
  { title: "Craft", copy: "Sweat the details" },
  { title: "Growth", copy: "Learn every week" },
];

const GENERIC_CULTURE_COPY =
  "We're a small, fast-moving team that values ownership over hierarchy, candor over politics, and shipping over perfect plans. You'll have real autonomy here — and real accountability that comes with it.";

/* ------------------------------------------------------------------ */
/*  HELPERS & NORMALIZATION                                            */
/* ------------------------------------------------------------------ */

function normalizeCareerItem(item) {
  if (!item) return null;

  let locStr = "Remote";
  if (typeof item.location === "string" && item.location) {
    locStr = item.location;
  } else if (item.location && (item.location.city || item.location.state)) {
    locStr = [item.location.city, item.location.state].filter(Boolean).join(", ");
  }

  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim()) {
      return val.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    ...item,
    id: item._id || item.id,
    title: item.title,
    department: item.department || "Engineering",
    category: item.department || "Engineering",
    type: item.type || "Full-Time",
    experience: item.experience || "Fresher",
    location: locStr,
    salary: item.salary || "",
    description: item.description || item.shortDescription || "",
    responsibilities: toArray(item.responsibilities),
    eligibility: toArray(item.eligibility),
    skills: Array.isArray(item.skills) ? item.skills : toArray(item.skills),
    benefits: toArray(item.benefits),
    posted: item.postedDate || item.createdAt || new Date().toISOString(),
    deadline: item.deadline || null,
  };
}

/* ------------------------------------------------------------------ */
/*  NOT FOUND STATE                                                     */
/* ------------------------------------------------------------------ */

function JobNotFound() {
  return (
    <div className="cjd-page">
      <style>{CSS}</style>
      <div className="cjd-container cjd-not-found">
        <Search size={28} className="cjd-not-found-icon" />
        <h2>We couldn't find that role</h2>
        <p>It may have closed or the link might be off. Try browsing current openings instead.</p>
        <div className="cjd-not-found-actions">
          <Link to="/career" className="cjd-btn-ghost">Internal Openings</Link>
          <Link to="/placementjobs" className="cjd-apply-btn cjd-inline-btn">Placement Jobs</Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                           */
/* ------------------------------------------------------------------ */

export default function JobDetailsPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const rawCareers = useSelector((state) => state.CareerStateData);
  const rawPlacements = useSelector((state) => state.PlacementStateData);

  useEffect(() => {
    dispatch(getCareer());
    dispatch(getPlacement());
  }, [dispatch]);

  const careerList = Array.isArray(rawCareers) ? rawCareers : (rawCareers?.data || []);
  const placementList = Array.isArray(rawPlacements) ? rawPlacements : (rawPlacements?.data || []);

  // 1. Check PlacementStateData from Redux
  const matchedPlacementDoc = placementList.find(
    (j) => String(j._id || j.id) === String(id)
  );

  // 2. Check CareerStateData from Redux
  const matchedCareerDoc = careerList.find(
    (j) => String(j._id || j.id) === String(id)
  );

  // 3. Fallbacks
  const matchedStaticPlacement = PLACEMENT_JOBS.find((j) => String(j.id) === String(id));
  const matchedStaticInternal = JOBS.find((j) => String(j.id) === String(id));

  let job = null;
  let isPlacement = false;

  if (matchedPlacementDoc) {
    job = normalizeCareerItem(matchedPlacementDoc);
    isPlacement = true;
  } else if (matchedCareerDoc) {
    job = normalizeCareerItem(matchedCareerDoc);
    isPlacement = false;
  } else if (matchedStaticPlacement) {
    job = normalizeCareerItem(matchedStaticPlacement);
    isPlacement = true;
  } else if (matchedStaticInternal) {
    job = normalizeCareerItem(matchedStaticInternal);
    isPlacement = false;
  }


  if (!job) return <JobNotFound />;

  const backLink = isPlacement ? "/placementjobs" : "/career";
  const backLabel = isPlacement ? "Placement Jobs" : "Careers";
  const eyebrowLabel = isPlacement ? job.category : (job.department || job.category);

  // Benefits: placement jobs carry their own list of plain-text perks;
  // internal roles fall back to the company-wide benefits carousel content.
  const perks = isPlacement && job.benefits && job.benefits.length
    ? job.benefits.map((text, i) => ({ title: text, icon: null, key: `b-${i}` }))
    : BENEFITS.map((b) => ({ title: b.title, copy: b.copy, icon: b.icon, key: b.title }));

  return (
    <>
      <div className="cjd-page">
        <style>{CSS}</style>

        <div className="cjd-container">
          <Link to={backLink} className="cjd-back-link">
            <ChevronLeft size={16} /> Back to {backLabel}
          </Link>

          <div className="cjd-hero">
            <span className="cjd-eyebrow">{eyebrowLabel}</span>
            <h1>{job.title}</h1>
            {isPlacement && (
              <div className="cjd-hero-company"><Building2 size={14} /> {job.company}</div>
            )}
            <div className="cjd-meta-row">
              <span className="cjd-meta-chip"><Clock3 size={14} />{job.type}</span>
              <span className="cjd-meta-chip"><TrendingUp size={14} />{job.experience}</span>
              <span className="cjd-meta-chip"><MapPin size={14} />{job.location}</span>
              {job.salary && <span className="cjd-meta-chip salary"><Coffee size={14} />{job.salary}</span>}
            </div>
            {isPlacement && job.deadline && (
              <div className="cjd-hero-deadline">
                <span className="cjd-meta-chip"><CalendarDays size={14} />Apply by {formatDeadline(job.deadline)}</span>
                <UrgencyChip deadline={job.deadline} />
              </div>
            )}
          </div>

          <div className="cjd-layout">
            <div>
              <div className="cjd-card">
                <h2>Job Description</h2>
                <p>{job.description}</p>
              </div>

              {isPlacement && job.responsibilities && job.responsibilities.length > 0 && (
                <div className="cjd-card">
                  <h2>Key Responsibilities</h2>
                  <ul className="cjd-list">
                    {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              <div className="cjd-card">
                <h2>Required Skills</h2>
                <div className="cjd-skill-chips">
                  {job.skills.map((s, i) => <span key={i} className="cjd-skill-chip">{s}</span>)}
                </div>
              </div>

              {isPlacement && job.eligibility && job.eligibility.length > 0 && (
                <div className="cjd-card">
                  <h2>Eligibility</h2>
                  <ul className="cjd-list">
                    {job.eligibility.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}

              <div className="cjd-card">
                <h2>Benefits &amp; Perks</h2>
                <div className="cjd-perks-grid">
                  {perks.map((p) => (
                    <div key={p.key} className="cjd-perk-card">
                      {p.icon && <div className="cjd-perk-icon"><p.icon size={18} /></div>}
                      <h4>{p.title}</h4>
                      {p.copy && <p>{p.copy}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cjd-card">
                <h2>Recruitment Process</h2>
                <div className="cjd-timeline">
                  {PROCESS_STEPS.map((step, i) => (
                    <div key={step.title} className="cjd-tl-item">
                      <div className="cjd-tl-num">{String(i + 1).padStart(2, "0")}</div>
                      <div className="cjd-tl-body">
                        <h4>{step.title}</h4>
                        <p>{step.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cjd-card cjd-culture">
                <h2>{isPlacement ? `About ${job.company}` : "Company Culture"}</h2>
                <p>{isPlacement && job.companyInfo ? job.companyInfo : GENERIC_CULTURE_COPY}</p>
                <div className="cjd-culture-values">
                  {VALUE_PILLS.map((v) => (
                    <div key={v.title} className="cjd-value-pill">
                      <strong>{v.title}</strong><span>{v.copy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="cjd-sidebar-card">
                <h3>Job Overview</h3>
                <div className="cjd-sidebar-row"><span>{isPlacement ? "Category" : "Department"}</span><span>{eyebrowLabel}</span></div>
                {isPlacement && <div className="cjd-sidebar-row"><span>Company</span><span>{job.company}</span></div>}
                <div className="cjd-sidebar-row"><span>Job Type</span><span>{job.type}</span></div>
                <div className="cjd-sidebar-row"><span>Experience</span><span>{job.experience}</span></div>
                <div className="cjd-sidebar-row"><span>Location</span><span>{job.location}</span></div>
                {job.salary && <div className="cjd-sidebar-row"><span>Salary</span><span>{job.salary}</span></div>}
                {isPlacement && job.deadline && (
                  <div className="cjd-sidebar-row"><span>Deadline</span><span>{formatDeadline(job.deadline)}</span></div>
                )}
                <button className="cjd-apply-btn" onClick={() => setModalOpen(true)}>Apply Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Apply bar */}
        <div className="cjd-sticky-bar">
          <div className="info">
            <strong>{job.title}</strong>
            {job.location} · {job.type}
          </div>
          <button onClick={() => setModalOpen(true)}>Apply Now</button>
        </div>
      </div>

      <ApplyModal open={modalOpen} job={job} onClose={() => setModalOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

.cjd-page {
  --bg: #040810;
  --bg-alt: rgba(255,255,255,0.06);
  --surface: rgba(255,255,255,0.04);
  --surface-solid: #0b1329;
  --border: rgba(110,168,255,0.16);
  --ink: #ffffff;
  --muted: rgba(220,230,250,0.65);
  --accent: #6ea8ff;
  --accent-2: #4fd1c5;
  --accent-soft: rgba(110,168,255,0.12);
  --warn: #f6ad55;
  --warn-soft: rgba(246,173,85,0.14);
  --closed: rgba(220,230,250,0.4);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 12px 32px -12px rgba(0,0,0,0.6);
  --shadow-lg: 0 24px 60px -18px rgba(0,0,0,0.8);
  --radius: 18px;
  --radius-sm: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  line-height: 1.5;
  padding-bottom: 90px;
}

[data-theme="light"] .cjd-page {
  --bg: #f8fafc;
  --bg-alt: rgba(15,23,42,0.05);
  --surface: rgba(255,255,255,0.9);
  --surface-solid: #ffffff;
  --border: rgba(203,213,225,0.8);
  --ink: #0f172a;
  --muted: rgba(71,85,105,0.85);
  --accent: #2563eb;
  --accent-2: #0d9488;
  --accent-soft: rgba(37,99,235,0.08);
  --warn: #c2760a;
  --warn-soft: rgba(194,118,10,0.1);
  --closed: rgba(71,85,105,0.5);
}

.cjd-page *, .cjd-page *::before, .cjd-page *::after { box-sizing: border-box; }
.cjd-page h1, .cjd-page h2, .cjd-page h3, .cjd-page h4 {
  font-family: 'Sora', 'Inter', sans-serif; color: var(--ink); margin: 0; letter-spacing: -0.01em;
}
.cjd-page p { margin: 0; color: var(--muted); }
.cjd-page a { color: inherit; text-decoration: none; }
.cjd-page button { font-family: inherit; cursor: pointer; }
.cjd-page input, .cjd-page select, .cjd-page textarea { font-family: inherit; }

.cjd-container { max-width: 1180px; margin: 0 auto; padding: 44px 32px 72px; }

.cjd-back-link {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.86rem; font-weight: 600;
  color: var(--muted); margin-bottom: 26px; transition: color .2s;
}
.cjd-back-link:hover { color: var(--accent); }

.cjd-hero { max-width: 760px; margin-bottom: 40px; }
.cjd-eyebrow {
  display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-2); background: rgba(79, 209, 197, 0.12);
  border: 1px solid rgba(79, 209, 197, 0.28); padding: 4px 12px; border-radius: 100px; margin-bottom: 14px;
}
.cjd-hero h1 { font-size: clamp(1.7rem, 3.4vw, 2.4rem); line-height: 1.25; margin-bottom: 10px; }
.cjd-hero-company { display: flex; align-items: center; gap: 6px; font-size: 0.95rem; color: var(--muted); margin-bottom: 14px; }
.cjd-meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 4px; }
.cjd-meta-chip {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--muted);
  background: var(--bg-alt); border: 1px solid var(--border); padding: 6px 12px; border-radius: 999px;
}
.cjd-meta-chip.salary { color: var(--accent); border-color: rgba(110,168,255,0.3); background: var(--accent-soft); }
.cjd-hero-deadline { display: flex; align-items: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.urgency-chip { font-size: 0.74rem; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); white-space: nowrap; }
.urgency-chip.warn { background: var(--warn-soft); color: var(--warn); }
.urgency-chip.closed { background: var(--bg-alt); color: var(--closed); }

.cjd-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 28px; align-items: start; }
@media (max-width: 860px) { .cjd-layout { grid-template-columns: 1fr; } }

.cjd-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: var(--shadow-sm);
  padding: 30px; margin-bottom: 22px;
}
.cjd-card h2 { font-size: 1.15rem; margin-bottom: 16px; }
.cjd-card p { font-size: 0.94rem; line-height: 1.7; }

.cjd-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 9px; }
.cjd-list li { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

.cjd-skill-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cjd-skill-chip {
  font-size: 0.8rem; font-weight: 500; background: rgba(110, 168, 255, 0.08); color: var(--accent);
  border: 1px solid rgba(110, 168, 255, 0.2); padding: 6px 14px; border-radius: 999px;
}

.cjd-perks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 560px) { .cjd-perks-grid { grid-template-columns: 1fr; } }
.cjd-perk-card { background: var(--bg-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px; }
.cjd-perk-icon {
  width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--accent-soft), rgba(79,209,197,0.12)); color: var(--accent); margin-bottom: 10px;
}
.cjd-perk-card h4 { font-size: 0.92rem; margin-bottom: 6px; }
.cjd-perk-card p { font-size: 0.82rem; line-height: 1.55; }

.cjd-timeline { display: flex; flex-direction: column; gap: 18px; }
.cjd-tl-item { display: flex; gap: 16px; align-items: flex-start; }
.cjd-tl-num {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 600; color: var(--accent);
  background: var(--accent-soft); border: 1px solid rgba(110,168,255,0.25);
}
.cjd-tl-body h4 { font-size: 0.92rem; margin-bottom: 4px; }
.cjd-tl-body p { font-size: 0.85rem; line-height: 1.6; }

.cjd-culture-values { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
.cjd-value-pill {
  display: flex; flex-direction: column; gap: 2px; background: var(--bg-alt); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 16px; flex: 1; min-width: 140px;
}
.cjd-value-pill strong { font-size: 0.88rem; color: var(--ink); }
.cjd-value-pill span { font-size: 0.78rem; color: var(--muted); }

.cjd-sidebar-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: var(--shadow-sm);
  padding: 26px; position: sticky; top: 24px;
}
.cjd-sidebar-card h3 { font-size: 1.02rem; margin-bottom: 16px; }
.cjd-sidebar-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem;
}
.cjd-sidebar-row:last-of-type { border-bottom: none; }
.cjd-sidebar-row span:first-child { color: var(--muted); }
.cjd-sidebar-row span:last-child { color: var(--ink); font-weight: 600; text-align: right; }

.cjd-apply-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
  padding: 13px 24px; border-radius: 999px; font-weight: 600; font-size: 0.92rem; border: none; margin-top: 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.55); transition: transform .25s ease, box-shadow .25s ease;
}
.cjd-apply-btn:hover { box-shadow: 0 14px 30px -8px rgba(79,209,197,0.65); transform: translateY(-2px); }
.cjd-apply-btn:active { transform: scale(0.97); }
.cjd-inline-btn { width: auto; margin-top: 0; padding: 12px 22px; }

.cjd-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 0.9rem;
  background: var(--surface); color: var(--ink); border: 1px solid var(--border); transition: border-color .2s, color .2s;
}
.cjd-btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

.cjd-sticky-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
  background: var(--surface-solid); border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 28px; box-shadow: 0 -8px 24px -12px rgba(0,0,0,0.5);
}
.cjd-sticky-bar .info { font-size: 0.85rem; color: var(--muted); display: flex; flex-direction: column; gap: 2px; }
.cjd-sticky-bar .info strong { color: var(--ink); font-size: 0.95rem; }
.cjd-sticky-bar button {
  padding: 11px 26px; border-radius: 999px; font-weight: 600; font-size: 0.88rem; border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.55); flex-shrink: 0;
}
@media (max-width: 560px) { .cjd-sticky-bar .info { display: none; } }

.cjd-not-found { text-align: center; padding: 100px 20px; }
.cjd-not-found-icon { color: var(--accent); margin-bottom: 16px; }
.cjd-not-found h2 { margin-bottom: 8px; font-size: 1.3rem; }
.cjd-not-found p { margin-bottom: 24px; }
.cjd-not-found-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.cjd-modal-overlay {
  position: fixed; inset: 0; background: rgba(10,14,28,0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  animation: cjdFadeIn .25s ease;
}
@keyframes cjdFadeIn { from { opacity: 0; } to { opacity: 1; } }
.cjd-modal-card {
  background: var(--surface-solid); border-radius: 22px; padding: 34px; width: 100%; max-width: 540px;
  max-height: 88vh; overflow-y: auto; position: relative; box-shadow: var(--shadow-lg); border: 1px solid var(--border);
  animation: cjdModalPop .35s cubic-bezier(.2,.9,.25,1.1);
}
@keyframes cjdModalPop { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.cjd-modal-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 22px 22px 0 0; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
.cjd-modal-close { position: absolute; top: 20px; right: 20px; background: var(--bg-alt); border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: background .2s, color .2s; z-index: 1; }
.cjd-modal-close:hover { background: var(--accent-soft); color: var(--accent); }
.cjd-modal-header { margin-bottom: 22px; padding-right: 30px; }
.cjd-modal-eyebrow {
  display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px;
}
.cjd-modal-title { font-size: 1.35rem; margin-bottom: 6px; }
.cjd-modal-sub { font-size: 0.9rem; }
.cjd-form { display: flex; flex-direction: column; gap: 16px; }
.cjd-field { display: flex; flex-direction: column; gap: 6px; }
.cjd-field label { font-size: 0.8rem; font-weight: 600; color: var(--muted); }
.cjd-field label em { font-weight: 400; font-style: normal; opacity: 0.7; }
.cjd-field input, .cjd-field textarea, .cjd-field select {
  border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 0.92rem; color: var(--ink);
  outline: none; background: var(--bg-alt); transition: border-color .2s; resize: vertical;
}
.cjd-field input:focus, .cjd-field textarea:focus, .cjd-field select:focus { border-color: var(--accent); }
.cjd-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 480px) { .cjd-field-row { grid-template-columns: 1fr; } }
.cjd-file-drop {
  display: flex; align-items: center; gap: 10px; border: 1.5px dashed var(--border); border-radius: var(--radius-sm);
  padding: 16px; position: relative; font-size: 0.85rem; color: var(--muted); font-weight: 400; transition: border-color .2s; cursor: pointer;
}
.cjd-file-drop:hover { border-color: var(--accent); }
.cjd-submit-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
  padding: 13px 24px; border-radius: 999px; font-weight: 600; font-size: 0.92rem; border: none; margin-top: 4px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.55); transition: transform .25s ease, box-shadow .25s ease;
}
.cjd-submit-btn:hover { box-shadow: 0 14px 30px -8px rgba(79,209,197,0.65); transform: translateY(-2px); }
.cjd-submit-btn:active { transform: scale(0.97); }
.cjd-success { text-align: center; padding: 24px 10px; }
.cjd-success-icon {
  width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--accent-soft); color: var(--accent-2); margin: 0 auto 16px;
}
.cjd-success h3 { font-size: 1.4rem; margin-bottom: 10px; }
.cjd-success p { font-size: 0.95rem; margin-bottom: 24px; }
`;