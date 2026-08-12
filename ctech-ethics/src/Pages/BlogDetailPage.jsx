import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogCard from '../Components/BlogCard';
import { getBlog } from '../Redux/ActionCreators/BlogActionCreators';

/* ── Mock data — technical and non-technical mix ── */
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
                        role: typeof found.author === 'object' ? (found.author?.role || 'Engineer') : POST.author.role,
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

    // Comment Form State
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [commentData, setCommentData] = useState({ name: '', email: '', body: '' });
    const [commentStatus, setCommentStatus] = useState('idle'); // idle | loading | success | error

    const handleShare = (label) => {
        if (label === 'Copy link') {
            navigator.clipboard?.writeText(window.location.href).catch(() => { });
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentData.name.trim() || !commentData.body.trim()) return;

        setCommentStatus('loading');

        // Simulate API delay, then update UI
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
        }, 800);
    };

    return (
        <div className="blog-details">

            {/* ══════════════ HERO BANNER ══════════════ */}
            <div className="container">
                <motion.div
                    className="hero-img"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img src={postDoc.image} alt={postDoc.title} />
                    <div className="meta-overlay">
                        <div className="meta-categories">
                            <Link to="/blog" className="category">{postDoc.category}</Link>
                            <span className="divider">•</span>
                            <span className="reading-time"><i className="bi bi-clock"></i>{postDoc.readTime}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ══════════════ CONTENT + TOC LAYOUT ══════════════ */}
            <div className="container">
                <div className="blog-details-layout">

                    {/* ── Sticky TOC (desktop only) ── */}
                    <aside className="blog-toc d-none d-lg-block">
                        <div className="blog-toc-inner">
                            <span className="blog-toc-title">On this page</span>
                            <ul>
                                {TOC.map((item) => (
                                    <li key={item.id}>
                                        <a href={`#${item.id}`}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>

                            <div className="blog-toc-share">
                                <span className="blog-toc-title">Share</span>
                                <div className="blog-share-row">
                                    {SHARE_LINKS.map((s) => (
                                        <button
                                            key={s.label}
                                            className="blog-share-btn"
                                            aria-label={s.label}
                                            onClick={() => handleShare(s.label)}
                                        >
                                            <i className={`bi ${s.icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                                {copied && <span className="blog-copied-tag">Link copied!</span>}
                            </div>
                        </div>
                    </aside>

                    {/* ── Article ── */}
                    <article className="article-content">
                        <div className="content-header">
                            <h1 className="title">{postDoc.title}</h1>
                            <div className="author-info">
                                <div className="author-details">
                                    {postDoc.author.avatar ? (
                                        <img src={postDoc.author.avatar} alt={postDoc.author.name} className="author-img" />
                                    ) : (
                                        <div className="author-img d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold fs-5">
                                            {postDoc.author.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="info">
                                        <h4>{postDoc.author.name}</h4>
                                        <span className="role">{postDoc.author.role}</span>
                                    </div>
                                </div>
                                <div className="post-meta">
                                    <i className="bi bi-calendar3"></i>{postDoc.date}
                                    <span className="divider">•</span>
                                    <i className="bi bi-clock"></i>{postDoc.readTime}
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            {postDoc.content ? (
                                <div dangerouslySetInnerHTML={{ __html: postDoc.content }} />
                            ) : postDoc.sections && postDoc.sections.length > 0 ? (
                                postDoc.sections.map((sec, idx) => (
                                    <div key={idx} className="mb-4">
                                        {sec.subheading && <h2 id={`sec-${idx}`}>{sec.subheading}</h2>}
                                        {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                                            <p key={pIdx}>{p}</p>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <p className="lead" id="intro">
                                        {postDoc.summary || "Modern web applications live or die by how fast the first byte reaches the browser."}
                                    </p>

                                    <h2 id="server-components">Key Highlights</h2>
                                    <p>
                                        Our engineering team prioritizes performance, security, and developer experience when shipping digital solutions for modern businesses.
                                    </p>
                                    <ul>
                                        <li>Optimized server rendering and client-side bundle efficiency.</li>
                                        <li>Clean component modularity and robust API integrations.</li>
                                        <li>Continuous monitoring and proactive vulnerability patching.</li>
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Tags + share (mobile/tablet) */}
                        <div className="meta-bottom">
                            <div>
                                <h4>Tagged under</h4>
                                <div className="tags">
                                    <Link to="/blog" className="tag">{postDoc.category || "Engineering"}</Link>
                                    <Link to="/blog" className="tag">Web</Link>
                                    <Link to="/blog" className="tag">CTech</Link>
                                </div>
                            </div>
                            <div className="d-lg-none">
                                <h4>Share this article</h4>
                                <div className="social-links">
                                    {SHARE_LINKS.map((s) => (
                                        <a href="#!" key={s.label} aria-label={s.label} onClick={(e) => { e.preventDefault(); handleShare(s.label); }}>
                                            <i className={`bi ${s.icon}`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Author Profile Card ── */}
                        <div className="blog-author-card mt-5">
                            {postDoc.author.avatar ? (
                                <img src={postDoc.author.avatar} alt={postDoc.author.name} />
                            ) : (
                                <div className="avatar-img d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold fs-4 me-3" style={{ width: 64, height: 64, flexShrink: 0 }}>
                                    {postDoc.author.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <span className="blog-author-card-label">Written by</span>
                                <h4>{postDoc.author.name}</h4>
                                <p>{postDoc.author.bio}</p>
                                <div className="social-links">
                                    <a href="#!" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                                    <a href="#!" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
                                </div>
                            </div>
                        </div>

                        {/* ── Prev / Next Navigation ── */}
                        <div className="blog-prevnext">
                            <Link to="/blog/zero-trust-cybersecurity-cloud-native" className="blog-prevnext-link prev">
                                <span className="blog-prevnext-label"><i className="bi bi-arrow-left me-1"></i>Previous</span>
                                <span className="blog-prevnext-title">Zero Trust Cybersecurity Architecture for Cloud Native Infrastructure</span>
                            </Link>
                            <Link to="/blog/fostering-innovation-remote-teams" className="blog-prevnext-link next">
                                <span className="blog-prevnext-label">Next<i className="bi bi-arrow-right ms-1"></i></span>
                                <span className="blog-prevnext-title">Fostering a Culture of Innovation in Remote-First Teams</span>
                            </Link>
                        </div>

                        {/* ── Comments Section ── */}
                        <section className="blog-comments mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="comments-header mb-4">
                                <h3 className="title m-0">Discussion</h3>
                                <div className="comments-stats">
                                    <span className="count px-2 py-1 bg-primary text-white rounded me-2">{comments.length}</span>
                                    <span className="label text-muted">Comments</span>
                                </div>
                            </div>

                            {/* Comment List */}
                            <div className="comments-container mb-5">
                                {comments.map((c) => (
                                    <div className="comment-thread mb-4" key={c.id}>
                                        <div className="comment-box d-flex gap-3">
                                            <div className="avatar-wrapper flex-shrink-0">
                                                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#47b2e4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                    {c.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="comment-content flex-grow-1 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <div className="comment-header d-flex justify-content-between mb-2">
                                                    <div className="user-info">
                                                        <h4 className="m-0 fs-6 fw-bold">{c.name}</h4>
                                                        <div className="time-badge text-muted small"><i className="bi bi-clock me-1"></i>{c.time}</div>
                                                    </div>
                                                    <div className="engagement text-muted small">
                                                        <span className="likes"><i className="bi bi-heart-fill text-danger me-1"></i>{c.likes}</span>
                                                    </div>
                                                </div>
                                                <div className="comment-body mb-2"><p className="m-0" style={{ fontSize: '0.95rem' }}>{c.body}</p></div>
                                                <div className="comment-actions gap-3 d-flex small">
                                                    <button className="action-btn text-muted bg-transparent border-0 p-0"><i className="bi bi-heart me-1"></i>Like</button>
                                                    <button className="action-btn text-muted bg-transparent border-0 p-0"><i className="bi bi-reply me-1"></i>Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Leave a Comment Form */}
                            <div className="leave-reply p-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <h4 className="mb-3 fw-bold fs-5">Leave a Reply</h4>
                                <p className="text-muted small mb-4">Your email address will not be published. Required fields are marked *</p>

                                {commentStatus === 'success' && (
                                    <div className="alert alert-success py-2 px-3 small">Your comment has been posted successfully!</div>
                                )}

                                <form onSubmit={handleCommentSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted">Name *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent text-white"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                                required
                                                value={commentData.name}
                                                onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted">Email (Optional)</label>
                                            <input
                                                type="email"
                                                className="form-control bg-transparent text-white"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                                value={commentData.email}
                                                onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small text-muted">Comment *</label>
                                            <textarea
                                                className="form-control bg-transparent text-white"
                                                rows="4"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                                required
                                                value={commentData.body}
                                                onChange={(e) => setCommentData({ ...commentData, body: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                                                disabled={commentStatus === 'loading'}
                                            >
                                                {commentStatus === 'loading' ? 'Posting...' : 'Post Comment'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </article>
                </div>
            </div>

            {/* ══════════════ RELATED ARTICLES ══════════════ */}
            <section className="blog-related section mt-5">
                <div className="container">
                    <div className="section-title text-center mb-4 mb-md-5">
                        <h2>Related <span className="blog-gradient-text">Articles</span></h2>
                        <p>More technical insights and leadership strategies from our team.</p>
                    </div>
                    <div className="row g-2 g-sm-3 g-md-4">
                        {RELATED.map((post, idx) => (
                            <div className="col-6 col-md-6 col-lg-4 d-flex" key={post.id}>
                                <BlogCard post={post} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}