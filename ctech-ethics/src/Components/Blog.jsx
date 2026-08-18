import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { getBlog } from '../Redux/ActionCreators/BlogActionCreators';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK_POSTS = [
  {
    id: 1,
    image: 'assets/img/blog/blog-post-1.webp',
    date: 'Aug 02, 2026',
    readTime: '5 min read',
    title: 'Building Scalable Web Architecture with Next.js & React 19',
    summary: 'Explore modern server components, streaming SSR, and performance optimizations for enterprise web applications.',
    author: 'Alex Rivera',
    authorRole: 'Tech Lead',
    category: 'Engineering',
    categoryColor: '#47b2e4',
  },
  {
    id: 2,
    image: 'assets/img/blog/blog-post-2.webp',
    date: 'Jul 28, 2026',
    readTime: '7 min read',
    title: 'Fostering a Culture of Innovation in Remote-First Teams',
    summary: 'How we maintain morale, creativity, and trust across global time zones without sacrificing productivity.',
    author: 'Sarah Jenkins',
    authorRole: 'VP of Operations',
    category: 'Company Culture',
    categoryColor: '#ec4899',
  },
  {
    id: 3,
    image: 'assets/img/blog/blog-post-3.webp',
    date: 'Jul 20, 2026',
    readTime: '4 min read',
    title: 'Zero Trust Cybersecurity Architecture for Cloud Native Infrastructure',
    summary: 'Best practices for securing microservices, IAM access controls, and multi-cloud deployment environments.',
    author: 'Marcus Vance',
    authorRole: 'Security Lead',
    category: 'Engineering',
    categoryColor: '#22d3ee',
  },
  {
    id: 4,
    image: 'assets/img/blog/blog-post-1.webp',
    date: 'Jul 14, 2026',
    readTime: '6 min read',
    title: 'Empathetic Leadership: Guiding Engineering Teams Through Burnout',
    summary: 'Recognizing the signs of developer burnout and restructuring sprint expectations to prioritize mental health.',
    author: 'Elena Rostova',
    authorRole: 'Director of Engineering',
    category: 'Leadership',
    categoryColor: '#f59e0b',
  },
];

export default function Blog() {
  const dispatch = useDispatch();
  const rawState = useSelector((state) => state.BlogStateData);

  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  const posts = useMemo(() => {
    const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
    if (list.length > 0) return list;
    return FALLBACK_POSTS;
  }, [rawState]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section id="recent-blog-postst" className="recent-blog-postst section" ref={sectionRef}>

      {/* ── Section Header (Perfect Centered Alignment) ── */}
      <div className="container blog-header text-center justify-content-center mb-4 mb-md-5">
        <motion.div
          className="blog-header-text text-center mx-auto"
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="blog-eyebrow d-inline-flex justify-content-center align-items-center">
            <i className="bi bi-journal-text me-1"></i> Insights, News & Culture
          </span>
          <h2>
            Recent <span className="blog-gradient-text">Articles</span>
          </h2>
          <p className="blog-header-desc mx-auto" style={{ maxWidth: '640px' }}>
            Explore expert articles on modern software engineering, company culture, leadership, and career growth.
          </p>
        </motion.div>
      </div>

      {/* ── Blog Carousel ── */}
      <div className="container">
        <div className="position-relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={posts.length > 3}
            speed={650}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ el: '.blog-posts-carousel-pagination', clickable: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16, centeredSlides: false },
              600: { slidesPerView: 1.5, spaceBetween: 18, centeredSlides: true },
              768: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
              992: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
            }}
            className="blog-posts-carousel w-100"
          >
            {posts.map((post, idx) => (
              <SwiperSlide key={post._id || post.id || idx} className="h-auto d-flex justify-content-center">
                <div className="w-100 mx-auto" style={{ maxWidth: '100%' }}>
                  <BlogCard post={post} index={idx} inView={inView} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Centered Carousel Navigation & Pagination ── */}
        <div className="d-flex align-items-center justify-content-center gap-3 mt-4 pt-2">
          <motion.button
            ref={prevRef}
            className="blog-nav-btn"
            aria-label="Previous posts"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div className="blog-pagination-pill-track">
            <div className="swiper-pagination blog-posts-carousel-pagination"></div>
          </div>

          <motion.button
            ref={nextRef}
            className="blog-nav-btn"
            aria-label="Next posts"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

    </section>
  );
}