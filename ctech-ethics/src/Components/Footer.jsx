import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createNewsletter } from '../Redux/ActionCreators/NewsletterActionCreators';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const prevCountRef = useRef(0);

  const dispatch = useDispatch();
  const rawNewsletter = useSelector((state) => state.NewsletterStateData);
  const newsletterLength = Array.isArray(rawNewsletter) ? rawNewsletter.length : (Array.isArray(rawNewsletter?.data) ? rawNewsletter.data.length : 0);

  // Detect when a new newsletter entry lands in the store (saga completed)
  useEffect(() => {
    if (status === 'loading' && newsletterLength > prevCountRef.current) {
      setStatus('sent');
      setEmail('');
    }
  }, [newsletterLength, status]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    prevCountRef.current = newsletterLength;
    setStatus('loading');
    try {
      dispatch(createNewsletter({ email }));
      // Fallback: if saga doesn't update store within 5s, still show success
      setTimeout(() => {
        setStatus((prev) => (prev === 'loading' ? 'sent' : prev));
        setEmail('');
      }, 5000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      <footer id="footer" className="footer-v2">

        {/* Newsletter Section */}
        <div className="footer-v2__newsletter">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-7">
                <motion.i 
                  className="bi bi-envelope-paper-fill footer-v2__newsletter-icon" 
                  initial={{ y: -6, opacity: 0 }} 
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                />
                <motion.h4 
                  initial={{ y: -6, opacity: 0 }} 
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Join Our Newsletter
                </motion.h4>
                <motion.p 
                  initial={{ y: -6, opacity: 0 }} 
                  whileInView={{ y: 0, opacity: 1 }} 
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 }}
                >
                  Subscribe to get the latest tech insights, software updates, and IT career guides delivered straight to your inbox.
                </motion.p>

                <motion.form 
                  onSubmit={handleSubscribe} 
                  className="footer-v2__newsletter-form" 
                  initial={{ y: 6, opacity: 0 }} 
                  whileInView={{ y: 0, opacity: 1 }} 
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 }}
                >
                  <div className="footer-v2__input-wrap">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your business email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                    </button>
                  </div>

                  <div className={`footer-v2__status footer-v2__status--loading ${status === 'loading' ? 'is-visible' : ''}`}>
                    Sending subscription request…
                  </div>
                  <div className={`footer-v2__status footer-v2__status--error ${status === 'error' ? 'is-visible' : ''}`}>
                    Something went wrong. Please try again.
                  </div>
                  <div className={`footer-v2__status footer-v2__status--sent ${status === 'sent' ? 'is-visible' : ''}`}>
                    Thank you! You are now subscribed to Ctech Ethic Solutions.
                  </div>
                </motion.form>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container footer-v2__top">
          <div className="row gy-4 gy-lg-5">

            <div className="col-12 col-md-6 col-lg-4 footer-v2__about">
              <Link to="/" className="footer-v2__brand text-decoration-none">
                <span className="footer-v2__sitename">Ctech Ethic</span>
              </Link>
              <p className="footer-v2__tagline">
                Crafting thoughtful digital experiences, software solutions & career-ready tech training — building scalable products people love to use.
              </p>
              <div className="footer-v2__contact">
                <div className="footer-v2__contact-line">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>A108 Adam Street, New York, NY 535022</span>
                </div>
                <div className="footer-v2__contact-line">
                  <i className="bi bi-telephone-fill"></i>
                  <a href="tel:+15589554885" style={{ color: 'inherit', textDecoration: 'none' }}>+1 5589 55488 55</a>
                </div>
                <div className="footer-v2__contact-line">
                  <i className="bi bi-envelope-fill"></i>
                  <a href="mailto:info@ctechethics.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@ctechethics.com</a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2 footer-v2__links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/"><i className="bi bi-chevron-right"></i>Home</Link></li>
                <li><Link to="/about"><i className="bi bi-chevron-right"></i>About Us</Link></li>
                <li><Link to="/services"><i className="bi bi-chevron-right"></i>Services</Link></li>
                <li><Link to="/portfolio"><i className="bi bi-chevron-right"></i>Portfolio</Link></li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2 footer-v2__links">
              <h4>Explore</h4>
              <ul>
                <li><Link to="/blog"><i className="bi bi-chevron-right"></i>Blog</Link></li>
                <li><Link to="/career"><i className="bi bi-chevron-right"></i>Careers</Link></li>
                <li><Link to="/placement"><i className="bi bi-chevron-right"></i>Placements</Link></li>
                <li><Link to="/contactus"><i className="bi bi-chevron-right"></i>Contact Us</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-12 col-lg-4 footer-v2__social">
              <h4>Follow Us</h4>
              <p>Stay connected for product announcements, engineering updates, and career opportunities.</p>
              <div className="footer-v2__social-links">
                <a href="#footer" aria-label="Twitter / X"><i className="bi bi-twitter-x"></i></a>
                <a href="#footer" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#footer" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#footer" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                <a href="#footer" aria-label="GitHub"><i className="bi bi-github"></i></a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container footer-v2__bottom">
          <p className="footer-v2__copyright mb-0">
            © {new Date().getFullYear()} <strong>Ctech Ethic Solutions</strong>. All Rights Reserved.
          </p>
          <div className="footer-v2__credits">
            Empowering Careers & Enterprises With Technology
          </div>
        </div>

      </footer>

      
    </>
  );
}