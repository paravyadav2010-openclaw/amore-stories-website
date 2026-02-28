import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Contact = () => {
  const { ref, inView } = useInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', service: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Location',
      description: 'Melbourne, Australia',
      cta: 'View on Map'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'hello@amorestudio.com',
      cta: 'Send Email'
    },
    {
      icon: '📱',
      title: 'Phone',
      description: '+61 4XX XXX XXX',
      cta: 'Call Us'
    }
  ];

  return (
    <section className="section contact" ref={ref} id="contact">
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
            Get In Touch
          </motion.span>
          <h2>Start Your Journey</h2>
          <div className="divider" />
          <p className="section-tagline">
            Whether you're planning your dream wedding or looking for stunning portraits,
            we're here to bring your vision to life.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Info */}
          <motion.div
            className="contact-info"
            initial={{ x: -50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="contact-description">
              Reach out to us through any of these channels.
              We typically respond within 24 hours.
            </p>

            <div className="contact-details">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="contact-item"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <motion.button
                      className="contact-link"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.cta} →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="contact-form"
            initial={{ x: 50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSubmit}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  className="form-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="success-icon"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    ✓
                  </motion.div>
                  <h4>Message Sent!</h4>
                  <p>We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  {['name', 'email', 'service', 'message'].map((field, index) => (
                    <motion.div
                      key={field}
                      className="form-group"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                    >
                      <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {field === 'service' ? (
                        <select
                          id={field}
                          name={field}
                          value={formData[field as keyof typeof formData]}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a service</option>
                          <option value="wedding">Wedding Photography</option>
                          <option value="family">Family Portraits</option>
                          <option value="portrait">Portrait Session</option>
                          <option value="engagement">Engagement Session</option>
                          <option value="other">Other</option>
                        </select>
                      ) : field === 'message' ? (
                        <textarea
                          id={field}
                          name={field}
                          value={formData[field as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder="Tell us about your vision..."
                          required
                          rows={5}
                        />
                      ) : (
                        <input
                          id={field}
                          name={field}
                          type={field === 'email' ? 'email' : 'text'}
                          value={formData[field as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder={field === 'name' ? 'Your full name' : 'Your email address'}
                          required
                        />
                      )}
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    className={`form-submit ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      'Send Message →'
                    )}
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
