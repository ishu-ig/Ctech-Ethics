import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getTeams } from '../Redux/ActionCreators/TeamsActionCreators';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK_TEAM = [
  {
    id: 1,
    image: 'assets/img/person/person-m-7.webp',
    name: 'Walter White',
    role: 'Director',
    badge: 'Executive',
    bio: '10+ years driving digital transformation, tech innovation, and enterprise cloud solutions.',
    skills: ['Strategy', 'Leadership', 'Cloud'],
    social: { twitter: '#', facebook: '#', instagram: '#', linkedin: '#' }
  },
  {
    id: 2,
    image: 'assets/img/person/person-f-8.webp',
    name: 'Sarah Johnson',
    role: 'Head of Product & UX',
    badge: 'Product & Design',
    bio: 'Specialist in user-centric design systems, mobile product growth, and customer experience.',
    skills: ['Figma', 'UI/UX', 'Product'],
    social: { twitter: '#', facebook: '#', instagram: '#', linkedin: '#' }
  },
  {
    id: 3,
    image: 'assets/img/person/person-m-6.webp',
    name: 'William Anderson',
    role: 'Chief Technology Officer',
    badge: 'Engineering',
    bio: 'Architecting high-scale cloud infrastructure, AI integrations, and microservices.',
    skills: ['Node.js', 'AWS', 'System Design'],
    social: { twitter: '#', facebook: '#', instagram: '#', linkedin: '#' }
  },
  {
    id: 4,
    image: 'assets/img/person/person-f-4.webp',
    name: 'Amanda Jepson',
    role: 'Operations & Lead Trainer',
    badge: 'Operations',
    bio: 'Empowering next-gen developers through hands-on full-stack mentorship and operational excellence.',
    skills: ['React', 'Mentorship', 'Agile'],
    social: { twitter: '#', facebook: '#', instagram: '#', linkedin: '#' }
  }
];

const normalizeTeamMember = (m, idx) => {
  if (!m) return null;
  return {
    id: m._id || m.id || `team-${idx}`,
    image: m.image || m.pic || `assets/img/person/person-m-${(idx % 4) + 6}.webp`,
    name: m.name || 'Team Member',
    role: m.role || 'Senior Specialist',
    badge: m.badge || 'Expert',
    bio: m.bio || 'Delivering high-impact software solutions and engineering excellence.',
    skills: Array.isArray(m.skills) && m.skills.length > 0 ? m.skills : ['Engineering', 'Leadership'],
    social: {
      twitter: m.social?.twitter || '#',
      facebook: m.social?.facebook || '#',
      instagram: m.social?.instagram || '#',
      linkedin: m.social?.linkedin || '#'
    }
  };
};

export default function Team() {
  const dispatch = useDispatch();
  const rawState = useSelector((state) => state.TeamsStateData);

  useEffect(() => {
    dispatch(getTeams());
  }, [dispatch]);

  // Normalize all team data
  const allTeamMembers = useMemo(() => {
    const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
    if (list.length > 0) {
      return list.map((item, idx) => normalizeTeamMember(item, idx)).filter(Boolean);
    }
    return FALLBACK_TEAM;
  }, [rawState]);

  // Find the Director — strict exact match on role
  const director = useMemo(() => {
    return allTeamMembers.find((m) => m.role === 'Director');
  }, [allTeamMembers]);

  // Filter out the director so they don't repeat in the carousel
  const carouselTeam = useMemo(() => {
    if (!director) return allTeamMembers;
    return allTeamMembers.filter((m) => m.id !== director.id);
  }, [allTeamMembers, director]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section id="team" className="team section" ref={sectionRef}>

      {/* ── Section Header ── */}
      <div className="container team-header mb-4">
        <motion.div
          className="team-header-text text-center mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '700px' }}
        >
          <span className="team-eyebrow">
            <i className="bi bi-people-fill me-1"></i> Our Leadership & Experts
          </span>
          <h2>
            Meet Our <span className="team-gradient-text">Team</span>
          </h2>
          <p>Passionate tech leaders, product strategists, and senior mentors dedicated to delivering high-impact software solutions and training.</p>
        </motion.div>
      </div>

      <div className="container">

        {/* ── Director Spotlight Card (Centered Outside Carousel) ── */}
        {director && (
          <div className="director-spotlight-wrap mb-5 pb-4">
            <motion.div
              className="director-card"
              initial={{ opacity: 0, y: 45, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image Section */}
              <div className="director-pic-wrap">
                <motion.img
                  src={director.image}
                  className="director-img"
                  alt={director.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <span className="director-badge">{director.badge}</span>
              </div>

              {/* Info Section */}
              <div className="director-info-body">
                <span className="director-eyebrow">Leadership</span>
                <h3 className="director-name">{director.name}</h3>
                <span className="director-title">{director.role}</span>
                <p className="director-bio">{director.bio}</p>

                {/* Expertise Skills */}
                <div className="director-skills d-flex flex-wrap gap-2 mb-3">
                  {director.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="skill-chip"
                      whileHover={{ scale: 1.08, y: -1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="social-links d-flex align-items-center">
                  <motion.a href={director.social.twitter} aria-label="Twitter" whileHover={{ scale: 1.18, rotate: 6, y: -2 }}>
                    <i className="bi bi-twitter-x"></i>
                  </motion.a>
                  <motion.a href={director.social.facebook} aria-label="Facebook" whileHover={{ scale: 1.18, rotate: -6, y: -2 }}>
                    <i className="bi bi-facebook"></i>
                  </motion.a>
                  <motion.a href={director.social.instagram} aria-label="Instagram" whileHover={{ scale: 1.18, rotate: 6, y: -2 }}>
                    <i className="bi bi-instagram"></i>
                  </motion.a>
                  <motion.a href={director.social.linkedin} aria-label="LinkedIn" whileHover={{ scale: 1.18, rotate: -6, y: -2 }}>
                    <i className="bi bi-linkedin"></i>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Core Team Header & Navigation ── */}
        {carouselTeam.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h4 fw-bold mb-0">Core Experts</h3>

            {/* Swiper Navigation Buttons */}
            <div className="team-carousel-nav d-none d-md-flex">
              <motion.button
                ref={prevRef}
                className="team-nav-btn"
                aria-label="Previous team members"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
              >
                <i className="bi bi-arrow-left"></i>
              </motion.button>
              <motion.button
                ref={nextRef}
                className="team-nav-btn ms-2"
                aria-label="Next team members"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
              >
                <i className="bi bi-arrow-right"></i>
              </motion.button>
            </div>
          </div>
        )}

        {/* ── Team Carousel ── */}
        {carouselTeam.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            speed={600}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            slidesPerView={1}
            spaceBetween={28}
            pagination={{ el: '.team-carousel-pagination', clickable: true }}
            navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              992: { slidesPerView: 3, spaceBetween: 24 }
            }}
            className="team-carousel"
          >
            {carouselTeam.map((member, idx) => (
              <SwiperSlide key={member.id}>
                <motion.div
                  className="team-member-card h-100"
                  initial={{ opacity: 0, y: 45, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                >
                  {/* Image Section */}
                  <div className="member-pic-wrap">
                    <motion.img
                      src={member.image}
                      className="img-fluid member-img"
                      alt={member.name}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    <span className="member-role-badge">{member.badge}</span>
                  </div>

                  {/* Info Section */}
                  <div className="member-info-body d-flex flex-column h-100">
                    <h4 className="member-name">{member.name}</h4>
                    <span className="member-title">{member.role}</span>
                    <p className="member-bio">{member.bio}</p>

                    {/* Expertise Skills */}
                    <div className="member-skills d-flex flex-wrap gap-1 mb-3 mt-auto">
                      {member.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          className="skill-chip"
                          whileHover={{ scale: 1.08, y: -1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="social-links d-flex align-items-center">
                      <motion.a href={member.social.twitter} aria-label="Twitter" whileHover={{ scale: 1.18, rotate: 6, y: -2 }}>
                        <i className="bi bi-twitter-x"></i>
                      </motion.a>
                      <motion.a href={member.social.facebook} aria-label="Facebook" whileHover={{ scale: 1.18, rotate: -6, y: -2 }}>
                        <i className="bi bi-facebook"></i>
                      </motion.a>
                      <motion.a href={member.social.instagram} aria-label="Instagram" whileHover={{ scale: 1.18, rotate: 6, y: -2 }}>
                        <i className="bi bi-instagram"></i>
                      </motion.a>
                      <motion.a href={member.social.linkedin} aria-label="LinkedIn" whileHover={{ scale: 1.18, rotate: -6, y: -2 }}>
                        <i className="bi bi-linkedin"></i>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Custom Pagination */}
        <div className="swiper-pagination team-carousel-pagination mt-4"></div>

      </div>

    </section>
  );
}