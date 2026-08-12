import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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

      {/* ── Section Header ── */}
      <div className="container blog-header">
        <motion.div
          className="blog-header-text"
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="blog-eyebrow">
            <i className="bi bi-journal-text me-1"></i> Insights, News & Culture
          </span>
          <h2>
            Recent <span className="blog-gradient-text">Articles</span>
          </h2>
          <p className="blog-header-desc">Explore expert articles on modern software engineering, company culture, leadership, and career growth.</p>
        </motion.div>

        <div className="blog-carousel-nav d-none d-md-flex">
          <motion.button
            ref={prevRef}
            className="blog-nav-btn"
            aria-label="Previous posts"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <i className="bi bi-arrow-left"></i>
          </motion.button>
          <motion.button
            ref={nextRef}
            className="blog-nav-btn"
            aria-label="Next posts"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <i className="bi bi-arrow-right"></i>
          </motion.button>
        </div>
      </div>

      {/* ── Blog Carousel ── */}
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          speed={650}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          slidesPerView={1}
          spaceBetween={28}
          pagination={{ el: '.blog-posts-carousel-pagination', clickable: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 18 },
            992: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="blog-posts-carousel"
        >
          {posts.map((post, idx) => (
            <SwiperSlide key={post.id}>
              <BlogCard post={post} index={idx} inView={inView} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="d-flex justify-content-center w-100 mt-4">
          <div className="blog-pagination-pill-track">
            <div className="swiper-pagination blog-posts-carousel-pagination"></div>
          </div>
        </div>
      </div>

    </section>
  );
}