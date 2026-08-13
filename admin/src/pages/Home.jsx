import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
} from "recharts";

import { getService }     from "../Redux/ActionCreators/ServiceActionCreators";
import { getPortfolio }   from "../Redux/ActionCreators/PortfolioActionCreators";
import { getContactUs }   from "../Redux/ActionCreators/ContactUsActionCreators";
import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";
import { getBlog }        from "../Redux/ActionCreators/BlogActionCreators";
import { getNewsletter }  from "../Redux/ActionCreators/NewsletterActionCreators";

// ── Sample fallback data ──────────────────────────────────────────────────────
const SAMPLE = {
    services: [
        { name: "Web Development", active: true },
        { name: "UI/UX Design",    active: true },
        { name: "API Integration", active: true },
        { name: "SEO Consulting",  active: false },
        { name: "Mobile Dev",      active: true },
    ],
    portfolios: [
        { name: "E-Commerce Platform", category: "Web App",     active: true  },
        { name: "Portfolio Builder",    category: "SaaS",        active: true  },
        { name: "Chat Application",     category: "Real-time",   active: false },
        { name: "Blog CMS",             category: "Web App",     active: true  },
        { name: "Weather Dashboard",    category: "API",         active: true  },
        { name: "Task Manager",         category: "Productivity",active: false },
    ],
    contacts: [
        { name: "Rahul Sharma",  email: "rahul@email.com",  active: true  },
        { name: "Priya Mehta",   email: "priya@email.com",  active: true  },
        { name: "Aakash Singh",  email: "aakash@email.com", active: false },
        { name: "Sneha Patel",   email: "sneha@email.com",  active: true  },
        { name: "Vikram Nair",   email: "vikram@email.com", active: false },
    ],
    testimonials: [
        { name: "Rahul Sharma", active: true  },
        { name: "Priya Mehta",  active: true  },
        { name: "Aakash Singh", active: true  },
        { name: "Sneha Patel",  active: false },
        { name: "Vikram Nair",  active: true  },
        { name: "Anjali Rao",   active: false },
    ],
    blogs: [
        { name: "Getting Started with React 19",   category: "React",   active: true,  views: 1240 },
        { name: "Node.js Best Practices 2025",     category: "Backend", active: true,  views: 870  },
        { name: "CSS Grid vs Flexbox",             category: "CSS",     active: true,  views: 2100 },
        { name: "TypeScript Tips for Beginners",   category: "TS",      active: false, views: 0    },
        { name: "Building REST APIs with Express", category: "Backend", active: true,  views: 640  },
    ],
    newsletters:  Array(28).fill({ _id: "x" }),
    achievements: [
        { name: "Best Developer Award",  active: true },
        { name: "Hackathon Winner",      active: true },
        { name: "100k Views Milestone",  active: true },
    ],
};

function unwrap(slice) {
    if (!slice) return [];
    if (Array.isArray(slice)) return slice;
    if (Array.isArray(slice.data)) return slice.data;
    return [];
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const DashTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "var(--admin-surface, #fff)",
            border: "1px solid var(--admin-border, #e2e8f0)",
            borderRadius: 10, padding: "10px 16px", fontSize: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}>
            {label && <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 11, color: "var(--admin-muted)" }}>{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ margin: 0, color: p.fill || p.color, fontWeight: 700 }}>
                    {p.name}: <strong>{p.value?.toLocaleString("en-IN")}</strong>
                </p>
            ))}
        </div>
    );
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, gradient, subLabel, to, trend }) {
    return (
        <Link to={to} className="text-decoration-none d-block h-100">
            <div className="dash-kpi-card h-100" style={{ background: gradient }}>
                <div className="d-flex align-items-start justify-content-between">
                    <div>
                        <p className="dash-kpi-label">{label}</p>
                        <p className="dash-kpi-value">{value?.toLocaleString("en-IN")}</p>
                        {subLabel && <p className="dash-kpi-sub">{subLabel}</p>}
                    </div>
                    <div className="dash-kpi-icon-wrap">
                        <i className={`bi ${icon}`}></i>
                    </div>
                </div>
                {trend !== undefined && (
                    <div className="dash-kpi-trend mt-2">
                        <i className={`bi bi-arrow-${trend >= 0 ? "up" : "down"}-right me-1`}></i>
                        <span>{Math.abs(trend)}% vs last month</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

// ── Alert Mini Card ───────────────────────────────────────────────────────────
function AlertCard({ label, value, icon, accent }) {
    return (
        <div className="dash-alert-card" style={{ borderLeftColor: accent }}>
            <div className="dash-alert-icon" style={{ background: `${accent}18`, color: accent }}>
                <i className={`bi ${icon}`}></i>
            </div>
            <div>
                <div className="dash-alert-value">{value}</div>
                <div className="dash-alert-label">{label}</div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
    const dispatch = useDispatch();
    const [loaded, setLoaded]           = useState(false);
    const [usingSample, setUsingSample] = useState(false);

    const adminName = localStorage.getItem("name") || "Admin";
    const hour      = new Date().getHours();
    const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const raw = {
        services:     useSelector(s => s.ServiceStateData),
        portfolios:   useSelector(s => s.PortfolioStateData),
        contacts:     useSelector(s => s.ContactUsStateData),
        testimonials: useSelector(s => s.TestimonialStateData),
        blogs:        useSelector(s => s.BlogStateData),
        newsletters:  useSelector(s => s.NewsletterStateData),
        achievements: useSelector(s => s.AchievementStateData),
    };

    useEffect(() => {
        dispatch(getService());
        dispatch(getPortfolio());
        dispatch(getContactUs());
        dispatch(getTestimonial());
        dispatch(getBlog());
        dispatch(getNewsletter());
        setTimeout(() => setLoaded(true), 600);
    }, []);

    const live = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, unwrap(v)])
    );

    const allEmpty = loaded && Object.values(live).every(a => a.length === 0);

    useEffect(() => {
        if (loaded) setUsingSample(allEmpty);
    }, [allEmpty, loaded]);

    const D = allEmpty ? SAMPLE : live;

    // ── Derived metrics ───────────────────────────────────────────────────────
    const publishedBlogs      = D.blogs.filter(b => b.active).length;
    const draftBlogs          = D.blogs.filter(b => !b.active).length;
    const approvedTestimonials = D.testimonials.filter(t => t.active).length;
    const pendingTestimonials  = D.testimonials.filter(t => !t.active).length;
    const unreadContacts      = D.contacts.filter(c => c.active).length;
    const totalViews          = D.blogs.reduce((s, b) => s + (b.views || 0), 0);
    const activeServices      = D.services.filter(s => s.active).length;

    // Blog category bar
    const blogCatMap = {};
    D.blogs.forEach(b => { const c = b.category || "Other"; blogCatMap[c] = (blogCatMap[c] || 0) + 1; });
    const blogCatData = Object.entries(blogCatMap).map(([name, count]) => ({ name, count }));

    // Top blogs by views
    const topBlogs = [...D.blogs]
        .filter(b => (b.views || 0) > 0)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    // Content breakdown bars
    const contentBars = [
        { label: "Projects",     count: D.portfolios.length,   to: "/portfolio",  color: "#2563eb" },
        { label: "Blogs",        count: D.blogs.length,        to: "/blog",       color: "#0d9488" },
        { label: "Services",     count: D.services.length,     to: "/service",    color: "#7c3aed" },
        { label: "Achievements", count: D.achievements.length, to: "/achievement",color: "#db2777" },
    ];
    const maxBar = Math.max(...contentBars.map(b => b.count), 1);

    // Quick actions
    const quickActions = [
        { label: "Add Project",    icon: "bi-collection",        to: "/portfolio/create",  color: "#2563eb" },
        { label: "Write Blog",     icon: "bi-file-earmark-pen",  to: "/blog/create",       color: "#0d9488" },
        { label: "Add Service",    icon: "bi-gear-wide-connected",to: "/service/create",   color: "#7c3aed" },
        { label: "View Messages",  icon: "bi-chat-dots-fill",    to: "/contactUs",          color: "#dc2626" },
        { label: "Testimonials",   icon: "bi-chat-quote-fill",   to: "/testimonial",        color: "#d97706" },
        { label: "Newsletter",     icon: "bi-envelope-paper-fill",to: "/newsletter",        color: "#059669" },
    ];

    const axisStyle = { fontSize: 11, fill: "var(--admin-muted, #94a3b8)" };
    const gridStyle = { stroke: "var(--admin-border, rgba(0,0,0,.08))", strokeDasharray: "3 3" };

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">

                {/* ── Sample Mode Banner ── */}
                {usingSample && (
                    <div className="alert alert-warning d-flex align-items-center gap-2 mb-4 rounded-3 border-0" style={{ background: "rgba(251,191,36,0.12)", color: "#92400e" }} role="alert">
                        <i className="bi bi-flask fs-5"></i>
                        <span><strong>Preview mode —</strong> showing sample data. No records returned from API yet.</span>
                    </div>
                )}

                {/* ── Welcome Header ── */}
                <div className="dash-welcome-banner mb-4">
                    <div className="dash-welcome-left">
                        <p className="dash-welcome-greeting">{greeting}, {adminName} 👋</p>
                        <h1 className="dash-welcome-title">CTech Ethic Dashboard</h1>
                        <p className="dash-welcome-date">
                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long", year: "numeric", month: "long", day: "numeric"
                            })}
                        </p>
                    </div>
                    <div className="dash-welcome-stats d-none d-lg-flex">
                        {[
                            { icon: "bi-pen-fill",          val: publishedBlogs,          lbl: "Published" },
                            { icon: "bi-collection",         val: D.portfolios.length,     lbl: "Projects"  },
                            { icon: "bi-envelope-paper-fill",val: D.newsletters.length,    lbl: "Subscribers"},
                            { icon: "bi-graph-up-arrow",     val: totalViews.toLocaleString("en-IN"), lbl: "Total Views" },
                        ].map((s, i) => (
                            <div key={i} className="dash-welcome-stat">
                                <i className={`bi ${s.icon} dash-welcome-stat-icon`}></i>
                                <span className="dash-welcome-stat-val">{s.val}</span>
                                <span className="dash-welcome-stat-lbl">{s.lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── KPI Cards Row ── */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-sm-6 col-xl-3">
                        <KpiCard
                            label="Total Projects"
                            value={D.portfolios.length}
                            icon="bi-collection-fill"
                            gradient="linear-gradient(135deg, #1e40af 0%, #2563eb 100%)"
                            subLabel={`${D.portfolios.filter(p=>p.active).length} active`}
                            to="/portfolio"
                            trend={12}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-xl-3">
                        <KpiCard
                            label="Blog Posts"
                            value={D.blogs.length}
                            icon="bi-journal-richtext"
                            gradient="linear-gradient(135deg, #065f46 0%, #0d9488 100%)"
                            subLabel={`${publishedBlogs} published · ${draftBlogs} draft`}
                            to="/blog"
                            trend={5}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-xl-3">
                        <KpiCard
                            label="Messages"
                            value={D.contacts.length}
                            icon="bi-chat-dots-fill"
                            gradient="linear-gradient(135deg, #7c2d12 0%, #dc2626 100%)"
                            subLabel={`${unreadContacts} unread`}
                            to="/contactUs"
                            trend={-3}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-xl-3">
                        <KpiCard
                            label="Blog Views"
                            value={totalViews}
                            icon="bi-eye-fill"
                            gradient="linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)"
                            subLabel="all time views"
                            to="/blog"
                            trend={18}
                        />
                    </div>
                </div>

                {/* ── Alert Mini Cards ── */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-4">
                        <AlertCard label="Unread Messages"     value={unreadContacts}     icon="bi-envelope-fill"      accent="#2563eb" />
                    </div>
                    <div className="col-12 col-sm-4">
                        <AlertCard label="Pending Testimonials" value={pendingTestimonials} icon="bi-clock-history"      accent="#d97706" />
                    </div>
                    <div className="col-12 col-sm-4">
                        <AlertCard label="Draft Blogs"          value={draftBlogs}          icon="bi-file-earmark-text"  accent="#7c3aed" />
                    </div>
                </div>

                {/* ── Charts Row ── */}
                <div className="row g-3 mb-4">

                    {/* Content Breakdown */}
                    <div className="col-12 col-xl-6">
                        <div className="dash-panel h-100">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-bar-chart-fill"></i> Content Breakdown
                                    </h2>
                                    <p className="dash-panel-sub">Records per section</p>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-3 mt-3">
                                {contentBars.map(b => (
                                    <div key={b.label}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <Link to={b.to} className="dash-bar-label text-decoration-none">{b.label}</Link>
                                            <span className="dash-bar-count">{b.count}</span>
                                        </div>
                                        <div className="dash-bar-track">
                                            <div
                                                className="dash-bar-fill"
                                                style={{
                                                    width: `${Math.round((b.count / maxBar) * 100)}%`,
                                                    background: b.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mini stat row */}
                            <div className="dash-mini-stats mt-4">
                                {[
                                    { icon: "bi-gear-wide-connected", val: activeServices, lbl: "Active Services", color: "#7c3aed" },
                                    { icon: "bi-mortarboard-fill",    val: D.achievements.length, lbl: "Achievements", color: "#db2777" },
                                    { icon: "bi-people-fill",         val: D.testimonials.length, lbl: "Testimonials",  color: "#0d9488" },
                                ].map((s, i) => (
                                    <div key={i} className="dash-mini-stat-item" style={{ borderColor: s.color + "40" }}>
                                        <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
                                        <span className="dash-mini-val">{s.val}</span>
                                        <span className="dash-mini-lbl">{s.lbl}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Blog Posts Chart */}
                    <div className="col-12 col-xl-6">
                        <div className="dash-panel h-100">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-eye-fill"></i> Top Blog Posts by Views
                                    </h2>
                                    <p className="dash-panel-sub">Most read articles</p>
                                </div>
                                <Link to="/blog" className="dash-view-btn">View all</Link>
                            </div>
                            {topBlogs.length === 0
                                ? <p className="text-muted text-center py-5">No published blogs yet.</p>
                                : <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={topBlogs} margin={{ top: 12, right: 8, left: 0, bottom: 48 }} barSize={26}>
                                        <CartesianGrid {...gridStyle} />
                                        <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 9.5 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<DashTooltip />} />
                                        <Bar dataKey="views" name="Views" fill="#2563eb" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                {/* ── Blog Categories + Testimonials Row ── */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-xl-6">
                        <div className="dash-panel h-100">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-tags-fill"></i> Blog Categories
                                    </h2>
                                    <p className="dash-panel-sub">Posts per category</p>
                                </div>
                            </div>
                            {blogCatData.length === 0
                                ? <p className="text-muted text-center py-5">No blogs yet.</p>
                                : <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={blogCatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                        <CartesianGrid {...gridStyle} />
                                        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<DashTooltip />} />
                                        <Bar dataKey="count" name="Posts" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="dash-panel h-100">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-chat-quote-fill"></i> Testimonial Status
                                    </h2>
                                    <p className="dash-panel-sub">Approved vs pending</p>
                                </div>
                                <Link to="/testimonial" className="dash-view-btn">View all</Link>
                            </div>
                            <div className="d-flex align-items-center">
                                <ResponsiveContainer width="60%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: "Approved", value: approvedTestimonials, fill: "#0d9488" },
                                                { name: "Pending",  value: pendingTestimonials,  fill: "#d97706" },
                                            ].filter(d => d.value > 0)}
                                            dataKey="value" nameKey="name"
                                            cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                                            paddingAngle={3} strokeWidth={0}
                                        >
                                            {[{ fill: "#0d9488" }, { fill: "#d97706" }].map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Pie>
                                        <Tooltip content={<DashTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="d-flex flex-column gap-3 flex-grow-1">
                                    <div className="dash-legend-item">
                                        <span className="dash-legend-dot" style={{ background: "#0d9488" }}></span>
                                        <div>
                                            <div className="dash-legend-val">{approvedTestimonials}</div>
                                            <div className="dash-legend-lbl">Approved</div>
                                        </div>
                                    </div>
                                    <div className="dash-legend-item">
                                        <span className="dash-legend-dot" style={{ background: "#d97706" }}></span>
                                        <div>
                                            <div className="dash-legend-val">{pendingTestimonials}</div>
                                            <div className="dash-legend-lbl">Pending Review</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Recent Messages + Quick Actions ── */}
                <div className="row g-3 mb-3">

                    {/* Messages table */}
                    <div className="col-12 col-xl-7">
                        <div className="dash-panel">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-chat-dots-fill"></i> Recent Messages
                                    </h2>
                                    <p className="dash-panel-sub">Latest contact queries</p>
                                </div>
                                <Link to="/contactUs" className="dash-view-btn">View all</Link>
                            </div>
                            <div className="table-responsive mt-3">
                                <table className="table dash-table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {D.contacts.slice(0, 5).map((c, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="dash-avatar" style={{ background: `hsl(${i * 60},60%,40%)` }}>
                                                            {(c.name || "?")[0].toUpperCase()}
                                                        </div>
                                                        <span className="fw-semibold">{c.name || "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{c.email || "—"}</td>
                                                <td>
                                                    <span className={`dash-badge ${c.active ? "dash-badge-warning" : "dash-badge-success"}`}>
                                                        {c.active ? "Unread" : "Read"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-12 col-xl-5">
                        <div className="dash-panel h-100">
                            <div className="dash-panel-header">
                                <div>
                                    <h2 className="dash-panel-title">
                                        <i className="bi bi-lightning-charge-fill"></i> Quick Actions
                                    </h2>
                                </div>
                            </div>
                            <div className="row g-2 mt-1">
                                {quickActions.map((q, i) => (
                                    <div key={i} className="col-6">
                                        <Link to={q.to} className="dash-quick-action text-decoration-none" style={{ "--qa-color": q.color }}>
                                            <div className="dash-qa-icon" style={{ background: q.color + "18", color: q.color }}>
                                                <i className={`bi ${q.icon}`}></i>
                                            </div>
                                            <span className="dash-qa-label">{q.label}</span>
                                            <i className="bi bi-arrow-right dash-qa-arrow" style={{ color: q.color }}></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Newsletter stat */}
                            <div className="dash-nl-strip mt-4">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-envelope-paper-fill text-primary"></i>
                                    <span className="small fw-semibold">Newsletter Subscribers</span>
                                </div>
                                <Link to="/newsletter" className="dash-nl-count">{D.newsletters.length}</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}