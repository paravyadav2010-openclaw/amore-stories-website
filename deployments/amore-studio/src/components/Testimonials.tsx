import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Testimonials = () => {
  const { ref, inView } = useInView();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah & Michael',
      role: 'Wedding Couple',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      text: 'Amore Studio captured our wedding day absolutely perfectly. Every emotion, every moment, every smile - they made it feel like art. We couldn\'t be happier with the results!',
      rating: 5
    },
    {
      id: 2,
      name: 'Emily Chen',
      role: 'Family Portrait',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'The family portraits are stunning. The photographer made everyone feel comfortable, especially our shy kids. The photos look natural and authentic - just like our family.',
      rating: 5
    },
    {
      id: 3,
      name: 'James & Lisa',
      role: 'Engagement Session',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd72207f3?w=100&h=100&fit=crop',
      text: 'Our engagement shoot exceeded all expectations. The creative direction, the locations, the final images - everything was perfect. Highly recommend for any special occasion!',
      rating: 5
    },
    {
      id: 4,
      name: 'The Thompson Family',
      role: 'Multi-Generation Portrait',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
      text: 'Three generations captured in one beautiful session. The photographer has an incredible eye for detail and emotion. We\'ll treasure these photos forever.',
      rating: 5
    }
  ];

  return (
    <section className="section testimonials" ref={ref} id="testimonials">
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
            Social Proof
          </motion.span>
          <h2>What Our Clients Say</h2>
          <div className="divider" />
          <p className="section-tagline">
            Don't just take our word for it. Hear from the couples and families
            who trusted us with their most precious moments.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          className="testimonials-carousel"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="testimonial-card"
            key={activeTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Quote Icon */}
            <motion.div
              className="quote-icon"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              "
            </motion.div>

            {/* Testimonial Text */}
            <motion.blockquote
              className="testimonial-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {testimonials[activeTestimonial].text}
            </motion.blockquote>

            {/* Rating */}
            <motion.div
              className="testimonial-rating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <motion.span
                  key={i}
                  className="star"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (i * 0.1) }}
                >
                  ★
                </motion.span>
              ))}
            </motion.div>

            {/* Author */}
            <motion.div
              className="testimonial-author"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <img
                src={testimonials[activeTestimonial].image}
                alt={testimonials[activeTestimonial].name}
                className="author-image"
              />
              <div className="author-info">
                <h4>{testimonials[activeTestimonial].name}</h4>
                <span>{testimonials[activeTestimonial].role}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Carousel Controls */}
          <div className="carousel-controls">
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`carousel-dot ${activeTestimonial === index ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <div className="carousel-arrows">
              <motion.button
                className="arrow-button prev"
                onClick={() => setActiveTestimonial(Math.max(0, activeTestimonial - 1))}
                disabled={activeTestimonial === 0}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ←
              </motion.button>
              <motion.button
                className="arrow-button next"
                onClick={() => setActiveTestimonial(Math.min(testimonials.length - 1, activeTestimonial + 1))}
                disabled={activeTestimonial === testimonials.length - 1}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="trust-badges"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="badge-item">
            <div className="badge-icon">✓</div>
            <span>500+ Happy Couples</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">★</div>
            <span>5-Star Average Rating</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">🏆</div>
            <span>50+ Industry Awards</span>
          </div>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          className="client-logos"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="logos-title">Featured In</p>
          <div className="logos-grid">
            {['WeddingWire', 'Martha Stewart', 'Bridal Guide', 'Vogue', 'Elle'].map((logo, index) => (
              <motion.div
                key={logo}
                className="logo-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + (index * 0.1) }}
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
