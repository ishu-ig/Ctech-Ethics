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

/* Shown only while the first GET is in flight, or if every tech stack entry
   is deleted/deactivated, so the section never renders empty. Also usable
   as an explicit override via the `items` prop for one-off pages. */
export const DEFAULT_TECH_STACK = [
    { name: 'React', icon: 'fa-brands fa-react', color: '#0ea5e9' },
    { name: 'Next.js', icon: 'fa-brands fa-node-js', color: 'currentColor' },
    { name: 'Node.js', icon: 'fa-brands fa-node-js', color: '#16a34a' },
    { name: 'Express.js', icon: 'fa-solid fa-server', color: '#64748b' },
    { name: 'MongoDB', icon: 'fa-solid fa-database', color: '#15803d' },
    { name: 'MySQL', icon: 'fa-solid fa-database', color: '#0284c7' },
    { name: 'React Native', icon: 'fa-solid fa-mobile-screen', color: '#0ea5e9' },
    { name: 'Flutter', icon: 'fa-solid fa-mobile-screen', color: '#0284c7' },
    { name: 'Python', icon: 'fa-brands fa-python', color: '#2563eb' },
    { name: 'Firebase', icon: 'fa-solid fa-fire', color: '#f59e0b' },
    { name: 'AWS', icon: 'fa-brands fa-aws', color: '#ea580c' },
    { name: 'Docker', icon: 'fa-brands fa-docker', color: '#2563eb' },
    { name: 'GitHub', icon: 'fa-brands fa-github', color: 'currentColor' },
    { name: 'OpenAI', icon: 'fa-solid fa-brain', color: '#10b981' },
    { name: 'Figma', icon: 'fa-brands fa-figma', color: '#f43f5e' },
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
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>
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
    sectionClassName = "container-xxl p-5",
    cardClassName = ""
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
        <section className={`tech-stack-section ${sectionClassName}`}>
            <div className="container">
                <div className="text-center mb-5">
                    <TechEyebrow>{eyebrow}</TechEyebrow>
                    <h2 className="tech-stack-title">
                        {title}
                    </h2>
                    {description && (
                        <p className="tech-stack-desc">
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
                        {items.map((item, idx) => {
                            const iconClass = item.icon?.includes(' ') ? item.icon : `fa-brands ${item.icon}`;
                            const isWhiteOrBlack = !item.color || item.color === '#ffffff' || item.color === '#fff' || item.color === '#000000' || item.color === '#000';
                            const iconColor = isWhiteOrBlack ? 'currentColor' : item.color;

                            return (
                                <SwiperSlide key={item._id || item.name || idx} className="h-auto">
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.05 }}
                                        className={`tech-stack-card ${cardClassName}`}
                                    >
                                        <i
                                            className={`${iconClass} tech-stack-icon`}
                                            style={{
                                                color: iconColor,
                                                fontSize: '2.3rem',
                                                marginBottom: '8px'
                                            }}
                                        />
                                        <span className="tech-stack-name">
                                            {item.name}
                                        </span>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
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