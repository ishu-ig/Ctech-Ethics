import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getService } from '../Redux/ActionCreators/ServiceActionCreators';
import { getSubService } from '../Redux/ActionCreators/SubServiceActionCreators';

/* ════════════════════════════════════════════════════════════
   FALLBACK DATA — shown when no matching service is in Redux
   (e.g. page visited directly before data loads, or no slug match)
   ════════════════════════════════════════════════════════════ */
const defaultService = {
  title: 'Web Development',
  tagline:
    'Scalable, secure, and blazing-fast web platforms — engineered to grow with your business, not against it.',
  breadcrumb: ['Home', 'Services', 'Web Development'],

  overview: {
    heading: 'Websites and platforms built to actually perform',
    paragraphs: [
      'A slow or fragile website quietly costs you customers, credibility, and search ranking. We build web platforms — from marketing sites to complex internal tools — on modern, maintainable stacks that stay fast as they scale.',
      "We don't just hand you a repo and walk away. Every engagement includes documentation, a handover session, and a support window so your team is never stuck.",
    ],
    stats: [
      { value: '120+', label: 'Sites shipped' },
      { value: '98%', label: 'Client satisfaction' },
      { value: '<1.5s', label: 'Avg. load time' },
    ],
  },

  features: [
    { icon: 'bi-lightning-charge', title: 'Performance First', desc: 'Core Web Vitals, image optimization, and edge caching built in from day one — not bolted on later.' },
    { icon: 'bi-shield-check', title: 'Secure by Default', desc: 'Hardened auth, dependency scanning, and OWASP-aligned practices across every build.' },
    { icon: 'bi-phone', title: 'Fully Responsive', desc: 'Pixel-tested across phones, tablets, and desktops — no breakpoints left to chance.' },
    { icon: 'bi-search', title: 'SEO-Ready Architecture', desc: 'Semantic markup, sitemaps, and structured data configured before launch, not after.' },
    { icon: 'bi-gear', title: 'CMS & API Integrations', desc: 'Headless CMS, payment gateways, and third-party APIs wired up cleanly and documented.' },
    { icon: 'bi-graph-up-arrow', title: 'Built to Scale', desc: 'Component-driven front ends and modular back ends that handle growth without a rewrite.' },
  ],

  process: [
    { title: 'Discovery', desc: 'Goals, users, and constraints mapped before a single line of code.' },
    { title: 'Planning', desc: 'Scope, timeline, and architecture locked in and shared with your team.' },
    { title: 'Design', desc: 'Wireframes to high-fidelity UI, reviewed with you at every stage.' },
    { title: 'Development', desc: 'Sprints with staging links so you can watch progress in real time.' },
    { title: 'Testing', desc: 'Cross-browser, device, and performance QA before anything ships.' },
    { title: 'Deployment', desc: 'Zero-downtime release with monitoring switched on from minute one.' },
    { title: 'Support', desc: 'A defined support window plus optional ongoing maintenance retainer.' },
  ],

  technologies: [
    { name: 'React', icon: 'bi-code-slash' },
    { name: 'Next.js', icon: 'bi-triangle' },
    { name: 'Node.js', icon: 'bi-hexagon' },
    { name: 'TypeScript', icon: 'bi-braces' },
    { name: 'PostgreSQL', icon: 'bi-database' },
    { name: 'Tailwind CSS', icon: 'bi-palette' },
    { name: 'AWS', icon: 'bi-cloud' },
    { name: 'Docker', icon: 'bi-box-seam' },
  ],

  benefits: [
    'Faster page loads that reduce bounce and improve conversion',
    'Codebase your future team can actually read and extend',
    'Clear staging environments — see the work before it ships',
    'Documentation and handover, not just a delivered link',
    'A support window after launch, not radio silence',
    'Analytics and monitoring wired in from day one',
  ],

  caseStudies: [
    { image: 'assets/img/portfolio/portfolio-1.webp', tag: 'E-Commerce', title: 'Retail platform rebuild cut checkout time by 42%', result: '+42% conversion' },
    { image: 'assets/img/portfolio/portfolio-2.webp', tag: 'FinTech', title: 'Dashboard migration to Next.js improved TTFB by 3x', result: '3x faster TTFB' },
    { image: 'assets/img/portfolio/portfolio-3.webp', tag: 'Healthcare', title: 'Patient portal redesign lifted task completion to 96%', result: '96% task success' },
  ],

  pricing: [
    { name: 'Starter', price: '$1,499', period: 'one-time', desc: 'Marketing sites and landing pages that need to launch fast.', features: ['Up to 5 pages', 'Responsive design', 'Basic SEO setup', '2 weeks support'], featured: false },
    { name: 'Growth', price: '$4,999', period: 'one-time', desc: 'Full web platforms with CMS, integrations, and custom UI.', features: ['Up to 15 pages', 'Headless CMS', 'API integrations', '30 days support', 'Analytics setup'], featured: true },
    { name: 'Enterprise', price: 'Custom', period: 'quoted', desc: 'Complex platforms, multi-team builds, and ongoing partnership.', features: ['Unlimited pages', 'Custom architecture', 'Dedicated engineer', 'SLA-backed support'], featured: false },
  ],

  faqs: [
    { q: 'How long does a typical web development project take?', a: 'Marketing sites usually take 3–5 weeks. Full platforms with integrations run 8–14 weeks depending on scope, which we lock in during the Planning stage.' },
    { q: 'Do you work with our existing design team, or provide design too?', a: "Both — we can design from scratch, or build directly from your Figma files. Either way, we review UI with you before development starts." },
    { q: 'What happens after launch?', a: "Every plan includes a fixed support window for bug fixes. After that, you can move to a monthly maintenance retainer or take the codebase in-house — it's yours either way." },
    { q: 'Can you migrate our existing site instead of rebuilding from scratch?', a: 'Yes. We audit the current stack first and recommend migration vs. rebuild based on what actually saves you time and cost.' },
  ],

  related: [
    { icon: 'bi-phone-flip', title: 'Mobile App Development', desc: 'Native and cross-platform apps for iOS and Android.', slug: 'mobile-app-development' },
    { icon: 'bi-search-heart', title: 'SEO & Digital Marketing', desc: 'Rank higher and turn traffic into pipeline.', slug: 'seo-digital-marketing' },
    { icon: 'bi-cloud-arrow-up', title: 'Cloud & DevOps', desc: 'Infrastructure that scales without the 2 a.m. pages.', slug: 'cloud-devops' },
  ],

  testimonials: [
    { name: 'Ritika Sharma', role: 'Founder, Loomly Retail', quote: 'CTech rebuilt our storefront in six weeks and checkout conversion jumped immediately. Communication was clear the entire way through.', rating: 5 },
    { name: 'David Kim', role: 'CTO, Fintrace', quote: "The handover documentation alone saved our internal team weeks. It's rare to get code this clean from an agency.", rating: 5 },
    { name: 'Amara Obi', role: 'Product Lead, Wellframe Health', quote: 'They caught accessibility issues our previous vendor missed entirely. Genuinely felt like an extension of our team.', rating: 5 },
  ],
};

const STEP_ICONS = ['bi-search', 'bi-clipboard-check', 'bi-palette', 'bi-code-slash', 'bi-bug', 'bi-rocket-takeoff', 'bi-life-preserver'];

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */
export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const processRef = useRef(null);
  const processInView = useInView(processRef, { once: true, margin: '-100px' });
  const openModal = () => setConsultationOpen(true);

  const dispatch = useDispatch();
  const rawServices = useSelector((state) => state.ServiceStateData);
  const rawSubServices = useSelector((state) => state.SubServiceStateData);

  useEffect(() => {
    dispatch(getService());
    dispatch(getSubService());
  }, [dispatch]);

  const serviceList = Array.isArray(rawServices) ? rawServices : (rawServices?.data || []);
  const subServiceList = Array.isArray(rawSubServices) ? rawSubServices : (rawSubServices?.data || []);

  // Find the matching service by slug (URL param) or fall back to the first published one
  const matchedRaw = slug
    ? serviceList.find((s) => s.slug === slug)
    : serviceList.find((s) => s.status !== false);

  // Map DB shape → page shape and merge sub-services
  const service = matchedRaw
    ? {
        ...defaultService,              // base defaults for fields not yet in DB (pricing, caseStudies, etc.)
        title: matchedRaw.title,
        tagline: matchedRaw.tagline || defaultService.tagline,
        breadcrumb: ['Home', 'Services', matchedRaw.title],
        overview: matchedRaw.overview?.heading
          ? matchedRaw.overview
          : defaultService.overview,
        features: matchedRaw.features?.length
          ? matchedRaw.features
          : defaultService.features,
        // Sub-services from DB mapped to the `related`-style shape for the detail page
        related: subServiceList
          .filter((sub) => {
            if (sub.status === false) return false;
            const parentId = typeof sub.serviceId === 'object' ? sub.serviceId?._id : sub.serviceId;
            return String(parentId) === String(matchedRaw._id);
          })
          .map((sub) => ({
            icon: sub.icon,
            title: sub.name,
            desc: sub.description,
            slug: sub._id,
          })),
      }
    : defaultService;

  return (
    <div className="service-details-page">

      {/* ══════════════ HERO ══════════════ */}
      <section className="flex-hero-section svcd-hero">
        <div className="flex-hero-overlay" />
        <div className="flex-hero-ambient" />
        <div className="flex-hero-container">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="flex-hero-eyebrow">
              <span className="flex-hero-dot" />
              <span className="flex-hero-eyebrow-text">Our Services</span>
            </span>
          </motion.div>

          <h1 className="flex-hero-title">{service.title}</h1>
          <div className="flex-hero-accent-line" />
          <p className="flex-hero-subtitle">{service.tagline}</p>

          <div className="flex-hero-cta">
            <button className="flex-hero-btn-primary" onClick={openModal}>
              Book Consultation <i className="bi bi-arrow-right"></i>
            </button>
            <Link to="/contact" className="flex-hero-btn-secondary">
              Get a Free Quote <i className="bi bi-send"></i>
            </Link>
          </div>

          {service.breadcrumb?.length > 0 && (
            <nav className="flex-hero-breadcrumb" aria-label="Breadcrumb">
              <ol>
                {service.breadcrumb.map((crumb, idx) => {
                  const isLast = idx === service.breadcrumb.length - 1;
                  return (
                    <li key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isLast ? (
                        <span className="flex-hero-bc-active">{crumb}</span>
                      ) : (
                        <Link to={idx === 0 ? '/' : '/services'}>{crumb}</Link>
                      )}
                      {!isLast && <span className="flex-hero-bc-sep">/</span>}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </div>
        <div className="flex-hero-bottom-border" />
      </section>

      {/* ══════════════ OVERVIEW ══════════════ */}
      {service.overview && (
        <section className="section svcd-overview">
          <div className="svcd-overview-grid">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55 }}
              className="svcd-overview-text"
            >
              <span className="eyebrow"><span className="eyebrow-dot" /> Overview</span>
              <h2>{service.overview.heading}</h2>
              {service.overview.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="glass-card svcd-overview-panel"
            >
              <div className="icon-badge"><i className="bi bi-bar-chart-line"></i></div>
              <h4>Why it matters</h4>
              <p>Businesses that invest in a fast, well-built web presence consistently out-convert and out-rank competitors running on legacy stacks.</p>
              <div className="svcd-overview-stats">
                {service.overview.stats.map((s) => (
                  <div className="stat-item" key={s.label}>
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════ KEY FEATURES ══════════════ */}
      {service.features?.length > 0 && (
        <section className="section svcd-features">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Key Features</span>
            <h2>Everything a modern build needs</h2>
            <p>No add-on packages, no upsells later — these come standard with every project.</p>
          </div>
          <div className="grid grid-3">
            {service.features.map((f, idx) => (
              <motion.div
                className="glass-card" key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: idx * 0.06 }}
              >
                <div className="icon-badge"><i className={`bi ${f.icon}`}></i></div>
                <h3 className="svcd-card-title">{f.title}</h3>
                <p className="svcd-card-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ PROCESS ══════════════ */}
      {service.process?.length > 0 && (
        <section className="section svcd-process">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Our Process</span>
            <h2>Seven stages, one clear line of sight</h2>
            <p>You'll always know exactly what stage a project is in and what's next.</p>
          </div>
          <div className={`timeline ${processInView ? 'in-view' : ''}`} ref={processRef}>
            <div className="timeline-track timeline-track-h"><span className="timeline-fill" /></div>
            <div className="timeline-track timeline-track-v"><span className="timeline-fill" /></div>
            {service.process.map((step, idx) => (
              <div className="timeline-step" key={step.title} style={{ transitionDelay: `${idx * 90}ms` }}>
                <div className="timeline-node"><i className={`bi ${STEP_ICONS[idx % STEP_ICONS.length]}`}></i></div>
                <div className="timeline-label">
                  <span className="timeline-index">0{idx + 1}</span>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ TECH STACK ══════════════ */}
      {service.technologies?.length > 0 && (
        <section className="section svcd-tech pt-0">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Technologies We Use</span>
            <h2>A modern, battle-tested stack</h2>
            <p>Chosen for stability and speed — not resume-driven development.</p>
          </div>
          <div className="svcd-tech-grid">
            {service.technologies.map((t, idx) => (
              <motion.div
                className="svcd-tech-tile" key={t.name}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
              >
                <div className="icon-badge icon-badge-sm"><i className={`bi ${t.icon}`}></i></div>
                <span>{t.name}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ BENEFITS ══════════════ */}
      {service.benefits?.length > 0 && (
        <section className="section svcd-benefits pt-0">
          <div className="glass-panel svcd-benefits-panel">
            <div className="section-head" style={{ marginBottom: '30px' }}>
              <span className="eyebrow"><span className="eyebrow-dot" /> Benefits</span>
              <h2>Why teams choose this service</h2>
            </div>
            <div className="svcd-benefits-grid">
              {service.benefits.map((b, idx) => (
                <motion.div
                  className="svcd-benefit-item" key={b}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <span className="svcd-benefit-check"><i className="bi bi-check-lg"></i></span>
                  <span>{b}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ CASE STUDIES ══════════════ */}
      {service.caseStudies?.length > 0 && (
        <section className="section svcd-cases">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Recent Work</span>
            <h2>Case studies from this service line</h2>
            <p>Real outcomes from real engagements — not stock screenshots.</p>
          </div>
          <div className="grid grid-3">
            {service.caseStudies.map((c, idx) => (
              <motion.div
                className="svcd-case-card" key={c.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="svcd-case-img">
                  <img src={c.image} alt={c.title} />
                  <span className="svcd-case-tag">{c.tag}</span>
                </div>
                <div className="svcd-case-body">
                  <span className="svcd-case-result">{c.result}</span>
                  <h4>{c.title}</h4>
                  <Link to="/portfolio" className="svcd-case-link">View case study <i className="bi bi-arrow-up-right"></i></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ PRICING (optional) ══════════════ */}
      {service.pricing?.length > 0 && (
        <section className="section svcd-pricing pt-0">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Pricing</span>
            <h2>Straightforward plans, no hidden scope</h2>
            <p>Every quote is scoped to your project — these are starting points, not final invoices.</p>
          </div>
          <div className="svcd-pricing-grid">
            {service.pricing.map((plan, idx) => (
              <motion.div
                className={`svcd-pricing-card ${plan.featured ? 'is-featured' : ''}`} key={plan.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                {plan.featured && <span className="svcd-pricing-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <div className="svcd-pricing-price">{plan.price}<span>/{plan.period}</span></div>
                <p>{plan.desc}</p>
                <ul>
                  {plan.features.map((f) => <li key={f}><i className="bi bi-check-circle-fill"></i>{f}</li>)}
                </ul>
                <button className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} btn-block`} onClick={openModal}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ FAQ ══════════════ */}
      {service.faqs?.length > 0 && (
        <section className="section svcd-faq pt-0">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> FAQ</span>
            <h2>Frequently asked questions</h2>
            <p>Still have something specific in mind? Book a consultation and ask directly.</p>
          </div>
          <div className="svcd-faq-list">
            {service.faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                  <button className="faq-header" onClick={() => setOpenFaq(isOpen ? -1 : idx)} aria-expanded={isOpen}>
                    <span>{item.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="svcd-faq-chevron">
                      <i className="bi bi-chevron-down"></i>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-content">{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════ RELATED SERVICES ══════════════ */}
      {service.related?.length > 0 && (
        <section className="section svcd-related pt-0">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Related Services</span>
            <h2>Pairs well with this service</h2>
          </div>
          <div className="grid grid-3">
            {service.related.map((r, idx) => (
              <motion.div
                className="glass-card svcd-related-card" key={r.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="icon-badge"><i className={`bi ${r.icon}`}></i></div>
                <h3 className="svcd-card-title">{r.title}</h3>
                <p className="svcd-card-desc">{r.desc}</p>
                <Link to={`/services/${r.slug}`} className="svcd-related-link">Explore service <i className="bi bi-arrow-right"></i></Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      {service.testimonials?.length > 0 && (
        <section className="section svcd-testimonials pt-0">
          <div className="section-head">
            <span className="eyebrow"><span className="eyebrow-dot" /> Testimonials</span>
            <h2>What clients say</h2>
          </div>
          <div className="grid grid-3">
            {service.testimonials.map((t, idx) => (
              <motion.div
                className="glass-card svcd-testimonial-card" key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="svcd-testimonial-stars">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <i className="bi bi-star-fill" key={i}></i>)}
                </div>
                <p className="svcd-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="svcd-testimonial-profile">
                  <span className="svcd-testimonial-avatar">{t.name.charAt(0)}</span>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ CTA ══════════════ */}
      <section className="section svcd-cta">
        <motion.div
          className="svcd-cta-card"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
        >
          <h2>Ready to start your project?</h2>
          <p>Tell us what you're building — we'll come back with a scoped plan, not a sales script.</p>
          <div className="svcd-cta-actions">
            <button className="btn btn-primary" onClick={openModal}>
              Book Consultation <i className="bi bi-calendar-check ms-1"></i>
            </button>
            <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════ CONSULTATION MODAL ══════════════ */}
      {consultationOpen && (
        <div className="modal-backdrop" onClick={() => setConsultationOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setConsultationOpen(false)} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="modal-head">
              <h3>Book a Consultation</h3>
              <p>Tell us a bit about your project — we'll reply within one business day.</p>
            </div>
            <form className="apply-form" onSubmit={(e) => e.preventDefault()}>
              <label>Full name<input type="text" placeholder="Jane Doe" required /></label>
              <label>Work email<input type="email" placeholder="jane@company.com" required /></label>
              <label>What are you building? <em>(optional)</em><textarea rows="3" placeholder="A quick summary helps us prep." /></label>
              <button type="submit" className="btn btn-primary btn-block">Send Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}