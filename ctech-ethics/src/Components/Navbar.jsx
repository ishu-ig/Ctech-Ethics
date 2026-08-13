import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultancyModal from './ConsultancyModal';
import ThemeToggle from './ThemeToggle';

// ── Breakpoint: desktop nav visible ≥ 1200px, hamburger visible < 1200px
const DESKTOP_BP = 1200;

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Services', to: '/services' },
  { name: 'Portfolio', to: '/portfolio' },
  { name: 'Blog', to: '/blog' },
  { name: 'Careers', to: '/career' },
  { name: 'Placements', to: '/placement' },
  { name: 'Contact', to: '/contactus' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isConsultancyOpen, setIsConsultancyOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BP);

  /* ---------- sync active link with current route ---------- */
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink('Home');
    } else if (path.startsWith('/about')) {
      setActiveLink('About');
    } else if (path.startsWith('/services')) {
      setActiveLink('Services');
    } else if (path.startsWith('/portfolio') || path.startsWith('/portfoliodetail')) {
      setActiveLink('Portfolio');
    } else if (path.startsWith('/blog')) {
      setActiveLink('Blog');
    } else if (path.startsWith('/career')) {
      setActiveLink('Careers');
    } else if (path.startsWith('/placementjobs') || path.startsWith('/placement')) {
      setActiveLink('Placements');
    } else if (path.startsWith('/contact')) {
      setActiveLink('Contact');
    }
  }, [location.pathname]);

  /* ---------- scroll effect ---------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------- window resize — track desktop breakpoint ---------- */
  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BP;
      setIsDesktop(desktop);
      // Auto-close drawer when switching to desktop
      if (desktop) setIsOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---------- prevent body scroll when drawer open ---------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(v => !v);

  const closeMenu = (name) => {
    setIsOpen(false);
    setActiveDropdown(null);
    if (name) setActiveLink(name);
  };

  const handleDropdown = (e, name) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  /* -------- Framer Motion variants -------- */
  const headerVariants = {
    hidden: { y: -90, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  const logoVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.15, ease: 'easeOut' } },
  };

  const navStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  };

  const navItemVariant = {
    hidden: { y: -14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.38, ease: 'easeOut' } },
  };

  const drawerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0, opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 28, staggerChildren: 0.07, delayChildren: 0.1 },
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.28, ease: 'easeInOut' } },
  };

  const drawerItem = {
    hidden: { x: 40, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.22 } },
  };

  return (
    <>
      {/* ====== MAIN HEADER ====== */}
      <motion.header
        id="header"
        className={`header d-flex align-items-center fixed-top ${isScrolled ? 'glass-navbar' : 'transparent-navbar'}`}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

          {/* ---- Brand Logo ---- */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/"
              className="logo d-flex align-items-center"
              onClick={() => closeMenu('Home')}
            >
              <motion.img
                className="brand-logo-img"
                src="assets/img/logo.png"
                alt="CTech Ethic Logo"
                initial={{ rotate: -8, opacity: 0, scale: 0.85 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              />
              <span className="sitename premium-brand-text ms-2 mb-0">
                <span className="brand-highlight">CTech</span>
                <span className="brand-accent">Ethics</span>
              </span>
            </Link>
          </motion.div>

          {/* ---- Desktop Nav — shown only on desktop ---- */}
          <nav
            id="navmenu"
            className="navmenu"
            style={{ display: isDesktop ? 'flex' : 'none' }}
          >
            <motion.ul variants={navStagger} initial="hidden" animate="visible">

              {NAV_LINKS.map(({ name, to }) => (
                <motion.li key={name} variants={navItemVariant} className="position-relative">
                  {to.startsWith('/') && !to.includes('#') ? (
                    <Link
                      to={to}
                      className={`premium-nav-link ${activeLink === name ? 'active' : ''}`}
                      onClick={() => closeMenu(name)}
                    >
                      {name}
                      {activeLink === name && (
                        <motion.div layoutId="activeUnderline" className="active-indicator" />
                      )}
                    </Link>
                  ) : (
                    <a
                      href={to}
                      className={`premium-nav-link ${activeLink === name ? 'active' : ''}`}
                      onClick={() => closeMenu(name)}
                    >
                      {name}
                      {activeLink === name && (
                        <motion.div layoutId="activeUnderline" className="active-indicator" />
                      )}
                    </a>
                  )}
                </motion.li>
              ))}



            </motion.ul>
          </nav>

          {/* ── Right Controls: ThemeToggle | CTA (Desktop) | Hamburger (Mobile/Tablet) ── */}
          <div
            className="navbar-right-controls d-flex align-items-center justify-content-end gap-2"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
          >

            {/* Theme toggle — visible on all devices, positioned left of hamburger */}
            <ThemeToggle />

            {/* Book Consultancy — desktop only (≥1200px) */}
            {isDesktop && (
              <motion.button
                type="button"
                className="premium-cta nav-cta-btn"
                onClick={() => setIsConsultancyOpen(true)}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Consultancy
              </motion.button>
            )}

            {/* Hamburger — mobile/tablet/iPad (<1200px), positioned immediately to the right of ThemeToggle */}
            {!isDesktop && (
              <motion.button
                type="button"
                className={`mobile-nav-toggle bi ${isOpen ? 'bi-x' : 'bi-list'}`}
                onClick={toggleMenu}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  rotate: isOpen ? 90 : 0,
                  scale: isOpen ? 1.05 : 1,
                }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              />
            )}

          </div>

        </div>
      </motion.header>

      {/* ====== MOBILE SLIDE-IN DRAWER — only when not desktop ====== */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="mobile-drawer glass-drawer"
              role="dialog"
              aria-label="Navigation menu"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="drawer-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <img height={34} src="assets/img/logo.png" alt="logo" style={{ borderRadius: 6 }} />
                  <span className="premium-brand-text">
                    <span className="brand-highlight">CTech</span>
                    <span className="brand-accent">Ethics</span>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <motion.button
                    type="button"
                    className="drawer-close bi bi-x-lg"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                    whileHover={{ rotate: 90, scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  />
                </div>
              </div>

              {/* Nav Links */}
              <ul className="drawer-links">
                {NAV_LINKS.map(({ name, to }) => (
                  <motion.li key={name} variants={drawerItem}>
                    {to.startsWith('/') && !to.includes('#') ? (
                      <Link
                        to={to}
                        className={`drawer-link ${activeLink === name ? 'active' : ''}`}
                        onClick={() => closeMenu(name)}
                      >
                        {name}
                      </Link>
                    ) : (
                      <a
                        href={to}
                        className={`drawer-link ${activeLink === name ? 'active' : ''}`}
                        onClick={() => closeMenu(name)}
                      >
                        {name}
                      </a>
                    )}
                  </motion.li>
                ))}

                {/* Mobile Quick Links dropdown */}
                <motion.li variants={drawerItem} className="drawer-dropdown">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    onClick={(e) => handleDropdown(e, 'mobile-solutions')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="drawer-link" style={{ cursor: 'pointer' }}>Quick Links</span>
                    <motion.i
                      className={`bi bi-chevron-${activeDropdown === 'mobile-solutions' ? 'up' : 'down'}`}
                      animate={{ rotate: activeDropdown === 'mobile-solutions' ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ color: 'rgba(248,250,252,0.5)', marginRight: 4 }}
                    />
                  </div>
                  <AnimatePresence>
                    {activeDropdown === 'mobile-solutions' && (
                      <motion.ul
                        className="drawer-sublinks"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <li><Link to="/career" onClick={() => closeMenu()}>Company Jobs</Link></li>
                        <li><Link to="/placementjobs" onClick={() => closeMenu()}>Placement Jobs</Link></li>
                        <li><Link to="/services" onClick={() => closeMenu()}>Our Services</Link></li>
                        <li><Link to="/contactus" onClick={() => closeMenu()}>Contact Us</Link></li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              </ul>

              {/* CTA Footer */}
              <motion.div variants={drawerItem} className="drawer-footer">
                <button
                  type="button"
                  className="btn-getstarted ms-3 premium-cta w-100"
                  onClick={() => { setIsOpen(false); setIsConsultancyOpen(true); }}
                  style={{ display: 'block', textAlign: 'center', border: 'none' }}
                >
                  Book Consultancy
                </button>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====== CONSULTANCY MODAL ====== */}
      <ConsultancyModal
        isOpen={isConsultancyOpen}
        onClose={() => setIsConsultancyOpen(false)}
      />
    </>
  );
}