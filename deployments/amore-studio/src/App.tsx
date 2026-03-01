import React from 'react';
import './App.css';

function App() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="logo">Amore<span>Studio</span></button>

          <ul className="nav-links">
            <li><button className="nav-link" onClick={() => scrollToSection('portfolio')}>Portfolio</button></li>
            <li><button className="nav-link" onClick={() => scrollToSection('services')}>Services</button></li>
            <li><button className="nav-link" onClick={() => scrollToSection('pricing')}>Pricing</button></li>
          </ul>

          <button className="nav-cta" onClick={() => scrollToSection('contact')}>
            Book Now
          </button>

          <button className="mobile-menu-toggle">☰</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <span className="hero-subtitle">Award-Winning Photography</span>
          <h1 className="hero-title">
            Where Love Becomes
            <br />
            <em>Timeless Art</em>
          </h1>
          <p className="hero-description">
            Professional photography that captures genuine moments, raw emotions,
            and unique stories that make your love extraordinary.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => scrollToSection('portfolio')}>
              View Portfolio
            </button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
              Book Your Session
            </button>
          </div>
        </div>
      </header>

      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2>Selected Works</h2>
            <p>A glimpse into love stories we've had the honor of capturing.</p>
          </div>

          <div className="portfolio-grid">
            {[
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop', title: 'Elegant Wedding', category: 'Wedding' },
              { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop', title: 'Bride Portrait', category: 'Portrait' },
              { url: 'https://images.unsplash.com/photo-1519225421980-715cb94f0b18?w=800&h=1000&fit=crop', title: 'Wedding Rings', category: 'Wedding' },
              { url: 'https://images.unsplash.com/photo-1529634597503-715cb94f0b18?w=800&h=1000&fit=crop', title: 'Family Love', category: 'Family' },
              { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc68a4a?w=800&h=1000&fit=crop', title: 'Engagement Joy', category: 'Couple' },
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', title: 'First Dance', category: 'Wedding' }
            ].map((item, index) => (
              <div key={index} className="portfolio-item">
                <img src={item.url} alt={item.title} loading="lazy" />
                <div className="portfolio-overlay">
                  <h3 className="portfolio-title">{item.title}</h3>
                  <span className="portfolio-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Expertise</span>
            <h2>Our Services</h2>
            <p>From intimate portraits to grand celebrations, we create visual narratives that last a lifetime.</p>
          </div>

          <div className="pricing-grid" style={{ marginTop: '60px' }}>
            {[
              { name: 'Wedding Photography', price: '$1,200+', features: ['Full-day coverage', 'Engagement session', 'Online gallery', 'Premium editing'] },
              { name: 'Family Portraits', price: '$450', features: ['2-hour session', 'Multiple locations', '20+ edited photos', 'Print-ready files'] },
              { name: 'Portrait Sessions', price: '$299', features: ['Custom themed session', 'Studio or outdoor', '15+ edited photos', 'Social media ready'] }
            ].map((service, index) => (
              <div key={index} className="pricing-card">
                <h3 className="pricing-name">{service.name}</h3>
                <div className="pricing-price">{service.price}</div>
                <ul className="pricing-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button className="btn btn-primary pricing-cta">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Investment</span>
            <h2>Pricing Plans</h2>
            <p>Choose a package that suits your needs. All plans include professional editing.</p>
          </div>

          <div className="pricing-grid">
            {[
              { name: 'Essential', price: '$450', popular: false, features: ['1 hour session', '20 edited photos', 'Online gallery', 'Basic editing', 'Digital download'] },
              { name: 'Standard', price: '$699', popular: true, features: ['2 hour session', '50 edited photos', 'Online gallery', 'Premium editing', 'Print release', '1 8×10 print'] },
              { name: 'Premium', price: '$1,199', popular: false, features: ['3 hour session', '100 edited photos', 'Online gallery', 'Premium editing', 'Full print release', 'Photo album', '2 8×10 prints'] }
            ].map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && <div className="pricing-badge">Most Popular</div>}
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">{plan.price} <span>/session</span></div>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button className="btn btn-primary pricing-cta" onClick={() => scrollToSection('contact')}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <p>Whether you're planning your dream wedding or looking for stunning portraits, we're here to bring your vision to life.</p>

              <div className="contact-item">
                <span>📍</span>
                <span>Melbourne, Australia</span>
              </div>
              <div className="contact-item">
                <span>📧</span>
                <span>hello@amorestudio.com</span>
              </div>
              <div className="contact-item">
                <span>📱</span>
                <span>+61 4XX XXX XXX</span>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="service">Service</label>
                <select id="service" name="service" required>
                  <option value="">Select a service</option>
                  <option value="wedding">Wedding Photography</option>
                  <option value="family">Family Portraits</option>
                  <option value="portrait">Portrait Sessions</option>
                  <option value="engagement">Engagement Session</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell us about your vision..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">Amore<span>Studio</span></div>
            <p>Capturing love, one frame at a time.</p>
          </div>
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><button onClick={() => scrollToSection('services')}>Wedding Photography</button></li>
              <li><button onClick={() => scrollToSection('services')}>Family Portraits</button></li>
              <li><button onClick={() => scrollToSection('services')}>Portrait Sessions</button></li>
              <li><button onClick={() => scrollToSection('services')}>Engagement Shoots</button></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><button onClick={() => scrollToSection('portfolio')}>Portfolio</button></li>
              <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
              <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Follow</h4>
            <ul className="footer-links">
              <li><button>Instagram</button></li>
              <li><button>Facebook</button></li>
              <li><button>Pinterest</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 Amore Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
