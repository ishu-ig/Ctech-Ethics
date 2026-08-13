import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { getTestimonial } from '../Redux/ActionCreators/TestimonialActionCreators';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    image: 'assets/img/person/person-m-9.webp',
    name: 'Saul Goodman',
    role: 'CEO & Founder',
    company: 'FinTech Innovations',
    rating: 5,
    quote: 'CTech Ethics transformed our core application into a cloud-native microservices platform. Exceptional software architecture, speed, and continuous support!'
  },
  {
    id: 2,
    image: 'assets/img/person/person-f-5.webp',
    name: 'Sara Wilsson',
    role: 'Head of Product',
    company: 'Apex Digital',
    rating: 5,
    quote: 'The full-stack development team shipped our React Native mobile application ahead of schedule with a stunning, high-performance UI/UX design.'
  },
  {
    id: 3,
    image: 'assets/img/person/person-f-12.webp',
    name: 'Jena Karlis',
    role: 'Director of Engineering',
    company: 'RetailCorp Global',
    rating: 5,
    quote: 'Their IT training graduates hired by our team hit the ground running on day one with real project experience. Truly top-tier mentorship!'
  },
  {
    id: 4,
    image: 'assets/img/person/person-m-12.webp',
    name: 'Matt Brandon',
    role: 'Founder',
    company: 'CloudScale Labs',
    rating: 5,
    quote: 'Data-driven marketing and technical SEO campaigns resulted in a 240% increase in qualified inbound leads within just 3 months. Outstanding ROI!'
  },
  {
    id: 5,
    image: 'assets/img/person/person-m-13.webp',
    name: 'John Larson',
    role: 'CTO',
    company: 'HealthTech Solutions',
    rating: 5,
    quote: 'Proactive maintenance, 24/7 cloud monitoring, and security compliance. They keep our production infrastructure running seamlessly with 99.99% uptime.'
  }
];

// Maps the Mongoose Testimonial schema (name, designation, company, message, pic, rating, active)
// into the shape this component renders (name, role, company, quote, image, rating).
const normalizeTestimonial = (t, idx) => {
  if (!t) return null;
  return {
    id: t._id || t.id || `testimonial-${idx}`,
    image: t.pic || t.image || `assets/img/person/person-m-${(idx % 4) + 6}.webp`,
    name: t.name || 'Happy Client',
    role: t.designation || t.role || 'Client',
    company: t.company || '',
    rating: typeof t.rating === 'number' ? t.rating : 5,
    quote: t.message || t.quote || ''
  };
};

export default function Testimonial() {
  const dispatch = useDispatch();
  const rawState = useSelector((state) => state.TestimonialStateData);

  useEffect(() => {
    dispatch(getTestimonial());
  }, [dispatch]);

  // Normalize + filter to active testimonials only (falls back to static data if empty)
  const testimonials = useMemo(() => {
    const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
    const activeList = list.filter((t) => t?.active !== false);
    if (activeList.length > 0) {
      return activeList.map((item, idx) => normalizeTestimonial(item, idx)).filter(Boolean);
    }
    return FALLBACK_TESTIMONIALS;
  }, [rawState]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section id="testimonials" className="testimonials section" ref={sectionRef}>

      {/* ── Section Header ── */}
      <div className="container testimonial-header mb-4 mb-md-5">
        <motion.div
          className="testimonial-header-text text-center mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="testimonial-eyebrow">
            <i className="bi bi-chat-heart-fill me-1"></i> Client Reviews & Feedback
          </span>
          <h2>
            What Our <span className="testimonial-gradient-text">Clients Say</span>
          </h2>
          <p>Discover how our custom software engineering, digital growth strategies, and developer training programs empower clients worldwide.</p>
        </motion.div>

        {/* Carousel Navigation Buttons */}
        {testimonials.length > 0 && (
          <div className="testimonial-carousel-nav d-none d-md-flex">
            <motion.button
              ref={prevRef}
              className="testimonial-nav-btn"
              aria-label="Previous testimonials"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="bi bi-arrow-left"></i>
            </motion.button>
            <motion.button
              ref={nextRef}
              className="testimonial-nav-btn"
              aria-label="Next testimonials"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="bi bi-arrow-right"></i>
            </motion.button>
          </div>
        )}
      </div>

      {/* ── Testimonial Swiper ── */}
      <div className="container">
        {testimonials.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            speed={600}
            spaceBetween={24}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ el: '.testimonial-carousel-pagination', clickable: true }}
            navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 24 }
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((item, idx) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  className="testimonial-card-item h-100 position-relative p-4"
                  initial={{ opacity: 0, y: 35, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Top Accent Rainbow Line */}
                  <div className="testimonial-card-accent-bar" />

                  {/* Header: Avatar & Info */}
                  <div className="testimonial-profile d-flex align-items-center mb-3">
                    <div className="avatar-wrap flex-shrink-0">
                      <motion.img
                        src={item.image}
                        className="testimonial-img"
                        alt={item.name}
                        whileHover={{ scale: 1.12 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="ms-3 overflow-hidden">
                      <h3 className="profile-name mb-1 text-truncate">{item.name}</h3>
                      <h4 className="profile-role mb-0 text-truncate">
                        {item.role}{item.company ? <> • <span className="company-tag">{item.company}</span></> : null}
                      </h4>
                    </div>
                  </div>

                  {/* Stars Rating */}
                  <div className="stars mb-3 d-flex gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <motion.i
                        key={i}
                        className="bi bi-star-fill star-icon"
                        whileHover={{ scale: 1.3, rotate: 14 }}
                      />
                    ))}
                  </div>

                  {/* Quote Content */}
                  <div className="quote-body">
                    <i className="bi bi-quote quote-icon-left"></i>
                    <p className="quote-text mb-0">{item.quote}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Custom Pagination */}
        <div className="testimonial-pagination-wrap">
          <div className="testimonial-pagination-pill-track">
            <div className="swiper-pagination testimonial-carousel-pagination"></div>
          </div>
        </div>
      </div>

    </section>
  );
}