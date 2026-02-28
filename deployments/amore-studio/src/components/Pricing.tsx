import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Pricing = () => {
  const { ref, inView } = useInView();
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'essential',
      name: 'Essential',
      tagline: 'Perfect for intimate sessions',
      price: 450,
      popular: false,
      features: [
        '1 Hour Session',
        '20 Edited Photos',
        'Online Gallery',
        'Basic Editing',
        'Digital Download'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      tagline: 'Most Popular Choice',
      price: 699,
      popular: true,
      features: [
        '2 Hour Session',
        '50 Edited Photos',
        'Online Gallery',
        'Premium Editing',
        'Print Release',
        '1 8×10 Print'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Complete Experience',
      price: 1199,
      popular: false,
      features: [
        '3 Hour Session',
        '100 Edited Photos',
        'Online Gallery',
        'Premium Editing',
        'Full Print Release',
        'Photo Album Included',
        '2 8×10 Prints'
      ]
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section pricing" ref={ref} id="pricing">
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
            Investment
          </motion.span>
          <h2>Pricing Plans</h2>
          <div className="divider" />
          <p className="section-tagline">
            Choose the package that suits your needs. All plans include
            professional editing and online gallery access.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="billing-toggle"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span>Monthly</span>
          <motion.button
            className={`toggle-switch ${billing === 'yearly' ? 'active' : ''}`}
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="toggle-knob"
              animate={{ x: billing === 'yearly' ? 24 : 0 }}
              transition={{ duration: 0.3, type: 'spring' }}
            />
          </motion.button>
          <span>Yearly <span className="save-badge">Save 20%</span></span>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'featured' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
              initial={{ y: 50, opacity: 0, scale: plan.popular ? 0.9 : 1 }}
              animate={{ y: 0, opacity: 1, scale: plan.popular ? 1.05 : 1 }}
              whileHover={{ y: -10, scale: plan.popular ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              transition={{ duration: 0.8, delay: 0.6 + (index * 0.1) }}
            >
              {plan.popular && (
                <motion.div
                  className="popular-badge"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  Most Popular
                </motion.div>
              )}

              <motion.h3
                className="pricing-name"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {plan.name}
              </motion.h3>

              <motion.div
                className="pricing-price"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                ${Math.round(plan.price * (billing === 'yearly' ? 0.8 : 1)).toLocaleString()}
                <span>/ {billing}</span>
              </motion.div>

              <motion.p
                className="pricing-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {plan.tagline}
              </motion.p>

              <motion.ul
                className="pricing-features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 + (idx * 0.1) }}
                  >
                    <span className="feature-icon">✓</span>
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.button
                className={`pricing-cta ${plan.popular ? 'featured' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSection('contact');
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -2, scale: plan.popular ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, delay: 1.3 }}
              >
                Choose {plan.name}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="faq-section"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            {[
              { q: 'How long until I receive my photos?', a: 'Online gallery within 2 weeks, print delivery within 4 weeks.' },
              { q: 'Do you offer payment plans?', a: 'Yes! We offer flexible payment plans with 0% interest.' },
              { q: 'What if the weather is bad?', a: 'We have backup indoor locations and rescheduling options.' },
              { q: 'Can I customize my package?', a: 'Absolutely! Contact us to discuss your specific needs.' }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + (idx * 0.1) }}
              >
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
