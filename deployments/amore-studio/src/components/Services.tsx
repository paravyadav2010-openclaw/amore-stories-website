import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Services = () => {
  const { ref, inView } = useInView();

  const services = [
    {
      icon: '💍',
      title: 'Wedding Photography',
      description: 'Full-day coverage capturing every magical moment of your special day with artistry and precision.',
      features: [
        '8+ Hours Coverage',
        'Engagement Session Included',
        'Online Gallery in 2 Weeks',
        'Premium Editing Suite',
        'Print-Ready High-Res Files'
      ],
      cta: 'View Wedding Packages'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Portraits',
      description: 'Stunning family portraits that capture your unique bond and create lasting memories across generations.',
      features: [
        '2-Hour Studio Session',
        'Multiple Location Options',
        'Wardrobe Consultation',
        '20+ Professionally Edited Images',
        'Digital + Print Delivery'
      ],
      cta: 'Book Family Session'
    },
    {
      icon: '✨',
      title: 'Portrait Sessions',
      description: 'Professional portraits for individuals, couples, or special occasions with creative direction.',
      features: [
        'Custom Themed Sessions',
        'Indoor & Outdoor Settings',
        'Professional Lighting Setup',
        '15+ Edited Images',
        'Social Media Ready'
      ],
      cta: 'Book Portrait Session'
    }
  ];

  return (
    <section className="section services" ref={ref} id="services">
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
            Expertise
          </motion.span>
          <h2>Our Services</h2>
          <div className="divider" />
          <p className="section-tagline">
            From intimate portraits to grand celebrations, we create visual narratives
            that last a lifetime with artistry and care.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={inView ? { y: 0, opacity: 1, scale: 1 } : { y: 50, opacity: 0, scale: 0.9 }}
              whileHover={{ y: -15, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
            >
              <motion.div
                className="service-icon"
                whileHover={{ rotateY: 360 }}
                transition={{ duration: 0.6 }}
              >
                {service.icon}
              </motion.div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={inView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) + (idx * 0.1) }}
                  >
                    ✓ {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                className="service-cta"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {service.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
