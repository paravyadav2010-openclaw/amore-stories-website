import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const BeforeAfter = () => {
  const { ref, inView } = useInView();
  const [activeSlide, setActiveSlide] = useState(0);

  const transformations = [
    {
      before: 'https://images.unsplash.com/photo-1522673607200-1645062b4a8e?w=800&h=1000&fit=crop',
      after: 'https://images.unsplash.com/photo-1519225421980-715cb94f0b18?w=800&h=1000&fit=crop',
      label: 'Engagement Session',
      description: 'From shy couple to confident connection'
    },
    {
      before: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop',
      after: 'https://images.unsplash.com/photo-1583939003579-730de3978a4a?w=800&h=1000&fit=crop',
      label: 'Bridal Portrait',
      description: 'Natural beauty, expertly captured'
    },
    {
      before: 'https://images.unsplash.com/photo-1460978812857-470ed1c6a5b9?w=800&h=1000&fit=crop',
      after: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop',
      label: 'Wedding Day',
      description: 'Documenting every precious moment'
    }
  ];

  return (
    <section className="section before-after" ref={ref} id="before-after">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Transformations
          </motion.span>
          <h2>The Magic of Post-Processing</h2>
          <div className="divider" />
          <p className="section-tagline">
            See the difference professional editing makes. We enhance the natural beauty
            without altering the authentic moments.
          </p>
        </motion.div>

        {/* Transformation Slider */}
        <div className="transformation-slider">
          <motion.div
            className="transform-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            key={activeSlide}
          >
            <div className="transform-images">
              {/* Before */}
              <div className="transform-side before">
                <img
                  src={transformations[activeSlide].before}
                  alt="Before"
                />
                <div className="transform-label">Before</div>
              </div>

              {/* After */}
              <div className="transform-side after">
                <img
                  src={transformations[activeSlide].after}
                  alt="After"
                />
                <div className="transform-label">After</div>
              </div>
            </div>

            {/* Info Overlay */}
            <motion.div
              className="transform-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3>{transformations[activeSlide].label}</h3>
              <p>{transformations[activeSlide].description}</p>
            </motion.div>
          </motion.div>

          {/* Slider Controls */}
          <div className="slider-controls">
            <div className="slider-dots">
              {transformations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`dot ${activeSlide === index ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <div className="slider-arrows">
              <motion.button
                className="arrow-button prev"
                onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                disabled={activeSlide === 0}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ←
              </motion.button>
              <motion.button
                className="arrow-button next"
                onClick={() => setActiveSlide(Math.min(transformations.length - 1, activeSlide + 1))}
                disabled={activeSlide === transformations.length - 1}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="transformation-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>Want the same magical results for your special day?</p>
          <motion.button
            className="btn-primary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Book Your Session
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;
