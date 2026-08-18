import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown,
  Sparkles, MessageSquare, ShieldCheck, Zap, UserCheck, ArrowRight,
  HelpCircle, Building, RefreshCw, MessageCircle, Copy, Check, ExternalLink
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import HeroSection from '../Components/HeroSection';
import { createContactUs } from '../Redux/ActionCreators/ContactUsActionCreators';

const SERVICES = [
  'Web Development',
  'Mobile App Development',
  'AI / ML Solutions',
  'UI / UX Design',
  'Internship & Training',
  'General Inquiry'
];

const INFO_CARDS = [
  {
    icon: MapPin,
    title: 'Visit Headquarters',
    primary: 'Civil Lines, Roorkee',
    secondary: 'Opposite Prem Mandir, Uttarakhand – 247667, India',
    badge: 'Open for Visits',
    badgeType: 'success',
    link: 'https://www.google.com/maps/dir/?api=1&destination=Opposite+Prem+Mandir,+Civil+Lines,+Roorkee,+Uttarakhand+247667,+India',
    linkText: 'Get Directions',
    accentColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.28)',
    glow: 'rgba(16, 185, 129, 0.25)',
    copyable: false
  },
  {
    icon: Phone,
    title: 'Call Us Directly',
    primary: '+91 7417080572',
    secondary: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    badge: 'Direct Line',
    badgeType: 'primary',
    link: 'tel:+917417080572',
    linkText: 'Call Now',
    accentColor: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.12)',
    accentBorder: 'rgba(6, 182, 212, 0.28)',
    glow: 'rgba(6, 182, 212, 0.25)',
    copyable: true,
    copyValue: '+917417080572'
  },
  {
    icon: Mail,
    title: 'Email Support',
    primary: 'ctechethicssolutionhr@gmail.com',
    secondary: 'Average response under 24 business hours',
    badge: '24/7 Monitored',
    badgeType: 'purple',
    link: 'mailto:ctechethicssolutionhr@gmail.com',
    linkText: 'Send Email',
    accentColor: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.28)',
    glow: 'rgba(139, 92, 246, 0.25)',
    copyable: true,
    copyValue: 'ctechethicssolutionhr@gmail.com'
  },
  {
    icon: Clock,
    title: 'Working Hours',
    primary: 'Mon – Sat: 9 AM – 7 PM',
    secondary: 'Sunday: Emergency Support Available',
    badge: 'Active Support',
    badgeType: 'amber',
    link: '#contact-form-section',
    linkText: 'Schedule Meeting',
    accentColor: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    accentBorder: 'rgba(245, 158, 11, 0.28)',
    glow: 'rgba(245, 158, 11, 0.25)',
    copyable: false
  },
];

const WHY_US = [
  { icon: MessageSquare, title: 'Free Technical Consultation', desc: 'Brainstorm your project scope directly with senior software architects at zero cost.' },
  { icon: Zap, title: 'Rapid 24-Hour Turnaround', desc: 'Guaranteed preliminary technical proposal & estimate within 24 business hours.' },
  { icon: UserCheck, title: 'Dedicated Project Partner', desc: 'Assigned account manager to guide you from initial wireframes to final deployment.' },
  { icon: ShieldCheck, title: 'Transparent & Flexible Pricing', desc: 'Tailored enterprise milestones, startup packages, and student internship rates.' },
];

const FAQS = [
  {
    q: 'How fast can CTech Ethic start our project?',
    a: 'Following our initial discovery call and requirements lock, project kickoff typically occurs within 48 to 72 hours with assigned engineering leads.'
  },
  {
    q: 'What is the estimated timeline for website or custom app development?',
    a: 'Standard business websites take 2 to 4 weeks, while complex full-stack web applications or cross-platform mobile apps take 6 to 12 weeks depending on integration requirements.'
  },
  {
    q: 'Do you offer ongoing post-launch maintenance & security updates?',
    a: 'Yes! Every project includes 30 days of complimentary post-launch support. We also provide monthly maintenance SLAs covering server health, backups, and feature enhancements.'
  },
  {
    q: 'How do your Internship & Placement assistance programs work?',
    a: 'Our training modules feature hands-on internships on real client codebases. Eligible graduates receive guaranteed placement support across our 150+ hiring partner network.'
  },
];

const SOCIAL_LINKS = [
  { icon: 'bi bi-linkedin', label: 'LinkedIn', url: '#', color: '#0a66c2' },
  { icon: 'bi bi-instagram', label: 'Instagram', url: '#', color: '#e4405f' },
  { icon: 'bi bi-facebook', label: 'Facebook', url: '#', color: '#1877f2' },
  { icon: 'bi bi-youtube', label: 'YouTube', url: '#', color: '#ff0000' },
  { icon: 'bi bi-github', label: 'GitHub', url: '#', color: '#ffffff' },
  { icon: 'bi bi-whatsapp', label: 'WhatsApp', url: 'https://wa.me/919876543210', color: '#25d366' },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function ContactUsPage() {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  // State perfectly matched to Mongoose Schema
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SERVICES[0], // Matches Schema "subject"
    message: '',
  });

  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, title) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(title);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Full name is required';
    if (!data.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!data.phone.trim()) errs.phone = 'Phone number is required';
    if (!data.message.trim()) errs.message = 'Please share a few details about your inquiry';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    if (touched[name]) setErrors(validate(nextFormData));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // --- REDUX DISPATCH ---
    // formData directly maps to: name, email, phone, subject, message
    dispatch(createContactUs({ ...formData, active: true }));

    // Simulating slight delay for smooth UI transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: SERVICES[0], message: '' });
    setTouched({});
    setErrors({});
  };

  // Update subject when clicking on a service card
  const selectSubjectAndScroll = (srv) => {
    setFormData((prev) => ({ ...prev, subject: srv }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="contact-page-wrapper">

      {/* 1. DYNAMIC HERO SECTION */}
      <HeroSection
        title="Get in Touch With Our Experts"
        subtitle="Have a project in mind, need IT advisory, or looking to supercharge your tech career? We're here to help you turn ambition into reality."
        eyebrow="CTech Ethic Solution · Contact Us"
        size="md"
        showBreadcrumb={true}
        breadcrumb={['Contact Us']}
        cta={[
          { label: 'Start Project Inquiry', href: '#contact-form-section', primary: true },
          { label: 'Explore Services', href: '#services-section', primary: false },
        ]}
      />

      <div className="contact-container max-width-wrapper">

        {/* 2. CONTACT INFO CARDS GRID */}
        <motion.section
          className="contact-cards-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {INFO_CARDS.map((card) => {
            const isCopied = copiedField === card.title;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="glass-card modern-info-card"
                style={{
                  '--card-accent': card.accentColor,
                  '--card-glow': card.glow,
                  '--card-bg': card.accentBg,
                  '--card-border': card.accentBorder,
                }}
              >
                {/* Top Accent Shimmer Bar */}
                <div className="card-top-accent-bar" style={{ background: card.accentColor }} />

                <div className="info-card-top">
                  <div
                    className="icon-badge-modern"
                    style={{ background: card.accentBg, color: card.accentColor, borderColor: card.accentBorder }}
                  >
                    <card.icon size={22} />
                  </div>
                  {card.badge && (
                    <span className={`status-badge-modern badge-${card.badgeType || 'primary'}`}>
                      <span className="live-dot" />
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="info-card-title">{card.title}</h3>

                <div className="info-card-content">
                  {card.link ? (
                    <a
                      href={card.link}
                      target={card.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="primary-detail-link"
                    >
                      {card.primary}
                    </a>
                  ) : (
                    <div className="primary-detail-text">{card.primary}</div>
                  )}

                  {card.secondary && (
                    <p className="secondary-detail-text">{card.secondary}</p>
                  )}
                </div>

                <div className="info-card-footer">
                  {card.link ? (
                    <a
                      href={card.link}
                      target={card.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="card-main-btn"
                      style={{ background: card.accentBg, color: card.accentColor, borderColor: card.accentBorder }}
                    >
                      <span>{card.linkText}</span>
                      <ArrowRight size={14} className="action-arrow" />
                    </a>
                  ) : (
                    <div className="card-info-pill">
                      <span>Available Always</span>
                    </div>
                  )}

                  {card.copyable && (
                    <button
                      type="button"
                      onClick={() => handleCopy(card.copyValue, card.title)}
                      className={`card-copy-btn ${isCopied ? 'copied' : ''}`}
                      title="Copy to clipboard"
                      aria-label={`Copy ${card.title}`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* 3. CONTACT FORM + GOOGLE MAP GRID */}
        <section id="contact-form-section" className="section-block form-map-grid" ref={formRef}>
          {/* LEFT: FORM CONTAINER */}
          <motion.div
            className="glass-panel form-panel"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="success-state"
                >
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={42} />
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for reaching out, <strong>{formData.name.split(' ')[0] || 'there'}</strong>.
                    Our technical lead will review your inquiry regarding <em>"{formData.subject}"</em> and respond within 24 business hours.
                  </p>
                  <button onClick={handleReset} className="btn btn-ghost mt-3">
                    <RefreshCw size={15} /> Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="form-head">
                    <div className="eyebrow-tag">
                      <Sparkles size={14} /> Direct Inquiry
                    </div>
                    <h2>Send Us a Message</h2>
                    <p>Select your area of interest and fill out the brief form below.</p>
                  </div>

                  <div className="form-row-2">
                    {/* Full Name */}
                    <div className="field-group">
                      <label className="field-label">Full Name <span>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Alex Morgan"
                        className={touched.name && errors.name ? 'error-input' : ''}
                      />
                      {touched.name && errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="field-group">
                      <label className="field-label">Email Address <span>*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="alex@company.com"
                        className={touched.email && errors.email ? 'error-input' : ''}
                      />
                      {touched.email && errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="field-group">
                    <label className="field-label">Phone / WhatsApp Number <span>*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+91 98765 43210"
                      className={touched.phone && errors.phone ? 'error-input' : ''}
                    />
                    {touched.phone && errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  {/* Message */}
                  <div className="field-group">
                    <label className="field-label">Message & Project Overview <span>*</span></label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us about your project timeline, requirements, or specific goals..."
                      className={touched.message && errors.message ? 'error-input' : ''}
                    />
                    {touched.message && errors.message && <span className="error-text">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner" />
                        <span>Sending Request…</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: MAP & QUICK CONNECT WIDGET */}
          <motion.div
            className="map-side-container"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Quick Connect Floating Bar */}
            <div className="glass-card quick-connect-card">
              <div className="quick-connect-header">
                <Building size={20} className="text-accent" />
                <div>
                  <h4>CTech Ethic Solution HQ</h4>
                  <p>Prem Mandir, Civil Lines, Roorkee, Uttarakhand</p>
                </div>
              </div>
              <div className="quick-contact-actions">
                <a href="https://wa.me/917417080572" target="_blank" rel="noreferrer" className="quick-btn whatsapp">
                  <MessageCircle size={15} /> WhatsApp Us
                </a>
                <a href="tel:+917417080572" className="quick-btn phone">
                  <Phone size={15} /> Instant Call
                </a>
              </div>
            </div>

            {/* Map Frame Card */}
            <div className="glass-panel map-card">
              <iframe
                src="https://maps.google.com/maps?q=Opposite+Prem+Mandir,+Civil+Lines,+Roorkee,+Uttarakhand+247667,+India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CTech Ethic Solution Location Map"
              />
            </div>
          </motion.div>
        </section>

        {/* 4. WHY WORK WITH US SECTION */}
        <section className="section-block">
          <div className="section-head">
            <div className="eyebrow-tag">
              <Sparkles size={14} /> Our Commitment
            </div>
            <h2>Why Clients & Students Trust CTech Ethic</h2>
            <p>Every consultation is backed by transparent engineering standards and clear communication.</p>
          </div>

          <motion.div
            className="why-us-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {WHY_US.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card why-card"
              >
                <div className="icon-badge icon-badge-sm">
                  <item.icon size={20} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 5. SERVICES WE HELP WITH (Interactive Click to Select) */}
        <section id="services-section" className="section-block">
          <div className="section-head">
            <div className="eyebrow-tag">
              <Sparkles size={14} /> Tailored Expertise
            </div>
            <h2>Services & Capabilities We Offer</h2>
            <p>Click any service below to pre-select it in the contact form above.</p>
          </div>

          <div className="services-capability-grid">
            {SERVICES.map((srv) => (
              <motion.div
                key={srv}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectSubjectAndScroll(srv)}
                className="glass-card service-capability-card"
              >
                <div className="dot-indicator" />
                <span>{srv}</span>
                <ArrowRight size={14} className="hover-arrow" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. FAQ ACCORDION SECTION */}
        <section className="section-block faq-section">
          <div className="section-head">
            <div className="eyebrow-tag">
              <HelpCircle size={14} /> Clarifications
            </div>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about timelines, quotes, and project kickoff.</p>
          </div>

          <div className="faq-accordion max-width-narrow">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className={`glass-card faq-card ${isOpen ? 'active' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="faq-question-btn"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="faq-answer-wrap"
                      >
                        <p className="faq-answer">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. SOCIAL LINKS */}
        <section className="section-block text-center">
          <div className="eyebrow-tag mx-auto mb-3">
            <Sparkles size={14} /> Join Our Network
          </div>
          <h3 className="social-heading">Connect With Us On Social Media</h3>

          <div className="social-pills-row">
            {SOCIAL_LINKS.map((soc) => (
              <motion.a
                key={soc.label}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.07, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card social-pill"
              >
                <i className={soc.icon} style={{ color: soc.color, fontSize: '18px' }} />
                <span>{soc.label}</span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION BANNER */}
        <section className="section-block final-cta-section">
          <motion.div
            className="glass-panel final-cta-panel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={28} className="cta-icon" />
            <h2>Ready to Elevate Your Technology Vision?</h2>
            <p>Let's schedule a 30-minute discovery call to map out your digital solution or career path.</p>
            <div className="cta-buttons">
              <button
                onClick={() => {
                  if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-primary"
              >
                Book Free Consultation <ArrowRight size={16} />
              </button>
              <a href="tel:+919876543210" className="btn btn-ghost">
                <Phone size={16} /> Call +91 98765 43210
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}