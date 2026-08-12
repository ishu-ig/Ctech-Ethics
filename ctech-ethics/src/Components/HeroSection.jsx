import React, { useRef, useEffect } from 'react'

/**
 * Flexible HeroSection Component
 *
 * Props:
 *  - title (string): Heading text
 *  - subtitle (string): Optional description
 *  - eyebrow (string): Small tag above title (e.g. "Trusted Advisory · Modern Governance")
 *  - cta (array): Optional list of button objects e.g. [{ label: 'Explore', href: '/services', primary: true }]
 *  - videoSrc (string): Path to background video
 *  - breadcrumb (string | array): Custom breadcrumb items
 *  - showBreadcrumb (boolean): Whether to render breadcrumb trail (default: true)
 *  - size ('sm' | 'md' | 'lg'): Preset height scaling ('sm' = ~350px/40vh, 'md' = ~450px/50vh, 'lg' = ~650px/70vh)
 *  - height (string): Custom min-height override (e.g. "400px", "50vh")
 */
export default function HeroSection({
    title = 'Ethics, Integrity & Innovation',
    subtitle,
    eyebrow = 'Trusted Advisory · Modern Governance',
    cta,
    videoSrc = '/assets/img/herosection.mp4',
    breadcrumb,
    showBreadcrumb = true,
    size = 'md',
    height,
}) {
    const videoRef = useRef(null)

    useEffect(() => {
        const v = videoRef.current
        if (v) v.play().catch(() => {})
    }, [])

    const crumbs = Array.isArray(breadcrumb)
        ? breadcrumb
        : breadcrumb
            ? [breadcrumb]
            : [title]

    const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0)
    const hasCta = Array.isArray(cta) && cta.length > 0

    // Heights mapping for flexible usage
    const sizeHeights = {
        sm: 'clamp(320px, 38vh, 420px)',
        md: 'clamp(400px, 50vh, 520px)',
        lg: 'clamp(520px, 68vh, 700px)',
    }
    const sectionHeight = height || sizeHeights[size] || sizeHeights.md

    const titleSize =
        size === 'lg'
            ? 'clamp(2.2rem, 5vw, 3.8rem)'
            : size === 'sm'
                ? 'clamp(1.7rem, 3.8vw, 2.5rem)'
                : 'clamp(1.9rem, 4.4vw, 3.1rem)'

    return (
        <>
            

            <section
                className="flex-hero-section mb-4"
                style={{ minHeight: sectionHeight, padding: '48px 20px' }}
            >
                {/* Background Video */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="flex-hero-video"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>

                {/* Overlays */}
                <div className="flex-hero-overlay" />
                <div className="flex-hero-ambient" />

                {/* Center Content Container */}
                <div className="container flex-hero-container">
                    {/* Eyebrow Label */}
                    {eyebrow && (
                        <div className="flex-hero-eyebrow">
                            <span className="flex-hero-dot" />
                            <span className="flex-hero-eyebrow-text">{eyebrow}</span>
                        </div>
                    )}

                    {/* Title */}
                    <h1
                        className="flex-hero-title"
                        style={{ fontSize: titleSize, maxWidth: size === 'sm' ? '540px' : '780px' }}
                    >
                        {title}
                    </h1>

                    {/* Accent gradient line */}
                    <div className="flex-hero-accent-line" />

                    {/* Subtitle if provided */}
                    {hasSubtitle && (
                        <p
                            className="flex-hero-subtitle"
                            style={{ fontSize: size === 'sm' ? '0.94rem' : '1.02rem' }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Optional CTA Buttons */}
                    {hasCta && (
                        <div className="flex-hero-cta">
                            {cta.map((btn, i) => (
                                <a
                                    key={i}
                                    href={btn.href || '#'}
                                    className={btn.primary ? 'flex-hero-btn-primary' : 'flex-hero-btn-secondary'}
                                >
                                    {btn.label}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Breadcrumb Navigation */}
                    {showBreadcrumb && (
                        <nav className="flex-hero-breadcrumb" aria-label="breadcrumb">
                            <ol>
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                {crumbs.map((crumb, i) => (
                                    <React.Fragment key={`${crumb}-${i}`}>
                                        <li className="flex-hero-bc-sep" aria-hidden="true">/</li>
                                        {i === crumbs.length - 1 ? (
                                            <li className="flex-hero-bc-active" aria-current="page">
                                                {crumb}
                                            </li>
                                        ) : (
                                            <li>
                                                <a href="#!">
                                                    {crumb}
                                                </a>
                                            </li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ol>
                        </nav>
                    )}
                </div>

                {/* Bottom Separator Line */}
                <div className="flex-hero-bottom-border" />
            </section>
        </>
    )
}

