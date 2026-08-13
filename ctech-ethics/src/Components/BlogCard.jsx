import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * BlogCard
 * Single source of truth for how a blog post is rendered as a card.
 * Used by:
 *  - BlogCarousel.jsx  (homepage "Recent Blog Posts" swiper)
 *  - BlogPage.jsx       (full blog grid, "Read More" / Load More)
 *  - BlogDetailsPage.jsx (Related Articles section)
 *
 * Expects a `post` shaped like:
 * {
 *   id | _id, slug, image, date, readTime, title, summary,
 *   author, authorRole, category, categoryColor
 * }
 *
 * Responsive behavior:
 *  - Below 576px (phones): only image, category badge, title, and the
 *    "Read Article" link are shown. Summary, date, read-time badge, and
 *    author info are hidden to keep 2-up mobile cards compact.
 *  - 576px and up: full card content is shown.
 */
export default function BlogCard({ post, index = 0, inView = true }) {
    if (!post) return null;

    const {
        id,
        _id,
        slug,
        image,
        date,
        createdAt,
        readTime = '5 min read',
        title,
        summary,
        author,
        authorRole,
        category,
        categoryColor = '#47b2e4',
    } = post;

    const link = `/blog/${slug || id || _id}`;

    // Format author object vs string
    const authorName = typeof author === 'object' && author?.name ? author.name : (typeof author === 'string' ? author : 'CTech Team');
    const authorRoleStr = typeof author === 'object' && author?.role ? author.role : (authorRole || '');
    const authorAvatar = typeof author === 'object' && author?.avatar ? author.avatar : null;

    // Format date string
    const formattedDate = date || (createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Aug 2026");

    return (
        <motion.div
            className="post-item position-relative h-100"
            initial={{ opacity: 0, y: 44, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.58, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
        >
            {/* Top accent shimmer bar */}
            <div
                className="post-accent-bar"
                style={{ background: `linear-gradient(90deg, ${categoryColor}, #a855f7)` }}
            />

            {/* Post Image */}
            <div className="post-img position-relative overflow-hidden">
                <motion.img
                    src={image || 'assets/img/blog/blog-post-1.webp'}
                    className="img-fluid"
                    alt={title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                />

                {category && (
                    <span className="post-category-badge" style={{ background: categoryColor }}>
                        {category}
                    </span>
                )}

                {readTime && (
                    <div className="post-meta-tag d-none d-sm-flex">
                        <i className="bi bi-clock me-1"></i>{readTime}
                    </div>
                )}
            </div>

            {/* Post Body */}
            <div className="post-content d-flex flex-column h-100 p-4">
                {formattedDate && (
                    <div className="post-date-text text-muted mb-2 small d-none d-sm-block">
                        <i className="bi bi-calendar3 me-1"></i>{formattedDate}
                    </div>
                )}

                <h3 className="post-title mb-2">{title}</h3>

                {summary && <p className="post-summary mb-3 d-none d-sm-block">{summary}</p>}

                {/* Author & Action Bar */}
                <div className="post-author-bar d-flex align-items-center justify-content-between mt-auto pt-3">
                    <div className="author-info d-none d-sm-flex align-items-center gap-2">
                        {authorAvatar ? (
                            <img src={authorAvatar} alt={authorName} className="author-avatar rounded-circle" style={{ width: 26, height: 26, objectFit: 'cover' }} />
                        ) : (
                            <div className="author-avatar">
                                <i className="bi bi-person-fill"></i>
                            </div>
                        )}
                        <div>
                            <span className="author-name d-block">{authorName}</span>
                            {authorRoleStr && <span className="author-role d-block">{authorRoleStr}</span>}
                        </div>
                    </div>

                    <Link to={link} className="readmore stretched-link">
                        <span>Read Article</span>
                        <motion.i
                            className="bi bi-arrow-right ms-1 d-none d-sm-inline"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}