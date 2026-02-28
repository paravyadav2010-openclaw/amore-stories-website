import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { inView } = useInView();

  const footerLinks = {
    services: [
      { text: 'Wedding Photography', href: '#services' },
      { text: 'Family Portraits', href: '#services' },
      { text: 'Portrait Sessions', href: '#services' },
      { text: 'Engagement Shoots', href: '#services' }
    ],
    company: [
      { text: 'About Us', href: '#' },
      { text: 'Portfolio', href: '#portfolio' },
      { text: 'Blog', href: '#' },
      { text: 'Contact', href: '#contact' }
    ],
    support: [
      { text: 'FAQ', href: '#pricing' },
      { text: 'Pricing Guide', href: '#pricing' },
      { text: 'Terms & Conditions', href: '#' },
      { text: 'Privacy Policy', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'IG', url: '#', label: 'Instagram' },
    { name: 'FB', url: '#', label: 'Facebook' },
    { name: 'TW', url: '#', label: 'Twitter' },
    { name: 'PI', url: '#', label: 'Pinterest' }
  ];

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <motion.div
            className="footer-brand"
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-logo">Amore<span>Studio</span></div>
            <p className="footer-tagline">
              Capturing love, one frame at a time.
            </p>

            {/* Social Links */}
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3, rotateY: 360 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    opacity: { duration: 0.5, delay: index * 0.1 },
                    scale: { duration: 0.3 },
                    rotateY: { duration: 0.6 }
                  }}
                  aria-label={social.label}
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              {footerLinks.services.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
                >
                  <motion.button
                    onClick={() => {
                      if (link.href.startsWith('#')) {
                        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.open(link.href, '_blank');
                      }
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {link.text}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.05) }}
                >
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {link.text}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.05) }}
                >
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {link.text}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          className="footer-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span>Award-Winning Service</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span>Secure Payments</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">★</span>
            <span>5-Star Rated</span>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>© {currentYear} Amore Studio. All rights reserved. Crafted with ❤️</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Cookie Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
