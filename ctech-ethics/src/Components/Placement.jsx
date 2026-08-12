import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import PlacementModal from './PlacementModal';
import { getPlacedStudent } from '../Redux/ActionCreators/PlacedStudentActionCreators';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK_PLACED_STUDENTS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Full Stack Developer',
    company: 'Microsoft',
    companyIcon: 'bi bi-microsoft',
    type: 'Technical',
    package: '18.0 LPA',
    photo: 'assets/img/person/person-m-9.webp',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Cloud Engineer',
    company: 'Amazon AWS',
    companyIcon: 'bi bi-cloud-arrow-up-fill',
    type: 'Technical',
    package: '15.5 LPA',
    photo: 'assets/img/person/person-f-5.webp',
  },
  {
    id: 3,
    name: 'Ankit Verma',
    role: 'AI & Data Engineer',
    company: 'Accenture',
    companyIcon: 'bi bi-cpu-fill',
    type: 'Technical',
    package: '12.4 LPA',
    photo: 'assets/img/person/person-m-12.webp',
  },
  {
    id: 4,
    name: 'Sneha Kulkarni',
    role: 'UI/UX Product Designer',
    company: 'TCS Digital',
    companyIcon: 'bi bi-palette-fill',
    type: 'Technical',
    package: '9.8 LPA',
    photo: 'assets/img/person/person-f-12.webp',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'IT Business Analyst',
    company: 'Capgemini',
    companyIcon: 'bi bi-briefcase-fill',
    type: 'Non-Technical',
    package: '10.2 LPA',
    photo: 'assets/img/person/person-m-13.webp',
  },
  {
    id: 6,
    name: 'Neha Gupta',
    role: 'Tech Project Lead',
    company: 'Infosys',
    companyIcon: 'bi bi-diagram-3-fill',
    type: 'Non-Technical',
    package: '11.5 LPA',
    photo: 'assets/img/person/person-f-9.webp',
  },
];

const PLACEMENT_STATS = [
  { value: '500+', label: 'Students Placed', icon: 'bi bi-people-fill' },
  { value: '120+', label: 'Hiring Companies', icon: 'bi bi-building' },
  { value: '96%', label: 'Placement Rate', icon: 'bi bi-graph-up-arrow' },
  { value: '18 LPA', label: 'Highest Package', icon: 'bi bi-trophy-fill' },
];

const normalizePlacedStudent = (s, idx) => {
  if (!s) return null;
  return {
    id: s._id || s.id || `placed-${idx}`,
    name: s.name || 'Placed Student',
    role: s.role || 'Software Engineer',
    company: s.company || 'Partner Company',
    companyIcon: s.companyIcon ? (s.companyIcon.startsWith('bi') ? s.companyIcon : `bi ${s.companyIcon}`) : 'bi bi-building',
    type: s.type || 'Technical',
    package: s.package ? (s.package.toLowerCase().includes('lpa') ? s.package : `${s.package} LPA`) : 'Best in Industry',
    photo: s.photo || s.pic || `assets/img/person/person-m-${(idx % 6) + 9}.webp`,
  };
};

export default function PlacementSection() {
  const dispatch = useDispatch();
  const rawState = useSelector((state) => state.PlacedStudentStateData);

  useEffect(() => {
    dispatch(getPlacedStudent());
  }, [dispatch]);

  const placedStudents = useMemo(() => {
    const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
    if (list.length > 0) {
      return list.map((item, idx) => normalizePlacedStudent(item, idx)).filter(Boolean);
    }
    return FALLBACK_PLACED_STUDENTS;
  }, [rawState]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section id="placements" className="placement-section compact-placement section dark-background py-5" ref={sectionRef}>
      
      {/* ── Background Glow Blobs ── */}
      <div className="placement-blob blob-1" aria-hidden="true" />
      <div className="placement-blob blob-2" aria-hidden="true" />

      {/* ── Section Header ── */}
      <div className="container placement-header d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
        <motion.div
          className="placement-header-text"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="placement-eyebrow mb-2">
            <i className="bi bi-award-fill me-1"></i> Placement Record
          </span>
          <h2 className="mb-1">
            Top <span className="placement-gradient-text">Placements & Success</span>
          </h2>
        </motion.div>

        {/* Carousel Navigation Arrows */}
        <div className="placement-carousel-nav d-none d-md-flex gap-2">
          <motion.button
            ref={prevRef}
            className="placement-nav-btn compact-nav-btn"
            aria-label="Previous placed students"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <i className="bi bi-arrow-left"></i>
          </motion.button>
          <motion.button
            ref={nextRef}
            className="placement-nav-btn compact-nav-btn"
            aria-label="Next placed students"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <i className="bi bi-arrow-right"></i>
          </motion.button>
        </div>
      </div>

      {/* ── Essential Placement Statistics Bar (Desktop Grid & Mobile Swiper) ── */}
      <div className="container mb-4">
        {/* Desktop Grid */}
        <motion.div
          className="placement-stats-grid compact-stats d-none d-md-grid"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          {PLACEMENT_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              className="placement-stat-card compact-stat-card text-center py-3"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-icon-wrapper compact-icon mx-auto mb-1">
                <i className={stat.icon}></i>
              </div>
              <h3 className="stat-value compact-value mb-0">{stat.value}</h3>
              <p className="stat-label compact-label mb-0">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Swiper Ticker Carousel */}
        <div className="d-block d-md-none">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={2}
            spaceBetween={10}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="placement-stats-swiper"
          >
            {PLACEMENT_STATS.map((stat) => (
              <SwiperSlide key={stat.label}>
                <div className="placement-stat-card compact-stat-card text-center py-2 px-2 h-100">
                  <div className="stat-icon-wrapper compact-icon mx-auto mb-1">
                    <i className={stat.icon}></i>
                  </div>
                  <h3 className="stat-value compact-value mb-0">{stat.value}</h3>
                  <p className="stat-label compact-label mb-0">{stat.label}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── Placed Students Swiper Carousel ── */}
      <div className="container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          speed={600}
          spaceBetween={18}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ el: '.placement-carousel-pagination', clickable: true }}
          navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 8 },
            576: { slidesPerView: 2, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 18 },
          }}
          className="placement-swiper"
        >
          {placedStudents.map((student, idx) => (
            <SwiperSlide key={student.id}>
              <motion.div
                className="student-glass-card compact-student-card h-100 d-flex flex-column justify-content-between p-3"
                initial={{ opacity: 0, y: 25, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
              >
                <div>
                  {/* Header Row: Track Badge */}
                  <div className="card-top-bar d-flex justify-content-end mb-2">
                    <span className={`track-badge ${(student.type || 'technical').toLowerCase()}`}>
                      {student.type}
                    </span>
                  </div>

                  {/* Student Avatar & Info */}
                  <div className="student-profile text-center mb-2">
                    <div className="avatar-ring compact-avatar mx-auto mb-2">
                      <motion.img
                        src={student.photo}
                        alt={student.name}
                        className="student-avatar"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <h4 className="student-name compact-name mb-0">{student.name}</h4>
                    <p className="student-role compact-role mb-0">{student.role}</p>
                  </div>

                  {/* Company & Package Info */}
                  <div className="placement-details-box compact-details-box p-2 rounded-3 text-center">
                    <div className="company-name-row d-flex align-items-center justify-content-center gap-1 mb-1">
                      <i className={`${student.companyIcon} company-icon`}></i>
                      <span className="company-name compact-company">{student.company}</span>
                    </div>
                    <div className="package-tag compact-package d-inline-block fw-bold">
                      <i className="bi bi-cash-stack me-1"></i> CTC: {student.package}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="swiper-pagination placement-carousel-pagination mt-3"></div>
      </div>

      {/* ── Professional Placement CTA ── */}
      <div className="container mt-3">
        <motion.div
          className="placement-cta-banner compact-cta-banner text-center p-3 rounded-4"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
            <div>
              <h4 className="cta-headline compact-cta-title mb-1">Ready To Be Our Next Success Story?</h4>
              <p className="cta-description compact-cta-desc mb-0">
                Enroll in our career programs with 100% placement support & hiring referrals.
              </p>
            </div>

            <motion.button
              type="button"
              className="btn-placement-cta compact-cta-btn d-inline-flex align-items-center gap-2 flex-shrink-0"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              <span>Apply For Placement Drive</span>
              <i className="bi bi-arrow-right-short fs-4"></i>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── PLACEMENT MODAL ── */}
      <PlacementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </section>
  );
}