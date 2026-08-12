import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUALIFICATIONS = [
  'B.Tech / B.E.',
  'BCA / MCA',
  'B.Sc / M.Sc Tech',
  'Diploma in Engineering',
  'Other Graduate'
];

const ROLES = [
  'Full Stack Development',
  'Cloud & DevOps Engineering',
  'Data Science & AI',
  'UI/UX & Product Design',
  'Software Testing / QA',
  'Non-Technical / Business Ops'
];

export default function PlacementModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    qualification: '',
    role: '',
    fileName: ''
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, fileName: e.target.files[0].name }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      college: '',
      qualification: '',
      role: '',
      fileName: ''
    });
    setTouched({});
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
            aria-labelledby="placement-modal-title"
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
                /* Success View */
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
                    <i className="bi bi-award-fill"></i>
                  </motion.div>

                  <h3 className="consultancy-modal-title mb-2">Application Submitted!</h3>
                  <p className="consultancy-modal-subtitle mb-4">
                    Thank you, <strong>{formData.name}</strong>. Your placement application for <strong>{formData.role || 'Tech Role'}</strong> has been registered. Our placement cell will contact you at <strong>{formData.email}</strong> shortly.
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
                /* Placement Form */
                <motion.form
                  key="form-view"
                  onSubmit={handleSubmit}
                  className="consultancy-form-body"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="consultancy-header mb-4 text-center">
                    <span className="placement-eyebrow">
                      <i className="bi bi-rocket-takeoff-fill me-1"></i> Placement Drive Application
                    </span>
                    <h2 id="placement-modal-title" className="consultancy-modal-title">
                      Apply For <span className="placement-gradient-text">Placement</span>
                    </h2>
                    <p className="consultancy-modal-subtitle">
                      Register your details to get interviewed and placed by top IT hiring partners.
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
                          onBlur={() => handleBlur('name')}
                          required
                        />
                        {touched.name && !formData.name && (
                          <span className="field-error">Full Name is required</span>
                        )}
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
                          onBlur={() => handleBlur('email')}
                          required
                        />
                        {touched.email && !formData.email && (
                          <span className="field-error">Valid Email is required</span>
                        )}
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
                          onBlur={() => handleBlur('phone')}
                          required
                        />
                        {touched.phone && !formData.phone && (
                          <span className="field-error">Phone Number is required</span>
                        )}
                      </div>
                    </div>

                    {/* College / University */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-mortarboard field-icon"></i>
                        <input
                          type="text"
                          name="college"
                          className="consultancy-input"
                          placeholder="College / University *"
                          value={formData.college}
                          onChange={handleChange}
                          onBlur={() => handleBlur('college')}
                          required
                        />
                        {touched.college && !formData.college && (
                          <span className="field-error">College name is required</span>
                        )}
                      </div>
                    </div>

                    {/* Highest Qualification */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-award field-icon"></i>
                        <select
                          name="qualification"
                          className="consultancy-select"
                          value={formData.qualification}
                          onChange={handleChange}
                          onBlur={() => handleBlur('qualification')}
                          required
                        >
                          <option value="" disabled>Select Highest Qualification *</option>
                          {QUALIFICATIONS.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        {touched.qualification && !formData.qualification && (
                          <span className="field-error">Please select qualification</span>
                        )}
                      </div>
                    </div>

                    {/* Interested Role */}
                    <div className="col-md-6">
                      <div className="floating-group">
                        <i className="bi bi-briefcase field-icon"></i>
                        <select
                          name="role"
                          className="consultancy-select"
                          value={formData.role}
                          onChange={handleChange}
                          onBlur={() => handleBlur('role')}
                          required
                        >
                          <option value="" disabled>Select Interested Role *</option>
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {touched.role && !formData.role && (
                          <span className="field-error">Please select a role</span>
                        )}
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="col-12">
                      <div className="floating-group">
                        <label className="consultancy-label mb-1">Upload Resume (PDF/DOCX) *</label>
                        <div className="file-upload-wrapper d-flex align-items-center">
                          <label htmlFor="resume-file-input" className="file-upload-btn mb-0">
                            <i className="bi bi-cloud-upload me-2"></i> Choose File
                          </label>
                          <input
                            type="file"
                            id="resume-file-input"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            required={!formData.fileName}
                          />
                          <span className="file-upload-name ms-3 text-truncate">
                            {formData.fileName || 'No file chosen'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons: Submit Application & Close */}
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
                        className="btn-placement-cta d-flex align-items-center justify-content-center gap-2"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(34, 211, 238, 0.4)' }}
                        whileTap={{ scale: 0.96 }}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
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
