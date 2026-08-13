import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../Components/HeroSection';
import ConsultancyModal from '../Components/ConsultancyModal';
import PortfolioCard from '../Components/PortfolioCard';
import { getPortfolio } from '../Redux/ActionCreators/PortfolioActionCreators';

/* ── Fallback Projects Data ── */
const PORTFOLIO_FALLBACKS = [
    {
        _id: '1',
        id: 1,
        title: 'FinTech Analytics Dashboard & Trading Platform',
        category: 'Web Development',
        client: 'Global TradeCorp Inc.',
        year: '2024',
        duration: '4 Months',
        image: 'https://picsum.photos/seed/fintech/1200/700',
        images: [
            'https://picsum.photos/seed/fintech/1200/700',
            'https://picsum.photos/seed/fintech2/1200/700',
            'https://picsum.photos/seed/fintech3/1200/700',
        ],
        desc: 'A secure, high-performance financial dashboard handling real-time trading data, automated risk analysis, and user portfolio management with sub-millisecond updates.',
        challenge: 'The client needed to upgrade their legacy financial system which suffered from high latency during peak market volatility, poor mobile usability, and fragmented analytics.',
        solution: 'Engineered a modern web platform leveraging React, Node.js microservices, WebSockets for live data feeds, and AWS serverless infrastructure for zero-downtime scaling.',
        liveLink: 'https://ctechethics.com',
        githubLink: '#',
        results: [
            { value: '300%', label: 'Speed Improvement' },
            { value: '< 80ms', label: 'Real-time Latency' },
            { value: '99.99%', label: 'Uptime SLA' },
            { value: '$2.5M+', label: 'Daily Volume Handled' },
        ],
        features: [
            { icon: 'bi-speedometer2', title: 'Sub-second Data Feeds', desc: 'WebSocket architecture streaming live stock and crypto updates with zero lag.' },
            { icon: 'bi-shield-lock-fill', title: 'Bank-Grade Security', desc: 'End-to-end encryption, multi-factor authentication, and automated compliance auditing.' },
            { icon: 'bi-pie-chart-fill', title: 'Interactive Analytics', desc: 'Custom canvas-rendered charts with dynamic filtering and risk indicators.' },
            { icon: 'bi-phone-fill', title: 'Responsive Mobile Experience', desc: 'Seamless trading interface optimized across smartphone, tablet, and desktop screens.' },
        ],
        tech: [
            { name: 'React 19', icon: 'fa-react', color: '#61dafb' },
            { name: 'Node.js', icon: 'fa-node-js', color: '#68a063' },
            { name: 'TypeScript', icon: 'fa-code', color: '#3178c6' },
            { name: 'AWS Cloud', icon: 'fa-aws', color: '#ff9900' },
            { name: 'MongoDB', icon: 'fa-database', color: '#47a248' },
            { name: 'Docker', icon: 'fa-docker', color: '#2496ed' },
        ],
        process: [
            { step: '01', title: 'Discovery & Requirements', desc: 'Analyzing trade workflows, user personas, and compliance mandates.' },
            { step: '02', title: 'Architecture & Design', desc: 'Crafting responsive wireframes, design systems, and WebSocket data schemas.' },
            { step: '03', title: 'Agile Development', desc: 'Sprint-based engineering with continuous deployment to staging environments.' },
            { step: '04', title: 'Security & Load Testing', desc: 'Rigorous stress testing simulating 100k concurrent active traders.' },
            { step: '05', title: 'Deployment & Support', desc: 'Zero-downtime production rollout and 24/7 cloud monitoring.' },
        ]
    },
    {
        _id: '2',
        id: 2,
        title: 'HealthCare AI Diagnostic Engine',
        category: 'AI Solutions',
        client: 'MediHealth Diagnostics',
        year: '2024',
        duration: '6 Months',
        image: 'https://picsum.photos/seed/health/1200/700',
        images: [
            'https://picsum.photos/seed/health/1200/700',
            'https://picsum.photos/seed/health2/1200/700',
        ],
        desc: 'An AI-driven diagnostic assistance platform helping radiologists detect anomalies in X-rays and MRI scans with 98% validated accuracy.',
        challenge: 'Radiology departments faced extreme workload backlogs causing delays in patient diagnosis and urgent care decisions.',
        solution: 'Built a deep learning computer vision model integrated with a web dashboard for fast image analysis and automated diagnostic reporting.',
        liveLink: 'https://ctechethics.com',
        results: [
            { value: '98%', label: 'Diagnostic Accuracy' },
            { value: '75%', label: 'Faster Processing' },
            { value: '50k+', label: 'Scans Analyzed' },
            { value: 'HIPAA', label: 'Compliant Security' },
        ],
        features: [
            { icon: 'bi-cpu-fill', title: 'Deep Vision Models', desc: 'Neural network trained on annotated medical imaging datasets.' },
            { icon: 'bi-file-earmark-medical-fill', title: 'Auto-Generated Reports', desc: 'Instant PDF export of diagnostic findings for medical records.' },
            { icon: 'bi-cloud-arrow-up-fill', title: 'PACS Integration', desc: 'Direct DICOM image ingestion from hospital imaging hardware.' },
            { icon: 'bi-people-fill', title: 'Doctor Review Workspace', desc: 'Interactive visual annotation tools for radiologist confirmation.' },
        ],
        tech: [
            { name: 'Python', icon: 'fa-python', color: '#3776ab' },
            { name: 'PyTorch / AI', icon: 'fa-brain', color: '#ee4c2c' },
            { name: 'React', icon: 'fa-react', color: '#61dafb' },
            { name: 'FastAPI', icon: 'fa-code', color: '#059669' },
            { name: 'Docker', icon: 'fa-docker', color: '#2496ed' },
        ],
        process: [
            { step: '01', title: 'Data Cleaning', desc: 'Anonymizing and labeling 100,000 medical scan datasets.' },
            { step: '02', title: 'Model Training', desc: 'Training convolutional neural networks with k-fold cross-validation.' },
            { step: '03', title: 'Portal Integration', desc: 'Building secure web UI for hospital radiologists.' },
            { step: '04', title: 'Clinical Validation', desc: 'Testing model predictions against senior board radiologists.' },
        ]
    },
    {
        _id: '3',
        id: 3,
        title: 'Global E-Commerce Omnichannel Platform',
        category: 'Mobile Apps',
        client: 'LuxeCart Global',
        year: '2023',
        duration: '5 Months',
        image: 'https://picsum.photos/seed/ecommerce/1200/700',
        images: [
            'https://picsum.photos/seed/ecommerce/1200/700',
            'https://picsum.photos/seed/ecommerce2/1200/700',
        ],
        desc: 'A cross-platform mobile shopping app with AR 3D product previews, instant checkout, and multi-currency localized storefronts.',
        challenge: 'Connecting physical store inventories with global digital shoppers while maintaining sub-second mobile page loads.',
        solution: 'Developed a Flutter mobile application backed by a headless GraphQL e-commerce engine and Stripe payments.',
        liveLink: 'https://ctechethics.com',
        results: [
            { value: '+140%', label: 'Mobile Sales' },
            { value: '4.9★', label: 'App Store Rating' },
            { value: '2.1M', label: 'Active App Users' },
            { value: '45%', label: 'Cart Conversion' },
        ],
        features: [
            { icon: 'bi-box-seam-fill', title: 'AR Product Fitting', desc: 'Augmented reality preview allowing customers to try items before buying.' },
            { icon: 'bi-credit-card-fill', title: 'One-Tap Checkout', desc: 'Apple Pay, Google Pay, and localized payment gateway integration.' },
            { icon: 'bi-bell-fill', title: 'Personalized Push Notifications', desc: 'AI-driven product recommendations delivered at optimal times.' },
            { icon: 'bi-globe2', title: 'Multi-Currency & Multi-Language', desc: 'Automatic localization based on customer region and currency.' },
        ],
        tech: [
            { name: 'Flutter', icon: 'fa-mobile', color: '#02569b' },
            { name: 'Node.js', icon: 'fa-node-js', color: '#68a063' },
            { name: 'GraphQL', icon: 'fa-code', color: '#e10098' },
            { name: 'Stripe', icon: 'fa-stripe', color: '#6772e5' },
        ],
        process: [
            { step: '01', title: 'UX Research', desc: 'User testing across iOS and Android shopping habits.' },
            { step: '02', title: 'Mobile Engineering', desc: 'Building high-FPS cross-platform UI components.' },
            { step: '03', title: 'Payment Integration', desc: 'Frictionless checkout flow with multi-currency support.' },
            { step: '04', title: 'Global Launch', desc: 'App Store and Google Play publishing across 30 countries.' },
        ]
    }
];

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const rawData = useSelector((state) => state.PortfolioStateData);
    const PortfolioStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    const [isConsultancyOpen, setIsConsultancyOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    useEffect(() => {
        dispatch(getPortfolio());
    }, [dispatch]);

    /* Find matching project */
    const project = useMemo(() => {
        const allList = PortfolioStateData.length > 0 ? PortfolioStateData : PORTFOLIO_FALLBACKS;
        if (!id) return allList[0];
        const match = allList.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
        return match || allList[0];
    }, [id, PortfolioStateData]);

    // Format list of images
    const projectImages = useMemo(() => {
        if (Array.isArray(project.images) && project.images.length > 0) return project.images;
        if (project.image) return [project.image];
        return ['https://picsum.photos/seed/portfolio/1200/700'];
    }, [project]);

    // Format tech stack
    const techList = useMemo(() => {
        if (Array.isArray(project.tech) && project.tech.length > 0) {
            return project.tech.map((t) => {
                if (typeof t === 'string') return { name: t, icon: 'fa-code', color: 'var(--accent-color, #2563eb)' };
                return { name: t.name || 'Tech', icon: t.icon || 'fa-code', color: t.color || 'var(--accent-color, #2563eb)' };
            });
        }
        return [
            { name: 'React', icon: 'fa-react', color: '#61dafb' },
            { name: 'Node.js', icon: 'fa-node-js', color: '#68a063' },
            { name: 'Cloud Architecture', icon: 'fa-aws', color: '#ff9900' },
        ];
    }, [project.tech]);

    // Results / Metrics
    const resultsList = project.results || [
        { value: '300%', label: 'Performance Boost' },
        { value: '99.9%', label: 'Uptime SLA' },
        { value: '4.9★', label: 'User Satisfaction' },
        { value: '2x', label: 'Efficiency Gain' },
    ];

    // Features list
    const featuresList = project.features || [
        { icon: 'bi-lightning-charge-fill', title: 'High-Speed Performance', desc: 'Engineered with edge caching and dynamic resource optimization for sub-second load times.' },
        { icon: 'bi-shield-check', title: 'Enterprise Security', desc: 'Hardened encryption standards, role-based access control, and vulnerability monitoring.' },
        { icon: 'bi-phone-fill', title: 'Responsive Design', desc: 'Pixel-perfect UI built to deliver a seamless experience across phones, tablets, and desktops.' },
        { icon: 'bi-graph-up-arrow', title: 'Scalable Infrastructure', desc: 'Modular microservice backend designed to scale effortlessly as workload increases.' },
    ];

    // Development Process Steps
    const processSteps = project.process || [
        { step: '01', title: 'Discovery & Planning', desc: 'Defining project goals, user journeys, technical stack, and milestone roadmaps.' },
        { step: '02', title: 'UI/UX Design', desc: 'Creating interactive prototypes, wireframes, and design systems for client review.' },
        { step: '03', title: 'Full-Stack Development', desc: 'Building backend microservices and modern frontend applications in agile sprints.' },
        { step: '04', title: 'Quality Assurance & Security', desc: 'Cross-browser testing, automated unit tests, load testing, and security auditing.' },
        { step: '05', title: 'Launch & Support', desc: 'Deploying with zero downtime, setting up monitoring, and providing post-launch support.' },
    ];

    // Related projects
    const relatedProjects = useMemo(() => {
        const allList = PortfolioStateData.length > 0 ? PortfolioStateData : PORTFOLIO_FALLBACKS;
        return allList.filter((p) => String(p._id) !== String(project._id) && String(p.id) !== String(project.id)).slice(0, 3);
    }, [project, PortfolioStateData]);

    return (
        <div className="portfolio-detail-wrapper">

            {/* 1. HERO BANNER */}
            <HeroSection
                title={project.title || 'Case Study Detail'}
                subtitle={project.desc || 'Explore how CTech Ethic Solution delivered this digital transformation project.'}
                eyebrow={`Case Study · ${project.category || 'Portfolio'}`}
                breadcrumb={['Portfolio', project.title || 'Case Detail']}
                size="md"
            />

            {/* 2. MAIN CONTENT AREA */}
            <section className="py-5">
                <div className="container">
                    
                    {/* Top Meta Bar */}
                    <div className="portfolio-detail-meta-bar mb-5 p-4 rounded-4">
                        <div className="row g-3 text-center text-sm-start align-items-center">
                            <div className="col-6 col-sm-3">
                                <span className="pdm-label d-block text-uppercase fw-bold mb-1">Category</span>
                                <span className="pdm-val fw-semibold">{project.category || 'Engineering'}</span>
                            </div>
                            <div className="col-6 col-sm-3">
                                <span className="pdm-label d-block text-uppercase fw-bold mb-1">Client</span>
                                <span className="pdm-val fw-semibold">{project.client || 'Enterprise Client'}</span>
                            </div>
                            <div className="col-6 col-sm-3">
                                <span className="pdm-label d-block text-uppercase fw-bold mb-1">Year / Timeline</span>
                                <span className="pdm-val fw-semibold">{project.year || '2024'} {project.duration ? `(${project.duration})` : ''}</span>
                            </div>
                            <div className="col-6 col-sm-3 text-sm-end">
                                <a
                                    href={project.liveLink || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-nowrap d-inline-flex align-items-center gap-2"
                                >
                                    <span>Live Preview</span>
                                    <i className="bi bi-box-arrow-up-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Image Showcase Gallery */}
                    <div className="portfolio-detail-gallery mb-5">
                        <div className="pd-main-img-wrap rounded-4 overflow-hidden mb-3">
                            <motion.img
                                key={selectedImgIndex}
                                initial={{ opacity: 0.8, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={projectImages[selectedImgIndex]}
                                alt={project.title}
                                className="w-100 object-fit-cover"
                                style={{ maxHeight: '520px', minHeight: '260px' }}
                            />
                        </div>

                        {/* Thumbnails row if multiple images */}
                        {projectImages.length > 1 && (
                            <div className="d-flex gap-3 overflow-x-auto pb-2">
                                {projectImages.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`pd-thumb-btn border-0 p-0 rounded-3 overflow-hidden ${selectedImgIndex === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedImgIndex(idx)}
                                        style={{ width: '90px', height: '60px', flexShrink: 0, opacity: selectedImgIndex === idx ? 1 : 0.6 }}
                                    >
                                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Overview & Challenge / Solution Grid */}
                    <div className="row g-4 g-lg-5 mb-5">
                        {/* Left Main Overview */}
                        <div className="col-12 col-lg-8">
                            <div className="pd-section-block mb-4">
                                <span className="pd-badge mb-2 d-inline-block">Project Overview</span>
                                <h2 className="pd-heading mb-3">{project.title}</h2>
                                <p className="pd-text lead mb-4">
                                    {project.desc}
                                </p>
                            </div>

                            {/* Challenge & Solution */}
                            <div className="row g-4 mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="pd-box-card h-100 p-4 rounded-4">
                                        <div className="pd-box-icon text-danger mb-3">
                                            <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                                        </div>
                                        <h4 className="pd-box-title mb-2">The Challenge</h4>
                                        <p className="pd-box-desc mb-0">
                                            {project.challenge || 'Navigating complex system scalability requirements, legacy technical debt, and stringent user security compliance without compromising real-time performance.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="pd-box-card h-100 p-4 rounded-4">
                                        <div className="pd-box-icon text-success mb-3">
                                            <i className="bi bi-check-circle-fill fs-3"></i>
                                        </div>
                                        <h4 className="pd-box-title mb-2">The Solution</h4>
                                        <p className="pd-box-desc mb-0">
                                            {project.solution || 'Building a modern full-stack web architecture with decoupled services, automated deployment pipelines, and responsive intuitive UI tailored for optimal user experience.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Features Grid */}
                            <div className="pd-section-block mb-4">
                                <h3 className="pd-heading mb-4">Key Features & Innovations</h3>
                                <div className="row g-3">
                                    {featuresList.map((feat, i) => (
                                        <div key={i} className="col-12 col-sm-6">
                                            <div className="pd-feat-card p-3 rounded-3 h-100 d-flex gap-3">
                                                <div className="pd-feat-icon flex-shrink-0 mt-1">
                                                    <i className={`bi ${feat.icon}`}></i>
                                                </div>
                                                <div>
                                                    <h5 className="pd-feat-title mb-1">{feat.title}</h5>
                                                    <p className="pd-feat-desc mb-0">{feat.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Tech Stack & Results */}
                        <div className="col-12 col-lg-4">
                            
                            {/* Key Results / Metrics Card */}
                            <div className="pd-sidebar-card mb-4 p-4 rounded-4">
                                <h4 className="pd-card-title mb-3">
                                    <i className="bi bi-graph-up-arrow me-2 text-primary"></i> Impact & Results
                                </h4>
                                <div className="row g-3">
                                    {resultsList.map((res, i) => (
                                        <div key={i} className="col-6">
                                            <div className="pd-stat-box p-3 rounded-3 text-center">
                                                <span className="pd-stat-val d-block fw-bold mb-1">{res.value}</span>
                                                <span className="pd-stat-lbl text-muted small">{res.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack Card */}
                            <div className="pd-sidebar-card mb-4 p-4 rounded-4">
                                <h4 className="pd-card-title mb-3">
                                    <i className="bi bi-code-slash me-2 text-primary"></i> Technologies Used
                                </h4>
                                <div className="d-flex flex-wrap gap-2">
                                    {techList.map((t, idx) => (
                                        <div key={idx} className="pd-tech-pill px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2">
                                            <i className={t.icon.includes(' ') ? t.icon : `fa-brands ${t.icon}`} style={{ color: t.color }}></i>
                                            <span className="fw-semibold">{t.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick CTA Box */}
                            <div className="pd-sidebar-cta p-4 rounded-4 text-center">
                                <i className="bi bi-rocket-takeoff-fill fs-1 text-primary mb-3 d-block"></i>
                                <h4 className="pd-cta-heading mb-2">Need a similar solution?</h4>
                                <p className="pd-cta-text small mb-3">
                                    Let our experts design and build a high-performance system customized for your business goals.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill w-100 py-2 fw-bold"
                                    onClick={() => setIsConsultancyOpen(true)}
                                >
                                    Schedule Consultation
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Development Process Steps Roadmap */}
                    <div className="pd-process-section my-5 p-4 p-md-5 rounded-4">
                        <div className="text-center mb-5">
                            <span className="pd-badge mb-2 d-inline-block">Methodology</span>
                            <h3 className="pd-heading">How We Delivered This Project</h3>
                            <p className="pd-text text-muted max-w-600 mx-auto">
                                Our battle-tested agile engineering methodology ensures quality, security, and timely delivery.
                            </p>
                        </div>

                        <div className="row g-3">
                            {processSteps.map((p, i) => (
                                <div key={i} className="col-12 col-md-4 col-lg">
                                    <div className="pd-process-card p-3 rounded-3 h-100">
                                        <span className="pd-process-step d-block fw-bold mb-2">{p.step}</span>
                                        <h5 className="pd-process-title mb-2">{p.title}</h5>
                                        <p className="pd-process-desc mb-0 small">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related Projects Grid */}
                    {relatedProjects.length > 0 && (
                        <div className="pd-related-section my-5">
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <span className="pd-badge mb-1 d-inline-block">More Work</span>
                                    <h3 className="pd-heading mb-0">Explore Other Case Studies</h3>
                                </div>
                                <Link to="/portfolio" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-semibold">
                                    View All Portfolio
                                </Link>
                            </div>

                            <div className="row g-3 g-md-4">
                                {relatedProjects.map((rel) => (
                                    <div key={rel._id || rel.id} className="col-12 col-md-4 d-flex">
                                        <PortfolioCard project={rel} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* CTA SECTION */}
            <section className="container py-4 mb-5">
                <div className="portfolio-cta-card p-5 text-center position-relative">
                    <h2 className="portfolio-cta-title mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                        Have a groundbreaking idea? Let’s build it together.
                    </h2>
                    <p className="portfolio-cta-sub mb-4 mx-auto" style={{ maxWidth: 540 }}>
                        Get in touch with our technical consultants to discuss your architecture, scope, and timeline.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <button
                            type="button"
                            className="btn rounded-pill px-4 py-2.5 fw-bold"
                            onClick={() => setIsConsultancyOpen(true)}
                            style={{ background: 'linear-gradient(135deg, #6ea8ff, #4fd1c5)', border: 'none', color: '#040810' }}
                        >
                            Book Free Consultation
                        </button>
                        <Link
                            to="/contactus"
                            className="btn portfolio-cta-contact-btn rounded-pill px-4 py-2.5"
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* CONSULTANCY MODAL */}
            <ConsultancyModal
                isOpen={isConsultancyOpen}
                onClose={() => setIsConsultancyOpen(false)}
            />
        </div>
    );
}
