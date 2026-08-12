import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { getTechStack } from '../Redux/ActionCreators/TechStackActionCreators';

const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_HEAD = "'Space Grotesk', sans-serif";

/* Shown only while the first GET is in flight, or if every tech stack entry
   is deleted/deactivated, so the section never renders empty. Also usable
   as an explicit override via the `items` prop for one-off pages. */
export const DEFAULT_TECH_STACK = [
    { name: 'React', icon: 'fa-brands fa-react', color: '#61dafb' },
    { name: 'Next.js', icon: 'fa-brands fa-node-js', color: '#ffffff' },
    { name: 'Node.js', icon: 'fa-brands fa-node-js', color: '#68a063' },
    { name: 'Express.js', icon: 'fa-solid fa-server', color: '#828282' },
    { name: 'MongoDB', icon: 'fa-solid fa-database', color: '#47a248' },
    { name: 'MySQL', icon: 'fa-solid fa-database', color: '#00758f' },
    { name: 'React Native', icon: 'fa-solid fa-mobile', color: '#61dafb' },
    { name: 'Flutter', icon: 'fa-solid fa-mobile-screen', color: '#02569b' },
    { name: 'Python', icon: 'fa-brands fa-python', color: '#3776ab' },
    { name: 'Firebase', icon: 'fa-solid fa-fire', color: '#ffca28' },
    { name: 'AWS', icon: 'fa-brands fa-aws', color: '#ff9900' },
    { name: 'Docker', icon: 'fa-brands fa-docker', color: '#2496ed' },
    { name: 'GitHub', icon: 'fa-brands fa-github', color: '#ffffff' },
    { name: 'OpenAI', icon: 'fa-solid fa-brain', color: '#10a37f' },
    { name: 'Figma', icon: 'fa-brands fa-figma', color: '#f24e1e' },
];

/* ── Internal Eyebrow Component ── */
function TechEyebrow({ children }) {
    return (
        <motion.div
            className="d-inline-flex justify-content-center align-items-center gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6ea8ff' }} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: '#6ea8ff', fontWeight: 'bold' }}>
                {children}
            </span>
        </motion.div>
    );
}

export default function TechStack({
    items: itemsProp,
    eyebrow = "Tech Stack",
    title = "Modern Frameworks & Technologies",
    description = "",
    sectionClassName = "container-xxl p-5", // Default to service page styling
    cardClassName = "svc-glass-card"        // Default to service page cards
}) {
    const dispatch = useDispatch();
    const rawData = useSelector((state) => state.TechStackStateData);
    const TechStackStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    useEffect(() => {
        dispatch(getTechStack());
    }, [dispatch]);

    const activeItems = TechStackStateData.filter((i) => i.status);
    const items = itemsProp || (activeItems.length > 0 ? activeItems : DEFAULT_TECH_STACK);

    return (
        <section className={sectionClassName}>
            <div className="container">
                <div className="text-center mb-5">
                    <TechEyebrow>{eyebrow}</TechEyebrow>
                    <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', color: 'var(--heading-color)', marginBottom: 10 }}>
                        {title}
                    </h2>
                    {description && (
                        <p style={{ color: 'var(--text-muted, rgba(220,230,250,0.65))', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
                            {description}
                        </p>
                    )}
                </div>

                <div className="tech-stack-swiper-wrapper position-relative px-2">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        loop={items.length > 4}
                        autoplay={{
                            delay: 2200,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{ clickable: true, el: '.tech-stack-pagination' }}
                        navigation={{ nextEl: '.tech-stack-next', prevEl: '.tech-stack-prev' }}
                        breakpoints={{
                            480: { slidesPerView: 3, spaceBetween: 16 },
                            640: { slidesPerView: 4, spaceBetween: 18 },
                            992: { slidesPerView: 5, spaceBetween: 20 },
                            1200: { slidesPerView: 6, spaceBetween: 20 },
                        }}
                        className="tech-stack-swiper pb-4"
                    >
                        {items.map((item, idx) => (
                            <SwiperSlide key={item._id || item.name || idx} className="h-auto">
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.05 }}
                                    className={`${cardClassName} p-3 text-center d-flex flex-column align-items-center justify-content-center h-100 tech-stack-card`}
                                    style={{
                                        minHeight: '115px',
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(12px)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <i
                                        className={item.icon.includes(' ') ? item.icon : `fa-brands ${item.icon}`}
                                        style={{
                                            fontSize: '2.2rem',
                                            color: item.color || '#6ea8ff',
                                            marginBottom: '8px',
                                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontFamily: FONT_MONO,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.06em',
                                            fontWeight: 600,
                                            color: 'var(--ink, #ffffff)',
                                            opacity: 0.9
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Controls */}
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                        <button type="button" className="tech-stack-prev swiper-nav-btn" aria-label="Previous tech slide">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="tech-stack-pagination swiper-custom-dots w-auto d-inline-flex" />
                        <button type="button" className="tech-stack-next swiper-nav-btn" aria-label="Next tech slide">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}