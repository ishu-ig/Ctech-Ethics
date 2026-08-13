import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlogCard from '../Components/BlogCard';
import { getBlog } from '../Redux/ActionCreators/BlogActionCreators';

/* ── Fallback categories shown before real data loads ── */
const FALLBACK_CATEGORIES = [
    'All',
    'Web Development',
    'AI',
    'Digital Marketing',
    'SEO',
    'Mobile Apps',
    'UI/UX',
    'Career',
    'Placement',
    'Company News',
];

const CATEGORY_ICONS = {
    'All': 'bi-grid-fill',
    'Web Development': 'bi-code-slash',
    'AI': 'bi-cpu-fill',
    'Digital Marketing': 'bi-megaphone-fill',
    'SEO': 'bi-graph-up-arrow',
    'Mobile Apps': 'bi-phone-fill',
    'UI/UX': 'bi-palette-fill',
    'Career': 'bi-briefcase-fill',
    'Placement': 'bi-trophy-fill',
    'Company News': 'bi-newspaper',
};

/* ── Fallback data if Redux store is empty / API not reachable ── */
const POSTS = [
    {
        id: 1,
        slug: 'scalable-web-architecture-nextjs-react19',
        image: 'assets/img/blog/blog-post-1.webp',
        date: 'Aug 02, 2026',
        readTime: '5 min read',
        title: 'Building Scalable Web Architecture with Next.js & React 19',
        summary: 'Explore modern server components, streaming SSR, and performance optimizations for enterprise web applications.',
        author: 'Alex Rivera',
        authorRole: 'Tech Lead',
        category: 'Web Development',
        categoryColor: '#47b2e4',
        featured: true,
    },
    {
        id: 2,
        slug: 'generative-ai-enterprise-saas',
        image: 'assets/img/blog/blog-post-2.webp',
        date: 'Jul 28, 2026',
        readTime: '7 min read',
        title: 'Integrating Generative AI into Enterprise SaaS Applications',
        summary: 'How leading startups use LLMs, RAG pipelines, and vector databases to power next-gen AI customer experiences.',
        author: 'Sophia Chen',
        authorRole: 'AI Engineer',
        category: 'AI',
        categoryColor: '#a855f7',
        featured: false,
    },
    {
        id: 3,
        slug: 'zero-trust-cybersecurity-cloud-native',
        image: 'assets/img/blog/blog-post-3.webp',
        date: 'Jul 20, 2026',
        readTime: '4 min read',
        title: 'Zero Trust Cybersecurity Architecture for Cloud Native Infrastructure',
        summary: 'Best practices for securing microservices, IAM access controls, and multi-cloud deployment environments.',
        author: 'Marcus Vance',
        authorRole: 'Security Lead',
        category: 'Web Development',
        categoryColor: '#22d3ee',
        featured: false,
    },
    {
        id: 4,
        slug: 'fostering-innovation-remote-teams',
        image: 'assets/img/blog/blog-post-1.webp',
        date: 'Jul 14, 2026',
        readTime: '6 min read',
        title: 'Fostering a Culture of Innovation in Remote-First Teams',
        summary: 'Non-technical strategies for leadership: how to maintain team morale, creativity, and trust across time zones.',
        author: 'Elena Rostova',
        authorRole: 'Head of People',
        category: 'Career',
        categoryColor: '#f59e0b',
    },
    {
        id: 5,
        slug: 'seo-technical-audit-checklist-2026',
        image: 'assets/img/blog/blog-post-2.webp',
        date: 'Jul 08, 2026',
        readTime: '8 min read',
        title: 'The Technical SEO Audit Checklist Every Growing Site Needs',
        summary: 'Core Web Vitals, crawl budget, structured data — the technical levers that actually move rankings in 2026.',
        author: 'Priya Nair',
        authorRole: 'SEO Strategist',
        category: 'SEO',
        categoryColor: '#10b981',
    },
    {
        id: 6,
        slug: 'mobile-app-onboarding-that-converts',
        image: 'assets/img/blog/blog-post-3.webp',
        date: 'Jun 30, 2026',
        readTime: '5 min read',
        title: 'Designing Mobile Onboarding Flows That Actually Convert',
        summary: 'A breakdown of onboarding patterns from top-rated apps, and what to test first on your own funnel.',
        author: 'Daniel Osei',
        authorRole: 'Product Designer',
        category: 'Mobile Apps',
        categoryColor: '#ec4899',
    },
    {
        id: 7,
        slug: 'ui-ux-design-systems-2026',
        image: 'assets/img/blog/blog-post-1.webp',
        date: 'Jun 22, 2026',
        readTime: '6 min read',
        title: 'Building a Design System That Survives Real Product Teams',
        summary: 'Tokens, components, and governance — how to keep a design system alive past the first sprint.',
        author: 'Lena Fischer',
        authorRole: 'UI/UX Lead',
        category: 'UI/UX',
        categoryColor: '#6366f1',
    },
    {
        id: 8,
        slug: 'from-intern-to-engineer-career-guide',
        image: 'assets/img/blog/blog-post-2.webp',
        date: 'Jun 12, 2026',
        readTime: '4 min read',
        title: 'From Intern to Engineer: A Practical First-Year Career Guide',
        summary: 'What actually gets interns hired full-time, based on two years of placement data at CTech.',
        author: 'Rahul Mehta',
        authorRole: 'Talent Partner',
        category: 'Career',
        categoryColor: '#38bdf8',
    },
    {
        id: 9,
        slug: 'ctech-2026-hiring-partners-update',
        image: 'assets/img/blog/blog-post-3.webp',
        date: 'Jun 02, 2026',
        readTime: '3 min read',
        title: "CTech's 2026 Placement Report: New Hiring Partners Onboard",
        summary: 'A look at the companies joining our placement network this year and what it means for students.',
        author: 'CTech Team',
        authorRole: 'Company News',
        category: 'Company News',
        categoryColor: '#a855f7',
    },
];

const PAGE_SIZE = 6;

// Consistent identity helper — real API data will have _id (Mongo),
// fallback data has id. Never rely on `.id` alone.
const getPostId = (post) => post?._id || post?.id;

/* ── Mobile responsive CSS, embedded directly in this file ── */
const MOBILE_BLOG_CSS = `
/* Compact blog cards on phones (2-up grid) */
@media (max-width: 575.98px) {
  .blog-cards-row.row.g-4 {
    --bs-gutter-x: 0.75rem;
    --bs-gutter-y: 0.75rem;
  }
  .post-content {
    padding: 14px !important;
  }
  .post-title {
    font-size: 0.92rem;
    line-height: 1.3;
    margin-bottom: 6px !important;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .post-category-badge {
    font-size: 0.62rem;
    padding: 3px 8px;
  }
  .post-author-bar {
    padding-top: 8px !important;
  }
  .readmore {
    font-size: 0.8rem;
  }
}
`;

export default function BlogPage() {
    const dispatch = useDispatch();

    // NOTE: adjust `state.BlogStateData` to match whatever key your
    // blog reducer is actually mounted under in your root reducer —
    // mirrors the `state.PortfolioStateData` convention used on the
    // Portfolio page. If your reducer uses a different key, this will
    // silently fall back to the static POSTS array below.
    const rawState = useSelector((state) => state.BlogStateData);

    useEffect(() => {
        dispatch(getBlog());
    }, [dispatch]);

    // Accepts either a raw array or a { data: [...] } shaped response.
    const postsData = useMemo(() => {
        const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
        if (list.length > 0) return list;
        return POSTS;
    }, [rawState]);

    // Categories derived from whatever data is actually loaded, falling
    // back to the static list before the API responds.
    const CATEGORIES = useMemo(() => {
        const unique = [...new Set(postsData.map((p) => p.category).filter(Boolean))];
        return unique.length > 0 ? ['All', ...unique] : FALLBACK_CATEGORIES;
    }, [postsData]);

    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);


    // Reset filter if it no longer exists once real data replaces fallback data.
    useEffect(() => {
        if (!CATEGORIES.includes(activeCategory)) {
            setActiveCategory('All');
        }
    }, [CATEGORIES, activeCategory]);

    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: '-40px' });
    const gridRef = useRef(null);
    const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

    const featuredPost = useMemo(
        () => postsData.find((p) => p.featured) || postsData[0],
        [postsData]
    );

    const filteredPosts = useMemo(() => {
        if (!featuredPost) return [];
        return postsData.filter((p) => {
            if (getPostId(p) === getPostId(featuredPost)) return false;
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesQuery =
                !query.trim() ||
                p.title?.toLowerCase().includes(query.toLowerCase()) ||
                p.summary?.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });
    }, [postsData, query, activeCategory, featuredPost]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPosts.length;



    return (
        <div className="blog-page">
            <style>{MOBILE_BLOG_CSS}</style>

            {/* ══════════════ HERO ══════════════ */}
            <section className="blog-page-hero section" ref={heroRef}>
                <div className="container">
                    <motion.div
                        className="blog-page-hero-inner"
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="blog-eyebrow">
                            <i className="bi bi-journal-text me-1"></i> The CTech Blog
                        </span>
                        <h1 className="blog-page-hero-title">
                            Insights & <span className="blog-gradient-text">Resources</span>
                        </h1>
                        <p className="blog-page-hero-desc">
                            Practical articles on web development, AI, SEO, design, and career growth —
                            written by the engineers and strategists who build at CTech Ethic Solution.
                        </p>

                        <form
                            className="blog-search-bar"
                            onSubmit={(e) => e.preventDefault()}
                            role="search"
                            aria-label="Search articles"
                        >
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Search articles, topics, or authors…"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setVisibleCount(PAGE_SIZE);
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    className="blog-search-clear"
                                    aria-label="Clear search"
                                    onClick={() => setQuery('')}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </form>

                        {/* Category Popup Trigger Button */}
                        <div className="blog-cat-trigger-bar text-center mt-4">
                            <button
                                type="button"
                                className="blog-cat-modal-btn"
                                onClick={() => setIsCatModalOpen(true)}
                            >
                                <i className="bi bi-grid-3x3-gap-fill me-1"></i>
                                <span>Browse Categories</span>
                                <span className="active-chip">{activeCategory}</span>
                                <i className="bi bi-chevron-down ms-1"></i>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════ CATEGORY POPUP MODAL ══════════════ */}
            <AnimatePresence>
                {isCatModalOpen && (
                    <div className="cjd-modal-overlay" onClick={() => setIsCatModalOpen(false)}>
                        <motion.div
                            className="cjd-modal-card blog-cat-popup-modal"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 15 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="cjd-modal-accent" />
                            <button
                                type="button"
                                className="cjd-modal-close"
                                onClick={() => setIsCatModalOpen(false)}
                                aria-label="Close modal"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                            <div className="cjd-modal-header mb-3">
                                <span className="cjd-modal-eyebrow">
                                    <i className="bi bi-tag-fill me-1"></i> Topics & Categories
                                </span>
                                <h3 className="cjd-modal-title">Select a Category</h3>
                                <p className="cjd-modal-sub text-muted">
                                    Filter articles by your area of interest ({CATEGORIES.length} topics available)
                                </p>
                            </div>

                            <div className="blog-cat-popup-grid">
                                {CATEGORIES.map((cat) => {
                                    const count = cat === 'All'
                                        ? postsData.length
                                        : postsData.filter((p) => p.category === cat).length;
                                    const icon = CATEGORY_ICONS[cat] || 'bi-bookmark-fill';
                                    const isActive = activeCategory === cat;

                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            className={`blog-cat-popup-item ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setVisibleCount(PAGE_SIZE);
                                                setIsCatModalOpen(false);
                                            }}
                                        >
                                            <div className="cat-item-left">
                                                <div className="cat-item-icon">
                                                    <i className={`bi ${icon}`}></i>
                                                </div>
                                                <div className="cat-item-text">
                                                    <span className="cat-item-name">{cat}</span>
                                                    <span className="cat-item-count">{count} {count === 1 ? 'article' : 'articles'}</span>
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="cat-item-check">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ══════════════ FEATURED POST ══════════════ */}
            {!query && activeCategory === 'All' && featuredPost && (
                <section className="blog-featured section pt-0">
                    <div className="container">
                        <motion.div
                            className="blog-featured-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="blog-featured-img">
                                <img src={featuredPost.image} alt={featuredPost.title} />
                                <span className="blog-featured-badge">
                                    <i className="bi bi-star-fill me-1"></i> Featured
                                </span>
                            </div>
                            <div className="blog-featured-body">
                                <span
                                    className="post-category-badge blog-featured-category"
                                    style={{ background: featuredPost.categoryColor || '#47b2e4' }}
                                >
                                    {featuredPost.category}
                                </span>
                                <h2>{featuredPost.title}</h2>
                                <p className="d-none d-sm-block">{featuredPost.summary}</p>
                                <div className="blog-featured-meta">
                                    <span>
                                        <i className="bi bi-person-fill me-1"></i>
                                        {typeof featuredPost.author === 'object' ? (featuredPost.author?.name || 'CTech Team') : (featuredPost.author || 'CTech Team')}
                                    </span>
                                    <span>
                                        <i className="bi bi-calendar3 me-1"></i>
                                        {featuredPost.date || (featuredPost.createdAt ? new Date(featuredPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Aug 2026")}
                                    </span>
                                    <span><i className="bi bi-clock me-1"></i>{featuredPost.readTime || "5 min read"}</span>
                                </div>
                                <Link to={`/blog/${featuredPost.slug || featuredPost._id || featuredPost.id}`} className="btn-contact-submit blog-featured-cta">
                                    Read Full Article <i className="bi bi-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ══════════════ BLOG GRID ══════════════ */}
            <section className="blog-grid-section section pt-0" ref={gridRef}>
                <div className="container px-1 px-sm-2">
                    {visiblePosts.length === 0 ? (
                        <div className="blog-empty-state">
                            <i className="bi bi-search"></i>
                            <h3>No articles found</h3>
                            <p>Try a different search term or category.</p>
                        </div>
                    ) : (
                        <div className="row g-2 g-sm-3 g-lg-4 blog-cards-row">
                            <AnimatePresence>
                                {visiblePosts.map((post, idx) => (
                                    <div className="col-6 col-lg-4 d-flex" key={getPostId(post)}>
                                        <BlogCard post={post} index={idx % PAGE_SIZE} inView={gridInView} />
                                    </div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {hasMore && (
                        <div className="text-center">
                            <motion.button
                                className="blog-load-more-btn"
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            >
                                Load More Articles <i className="bi bi-arrow-down ms-1"></i>
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}