import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const { ref, inView } = useInView();

  return (
    <section className="hero" ref={ref} id="hero">
      {/* Background with Video Parallax */}
      <div className="hero-bg">
        <motion.div
          className="hero-video-overlay"
          initial={{ scale: 1 }}
          animate={{ scale: inView ? 1.1 : 1 }}
          transition={{ duration: 20, ease: 'linear' }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
            poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3cd3543bb26&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="hero-gradient" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.span
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Award-Winning Photography
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Where Love Becomes
            <br />
            <motion.span
              className="highlight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Timeless Art
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Professional photography that captures genuine moments, raw emotions,
            and unique stories that make your love extraordinary.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              className="cta-primary"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              View Portfolio
            </motion.button>
            <motion.button
              className="cta-secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Book Your Session
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="trust-item">
            <span className="trust-number">500+</span>
            <span className="trust-label">Happy Couples</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">50+</span>
            <span className="trust-label">Awards Won</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">99%</span>
            <span className="trust-label">Satisfaction</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="floating-particles"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: 1,
              opacity: 0.3 + Math.random() * 0.4
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.1
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="scroll-dot" />
        </motion.div>
        <span className="scroll-text">Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default Hero;
