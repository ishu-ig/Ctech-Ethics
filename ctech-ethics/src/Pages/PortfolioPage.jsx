import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import HeroSection from '../Components/HeroSection';
import ConsultancyModal from '../Components/ConsultancyModal';
import PortfolioCard from '../Components/PortfolioCard';
import { getPortfolio } from '../Redux/ActionCreators/PortfolioActionCreators';

/* ── Design Tokens ─────────────────────────────── */
const FONT_HEAD = "'Space Grotesk', sans-serif";

/* ── Animation Variants ─────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

/* ── Fallback Portfolio Data (used only if API returns nothing) ── */
const PORTFOLIO_DATA = [
    {
        id: 1,
        title: 'FinTech Analytics Platform',
        category: 'Web Development',
        image: 'https://picsum.photos/seed/fintech/800/600',
        desc: 'A secure, high-performance financial dashboard handling real-time trading data and user portfolios.',
        tech: [{ icon: 'fa-react', color: '#61dafb' }, { icon: 'fa-node-js', color: '#68a063' }, { icon: 'fa-aws', color: '#ff9900' }],
        link: '/portfolio/fintech'
    },
    {
        id: 2,
        title: 'HealthCare AI Diagnostic',
        category: 'AI Solutions',
        image: 'https://picsum.photos/seed/health/800/600',
        desc: 'An AI-driven diagnostic tool that assists doctors in analyzing X-rays with 98% accuracy.',
        tech: [{ icon: 'fa-python', color: '#3776ab' }, { icon: 'fa-brain', color: '#10a37f' }, { icon: 'fa-docker', color: '#2496ed' }],
        link: '/portfolio/healthcare-ai'
    },
    {
        id: 3,
        title: 'Global E-Commerce App',
        category: 'Mobile Apps',
        image: 'https://picsum.photos/seed/ecommerce/800/600',
        desc: 'A cross-platform mobile shopping experience with seamless payment integrations and AR product preview.',
        tech: [{ icon: 'fa-mobile', color: '#61dafb' }, { icon: 'fa-stripe', color: '#6772e5' }, { icon: 'fa-apple', color: '#fff' }],
        link: '/portfolio/ecommerce'
    },
    {
        id: 4,
        title: 'SaaS Dashboard Redesign',
        category: 'UI/UX Design',
        image: 'https://picsum.photos/seed/uiux/800/600',
        desc: 'A complete UX overhaul for a B2B SaaS platform, reducing user onboarding time by 40%.',
        tech: [{ icon: 'fa-figma', color: '#f24e1e' }, { icon: 'fa-react', color: '#61dafb' }],
        link: '/portfolio/saas-redesign'
    },
    {
        id: 5,
        title: 'Logistics Fleet Tracker',
        category: 'Web Development',
        image: 'https://picsum.photos/seed/logistics/800/600',
        desc: 'A real-time GPS tracking web application for managing national delivery fleets and optimizing routes.',
        tech: [{ icon: 'fa-vuejs', color: '#42b883' }, { icon: 'fa-node-js', color: '#68a063' }, { icon: 'fa-database', color: '#47a248' }],
        link: '/portfolio/logistics'
    }
];

const FALLBACK_CATEGORIES = ['All', 'Web Development', 'AI Solutions', 'Mobile Apps', 'UI/UX Design'];

const PORTFOLIO_CAT_ICONS = {
    'All': 'bi-grid-fill',
    'Web Development': 'bi-code-slash',
    'Mobile Apps': 'bi-phone-fill',
    'AI Solutions': 'bi-cpu-fill',
    'UI/UX Design': 'bi-palette-fill',
};

/* ── Main Portfolio Page Component ──────────────── */
export default function PortfolioPage() {
    const dispatch = useDispatch();
    const rawData = useSelector((state) => state.PortfolioStateData);
    const PortfolioStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    useEffect(() => {
        dispatch(getPortfolio());
    }, [dispatch]);

    const projectsData = PortfolioStateData.length > 0 ? PortfolioStateData : PORTFOLIO_DATA;

    const [activeFilter, setActiveFilter] = useState('All');
    const [isConsultancyOpen, setIsConsultancyOpen] = useState(false);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);

    const CATEGORIES = useMemo(() => {
        const unique = [...new Set(projectsData.map(p => p.category).filter(Boolean))];
        return unique.length > 0 ? ['All', ...unique] : FALLBACK_CATEGORIES;
    }, [projectsData]);

    useEffect(() => {
        if (!CATEGORIES.includes(activeFilter)) {
            setActiveFilter('All');
        }
    }, [CATEGORIES, activeFilter]);

    const filteredProjects = activeFilter === 'All'
        ? projectsData
        : projectsData.filter(project => project.category === activeFilter);

    return (
        <div className="portfolio-page-wrapper">

            {/* 1. HERO SECTION */}
            <HeroSection
                title="Our Portfolio"
                subtitle="Explore our latest digital transformations, innovative engineering solutions, and AI-driven platforms built for industry leaders."
                eyebrow="Case Studies · Proven Results"
                breadcrumb="Portfolio"
                size="md"
            />

            {/* 2. PORTFOLIO GRID SECTION */}
            <section className="py-5 my-4">
                <div className="container">

                    {/* Header & Filters */}
                    <div className="text-center mb-4">
                        <motion.div
                            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                        >
                            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', color: 'var(--heading-color)', marginBottom: 20 }}>
                                Featured Projects
                            </h2>
                        </motion.div>

                        {/* Category Popup Trigger Button */}
                        <div className="blog-cat-trigger-bar text-center mb-4">
                            <button
                                type="button"
                                className="blog-cat-modal-btn"
                                onClick={() => setIsCatModalOpen(true)}
                            >
                                <i className="bi bi-grid-3x3-gap-fill me-1"></i>
                                <span>Browse Categories</span>
                                <span className="active-chip">{activeFilter}</span>
                                <i className="bi bi-chevron-down ms-1"></i>
                            </button>
                        </div>
                    </div>

                    {/* CATEGORY POPUP MODAL */}
                    <AnimatePresence>
                        {isCatModalOpen && (
                            <div className="cjd-modal-overlay" onClick={() => setIsCatModalOpen(false)}>
                                <motion.div
                                    className="cjd-modal-card blog-cat-popup-modal"
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.94, y: 15 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="cjd-modal-accent" />
                                    <button
                                        type="button"
                                        className="cjd-modal-close"
                                        onClick={() => setIsCatModalOpen(false)}
                                        aria-label="Close modal"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                    <div className="cjd-modal-header mb-3">
                                        <span className="cjd-modal-eyebrow">
                                            <i className="bi bi-folder-fill me-1"></i> Portfolio Categories
                                        </span>
                                        <h3 className="cjd-modal-title">Select Category</h3>
                                        <p className="cjd-modal-sub">
                                            Explore case studies by domain ({CATEGORIES.length} categories available)
                                        </p>
                                    </div>

                                    <div className="blog-cat-popup-grid">
                                        {CATEGORIES.map((cat) => {
                                            const count = cat === 'All'
                                                ? projectsData.length
                                                : projectsData.filter((p) => p.category === cat).length;
                                            const icon = PORTFOLIO_CAT_ICONS[cat] || 'bi-folder2-open';
                                            const isActive = activeFilter === cat;

                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    className={`blog-cat-popup-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveFilter(cat);
                                                        setIsCatModalOpen(false);
                                                    }}
                                                >
                                                    <div className="cat-item-left">
                                                        <div className="cat-item-icon">
                                                            <i className={`bi ${icon}`}></i>
                                                        </div>
                                                        <div className="cat-item-text">
                                                            <span className="cat-item-name">{cat}</span>
                                                            <span className="cat-item-count">{count} {count === 1 ? 'project' : 'projects'}</span>
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <div className="cat-item-check">
                                                            <i className="bi bi-check-circle-fill"></i>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Animated Grid using the PortfolioCard component */}
                    <motion.div
                        className="row g-2 g-sm-3 g-md-4"
                        variants={staggerParent}
                        initial="hidden"
                        animate="show"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project._id || project.id}
                                    className="col-6 col-md-4 d-flex"
                                >
                                    <PortfolioCard project={project} />
                                </div>
                            ))}
                        </AnimatePresence>

                        {/* Fallback if no projects match */}
                        {filteredProjects.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-12 text-center py-5">
                                <h4 className="portfolio-empty-text">No projects found in this category.</h4>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* 3. CTA SECTION */}
            <section className="container py-5 mb-4">
                <motion.div
                    className="portfolio-cta-card p-5 text-center position-relative"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55 }}
                >
                    <h2 className="portfolio-cta-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.2vw, 2.2rem)', marginBottom: 12 }}>
                        Ready to start your next project?
                    </h2>
                    <p className="portfolio-cta-sub mb-4" style={{ fontSize: '1rem', maxWidth: 540, margin: '0 auto 28px' }}>
                        Let’s transform your ideas into reality. Schedule a free consultation with our tech advisors to discuss your vision.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <motion.button
                            type="button"
                            className="btn rounded-pill px-4 py-2 fw-bold"
                            onClick={() => setIsConsultancyOpen(true)}
                            whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79,209,197,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{ background: 'linear-gradient(135deg, #6ea8ff, #4fd1c5)', border: 'none', color: '#040810', fontSize: '0.95rem' }}
                        >
                            Start a Project
                        </motion.button>
                        <Link
                            to="/contactus"
                            className="btn portfolio-cta-contact-btn rounded-pill px-4 py-2"
                            style={{ fontSize: '0.95rem', textDecoration: 'none' }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* CONSULTANCY MODAL */}
            <ConsultancyModal
                isOpen={isConsultancyOpen}
                onClose={() => setIsConsultancyOpen(false)}
            />
        </div>
    );
}