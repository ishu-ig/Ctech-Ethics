import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAchievement } from '../Redux/ActionCreators/AchievementActionCreators';

// Shown only while the first GET is in flight, or if every achievement is
// deleted/deactivated, so the section never renders empty.
const FALLBACK_STATS = [
  {
    icon: "bi bi-emoji-smile-fill",
    count: "150+",
    title: "Happy Clients",
    description: "Consistently delivering satisfaction and building long-term partnerships."
  },
  {
    icon: "bi bi-journal-check",
    count: "320+",
    title: "Projects Completed",
    description: "Successful software, web, and enterprise solutions delivered."
  },
  {
    icon: "bi bi-headset",
    count: "1,453+",
    title: "Hours of Support",
    description: "Dedicated round-the-clock technical assistance provided."
  },
  {
    icon: "bi bi-people-fill",
    count: "35+",
    title: "Expert Team",
    description: "A passionate team of developers, designers, and strategists."
  }
];

export default function Achievements() {
  const dispatch = useDispatch();
  const rawData = useSelector((state) => state.AchievementStateData);
  const AchievementStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  useEffect(() => {
    dispatch(getAchievement());
  }, [dispatch]);

  // Public site only shows published entries — same status:true convention
  // as SubServiceController's getRecord.
  const activeStats = AchievementStateData.filter((s) => s.status);
  const stats = activeStats.length > 0 ? activeStats : FALLBACK_STATS;

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
      id="achievements"
      className="achieve-section section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Section Header */}
      <div className="container section-title text-center mb-5">
        <motion.span
          className="achieve-eyebrow mb-2"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <i className="bi bi-trophy-fill me-1"></i> Milestones & Impact
        </motion.span>
        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Our <span className="achieve-gradient-text">Achievements</span>
        </motion.h2>
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          Proven track record of delivering successful digital products, training certified developers, and supporting enterprise clients.
        </motion.p>
      </div>

      {/* Stats Cards Grid */}
      <div className="container">
        <motion.div
          className="row g-2 g-md-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              className="col-6 col-lg-3"
              key={stat._id || index}
              variants={cardVariants}
            >
              <motion.div
                className="achieve-card h-100 p-4"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {/* Top Rainbow Gradient Accent Bar */}
                <div className="achieve-card-accent-bar" />

                <motion.div
                  className="achieve-icon-box"
                  whileHover={{ rotate: 12, scale: 1.12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <i className={stat.icon}></i>
                </motion.div>

                <h3 className="achieve-stat-number">
                  {stat.count}
                </h3>

                <h5 className="achieve-stat-title">
                  {stat.title}
                </h5>

                <p className="achieve-stat-desc mb-0">
                  {stat.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}