import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Portfolio = () => {
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const portfolioItems = [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop', category: 'wedding', title: 'Elegant Wedding', featured: true },
    { id: 2, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=800&fit=crop', category: 'portrait', title: 'Bride Portrait', featured: false },
    { id: 3, url: 'https://images.unsplash.com/photo-1519225421980-715cb94f0b18?w=600&h=800&fit=crop', category: 'wedding', title: 'Wedding Rings', featured: false },
    { id: 4, url: 'https://images.unsplash.com/photo-1529634597503-715cb94f0b18?w=600&h=800&fit=crop', category: 'family', title: 'Family Love', featured: false },
    { id: 5, url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc68a4a?w=800&h=1000&fit=crop', category: 'couple', title: 'Engagement Joy', featured: true },
    { id: 6, url: 'https://images.unsplash.com/photo-1583939003579-715cb94f0b18?w=600&h=800&fit=crop', category: 'wedding', title: 'Ceremony Moment', featured: false },
    { id: 7, url: 'https://images.unsplash.com/photo-1511460912540-c13c6b99a4d?w=600&h=800&fit=crop', category: 'portrait', title: 'Editorial Beauty', featured: false },
    { id: 8, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', category: 'wedding', title: 'First Dance', featured: false },
    { id: 9, url: 'https://images.unsplash.com/photo-1522673607200-1645062b4a8e?w=600&h=800&fit=crop', category: 'couple', title: 'Romantic Sunset', featured: false },
    { id: 10, url: 'https://images.unsplash.com/photo-1460978812857-470ed1c6a5b9?w=800&h=600&fit=crop', category: 'wedding', title: 'Vows Exchange', featured: false },
    { id: 11, url: 'https://images.unsplash.com/photo-1537633552985-df8429e8018b?w=600&h=800&fit=crop', category: 'family', title: 'Family Hug', featured: false },
    { id: 12, url: 'https://images.unsplash.com/photo-1583939003579-715cb94f0b18?w=800&h=600&fit=crop', category: 'portrait', title: 'Groom Portrait', featured: false }
  ];

  const filters = ['all', 'wedding', 'portrait', 'couple', 'family'];

  const filteredItems = filter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === filter);

  const categories: Record<string, string> = {
    all: 'All Works',
    wedding: 'Weddings',
    portrait: 'Portraits',
    couple: 'Couples',
    family: 'Families'
  };

  return (
    <section className="section portfolio" ref={ref} id="portfolio">
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
            Our Work
          </motion.span>
          <h2>Portfolio</h2>
          <div className="divider" />
          <p className="section-tagline">
            A glimpse into love stories we've had the honor of capturing.
            Every image tells a unique narrative.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="portfolio-filters"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filters.map((f, index) => (
            <motion.button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, delay: 0.05 * index }}
            >
              {categories[f]}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className="portfolio-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={`${filter}-${item.id}`}
                className={`portfolio-item ${item.featured ? 'featured' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedImage(item.id)}
              >
                <img src={item.url} alt={item.title} loading="lazy" />
                <motion.div
                  className="portfolio-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{item.title}</h3>
                  <span className="portfolio-category">{item.category}</span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        <motion.div
          className="portfolio-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            View Full Portfolio →
          </motion.button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="lightbox-close"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              ×
            </motion.button>
            <motion.img
              className="lightbox-image"
              src={portfolioItems.find(i => i.id === selectedImage)?.url}
              alt="Portfolio image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            />
            <motion.div
              className="lightbox-caption"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {portfolioItems.find(i => i.id === selectedImage)?.title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
