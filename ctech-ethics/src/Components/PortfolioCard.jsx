import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Design Tokens ── */
const FONT_HEAD = "'Space Grotesk', sans-serif";

export default function PortfolioCard({ project = {} }) {
    const displayImg = useMemo(() => {
        if (Array.isArray(project.images) && project.images.length > 0) return project.images[0];
        return project.image || 'https://picsum.photos/seed/portfolio/800/600';
    }, [project.images, project.image]);

    const displayDesc = project.desc || project.description || 'Innovative digital solution engineered for performance and scalability.';

    const techStack = useMemo(() => {
        if (Array.isArray(project.tech) && project.tech.length > 0) {
            return project.tech.map((t, idx) => {
                if (typeof t === 'string') {
                    const iconClass = t.startsWith('fa-') || t.startsWith('bi-') ? t : `fa-brands fa-${t}`;
                    return { key: idx, icon: iconClass, color: '#6ea8ff' };
                }
                return { key: idx, icon: t.icon || 'fa-code', color: t.color || '#6ea8ff' };
            });
        }
        return [{ key: 0, icon: 'fa-solid fa-code', color: '#6ea8ff' }];
    }, [project.tech]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="h-100 w-100"
        >
            <motion.div
                whileHover={{ y: -6, borderColor: 'rgba(110, 168, 255, 0.4)' }}
                className="h-100 d-flex flex-column position-relative overflow-hidden portfolio-card-box"
                style={{
                    background: 'rgba(10, 15, 25, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
            >
                {/* ── Image Container ── */}
                <div className="portfolio-card-img-wrap" style={{ overflow: 'hidden', position: 'relative' }}>
                    <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        src={displayImg}
                        alt={project.title || 'Project Image'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Category Overlay Badge */}
                    {project.category && (
                        <div className="portfolio-card-badge" style={{
                            position: 'absolute',
                            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
                            color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                            fontWeight: 600
                        }}>
                            {project.category}
                        </div>
                    )}
                </div>

                {/* ── Content Body ── */}
                <div className="portfolio-card-body d-flex flex-column flex-grow-1">
                    <h3 className="portfolio-card-title mb-2" style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: '#fff' }}>
                        {project.title}
                    </h3>
                    <p className="portfolio-card-desc mb-3 d-none d-sm-block" style={{ color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>
                        {displayDesc}
                    </p>

                    {/* Footer: Tech Stack & Link */}
                    <div className="portfolio-card-footer d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>

                        {/* Tech Stack Icons */}
                        <div className="d-none d-sm-flex gap-2">
                            {techStack.slice(0, 4).map((t) => (
                                <i
                                    key={t.key}
                                    className={t.icon.includes(' ') ? t.icon : `fa-brands ${t.icon}`}
                                    style={{ color: t.color }}
                                    title="Tech Icon"
                                />
                            ))}
                        </div>

                        {/* View Details Link */}
                        <Link
                            to={project.link || "#"}
                            className="portfolio-card-link ms-auto ms-sm-0"
                            style={{ color: '#6ea8ff', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <span>View Case</span>
                            <i className="fa-solid fa-arrow-right" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}