import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getWhyChooseUs } from '../Redux/ActionCreators/WhyChoosesUsActionCreators';

// Shown only while the first GET is in flight, or if every entry is
// deleted/deactivated, so the section never renders empty.
const FALLBACK_FEATURES = [
  {
    icon: "bi bi-lightning-charge-fill",
    badge: "Agile",
    title: "Fast & Timely Delivery",
    description: "We leverage agile workflows and modern tools to deliver high-quality digital solutions within optimal timelines without compromising excellence."
  },
  {
    icon: "bi bi-shield-lock-fill",
    badge: "Encrypted",
    title: "Secure & Ethical Solutions",
    description: "Security is built into our core. We implement industry-leading encryption, data protection, and ethical practices to keep your platform safe."
  },
  {
    icon: "bi bi-rocket-takeoff-fill",
    badge: "Modern",
    title: "Modern Next-Gen Tech",
    description: "Built for today’s fast-evolving world. We use modern frameworks, responsive designs, and clean code to ensure your business stays ahead of the competition."
  },
  {
    icon: "bi bi-headset",
    badge: "Support",
    title: "24/7 Technical Support",
    description: "Our dedicated technical team is available around the clock to provide continuous support, quick troubleshooting, and uninterrupted smooth operation."
  },
  {
    icon: "bi bi-diagram-3-fill",
    badge: "Scalable",
    title: "Scalable Architecture",
    description: "Our solutions are engineered to grow with your business, handling increasing user traffic and evolving feature demands seamlessly."
  },
  {
    icon: "bi bi-trophy-fill",
    badge: "Value",
    title: "Cost-Effective & High ROI",
    description: "We provide top-tier digital products at transparent, competitive prices, ensuring maximum value and long-term return on your investment."
  }
];

export default function WhyChooseUs() {
  const dispatch = useDispatch();
  const rawData = useSelector((state) => state.WhyChooseUsStateData);
  const WhyChooseUsStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  useEffect(() => {
    dispatch(getWhyChooseUs());
  }, [dispatch]);

  // Public site only shows published entries — same status:true convention
  // used across the other public sections.
  const activeFeatures = WhyChooseUsStateData.filter((f) => f.status);
  const features = activeFeatures.length > 0 ? activeFeatures : FALLBACK_FEATURES;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 24, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <motion.section
      id="why-choose-us"
      className="wcu-section section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Section Header */}
      <div className="container section-title text-center mb-5">
        <motion.span
          className="wcu-eyebrow mb-2"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <i className="bi bi-patch-check-fill me-1"></i> Why Choose Us
        </motion.span>
        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Why Choose <span className="wcu-gradient-text">Ctech Ethic Solutions</span>
        </motion.h2>
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          Empowering your business with fast, secure, and future-ready technology tailored for today's digital landscape.
        </motion.p>
      </div>

      {/* Feature Cards Grid */}
      <div className="container">
        <motion.div
          className="row g-2 g-md-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((item, index) => (
            <motion.div
              className="col-6 col-lg-4"
              key={item._id || index}
              variants={cardVariants}
            >
              <motion.div
                className="wcu-card h-100 p-4"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {/* Rainbow Accent Bar on Hover */}
                <div className="wcu-card-accent-bar" />

                <div className="wcu-card-header d-flex justify-content-between align-items-center mb-3">
                  <motion.div
                    className="wcu-icon-box"
                    whileHover={{ rotate: 12, scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <i className={item.icon}></i>
                  </motion.div>
                  <span className="wcu-badge">{item.badge}</span>
                </div>

                <div className="wcu-card-body">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}