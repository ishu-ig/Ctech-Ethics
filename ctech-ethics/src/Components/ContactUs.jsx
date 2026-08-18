import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { createContactUs } from '../Redux/ActionCreators/ContactUsActionCreators';
import SimpleReactValidator from 'simple-react-validator';


export default function ContactUs() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [, forceUpdate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SimpleReactValidator — one instance per component mount
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate((n) => n + 1) },
      className: 'field-error',
      messages: {
        required: 'This field is required.',
        email: 'Enter a valid email address.',
        phone: 'Enter a valid phone number.',
        min: 'Must be at least :min characters.',
        alpha_space: 'Only letters and spaces are allowed.',
      },
    })
  );

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate((n) => n + 1);
      return;
    }
    setIsSubmitting(true);
    dispatch(createContactUs(formData));
    // Saga fires POST; optimistically show success after it has had time to fire.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    validator.current.hideMessages();
    forceUpdate((n) => n + 1);
  };

  return (
    <section id="contact" className="contact section" ref={sectionRef}>

      {/* ── Section Header ── */}
      <div className="container contact-header">
        <motion.div
          className="contact-header-text text-center mx-auto"
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="contact-eyebrow">
            <i className="bi bi-envelope-paper-fill me-1"></i> Get In Touch
          </span>
          <h2>
            Let&apos;s Connect &amp; <span className="contact-gradient-text">Build Together</span>
          </h2>
          <p>Have a project in mind, need software consulting, or want to enroll in our career IT training programs? Reach out to our expert team.</p>
        </motion.div>
      </div>

      <div className="container">
        <div className="row gy-4 align-items-stretch">

          {/* ══ LEFT COLUMN: Contact Info Card ══ */}
          <div className="col-lg-5">
            <motion.div
              className="contact-info-card h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Accent Shimmer Bar */}
              <div className="contact-card-accent-bar" />

              <div>
                <h3 className="contact-info-title mb-4">Contact Details</h3>

                {/* Info Items 2x2 Grid on Mobile */}
                <div className="info-items-list row g-2 mb-3">

                  {/* Address */}
                  <div className="col-6 col-md-12">
                    <motion.div
                      className="info-item-box d-flex align-items-center p-2 rounded-3 h-100"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="info-icon-box flex-shrink-0">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div className="ms-2 ms-md-3 overflow-hidden">
                        <h4 className="m-0">Address</h4>
                        <p className="text-truncate m-0">Prem Mandir, Roorkee</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Phone */}
                  <div className="col-6 col-md-12">
                    <motion.div
                      className="info-item-box d-flex align-items-center p-2 rounded-3 h-100"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="info-icon-box flex-shrink-0">
                        <i className="bi bi-telephone-fill"></i>
                      </div>
                      <div className="ms-2 ms-md-3 overflow-hidden">
                        <h4 className="m-0">Call Us</h4>
                        <a href="tel:+917417080572" className="info-link text-truncate d-block">+91 7417080572</a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Email */}
                  <div className="col-6 col-md-12">
                    <motion.div
                      className="info-item-box d-flex align-items-center p-2 rounded-3 h-100"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="info-icon-box flex-shrink-0">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div className="ms-2 ms-md-3 overflow-hidden">
                        <h4 className="m-0">Email Us</h4>
                        <a href="mailto:ctechethicssolutionhr@gmail.com" className="info-link text-truncate d-block">ctechethicssolutionhr@gmail.com</a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hours */}
                  <div className="col-6 col-md-12">
                    <motion.div
                      className="info-item-box d-flex align-items-center p-2 rounded-3 h-100"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="info-icon-box flex-shrink-0">
                        <i className="bi bi-clock-fill"></i>
                      </div>
                      <div className="ms-2 ms-md-3 overflow-hidden">
                        <h4 className="m-0">Hours</h4>
                        <p className="text-truncate m-0">Mon – Sat: 9 AM – 7 PM</p>
                      </div>
                    </motion.div>
                  </div>

                </div>
              </div>

              {/* Embedded Map Container */}
              <div className="contact-map-wrapper position-relative overflow-hidden mt-3" style={{ minHeight: '230px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Opposite+Prem+Mandir,+Civil+Lines,+Roorkee,+Uttarakhand+247667,+India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  className="contact-map-iframe"
                  style={{ width: '100%', height: '230px', border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CTech Ethic Solution Office Location"
                />
              </div>

            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN: Interactive Contact Form ══ */}
          <div className="col-lg-7">
            <motion.div
              className="contact-form-card position-relative overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Accent Shimmer Bar */}
              <div className="contact-card-accent-bar" />
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  /* Success Feedback Screen */
                  <motion.div
                    key="success"
                    className="contact-success-box text-center py-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="success-icon-circle mx-auto mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                      <i className="bi bi-check-lg"></i>
                    </motion.div>

                    <h3 className="mb-2">Thank You!</h3>
                    <p className="mb-4">Your message has been sent successfully. Our team will get back to you within 24 hours.</p>

                    <motion.button
                      className="btn-contact-submit px-4 py-2"
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Contact Form */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="contact-form-inner"
                    noValidate
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="form-card-title mb-4">Send Us a Message</h3>
                    <div className="row gy-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <div className="form-group-custom">
                          <label htmlFor="name-field" className="form-label-custom">Your Name</label>
                          <div className="input-with-icon">
                            <i className="bi bi-person input-icon"></i>
                            <input
                              type="text"
                              name="name"
                              id="name-field"
                              className="form-control-custom"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              onBlur={() => validator.current.showMessageFor('name')}
                            />
                          </div>
                          {validator.current.message('name', formData.name, 'required|alpha_space|min:2')}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <div className="form-group-custom">
                          <label htmlFor="email-field" className="form-label-custom">Your Email</label>
                          <div className="input-with-icon">
                            <i className="bi bi-envelope input-icon"></i>
                            <input
                              type="email"
                              name="email"
                              id="email-field"
                              className="form-control-custom"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              onBlur={() => validator.current.showMessageFor('email')}
                            />
                          </div>
                          {validator.current.message('email', formData.email, 'required|email')}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <div className="form-group-custom">
                          <label htmlFor="phone-field" className="form-label-custom">Your Phone</label>
                          <div className="input-with-icon">
                            <i className="bi bi-telephone input-icon"></i>
                            <input
                              type="tel"
                              name="phone"
                              id="phone-field"
                              className="form-control-custom"
                              placeholder="+1 555 555 5555"
                              value={formData.phone}
                              onChange={handleChange}
                              onBlur={() => validator.current.showMessageFor('phone')}
                            />
                          </div>
                          {validator.current.message('phone', formData.phone, 'required|phone')}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="col-md-6">
                        <div className="form-group-custom">
                          <label htmlFor="subject-field" className="form-label-custom">Subject</label>
                          <div className="input-with-icon">
                            <i className="bi bi-bookmark input-icon"></i>
                            <input
                              type="text"
                              name="subject"
                              id="subject-field"
                              className="form-control-custom"
                              placeholder="Project Inquiry / Training Question"
                              value={formData.subject}
                              onChange={handleChange}
                              onBlur={() => validator.current.showMessageFor('subject')}
                            />
                          </div>
                          {validator.current.message('subject', formData.subject, 'required|min:3')}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-md-12">
                        <div className="form-group-custom">
                          <label htmlFor="message-field" className="form-label-custom">Your Message</label>
                          <div className="input-with-icon align-items-start">
                            <i className="bi bi-chat-text input-icon mt-2"></i>
                            <textarea
                              name="message"
                              id="message-field"
                              rows="4"
                              className="form-control-custom textarea-custom"
                              placeholder="Tell us about your requirements, timeline, and goals..."
                              value={formData.message}
                              onChange={handleChange}
                              onBlur={() => validator.current.showMessageFor('message')}
                            />
                          </div>
                          {validator.current.message('message', formData.message, 'required|min:10')}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12 mt-4">
                        <motion.button
                          type="submit"
                          className="btn-contact-submit w-100 d-flex align-items-center justify-content-center gap-2"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(71, 178, 228, 0.4)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              <span>Sending Message...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <i className="bi bi-send-fill"></i>
                            </>
                          )}
                        </motion.button>
                      </div>

                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}