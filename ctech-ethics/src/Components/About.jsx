import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout } from '../Redux/ActionCreators/AboutActionCreators';

// 1. Clean Default Data
const DEFAULT_FEATURES = [
  { icon: 'bi-cpu-fill', text: 'AI & Data Intelligence' },
  { icon: 'bi-code-square', text: 'Full-Stack Engineering' },
  { icon: 'bi-cloud-check-fill', text: 'Cloud Infrastructure' },
  { icon: 'bi-people-fill', text: 'Vetted Tech Placement' },
];

export default function About({
  companyName: companyNameProp = 'CTech Ethic Solution',
  sectionId = 'about-story',
  eyebrow: eyebrowProp = 'Our Story',
  headingPrefix: headingPrefixProp = 'A technology and talent partner',
  headingHighlight: headingHighlightProp = 'engineered to eliminate friction.',
  subheading: subheadingProp = 'We unite engineering, AI strategy, and certified talent placement under one roof.',
  body: bodyProp = "Over years of hands-on delivery, we realized businesses struggle with fragmented vendors — one firm for mobile apps, another for cloud hosting, and third-party staffing agencies for talent. We unified these layers into a single partner. One team, accountable for your complete digital outcome.",
  features: featuresProp = DEFAULT_FEATURES,
  imageSrc: imageSrcProp = 'https://picsum.photos/seed/corporate-team/800/900',
  badgeCount: badgeCountProp = '200+',
  badgeLabel: badgeLabelProp = 'Clients served globally',
  primaryCta = { label: 'Explore Services', to: '/services' },
  secondaryCta = { label: 'Talk to an Expert', to: '/contactus' },
  showBadge = true,
}) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const dispatch = useDispatch();
  const rawAbout = useSelector((state) => state.AboutStateData);

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  const aboutDoc = (Array.isArray(rawAbout) ? rawAbout[0] : (rawAbout?.data || rawAbout)) || {};
  const companyInfo = aboutDoc?.companyInfo || {};
  const storyline = aboutDoc?.storyline || {};

  const companyName = companyInfo.name || companyNameProp;
  const eyebrow = storyline.eyebrow || eyebrowProp;
  const headingPrefix = storyline.headingPrefix || headingPrefixProp;
  const headingHighlight = storyline.headingHighlight || headingHighlightProp;
  const subheading = storyline.subheading || subheadingProp;
  const body = storyline.body || companyInfo.description || bodyProp;
  const imageSrc = storyline.imageSrc || imageSrcProp;
  const badgeCount = storyline.badgeCount || badgeCountProp;
  const badgeLabel = storyline.badgeLabel || badgeLabelProp;
  const features = aboutDoc?.aboutFeatures?.length ? aboutDoc.aboutFeatures : featuresProp;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id={sectionId} className="py-5 my-md-4" ref={sectionRef}>
      <div className="container">
        <div className="row gy-5 align-items-center">
          {/* Left Column: Visual & Badge */}
          <div className="col-lg-6">
            <div className="position-relative pe-lg-4">
              <motion.div
                className="about-image-wrapper rounded-4 overflow-hidden shadow-lg position-relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={imageSrc}
                  alt={companyName}
                  className="img-fluid w-100 object-fit-cover"
                  style={{ minHeight: '400px', maxHeight: '520px' }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                  }}
                />
              </motion.div>

              {showBadge && (
                <motion.div
                  className="position-absolute bottom-0 end-0 translate-middle-y bg-dark text-white p-3 p-md-4 rounded-4 shadow-lg border border-secondary border-opacity-25 me-3 mb-n3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-1 fw-bold text-primary">{badgeCount}</span>
                    <span className="small text-light text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
                      {badgeLabel}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="col-lg-6">
            <motion.div
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              <motion.span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
                {eyebrow}
              </motion.span>

              <motion.h2 variants={fadeUp} className="display-6 fw-bold mb-3">
                {headingPrefix} <span className="text-primary">{headingHighlight}</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="lead text-muted mb-4">
                {subheading}
              </motion.p>

              <motion.p variants={fadeUp} className="text-secondary mb-4" style={{ lineHeight: '1.8' }}>
                {body}
              </motion.p>

              {/* 2x2 Feature Grid */}
              <motion.div variants={fadeUp} className="row g-4 mb-5">
                {features.map(({ icon, text }) => (
                  <div className="col-sm-6 d-flex align-items-start gap-3" key={text}>
                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                      <i className={`bi ${icon || 'bi-check-circle'} fs-4`}></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1 text-white">{text}</h6>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3 align-items-center">
                {primaryCta && (
                  <Link to={primaryCta.to} className="btn btn-primary btn-lg rounded-pill px-4 fw-semibold">
                    {primaryCta.label}
                  </Link>
                )}
                {secondaryCta && (
                  <Link to={secondaryCta.to} className="btn btn-outline-secondary btn-lg rounded-pill px-4">
                    {secondaryCta.label}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}