import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Rocket, GraduationCap, HeartHandshake, CalendarClock, Layers, Users,
    Search, Briefcase, X, ArrowRight,
    FileText, ClipboardList, MessagesSquare, Code2, MailCheck, PartyPopper,
    Wallet, Clock3, TrendingUp, UsersRound, BookOpen, Award,
    ChevronDown, Sparkles, SlidersHorizontal,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useDispatch, useSelector } from "react-redux";

import HeroSection from "../Components/HeroSection";
import CommonJobCard, { useInView, Reveal, Eyebrow } from "../Components/JobCard";
import { getCareer } from "../Redux/ActionCreators/CareerActionCreators";

/* ------------------------------------------------------------------ */
/*  DATA — Careers at CTech Ethic Solution                             */
/* ------------------------------------------------------------------ */

const WHY_JOIN = [
    { icon: Rocket, title: "Career Growth", copy: "Clear paths forward, real promotions, and work that stretches you a little more every quarter." },
    { icon: GraduationCap, title: "Learning & Development", copy: "Paid courses, internal workshops, and dedicated hours every week to sharpen your craft." },
    { icon: HeartHandshake, title: "Friendly Work Environment", copy: "Flat hierarchy, open doors, and a team that would rather help you than judge you." },
    { icon: CalendarClock, title: "Flexible Work Culture", copy: "Hybrid, remote, or in-office — we care about the outcome, not the hours logged." },
    { icon: Layers, title: "Real-World Projects", copy: "Ship products used by real clients from week one, not sandbox tickets nobody sees." },
    { icon: Users, title: "Mentorship & Guidance", copy: "Every new hire is paired with a senior engineer or lead for their first six months." },
];

const DEPARTMENTS = ["Engineering", "Design", "Data", "Marketing", "Business"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Remote", "Hybrid"];
const EXPERIENCE_LEVELS = ["Fresher", "1–2 Years", "3–5 Years", "5+ Years"];
const LOCATIONS = ["Dehradun, IN", "Bengaluru, IN", "Remote"];

export const JOBS = [
    {
        id: "mern-01", title: "MERN Stack Developer", department: "Engineering",
        type: "Full-Time", experience: "1–2 Years", location: "Dehradun, IN",
        salary: "₹6L – ₹10L / yr",
        description: "Build and ship full-stack features across our client products using MongoDB, Express, React and Node — from schema to UI.",
        skills: ["MongoDB", "Express", "React", "Node.js", "REST APIs"],
    },
    {
        id: "react-02", title: "React Developer", department: "Engineering",
        type: "Full-Time", experience: "Fresher", location: "Remote",
        salary: "₹3.5L – ₹5L / yr",
        description: "Turn Figma designs into fast, accessible React interfaces, working closely with our design and backend teams.",
        skills: ["React", "JavaScript", "CSS", "Git"],
    },
    {
        id: "rn-03", title: "React Native Developer", department: "Engineering",
        type: "Hybrid", experience: "1–2 Years", location: "Dehradun, IN",
        salary: "₹5L – ₹8L / yr",
        description: "Own features end-to-end in our cross-platform mobile apps, from native modules to App Store releases.",
        skills: ["React Native", "TypeScript", "Redux", "Firebase"],
    },
    {
        id: "uiux-04", title: "UI/UX Designer", department: "Design",
        type: "Full-Time", experience: "1–2 Years", location: "Remote",
        salary: "₹4.5L – ₹7L / yr",
        description: "Design intuitive, delightful interfaces for web and mobile products, from research and wireframes to polished UI kits.",
        skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    },
    {
        id: "aiml-05", title: "AI/ML Developer", department: "Engineering",
        type: "Hybrid", experience: "3–5 Years", location: "Dehradun, IN",
        salary: "₹10L – ₹16L / yr",
        description: "Design, train, and deploy ML models that power recommendation, automation, and analytics features for clients.",
        skills: ["Python", "PyTorch", "NLP", "MLOps"],
    },
    {
        id: "dm-06", title: "Digital Marketing Executive", department: "Marketing",
        type: "Full-Time", experience: "Fresher", location: "Dehradun, IN",
        salary: "₹3L – ₹4.5L / yr",
        description: "Plan and run SEO, paid, and social campaigns that grow our brand and our clients' pipelines.",
        skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
    },
    {
        id: "da-07", title: "Data Analyst", department: "Data",
        type: "Remote", experience: "1–2 Years", location: "Remote",
        salary: "₹5L – ₹7.5L / yr",
        description: "Turn raw data into dashboards and decisions — SQL, Python, and a sharp eye for what actually matters.",
        skills: ["SQL", "Python", "Power BI", "Statistics"],
    },
    {
        id: "bde-08", title: "Business Development Executive", department: "Business",
        type: "Full-Time", experience: "1–2 Years", location: "Dehradun, IN",
        salary: "₹4L – ₹6L / yr",
        description: "Identify, pitch, and close new business opportunities while nurturing long-term client relationships.",
        skills: ["Lead Generation", "CRM", "Negotiation", "Client Relations"],
    },
    {
        id: "intern-09", title: "Software Development Intern", department: "Engineering",
        type: "Internship", experience: "Fresher", location: "Remote",
        description: "A 3–6 month hands-on internship building real product features alongside a dedicated mentor.",
        skills: ["JavaScript", "React", "Git", "Problem Solving"],
    },
];

const INTERNSHIP_BENEFITS = [
    { icon: Code2, title: "Live Projects", copy: "Work on production codebases, not throwaway assignments." },
    { icon: Users, title: "Industry Mentorship", copy: "Weekly 1:1s with senior engineers who actually review your code." },
    { icon: Award, title: "Certificate", copy: "A completion certificate recognised by our hiring partners." },
    { icon: Briefcase, title: "Placement Assistance", copy: "Top performers get first access to full-time openings." },
    { icon: Clock3, title: "Flexible Learning", copy: "Self-paced tracks that fit around college or other commitments." },
];

export const PROCESS_STEPS = [
    { icon: FileText, title: "Apply", copy: "Submit your application and resume in under two minutes." },
    { icon: ClipboardList, title: "Resume Review", copy: "Our talent team reviews every application within 3–5 days." },
    { icon: MessagesSquare, title: "Interview", copy: "A friendly conversation about your background and goals." },
    { icon: Code2, title: "Technical Round", copy: "Show us how you think through real, practical problems." },
    { icon: MailCheck, title: "Offer Letter", copy: "We move fast — most offers go out within a week of the final round." },
    { icon: PartyPopper, title: "Join Us", copy: "Onboarding, a mentor, and your first project on day one." },
];

export const BENEFITS = [
    { icon: Wallet, title: "Competitive Salary", copy: "Pay benchmarked to market rate, reviewed every year." },
    { icon: Clock3, title: "Flexible Working", copy: "Hybrid and remote options with flexible hours." },
    { icon: TrendingUp, title: "Professional Growth", copy: "Structured career ladders and internal mobility." },
    { icon: UsersRound, title: "Team Collaboration", copy: "Small, cross-functional pods — no silos, no red tape." },
    { icon: BookOpen, title: "Training Programs", copy: "Certifications and courses fully sponsored by us." },
    { icon: Award, title: "Performance Rewards", copy: "Quarterly recognition and bonuses tied to real impact." },
];

const STATS = [
    { icon: UsersRound, value: 120, suffix: "+", label: "Team Members" },
    { icon: Briefcase, value: JOBS.length, suffix: "", label: "Open Positions" },
    { icon: GraduationCap, value: 300, suffix: "+", label: "Interns Trained" },
    { icon: Award, value: 250, suffix: "+", label: "Successful Placements" },
];

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
/* ------------------------------------------------------------------ */

function useCountUp(target, active, duration = 1400) {
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
/*  WHY JOIN US (SWIPER CAROUSEL)                                      */
/* ------------------------------------------------------------------ */

function WhyJoin() {
    return (
        <section id="why-join" className="section section-alt">
            <div className="section-head">
                <Eyebrow>Why CTech Ethic</Eyebrow>
                <h2>A place built for people who want to grow</h2>
                <p>Six reasons our team sticks around — straight from the people who work here.</p>
            </div>

            <div className="why-swiper-wrapper position-relative">
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    pagination={{ clickable: true, el: '.why-swiper-pagination' }}
                    navigation={{ nextEl: '.why-swiper-next', prevEl: '.why-swiper-prev' }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 3, spaceBetween: 24 }
                    }}
                    className="why-swiper-container pb-5"
                >
                    {WHY_JOIN.map((item) => (
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
                    <button type="button" className="why-swiper-prev swiper-nav-btn" aria-label="Previous slide">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="why-swiper-pagination swiper-custom-dots w-auto d-inline-flex" />
                    <button type="button" className="why-swiper-next swiper-nav-btn" aria-label="Next slide">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
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
        filters.query || filters.department !== "All" || filters.type !== "All" ||
        filters.experience !== "All" || filters.location !== "All";

    const clear = () =>
        setFilters({ query: "", department: "All", type: "All", experience: "All", location: "All" });

    return (
        <div className="glass-panel filter-panel mx-3 mx-md-4 mx-lg-5">
            <div className="search-row">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by job title, skills, or keywords…"
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
                <FilterSelect label="Department" value={filters.department} onChange={update("department")} options={DEPARTMENTS} />
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
/*  JOB CARD + LISTINGS                                                 */
/* ------------------------------------------------------------------ */

function Jobs() {
    const [filters, setFilters] = useState({
        query: "", department: "All", type: "All", experience: "All", location: "All",
    });

    const dispatch = useDispatch();
    const rawCareers = useSelector((state) => state.CareerStateData);

    useEffect(() => {
        dispatch(getCareer());
    }, [dispatch]);

    const careerList = Array.isArray(rawCareers) ? rawCareers : (rawCareers?.data || []);

    const activeCareers = careerList
        .filter((item) => item.status !== false)
        .map((item) => {
            let locStr = "Remote";
            if (typeof item.location === "string" && item.location) {
                locStr = item.location;
            } else if (item.location && (item.location.city || item.location.state)) {
                locStr = [item.location.city, item.location.state].filter(Boolean).join(", ");
            }

            const skillsArr = Array.isArray(item.skills)
                ? item.skills
                : (typeof item.skills === 'string' && item.skills.trim()
                    ? item.skills.split(',').map((s) => s.trim()).filter(Boolean)
                    : []);

            return {
                ...item,
                id: item._id || item.id,
                title: item.title,
                department: item.department || "Engineering",
                type: item.type || "Full-Time",
                experience: item.experience || "Fresher",
                location: locStr,
                salary: item.salary || "",
                description: item.shortDescription || item.description || "",
                skills: skillsArr,
            };
        });

    const jobsData = activeCareers.length > 0 ? activeCareers : JOBS;

    const filtered = useMemo(() => {
        const q = filters.query.trim().toLowerCase();
        return jobsData.filter((job) => {
            const matchesQuery =
                !q ||
                job.title.toLowerCase().includes(q) ||
                (job.skills && job.skills.some((s) => s.toLowerCase().includes(q))) ||
                (job.department && job.department.toLowerCase().includes(q));
            const matchesDept = filters.department === "All" || job.department === filters.department;
            const matchesType = filters.type === "All" || job.type === filters.type;
            const matchesExp = filters.experience === "All" || job.experience === filters.experience;
            const matchesLoc = filters.location === "All" || job.location === filters.location;
            return matchesQuery && matchesDept && matchesType && matchesExp && matchesLoc;
        });
    }, [filters, jobsData]);

    return (
        <section id="openings" className="section container">
            <div className="section-head">
                <Eyebrow>Current Openings</Eyebrow>
                <h2>Find the role that fits you at CTech Ethic</h2>
                <p>Search and filter internal team roles instantly — no page reloads, no waiting.</p>
            </div>

            <JobFilters filters={filters} setFilters={setFilters} count={filtered.length} total={jobsData.length} />

            {filtered.length > 0 ? (
                <div className="grid grid-3 jobs-grid align-items-stretch mx-3 mx-md-4 mx-lg-5">
                    {filtered.map((job, i) => (
                        <CommonJobCard
                            key={job.id}
                            job={job}
                            variant="internal"
                            delay={(i % 3) * 70}
                            detailsLink={`/jobdetails/${job.id}`}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Search size={28} />
                    <h3>No roles match those filters</h3>
                    <p>Try a broader search or clear your filters to see everything we've got open.</p>
                </div>
            )}
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  INTERNSHIP                                                          */
/* ------------------------------------------------------------------ */

function Internship() {
    return (
        <section id="internship" className="section">
            <div className="glass-panel internship-panel">
                <div className="internship-copy">
                    <Eyebrow>Internship Program</Eyebrow>
                    <h2>Start here. Learn fast. Get placed.</h2>
                    <p>
                        Our internship isn't coffee runs and busywork — it's live client projects,
                        a dedicated mentor, and a clear path to a full-time offer for those who show up.
                    </p>
                    <Link to="/jobdetails/cf-intern" className="btn btn-primary">
                        View Internship Details <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="internship-benefits">
                    {INTERNSHIP_BENEFITS.map((b) => (
                        <div key={b.title} className="internship-item">
                            <div className="icon-badge icon-badge-sm"><b.icon size={16} /></div>
                            <div>
                                <h4>{b.title}</h4>
                                <p>{b.copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  RECRUITMENT PROCESS                                                */
/* ------------------------------------------------------------------ */

function ProcessTimeline() {
    const [ref, inView] = useInView({ threshold: 0.1 });
    const rowOne = PROCESS_STEPS.slice(0, 3);
    const rowTwo = PROCESS_STEPS.slice(3, 6);

    return (
        <section id="process" className="section section-alt">
            <div className="section-head">
                <Eyebrow>Recruitment Process</Eyebrow>
                <h2>Six steps. One clear thread. No black box.</h2>
                <p>Here's exactly what happens between hitting "Apply" and your first day.</p>
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
                        {PROCESS_STEPS.map((step, idx) => (
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
                                        {idx % 2 === 0 && idx < PROCESS_STEPS.length - 1 && (
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

/* ------------------------------------------------------------------ */
/*  BENEFITS (SWIPER CAROUSEL)                                         */
/* ------------------------------------------------------------------ */

function Benefits() {
    return (
        <section className="section">
            <div className="section-head">
                <Eyebrow>Employee Benefits</Eyebrow>
                <h2>What you get, beyond the paycheck</h2>
            </div>

            <div className="benefits-swiper-wrapper position-relative">
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    pagination={{ clickable: true, el: '.benefits-swiper-pagination' }}
                    navigation={{ nextEl: '.benefits-swiper-next', prevEl: '.benefits-swiper-prev' }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 3, spaceBetween: 24 }
                    }}
                    className="benefits-swiper-container pb-5"
                >
                    {BENEFITS.map((b) => (
                        <SwiperSlide key={b.title} className="h-auto">
                            <div className="glass-card benefit-card h-100 d-flex flex-column">
                                <div className="icon-badge"><b.icon size={20} /></div>
                                <h3>{b.title}</h3>
                                <p>{b.copy}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                    <button type="button" className="benefits-swiper-prev swiper-nav-btn" aria-label="Previous slide">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="benefits-swiper-pagination swiper-custom-dots w-auto d-inline-flex" />
                    <button type="button" className="benefits-swiper-next swiper-nav-btn" aria-label="Next slide">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  STATS                                                               */
/* ------------------------------------------------------------------ */

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
/*  ROOT                                                                */
/* ------------------------------------------------------------------ */

export default function CareerPage() {
    return (
        <div className="careers-page">
            <style>{CSS}</style>

            {/* HERO SECTION */}
            <HeroSection
                title="Build Your Career With Us"
                subtitle="Ship real products, learn from engineers who care, and grow at a pace that matches your ambition. Whether writing your first line of code or leading teams — there's a seat here for you."
                eyebrow="We're Hiring · Students, Freshers & Professionals"
                breadcrumb="Careers"
                size="md"
            />

            <Jobs />
            <WhyJoin />
            <Internship />
            <ProcessTimeline />
            <Benefits />
            <Stats />

            <section className="section final-cta">
                <Reveal className="glass-panel final-cta-panel">
                    <Sparkles size={22} className="final-cta-icon" />
                    <h2>Ready to build something real?</h2>
                    <p>We read every application. Send us yours.</p>
                    <Link to="/placementjobs" className="btn btn-primary">
                        View Open Roles <ArrowRight size={16} />
                    </Link>
                </Reveal>
            </section>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

.careers-page {
  --bg: #05070d;
  --bg-alt: rgba(110,168,255,0.035);
  --surface: rgba(255,255,255,0.045);
  --surface-hover: rgba(255,255,255,0.07);
  --surface-solid: #0b1220;
  --border: rgba(110,168,255,0.14);
  --border-strong: rgba(110,168,255,0.32);
  --ink: #f4f7fc;
  --muted: rgba(203,213,235,0.62);
  --muted-dim: rgba(203,213,235,0.42);
  --accent: #6ea8ff;
  --accent-2: #4fd1c5;
  --accent-soft: rgba(110,168,255,0.12);

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.35);
  --shadow-md: 0 4px 10px rgba(0,0,0,0.28), 0 16px 36px -14px rgba(0,0,0,0.6);
  --shadow-lg: 0 8px 20px rgba(0,0,0,0.35), 0 30px 70px -20px rgba(0,0,0,0.85);

  --radius: 18px;
  --radius-sm: 12px;

  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-6: 28px;
  --sp-7: 40px;
  --sp-8: 56px;
  --sp-9: 80px;

  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  line-height: 1.5;
  overflow-x: hidden;
  position: relative;
}

.careers-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(680px 420px at 12% 0%, rgba(110,168,255,0.10), transparent 60%),
    radial-gradient(560px 380px at 88% 22%, rgba(79,209,197,0.08), transparent 65%);
}
.careers-page > * { position: relative; z-index: 1; }

[data-theme="light"] .careers-page {
  --bg: #f8fafc;
  --bg-alt: rgba(37,99,235,0.045);
  --surface: rgba(255,255,255,0.92);
  --surface-hover: #ffffff;
  --surface-solid: #ffffff;
  --border: rgba(203,213,225,0.9);
  --border-strong: rgba(148,163,184,0.9);
  --ink: #0f172a;
  --muted: rgba(71,85,105,0.85);
  --muted-dim: rgba(71,85,105,0.55);
  --accent: #2563eb;
  --accent-2: #0d9488;
  --accent-soft: rgba(37,99,235,0.08);
}

.careers-page *, .careers-page *::before, .careers-page *::after { box-sizing: border-box; }

.careers-page h1, .careers-page h2, .careers-page h3, .careers-page h4 {
  font-family: 'Sora', 'Inter', sans-serif;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.015em;
  font-weight: 700;
}
.careers-page p { margin: 0; color: var(--muted); }
.careers-page a { color: inherit; text-decoration: none; }
.careers-page button { font-family: inherit; cursor: pointer; }
.careers-page input, .careers-page select, .careers-page textarea { font-family: inherit; }

.careers-page a:focus-visible,
.careers-page button:focus-visible,
.careers-page input:focus-visible,
.careers-page select:focus-visible,
.careers-page textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .careers-page * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ---------- layout helpers ---------- */
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

.section-head { max-width: 660px; margin: 0 auto calc(var(--sp-6) + var(--sp-2)); text-align: center; }
.section-head h2 { font-size: clamp(1.65rem, 3.2vw, 2.35rem); margin: var(--sp-2) 0 var(--sp-3); line-height: 1.22; }
.section-head p { font-size: 1rem; line-height: 1.65; color: var(--muted); }

/* ---------- dynamic responsive grid for jobs ---------- */
.grid { display: grid; gap: 24px; }

/* Desktop & Laptop (>1024px) & Tablet (769px - 1024px) -> 3 columns */
.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

/* Mobile (<=768px down to 340px) -> 2 columns */
@media (max-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (max-width: 340px) {
  .grid-3 {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

.eyebrow {
  display: inline-flex; align-items: center; gap: var(--sp-2);
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.09em; text-transform: uppercase; color: var(--accent);
  margin-bottom: var(--sp-2);
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
.glass-card {
  padding: var(--sp-6) var(--sp-5);
  transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s, background .35s;
}
.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.icon-badge {
  width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--accent-soft), rgba(79,209,197,0.12));
  color: var(--accent); margin-bottom: var(--sp-4); flex-shrink: 0;
}
.icon-badge-sm { width: 36px; height: 36px; border-radius: 10px; margin-bottom: var(--sp-2); }

/* ---------- Swiper Controls ---------- */
.swiper-nav-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border); color: var(--ink);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s ease;
}
.swiper-nav-btn:hover { background: var(--accent); color: #040810; border-color: var(--accent); transform: scale(1.08); }
.swiper-custom-dots .swiper-pagination-bullet { background: var(--muted); opacity: 0.4; transition: all 0.3s ease; }
.swiper-custom-dots .swiper-pagination-bullet-active { background: var(--accent); opacity: 1; width: 24px; border-radius: 10px; }

/* ---------- buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-2);
  padding: 13px 26px; border-radius: 999px; font-weight: 600; font-size: 0.92rem;
  border: 1px solid transparent; letter-spacing: -0.005em;
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
  white-space: nowrap;
}
.btn:active { transform: scale(0.97); }
.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #040810;
  box-shadow: 0 10px 24px -8px rgba(79,209,197,0.5);
}
.btn-primary:hover { box-shadow: 0 16px 34px -8px rgba(79,209,197,0.62); transform: translateY(-2px); }
.btn-ghost { background: var(--surface); color: var(--ink); border-color: var(--border); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: var(--surface-hover); }
.btn-sm { padding: 9px 18px; font-size: 0.85rem; }
.btn-block { width: 100%; margin-top: var(--sp-2); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ---------- why join / benefit card enhancements & hover animations ---------- */
.why-card, .benefit-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.why-card::before, .benefit-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  opacity: 0;
  transition: opacity 0.35s ease;
}
.why-card:hover, .benefit-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 14px 32px -10px rgba(110,168,255,0.28);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(110,168,255,0.04));
}
.why-card:hover::before, .benefit-card:hover::before {
  opacity: 1;
}
.why-card .icon-badge, .benefit-card .icon-badge {
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
}
.why-card:hover .icon-badge, .benefit-card:hover .icon-badge {
  transform: scale(1.1) rotate(4deg);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #040810;
}
.why-card h3, .benefit-card h3 { font-size: 1.08rem; margin-bottom: var(--sp-2); font-weight: 700; color: var(--ink); }
.why-card p, .benefit-card p { font-size: 0.91rem; line-height: 1.62; color: var(--muted); }

/* ---------- filters ---------- */
.filter-panel { padding: var(--sp-7) var(--sp-6); margin-bottom: var(--sp-7); }
.search-row {
  display: flex; align-items: center; gap: var(--sp-3);
  padding: var(--sp-1) var(--sp-1) var(--sp-5);
  border-bottom: 1px solid var(--border); margin-bottom: var(--sp-5);
}
.search-icon { color: var(--muted); flex-shrink: 0; }
.search-row input { flex: 1; border: none; background: transparent; outline: none; font-size: 1rem; color: var(--ink); }
.search-row input::placeholder { color: var(--muted-dim); }
.clear-mini {
  border: none; background: var(--bg-alt); border-radius: 50%;
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
  color: var(--muted); cursor: pointer; transition: background .2s, color .2s;
}
.clear-mini:hover { background: var(--accent-soft); color: var(--accent); }

.filter-row { display: flex; gap: var(--sp-4); align-items: flex-end; flex-wrap: wrap; }
.filter-field { display: flex; flex-direction: column; gap: var(--sp-2); font-size: 0.78rem; font-weight: 600; color: var(--muted); min-width: 140px; flex: 1; }
.select-wrap { position: relative; }
.select-wrap select {
  width: 100%; appearance: none; border: 1px solid var(--border); background: var(--surface-solid);
  border-radius: var(--radius-sm); padding: 11px 34px 11px 14px; font-size: 0.88rem; color: var(--ink); outline: none;
  transition: border-color .2s, background .2s;
}
.select-wrap select:hover { border-color: var(--border-strong); }
.select-wrap select:focus { border-color: var(--accent); }
.select-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.clear-btn { flex-shrink: 0; }
.filter-count { margin-top: var(--sp-5); padding-top: var(--sp-4); border-top: 1px dashed var(--border); font-size: 0.85rem; color: var(--muted); }
.filter-count strong { color: var(--ink); font-weight: 700; }
@media (max-width: 640px) {
  .filter-panel { padding: var(--sp-5) var(--sp-3); }
  .filter-row { gap: var(--sp-3); }
  .filter-field { min-width: 100%; }
}

/* ========================================================================= */
/*  RESPONSIVE JOB CARDS AND GRID                                            */
/* ========================================================================= */

.jobs-grid { margin-top: var(--sp-2); }
.job-card {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 20px;
  box-sizing: border-box;
  overflow: hidden; /* Prevents internal flex blowouts */
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
  .job-card { padding: 18px 14px !important; min-height: 340px; }
  
  /* Force top badges to stack so they don't fight for horizontal space */
  .job-card-header > .d-flex {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }
  
  .job-card-title { font-size: 0.95rem; line-height: 1.3; }
  .job-desc { font-size: 0.82rem; line-height: 1.5; -webkit-line-clamp: 3; }
  
  .job-dept-pill, .job-salary-badge { font-size: 0.65rem; padding: 4px 8px; }
  .meta-pill, .skill-pill { font-size: 0.65rem; padding: 4px 6px; gap: 2px; }
  
  .job-card .btn { font-size: 0.8rem; padding: 8px 10px; }
}

/* -- Mobile (481px to 768px) -> EXACTLY 2 COLUMNS -- */
@media (max-width: 768px) {
  .job-card { padding: 16px 12px !important; min-height: 300px; gap: 6px; }
  .job-card-header > .d-flex { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
  
  .job-card-title { font-size: 0.85rem; line-height: 1.25; }
  .job-desc { font-size: 0.75rem; line-height: 1.4; -webkit-line-clamp: 2; margin-bottom: 8px !important; }
  
  .job-dept-pill, .job-salary-badge { font-size: 0.6rem; padding: 3px 6px; }
  .meta-pill, .skill-pill { font-size: 0.6rem; padding: 3px 6px; gap: 2px; }
  
  .job-meta-row { gap: 4px; margin-bottom: 8px !important; }
  .job-skills-container { gap: 4px; }
  
  .job-card .btn { font-size: 0.75rem; padding: 8px 6px; }
  /* Hide the icon inside the button on mobile to save space */
  .job-card .btn svg { display: none; }
}

/* -- Tiny Mobile (<= 480px) -> STILL 2 COLUMNS, extreme squeeze -- */
@media (max-width: 480px) {
  .job-card { padding: 12px 8px !important; }
  .job-card-title { font-size: 0.8rem; }
  .job-desc { font-size: 0.7rem; }
  .meta-pill, .skill-pill, .job-dept-pill, .job-salary-badge { font-size: 0.55rem; padding: 2px 4px; }
  .job-card .btn { font-size: 0.7rem; padding: 6px 4px; }
}

.empty-state { text-align: center; padding: var(--sp-9) var(--sp-5); color: var(--muted); }
.empty-state svg { color: var(--accent); margin-bottom: var(--sp-4); }
.empty-state h3 { color: var(--ink); margin-bottom: var(--sp-2); font-size: 1.1rem; }

/* ---------- internship panel ---------- */
.internship-panel { padding: var(--sp-7) var(--sp-8); display: grid; grid-template-columns: 1.1fr 1fr; gap: var(--sp-8); align-items: center; }
@media (max-width: 860px) { .internship-panel { grid-template-columns: 1fr; padding: var(--sp-6) var(--sp-5); gap: var(--sp-6); } }
.internship-copy h2 { font-size: clamp(1.55rem, 3vw, 2.15rem); margin: var(--sp-2) 0 var(--sp-4); line-height: 1.25; }
.internship-copy p { margin-bottom: var(--sp-6); max-width: 480px; line-height: 1.68; }
.internship-benefits { display: flex; flex-direction: column; gap: var(--sp-5); }
.internship-item { display: flex; gap: var(--sp-3); align-items: flex-start; }
.internship-item h4 { font-size: 0.97rem; margin-bottom: 3px; font-weight: 600; }
.internship-item p { font-size: 0.87rem; line-height: 1.55; }

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
  letter-spacing: -0.03em;
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
  transition: transform 0.3s ease, background 0.3s ease;
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

/* ---------- stats ---------- */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr) !important;
  padding: var(--sp-7) var(--sp-6);
  gap: var(--sp-5);
}

@media (max-width: 768px) {
  .stats-panel {
    grid-template-columns: repeat(2, 1fr) !important;
    padding: var(--sp-6) var(--sp-4);
    gap: var(--sp-4) var(--sp-3);
  }
}
.stat-item { text-align: center; display: flex; flex-direction: column; align-items: center; }
.stat-value {
  font-family: 'Sora', sans-serif; font-size: clamp(1.9rem, 3vw, 2.5rem); font-weight: 700;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  letter-spacing: -0.02em;
}
.stat-label { font-size: 0.85rem; color: var(--muted); margin-top: var(--sp-1); }

/* ---------- final cta ---------- */
.final-cta-panel { text-align: center; padding: var(--sp-8) var(--sp-6); max-width: 800px; margin: 0 auto; }
.final-cta-icon { color: var(--accent); margin-bottom: var(--sp-3); }
.final-cta-panel h2 { font-size: clamp(1.65rem, 3vw, 2.25rem); margin-bottom: var(--sp-3); }
.final-cta-panel p { margin-bottom: var(--sp-6); max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.62; }

/* ---------- reveal-on-scroll ---------- */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
.reveal.in-view { opacity: 1; transform: translateY(0); }

/* ---------- modal ---------- */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(5,7,13,0.72); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--sp-5);
  animation: fadeIn .25s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-shell {
  background: var(--surface-solid); border-radius: 22px; padding: var(--sp-7); width: 100%; max-width: 540px;
  max-height: 88vh; overflow-y: auto; position: relative; box-shadow: var(--shadow-lg); border: 1px solid var(--border);
  animation: modalPop .35s cubic-bezier(.2,.9,.25,1.1);
}
@keyframes modalPop { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.modal-close {
  position: absolute; top: var(--sp-5); right: var(--sp-5); background: var(--bg-alt); border: none;
  width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: var(--muted); transition: background .2s, color .2s;
}
.modal-close:hover { background: var(--accent-soft); color: var(--accent); }
.modal-head { margin-bottom: var(--sp-6); padding-right: 30px; }
.modal-head h3 { font-size: 1.35rem; margin-bottom: var(--sp-2); }
.apply-form { display: flex; flex-direction: column; gap: var(--sp-4); }
.apply-form label { display: flex; flex-direction: column; gap: var(--sp-2); font-size: 0.8rem; font-weight: 600; color: var(--muted); }
.apply-form label em { font-weight: 400; font-style: normal; opacity: 0.7; }
.apply-form input, .apply-form textarea, .apply-form select {
  border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 0.92rem; color: var(--ink);
  outline: none; background: var(--bg-alt); transition: border-color .2s; resize: vertical;
}
.apply-form input:focus, .apply-form textarea:focus, .apply-form select:focus { border-color: var(--accent); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
.file-field .file-drop {
  display: flex; align-items: center; gap: var(--sp-3); border: 1.5px dashed var(--border); border-radius: var(--radius-sm);
  padding: var(--sp-4); position: relative; font-size: 0.85rem; color: var(--muted); font-weight: 400; transition: border-color .2s;
}
.file-field .file-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.modal-success { text-align: center; padding: var(--sp-6) var(--sp-3); }
.success-icon { color: var(--accent-2); margin-bottom: var(--sp-4); }
.modal-success h3 { font-size: 1.4rem; margin-bottom: var(--sp-3); }
.modal-success p { font-size: 0.95rem; margin-bottom: var(--sp-6); }
`;