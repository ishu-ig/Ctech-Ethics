import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getService } from '../Redux/ActionCreators/ServiceActionCreators';
import SimpleReactValidator from 'simple-react-validator';
import { useEffect } from 'react';

const FALLBACK_SERVICES = [
  'Software Development',
  'Cloud & DevOps Solutions',
  'Digital Marketing',
  'IT Placement Training',
  'UI/UX & Web Design',
  'AI & Data Analytics'
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000+'
];

export default function ConsultancyModal({ isOpen, onClose, defaultService: preService = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: preService,
    budget: '',
    description: ''
  });

  // Sync pre-selected service whenever the prop or open state changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, service: preService || prev.service }));
    }
  }, [isOpen, preService]);

  const [, forceUpdate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SimpleReactValidator — one instance per component mount
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate((n) => n + 1) },
      className: 'field-error',
      messages: {
        required:    'This field is required.',
        email:       'Enter a valid email address.',
        phone:       'Enter a valid phone number.',
        min:         'Must be at least :min characters.',
        alpha_space: 'Only letters and spaces are allowed.',
      },
    })
  );

  // ── Redux: live service list ──
  const dispatch = useDispatch();
  const rawServices = useSelector((state) => state.ServiceStateData);
  const ServiceStateData = Array.isArray(rawServices) ? rawServices : (rawServices?.data || []);

  useEffect(() => {
    dispatch(getService());
  }, [dispatch]);

  const activeServices = ServiceStateData.filter((s) => s.status !== false);
  const serviceOptions = activeServices.length > 0
    ? activeServices.map((s) => s.title || s.name).filter(Boolean)
    : FALLBACK_SERVICES;

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
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', service: preService || '', budget: '', description: '' });
    validator.current.hideMessages();
    forceUpdate((n) => n + 1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="consultancy-modal-overlay">
          {/* Backdrop */}
          <motion.div
            className="consultancy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="consultancy-modal-dialog glass-consultancy-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
          >
            {/* Close Icon Button */}
            <motion.button
              className="consultancy-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              whileHover={{ rotate: 90, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="bi bi-x-lg"></i>
            </motion.button>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Success Feedback Screen */
                <motion.div
                  key="success-view"
                  className="consultancy-success-body text-center py-4 px-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    className="consultancy-success-icon mx-auto mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                    transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}
                  >
                    <i className="bi bi-patch-check-fill"></i>
                  </motion.div>

                  <h3 className="consultancy-modal-title mb-2">Request Submitted!</h3>
                  <p className="consultancy-modal-subtitle mb-4">
                    Thank you, <strong>{formData.name}</strong>. Our expert team will review your consultation request and contact you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> shortly.
                  </p>

                  <motion.button
                    className="btn-consultancy-submit px-4 py-2"
                    onClick={handleReset}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                /* Consultation Form */
                <motion.form
                  key="form-view"
                  onSubmit={handleSubmit}
                  className="consultancy-form-body"
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="consultancy-header mb-4 text-center">
                    <span className="consultancy-eyebrow">
                      <i className="bi bi-calendar-event me-1"></i> Quick Consultation
                    </span>
                    <h2 id="consultation-modal-title" className="consultancy-modal-title">
                      Book A <span className="consultancy-gradient-text">Consultation</span>
                    </h2>
                    <p className="consultancy-modal-subtitle">
                      Complete this quick 1-minute form to connect with our technology experts.
                    </p>
                  </div>

                  <div className="row gy-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-person field-icon"></i>
                        <input
                          type="text"
                          name="name"
                          className="consultancy-input"
                          placeholder="Full Name *"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('name')}
                        />
                        {validator.current.message('name', formData.name, 'required|alpha_space|min:2')}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-envelope field-icon"></i>
                        <input
                          type="email"
                          name="email"
                          className="consultancy-input"
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('email')}
                        />
                        {validator.current.message('email', formData.email, 'required|email')}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-telephone field-icon"></i>
                        <input
                          type="tel"
                          name="phone"
                          className="consultancy-input"
                          placeholder="Phone Number *"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('phone')}
                        />
                        {validator.current.message('phone', formData.phone, 'required|phone')}
                      </div>
                    </div>

                    {/* Service Required (Dropdown) */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-gear field-icon"></i>
                        <select
                          name="service"
                          className="consultancy-select"
                          value={formData.service}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('service')}
                        >
                          <option value="" disabled>Select Service Required *</option>
                          {serviceOptions.map((s, idx) => (
                            <option key={idx} value={s}>{s}</option>
                          ))}
                        </select>
                        {validator.current.message('service', formData.service, 'required')}
                      </div>
                    </div>

                    {/* Project Budget (Dropdown) */}
                    <div className="col-12">
                      <div className="floating-group">
                        <i className="bi bi-cash-stack field-icon"></i>
                        <select
                          name="budget"
                          className="consultancy-select"
                          value={formData.budget}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('budget')}
                        >
                          <option value="" disabled>Select Project Budget *</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        {validator.current.message('budget', formData.budget, 'required')}
                      </div>
                    </div>

                    {/* Brief Project Description (Textarea) */}
                    <div className="col-12">
                      <div className="floating-group">
                        <i className="bi bi-chat-left-text field-icon mt-2"></i>
                        <textarea
                          name="description"
                          rows="3"
                          className="consultancy-input textarea-input"
                          placeholder="Brief Project Description *"
                          value={formData.description}
                          onChange={handleChange}
                          onBlur={() => validator.current.showMessageFor('description')}
                        />
                        {validator.current.message('description', formData.description, 'required|min:10')}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="col-12 mt-4 d-flex align-items-center justify-content-end gap-3">
                      <motion.button
                        type="button"
                        className="btn-consultancy-cancel"
                        onClick={onClose}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Close
                      </motion.button>

                      <motion.button
                        type="submit"
                        className="btn-consultancy-submit d-flex align-items-center justify-content-center gap-2"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(34, 211, 238, 0.4)' }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Request</span>
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
      )}
    </AnimatePresence>
  );
}
