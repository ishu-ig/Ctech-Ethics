import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Services from '../Components/Service';
import About from '../Components/About';
import Team from '../Components/Team';
import Blog from '../Components/Blog';
import ContactUs from '../Components/ContactUs';
import TestimonialsSection from '../Components/Testimonial';
import WhyChooseUs from '../Components/WhyChooseUs';
import Achievements from '../Components/Achievements';
import Clients from '../Components/Client';
import PlacementSection from '../Components/Placement';
import ConsultancyModal from '../Components/ConsultancyModal';
import { getBanner } from '../Redux/ActionCreators/BannerActionCreators';

/* Shown only until the first banner GET resolves, or if every banner is
   deleted/deactivated, so the hero never renders blank on load. */
const FALLBACK_SLIDE = {
  badge: '🚀  Trusted by 200+ Clients',
  headline: 'Your Business',
  tagline: 'Supercharged by Technology',
  body: 'We craft fast, secure, and scalable digital solutions that help your brand grow — from MVP to enterprise.',
  accent: '#47b2e4',
  image: 'assets/img/hero-img.png',
};

/* ── Framer Motion Variants ─────────────────────────────────────── */
const slideUp = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

const slideRight = {
  hidden: { x: 40, opacity: 0, scale: 0.96 },
  visible: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -30, opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroWordVariant = {
  hidden: { y: 32, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: -24, opacity: 0, transition: { duration: 0.28 } },
};

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  const [isConsultancyOpen, setIsConsultancyOpen] = useState(false);
  const isFirstRender = useRef(true);

  const dispatch = useDispatch();
  const rawBannerData = useSelector((state) => state.BannerStateData);
  const BannerStateData = Array.isArray(rawBannerData) ? rawBannerData : (rawBannerData?.data || []);

  useEffect(() => {
    dispatch(getBanner());
  }, [dispatch]);

  // Public site only ever shows published banners, same convention as SubServiceController's
  // getRecord (status: true filter) — draft banners stay invisible until published.
  const activeSlides = BannerStateData.filter((b) => b.status);
  const slides = activeSlides.length > 0 ? activeSlides : [FALLBACK_SLIDE];

  // Reset to the first slide whenever the underlying list changes size (e.g. once the
  // real banners load in after the fallback, or an admin adds/removes one), so `idx`
  // never points past the end of a shorter list.
  useEffect(() => {
    setIdx(0);
  }, [slides.length]);

  /* Auto-rotate every 4 seconds */
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[idx];

  return (
    <>
      {/* ════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════ */}
      <section id="hero" className="hero section dark-background" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

        {/* Decorative blobs */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: 480, height: 480, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${slide.accent}22, transparent 70%)`,
          filter: 'blur(60px)', transition: 'background 1s ease',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, #a855f733, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row gy-4 align-items-center" style={{ minHeight: '90vh' }}>

            {/* ── Left: Text Content ── */}
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`text-${idx}`}
                  variants={stagger}
                  initial={isFirstRender.current ? false : "hidden"}
                  animate="visible"
                  exit="exit"
                  onAnimationComplete={() => { isFirstRender.current = false; }}
                >
                  {/* Badge */}
                  <motion.div variants={slideUp} style={{ marginBottom: 20 }}>
                    <span
                      className="hero-chip-badge"
                      style={{
                        display: 'inline-block',
                        padding: '7px 18px',
                        borderRadius: 50,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        background: `${slide.accent}22`,
                        border: `1px solid ${slide.accent}55`,
                        color: slide.accent,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {slide.badge}
                    </span>
                  </motion.div>

                  {/* Static prefix */}
                  <motion.h1 variants={slideUp} className="hero-title-prefix" style={{ marginBottom: 4 }}>
                    Better Solutions For
                  </motion.h1>

                  {/* Animated dynamic headline word */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h1
                      key={`word-${idx}`}
                      variants={heroWordVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="hero-headline-word"
                      style={{ marginBottom: 6, lineHeight: 1.15, display: 'block' }}
                    >
                      <span style={{
                        background: `linear-gradient(135deg, ${slide?.accent || '#47b2e4'} 0%, #a855f7 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline',
                      }}>
                        {slide?.headline || 'Your Business'}
                      </span>
                    </motion.h1>
                  </AnimatePresence>

                  {/* Tagline */}
                  <motion.p variants={slideUp} className="hero-tagline-text" style={{
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: 12,
                    letterSpacing: '0.3px',
                  }}>
                    {slide.tagline}
                  </motion.p>

                  {/* Body text */}
                  <motion.p variants={slideUp} className="hero-body-text" style={{ maxWidth: 480, lineHeight: 1.7 }}>
                    {slide.body}
                  </motion.p>

                  {/* CTAs */}
                  <motion.div variants={slideUp} className="hero-cta-wrap d-flex flex-wrap gap-3" style={{ marginTop: 24 }}>
                    <motion.button
                      type="button"
                      className="btn-get-started"
                      onClick={() => setIsConsultancyOpen(true)}
                      whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${slide.accent}55` }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: `linear-gradient(135deg, ${slide.accent}, #a855f7)`,
                        borderRadius: 50, padding: '12px 30px',
                        fontWeight: 700, letterSpacing: '0.5px',
                        color: '#fff', textDecoration: 'none', border: 'none', cursor: 'pointer',
                      }}
                    >
                      Book Consultancy
                    </motion.button>
                    {/* <motion.a
                      href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                      className="glightbox btn-watch-video d-flex align-items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 50, padding: '12px 22px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <motion.i
                        className="bi bi-play-circle-fill"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        style={{ fontSize: 'var(--fluid-xl)', color: slide.accent }}
                      />
                      <span>Watch Video</span>
                    </motion.a> */}
                  </motion.div>

                  {/* Slide indicators — only shown once there's more than one banner to switch between */}
                  {slides.length > 1 && (
                    <motion.div variants={slideUp} className="hero-indicators d-flex gap-2" style={{ marginTop: 28 }}>
                      {slides.map((s, i) => (
                        <button
                          key={s._id || i}
                          onClick={() => setIdx(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          style={{
                            width: i === idx ? 28 : 8,
                            height: 8,
                            borderRadius: 4,
                            border: 'none',
                            background: i === idx ? slide.accent : 'rgba(255,255,255,0.25)',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            padding: 0,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right: Animated Image ── */}
            <div className="col-lg-6 order-1 order-lg-2 hero-img d-flex align-items-center justify-content-center">
              {/* Glowing ring behind image */}
              <div aria-hidden="true" style={{
                position: 'absolute',
                width: 300, height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${slide.accent}18 0%, transparent 70%)`,
                transition: 'background 0.8s ease',
                filter: 'blur(30px)',
              }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${idx}`}
                  variants={slideRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {/* Subtle floating animation wrapper */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.headline}
                      className="img-fluid"
                      style={{
                        maxHeight: 420,
                        width: '100%',
                        objectFit: 'contain',
                        filter: `drop-shadow(0 20px 60px ${slide.accent}40)`,
                        transition: 'filter 0.8s ease',
                      }}
                    />
                  </motion.div>

                  {/* Floating stat chip — top right */}
                  <motion.div
                    className="hero-floating-chip chip-top-right"
                    initial={{ opacity: 0, scale: 0.7, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    style={{
                      position: 'absolute', top: 20, right: -10,
                      background: 'rgba(10,15,30,0.85)',
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${slide.accent}44`,
                      borderRadius: 16,
                      padding: '12px 18px',
                      textAlign: 'center',
                      boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
                      minWidth: 110,
                    }}
                  >
                    <div style={{ fontSize: 'var(--fluid-3xl)', fontWeight: 800, color: slide.accent, lineHeight: 1 }}>200+</div>
                    <div style={{ fontSize: 'var(--fluid-caption)', color: 'rgba(255,255,255,0.6)', marginTop: 3, letterSpacing: '0.5px' }}>Happy Clients</div>
                  </motion.div>

                  {/* Floating stat chip — bottom left */}
                  <motion.div
                    className="hero-floating-chip chip-bottom-left"
                    initial={{ opacity: 0, scale: 0.7, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.65, type: 'spring', stiffness: 200 }}
                    style={{
                      position: 'absolute', bottom: 20, left: -10,
                      background: 'rgba(10,15,30,0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(168,85,247,0.4)',
                      borderRadius: 16,
                      padding: '12px 18px',
                      textAlign: 'center',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                      minWidth: 110,
                    }}
                  >
                    <div style={{ fontSize: 'var(--fluid-3xl)', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>98%</div>
                    <div style={{ fontSize: 'var(--fluid-caption)', color: 'rgba(255,255,255,0.6)', marginTop: 3, letterSpacing: '0.5px' }}>Satisfaction Rate</div>
                  </motion.div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── Remaining Page Sections ── */}
      <Clients />
      <About />
      <WhyChooseUs />
      <Services />
      <PlacementSection />
      <Achievements />
      <Team />
      <Blog />
      <TestimonialsSection />
      <ContactUs />

      {/* ── CONSULTANCY MODAL ── */}
      <ConsultancyModal
        isOpen={isConsultancyOpen}
        onClose={() => setIsConsultancyOpen(false)}
      />
    </>
  );
}