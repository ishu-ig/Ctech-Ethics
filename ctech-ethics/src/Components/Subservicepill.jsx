import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const POPUP_WIDTH = 270;
const POPUP_WIDTH_MOBILE = 230;
const MOBILE_BREAKPOINT = 575;
const GAP = 10;
const MARGIN = 16;

const popupVariants = {
  initial: { opacity: 0, scale: 0.92, y: 10 },
  animate: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 22, staggerChildren: 0.04, delayChildren: 0.02 },
  },
  exit: { opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function SubServicePill({ item, onSelect, swiperRef }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const pillRef = useRef(null);

  // Track whether mouse is physically inside the pill wrapper
  // to guard against Swiper-induced onBlur / synthetic mouseleave calls
  const mouseInsideRef = useRef(false);
  const hideTimerRef = useRef(null);

  // The parent Swiper autoplays and continuously translates this pill's
  // slide every couple seconds. That movement fires a native pointerleave
  // the instant the slide shifts under the cursor, so the popup opens and
  // is immediately closed by the debounce before it's ever visible.
  // Pausing autoplay for as long as this pill is hovered/open fixes that.
  const pauseAutoplay = useCallback(() => {
    const sw = swiperRef && swiperRef.current;
    if (sw && !sw.destroyed && sw.autoplay && sw.autoplay.running) {
      sw.autoplay.stop();
    }
  }, [swiperRef]);

  const resumeAutoplay = useCallback(() => {
    const sw = swiperRef && swiperRef.current;
    if (sw && !sw.destroyed && sw.autoplay && !sw.autoplay.running) {
      sw.autoplay.start();
    }
  }, [swiperRef]);

  const getPopupWidth = () =>
    window.innerWidth <= MOBILE_BREAKPOINT ? POPUP_WIDTH_MOBILE : POPUP_WIDTH;

  const calculateCoords = useCallback(() => {
    if (!pillRef.current) return null;
    const rect = pillRef.current.getBoundingClientRect();
    const popupWidth = getPopupWidth();
    const pillCenter = rect.left + rect.width / 2;

    let left = pillCenter - popupWidth / 2;
    if (left < MARGIN) left = MARGIN;
    if (left + popupWidth > window.innerWidth - MARGIN) {
      left = window.innerWidth - MARGIN - popupWidth;
    }

    let top = rect.top - GAP;
    let isAbove = true;
    if (top < 160) {
      top = rect.bottom + GAP;
      isAbove = false;
    }

    return { top, left, width: popupWidth, arrowLeft: pillCenter - left, isAbove };
  }, []);

  const updatePosition = useCallback(() => {
    const nextCoords = calculateCoords();
    if (nextCoords) setCoords(nextCoords);
  }, [calculateCoords]);

  // Debounced show: cancel any pending hide, then open.
  // Ignore touch pointers here — touch devices open the full modal
  // directly on tap (see triggerModal) since there's no real "hover".
  const show = useCallback((e) => {
    if (e && e.pointerType === 'touch') return;
    mouseInsideRef.current = true;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    pauseAutoplay();
    const nextCoords = calculateCoords();
    if (nextCoords) setCoords(nextCoords);
    setOpen(true);
  }, [calculateCoords, pauseAutoplay]);

  // Debounced hide: only actually hide after 150ms, and only if the
  // pointer hasn't re-entered in that window (covers Swiper's autoplay
  // shifting the slide, which can otherwise fire a spurious leave event)
  const hide = useCallback((e) => {
    if (e && e.pointerType === 'touch') return;
    mouseInsideRef.current = false;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!mouseInsideRef.current) {
        setOpen(false);
        resumeAutoplay();
      }
    }, 150);
  }, [resumeAutoplay]);

  // Cleanup timer + make sure we never leave the parent autoplay paused
  // if this pill unmounts (e.g. Swiper recycling slides) while hovered.
  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (mouseInsideRef.current) resumeAutoplay();
  }, [resumeAutoplay]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  // Click handler: fires on the pill button itself
  const triggerModal = useCallback((e) => {
    e.stopPropagation();
    // e.preventDefault(); <-- Make sure this is deleted or commented out

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    mouseInsideRef.current = false;
    setOpen(false);
    resumeAutoplay();

    if (onSelect) onSelect(item);
  }, [item, onSelect, resumeAutoplay]);

  return (
    <div
      className="sp-pill-wrap"
      ref={pillRef}
      onPointerEnter={show}
      onPointerLeave={hide}
    >
      <motion.button
        type="button"
        className="sp-pill"
        onClick={triggerModal}
        onPointerDown={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        aria-label={`Learn more about ${item.name}`}
      >
        <i className={`bi ${item.icon}`}></i>
        <span>{item.name}</span>
      </motion.button>

      {/* Hover Tooltip Portal.
          IMPORTANT: the portal must always mount (it just renders `null`
          via AnimatePresence when closed). Wrapping `createPortal(...)`
          itself inside <AnimatePresence> — as this component originally
          did — silently fails to render anything, because AnimatePresence
          can't establish presence-tracking for a Portal node. AnimatePresence
          has to live *inside* the portaled subtree, around the motion.div. */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && coords && (
            <div
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                transform: coords.isAbove ? 'translateY(-100%)' : 'none',
                zIndex: 999999,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                key="subservice-hover-portal"
                className={`sp-popup sp-popup-portal ${coords.isAbove ? 'is-above' : 'is-below'}`}
                role="tooltip"
                aria-label={item.name}
                onPointerEnter={show}
                onPointerLeave={hide}
                variants={popupVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ pointerEvents: 'auto', '--arrow-left': `${coords.arrowLeft}px` }}
              >
                <div className="sp-popup-accent-line" />
                <div className="d-flex align-items-center gap-2 mb-2">
                  <motion.div className="sp-popup-icon" variants={itemVariants}>
                    <i className={`bi ${item.icon}`}></i>
                  </motion.div>
                  <div className="flex-1 overflow-hidden">
                    <motion.h5 className="sp-popup-title text-truncate m-0" variants={itemVariants}>
                      {item.name}
                    </motion.h5>
                    <motion.span className="sp-popup-badge" variants={itemVariants}>
                      Sub-Service
                    </motion.span>
                  </div>
                </div>
                <motion.p className="sp-popup-desc" variants={itemVariants}>
                  {item.description}
                </motion.p>
                {item.tags && item.tags.length > 0 && (
                  <motion.div className="sp-popup-tags" variants={itemVariants}>
                    {item.tags.map((tag) => (
                      <motion.span key={tag} className="sp-tag" whileHover={{ scale: 1.06 }}>
                        <i className="bi bi-check2 me-1"></i>{tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
                <motion.button
                  type="button"
                  className="sp-popup-link border-0 bg-transparent p-0 text-start"
                  onClick={triggerModal}
                  onPointerDown={(e) => e.stopPropagation()}
                  variants={itemVariants}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sp-popup-link-text">Explore Details</span>
                  <i className="bi bi-arrow-right ms-1" />
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}