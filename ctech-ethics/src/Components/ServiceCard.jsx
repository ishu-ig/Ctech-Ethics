import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';

import SubServicePill from './Subservicepill';

function useMobile(breakpoint = 575) {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function ServiceCard({ service, index, onSelectModal }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-60px' });
  const isMobile = useMobile();
  const MotionLink = motion(Link);

  // Holds the live Swiper instance for this card's sub-service pill
  // carousel so pills can pause/resume its autoplay while hovered
  // (autoplay was constantly sliding pills out from under the cursor,
  // which closed the hover popup before it ever became visible).
  const subSwiperRef = useRef(null);
  const handleSubSwiper = useCallback((swiper) => {
    subSwiperRef.current = swiper;
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="sp-card"
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="sp-card-media" onClick={() => onSelectModal(service)} style={{ cursor: 'pointer' }}>
        <motion.img
          src={service.image}
          alt={service.title}
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="sp-card-media-overlay" />

        <motion.div
          className="sp-card-icon"
          style={{ background: service.gradient || 'linear-gradient(135deg, #47b2e4, #2563eb)' }}
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
          transition={{ duration: 0.5 }}
          animate={inView ? { scale: [0.5, 1.15, 1], opacity: [0, 1, 1] } : {}}
        >
          <i className={`bi ${service.icon}`} />
        </motion.div>
      </div>

      <div className="sp-card-body">
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 + (index % 3) * 0.08 }}
          onClick={() => onSelectModal(service)}
          style={{ cursor: 'pointer' }}
        >
          {service.title}
        </motion.h3>
        <p>{service.description}</p>

        {!isMobile && (
          <Swiper
            modules={[FreeMode, Autoplay]}
            nested={true}
            slidesPerView="auto"
            spaceBetween={10}
            freeMode={{ enabled: true, sticky: false }}
            preventClicks={false}
            preventClicksPropagation={false}
            simulateTouch={false}
            touchStartPreventDefault={false}
            grabCursor={false}
            rewind={true}
            watchOverflow={true}
            observer={true}
            observeParents={true}
            observeSlideChildren={true}
            autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            onSwiper={handleSubSwiper}
            className="sp-subservice-swiper"
          >
            {service.subServices && service.subServices.map((sub) => (
              <SwiperSlide key={sub.id} className="sp-subservice-slide">
                <SubServicePill item={sub} onSelect={(item) => onSelectModal(item)} swiperRef={subSwiperRef} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <MotionLink
          to={service.slug ? `/services/${service.slug}` : `/serviceDetail`}
          className="sp-card-link border-0 bg-transparent p-0 text-start cursor-pointer text-decoration-none"
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Learn more
          <motion.i
            className="bi bi-arrow-right ms-1 d-inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </MotionLink>
      </div>
    </motion.div>
  );
}