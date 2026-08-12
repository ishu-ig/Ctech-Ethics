/**
 * Template Name: Arsha (React-compatible version)
 * All DOM interactions are guarded against null to work with React's
 * async rendering — elements may not exist at script execution time.
 */

(function () {
  "use strict";

  /**
   * Helper: safe querySelector — returns null without throwing
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Apply .scrolled class to body as page scrolls
   * The header is rendered by React, so guard against null.
   */
  function toggleScrolled() {
    const selectBody   = qs('body');
    const selectHeader = qs('#header');
    if (!selectHeader) return;
    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    ) return;
    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   * The button is now rendered by React — skip this block entirely.
   * React's Navbar component manages its own open/close state.
   */
  // (intentionally removed — handled by Navbar.jsx)

  /**
   * Preloader
   */
  const preloader = qs('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  function toggleScrollTop() {
    const scrollTop = qs('.scroll-top');
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add('active')
      : scrollTop.classList.remove('active');
  }

  const scrollTopBtn = qs('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * AOS — Animation on Scroll
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * GLightbox
   */
  window.addEventListener('load', () => {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  });

  /**
   * Swiper sliders (template-style init-swiper elements)
   */
  function initSwiper() {
    document.querySelectorAll('.init-swiper').forEach(function (swiperElement) {
      const configEl = swiperElement.querySelector('.swiper-config');
      if (!configEl) return;
      let config;
      try {
        config = JSON.parse(configEl.innerHTML.trim());
      } catch (e) {
        return;
      }
      if (typeof Swiper !== 'undefined') {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener('load', initSwiper);

  /**
   * FAQ toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Skills animation (Waypoint)
   */
  document.querySelectorAll('.skills-animation').forEach((item) => {
    if (typeof Waypoint === 'undefined') return;
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function () {
        item.querySelectorAll('.progress .progress-bar').forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      },
    });
  });

  /**
   * Isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    const container = isotopeItem.querySelector('.isotope-container');
    if (!container || typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') return;

    const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    const sort   = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(container, function () {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
        if (activeFilter) activeFilter.classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({ filter: this.getAttribute('data-filter') });
        }
        if (typeof aosInit === 'function') aosInit();
      }, false);
    });
  });

  /**
   * Correct scrolling position for hash links on load
   */
  window.addEventListener('load', function () {
    if (window.location.hash) {
      const section = qs(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   * React's Navbar handles its own active-link state; this just adds/removes
   * the .active class on plain <a> tags if they exist outside React.
   */
  function navmenuScrollspy() {
    document.querySelectorAll('.navmenu a').forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      const section = qs(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.navmenu a.active').forEach((link) => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();