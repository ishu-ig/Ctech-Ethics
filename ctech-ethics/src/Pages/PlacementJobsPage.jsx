import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search, X, ArrowRight,
  ChevronDown, Sparkles, SlidersHorizontal,
  ShieldCheck, Compass, FileEdit, MessageSquareText, Zap,
  Lightbulb, Target, Mic2, ChevronLeft, ChevronRight
} from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { motion } from "framer-motion";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import HeroSection from "../Components/HeroSection";
import CommonJobCard, { Reveal, Eyebrow, ApplyModal, useInView } from "../Components/JobCard";
import { getPlacement } from "../Redux/ActionCreators/PlacementActionCreators";

/* ------------------------------------------------------------------ */
/*  DATA — Placement Jobs Across Partner Hiring Network                */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Technical", "Non-Technical"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Remote", "Hybrid"];
const EXPERIENCE_LEVELS = ["Fresher", "1–2 Years", "3+ Years"];
const LOCATIONS = ["Dehradun, IN", "Bengaluru, IN", "Pune, IN", "Remote"];

export const HIRING_STEPS = [
  { icon: FileEdit, title: "Registration", copy: "Submit your profile and placement preferences in 2 minutes." },
  { icon: ShieldCheck, title: "Verification", copy: "Our placement coordinators verify your credentials and skills." },
  { icon: Target, title: "Shortlisting", copy: "We match your profile directly with active partner company openings." },
  { icon: Mic2, title: "Interview Round", copy: "Technical and HR interview rounds scheduled with hiring partners." },
  { icon: Lightbulb, title: "Offer Letter", copy: "Receive your official offer letter with competitive CTC package." },
  { icon: Zap, title: "Onboarding", copy: "Smooth onboarding and career tracking support from our team." },
];

const STATS = [
  { icon: ShieldCheck, value: 500, suffix: "+", label: "Students Placed" },
  { icon: Compass, value: 120, suffix: "+", label: "Partner Companies" },
  { icon: Target, value: 96, suffix: "%", label: "Placement Rate" },
  { icon: Zap, value: 18, suffix: " LPA", label: "Highest Package" },
];

export const PLACEMENT_JOBS = [
  {
    id: "tn-mern", title: "MERN Stack Developer", company: "TechNova Solutions",
    theme: 0, category: "Technical", type: "Full-Time", experience: "1–2 Years",
    location: "Dehradun, IN", salary: "₹6L – ₹10L / yr",
    posted: "2026-07-22", deadline: "2026-08-28",
    description: "Build and ship full-stack features across client products using MongoDB, Express, React and Node — from schema to UI.",
    responsibilities: [
      "Develop and maintain REST APIs and database schemas",
      "Build responsive React interfaces from design handoff",
      "Write tests and participate in code review",
      "Collaborate directly with product and design",
    ],
    eligibility: ["B.Tech/BCA/MCA or equivalent practical experience", "1–2 years building production web apps", "Comfortable working across the full stack"],
    skills: ["MongoDB", "Express", "React", "Node.js", "REST APIs"],
    benefits: ["Health insurance", "Hybrid work options", "Annual learning stipend"],
    companyInfo: "TechNova Solutions is a mid-size product studio building SaaS tools for logistics and retail clients across India.",
  },
  {
    id: "bp-analyst", title: "Data Analyst", company: "Bright Path Analytics",
    theme: 1, category: "Technical", type: "Remote", experience: "1–2 Years",
    location: "Remote", salary: "₹5L – ₹7.5L / yr",
    posted: "2026-07-18", deadline: "2026-08-20",
    description: "Turn raw data into dashboards and decisions — SQL, Python, and a sharp eye for what actually matters.",
    responsibilities: [
      "Build and maintain reporting dashboards in Power BI",
      "Write SQL queries to answer ad-hoc business questions",
      "Partner with stakeholders to define key metrics",
      "Automate recurring data-cleaning workflows in Python",
    ],
    eligibility: ["Degree in Statistics, CS, or related field", "Hands-on SQL and Python experience", "Comfortable presenting findings to non-technical teams"],
    skills: ["SQL", "Python", "Power BI", "Statistics"],
    benefits: ["Fully remote", "Flexible hours", "Quarterly performance bonus"],
    companyInfo: "Bright Path Analytics helps mid-market companies stand up their first real data practice, from pipelines to dashboards.",
  },
  {
    id: "zs-uiux", title: "UI/UX Designer", company: "Zenith Software Labs",
    theme: 2, category: "Technical", type: "Full-Time", experience: "1–2 Years",
    location: "Remote", salary: "₹4.5L – ₹7L / yr",
    posted: "2026-07-25", deadline: "2026-08-30",
    description: "Design intuitive, delightful interfaces for web and mobile products, from research and wireframes to polished UI kits.",
    responsibilities: [
      "Run lightweight user research and usability tests",
      "Design wireframes, prototypes, and final UI in Figma",
      "Maintain and extend the shared design system",
      "Pair closely with engineering during implementation",
    ],
    eligibility: ["Portfolio demonstrating end-to-end product design work", "Proficiency in Figma and prototyping tools", "1–2 years in a product design role"],
    skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    benefits: ["Remote-first", "Design conference budget", "Top-tier equipment provided"],
    companyInfo: "Zenith Software Labs designs and builds consumer apps, with a design team that ships weekly.",
  },
  {
    id: "px-market", title: "Digital Marketing Executive", company: "PixelCraft Studio",
    theme: 3, category: "Non-Technical", type: "Full-Time", experience: "Fresher",
    location: "Dehradun, IN", salary: "₹3L – ₹4.5L / yr",
    posted: "2026-07-15", deadline: "2026-08-12",
    description: "Plan and run SEO, paid, and social campaigns that grow the brand's reach and its clients' pipelines.",
    responsibilities: [
      "Manage day-to-day SEO and paid ad campaigns",
      "Report on campaign performance weekly",
      "Draft social and content calendars",
      "Coordinate with design for campaign assets",
    ],
    eligibility: ["Bachelor's degree in Marketing, Mass Comm, or related field", "Strong written communication", "Basic familiarity with Google Ads or Analytics is a plus"],
    skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
    benefits: ["Structured onboarding", "Certification support", "Team outings"],
    companyInfo: "PixelCraft Studio is a boutique creative and performance-marketing agency serving D2C brands.",
  },
  {
    id: "mds-aiml", title: "AI/ML Developer", company: "Meridian Data Systems",
    theme: 4, category: "Technical", type: "Hybrid", experience: "3+ Years",
    location: "Dehradun, IN", salary: "₹10L – ₹16L / yr",
    posted: "2026-07-10", deadline: "2026-08-18",
    description: "Design, train, and deploy ML models that power recommendation, automation, and analytics features for clients.",
    responsibilities: [
      "Design and train models for production use cases",
      "Own the model deployment and monitoring pipeline",
      "Collaborate with data engineering on feature pipelines",
      "Evaluate and report on model performance over time",
    ],
    eligibility: ["3+ years building and shipping ML systems", "Strong Python and applied statistics background", "Experience with MLOps tooling preferred"],
    skills: ["Python", "PyTorch", "NLP", "MLOps"],
    benefits: ["Health insurance for family", "Research time allowance", "Relocation support"],
    companyInfo: "Meridian Data Systems builds ML infrastructure and applied models for enterprise clients.",
  },
  {
    id: "gm-bde", title: "Business Development Executive", company: "GrowMetrics Digital",
    theme: 5, category: "Non-Technical", type: "Full-Time", experience: "1–2 Years",
    location: "Dehradun, IN", salary: "₹4L – ₹6L / yr",
    posted: "2026-07-28", deadline: "2026-09-05",
    description: "Identify, pitch, and close new business opportunities while nurturing long-term client relationships.",
    responsibilities: [
      "Prospect and qualify new leads",
      "Run discovery calls and product pitches",
      "Maintain accurate records in the CRM",
      "Work with delivery teams on smooth client handoff",
    ],
    eligibility: ["1–2 years in sales or business development", "Comfortable with outbound outreach and cold calling", "Strong verbal and written communication"],
    skills: ["Lead Generation", "CRM", "Negotiation", "Client Relations"],
    benefits: ["Uncapped commission", "Health insurance", "Clear promotion path"],
    companyInfo: "GrowMetrics Digital is a growth consultancy helping SMEs scale their sales operations.",
  },
  {
    id: "sv-rn", title: "React Native Developer", company: "Skyline Ventures",
    theme: 0, category: "Technical", type: "Hybrid", experience: "1–2 Years",
    location: "Bengaluru, IN", salary: "₹5L – ₹8L / yr",
    posted: "2026-07-20", deadline: "2026-08-25",
    description: "Own features end-to-end in a cross-platform mobile app, from native modules to App Store releases.",
    responsibilities: [
      "Build and ship features across iOS and Android",
      "Integrate native modules where needed",
      "Own release builds and App Store submissions",
      "Debug and resolve platform-specific issues",
    ],
    eligibility: ["1–2 years shipping React Native apps", "At least one published app in a store", "Working knowledge of TypeScript"],
    skills: ["React Native", "TypeScript", "Redux", "Firebase"],
    benefits: ["Hybrid schedule", "Device reimbursement", "Annual learning stipend"],
    companyInfo: "Skyline Ventures builds consumer mobile products across fintech and travel.",
  },
  {
    id: "cf-intern", title: "Software Development Intern", company: "CodeForge Technologies",
    theme: 1, category: "Technical", type: "Internship", experience: "Fresher",
    location: "Remote", salary: "₹15K – ₹25K / mo",
    posted: "2026-07-30", deadline: "2026-08-22",
    description: "A 3–6 month hands-on internship building real product features alongside a dedicated mentor.",
    responsibilities: [
      "Ship small, well-scoped features under mentorship",
      "Write tests for the code you contribute",
      "Join daily standups and sprint planning",
      "Present your work at the end-of-internship review",
    ],
    eligibility: ["Currently pursuing or recently completed a CS-related degree", "Basic proficiency in JavaScript and Git", "Available for 3–6 months"],
    skills: ["JavaScript", "React", "Git", "Problem Solving"],
    benefits: ["Certificate of completion", "Mentor-led weekly reviews", "Return-offer track for top performers"],
    companyInfo: "CodeForge Technologies runs a structured internship pipeline feeding its full-time engineering team.",
  },
  {
    id: "ic-hr", title: "HR & People Operations Associate", company: "Insight Cloud Systems",
    theme: 2, category: "Non-Technical", type: "Full-Time", experience: "Fresher",
    location: "Pune, IN", salary: "₹3.5L – ₹5L / yr",
    posted: "2026-07-12", deadline: "2026-08-15",
    description: "Support hiring, onboarding, and day-to-day people operations for a fast-growing engineering team.",
    responsibilities: [
      "Coordinate interview scheduling and candidate communication",
      "Run new-hire onboarding sessions",
      "Maintain employee records and HR documentation",
      "Support engagement initiatives and policy rollouts",
    ],
    eligibility: ["Bachelor's degree, HR specialization preferred", "Strong organisational and interpersonal skills", "Comfortable working with HRIS tools"],
    skills: ["Recruiting Coordination", "Onboarding", "HRIS", "Communication"],
    benefits: ["Structured mentorship", "Health insurance", "Learning & certification budget"],
    companyInfo: "Insight Cloud Systems is a cloud infrastructure company scaling its team across three cities.",
  },
  {
    id: "ng-content", title: "Content Writer", company: "NextGen Robotics",
    theme: 3, category: "Non-Technical", type: "Part-Time", experience: "Fresher",
    location: "Remote", salary: "₹18K – ₹28K / mo",
    posted: "2026-07-27", deadline: "2026-08-24",
    description: "Write clear, engaging content across blog posts, product pages, and technical explainers.",
    responsibilities: [
      "Draft blog posts and product marketing copy",
      "Turn technical concepts into plain-language explainers",
      "Edit and proofread content from other contributors",
      "Keep a consistent voice across channels",
    ],
    eligibility: ["Strong portfolio of published writing", "Comfortable researching technical topics", "Available 20–25 hours a week"],
    skills: ["Copywriting", "SEO Writing", "Editing", "Research"],
    benefits: ["Fully remote", "Flexible part-time hours", "Byline on published work"],
    companyInfo: "NextGen Robotics builds robotics hardware and writes extensively about it for a technical audience.",
  },
];

const WHY_APPLY = [
  { icon: ShieldCheck, title: "Verified Companies", copy: "Every employer on this board is vetted by our placement team before a single role goes live." },
  { icon: Compass, title: "Placement Assistance", copy: "A dedicated coordinator tracks your applications and nudges the right people when you go quiet." },
  { icon: Target, title: "Career Guidance", copy: "1:1 sessions to help you figure out which roles actually fit where you want to go." },
  { icon: FileEdit, title: "Resume Support", copy: "Line-by-line resume reviews from people who've read thousands of them." },
  { icon: Mic2, title: "Interview Preparation", copy: "Mock interviews and role-specific prep so the real one feels familiar." },
  { icon: Zap, title: "Fast Application Process", copy: "Apply in under two minutes — one form, no repeated logins, no lost paperwork." },
];

const CAREER_TIPS = [
  { icon: FileEdit, title: "Resume", copy: "Lead with outcomes, not duties — \"cut load time 40%\" beats \"responsible for performance.\"" },
  { icon: MessageSquareText, title: "Interview", copy: "Prepare three real stories you can adapt to almost any behavioural question." },
  { icon: Lightbulb, title: "Career", copy: "Optimise your first job for how much you'll learn, not just the starting salary." },
];

/* ------------------------------------------------------------------ */
/*  HOOKS & HELPERS                                                     */
/* ------------------------------------------------------------------ */

function useCountUp(target, active, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  FILTERS                                                             */
/* ------------------------------------------------------------------ */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <div className="select-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="All">All</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={15} className="select-chevron" />
      </div>
    </label>
  );
}

function JobFilters({ filters, setFilters, count, total }) {
  const update = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const isDirty =
    filters.query || filters.category !== "All" || filters.type !== "All" ||
    filters.experience !== "All" || filters.location !== "All";

  const clear = () =>
    setFilters({ query: "", category: "All", type: "All", experience: "All", location: "All" });

  return (
    <div className="glass-panel filter-panel mx-3 mx-md-4 mx-lg-5">
      <div className="search-row">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by job title, company, or keywords…"
          value={filters.query}
          onChange={(e) => update("query")(e.target.value)}
        />
        {filters.query && (
          <button className="clear-mini" onClick={() => update("query")("")} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-row">
        <FilterSelect label="Category" value={filters.category} onChange={update("category")} options={CATEGORIES} />
        <FilterSelect label="Job Type" value={filters.type} onChange={update("type")} options={JOB_TYPES} />
        <FilterSelect label="Experience" value={filters.experience} onChange={update("experience")} options={EXPERIENCE_LEVELS} />
        <FilterSelect label="Location" value={filters.location} onChange={update("location")} options={LOCATIONS} />

        <button className={`btn btn-ghost btn-sm clear-btn ${isDirty ? "active" : ""}`} onClick={clear} disabled={!isDirty}>
          <SlidersHorizontal size={14} /> Clear Filters
        </button>
      </div>

      <div className="filter-count">
        Showing <strong>{count}</strong> of {total} open positions
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PLACEMENT JOB CARDS                                                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="empty-state">
      <Search size={28} style={{ color: 'var(--accent)', marginBottom: 14 }} />
      <h3>No roles match those filters</h3>
      <p>Try a broader search or clear your filters to see everything that's currently open.</p>
    </div>
  );
}

const normalizePlacementJob = (raw, index) => {
  if (!raw) return null;
  const id = raw._id || raw.id || `placement-${index}`;
  const company = raw.companyName || raw.company || "Partner Tech Firm";
  const title = raw.jobTitle || raw.title || "Software Engineer";
  const category = raw.category || "Technical";
  const type = raw.type || "Full-Time";
  const experience = raw.experience || "1–2 Years";
  const salary = raw.salary ? (raw.salary.startsWith("₹") ? raw.salary : `₹${raw.salary}`) : "Best in Industry";
  const description = raw.shortDescription || raw.description || "Exciting opportunity to work with modern technologies.";
  const skills = Array.isArray(raw.skills) && raw.skills.length > 0 ? raw.skills : ["React", "Node.js", "MongoDB"];

  let locationStr = "Remote";
  if (typeof raw.location === "string" && raw.location) {
    locationStr = raw.location;
  } else if (raw.location && typeof raw.location === "object") {
    const locParts = [raw.location.city, raw.location.state].filter(Boolean);
    locationStr = locParts.length > 0 ? locParts.join(", ") : "Dehradun, IN";
  }

  return {
    id,
    company,
    title,
    category,
    type,
    experience,
    salary,
    description,
    skills,
    location: locationStr,
    posted: raw.createdAt || raw.posted || new Date().toISOString(),
    deadline: raw.deadline || new Date(Date.now() + 15 * 86400000).toISOString(),
    responsibilities: raw.responsibilities || "",
    eligibility: raw.eligibility || "",
    benefits: raw.benefits || "",
    companyInfo: raw.companyInfo || "",
    applyLink: raw.applyLink || ""
  };
};

function JobListings() {
  const dispatch = useDispatch();
  const rawState = useSelector((state) => state.PlacementStateData);

  useEffect(() => {
    dispatch(getPlacement());
  }, [dispatch]);

  const jobsData = useMemo(() => {
    const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
    if (list.length > 0) {
      return list.map((item, idx) => normalizePlacementJob(item, idx)).filter(Boolean);
    }
    return PLACEMENT_JOBS;
  }, [rawState]);

  const [filters, setFilters] = useState({
    query: "", category: "All", type: "All", experience: "All", location: "All",
  });

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return jobsData.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      const matchesCategory = filters.category === "All" || job.category === filters.category;
      const matchesType = filters.type === "All" || job.type === filters.type;
      const matchesExp = filters.experience === "All" || job.experience === filters.experience;
      const matchesLoc = filters.location === "All" || job.location === filters.location;
      return matchesQuery && matchesCategory && matchesType && matchesExp && matchesLoc;
    });
  }, [filters, jobsData]);

  return (
    <section id="jobs" className="section">
      <div className="section-head">
        <Eyebrow>Open Placement Positions</Eyebrow>
        <h2>Find your dream role across partner companies</h2>
        <p>Verified openings across tech and non-tech tracks — filter and apply instantly.</p>
      </div>

      <JobFilters filters={filters} setFilters={setFilters} count={filtered.length} total={jobsData.length} />

      {filtered.length > 0 ? (
        <div className="grid grid-3 jobs-grid align-items-stretch mx-3 mx-md-4 mx-lg-5">
          {filtered.map((job, i) => (
            <CommonJobCard
              key={job.id}
              job={job}
              variant="placement"
              delay={(i % 3) * 70}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WHY APPLY THROUGH US                                                */
/* ------------------------------------------------------------------ */

function WhyApply() {
  return (
    <section className="section">
      <div className="section-head">
        <Eyebrow>Why Apply Through Us</Eyebrow>
        <h2>A placement team that actually follows through</h2>
      </div>

      <div className="why-swiper-wrapper position-relative">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.why-apply-pagination' }}
          navigation={{ nextEl: '.why-apply-next', prevEl: '.why-apply-prev' }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 24 }
          }}
          className="why-apply-container pb-5"
        >
          {WHY_APPLY.map((item) => (
            <SwiperSlide key={item.title} className="h-auto">
              <div className="glass-card why-card h-100 d-flex flex-column">
                <div className="icon-badge"><item.icon size={22} /></div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
          <button type="button" className="why-apply-prev swiper-nav-btn" aria-label="Previous slide">
            <ChevronLeft size={18} />
          </button>
          <div className="why-apply-pagination swiper-custom-dots w-auto d-inline-flex" />
          <button type="button" className="why-apply-next swiper-nav-btn" aria-label="Next slide">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CAREER TIPS                                                          */
/* ------------------------------------------------------------------ */

function CareerTips() {
  return (
    <section className="section career-tips-section">
      <div className="glass-panel career-tips-panel">
        <div className="career-tips-head">
          <Eyebrow>Career Tips</Eyebrow>
          <h2>Three small things worth getting right</h2>
        </div>
        <div className="career-tips-grid">
          {CAREER_TIPS.map((tip) => (
            <div key={tip.title} className="career-tip-card">
              <div className="icon-badge icon-badge-sm"><tip.icon size={16} /></div>
              <h4>{tip.title}</h4>
              <p>{tip.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  RECRUITMENT & HIRING PROCESS                                       */
/* ------------------------------------------------------------------ */

function ProcessTimeline() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const rowOne = HIRING_STEPS.slice(0, 3);
  const rowTwo = HIRING_STEPS.slice(3, 6);

  return (
    <section id="process" className="section section-alt">
      <div className="section-head">
        <Eyebrow>Hiring & Placement Process</Eyebrow>
        <h2>Six steps. Direct company connections. No hassle.</h2>
        <p>Here's exactly how we connect your skills to verified partner openings.</p>
      </div>

      <div className="process-flow" ref={ref}>
        {/* Desktop / Tablet View (3 per row with connected animated arrows) */}
        <div className="process-desktop-wrapper d-none d-md-block">
          {/* Row 1: Steps 1 -> 2 -> 3 */}
          <div className="process-row">
            {rowOne.map((step, i) => (
              <React.Fragment key={step.title}>
                <motion.div
                  className="process-card in-view"
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="process-card-accent" />
                  <span className="process-card-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="icon-badge process-card-icon"><step.icon size={20} /></div>
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </motion.div>
                {i < rowOne.length - 1 && (
                  <div className="process-arrow" aria-hidden="true">
                    <ChevronRight size={24} className="process-arrow-icon" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Turn Arrow from Row 1 to Row 2 */}
          <div className="process-turn-wrapper text-center my-3">
            <div className="process-turn in-view" aria-hidden="true">
              <ChevronDown size={28} className="process-turn-icon" />
            </div>
          </div>

          {/* Row 2: Steps 4 -> 5 -> 6 */}
          <div className="process-row">
            {rowTwo.map((step, i) => (
              <React.Fragment key={step.title}>
                <motion.div
                  className="process-card in-view"
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: (i + 3) * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="process-card-accent" />
                  <span className="process-card-num">{String(i + 4).padStart(2, "0")}</span>
                  <div className="icon-badge process-card-icon"><step.icon size={20} /></div>
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </motion.div>
                {i < rowTwo.length - 1 && (
                  <div className="process-arrow" aria-hidden="true">
                    <ChevronRight size={24} className="process-arrow-icon" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile View (2 per row with directional arrows) */}
        <div className="process-mobile-wrapper d-block d-md-none">
          <div className="row g-2">
            {HIRING_STEPS.map((step, idx) => (
              <div key={step.title} className="col-6 d-flex flex-column mb-2">
                <motion.div
                  className="process-card process-mobile-card h-100 in-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="process-card-accent" />
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="badge rounded-pill bg-primary bg-opacity-25 text-primary fw-bold" style={{ fontSize: '0.65rem' }}>
                      Step {idx + 1}
                    </span>
                    {idx % 2 === 0 && idx < HIRING_STEPS.length - 1 && (
                      <ChevronRight size={14} className="text-primary opacity-75" />
                    )}
                  </div>
                  <div className="icon-badge process-card-icon my-1"><step.icon size={18} /></div>
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const value = useCountUp(stat.value, inView);
  return (
    <div className="stat-item" ref={ref}>
      <div className="icon-badge icon-badge-sm"><stat.icon size={16} /></div>
      <div className="stat-value">{value}{stat.suffix}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="section stats-section">
      <div className="glass-panel stats-panel">
        {STATS.map((s) => <StatItem key={s.label} stat={s} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export default function PlacementJobsPage() {
  const [applyModal, setApplyModal] = useState({ open: false, job: null });

  const openApply = useCallback((job) => setApplyModal({ open: true, job: job || null }), []);
  const closeApply = useCallback(() => setApplyModal((m) => ({ ...m, open: false })), []);

  useEffect(() => {
    document.body.style.overflow = applyModal.open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [applyModal.open]);

  return (
    <div className="careers-page">
      <style>{CSS}</style>

      <HeroSection
        title="Find Your Dream Job"
        subtitle="Browse verified technical and non-technical openings from companies actively hiring through CTech Ethic Solution — and apply in minutes, not days."
        eyebrow="Placement Jobs · For Students & Job Seekers"
        breadcrumb="Placement Jobs"
        size="md"
      />

      <JobListings />
      <ProcessTimeline />
      <WhyApply />
      <CareerTips />
      <Stats />

      <section className="section final-cta">
        <Reveal className="glass-panel final-cta-panel">
          <Sparkles size={22} className="final-cta-icon" />
          <h2>Didn't find the right fit yet?</h2>
          <p>Send us a general application and we'll match you to roles as they open.</p>
          <button className="btn btn-primary" onClick={() => openApply(null)}>
            Apply Now <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      <ApplyModal open={applyModal.open} job={applyModal.job} onClose={closeApply} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

.careers-page {
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
  overflow-x: hidden;
}

[data-theme="light"] .careers-page {
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

.careers-page *, .careers-page *::before, .careers-page *::after { box-sizing: border-box; }
.careers-page h1, .careers-page h2, .careers-page h3, .careers-page h4 {
  font-family: 'Sora', 'Inter', sans-serif; color: var(--ink); margin: 0; letter-spacing: -0.01em;
}
.careers-page p { margin: 0; color: var(--muted); }
.careers-page a { color: inherit; text-decoration: none; }
.careers-page button { font-family: inherit; cursor: pointer; }
.careers-page input, .careers-page select, .careers-page textarea { font-family: inherit; }

/* ---------- Layout & Container Sizing ---------- */
/* Using vw units keeps padding strictly proportional, preventing any hardcoded overlaps. */
.section { max-width: 1320px; margin: 0 auto; padding: 60px 5vw; }
@media (max-width: 1024px) { .section { padding: 48px 4vw; } }
@media (max-width: 768px) { .section { padding: 32px 20px; } }
@media (max-width: 480px) { .section { padding: 24px 16px; } }

.section-alt {
  max-width: none;
  padding-left: 0;
  padding-right: 0;
  background: linear-gradient(180deg, transparent, var(--bg-alt) 12%, var(--bg-alt) 88%, transparent);
}
.section-alt > * { max-width: 1320px; margin-left: auto; margin-right: auto; padding-left: 5vw; padding-right: 5vw; }
@media (max-width: 1024px) { .section-alt > * { padding-left: 4vw; padding-right: 4vw; } }
@media (max-width: 768px) { .section-alt > * { padding-left: 20px; padding-right: 20px; } }
@media (max-width: 480px) { .section-alt > * { padding-left: 16px; padding-right: 16px; } }

.section-head { max-width: 660px; margin: 0 auto 36px; text-align: center; }
.section-head h2 { font-size: clamp(1.6rem, 3.2vw, 2.2rem); margin: 8px 0 12px; line-height: 1.25; }
.section-head p { font-size: 0.98rem; line-height: 1.6; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 10px;
}
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); box-shadow: 0 0 0 4px var(--accent-soft); }

/* ---------- Glass Surfaces ---------- */
.glass-card, .glass-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: var(--shadow-sm);
}
.glass-card { padding: 28px 24px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s; }
.glass-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: rgba(110,168,255,0.4); }

.icon-badge {
  width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--accent-soft), rgba(79,209,197,0.12));
  color: var(--accent); margin-bottom: 16px; flex-shrink: 0;
}
.icon-badge-sm { width: 34px; height: 34px; border-radius: 10px; margin-bottom: 8px; }

/* ---------- Swiper Controls ---------- */
.swiper-nav-btn {
  width: 40px; height: 40px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border);
  color: var(--ink); display: flex; align-items: center; justify-content: center; transition: all 0.25s ease;
}
.swiper-nav-btn:hover { background: var(--accent); color: #040810; border-color: var(--accent); transform: scale(1.08); }
.swiper-custom-dots .swiper-pagination-bullet { background: var(--muted); opacity: 0.4; transition: all 0.3s ease; }
.swiper-custom-dots .swiper-pagination-bullet-active { background: var(--accent); opacity: 1; width: 24px; border-radius: 10px; }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 24px; border-radius: 999px; font-weight: 600; font-size: 0.92rem;
  border: 1px solid transparent; transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
  white-space: nowrap;
}
.btn:active { transform: scale(0.97); }
.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.55);
}
.btn-primary:hover { box-shadow: 0 14px 30px -8px rgba(79,209,197,0.65); transform: translateY(-2px); }
.btn-ghost { background: var(--surface); color: var(--ink); border-color: var(--border); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-sm { padding: 9px 16px; font-size: 0.83rem; }
.btn-block { width: 100%; margin-top: 6px; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* ---------- Filters ---------- */
.filter-panel { padding: 26px 28px; margin-bottom: 32px; }
.search-row { display: flex; align-items: center; gap: 10px; padding: 4px 6px 16px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.search-icon { color: var(--muted); flex-shrink: 0; }
.search-row input { flex: 1; border: none; background: transparent; outline: none; font-size: 1rem; color: var(--ink); }
.search-row input::placeholder { color: #9AA2B1; }
.clear-mini { border: none; background: var(--bg-alt); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: var(--muted); cursor: pointer; }
.filter-row { display: flex; gap: 16px; align-items: end; flex-wrap: wrap; }
.filter-field { display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--muted); min-width: 150px; flex: 1; }
.select-wrap { position: relative; }
.select-wrap select {
  width: 100%; appearance: none; border: 1px solid var(--border); background: var(--surface-solid);
  border-radius: var(--radius-sm); padding: 11px 34px 11px 14px; font-size: 0.88rem; color: var(--ink); outline: none;
  transition: border-color .2s;
}
.select-wrap select:focus { border-color: var(--accent); }
.select-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.clear-btn { flex-shrink: 0; }
.filter-count { margin-top: 18px; font-size: 0.85rem; color: var(--muted); }
.filter-count strong { color: var(--ink); }
@media (max-width: 640px) {
  .filter-panel { padding: 20px 18px; }
  .filter-row { gap: 12px; }
  .filter-field { min-width: 100%; }
}

/* ========================================================================= */
/*  RESPONSIVE JOB CARDS AND GRID                                            */
/* ========================================================================= */

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 10px;
}

.job-card {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 20px;
  box-sizing: border-box;
  overflow: hidden;
  word-break: break-word;
}

/* Base constraints to prevent long words/urls blowing up the grid */
.job-card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
  letter-spacing: -0.01em;
  word-break: break-word; 
  white-space: normal;
}

.job-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure flex containers wrap properly so they never force grid widening */
.job-meta-row, .job-skills-container {
  display: flex;
  flex-wrap: wrap !important;
  gap: 6px;
}

/* Ensure individual pills wrap text if absolutely necessary, or truncate gracefully */
.meta-pill, .skill-pill, .job-dept-pill, .job-salary-badge {
  white-space: normal; 
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;
  align-items: center;
}

/* Specific pill styles */
.job-dept-pill {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-2);
  background: rgba(79, 209, 197, 0.12); border: 1px solid rgba(79, 209, 197, 0.28);
  padding: 4px 10px; border-radius: 100px;
}
.job-salary-badge {
  font-size: 0.76rem; font-weight: 600; color: var(--accent);
  background: var(--accent-soft); border: 1px solid rgba(110, 168, 255, 0.25);
  padding: 4px 10px; border-radius: 100px;
}
.meta-pill {
  font-size: 0.75rem; background: var(--bg-alt); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px; gap: 4px;
}
.skill-pill {
  font-size: 0.72rem; font-weight: 500; background: rgba(110, 168, 255, 0.08);
  color: var(--accent); border: 1px solid rgba(110, 168, 255, 0.2); padding: 4px 10px; border-radius: 999px;
}

.job-card-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
.company-logo {
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: #040810; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
}
.job-card-heading { min-width: 0; }
.job-company { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: var(--muted); margin-top: 3px; }
.job-card-footer { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
.job-footer-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.posted-date { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--muted); }
.urgency-chip { font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); white-space: nowrap; }
.urgency-chip.warn { background: var(--warn-soft); color: var(--warn); }
.urgency-chip.closed { background: var(--bg-alt); color: var(--closed); }

/* Fix the button inside job cards to wrap nicely instead of pushing width */
.job-card .btn {
  white-space: normal !important;
  text-align: center;
  height: auto;
  line-height: 1.3;
  padding: 10px 14px;
}

/* -- Tablet (769px to 1024px) -> KEEP 3 COLUMNS, but squeeze contents -- */
@media (max-width: 1024px) {
  .grid-3 { gap: 16px; }
  .job-card { padding: 18px 14px !important; min-height: 340px; }
  
  .job-card-top { gap: 10px; }
  .company-logo { width: 36px !important; height: 36px !important; font-size: 0.75rem; }
  
  .job-card-title { font-size: 0.95rem; line-height: 1.3; }
  .job-desc { font-size: 0.82rem; line-height: 1.5; -webkit-line-clamp: 3; }
  
  .job-dept-pill, .job-salary-badge { font-size: 0.65rem; padding: 4px 8px; }
  .meta-pill, .skill-pill { font-size: 0.65rem; padding: 4px 6px; gap: 2px; }
  
  .job-card .btn { font-size: 0.8rem; padding: 8px 10px; }
}

/* -- Mobile (481px to 768px) -> EXACTLY 2 COLUMNS -- Aggressively hide non-essentials -- */
@media (max-width: 768px) {
  .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  
  .job-card { padding: 16px 12px !important; min-height: auto; gap: 4px; }
  
  /* Hide the description text completely */
  .job-desc { display: none !important; }
  /* Hide the footer meta completely (urgency chip, posted date) to save huge vertical space */
  .job-footer-meta { display: none !important; }

  .job-card-top { gap: 8px; margin-bottom: 4px; }
  .company-logo { width: 32px !important; height: 32px !important; font-size: 0.7rem; border-radius: 8px; }
  
  .job-card-title { font-size: 0.85rem; line-height: 1.25; margin-bottom: 2px; }
  
  .job-dept-pill, .job-salary-badge { font-size: 0.6rem; padding: 3px 6px; }
  .meta-pill, .skill-pill { font-size: 0.6rem; padding: 3px 6px; gap: 2px; }
  
  .job-meta-row { gap: 4px; margin-bottom: 6px !important; }
  
  .job-card .btn { font-size: 0.75rem; padding: 8px 6px; margin-top: 6px; }
  .job-card .btn svg { display: none; } /* Hide the icon to save space */
}

/* -- Tiny Mobile (<= 480px) -> STILL 2 COLUMNS, extreme squeeze -- */
@media (max-width: 480px) {
  .grid-3 { gap: 8px; }
  .job-card { padding: 14px 10px !important; }
  .job-card-title { font-size: 0.8rem; }
  .company-logo { width: 28px !important; height: 28px !important; font-size: 0.6rem; }
  .meta-pill, .skill-pill, .job-dept-pill, .job-salary-badge { font-size: 0.55rem; padding: 2px 4px; }
  .job-card .btn { font-size: 0.7rem; padding: 6px 4px; margin-top: 6px; }
}

/* ---------- why-apply cards ---------- */
.why-card h3 { font-size: 1.05rem; margin-bottom: 8px; }
.why-card p { font-size: 0.9rem; }

/* ---------- career tips ---------- */
.career-tips-section { padding-top: 0; }
.career-tips-panel { padding: 40px; display: grid; grid-template-columns: 1fr 2fr; gap: 36px; align-items: center; }
@media (max-width: 780px) { .career-tips-panel { grid-template-columns: 1fr; padding: 30px 24px; } }
.career-tips-head h2 { font-size: clamp(1.3rem, 2.6vw, 1.7rem); margin-top: 8px; }
.career-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 620px) { .career-tips-grid { grid-template-columns: 1fr; } }
.career-tip-card h4 { font-size: 0.95rem; margin-bottom: 6px; }
.career-tip-card p { font-size: 0.85rem; }

/* ---------- apply modal (cjd-*) ---------- */
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

/* ---------- recruitment process redesign & animations ---------- */
.process-flow {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
  position: relative;
}

.process-row {
  display: grid;
  grid-template-columns: 1fr 32px 1fr 32px 1fr;
  align-items: stretch;
  gap: 0;
}

.process-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 20px;
  overflow: hidden;
  opacity: 1 !important;
  transform: translateY(0) !important;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.process-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #47b2e4, #a855f7, #ec4899);
  opacity: 0.85;
}

.process-card:hover {
  border-color: var(--accent);
  background: linear-gradient(135deg, rgba(255,255,255,0.07), rgba(110,168,255,0.06));
  box-shadow: 0 12px 30px -10px rgba(110,168,255,0.3);
  transform: translateY(-6px) scale(1.02) !important;
}

.process-card-num {
  position: absolute;
  top: -8px;
  right: 12px;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 3.5rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.12;
  pointer-events: none;
}

.process-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(110,168,255,0.18), rgba(79,209,197,0.18));
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: inset 0 0 0 1px rgba(110,168,255,0.3);
}

.process-card:hover .process-card-icon {
  transform: rotate(6deg) scale(1.1);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #040810;
}

.process-card h4 {
  font-size: 1.02rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--ink);
}

.process-card p {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--muted);
}

.process-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  opacity: 0.75;
  animation: pulseArrow 2s infinite ease-in-out;
}

@keyframes pulseArrow {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(5px); opacity: 1; }
}

.process-turn {
  display: flex;
  justify-content: center;
  color: var(--accent-2);
  margin: 4px 0;
  opacity: 1 !important;
  transform: translateY(0) !important;
  animation: bounceDown 2s infinite ease-in-out;
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (max-width: 860px) {
  .process-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .process-arrow { display: none; }
  .process-turn { display: none; }
}

@media (max-width: 480px) {
  .process-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .process-card { padding: 14px 10px; }
  .process-card h4 { font-size: 0.88rem; }
  .process-card p { font-size: 0.75rem; line-height: 1.4; }
  .process-card-icon { width: 36px; height: 36px; margin-bottom: 8px; }
}

/* ---------- stats ---------- */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr) !important;
  padding: 36px 32px;
  gap: 24px;
}

@media (max-width: 768px) {
  .stats-panel {
    grid-template-columns: repeat(2, 1fr) !important;
    padding: 24px 16px;
    gap: 16px 12px;
  }
}
.stat-item { text-align: center; display: flex; flex-direction: column; align-items: center; }
.stat-value {
  font-family: 'Sora', sans-serif; font-size: clamp(1.9rem, 3vw, 2.5rem); font-weight: 700;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  letter-spacing: -0.02em;
}
.stat-label { font-size: 0.85rem; color: var(--muted); margin-top: 4px; }

/* ---------- final cta ---------- */
.final-cta-panel { text-align: center; padding: 56px 30px; }
.final-cta-icon { color: var(--accent); margin-bottom: 14px; }
.final-cta-panel h2 { font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 10px; }
.final-cta-panel p { margin-bottom: 26px; }

/* ---------- reveal-on-scroll ---------- */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
.reveal.in-view { opacity: 1; transform: translateY(0); }
`;