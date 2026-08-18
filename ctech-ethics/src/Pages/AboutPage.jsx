import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

// Adjust these import paths to match your project structure
import HeroSection from '../Components/HeroSection'
import WhyChooseUs from '../Components/WhyChooseUs'
import Team from '../Components/Team'
import ConsultancyModal from '../Components/ConsultancyModal'
import About from '../Components/About'
import TechStack from '../Components/TechStack'
import { getAbout } from '../Redux/ActionCreators/AboutActionCreators'
import { getAchievement } from '../Redux/ActionCreators/AchievementActionCreators'

/* ── Design Tokens ─────────────────────────────── */
const FONT_MONO = "'JetBrains Mono', monospace"

/* ── Animation Variants ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

/* ── Micro Components ───────────────────────────── */
function Eyebrow({ children }) {
  return (
    <div className="about-eyebrow">
      <span className="about-eyebrow-dot" />
      <span>{children}</span>
    </div>
  )
}

function SectionHeading({ eyebrow, title, sub, center }) {
  return (
    <div style={{ maxWidth: 680, margin: center ? '0 auto 48px' : '0 0 44px', textAlign: center ? 'center' : 'left' }}>
      <div style={{ display: 'flex', justifyContent: center ? 'center' : 'flex-start' }}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="about-heading-title">
        {title}
      </h2>
      {sub && <p className="about-heading-sub">{sub}</p>}
    </div>
  )
}

/* ── Animated CountUp ───────────────────────────── */
function CountUp({ to, suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / (duration * 1000), 1)
      setVal(Math.floor(progress * to))
      if (progress < 1) requestAnimationFrame(step)
      else setVal(to)
    }
    requestAnimationFrame(step)
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

/* ── Fallback content ───────────────────────────
   Used only while the AboutPage document is loading, or for any section
   the admin hasn't filled in yet — so the page never renders half-empty.
   Once state.AboutStateData resolves, its fields take priority field-by-field. */
const DEFAULT_MISSION = "To empower businesses globally by delivering cutting-edge software solutions and connecting them with certified, top-tier tech talent, driving digital transformation without friction."

const DEFAULT_VISION = "To be the global benchmark for unified technology and talent partnerships, where innovation, integrity, and engineering excellence converge to build the future."

const DEFAULT_VALUES = [
  { icon: 'fa-lightbulb', title: 'Innovation', desc: 'We chase future-ready digital solutions, not just familiar code.' },
  { icon: 'fa-medal', title: 'Quality', desc: 'Every deliverable is held to an international standard of excellence.' },
  { icon: 'fa-eye', title: 'Transparency', desc: 'Clear roadmaps, upfront pricing, and open technical communication.' },
  { icon: 'fa-handshake', title: 'Customer Success', desc: 'Your long-term ROI is the actual metric we track and optimize.' },
  { icon: 'fa-shield-halved', title: 'Integrity', desc: 'Ethical governance and security-first engineering in everything we build.' },
  { icon: 'fa-arrow-trend-up', title: 'Growth', desc: 'Continuous empowerment for our clients, our team, and placed talent.' },
]

const DEFAULT_TIMELINE = [
  { year: '2018', title: 'Founded', desc: 'Started as a boutique development studio crafting custom enterprise software.' },
  { year: '2020', title: 'AI & Data Practice', desc: 'Expanded services into AI-driven automation, data analytics, and cloud infrastructure.' },
  { year: '2022', title: 'Talent Placement Division', desc: 'Launched specialized technical training paired with guaranteed talent placement.' },
  { year: '2024+', title: 'Global Tech Partner', desc: 'Grew into a full-scale partner delivering end-to-end solutions for 200+ clients.' },
]

// No field in AboutPageSchema backs these four counters — they stay
// hardcoded until a schema field exists for them (e.g. an `impact` array).
const DEFAULT_IMPACT = [
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 180, suffix: '+', label: 'Satisfied Clients' },
  { value: 500, suffix: '+', label: 'Engineers Placed' },
  { value: 15, suffix: '+', label: 'Years Combined Expertise' },
]

/* ── Main AboutPage Component ───────────────────── */
export default function AboutPage({
  companyName: companyNameProp = 'CTech Ethic Solution',
  missionText: missionTextProp = DEFAULT_MISSION,
  visionText: visionTextProp = DEFAULT_VISION,
  values: valuesProp = DEFAULT_VALUES,
  timeline: timelineProp = DEFAULT_TIMELINE,
  impact = DEFAULT_IMPACT,
}) {
  const [isConsultancyOpen, setIsConsultancyOpen] = useState(false)

  const dispatch = useDispatch()
  const AchievementStateData = useSelector((state) => state.AchievementStateData) || []
  const rawAbout = useSelector((state) => state.AboutStateData)

  useEffect(() => {
    dispatch(getAbout())
    dispatch(getAchievement())
  }, [dispatch])

  // AboutPageSchema.getSingleton() returns one document, not a list, so this
  // reducer's shape can't be guarded the same way as the array-based CRUD
  // reducers elsewhere in the app (ServiceReducer, etc.) — fall back to {}
  // rather than [] since there's no collection here, just one page config.
  const aboutDoc = (Array.isArray(rawAbout) ? rawAbout[0] : (rawAbout?.data || rawAbout)) || {}
  const companyInfo = aboutDoc?.companyInfo || {}
  const storyline = aboutDoc?.storyline || {}

  const companyName = companyInfo.name || companyNameProp
  const missionText = companyInfo.mission || missionTextProp
  const visionText = companyInfo.vision || visionTextProp
  const values = aboutDoc?.coreValues?.length ? aboutDoc.coreValues : valuesProp
  const timeline = aboutDoc?.timeline?.length ? aboutDoc.timeline : timelineProp
  // Passed through as `undefined` (not []) when empty, so About's own
  // DEFAULT_FEATURES default parameter still applies instead of rendering blank.
  const features = aboutDoc?.aboutFeatures?.length ? aboutDoc.aboutFeatures : undefined

  return (
    <div className="about-page-wrapper">

      {/* ── 1. HERO ── */}
      <HeroSection
        title={`About ${companyName}`}
        subtitle={companyInfo.heroSubtitle || "We integrate enterprise software engineering, AI consultancy, and talent placement under one roof — removing middle layers to accelerate your growth."}
        eyebrow="Who We Are · Our Story"
        breadcrumb="About Us"
        size="md"
      />

      {/* ── 2. WHO WE ARE ── */}
      <About
        sectionId="about-story"
        companyName={companyName}
        eyebrow={storyline.eyebrow}
        headingPrefix={storyline.headingPrefix}
        headingHighlight={storyline.headingHighlight}
        subheading={storyline.subheading}
        body={storyline.body || companyInfo.description}
        imageSrc={storyline.imageSrc}
        badgeCount={storyline.badgeCount}
        badgeLabel={storyline.badgeLabel}
        features={features}
        // primaryCta={{ label: 'See Our Values', to: '#values' }}
        secondaryCta={{ label: 'Talk to our team', to: '/contactus' }}
      />

      {/* ── 3. VISION & MISSION ── */}
      <section className="about-section pt-0">
        <div className="container">
          <SectionHeading eyebrow="Purpose & Ambition" title="Driving the digital future forward" center />
          <motion.div
            className="row g-4 justify-content-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerParent}
          >
            {/* Mission Card */}
            <div className="col-lg-6 col-md-10">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(79, 209, 197, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="about-glass-card p-4 p-lg-5 h-100 text-center text-md-start position-relative overflow-hidden d-flex flex-column"
                style={{ zIndex: 1, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div style={{
                  position: 'absolute', top: '-10%', right: '-10%', width: 250, height: 250,
                  background: 'radial-gradient(circle, rgba(79, 209, 197, 0.12) 0%, transparent 70%)',
                  borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                }} />

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="mx-auto mx-md-0"
                  style={{
                    width: 64, height: 64, borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(79, 209, 197, 0.2), rgba(79, 209, 197, 0.02))',
                    border: '1px solid rgba(79, 209, 197, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24, boxShadow: '0 8px 32px rgba(79, 209, 197, 0.15)'
                  }}
                >
                  <i className="fa-solid fa-bullseye" style={{ color: '#4fd1c5', fontSize: '1.75rem' }} />
                </motion.div>

                <h3 className="mb-3 fw-bold" style={{
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #ffffff 30%, #4fd1c5 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Our Mission
                </h3>
                <p className="mb-0 flex-grow-1" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                  {missionText}
                </p>
              </motion.div>
            </div>

            {/* Vision Card */}
            <div className="col-lg-6 col-md-10">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(110, 168, 255, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="about-glass-card p-4 p-lg-5 h-100 text-center text-md-start position-relative overflow-hidden d-flex flex-column"
                style={{ zIndex: 1, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div style={{
                  position: 'absolute', top: '-10%', right: '-10%', width: 250, height: 250,
                  background: 'radial-gradient(circle, rgba(110, 168, 255, 0.12) 0%, transparent 70%)',
                  borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                }} />

                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="mx-auto mx-md-0"
                  style={{
                    width: 64, height: 64, borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(110, 168, 255, 0.2), rgba(110, 168, 255, 0.02))',
                    border: '1px solid rgba(110, 168, 255, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24, boxShadow: '0 8px 32px rgba(110, 168, 255, 0.15)'
                  }}
                >
                  <i className="fa-solid fa-rocket" style={{ color: '#6ea8ff', fontSize: '1.75rem' }} />
                </motion.div>

                <h3 className="mb-3 fw-bold" style={{
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #ffffff 30%, #6ea8ff 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Our Vision
                </h3>
                <p className="mb-0 flex-grow-1" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                  {visionText}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. CORE VALUES ── */}
      <section className="about-section about-section--alt" id="values">
        <div className="container">
          <SectionHeading eyebrow="Core Principles" title="What guides how we build & serve" center />
          <motion.div
            className="row g-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerParent}
          >
            {values.map((v) => (
              <div key={v.title} className="col-md-4 col-sm-6">
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}
                  className="about-glass-card p-4 text-center h-100"
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(110,168,255,0.12)', border: '1px solid rgba(110,168,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <i className={v.icon?.startsWith('fa') ? v.icon : `fa ${v.icon}`} style={{ color: '#6ea8ff', fontSize: '1.1rem' }} />
                  </div>
                  <h3 className="value-card-title">{v.title}</h3>
                  <p className="value-card-desc">{v.desc}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. WHY CHOOSE US ── */}
      <section className="about-section">
        <WhyChooseUs />
      </section>

      {/* ── 6. JOURNEY TIMELINE ── */}
      <section className="about-section about-section--alt">
        <div className="container">
          <SectionHeading eyebrow="Our Growth Story" title="Key milestones along our journey" center />
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <div className="timeline-line" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ position: 'relative', paddingLeft: 56, marginBottom: 38 }}
              >
                <div className="timeline-node" />
                <div style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: '#6ea8ff', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>
                  {item.year}
                </div>
                <h3 className="value-card-title" style={{ fontSize: '1.12rem', margin: '0 0 6px' }}>
                  {item.title}
                </h3>
                <p className="value-card-desc" style={{ fontSize: '0.92rem' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TEAM ── */}
      <section className="about-section">
        <Team />
      </section>

      {/* ── 8. TECH STACK ──
           TechStack manages its own data from a separate Redux slice
           (TechStackStateData), so nothing from AboutStateData is threaded
           through here. */}
      <TechStack
        eyebrow="Technology Ecosystem"
        title="Frameworks & tools we master"
        sectionClassName="about-section about-section--alt"
        cardClassName="about-glass-card"
      />

      {/* ── 9. IMPACT COUNTERS ──
           No AboutPageSchema field backs these values yet — still prop/default driven. */}
      <section className="about-section">
        <div className="container">
          <div className="about-glass-card p-4 p-md-5">
            <div className="row g-4 text-center">
              {AchievementStateData?.map((item) => (
                <div key={item.label} className="col-6 col-md-3">
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#6ea8ff', lineHeight: 1 }}>
                    <CountUp to={item.count} suffix={item.suffix} />
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginTop: 10 }}>
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. CALL TO ACTION ── */}
      <section className="about-section about-section--alt">
        <div className="container">
          <motion.div
            className="about-cta-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="about-heading-title" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', marginBottom: 12 }}>
              Ready to accelerate your next project or hire top tech talent?
            </h2>
            <p className="about-heading-sub" style={{ maxWidth: 540, margin: '0 auto 28px' }}>
              Schedule a consultation with our technology advisors. We'll analyze your requirements and deliver a clear action plan.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                onClick={() => setIsConsultancyOpen(true)}
                style={{ background: 'linear-gradient(135deg, #6ea8ff, #4fd1c5)', border: 'none', color: '#040810', fontSize: '0.95rem' }}
              >
                Book a Consultation
              </button>
              <Link
                to="/contactus"
                className="btn btn-outline-light rounded-pill px-4 py-2"
                style={{ fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONSULTANCY MODAL ── */}
      <ConsultancyModal
        isOpen={isConsultancyOpen}
        onClose={() => setIsConsultancyOpen(false)}
      />
    </div>
  )
}