import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogCard from '../Components/BlogCard';
import { getBlog } from '../Redux/ActionCreators/BlogActionCreators';

/* ── Fallback post data ── */
const POST = {
    title: 'Building Scalable Web Architecture with Next.js & React 19',
    category: 'Engineering',
    categoryColor: '#47b2e4',
    date: 'Aug 02, 2026',
    readTime: '5 min read',
    image: 'assets/img/blog/blog-post-1.webp',
    author: {
        name: 'Alex Rivera',
        role: 'Tech Lead, CTech Ethic Solution',
        avatar: 'assets/img/team/team-1.webp',
        bio: 'Alex leads the front-end platform team at CTech, focused on performance, DX, and scalable architecture for enterprise clients.',
    },
};

const TOC = [
    { id: 'intro', label: 'Introduction' },
    { id: 'server-components', label: 'Server Components' },
    { id: 'streaming-ssr', label: 'Streaming SSR' },
    { id: 'performance', label: 'Performance Checklist' },
    { id: 'conclusion', label: 'Conclusion' },
];

const RELATED = [
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
        category: 'AI & Data',
        categoryColor: '#a855f7',
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
        authorRole: 'VP of Operations',
        category: 'Company Culture',
        categoryColor: '#ec4899',
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
        category: 'Engineering',
        categoryColor: '#22d3ee',
    },
];

const INITIAL_COMMENTS = [
    {
        id: 1,
        name: 'Jordan Blake',
        time: '2 days ago',
        likes: 12,
        body: 'Great breakdown of streaming SSR — the caching diagram made it click for me. Would love a follow-up on edge runtimes.',
    },
    {
        id: 2,
        name: 'Meera Kapoor',
        time: '1 day ago',
        likes: 4,
        body: 'We migrated our dashboard using this exact checklist. TTFB dropped by ~40%.',
    },
];

const SHARE_LINKS = [
    { icon: 'bi-twitter-x', label: 'Share on X' },
    { icon: 'bi-linkedin', label: 'Share on LinkedIn' },
    { icon: 'bi-facebook', label: 'Share on Facebook' },
    { icon: 'bi-link-45deg', label: 'Copy link' },
];

export default function BlogDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const rawState = useSelector((state) => state.BlogStateData);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getBlog());
    }, [dispatch, id]);

    const postDoc = useMemo(() => {
        const list = Array.isArray(rawState) ? rawState : (rawState?.data || []);
        if (list.length > 0 && id) {
            const found = list.find((b) => b._id === id || b.id === id || b.slug === id);
            if (found) {
                return {
                    title: found.title || POST.title,
                    category: found.category || POST.category,
                    categoryColor: found.categoryColor || '#47b2e4',
                    date: found.createdAt ? new Date(found.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : POST.date,
                    readTime: found.readTime || '5 min read',
                    image: found.image || POST.image,
                    summary: found.summary || POST.summary,
                    content: found.content || '',
                    sections: found.sections || [],
                    author: {
                        name: typeof found.author === 'object' ? (found.author?.name || 'CTech Team') : (found.author || POST.author.name),
                        role: typeof found.author === 'object' ? (found.author?.role || 'Tech Author') : POST.author.role,
                        avatar: typeof found.author === 'object' && found.author?.avatar ? found.author.avatar : POST.author.avatar,
                        bio: typeof found.author === 'object' && found.author?.bio ? found.author.bio : POST.author.bio,
                    },
                    comments: Array.isArray(found.comments) && found.comments.length > 0 ? found.comments : INITIAL_COMMENTS
                };
            }
        }
        return POST;
    }, [rawState, id]);

    const [copied, setCopied] = useState(false);
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [commentData, setCommentData] = useState({ name: '', email: '', body: '' });
    const [commentStatus, setCommentStatus] = useState('idle');

    const handleShare = (label) => {
        if (label === 'Copy link') {
            navigator.clipboard?.writeText(window.location.href).catch(() => { });
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentData.name.trim() || !commentData.body.trim()) return;

        setCommentStatus('loading');
        setTimeout(() => {
            const newComment = {
                id: Date.now(),
                name: commentData.name,
                time: 'Just now',
                likes: 0,
                body: commentData.body,
            };

            setComments([newComment, ...comments]);
            setCommentData({ name: '', email: '', body: '' });
            setCommentStatus('success');

            setTimeout(() => setCommentStatus('idle'), 3000);
        }, 600);
    };

    return (
        <div className="blog-detail-wrapper py-4 py-md-5">
            <div className="container" style={{ maxWidth: '1120px' }}>
                
                {/* ══════════════ 1. HEADER SECTION ══════════════ */}
                <motion.div 
                    className="blog-detail-header text-center mx-auto mb-4 mb-md-5"
                    style={{ maxWidth: '840px' }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Category pill */}
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <span 
                            className="blog-detail-category-badge"
                            style={{
                                backgroundColor: `${postDoc.categoryColor || '#47b2e4'}18`,
                                color: postDoc.categoryColor || '#47b2e4',
                                border: `1px solid ${postDoc.categoryColor || '#47b2e4'}35`,
                            }}
                        >
                            <i className="bi bi-tag-fill me-1" style={{ fontSize: '0.75rem' }}></i>
                            {postDoc.category}
                        </span>
                        <span className="blog-detail-meta-dot">•</span>
                        <span className="blog-detail-meta-item">
                            <i className="bi bi-clock me-1"></i> {postDoc.readTime}
                        </span>
                    </div>

                    {/* Article Main Headline */}
                    <h1 className="blog-detail-title mb-4">
                        {postDoc.title}
                    </h1>

                    {/* Author & Published Info Row */}
                    <div className="blog-detail-author-row d-flex flex-wrap align-items-center justify-content-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            {postDoc.author.avatar ? (
                                <img src={postDoc.author.avatar} alt={postDoc.author.name} className="blog-detail-author-avatar" />
                            ) : (
                                <div className="blog-detail-author-avatar-placeholder">
                                    {postDoc.author.name.charAt(0)}
                                </div>
                            )}
                            <div className="text-start">
                                <div className="blog-detail-author-name">{postDoc.author.name}</div>
                                <div className="blog-detail-author-role">{postDoc.author.role}</div>
                            </div>
                        </div>

                        <span className="blog-detail-meta-divider d-none d-sm-inline">|</span>

                        <div className="blog-detail-publish-date text-muted">
                            <i className="bi bi-calendar3 me-1"></i> {postDoc.date}
                        </div>
                    </div>
                </motion.div>

                {/* ══════════════ 2. FEATURED COVER IMAGE ══════════════ */}
                <motion.div 
                    className="blog-detail-cover-wrapper mb-5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <img src={postDoc.image} alt={postDoc.title} className="blog-detail-cover-img" />
                </motion.div>

                {/* ══════════════ 3. TWO-COLUMN LAYOUT (TOC + ARTICLE) ══════════════ */}
                <div className="row g-4 justify-content-between">
                    
                    {/* LEFT SIDEBAR: Sticky Table of Contents & Social Share (Desktop) */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="blog-detail-sidebar sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <div className="blog-detail-sidebar-card mb-4">
                                <div className="blog-sidebar-title mb-3">
                                    <i className="bi bi-list-nested me-2 text-primary"></i> On this page
                                </div>
                                <ul className="blog-toc-list">
                                    {TOC.map((item) => (
                                        <li key={item.id}>
                                            <a href={`#${item.id}`} className="blog-toc-link">
                                                <span className="toc-dot"></span> {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="blog-detail-sidebar-card text-center">
                                <div className="blog-sidebar-title mb-3">Share Article</div>
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    {SHARE_LINKS.map((s) => (
                                        <button
                                            key={s.label}
                                            className="blog-share-icon-btn"
                                            title={s.label}
                                            onClick={() => handleShare(s.label)}
                                        >
                                            <i className={`bi ${s.icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                                {copied && (
                                    <div className="blog-copied-toast mt-2">
                                        <i className="bi bi-check-circle-fill me-1"></i> Link copied!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MAIN COLUMN: Article Content */}
                    <div className="col-12 col-lg-8 col-xl-8">
                        <article className="blog-detail-article">
                            
                            {/* Summary / Lead paragraph */}
                            {postDoc.summary && (
                                <p className="blog-lead-paragraph mb-4">
                                    {postDoc.summary}
                                </p>
                            )}

                            {/* Render Post Content */}
                            {postDoc.content ? (
                                <div className="blog-formatted-content" dangerouslySetInnerHTML={{ __html: postDoc.content }} />
                            ) : postDoc.sections && postDoc.sections.length > 0 ? (
                                postDoc.sections.map((sec, idx) => (
                                    <div key={idx} className="blog-section-block mb-4">
                                        {sec.subheading && <h2 id={`sec-${idx}`}>{sec.subheading}</h2>}
                                        {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                                            <p key={pIdx}>{p}</p>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="blog-formatted-content">
                                    <h2 id="server-components">Key Architectural Principles</h2>
                                    <p>
                                        Modern software demands modularity, strict data contracts, and edge optimization. When crafting applications for enterprise scale, front-end speed is deeply intertwined with backend data delivery mechanisms.
                                    </p>

                                    <blockquote className="blog-quote-box my-4">
                                        &ldquo;High performance isn&apos;t just an optimization pass at the end of development — it&apos;s an architectural mindset built into every iteration.&rdquo;
                                        <cite className="d-block mt-2 font-semibold">— Alex Rivera, Tech Lead</cite>
                                    </blockquote>

                                    <h2 id="streaming-ssr">Core Best Practices</h2>
                                    <p>
                                        Our engineering teams utilize battle-tested patterns to achieve maximum performance and stability:
                                    </p>
                                    <ul className="blog-check-list my-3">
                                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Optimized server rendering and edge-cached static pages.</li>
                                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Clean component modularity and decoupled REST/GraphQL APIs.</li>
                                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Continuous security scanning, OWASP compliance, and zero-downtime releases.</li>
                                    </ul>
                                </div>
                            )}

                            {/* Tags & Mobile Share */}
                            <div className="blog-detail-tags-wrapper d-flex flex-wrap align-items-center justify-content-between gap-3 my-5 py-4 border-top border-bottom">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <span className="fw-bold me-2"><i className="bi bi-tags-fill me-1 text-primary"></i> Tags:</span>
                                    <Link to="/blog" className="blog-tag-pill">{postDoc.category || "Engineering"}</Link>
                                    <Link to="/blog" className="blog-tag-pill">Web Tech</Link>
                                    <Link to="/blog" className="blog-tag-pill">CTech Solutions</Link>
                                </div>

                                <div className="d-flex align-items-center gap-2 d-lg-none">
                                    <span className="small text-muted me-1">Share:</span>
                                    {SHARE_LINKS.map((s) => (
                                        <button key={s.label} className="blog-share-icon-btn btn-sm" onClick={() => handleShare(s.label)}>
                                            <i className={`bi ${s.icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Author Bio Box ── */}
                            <div className="blog-author-box p-4 rounded-4 mb-5">
                                <div className="d-flex align-items-start gap-3">
                                    {postDoc.author.avatar ? (
                                        <img src={postDoc.author.avatar} alt={postDoc.author.name} className="blog-author-box-img" />
                                    ) : (
                                        <div className="blog-author-box-img-placeholder">
                                            {postDoc.author.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <span className="blog-author-badge mb-1">WRITTEN BY</span>
                                        <h4 className="fw-bold mb-1" style={{ fontSize: '1.15rem' }}>{postDoc.author.name}</h4>
                                        <p className="small mb-3 text-muted">{postDoc.author.bio}</p>
                                        <div className="d-flex gap-2">
                                            <a href="#!" className="blog-author-social-link"><i className="bi bi-linkedin"></i></a>
                                            <a href="#!" className="blog-author-social-link"><i className="bi bi-twitter-x"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Prev / Next Navigation ── */}
                            <div className="blog-nav-row row g-3 mb-5">
                                <div className="col-sm-6">
                                    <Link to="/blog/zero-trust-cybersecurity-cloud-native" className="blog-nav-card h-100">
                                        <span className="nav-dir"><i className="bi bi-arrow-left me-1"></i> Previous Article</span>
                                        <h5 className="nav-title text-truncate">Zero Trust Cybersecurity Architecture</h5>
                                    </Link>
                                </div>
                                <div className="col-sm-6">
                                    <Link to="/blog/fostering-innovation-remote-teams" className="blog-nav-card h-100 text-sm-end">
                                        <span className="nav-dir">Next Article <i className="bi bi-arrow-right ms-1"></i></span>
                                        <h5 className="nav-title text-truncate">Fostering Innovation in Remote Teams</h5>
                                    </Link>
                                </div>
                            </div>

                            {/* ── Discussion & Comments Section ── */}
                            <section className="blog-comments-wrapper pt-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h3 className="h4 fw-bold m-0">Discussion</h3>
                                    <span className="badge rounded-pill bg-primary px-3 py-2">
                                        {comments.length} Comments
                                    </span>
                                </div>

                                {/* Comments List */}
                                <div className="comments-list mb-5">
                                    {comments.map((c) => (
                                        <div key={c.id} className="blog-comment-card p-3 p-md-4 rounded-4 mb-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="blog-comment-avatar">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                                        <h5 className="fw-bold m-0" style={{ fontSize: '0.98rem' }}>{c.name}</h5>
                                                        <span className="small text-muted"><i className="bi bi-clock me-1"></i>{c.time}</span>
                                                    </div>
                                                    <p className="mb-2" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{c.body}</p>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <button className="blog-comment-action-btn"><i className="bi bi-heart me-1"></i> Like ({c.likes})</button>
                                                        <button className="blog-comment-action-btn"><i className="bi bi-reply me-1"></i> Reply</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Leave a Comment Form */}
                                <div className="blog-comment-form-card p-4 rounded-4">
                                    <h4 className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>Leave a Reply</h4>
                                    <p className="text-muted small mb-4">Your email address will not be published. Required fields are marked *</p>

                                    {commentStatus === 'success' && (
                                        <div className="alert alert-success py-2.5 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2">
                                            <i className="bi bi-check-circle-fill fs-5"></i> Your comment has been posted successfully!
                                        </div>
                                    )}

                                    <form onSubmit={handleCommentSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Your Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control blog-comment-input"
                                                    placeholder="John Doe"
                                                    required
                                                    value={commentData.name}
                                                    onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Email Address (Optional)</label>
                                                <input
                                                    type="email"
                                                    className="form-control blog-comment-input"
                                                    placeholder="john@example.com"
                                                    value={commentData.email}
                                                    onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Your Comment *</label>
                                                <textarea
                                                    className="form-control blog-comment-input"
                                                    rows="4"
                                                    placeholder="Share your thoughts or feedback..."
                                                    required
                                                    value={commentData.body}
                                                    onChange={(e) => setCommentData({ ...commentData, body: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button
                                                    type="submit"
                                                    className="blog-submit-btn"
                                                    disabled={commentStatus === 'loading'}
                                                >
                                                    {commentStatus === 'loading' ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Posting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Post Comment <i className="bi bi-send-fill ms-1"></i>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </section>

                        </article>
                    </div>

                </div>

            </div>

            {/* ══════════════ 4. RELATED ARTICLES SECTION ══════════════ */}
            <section className="blog-related-section section mt-5 pt-5 border-top">
                <div className="container" style={{ maxWidth: '1120px' }}>
                    <div className="section-title text-center mb-4 mb-md-5">
                        <h2>Related <span className="blog-gradient-text">Articles</span></h2>
                        <p>Explore more technical insights and leadership strategies from our engineering team.</p>
                    </div>
                    <div className="row g-3 g-md-4">
                        {RELATED.map((post, idx) => (
                            <div className="col-12 col-md-6 col-lg-4 d-flex" key={post.id}>
                                <BlogCard post={post} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}