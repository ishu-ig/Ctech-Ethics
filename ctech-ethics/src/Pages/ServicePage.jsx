import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import HeroSection from '../Components/HeroSection'
import WhyChooseUs from '../Components/WhyChooseUs'
import ConsultancyModal from '../Components/ConsultancyModal'
import ServiceCard from '../Components/ServiceCard'
import { FALLBACK_SERVICES, ServiceModal } from '../Components/Service'
import TechStack from '../Components/TechStack'
import { getService } from '../Redux/ActionCreators/ServiceActionCreators'
import { getSubService } from '../Redux/ActionCreators/SubServiceActionCreators'

/* ── Typography & Tokens ─────────────────────────────────────── */
const FONT_MONO = "'JetBrains Mono', monospace"
const FONT_HEAD = "'Space Grotesk', sans-serif"

/* ── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const fadeUpSoft = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const staggerParentTight = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
}

/* ── Eyebrow Tag ─────────────────────────────────────────────── */
function Eyebrow({ children }) {
    return (
        <motion.div
            className="svc-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <span className="svc-eyebrow-dot" />
            <span>{children}</span>
        </motion.div>
    )
}

/* ── Development Process Timeline Steps ──────────────────────── */
const PROCESS_STEPS = [
    { step: '01', title: 'Discovery', desc: 'Understanding your business goals, target audience, and project scope.' },
    { step: '02', title: 'Planning', desc: 'Defining wireframes, architecture, technology stack, and milestones.' },
    { step: '03', title: 'Design', desc: 'Crafting modern, intuitive UI/UX prototypes for client validation.' },
    { step: '04', title: 'Development', desc: 'Building secure, clean, and scalable code with agile sprints.' },
    { step: '05', title: 'Testing', desc: 'Conducting QA, security audits, and cross-device speed optimizations.' },
    { step: '06', title: 'Deployment', desc: 'Launching smoothly onto production cloud servers with zero downtime.' },
    { step: '07', title: 'Support', desc: 'Providing 24/7 technical monitoring, updates, and continuous growth.' },
]

/* ── Tech Logos Dataset ─────────────────────────────────────── */
const TECH_STACK = [
    { name: 'React', icon: 'fa-react', color: '#61dafb' },
    { name: 'Next.js', icon: 'fa-node-js', color: '#000000' },
    { name: 'Node.js', icon: 'fa-node-js', color: '#68a063' },
    { name: 'Express.js', icon: 'fa-server', color: '#828282' },
    { name: 'MongoDB', icon: 'fa-database', color: '#47a248' },
    { name: 'MySQL', icon: 'fa-database', color: '#00758f' },
    { name: 'React Native', icon: 'fa-mobile', color: '#61dafb' },
    { name: 'Flutter', icon: 'fa-mobile-screen', color: '#02569b' },
    { name: 'Python', icon: 'fa-python', color: '#3776ab' },
    { name: 'Firebase', icon: 'fa-fire', color: '#ffca28' },
    { name: 'AWS', icon: 'fa-aws', color: '#ff9900' },
    { name: 'Docker', icon: 'fa-docker', color: '#2496ed' },
    { name: 'GitHub', icon: 'fa-github', color: '#ffffff' },
    { name: 'OpenAI', icon: 'fa-brain', color: '#10a37f' },
    { name: 'Figma', icon: 'fa-figma', color: '#f24e1e' },
]

/* ── Industries We Serve Dataset ────────────────────────────── */
const INDUSTRIES = [
    { icon: 'fa-user-nurse', title: 'Healthcare', desc: 'Patient portals, telemedicine apps, & EHR integrations.' },
    { icon: 'fa-graduation-cap', title: 'Education', desc: 'LMS platforms, virtual classrooms, & student portals.' },
    { icon: 'fa-cart-shopping', title: 'E-Commerce', desc: 'High-speed storefronts & inventory automation.' },
    { icon: 'fa-building', title: 'Real Estate', desc: 'Property listing portals, CRM, & virtual tours.' },
    { icon: 'fa-utensils', title: 'Restaurants', desc: 'Online ordering systems, POS, & delivery apps.' },
    { icon: 'fa-industry', title: 'Manufacturing', desc: 'ERP tools, supply chain tracking, & IoT dashboards.' },
    { icon: 'fa-landmark', title: 'Finance', desc: 'Secure fintech portals, payment gateways, & analytics.' },
    { icon: 'fa-rocket', title: 'Startups', desc: 'Rapid MVP development & scalable tech foundations.' },
    { icon: 'fa-truck-fast', title: 'Logistics', desc: 'Fleet tracking, route optimization, & dispatch portals.' },
    { icon: 'fa-briefcase', title: 'Corporate', desc: 'Enterprise portals, intranets, & digital workflows.' },
]

/* ── FAQ Dataset ────────────────────────────────────────────── */
const FAQS = [
    {
        q: 'What types of services does CTech Ethic Solution offer?',
        a: 'We provide end-to-end technology solutions (web, mobile, custom software, AI, e-commerce), digital marketing campaigns (SEO, Google Ads, Meta Ads), IT/business consultancy, and technical training with placement services.',
    },
    {
        q: 'How long does a typical software or website project take?',
        a: 'Simple marketing websites take 1 to 2 weeks. Custom web platforms or mobile apps typically take 4 to 8 weeks depending on features, third-party integrations, and testing requirements.',
    },
    {
        q: 'Do you offer post-launch maintenance and technical support?',
        a: 'Yes! We offer 24/7 uptime monitoring, security updates, regular backups, and dedicated SLA support packages to ensure your platform runs smoothly after launch.',
    },
    {
        q: 'How does your Placement and Recruitment service work?',
        a: 'We train and verify tech talent in modern full-stack engineering, AI, and digital marketing. We match pre-screened, job-ready candidates with hiring partners for direct or contractual placement.',
    },
    {
        q: 'What is your pricing model?',
        a: 'We offer transparent, fixed-price project quotes as well as monthly dedicated team retainer models tailored to your business budget and timeline.',
    },
]

/* ── Main ServicePage Component ──────────────────────────────── */
export default function ServicePage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [isConsultancyOpen, setIsConsultancyOpen] = useState(false)
    const [selectedModal, setSelectedModal] = useState(null)

    const dispatch = useDispatch()
    const rawServices = useSelector((state) => state.ServiceStateData)
    const rawSubServices = useSelector((state) => state.SubServiceStateData)

    useEffect(() => {
        dispatch(getService())
        dispatch(getSubService())
    }, [dispatch])

    const serviceList = Array.isArray(rawServices) ? rawServices : (rawServices?.data || [])
    const subServiceList = Array.isArray(rawSubServices) ? rawSubServices : (rawSubServices?.data || [])

    const activeServices = serviceList
        .filter((s) => s.status !== false)
        .map((s) => {
            const matchedSubs = subServiceList
                .filter((sub) => {
                    if (sub.status === false) return false;
                    const parentId = typeof sub.serviceId === 'object' ? sub.serviceId?._id : sub.serviceId;
                    return String(parentId) === String(s._id);
                })
                .map((sub) => ({
                    ...sub,
                    id: sub._id,
                    name: sub.name,
                    icon: sub.icon,
                    description: sub.description,
                    tags: sub.tags || [],
                }));

            const fallbackMatch = FALLBACK_SERVICES.find(
                (f) => f.title?.toLowerCase() === s.title?.toLowerCase() || f.id === s.slug
            );
            const subServices = matchedSubs.length > 0 ? matchedSubs : (fallbackMatch?.subServices || []);

            return {
                ...s,
                id: s.slug || s._id,
                subServices,
            };
        })

    const services = activeServices.length > 0 ? activeServices : FALLBACK_SERVICES

    const toggleFaq = (idx) => {
        setOpenFaq(openFaq === idx ? null : idx)
    }

    return (
        <div className="services-page-wrapper">

            {/* 1. HERO SECTION */}
            <HeroSection
                title="Our Services"
                subtitle="End-to-end technology solutions, digital marketing, AI innovation, IT consultancy, and placement services engineered for scale."
                eyebrow="What We Offer · Solutions Portfolio"
                breadcrumb="Services"
                size="md"
            />

            {/* 2. SERVICES GRID (Replaces the <Service /> carousel) */}
            <section className="services-premium py-5" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div className="container-xxl">
                    <div className="text-center mb-5">
                        <Eyebrow>What We Do</Eyebrow>
                        <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', color: 'var(--heading-color)', marginBottom: 10 }}>
                            Our Services
                        </h2>
                        <p style={{ color: 'var(--text-muted, rgba(220,230,250,0.65))', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
                            Everything we offer, from building your product to filling your team's next seat.
                        </p>
                    </div>

                    <div className="row g-2 g-sm-3 g-md-4 justify-content-center">
                        {services.map((service, index) => (
                            <div key={service.id} className="col-6 col-md-4 d-flex align-items-stretch">
                                {/* Wrap in w-100 so the card stretches to fill the Bootstrap column height */}
                                <div className="w-100">
                                    <ServiceCard
                                        service={service}
                                        index={index}
                                        onSelectModal={(item) => setSelectedModal(item)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shared Service Modal (Driven by selectedModal state) */}
                    <ServiceModal selectedModal={selectedModal} setSelectedModal={setSelectedModal} />
                </div>
            </section>

            {/* 3. WHY CHOOSE US */}
            <section className="py-4">
                <WhyChooseUs />
            </section>

            {/* 4. DEVELOPMENT PROCESS TIMELINE */}
            <section className="container-xxl p-5">
                <div className="text-center mb-5">
                    <Eyebrow>Proven Execution</Eyebrow>
                    <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', marginBottom: 10 }}>
                        Our 7-Step Development Process
                    </h2>
                    <p style={{ color: 'var(--text-muted, rgba(220,230,250,0.65))', fontSize: '1rem', maxWidth: 540, margin: '0 auto' }}>
                        From initial discovery to continuous post-launch support, we deliver transparent execution at every step.
                    </p>
                </div>

                <motion.div
                    className="row g-3 justify-content-center"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={staggerParent}
                >
                    {PROCESS_STEPS.map((p) => (
                        <div key={p.step} className="col-lg-3 col-md-4 col-sm-6">
                            <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="svc-glass-card p-4 h-100">
                                <span className="process-step-num">Step {p.step}</span>
                                <h3 className="svc-title" style={{ fontSize: '1.05rem', margin: '0 0 6px' }}>{p.title}</h3>
                                <p className="svc-desc" style={{ fontSize: '0.84rem', margin: 0 }}>{p.desc}</p>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* 5. TECHNOLOGIES WE USE */}
            <TechStack
                eyebrow="Tech Stack"
                title="Modern Frameworks & Technologies"
                sectionClassName="container-xxl p-5"
                cardClassName="svc-glass-card"
            />

            {/* 6. INDUSTRIES WE SERVE */}
            <section className="container-xxl p-5">
                <div className="text-center mb-5">
                    <Eyebrow>Industry Expertise</Eyebrow>
                    <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', marginBottom: 10 }}>
                        Industries We Empower
                    </h2>
                    <p style={{ color: 'var(--text-muted, rgba(220,230,250,0.65))', fontSize: '1rem', maxWidth: 540, margin: '0 auto' }}>
                        Customized digital solutions engineered for specialized domain requirements.
                    </p>
                </div>

                <motion.div
                    className="row g-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={staggerParent}
                >
                    {INDUSTRIES.map((ind) => (
                        <div key={ind.title} className="col-md-4 col-sm-6">
                            <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="svc-glass-card p-4 h-100 d-flex align-items-start gap-3">
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(110,168,255,0.12)', border: '1px solid rgba(110,168,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className={`fa ${ind.icon}`} style={{ color: '#6ea8ff', fontSize: '1.05rem' }} />
                                </div>
                                <div>
                                    <h3 className="svc-title" style={{ fontSize: '1.02rem', margin: '0 0 4px' }}>{ind.title}</h3>
                                    <p className="svc-desc" style={{ fontSize: '0.84rem', margin: 0 }}>{ind.desc}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* 7. FAQ SECTION */}
            <section className="container-xxl p-5" style={{ maxWidth: 840 }}>
                <div className="text-center mb-4">
                    <Eyebrow>Got Questions?</Eyebrow>
                    <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)' }}>
                        Frequently Asked Questions
                    </h2>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={staggerParentTight}
                >
                    {FAQS.map((faq, idx) => (
                        <motion.div key={idx} variants={fadeUpSoft} className={`faq-item ${openFaq === idx ? 'is-open' : ''}`}>
                            <div className="faq-header" onClick={() => toggleFaq(idx)}>
                                <span>{faq.q}</span>
                                <motion.span
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ color: '#6ea8ff' }}
                                >
                                    <i className="fa fa-chevron-down" />
                                </motion.span>
                            </div>
                            <AnimatePresence>
                                {openFaq === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.28 }}
                                    >
                                        <div className="faq-content">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* 8. FINAL CTA BANNER */}
            <section className="container-xxl py-5 mb-4">
                <motion.div
                    className="svc-glass-card p-5 text-center position-relative"
                    style={{ background: 'linear-gradient(135deg, rgba(110,168,255,0.15), rgba(79,209,197,0.12))', border: '1px solid rgba(110,168,255,0.28)', borderRadius: 20 }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55 }}
                >
                    <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: 12 }}>
                        Let's Build Something Amazing Together
                    </h2>
                    <p style={{ color: 'var(--text-muted, rgba(220,230,250,0.65))', fontSize: '1rem', maxWidth: 540, margin: '0 auto 28px' }}>
                        Ready to launch your web app, optimize marketing ROI, or hire pre-vetted tech talent? Book a consultation today.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <motion.button
                            type="button"
                            className="btn rounded-pill px-4 py-2 fw-bold"
                            onClick={() => setIsConsultancyOpen(true)}
                            whileHover={{ scale: 1.045, boxShadow: '0 10px 28px -6px rgba(79,209,197,0.55)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{ background: 'linear-gradient(135deg, #6ea8ff, #4fd1c5)', border: 'none', color: '#040810', fontSize: '0.95rem' }}
                        >
                            Book Consultation
                        </motion.button>
                        <Link
                            to="/contactus"
                            className="btn btn-outline-light rounded-pill px-4 py-2"
                            style={{ fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Get a Free Quote
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
    )
}