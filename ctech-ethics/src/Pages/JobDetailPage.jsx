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
    title: item.jobTitle || item.title || "Untitled Role",
    company: item.companyName || item.company || "Partner Tech Firm",
    department: item.department || item.category || "Engineering",
    category: item.category || item.department || "Technical",
    type: item.type || "Full-Time",
    experience: item.experience || "Fresher",
    location: locStr,
    salary: item.salary || "",
    description: item.shortDescription || item.description || "",
    responsibilities: toArray(item.responsibilities),
    eligibility: toArray(item.eligibility),
    skills: Array.isArray(item.skills) ? item.skills : toArray(item.skills),
    benefits: toArray(item.benefits),
    companyInfo: item.companyInfo || "",
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

      <ApplyModal open={modalOpen} job={job} onClose={() => setModalOpen(false)} isPlacement={isPlacement} />
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
  position: fixed; inset: 0; background: rgba(6, 10, 22, 0.82); backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%); display: flex; align-items: center; justify-content: center;
  z-index: 10000; padding: 20px; animation: cjdFadeIn .28s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes cjdFadeIn { from { opacity: 0; } to { opacity: 1; } }

.cjd-modal-card {
  position: relative; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
  background: linear-gradient(155deg, rgba(13, 20, 38, 0.97) 0%, rgba(22, 14, 40, 0.98) 100%);
  border: 1px solid rgba(110, 168, 255, 0.25); border-radius: 24px; padding: 34px 28px 30px;
  box-shadow: 0 30px 90px -10px rgba(0, 0, 0, 0.8), 0 0 50px -10px rgba(110, 168, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
  animation: cjdModalPop .35s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin; scrollbar-color: rgba(110, 168, 255, 0.3) transparent;
}
@keyframes cjdModalPop { from { opacity: 0; transform: translateY(22px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

.cjd-modal-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 24px 24px 0 0;
  background: linear-gradient(90deg, #6ea8ff, #a78bfa, #4fd1c5, #6ea8ff); background-size: 300% 100%;
  animation: cjdShimmer 6s linear infinite;
}
@keyframes cjdShimmer { 0% { background-position: 0% 0%; } 100% { background-position: 300% 0%; } }

.cjd-modal-close {
  position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.14); background: rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.8);
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .25s ease; z-index: 10;
}
.cjd-modal-close:hover {
  background: rgba(168, 85, 247, 0.22); color: #ffffff; border-color: rgba(168, 85, 247, 0.45);
  transform: rotate(90deg) scale(1.08);
}

.cjd-modal-header { margin-bottom: 24px; padding-right: 32px; }
.cjd-modal-badge {
  display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem;
  font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
  background: var(--accent-soft); border: 1px solid rgba(110, 168, 255, 0.28); padding: 4px 12px; border-radius: 999px; margin-bottom: 12px;
}
.cjd-modal-title { font-family: 'Sora', 'Inter', sans-serif; font-size: 1.38rem; font-weight: 700; color: var(--ink); margin: 0 0 6px; line-height: 1.3; }
.cjd-modal-sub { font-size: 0.88rem; color: var(--muted); margin: 0; line-height: 1.5; }

.cjd-form { display: flex; flex-direction: column; gap: 16px; }
.cjd-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px) { .cjd-field-row { grid-template-columns: 1fr; } }

.cjd-field { display: flex; flex-direction: column; gap: 6px; }
.cjd-field label { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: var(--muted); }
.cjd-field label em { font-weight: 400; font-style: normal; opacity: 0.6; }
.cjd-field input, .cjd-field textarea, .cjd-field select {
  width: 100%; font-size: 0.92rem; padding: 12px 15px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--bg-alt); color: var(--ink); outline: none; font-family: inherit;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1); resize: vertical;
}
.cjd-field input::placeholder, .cjd-field textarea::placeholder { color: rgba(220, 230, 250, 0.35); }
.cjd-field input:focus, .cjd-field textarea:focus, .cjd-field select:focus {
  border-color: var(--accent); background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 3.5px rgba(110, 168, 255, 0.18), 0 4px 16px rgba(0, 0, 0, 0.2); transform: translateY(-1px);
}

.cjd-file-drop {
  display: block; border: 1.5px dashed var(--border); border-radius: 14px; padding: 16px;
  background: var(--accent-soft); cursor: pointer; transition: all 0.25s ease;
}
.cjd-file-drop:hover { border-color: var(--accent); background: rgba(110, 168, 255, 0.15); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(110, 168, 255, 0.12); }
.cjd-file-drop.has-file { border-style: solid; border-color: rgba(79, 209, 197, 0.45); background: rgba(79, 209, 197, 0.08); }

.cjd-file-placeholder { display: flex; align-items: center; gap: 14px; }
.cjd-upload-icon-box {
  width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cjd-upload-main { display: block; font-size: 0.88rem; font-weight: 600; color: var(--ink); }
.cjd-upload-sub { display: block; font-size: 0.76rem; color: var(--muted); margin-top: 2px; }

.cjd-file-selected { display: flex; align-items: center; gap: 12px; }
.cjd-file-icon {
  width: 36px; height: 36px; border-radius: 50%; background: rgba(79, 209, 197, 0.18); color: var(--accent-2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cjd-file-info { flex: 1; overflow: hidden; }
.cjd-file-name { display: block; font-size: 0.88rem; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cjd-file-sub { display: block; font-size: 0.75rem; color: var(--accent-2); }
.cjd-file-remove {
  background: rgba(255, 255, 255, 0.08); border: none; width: 28px; height: 28px; border-radius: 50%;
  color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s ease;
}
.cjd-file-remove:hover { background: rgba(248, 113, 113, 0.2); color: #f87171; }

.cjd-submit-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
  padding: 14px 28px; border-radius: 999px; font-family: inherit; font-weight: 700;
  font-size: 0.95rem; letter-spacing: 0.3px; border: none; margin-top: 8px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  color: #ffffff !important; box-shadow: 0 8px 25px -4px rgba(6, 182, 212, 0.45), 0 4px 12px rgba(139, 92, 246, 0.3);
  cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); outline: none;
}
.cjd-submit-btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px -4px rgba(6, 182, 212, 0.65), 0 6px 18px rgba(139, 92, 246, 0.4);
  transform: translateY(-2px); filter: brightness(1.08); color: #ffffff !important;
}
.cjd-submit-btn:hover:not(:disabled) svg { transform: translateX(4px); }
.cjd-submit-btn svg { transition: transform 0.25s ease; }
.cjd-submit-btn:active:not(:disabled) { transform: scale(0.98); }
.cjd-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.cjd-spinner { animation: cjdSpin 1s linear infinite; }
@keyframes cjdSpin { 100% { transform: rotate(360deg); } }

.cjd-success { text-align: center; padding: 30px 14px 10px; }
.cjd-success-icon {
  width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center;
  justify-content: center; color: var(--accent-2); background: rgba(79, 209, 197, 0.12);
  border: 1px solid rgba(79, 209, 197, 0.3); box-shadow: 0 0 30px rgba(79, 209, 197, 0.25);
  animation: cjdPulseGlow 2s infinite alternate;
}
@keyframes cjdPulseGlow { 0% { box-shadow: 0 0 20px rgba(79, 209, 197, 0.2); } 100% { box-shadow: 0 0 40px rgba(79, 209, 197, 0.45); } }
.cjd-success h3 { font-family: 'Sora', sans-serif; font-size: 1.45rem; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.cjd-success p { font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }

[data-theme="light"] .cjd-modal-overlay { background: rgba(15, 23, 42, 0.6) !important; }
[data-theme="light"] .cjd-modal-card {
  background: linear-gradient(155deg, #ffffff 0%, #f8fafc 100%) !important;
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 25px 70px -15px rgba(15, 23, 42, 0.2), 0 0 30px rgba(37, 99, 235, 0.08) !important;
}
[data-theme="light"] .cjd-modal-close { background: #f1f5f9 !important; color: #475569 !important; border-color: #cbd5e1 !important; }
[data-theme="light"] .cjd-modal-close:hover { background: #e2e8f0 !important; color: #0f172a !important; }
[data-theme="light"] .cjd-field input, [data-theme="light"] .cjd-field textarea, [data-theme="light"] .cjd-field select {
  background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important;
}
[data-theme="light"] .cjd-field input:focus, [data-theme="light"] .cjd-field textarea:focus {
  border-color: #2563eb !important; box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.14) !important;
}
[data-theme="light"] .cjd-field input::placeholder, [data-theme="light"] .cjd-field textarea::placeholder { color: #94a3b8 !important; }
[data-theme="light"] .cjd-file-drop { background: #f8fafc !important; border-color: #cbd5e1 !important; }
[data-theme="light"] .cjd-file-drop:hover { border-color: #2563eb !important; background: #eff6ff !important; }
`;