import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import ServiceCard from './ServiceCard';
import { getService } from '../Redux/ActionCreators/ServiceActionCreators';
import { getSubService } from '../Redux/ActionCreators/SubServiceActionCreators';

// Shown while the first GET is in-flight or if no services are published yet,
// so the carousel never renders empty.
export const FALLBACK_SERVICES = [
  {
    id: 'tech',
    icon: 'bi-code-slash',
    gradient: 'linear-gradient(135deg, #47b2e4, #2563eb)',
    title: 'Technical Solutions',
    image: 'https://picsum.photos/seed/svc-tech/640/420',
    description: 'Scalable websites, mobile apps, enterprise software, and ERP systems, built and shipped end to end.',
    subServices: [
      { id: 'web', icon: 'bi-window', name: 'Website Development', description: 'Fast, responsive sites built for conversion and easy upkeep.', tags: ['React', 'Next.js', 'Node'] },
      { id: 'mobile', icon: 'bi-phone', name: 'Mobile Apps', description: 'Native-feel iOS and Android apps from a single codebase.', tags: ['React Native', 'Expo'] },
      { id: 'erp', icon: 'bi-diagram-3', name: 'ERP Systems', description: 'Custom internal tools that match how your team actually works.', tags: ['Node', 'PostgreSQL'] },
      { id: 'uiux', icon: 'bi-palette', name: 'UI/UX Design', description: 'Interfaces designed around real user flows, not templates.', tags: ['Figma', 'Design Systems'] },
      { id: 'api', icon: 'bi-plug', name: 'API Integration', description: 'Connect the tools you already use into one working system.', tags: ['REST', 'GraphQL'] },
      { id: 'cloud', icon: 'bi-cloud', name: 'Cloud & Hosting', description: 'Infrastructure that scales with you, not against you.', tags: ['AWS', 'Docker'] },
      { id: 'maint', icon: 'bi-tools', name: 'Maintenance', description: 'Ongoing updates, monitoring, and fixes after launch.', tags: ['SLA', 'Monitoring'] }
    ]
  },
  {
    id: 'marketing',
    icon: 'bi-graph-up-arrow',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    title: 'Digital Marketing',
    image: 'https://picsum.photos/seed/svc-marketing/640/420',
    description: 'Campaigns built on data, not guesswork — so every rupee spent is a rupee you can account for.',
    subServices: [
      { id: 'seo', icon: 'bi-search', name: 'SEO', description: 'Rank higher for the searches that actually convert.', tags: ['Technical SEO', 'Content'] },
      { id: 'gads', icon: 'bi-google', name: 'Google Ads', description: 'Paid search campaigns tuned for cost-per-acquisition.', tags: ['Search', 'Display'] },
      { id: 'metaads', icon: 'bi-facebook', name: 'Meta Ads', description: 'Instagram and Facebook campaigns that target the right audience.', tags: ['Meta', 'Retargeting'] },
      { id: 'content', icon: 'bi-pencil-square', name: 'Content Marketing', description: 'Editorial calendars built around what your audience searches for.', tags: ['Blog', 'SEO'] },
      { id: 'email', icon: 'bi-envelope-paper', name: 'Email Marketing', description: 'Automated flows that turn subscribers into customers.', tags: ['Automation', 'CRM'] },
      { id: 'analytics', icon: 'bi-bar-chart', name: 'Analytics', description: 'Dashboards that show what is actually working.', tags: ['GA4', 'Reporting'] }
    ]
  },
  {
    id: 'social',
    icon: 'bi-phone-vibrate',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    title: 'Social Media Management',
    image: 'https://picsum.photos/seed/svc-social/640/420',
    description: 'Consistent posting, real engagement, and a brand voice people recognize.',
    subServices: [
      { id: 'creation', icon: 'bi-camera', name: 'Content Creation', description: 'Photo and video content shot and edited for each platform.', tags: ['Photo', 'Video'] },
      { id: 'reels', icon: 'bi-play-circle', name: 'Reels & Shorts', description: 'Short-form video built to be watched to the end.', tags: ['Reels', 'TikTok'] },
      { id: 'branding', icon: 'bi-brush', name: 'Branding', description: 'Visual identity that stays consistent across every post.', tags: ['Identity', 'Guidelines'] },
      { id: 'strategy', icon: 'bi-diagram-2', name: 'Social Strategy', description: 'A content calendar tied to real business goals.', tags: ['Planning', 'Calendar'] },
      { id: 'management', icon: 'bi-person-check', name: 'Page Management', description: 'Daily posting and community moderation, handled for you.', tags: ['Scheduling', 'Moderation'] },
      { id: 'engagement', icon: 'bi-chat-dots', name: 'Community Engagement', description: 'Real responses to real comments and DMs, on time.', tags: ['Support', 'DMs'] }
    ]
  },
  {
    id: 'training',
    icon: 'bi-mortarboard',
    gradient: 'linear-gradient(135deg, #22d3ee, #10b981)',
    title: 'IT Training',
    image: 'https://picsum.photos/seed/svc-training/640/420',
    description: 'Hands-on courses that end in a portfolio, not just a certificate.',
    subServices: [
      { id: 'mern', icon: 'bi-stack', name: 'MERN Stack', description: 'Full-stack JavaScript from database to deployed app.', tags: ['MongoDB', 'Express', 'React'] },
      { id: 'react', icon: 'bi-braces', name: 'React', description: 'Component-driven front-end development, taught by building.', tags: ['Hooks', 'Vite'] },
      { id: 'reactnative', icon: 'bi-phone', name: 'React Native', description: 'Ship a real mobile app to the App Store and Play Store.', tags: ['Expo', 'Native'] },
      { id: 'aiml', icon: 'bi-cpu', name: 'AI / ML', description: 'Practical machine learning, from data cleaning to deployed models.', tags: ['Python', 'scikit-learn'] },
      { id: 'python', icon: 'bi-filetype-py', name: 'Python', description: 'Core Python and the libraries used in real production code.', tags: ['Python', 'Automation'] },
      { id: 'java', icon: 'bi-cup-hot', name: 'Java', description: 'Object-oriented fundamentals through to Spring Boot APIs.', tags: ['Java', 'Spring'] },
      { id: 'dsa', icon: 'bi-diagram-3', name: 'DSA', description: 'Interview-ready problem solving, one pattern at a time.', tags: ['Algorithms', 'Interviews'] },
      { id: 'liveprojects', icon: 'bi-kanban', name: 'Live Projects', description: 'Ship real features on a real codebase, not a toy exercise.', tags: ['Portfolio', 'Git'] }
    ]
  },
  {
    id: 'placement',
    icon: 'bi-briefcase',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)',
    title: 'Placement Support',
    image: 'https://picsum.photos/seed/svc-placement/640/420',
    description: 'Resume, interview, and job-search support that ends with an offer.',
    subServices: [
      { id: 'resume', icon: 'bi-file-earmark-text', name: 'Resume Building', description: 'A resume rewritten to survive both ATS filters and human reviewers.', tags: ['ATS', 'Review'] },
      { id: 'mock', icon: 'bi-mic', name: 'Mock Interviews', description: 'Practice interviews with real feedback, not a checklist.', tags: ['Technical', 'HR'] },
      { id: 'linkedin', icon: 'bi-linkedin', name: 'LinkedIn Optimization', description: 'A profile that shows up in recruiter searches.', tags: ['Profile', 'Networking'] },
      { id: 'guidance', icon: 'bi-signpost-split', name: 'Career Guidance', description: 'A clear plan for the role and industry you actually want.', tags: ['Planning', '1:1'] },
      { id: 'internship', icon: 'bi-briefcase', name: 'Internship Assistance', description: 'Help landing internships that convert into full-time offers.', tags: ['Internships', 'Referrals'] }
    ]
  },
  {
    id: 'consulting',
    icon: 'bi-gear',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    title: 'IT Consulting & Support',
    image: 'https://picsum.photos/seed/svc-consulting/640/420',
    description: 'Strategic and technical support to keep your systems running and growing.',
    subServices: [
      { id: 'consulting', icon: 'bi-lightbulb', name: 'IT Consulting', description: 'Technology roadmaps built around your actual business goals.', tags: ['Strategy', 'Audit'] },
      { id: 'maintenance', icon: 'bi-tools', name: 'Maintenance', description: 'Proactive upkeep so small issues never become outages.', tags: ['Uptime', 'Patching'] },
      { id: 'cloud2', icon: 'bi-cloud-check', name: 'Cloud', description: 'Migration and management across major cloud providers.', tags: ['AWS', 'Azure'] },
      { id: 'security', icon: 'bi-shield-check', name: 'Security', description: 'Audits and hardening to keep your systems and data safe.', tags: ['Audits', 'Compliance'] },
      { id: 'support', icon: 'bi-headset', name: 'Technical Support', description: 'Responsive support when something actually breaks.', tags: ['SLA', 'Helpdesk'] },
      { id: 'performance', icon: 'bi-speedometer2', name: 'Performance Optimization', description: 'Faster load times and lower infrastructure costs.', tags: ['Speed', 'Cost'] }
    ]
  }
];

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const navBtnVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }
  })
};

// Extracted so ServicePage's grid can reuse the same modal without a new file.
export function ServiceModal({ selectedModal, setSelectedModal }) {
  return (
    <AnimatePresence>
      {selectedModal && typeof document !== 'undefined' && createPortal(
        <motion.div
          className="subservice-modal-overlay"
          onClick={() => setSelectedModal(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="subservice-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <div className="subservice-modal-accent-bar" />

            <motion.button
              type="button"
              className="subservice-modal-close"
              onClick={() => setSelectedModal(null)}
              aria-label="Close modal"
              whileHover={{ rotate: 90, scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="bi bi-x-lg"></i>
            </motion.button>

            <div className="subservice-modal-header d-flex align-items-center gap-3">
              <motion.div
                className="subservice-modal-icon"
                style={{ background: selectedModal.gradient || 'linear-gradient(135deg, var(--accent-color), #a855f7)' }}
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <i className={`bi ${selectedModal.icon}`}></i>
              </motion.div>
              <div className="flex-1 overflow-hidden">
                <span className="subservice-modal-subtitle d-inline-flex align-items-center gap-1">
                  <i className="bi bi-stars"></i>
                  {selectedModal.subServices ? 'Core Service Solution' : 'Sub-Service Solution'}
                </span>
                <h3 className="subservice-modal-title m-0 mt-1 text-truncate">{selectedModal.name || selectedModal.title}</h3>
              </div>
            </div>

            <div className="subservice-modal-body mt-3">
              <p className="subservice-modal-desc">{selectedModal.description}</p>

              {selectedModal.subServices ? (
                <div className="subservice-modal-section mt-4">
                  <h6 className="subservice-modal-section-title">
                    <i className="bi bi-grid-fill me-1"></i>Included Sub-Services & Capabilities
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {selectedModal.subServices.map((sub) => (
                      <motion.span
                        key={sub.id}
                        className="subservice-modal-tag"
                        whileHover={{ scale: 1.08, y: -2 }}
                        onClick={() => setSelectedModal(sub)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`bi ${sub.icon} me-1`}></i>{sub.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ) : selectedModal.tags && (
                <div className="subservice-modal-section mt-4">
                  <h6 className="subservice-modal-section-title">
                    <i className="bi bi-cpu-fill me-1"></i>Technologies & Standards
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {selectedModal.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="subservice-modal-tag"
                        whileHover={{ scale: 1.08, y: -2 }}
                      >
                        <i className="bi bi-check-circle-fill me-1"></i>{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="subservice-modal-footer d-flex align-items-center justify-content-end gap-2 mt-4 pt-3">
              <motion.button
                type="button"
                className="subservice-btn-secondary"
                onClick={() => setSelectedModal(null)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Close
              </motion.button>
              <Link
                to="/contactus"
                className="subservice-btn-primary"
                onClick={() => { setSelectedModal(null); window.scrollTo(0, 0); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Inquire About {selectedModal.name || selectedModal.title}</span>
                <motion.i
                  className="bi bi-arrow-right"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </AnimatePresence>
  );
}

export default function Service() {
  const [selectedModal, setSelectedModal] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const dispatch = useDispatch();
  const rawServices = useSelector((state) => state.ServiceStateData);
  const rawSubServices = useSelector((state) => state.SubServiceStateData);

  useEffect(() => {
    dispatch(getService());
    dispatch(getSubService());
  }, [dispatch]);

  // Normalise both slices — reducers already unwrap .data so these should
  // already be plain arrays, but guard defensively.
  const serviceList = Array.isArray(rawServices) ? rawServices : (rawServices?.data || []);
  const subServiceList = Array.isArray(rawSubServices) ? rawSubServices : (rawSubServices?.data || []);

  // Merge: attach matching sub-services onto each parent, then filter published.
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
    });

  // Use live DB data when available, otherwise show hardcoded fallback.
  const services = activeServices.length > 0 ? activeServices : FALLBACK_SERVICES;

  return (
    <section id="services" className="services-premium section">
      

      <div className="container sp-header" ref={headerRef}>
        <motion.div
          className="sp-header-text"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
        >
          <motion.span
            className="sp-eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            What we do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Our <span className="sp-gradient-text">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything we offer, from building your product to filling your team&apos;s next seat
          </motion.p>
        </motion.div>

        <div className="sp-carousel-nav">
          {[0, 1].map((i) => (
            <motion.button
              key={i}
              ref={i === 0 ? prevRef : nextRef}
              aria-label={i === 0 ? 'Previous services' : 'Next services'}
              custom={i}
              variants={navBtnVariants}
              initial="hidden"
              animate={headerInView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className={`bi bi-arrow-${i === 0 ? 'left' : 'right'}`} />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="container">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={28}
          rewind={true}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, el: '.sp-pagination' }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 25 }
          }}
          className="sp-main-carousel"
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.id}>
              <ServiceCard
                service={service}
                index={index}
                onSelectModal={(item) => setSelectedModal(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination sp-pagination" />
      </div>

      <ServiceModal selectedModal={selectedModal} setSelectedModal={setSelectedModal} />
    </section>
  );
}