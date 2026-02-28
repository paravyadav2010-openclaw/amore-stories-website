import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Gallery = () => {
  const { ref, inView } = useInView();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filters = ['all', 'weddings', 'portraits', 'couples', 'families'];

  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop', category: 'weddings', title: 'Wedding Day' },
    { id: 2, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=800&fit=crop', category: 'portraits', title: 'Bride Portrait' },
    { id: 3, url: 'https://images.unsplash.com/photo-1519225421980-715cb94f0b18?w=600&h=800&fit=crop', category: 'weddings', title: 'Wedding Rings' },
    { id: 4, url: 'https://images.unsplash.com/photo-1529634597503-715cb94f0b18?w=600&h=800&fit=crop', category: 'families', title: 'Family Portrait' },
    { id: 5, url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc68a07?w=600&h=800&fit=crop', category: 'weddings', title: 'Engagement Couple', featured: true },
    { id: 6, url: 'https://images.unsplash.com/photo-1583939003579-715cb94f0b18?w=600&h=800&fit=crop', category: 'couples', title: 'Celebration' },
    { id: 7, url: 'https://images.unsplash.com/photo-1511460912540-c13c6b99a4d?w=600&h=800&fit=crop', category: 'portraits', title: 'Editorial Shot' },
    { id: 8, url: 'https://images.unsplash.com/photo-1460978812857-470ed1c6a5b9?w=600&h=800&fit=crop', category: 'weddings', title: 'Ceremony' }
  ];

  const filteredImages = selectedFilter === 'all'
    ? images
    : images.filter(img => img.category === selectedFilter);

  return (
    <section className="section gallery" ref={ref} id="gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: inView ? 0.2 : 0 }}
        >
          <h2>Our Portfolio</h2>
          <div className="divider"></div>
          <p className="section-tagline">
            A glimpse into love stories we've had the honor of capturing.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="gallery-filters"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: inView ? 0.4 : 0 }}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.05 * filters.indexOf(filter) }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className={`gallery-item ${image.featured ? 'featured' : ''}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, delay: inView ? 0.6 + (index * 0.05) : 0 }}
              onClick={() => setSelectedImage(image.id)}
            >
              <motion.img
                src={image.url}
                alt={image.title}
                initial={{ scale: 1.1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="gallery-overlay">
                <motion.div
                  className="gallery-title"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {image.title}
                </motion.div>
                <div className="gallery-category">
                  {image.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
              whileHover={{ rotate: 90, scale: 1.1, background: 'rgba(201, 169, 89, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              ×
            </motion.button>

            <motion.img
              className="lightbox-image"
              src={images.find(img => img.id === selectedImage)?.url}
              alt="Gallery image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              className="lightbox-caption"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {images.find(img => img.id === selectedImage)?.title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
