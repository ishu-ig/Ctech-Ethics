import React, { useState, useMemo } from "react";
import {
    Search, X, ChevronDown, Sparkles, SlidersHorizontal, ArrowRight,
    Code2, LineChart, Award, Infinity as InfinityIcon, MessageSquareText, Clock3
} from "lucide-react";

import HeroSection from "../Components/HeroSection";
import CourseCard, { Reveal, Eyebrow, EnrollModal } from "./CommonCourseCard";

/* ------------------------------------------------------------------ */
/*  DATA — Courses We Teach                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Web Development", "Data Science", "Design", "Mobile Development", "Cloud & DevOps", "Marketing"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MODES = ["Live Online", "Self-Paced", "Hybrid"];

export const COURSES = [
    {
        id: "react-bootcamp", title: "Complete React Developer Bootcamp", category: "Web Development",
        theme: 0, level: "Beginner", mode: "Live Online", duration: "8 Weeks",
        price: "₹12,999", originalPrice: "₹19,999", rating: 4.8, students: 1240,
        instructor: "Aditi Sharma", instructorTitle: "Senior Frontend Engineer, 7+ yrs experience",
        description: "Go from HTML basics to shipping production React apps — hooks, state management, and real project builds.",
        skills: ["React", "JavaScript", "Redux", "REST APIs"],
        whatYouWillLearn: [
            "Build responsive UIs with modern React (hooks, context, and component patterns)",
            "Manage complex app state with Redux Toolkit",
            "Connect to REST APIs and handle async data fetching",
            "Deploy production-ready apps to Vercel/Netlify",
        ],
        curriculum: [
            { title: "Module 1: JavaScript & DOM Foundations", duration: "1 Week", topics: ["ES6+ syntax", "DOM manipulation", "Async/await & Promises"] },
            { title: "Module 2: React Fundamentals", duration: "2 Weeks", topics: ["Components & JSX", "Props & state", "Hooks (useState, useEffect)"] },
            { title: "Module 3: State Management", duration: "2 Weeks", topics: ["Context API", "Redux Toolkit", "React Query"] },
            { title: "Module 4: Real-World Projects", duration: "3 Weeks", topics: ["E-commerce app build", "Auth & protected routes", "Deployment"] },
        ],
        requirements: ["Basic HTML/CSS knowledge", "A laptop with 8GB+ RAM", "No prior React experience needed"],
        includes: ["Certificate of completion", "Lifetime access to recordings", "1:1 mentor support", "Resume & portfolio review"],
    },
    {
        id: "python-datascience", title: "Python for Data Science & Analytics", category: "Data Science",
        theme: 2, level: "Beginner", mode: "Self-Paced", duration: "10 Weeks",
        price: "₹14,999", originalPrice: "₹22,999", rating: 4.7, students: 980,
        instructor: "Rohan Mehta", instructorTitle: "Data Scientist, ex-Flipkart",
        description: "Learn Python, pandas, and visualization to turn raw data into decisions — no coding background required.",
        skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
        whatYouWillLearn: [
            "Write clean, efficient Python for data analysis",
            "Clean and transform datasets with pandas and NumPy",
            "Build dashboards and charts with Matplotlib & Seaborn",
            "Apply basic statistics to real datasets",
        ],
        curriculum: [
            { title: "Module 1: Python Foundations", duration: "2 Weeks", topics: ["Syntax & data types", "Functions & control flow", "File handling"] },
            { title: "Module 2: Data Wrangling", duration: "3 Weeks", topics: ["Pandas deep dive", "NumPy arrays", "Cleaning messy data"] },
            { title: "Module 3: Visualization & Stats", duration: "3 Weeks", topics: ["Matplotlib & Seaborn", "Descriptive statistics", "Hypothesis testing basics"] },
            { title: "Module 4: Capstone Project", duration: "2 Weeks", topics: ["End-to-end analysis project", "Presenting insights"] },
        ],
        requirements: ["No prior programming experience needed", "A laptop with Python 3.x installable"],
        includes: ["Certificate of completion", "Lifetime access", "Dataset library", "Career guidance session"],
    },
    {
        id: "uiux-design", title: "UI/UX Design Masterclass", category: "Design",
        theme: 3, level: "Intermediate", mode: "Hybrid", duration: "6 Weeks",
        price: "₹10,999", originalPrice: "₹16,999", rating: 4.9, students: 760,
        instructor: "Neha Kapoor", instructorTitle: "Product Designer, ex-Swiggy",
        description: "Design intuitive, delightful products end-to-end — research, wireframes, prototyping, and polished UI kits.",
        skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
        whatYouWillLearn: [
            "Run user research and turn insights into design decisions",
            "Wireframe and prototype in Figma from scratch",
            "Build and maintain a scalable design system",
            "Present and defend design decisions to stakeholders",
        ],
        curriculum: [
            { title: "Module 1: UX Research", duration: "1 Week", topics: ["User interviews", "Personas & journey maps"] },
            { title: "Module 2: Wireframing & Prototyping", duration: "2 Weeks", topics: ["Low-fi to hi-fi in Figma", "Interactive prototypes"] },
            { title: "Module 3: Visual & Design Systems", duration: "2 Weeks", topics: ["Typography & color theory", "Component libraries"] },
            { title: "Module 4: Portfolio Project", duration: "1 Week", topics: ["End-to-end case study", "Portfolio review"] },
        ],
        requirements: ["A free Figma account", "No prior design experience needed"],
        includes: ["Certificate of completion", "Design system template pack", "1:1 portfolio review", "Job referral network"],
    },
    {
        id: "reactnative-mobile", title: "React Native: Build iOS & Android Apps", category: "Mobile Development",
        theme: 1, level: "Intermediate", mode: "Live Online", duration: "9 Weeks",
        price: "₹15,999", originalPrice: "₹23,999", rating: 4.6, students: 540,
        instructor: "Karan Verma", instructorTitle: "Mobile Lead, 6+ yrs experience",
        description: "Ship real cross-platform mobile apps — from native modules to App Store and Play Store releases.",
        skills: ["React Native", "TypeScript", "Redux", "Firebase"],
        whatYouWillLearn: [
            "Build cross-platform mobile UIs with React Native",
            "Integrate native modules and device APIs",
            "Manage app state and offline data",
            "Publish apps to the App Store and Play Store",
        ],
        curriculum: [
            { title: "Module 1: React Native Foundations", duration: "2 Weeks", topics: ["Core components", "Navigation", "Styling"] },
            { title: "Module 2: State & Data", duration: "2 Weeks", topics: ["Redux Toolkit", "Firebase integration", "Offline storage"] },
            { title: "Module 3: Native Features", duration: "2 Weeks", topics: ["Camera & location APIs", "Push notifications"] },
            { title: "Module 4: Ship It", duration: "3 Weeks", topics: ["Testing on real devices", "App Store & Play Store release"] },
        ],
        requirements: ["Basic JavaScript/React knowledge", "A Mac (for iOS builds) is helpful but not required"],
        includes: ["Certificate of completion", "Lifetime access", "1:1 mentor support", "App Store submission guidance"],
    },
    {
        id: "aws-devops", title: "AWS Cloud & DevOps Essentials", category: "Cloud & DevOps",
        theme: 4, level: "Intermediate", mode: "Live Online", duration: "8 Weeks",
        price: "₹16,999", originalPrice: "₹24,999", rating: 4.7, students: 610,
        instructor: "Sameer Joshi", instructorTitle: "DevOps Engineer, AWS Certified",
        description: "Provision, deploy, and monitor production infrastructure on AWS with Docker, CI/CD, and Terraform.",
        skills: ["AWS", "Docker", "CI/CD", "Terraform"],
        whatYouWillLearn: [
            "Provision and manage AWS infrastructure (EC2, S3, RDS, VPC)",
            "Containerize applications with Docker",
            "Build CI/CD pipelines with GitHub Actions",
            "Manage infrastructure as code with Terraform",
        ],
        curriculum: [
            { title: "Module 1: AWS Core Services", duration: "2 Weeks", topics: ["EC2, S3, IAM", "VPC networking basics"] },
            { title: "Module 2: Containers", duration: "2 Weeks", topics: ["Docker fundamentals", "ECS/EKS basics"] },
            { title: "Module 3: CI/CD", duration: "2 Weeks", topics: ["GitHub Actions", "Automated testing & deploys"] },
            { title: "Module 4: Infrastructure as Code", duration: "2 Weeks", topics: ["Terraform basics", "Deploying a full stack"] },
        ],
        requirements: ["Basic Linux command line familiarity", "An AWS free-tier account"],
        includes: ["Certificate of completion", "Lifetime access", "AWS cost-optimization guide", "Mock interview session"],
    },
    {
        id: "digital-marketing", title: "Digital Marketing & Growth Strategy", category: "Marketing",
        theme: 5, level: "Beginner", mode: "Self-Paced", duration: "6 Weeks",
        price: "₹8,999", originalPrice: "₹13,999", rating: 4.5, students: 890,
        instructor: "Priya Nair", instructorTitle: "Growth Marketing Lead",
        description: "Plan and run SEO, paid, and social campaigns that actually move the needle — with real budgets and metrics.",
        skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
        whatYouWillLearn: [
            "Plan and execute SEO strategies that rank",
            "Run and optimize paid campaigns on Google & Meta",
            "Read analytics dashboards and report on ROI",
            "Build a content calendar that supports growth goals",
        ],
        curriculum: [
            { title: "Module 1: SEO Fundamentals", duration: "2 Weeks", topics: ["Keyword research", "On-page & technical SEO"] },
            { title: "Module 2: Paid Advertising", duration: "2 Weeks", topics: ["Google Ads", "Meta Ads Manager"] },
            { title: "Module 3: Analytics & Strategy", duration: "2 Weeks", topics: ["GA4 essentials", "Building a growth plan"] },
        ],
        requirements: ["No prior marketing experience needed"],
        includes: ["Certificate of completion", "Campaign templates pack", "1:1 strategy review"],
    },
];

const WHY_LEARN = [
    { icon: Code2, title: "Project-Based Learning", copy: "Every course ends with a real, portfolio-ready project — not a quiz." },
    { icon: MessageSquareText, title: "1:1 Mentor Support", copy: "Get unstuck fast with direct access to instructors and mentors." },
    { icon: Award, title: "Recognised Certification", copy: "Certificates our hiring partners actually look for." },
    { icon: InfinityIcon, title: "Lifetime Access", copy: "Revisit recordings and materials for as long as you need." },
    { icon: Clock3, title: "Flexible Scheduling", copy: "Live, self-paced, or hybrid — learn on a schedule that fits your life." },
    { icon: LineChart, title: "Career Support", copy: "Resume reviews, mock interviews, and referrals for top performers." },
];

/* ------------------------------------------------------------------ */
/*  FILTERS                                                             */
/* ------------------------------------------------------------------ */

function FilterSelect({ label, value, onChange, options }) {
    return (
        <div className="filter-field">
            <label>{label}</label>
            <div className="select-wrap">
                <select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="All">All {label}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="select-chevron" />
            </div>
        </div>
    );
}

function CourseFilters({ filters, setFilters, count, total }) {
    const clear = () => setFilters({ query: "", category: "All", level: "All", mode: "All" });
    const hasActive = filters.query || filters.category !== "All" || filters.level !== "All" || filters.mode !== "All";

    return (
        <div className="glass-panel filter-panel">
            <div className="search-row">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search courses, skills, or instructors…"
                    value={filters.query}
                    onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                />
                {filters.query && (
                    <button type="button" className="clear-mini" onClick={() => setFilters((f) => ({ ...f, query: "" }))}>
                        <X size={13} />
                    </button>
                )}
            </div>

            <div className="filter-row">
                <FilterSelect label="Category" value={filters.category} onChange={(v) => setFilters((f) => ({ ...f, category: v }))} options={CATEGORIES} />
                <FilterSelect label="Level" value={filters.level} onChange={(v) => setFilters((f) => ({ ...f, level: v }))} options={LEVELS} />
                <FilterSelect label="Mode" value={filters.mode} onChange={(v) => setFilters((f) => ({ ...f, mode: v }))} options={MODES} />
                {hasActive && (
                    <button type="button" className="btn btn-ghost btn-sm clear-btn" onClick={clear}>
                        <SlidersHorizontal size={14} /> Clear
                    </button>
                )}
            </div>

            <div className="filter-count">
                Showing <strong>{count}</strong> of <strong>{total}</strong> courses
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="empty-state">
            <Search size={26} style={{ marginBottom: 12, color: "var(--accent)" }} />
            <h3>No courses match your filters</h3>
            <p>Try adjusting your search or filters.</p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  COURSE LISTINGS                                                     */
/* ------------------------------------------------------------------ */

function CourseListings() {
    const [filters, setFilters] = useState({ query: "", category: "All", level: "All", mode: "All" });

    const filtered = useMemo(() => {
        const q = filters.query.trim().toLowerCase();
        return COURSES.filter((c) => {
            const matchesQuery =
                !q ||
                c.title.toLowerCase().includes(q) ||
                c.instructor.toLowerCase().includes(q) ||
                c.skills.some((s) => s.toLowerCase().includes(q));
            const matchesCategory = filters.category === "All" || c.category === filters.category;
            const matchesLevel = filters.level === "All" || c.level === filters.level;
            const matchesMode = filters.mode === "All" || c.mode === filters.mode;
            return matchesQuery && matchesCategory && matchesLevel && matchesMode;
        });
    }, [filters]);

    return (
        <section id="courses" className="section">
            <div className="section-head">
                <Eyebrow>Courses We Teach</Eyebrow>
                <h2>Practical, project-based courses taught by working professionals</h2>
                <p>Pick a track, learn by building, and walk away with a portfolio project and a certificate.</p>
            </div>

            <CourseFilters filters={filters} setFilters={setFilters} count={filtered.length} total={COURSES.length} />

            {filtered.length > 0 ? (
                <div className="grid grid-3 courses-grid align-items-stretch">
                    {filtered.map((c, i) => (
                        <CourseCard key={c.id} course={c} delay={(i % 3) * 70} />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  WHY LEARN WITH US                                                   */
/* ------------------------------------------------------------------ */

function WhyLearn() {
    return (
        <section className="section">
            <div className="section-head">
                <Eyebrow>Why Learn With Us</Eyebrow>
                <h2>Courses built to actually get you hired</h2>
            </div>
            <div className="grid grid-3">
                {WHY_LEARN.map((item) => (
                    <Reveal key={item.title} className="glass-card why-card">
                        <div className="icon-badge"><item.icon size={22} /></div>
                        <h3>{item.title}</h3>
                        <p>{item.copy}</p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  ROOT COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export default function CoursesPage() {
    const [enrollModal, setEnrollModal] = useState({ open: false, course: null });

    const openEnroll = (course) => setEnrollModal({ open: true, course: course || null });
    const closeEnroll = () => setEnrollModal((m) => ({ ...m, open: false }));

    React.useEffect(() => {
        document.body.style.overflow = enrollModal.open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [enrollModal.open]);

    return (
        <div className="careers-page">
            <style>{CSS}</style>

            <HeroSection
                title="Learn Skills That Get You Hired"
                subtitle="Practical, project-based courses in web development, data science, design, and more — taught live by working professionals."
                eyebrow="Courses · Live & Self-Paced"
                breadcrumb="Courses"
                size="md"
            />

            <CourseListings />
            <WhyLearn />

            <section className="section final-cta">
                <Reveal className="glass-panel final-cta-panel">
                    <Sparkles size={22} className="final-cta-icon" />
                    <h2>Not sure which course is right for you?</h2>
                    <p>Tell us your goals and we'll recommend a track that fits.</p>
                    <button className="btn btn-primary" onClick={() => openEnroll(null)}>
                        Get Recommendations <ArrowRight size={16} />
                    </button>
                </Reveal>
            </section>

            <EnrollModal open={enrollModal.open} course={enrollModal.course} onClose={closeEnroll} />
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

/* ---------- layout helpers ---------- */
.section { max-width: 1180px; margin: 0 auto; padding: 72px 32px; }
.section-head { max-width: 620px; margin: 0 auto 44px; text-align: center; }
.section-head h2 { font-size: clamp(1.6rem, 3vw, 2.15rem); margin: 10px 0 12px; }
.section-head p { font-size: 1rem; }
.grid { display: grid; gap: 20px; }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 920px) { .grid-3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .grid-3 { grid-template-columns: 1fr; } }

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 14px;
}
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); box-shadow: 0 0 0 4px var(--accent-soft); }

/* ---------- glass surfaces ---------- */
.glass-card, .glass-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: var(--shadow-sm);
}
.glass-card { padding: 26px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s; }
.glass-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: rgba(110,168,255,0.4); }

.icon-badge {
  width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--accent-soft), rgba(79,209,197,0.12));
  color: var(--accent); margin-bottom: 16px; flex-shrink: 0;
}

/* ---------- why-learn cards ---------- */
.why-card h3 { font-size: 1.05rem; margin-bottom: 8px; }
.why-card p { font-size: 0.9rem; }

/* ---------- buttons ---------- */
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

/* ---------- filters ---------- */
.filter-panel { padding: 22px 24px; margin-bottom: 32px; }
.search-row { display: flex; align-items: center; gap: 10px; padding: 4px 6px 16px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.search-icon { color: var(--muted); flex-shrink: 0; }
.search-row input { flex: 1; border: none; background: transparent; outline: none; font-size: 1rem; color: var(--ink); }
.search-row input::placeholder { color: #9AA2B1; }
.clear-mini { border: none; background: var(--bg-alt); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: var(--muted); }
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

/* ---------- course cards ---------- */
.courses-grid { margin-top: 4px; }
.course-card { min-height: 420px; display: flex; flex-direction: column; }
.course-card-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
.course-thumb {
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: #040810; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
}
.course-card-heading { min-width: 0; }
.course-cat-pill {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent-2); background: rgba(79, 209, 197, 0.12);
  border: 1px solid rgba(79, 209, 197, 0.28); padding: 3px 10px; border-radius: 100px; display: inline-block;
}
.course-card-title { font-size: 1.1rem; font-weight: 700; line-height: 1.35; color: var(--ink); margin-top: 6px; }
.course-instructor { display: block; font-size: 0.8rem; color: var(--muted); margin-top: 3px; }
.course-desc {
  font-size: 0.87rem; line-height: 1.6; color: var(--muted);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.course-meta-row { display: flex; flex-wrap: wrap; gap: 8px; }
.meta-pill {
  display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--muted);
  background: var(--bg-alt); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px;
}
.course-skills-container { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-pill {
  font-size: 0.72rem; font-weight: 500; background: rgba(110, 168, 255, 0.08); color: var(--accent);
  border: 1px solid rgba(110, 168, 255, 0.2); padding: 4px 10px; border-radius: 999px;
}
.course-card-footer { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
.course-footer-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.rating-row { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; color: var(--ink); }
.rating-star { color: #f6ad55; fill: #f6ad55; }
.rating-students { font-weight: 400; color: var(--muted); margin-left: 2px; }
.course-price { display: inline-flex; align-items: center; font-size: 0.9rem; font-weight: 700; color: var(--accent); }
.course-price-original { font-size: 0.75rem; font-weight: 400; color: var(--muted); text-decoration: line-through; margin-left: 6px; }

.level-badge { font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.level-badge.beginner { background: var(--accent-soft); color: var(--accent); }
.level-badge.intermediate { background: var(--warn-soft); color: var(--warn); }
.level-badge.advanced { background: rgba(246,109,109,0.14); color: #f87171; }

.empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }

/* ---------- final cta ---------- */
.final-cta-panel { text-align: center; padding: 56px 30px; }
.final-cta-icon { color: var(--accent); margin-bottom: 14px; }

/* ---------- reveal-on-scroll ---------- */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
.reveal.in-view { opacity: 1; transform: translateY(0); }

/* ---------- enroll modal (crs-*) ---------- */
.crs-modal-overlay {
  position: fixed; inset: 0; background: rgba(10,14,28,0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  animation: crsFadeIn .25s ease;
}
@keyframes crsFadeIn { from { opacity: 0; } to { opacity: 1; } }
.crs-modal-card {
  background: var(--surface-solid); border-radius: 22px; padding: 34px; width: 100%; max-width: 540px;
  max-height: 88vh; overflow-y: auto; position: relative; box-shadow: var(--shadow-lg); border: 1px solid var(--border);
  animation: crsModalPop .35s cubic-bezier(.2,.9,.25,1.1);
}
@keyframes crsModalPop { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.crs-modal-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 22px 22px 0 0; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
.crs-modal-close { position: absolute; top: 20px; right: 20px; background: var(--bg-alt); border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: background .2s, color .2s; z-index: 1; }
.crs-modal-close:hover { background: var(--accent-soft); color: var(--accent); }
.crs-modal-header { margin-bottom: 22px; padding-right: 30px; }
.crs-modal-eyebrow {
  display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px;
}
.crs-modal-title { font-size: 1.35rem; margin-bottom: 6px; }
.crs-modal-sub { font-size: 0.9rem; }
.crs-form { display: flex; flex-direction: column; gap: 16px; }
.crs-field { display: flex; flex-direction: column; gap: 6px; }
.crs-field label { font-size: 0.8rem; font-weight: 600; color: var(--muted); }
.crs-field label em { font-weight: 400; font-style: normal; opacity: 0.7; }
.crs-field input, .crs-field textarea, .crs-field select {
  border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 0.92rem; color: var(--ink);
  outline: none; background: var(--bg-alt); transition: border-color .2s; resize: vertical;
}
.crs-field input:focus, .crs-field textarea:focus, .crs-field select:focus { border-color: var(--accent); }
.crs-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 480px) { .crs-field-row { grid-template-columns: 1fr; } }
.crs-submit-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
  padding: 13px 24px; border-radius: 999px; font-weight: 600; font-size: 0.92rem; border: none; margin-top: 4px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.55); transition: transform .25s ease, box-shadow .25s ease;
}
.crs-submit-btn:hover { box-shadow: 0 14px 30px -8px rgba(79,209,197,0.65); transform: translateY(-2px); }
.crs-submit-btn:active { transform: scale(0.97); }
.crs-success { text-align: center; padding: 24px 10px; }
.crs-success-icon {
  width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--accent-soft); color: var(--accent-2); margin: 0 auto 16px;
}
.crs-success h3 { font-size: 1.4rem; margin-bottom: 10px; }
.crs-success p { font-size: 0.95rem; margin-bottom: 24px; }
`;