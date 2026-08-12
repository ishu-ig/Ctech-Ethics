import React from 'react';
import { motion } from 'framer-motion';

const clients = [
  { id: 1, src: 'assets/img/clients/clients-1.webp', name: 'Client One' },
  { id: 2, src: 'assets/img/clients/clients-2.webp', name: 'Client Two' },
  { id: 3, src: 'assets/img/clients/clients-3.webp', name: 'Client Three' },
  { id: 4, src: 'assets/img/clients/clients-4.webp', name: 'Client Four' },
  { id: 5, src: 'assets/img/clients/clients-5.webp', name: 'Client Five' },
  { id: 6, src: 'assets/img/clients/clients-6.webp', name: 'Client Six' },
  { id: 7, src: 'assets/img/clients/clients-7.webp', name: 'Client Seven' },
  { id: 8, src: 'assets/img/clients/clients-8.webp', name: 'Client Eight' },
];

// Quadruple array for continuous seamless infinite marquee
const track = [...clients, ...clients, ...clients, ...clients];

export default function ClientsSection() {
  return (
    <section id="clients" className="clients-premium section">
      <div className="container">
        {/* Header */}
        <motion.div
          className="clients-header-minimal text-center mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span className="clients-eyebrow-minimal mb-2">
            <i className="bi bi-shield-check me-1"></i>Trusted Partners
          </span>
          <h3 className="clients-title mt-2">Trusted By Industry Leaders</h3>
        </motion.div>
      </div>

      {/* Single Smooth Infinite Marquee Logo Track */}
      <motion.div
        className="clients-marquee-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="clients-marquee-fade-left" />
        <div className="clients-marquee-fade-right" />

        <div className="clients-marquee-track">
          {track.map((client, idx) => (
            <div className="clients-logo-card" key={`${client.id}-${idx}`}>
              <img
                src={client.src}
                alt={client.name}
                className="clients-logo-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}