# Hannah McClune Photography — UX Architecture & Component Specification

**Version:** 1.0
**Last Updated:** February 27, 2026
**Author:** Cloye ✨

---

## Table of Contents
1. [Page Hierarchy](#page-hierarchy)
2. [Component Breakdown](#component-breakdown)
3. [Responsive Design Strategy](#responsive-design-strategy)
4. [Accessibility Requirements](#accessibility-requirements)
5. [Wireframe Descriptions](#wireframe-descriptions)

---

## 1. Page Hierarchy

### Overall Layout Structure
```
┌─────────────────────────────────────────┐
│  Header/Navigation (Sticky)             │
├─────────────────────────────────────────┤
│  Hero Section (100vh)                   │
├─────────────────────────────────────────┤
│  About/Intro Section                    │
├─────────────────────────────────────────┤
│  CTA Section (Book Session)             │
├─────────────────────────────────────────┤
│  Galleries Section (Filterable)         │
├─────────────────────────────────────────┤
│  Testimonials Section                    │
├─────────────────────────────────────────┤
│  Instagram Feed Section                  │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Section Details

#### 1. Header/Navigation
- **Position:** Fixed/Sticky top
- **Height:** 80px (desktop), 64px (mobile)
- **Purpose:** Primary navigation, brand identity, quick access to actions
- **Visibility:** Always visible with glassmorphism effect

#### 2. Hero Section
- **Height:** 100vh (viewport height)
- **Purpose:** Immediate visual impact, brand introduction, primary CTA
- **Key Elements:** Background hero image, photographer name, tagline, primary CTA

#### 3. About/Intro Section
- **Height:** Auto (minimum 60vh)
- **Purpose:** Personal story, expertise, differentiation
- **Key Elements:** Photographer portrait, bio, experience highlights, brand values

#### 4. CTA Section (Book Session)
- **Height:** Auto (minimum 40vh)
- **Purpose:** Conversion trigger, session booking
- **Key Elements:** Compelling headline, booking options, social proof

#### 5. Galleries Section
- **Height:** Auto (scrollable)
- **Purpose:** Showcase work, portfolio demonstration, style preview
- **Key Elements:** Category filters, masonry gallery, image lightbox, project details

#### 6. Testimonials Section
- **Height:** Auto
- **Purpose:** Social proof, credibility building
- **Key Elements:** Client quotes, client photos, star ratings, carousel navigation

#### 7. Instagram Feed Section
- **Height:** Auto
- **Purpose:** Fresh content, social proof, engagement
- **Key Elements:** Instagram grid, recent posts, follow CTA

#### 8. Footer
- **Height:** Auto
- **Purpose:** Navigation, contact info, legal, social links
- **Key Elements:** Site links, contact info, social icons, copyright, legal links

---

## 2. Component Breakdown

### 2.1 Header/Navigation Component

#### HTML Structure
```html
<header class="navbar fixed top-0 left-0 right-0 z-50">
  <nav class="nav-container">
    <!-- Logo -->
    <a href="/" class="logo" aria-label="Hannah McClune Photography - Home">
      <span class="logo-text">Hannah McClune</span>
    </a>

    <!-- Desktop Navigation -->
    <ul class="nav-links desktop-only">
      <li><a href="#about">About</a></li>
      <li><a href="#galleries">Galleries</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <!-- CTA Button -->
    <button class="btn-cta" aria-label="Book a photography session">
      Book Now
    </button>

    <!-- Mobile Menu Toggle -->
    <button class="mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
      <span class="hamburger"></span>
    </button>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu" role="dialog" aria-label="Mobile navigation">
    <ul class="mobile-nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#galleries">Galleries</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</header>
```

#### Responsive Behavior
- **Desktop (> 1024px):** Horizontal nav links visible, mobile toggle hidden
- **Tablet (768px - 1024px):** Horizontal nav links visible, mobile toggle hidden
- **Mobile (< 768px):** Nav links hidden, mobile toggle visible, full-screen overlay menu

#### Interaction Patterns
- **Scroll:** Glassmorphism opacity increases on scroll (0 → 0.95)
- **Hover:** Link underline animation (left to right)
- **Mobile Toggle:** Morphing hamburger → X icon with rotation
- **Focus:** Keyboard navigable with visible focus rings

#### Data Requirements
```json
{
  "logo": {
    "text": "Hannah McClune",
    "url": "/"
  },
  "navLinks": [
    { "label": "About", "href": "#about" },
    { "label": "Galleries", "href": "#galleries" },
    { "label": "Testimonials", "href": "#testimonials" },
    { "label": "Contact", "href": "#contact" }
  ],
  "cta": {
    "text": "Book Now",
    "href": "#contact",
    "ariaLabel": "Book a photography session"
  }
}
```

---

### 2.2 Hero Section Component

#### HTML Structure
```html
<section class="hero" id="hero">
  <!-- Background Image -->
  <div class="hero-background">
    <img
      src="/images/hero-bg.jpg"
      alt="Stunning photography background"
      class="hero-image"
      loading="eager"
    />
    <div class="hero-overlay"></div>
  </div>

  <!-- Content -->
  <div class="hero-content">
    <div class="hero-text">
      <p class="hero-subtitle">Professional Photography</p>
      <h1 class="hero-title">Hannah McClune</h1>
      <p class="hero-tagline">Capturing Life's Precious Moments</p>
      <p class="hero-description">
        Award-winning photographer specializing in portraits, weddings,
        and lifestyle photography based in Melbourne, Australia.
      </p>

      <!-- CTAs -->
      <div class="hero-cta-group">
        <a href="#galleries" class="btn btn-primary">
          View Portfolio
        </a>
        <a href="#contact" class="btn btn-secondary">
          Book a Session
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <span class="scroll-text">Scroll to explore</span>
      <div class="scroll-arrow"></div>
    </div>
  </div>
</section>
```

#### Responsive Behavior
- **Desktop (> 1024px):** Full-width background, centered text, large typography (72px title)
- **Tablet (768px - 1024px):** Scaled down typography (56px title), optimized spacing
- **Mobile (< 768px):** Stacked CTAs, smaller typography (40px title), padding reduced

#### Interaction Patterns
- **Parallax:** Background image moves at 0.6x scroll speed
- **Load:** Staggered reveal (subtitle → title → description → CTAs, 0.15s delays)
- **Hover:** CTA buttons scale up (1.05) with shadow increase
- **Scroll:** Scroll indicator fades out at 300px scroll position

#### Data Requirements
```json
{
  "hero": {
    "backgroundImage": "/images/hero-bg.jpg",
    "backgroundAlt": "Stunning photography background",
    "subtitle": "Professional Photography",
    "title": "Hannah McClune",
    "tagline": "Capturing Life's Precious Moments",
    "description": "Award-winning photographer specializing in portraits, weddings, and lifestyle photography based in Melbourne, Australia.",
    "ctaPrimary": {
      "text": "View Portfolio",
      "href": "#galleries"
    },
    "ctaSecondary": {
      "text": "Book a Session",
      "href": "#contact"
    }
  }
}
```

---

### 2.3 About/Intro Section Component

#### HTML Structure
```html
<section class="about" id="about">
  <div class="container">
    <div class="about-grid">
      <!-- Left: Image -->
      <div class="about-image-wrapper">
        <div class="about-image-frame">
          <img
            src="/images/hannah-portrait.jpg"
            alt="Hannah McClune - Professional Photographer"
            class="about-image"
          />
        </div>
        <div class="about-decoration"></div>
      </div>

      <!-- Right: Content -->
      <div class="about-content">
        <p class="section-label">About Me</p>
        <h2 class="section-title">Behind the Lens</h2>

        <div class="about-bio">
          <p class="bio-text">
            With over a decade of experience in professional photography, I've
            had the privilege of capturing thousands of precious moments for
            clients across Melbourne and beyond.
          </p>
          <p class="bio-text">
            My approach combines technical expertise with genuine connection —
            I believe the best photographs come from building trust and making
            you feel comfortable in front of the camera.
          </p>
        </div>

        <!-- Stats -->
        <div class="about-stats">
          <div class="stat-item">
            <span class="stat-number">10+</span>
            <span class="stat-label">Years Experience</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">Happy Clients</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">15+</span>
            <span class="stat-label">Awards Won</span>
          </div>
        </div>

        <!-- Signature -->
        <div class="about-signature">
          <img src="/images/signature.svg" alt="Hannah McClune signature" />
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 2-column grid (50% image, 50% content), side-by-side layout
- **Tablet (768px - 1024px):** 2-column grid with reduced spacing, stacked stats (2x2)
- **Mobile (< 768px):** Stacked single column (image top, content bottom), stats 1x3

#### Interaction Patterns
- **Load:** Image slides in from left, content from right (0.6s duration)
- **Hover:** Image frame glows (gold/indigo gradient), slight scale (1.02)
- **Scroll:** Stat numbers animate from 0 → final value when in viewport
- **Focus:** All interactive elements have visible 3px indigo focus ring

#### Data Requirements
```json
{
  "about": {
    "image": {
      "src": "/images/hannah-portrait.jpg",
      "alt": "Hannah McClune - Professional Photographer"
    },
    "signature": {
      "src": "/images/signature.svg",
      "alt": "Hannah McClune signature"
    },
    "bio": [
      "With over a decade of experience in professional photography, I've had the privilege of capturing thousands of precious moments for clients across Melbourne and beyond.",
      "My approach combines technical expertise with genuine connection — I believe the best photographs come from building trust and making you feel comfortable in front of the camera."
    ],
    "stats": [
      { "number": "10+", "label": "Years Experience" },
      { "number": "500+", "label": "Happy Clients" },
      { "number": "15+", "label": "Awards Won" }
    ]
  }
}
```

---

### 2.4 CTA Section Component

#### HTML Structure
```html
<section class="cta" id="cta">
  <div class="cta-background">
    <div class="cta-gradient"></div>
  </div>

  <div class="container">
    <div class="cta-content">
      <div class="cta-text">
        <p class="cta-label">Ready to Create Magic?</p>
        <h2 class="cta-title">Let's Capture Your Story</h2>
        <p class="cta-description">
          Whether it's a milestone celebration, a family portrait, or your
          special day — I'm here to make it unforgettable.
        </p>
      </div>

      <!-- Session Options -->
      <div class="cta-options">
        <div class="session-card">
          <div class="session-icon">📸</div>
          <h3 class="session-title">Portrait Session</h3>
          <p class="session-description">Professional headshots, family photos, or personal branding</p>
          <ul class="session-features">
            <li>1-2 hour session</li>
            <li>20+ edited photos</li>
            <li>Online gallery</li>
          </ul>
          <a href="#contact" class="btn btn-outline">Enquire</a>
        </div>

        <div class="session-card featured">
          <div class="session-badge">Most Popular</div>
          <div class="session-icon">💍</div>
          <h3 class="session-title">Wedding Package</h3>
          <p class="session-description">Full-day coverage, from getting ready to reception</p>
          <ul class="session-features">
            <li>8-hour coverage</li>
            <li>500+ edited photos</li>
            <li>Engagement session</li>
            <li>Wedding album</li>
          </ul>
          <a href="#contact" class="btn btn-primary">Book Now</a>
        </div>

        <div class="session-card">
          <div class="session-icon">🎉</div>
          <h3 class="session-title">Event Coverage</h3>
          <p class="session-description">Corporate events, parties, and special occasions</p>
          <ul class="session-features">
            <li>Custom duration</li>
            <li>Fast turnaround</li>
            <li>Social media ready</li>
          </ul>
          <a href="#contact" class="btn btn-outline">Enquire</a>
        </div>
      </div>

      <!-- Trust Signals -->
      <div class="cta-trust">
        <div class="trust-item">
          <span class="trust-icon">✓</span>
          <span class="trust-text">No deposit required</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">✓</span>
          <span class="trust-text">100% satisfaction guarantee</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">✓</span>
          <span class="trust-text">Flexible payment plans</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 3-column session cards, centered content
- **Tablet (768px - 1024px):** 3-column session cards with reduced padding
- **Mobile (< 768px):** Stacked single column (cards vertical), trust items 1x3

#### Interaction Patterns
- **Load:** Cards stagger reveal (0.1s delays)
- **Hover:** Featured card scales (1.05) with gold glow, standard cards have border glow
- **Click:** Button ripple effect (indigo to gold gradient)
- **Focus:** All interactive elements have visible 3px focus rings

#### Data Requirements
```json
{
  "cta": {
    "label": "Ready to Create Magic?",
    "title": "Let's Capture Your Story",
    "description": "Whether it's a milestone celebration, a family portrait, or your special day — I'm here to make it unforgettable.",
    "sessions": [
      {
        "icon": "📸",
        "title": "Portrait Session",
        "description": "Professional headshots, family photos, or personal branding",
        "features": ["1-2 hour session", "20+ edited photos", "Online gallery"],
        "cta": { "text": "Enquire", "href": "#contact", "variant": "outline" }
      },
      {
        "icon": "💍",
        "title": "Wedding Package",
        "description": "Full-day coverage, from getting ready to reception",
        "features": ["8-hour coverage", "500+ edited photos", "Engagement session", "Wedding album"],
        "cta": { "text": "Book Now", "href": "#contact", "variant": "primary" },
        "badge": "Most Popular"
      },
      {
        "icon": "🎉",
        "title": "Event Coverage",
        "description": "Corporate events, parties, and special occasions",
        "features": ["Custom duration", "Fast turnaround", "Social media ready"],
        "cta": { "text": "Enquire", "href": "#contact", "variant": "outline" }
      }
    ],
    "trust": [
      { "icon": "✓", "text": "No deposit required" },
      { "icon": "✓", "text": "100% satisfaction guarantee" },
      { "icon": "✓", "text": "Flexible payment plans" }
    ]
  }
}
```

---

### 2.5 Galleries Section Component

#### HTML Structure
```html
<section class="galleries" id="galleries">
  <div class="container">
    <div class="galleries-header">
      <p class="section-label">Portfolio</p>
      <h2 class="section-title">My Work</h2>
    </div>

    <!-- Filter Buttons -->
    <div class="filter-controls" role="tablist" aria-label="Gallery categories">
      <button
        class="filter-btn active"
        role="tab"
        aria-selected="true"
        aria-controls="gallery-grid"
        data-filter="all"
      >
        All
      </button>
      <button
        class="filter-btn"
        role="tab"
        aria-selected="false"
        aria-controls="gallery-grid"
        data-filter="weddings"
      >
        Weddings
      </button>
      <button
        class="filter-btn"
        role="tab"
        aria-selected="false"
        aria-controls="gallery-grid"
        data-filter="portraits"
      >
        Portraits
      </button>
      <button
        class="filter-btn"
        role="tab"
        aria-selected="false"
        aria-controls="gallery-grid"
        data-filter="lifestyle"
      >
        Lifestyle
      </button>
      <button
        class="filter-btn"
        role="tab"
        aria-selected="false"
        aria-controls="gallery-grid"
        data-filter="events"
      >
        Events
      </button>
    </div>

    <!-- Gallery Grid -->
    <div class="gallery-grid" id="gallery-grid" role="tabpanel">
      <!-- Gallery Item -->
      <article class="gallery-item" data-category="weddings">
        <div class="gallery-item-wrapper">
          <img
            src="/images/gallery/wedding-1.jpg"
            alt="Wedding photography - bride and groom on beach"
            class="gallery-image"
            loading="lazy"
          />
          <div class="gallery-overlay">
            <h3 class="gallery-title">Sarah & James</h3>
            <p class="gallery-category">Beach Wedding</p>
            <button class="gallery-view-btn" aria-label="View Sarah & James gallery">
              View Gallery
            </button>
          </div>
        </div>
      </article>

      <!-- More gallery items... -->
    </div>

    <!-- Load More -->
    <div class="gallery-load-more">
      <button class="btn btn-outline" id="load-more-galleries">
        Load More
      </button>
    </div>
  </div>
</section>

<!-- Lightbox Modal -->
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button class="lightbox-close" aria-label="Close image viewer">
    <span aria-hidden="true">×</span>
  </button>
  <button class="lightbox-prev" aria-label="Previous image">
    <span aria-hidden="true">←</span>
  </button>
  <button class="lightbox-next" aria-label="Next image">
    <span aria-hidden="true">→</span>
  </button>
  <div class="lightbox-content">
    <img src="" alt="" class="lightbox-image" />
    <div class="lightbox-info">
      <h3 class="lightbox-title"></h3>
      <p class="lightbox-description"></p>
    </div>
  </div>
</div>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 4-column masonry grid, filters horizontal
- **Tablet (768px - 1024px):** 3-column masonry grid, filters horizontal
- **Mobile (< 768px):** 2-column masonry grid, filters scrollable horizontal

#### Interaction Patterns
- **Filter Click:** Active filter highlighted (indigo background), grid fades out → filtered items fade in (0.3s)
- **Image Hover:** Overlay slides up from bottom, image scales (1.05), border glow
- **Lightbox:** Open with scale animation (0.8 → 1), background blur
- **Navigation:** Prev/Next buttons slide images with crossfade (0.4s)
- **Load More:** Fade out button → append items → fade in button

#### Data Requirements
```json
{
  "galleries": {
    "filters": [
      { "id": "all", "label": "All" },
      { "id": "weddings", "label": "Weddings" },
      { "id": "portraits", "label": "Portraits" },
      { "id": "lifestyle", "label": "Lifestyle" },
      { "id": "events", "label": "Events" }
    ],
    "items": [
      {
        "id": "wedding-1",
        "category": "weddings",
        "src": "/images/gallery/wedding-1.jpg",
        "alt": "Wedding photography - bride and groom on beach",
        "title": "Sarah & James",
        "subtitle": "Beach Wedding",
        "description": "A beautiful beach wedding ceremony at sunset"
      }
      // ... more items
    ],
    "pagination": {
      "itemsPerPage": 12,
      "loadMoreText": "Load More"
    }
  }
}
```

---

### 2.6 Testimonials Section Component

#### HTML Structure
```html
<section class="testimonials" id="testimonials">
  <div class="container">
    <div class="testimonials-header">
      <p class="section-label">Client Stories</p>
      <h2 class="section-title">What People Say</h2>
    </div>

    <!-- Testimonials Carousel -->
    <div class="testimonials-carousel" role="region" aria-label="Testimonials">
      <div class="testimonials-track">
        <!-- Testimonial Card -->
        <article class="testimonial-card">
          <div class="testimonial-stars" aria-label="5 out of 5 stars">
            <span aria-hidden="true">★★★★★</span>
          </div>
          <blockquote class="testimonial-quote">
            <p>
              "Hannah made our wedding day absolutely magical. She captured
              every moment perfectly and made us feel so comfortable in front
              of the camera. The photos are beyond what we could have hoped for!"
            </p>
          </blockquote>
          <div class="testimonial-author">
            <img
              src="/images/testimonials/sarah.jpg"
              alt="Sarah Johnson"
              class="author-image"
            />
            <div class="author-info">
              <cite class="author-name">Sarah Johnson</cite>
              <p class="author-event">Wedding Photography</p>
            </div>
          </div>
        </article>

        <!-- More testimonials... -->
      </div>

      <!-- Navigation -->
      <div class="testimonials-nav">
        <button
          class="nav-btn prev"
          aria-label="Previous testimonial"
          aria-controls="testimonials-track"
        >
          ←
        </button>
        <div class="indicators" role="tablist" aria-label="Testimonial slides">
          <button
            class="indicator active"
            role="tab"
            aria-selected="true"
            aria-label="Testimonial 1"
          ></button>
          <button
            class="indicator"
            role="tab"
            aria-selected="false"
            aria-label="Testimonial 2"
          ></button>
          <button
            class="indicator"
            role="tab"
            aria-selected="false"
            aria-label="Testimonial 3"
          ></button>
        </div>
        <button
          class="nav-btn next"
          aria-label="Next testimonial"
          aria-controls="testimonials-track"
        >
          →
        </button>
      </div>
    </div>

    <!-- Trust Badge -->
    <div class="testimonials-trust">
      <div class="trust-logo">
        <span class="trust-stars">★★★★★</span>
        <span class="trust-text">4.9/5 from 200+ reviews</span>
      </div>
    </div>
  </div>
</section>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 3 testimonials visible, carousel with 3-slide view
- **Tablet (768px - 1024px):** 2 testimonials visible, carousel with 2-slide view
- **Mobile (< 768px):** 1 testimonial visible, full-width cards

#### Interaction Patterns
- **Auto-play:** Auto-advance every 6 seconds (pauses on hover)
- **Nav Click:** Smooth slide transition (0.4s ease-out)
- **Card Hover:** Slight scale (1.02), shadow increase
- **Load:** Cards stagger reveal (0.15s delays)
- **Focus:** All interactive elements have visible 3px focus rings

#### Data Requirements
```json
{
  "testimonials": {
    "items": [
      {
        "id": "testimonial-1",
        "rating": 5,
        "quote": "Hannah made our wedding day absolutely magical. She captured every moment perfectly and made us feel so comfortable in front of the camera. The photos are beyond what we could have hoped for!",
        "author": {
          "name": "Sarah Johnson",
          "image": "/images/testimonials/sarah.jpg",
          "event": "Wedding Photography"
        }
      }
      // ... more testimonials
    ],
    "autoPlay": {
      "enabled": true,
      "interval": 6000
    },
    "trustBadge": {
      "rating": "4.9/5",
      "reviewCount": "200+ reviews"
    }
  }
}
```

---

### 2.7 Instagram Feed Section Component

#### HTML Structure
```html
<section class="instagram-feed" id="instagram">
  <div class="container">
    <div class="instagram-header">
      <p class="section-label">Follow Along</p>
      <h2 class="section-title">@hannahmcclunephotography</h2>
      <a
        href="https://instagram.com/hannahmcclunephotography"
        target="_blank"
        rel="noopener noreferrer"
        class="instagram-link"
        aria-label="Follow Hannah McClune on Instagram (opens in new tab)"
      >
        Follow on Instagram →
      </a>
    </div>

    <!-- Instagram Grid -->
    <div class="instagram-grid">
      <a
        href="https://instagram.com/p/..."
        target="_blank"
        rel="noopener noreferrer"
        class="instagram-item"
        aria-label="View Instagram post: Wedding day preparation"
      >
        <div class="instagram-image-wrapper">
          <img
            src="/images/instagram/insta-1.jpg"
            alt="Wedding day preparation photo"
            class="instagram-image"
            loading="lazy"
          />
          <div class="instagram-overlay">
            <div class="instagram-stats">
              <span class="instagram-likes">❤️ 234</span>
              <span class="instagram-comments">💬 12</span>
            </div>
          </div>
        </div>
      </a>

      <!-- More Instagram items... -->
    </div>

    <!-- Follow CTA -->
    <div class="instagram-cta">
      <p class="instagram-cta-text">
        See behind-the-scenes, recent work, and daily inspiration
      </p>
      <a
        href="https://instagram.com/hannahmcclunephotography"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
        aria-label="Follow Hannah McClune on Instagram (opens in new tab)"
      >
        <svg class="instagram-icon" aria-hidden="true">
          <!-- Instagram SVG -->
        </svg>
        Follow @hannahmcclunephotography
      </a>
    </div>
  </div>
</section>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 5-column grid, square images
- **Tablet (768px - 1024px):** 4-column grid, square images
- **Mobile (< 768px):** 3-column grid, square images

#### Interaction Patterns
- **Hover:** Overlay slides up, stats fade in, image scales (1.05)
- **Load:** Items stagger reveal (0.1s delays)
- **Click:** Opens Instagram in new tab
- **Focus:** All links have visible 3px focus rings

#### Data Requirements
```json
{
  "instagram": {
    "username": "@hannahmcclunephotography",
    "url": "https://instagram.com/hannahmcclunephotography",
    "items": [
      {
        "id": "insta-1",
        "url": "https://instagram.com/p/...",
        "image": "/images/instagram/insta-1.jpg",
        "alt": "Wedding day preparation photo",
        "likes": 234,
        "comments": 12
      }
      // ... more items (6-8 total)
    ],
    "cta": {
      "text": "See behind-the-scenes, recent work, and daily inspiration",
      "buttonText": "Follow @hannahmcclunephotography"
    }
  }
}
```

---

### 2.8 Footer Component

#### HTML Structure
```html
<footer class="footer" id="footer">
  <div class="container">
    <div class="footer-grid">
      <!-- Brand Column -->
      <div class="footer-brand">
        <h3 class="footer-brand-name">Hannah McClune</h3>
        <p class="footer-brand-tagline">
          Capturing life's precious moments with artistry and heart.
        </p>
        <div class="footer-social">
          <a
            href="https://instagram.com/hannahmcclunephotography"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on Instagram (opens in new tab)"
            class="social-link"
          >
            <svg class="social-icon" aria-hidden="true">
              <!-- Instagram SVG -->
            </svg>
          </a>
          <a
            href="https://facebook.com/hannahmcclunephotography"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Like on Facebook (opens in new tab)"
            class="social-link"
          >
            <svg class="social-icon" aria-hidden="true">
              <!-- Facebook SVG -->
            </svg>
          </a>
          <a
            href="https://pinterest.com/hannahmcclunephotography"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on Pinterest (opens in new tab)"
            class="social-link"
          >
            <svg class="social-icon" aria-hidden="true">
              <!-- Pinterest SVG -->
            </svg>
          </a>
        </div>
      </div>

      <!-- Quick Links Column -->
      <div class="footer-links">
        <h4 class="footer-heading">Quick Links</h4>
        <nav aria-label="Footer navigation">
          <ul class="footer-nav">
            <li><a href="#about">About</a></li>
            <li><a href="#galleries">Portfolio</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>

      <!-- Services Column -->
      <div class="footer-services">
        <h4 class="footer-heading">Services</h4>
        <nav aria-label="Services navigation">
          <ul class="footer-nav">
            <li><a href="#contact">Wedding Photography</a></li>
            <li><a href="#contact">Portrait Sessions</a></li>
            <li><a href="#contact">Event Coverage</a></li>
            <li><a href="#contact">Lifestyle Shoots</a></li>
          </ul>
        </nav>
      </div>

      <!-- Contact Column -->
      <div class="footer-contact">
        <h4 class="footer-heading">Get in Touch</h4>
        <address class="contact-info">
          <div class="contact-item">
            <span class="contact-icon" aria-hidden="true">📍</span>
            <span class="contact-text">Melbourne, Australia</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon" aria-hidden="true">📧</span>
            <a href="mailto:hello@hannahmcclune.com" class="contact-link">
              hello@hannahmcclune.com
            </a>
          </div>
          <div class="contact-item">
            <span class="contact-icon" aria-hidden="true">📞</span>
            <a href="tel:+61400000000" class="contact-link">
              +61 400 000 000
            </a>
          </div>
        </address>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p class="footer-copyright">
        © 2026 Hannah McClune Photography. All rights reserved.
      </p>
      <nav aria-label="Legal navigation" class="footer-legal">
        <a href="/privacy" class="legal-link">Privacy Policy</a>
        <a href="/terms" class="legal-link">Terms of Service</a>
      </nav>
    </div>
  </div>
</footer>
```

#### Responsive Behavior
- **Desktop (> 1024px):** 4-column grid (25% each)
- **Tablet (768px - 1024px):** 2-column grid (2x2)
- **Mobile (< 768px):** Single column stacked

#### Interaction Patterns
- **Hover:** Links have underline animation (left to right), social icons scale (1.1)
- **Focus:** All interactive elements have visible 3px focus rings
- **Load:** Footer columns stagger reveal (0.1s delays)

#### Data Requirements
```json
{
  "footer": {
    "brand": {
      "name": "Hannah McClune",
      "tagline": "Capturing life's precious moments with artistry and heart."
    },
    "social": [
      {
        "platform": "instagram",
        "url": "https://instagram.com/hannahmcclunephotography",
        "label": "Follow on Instagram"
      },
      {
        "platform": "facebook",
        "url": "https://facebook.com/hannahmcclunephotography",
        "label": "Like on Facebook"
      },
      {
        "platform": "pinterest",
        "url": "https://pinterest.com/hannahmcclunephotography",
        "label": "Follow on Pinterest"
      }
    ],
    "quickLinks": [
      { "label": "About", "href": "#about" },
      { "label": "Portfolio", "href": "#galleries" },
      { "label": "Testimonials", "href": "#testimonials" },
      { "label": "Contact", "href": "#contact" }
    ],
    "services": [
      { "label": "Wedding Photography", "href": "#contact" },
      { "label": "Portrait Sessions", "href": "#contact" },
      { "label": "Event Coverage", "href": "#contact" },
      { "label": "Lifestyle Shoots", "href": "#contact" }
    ],
    "contact": {
      "location": "Melbourne, Australia",
      "email": "hello@hannahmcclune.com",
      "phone": "+61 400 000 000"
    },
    "legal": {
      "copyright": "© 2026 Hannah McClune Photography. All rights reserved.",
      "privacyPolicy": { "label": "Privacy Policy", "href": "/privacy" },
      "termsOfService": { "label": "Terms of Service", "href": "/terms" }
    }
  }
}
```

---

## 3. Responsive Design Strategy

### Breakpoint System (Tailwind-based)

| Breakpoint | Min Width | Target Devices | Key Layout Changes |
| :--- | :--- | :--- | :--- |
| **xs** | 0px | Small phones | Single column, minimal spacing |
| **sm** | 640px | Large phones | Optimized single column, larger touch targets |
| **md** | 768px | Tablets | 2-column layouts, tablet navigation |
| **lg** | 1024px | Laptops | 3-4 column layouts, full features |
| **xl** | 1280px | Desktop | Maximized content width |
| **2xl** | 1536px | Ultra-wide | Constrained max-width (1400px) |

### Section-Specific Responsive Behavior

#### Header/Navigation
- **xs (0-640px):** Hamburger menu, full-screen overlay, 64px height
- **sm (640-768px):** Hamburger menu, full-screen overlay, 64px height
- **md (768-1024px):** Horizontal nav, 72px height, simplified links
- **lg+ (1024px+):** Full horizontal nav, 80px height, all links visible

#### Hero Section
- **xs (0-640px):** 40px title, stacked CTAs, padding: 40px 20px
- **sm (640-768px):** 48px title, stacked CTAs, padding: 60px 30px
- **md (768-1024px):** 56px title, side-by-side CTAs, padding: 80px 40px
- **lg+ (1024px+):** 72px title, side-by-side CTAs, padding: 120px 60px

#### About Section
- **xs (0-640px):** Stacked (image top, content bottom), stats 1x3
- **sm (640-768px):** Stacked (image top, content bottom), stats 1x3
- **md (768-1024px):** Side-by-side (50/50), stats 2x2
- **lg+ (1024px+):** Side-by-side (50/50), stats 3x1

#### Galleries Section
- **xs (0-640px):** 2-column masonry, filters scrollable horizontal
- **sm (640-768px):** 2-column masonry, filters scrollable horizontal
- **md (768-1024px):** 3-column masonry, filters horizontal
- **lg (1024-1280px):** 4-column masonry, filters horizontal
- **xl+ (1280px+):** 4-column masonry, filters horizontal

#### Testimonials Section
- **xs (0-640px):** 1 card visible, full width
- **sm (640-768px):** 1 card visible, full width
- **md (768-1024px):** 2 cards visible, 2-column carousel
- **lg+ (1024px+):** 3 cards visible, 3-column carousel

#### Instagram Feed
- **xs (0-640px):** 3-column grid, 200px images
- **sm (640-768px):** 4-column grid, 250px images
- **md+ (768px+):** 5-column grid, 300px images

#### Footer
- **xs (0-640px):** Single column, stacked
- **sm (640-768px):** Single column, stacked
- **md (768-1024px):** 2-column grid (2x2)
- **lg+ (1024px+):** 4-column grid

### Touch Targets & Spacing

- **Minimum touch target:** 44px × 44px (WCAG 2.1 AAA)
- **Button padding:** 16px 32px (desktop), 14px 28px (mobile)
- **Link padding:** 12px 16px (for better tap area)
- **Card spacing:** 24px gap (desktop), 16px gap (mobile)
- **Section padding:** 80px 0 (desktop), 48px 0 (mobile)

---

## 4. Accessibility Requirements

### WCAG 2.1 Level AAA Compliance

#### 4.1 Color & Contrast

**Minimum Contrast Ratios:**
- **Normal text (< 18pt):** 7:1 (AAA)
- **Large text (≥ 18pt):** 4.5:1 (AAA)
- **UI Components:** 3:1 (AAA)
- **Focus indicators:** 3:1 against adjacent colors

**Color Palette (Accessible):**
```css
--text-primary: #FFFFFF;      /* #050505 background: 21:1 ✅ */
--text-secondary: #E2E8F0;     /* #050505 background: 16.5:1 ✅ */
--text-muted: #94A3B8;        /* #050505 background: 9.5:1 ✅ */
--primary-indigo: #6366F1;     /* #050505 background: 4.1:1 ✅ */
--accent-gold: #FCD34D;        /* #050505 background: 13.5:1 ✅ */
```

#### 4.2 ARIA Labels & Roles

**Navigation:**
```html
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" href="#about" aria-current="false">About</a>
    </li>
  </ul>
</nav>
```

**Mobile Menu:**
```html
<button
  aria-label="Toggle mobile menu"
  aria-expanded="false"
  aria-controls="mobile-menu"
  aria-haspopup="true"
>
  <!-- Hamburger icon -->
</button>
<div id="mobile-menu" role="dialog" aria-label="Mobile navigation">
  <!-- Menu content -->
</div>
```

**Gallery Filters:**
```html
<div role="tablist" aria-label="Gallery categories">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="gallery-grid"
    id="tab-all"
  >
    All
  </button>
</div>
<div id="gallery-grid" role="tabpanel" aria-labelledby="tab-all">
  <!-- Gallery items -->
</div>
```

**Testimonials Carousel:**
```html
<div role="region" aria-label="Testimonials from clients">
  <div role="group" aria-roledescription="carousel">
    <!-- Testimonial cards -->
  </div>
  <div role="tablist" aria-label="Testimonial slides">
    <button role="tab" aria-selected="true" aria-label="Slide 1 of 3"></button>
  </div>
</div>
```

**Lightbox:**
```html
<div
  id="lightbox"
  role="dialog"
  aria-modal="true"
  aria-label="Image viewer"
  aria-describedby="lightbox-info"
>
  <button aria-label="Close image viewer">×</button>
  <button aria-label="Previous image">←</button>
  <button aria-label="Next image">→</button>
  <img src="" alt="" aria-describedby="lightbox-info" />
  <div id="lightbox-info">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

#### 4.3 Keyboard Navigation

**Tab Order:**
1. Skip to main content link (first focusable element)
2. Navigation links
3. Hero CTAs
4. Section anchors (via skip links)
5. Interactive elements in order
6. Footer links

**Keyboard Shortcuts:**
- **Tab:** Move to next focusable element
- **Shift + Tab:** Move to previous focusable element
- **Enter/Space:** Activate buttons, links, checkboxes
- **Escape:** Close modals, menus, lightbox
- **Arrow Keys:** Navigate within carousels, galleries
- **Home/End:** Navigate to first/last item in lists

**Focus Management:**
```html
<!-- Skip to Main Content Link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Focus Trap in Modals -->
<div class="modal" role="dialog" aria-modal="true">
  <button autofocus>Close</button>
  <!-- Modal content -->
</div>
```

#### 4.4 Focus States

**Visible Focus Indicators:**
```css
:focus-visible {
  outline: 3px solid #6366F1; /* Indigo */
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove focus ring for mouse users only */
:focus:not(:focus-visible) {
  outline: none;
}

/* Button focus states */
.btn:focus-visible {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
  transform: scale(1.02);
}

/* Link focus states */
a:focus-visible {
  text-decoration: underline;
  text-decoration-color: #6366F1;
  text-decoration-thickness: 2px;
}
```

#### 4.5 Screen Reader Support

**Semantic HTML Structure:**
```html
<!-- Proper heading hierarchy -->
<h1>Page Title</h1>
<section aria-labelledby="about-heading">
  <h2 id="about-heading">About</h2>
</section>
<section aria-labelledby="galleries-heading">
  <h2 id="galleries-heading">Galleries</h2>
</section>

<!-- Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true" id="sr-announcements">
  <!-- Dynamic announcements -->
</div>

<!-- Hidden content for screen readers -->
<span class="sr-only">View larger image in lightbox</span>
```

**Image Alt Text Guidelines:**
- **Informative:** "Wedding photography - bride and groom on beach at sunset"
- **Decorative:** Empty alt text `alt=""` with `role="presentation"`
- **Functional:** "Search button", "Close modal"
- **Complex:** Use `aria-describedby` for longer descriptions

**Form Accessibility:**
```html
<form>
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-describedby="email-error"
    aria-invalid="false"
  />
  <span id="email-error" role="alert" class="error-message">
    <!-- Error message -->
  </span>
</form>
```

#### 4.6 Motion & Animation

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Pause Auto-Playing Content:**
- Testimonials carousel pauses on focus
- Instagram feed has pause button
- Hero background animation respects `prefers-reduced-motion`

---

## 5. Wireframe Descriptions

### 5.1 Header/Navigation Wireframe

```
┌──────────────────────────────────────────────────────┐
│  HANNAH MCCLUNE    [About] [Galleries] [Contact] [📅]│
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Fixed position top, glassmorphism background
- Logo left-aligned (HANNAH MCCLUNE)
- Navigation links centered (About, Galleries, Testimonials, Contact)
- CTA button right-aligned (Book Now)
- Mobile hamburger icon (hidden on desktop)

---

### 5.2 Hero Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              [FULL-SCREEN HERO IMAGE]               │
│                 (Parallax Background)                │
│                                                      │
│                                                      │
│         PROFESSIONAL PHOTOGRAPHY                     │
│           HANNAH MCCLUNE                             │
│    Capturing Life's Precious Moments                │
│                                                      │
│    [View Portfolio]  [Book a Session]               │
│                                                      │
│              ↓ Scroll to explore                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Full-viewport height (100vh)
- Hero image background with overlay
- Centered text with gradient
- Two CTA buttons (primary + secondary)
- Scroll indicator at bottom
- Parallax effect on scroll

---

### 5.3 About Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│    ABOUT ME ───────────────────────────              │
│    BEHIND THE LENS                                   │
│                                                      │
│  ┌─────────────────┐  With over a decade of...       │
│  │                 │  My approach combines...        │
│  │   PORTRAIT      │                                 │
│  │                 │  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │                 │  │ 10+  │ │ 500+ │ │ 15+  │   │
│  │                 │  │Years │ │Clients│ │Awards│   │
│  │                 │  └──────┘ └──────┘ └──────┘   │
│  └─────────────────┘                                 │
│                    [Signature]                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- 2-column layout (image left, content right)
- Portrait image in decorative frame
- Bio text (2 paragraphs)
- Stats row (Years, Clients, Awards)
- Handwritten signature
- Subtle animation on scroll

---

### 5.4 CTA Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│        [Gradient Background with Overlay]            │
│                                                      │
│           READY TO CREATE MAGIC?                     │
│         LET'S CAPTURE YOUR STORY                     │
│                                                      │
│   ┌─────────────┐ ┌──────────────────┐ ┌─────────────┐│
│   │ 📸          │ │ 💍 MOST POPULAR  │ │ 🎉          ││
│   │Portrait     │ │Wedding Package  │ │Event        ││
│   │             │ │                  │ │             ││
│   │✓ 1-2 hours  │ │✓ 8-hour coverage│ │✓ Custom     ││
│   │✓ 20+ photos │ │✓ 500+ photos    │ │✓ Fast       ││
│   │✓ Gallery    │ │✓ Engagement     │ │✓ Social     ││
│   │             │ │✓ Album          │ │             ││
│   │[Enquire]    │ │[Book Now]       │ │[Enquire]    ││
│   └─────────────┘ └──────────────────┘ └─────────────┘│
│                                                      │
│   ✓ No deposit  ✓ 100% satisfaction  ✓ Flexible    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Gradient background with overlay
- Centered headline and description
- 3 session cards (Portrait, Wedding, Event)
- Featured card with badge and primary CTA
- Trust signals row at bottom
- Hover effects on cards

---

### 5.5 Galleries Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│    PORTFOLIO ───────────────────────────            │
│    MY WORK                                           │
│                                                      │
│   [All] [Weddings] [Portraits] [Lifestyle] [Events] │
│                                                      │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│   │          │ │          │ │          │ │          ││
│   │  IMG 1   │ │  IMG 2   │ │  IMG 3   │ │  IMG 4   ││
│   │ Wedding  │ │ Portrait │ │Lifestyle │ │  Event   ││
│   │          │ │          │ │          │ │          ││
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                      │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│   │          │ │          │ │          │ │          ││
│   │  IMG 5   │ │  IMG 6   │ │  IMG 7   │ │  IMG 8   ││
│   │ Wedding  │ │ Portrait │ │Lifestyle │ │  Event   ││
│   │          │ │          │ │          │ │          ││
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                      │
│                   [Load More]                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Section header (Portfolio → My Work)
- Filter buttons (horizontal scroll on mobile)
- Masonry grid (4 columns desktop, 2 mobile)
- Image hover overlay with title + view button
- Load more button at bottom
- Lightbox modal for viewing images

---

### 5.6 Testimonials Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│    CLIENT STORIES ───────────────────────            │
│    WHAT PEOPLE SAY                                   │
│                                                      │
│   [←]                                               [→]│
│                                                      │
│   ┌─────────────────────────────────────────────────┐│
│   │                                                ││
│   │   ★★★★★                                       ││
│   │                                                ││
│   │   "Hannah made our wedding day absolutely... ││
│   │    magical. She captured every moment...     ││
│   │    beyond what we could have hoped for!"     ││
│   │                                                ││
│   │   [IMG]  Sarah Johnson                       ││
│   │          Wedding Photography                 ││
│   │                                                ││
│   └─────────────────────────────────────────────────┘│
│                                                      │
│         ● ○ ○                                       │
│                                                      │
│           ★★★★★ 4.9/5 from 200+ reviews           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Section header (Client Stories → What People Say)
- Carousel with prev/next buttons
- Testimonial card with stars, quote, author
- Dot indicators for navigation
- Trust badge with rating and review count
- Auto-play (pauses on hover)

---

### 5.7 Instagram Feed Section Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│    FOLLOW ALONG ─────────────────────────            │
│    @hannahmcclunephotography                         │
│              Follow on Instagram →                   │
│                                                      │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│   │      │ │      │ │      │ │      │ │      │     │
│   │ IMG1 │ │ IMG2 │ │ IMG3 │ │ IMG4 │ │ IMG5 │     │
│   │      │ │      │ │      │ │      │ │      │     │
│   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
│                                                      │
│   See behind-the-scenes, recent work...             │
│                                                      │
│   [📷] Follow @hannahmcclunephotography              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Section header with username and follow link
- 5-column grid of Instagram posts
- Image hover overlay with likes/comments
- CTA text and button at bottom
- All links open in new tab

---

### 5.8 Footer Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐│
│  │HANNAH       │ │Quick     │ │Services  │ │Contact││
│  │MCCLUNE      │ │Links     │ │          │ │       ││
│  │             │ │          │ │          │ │       ││
│  │Capturing... │ │About     │ │Wedding   │ │📍 Mel ││
│  │             │ │Portfolio │ │Portrait  │ │📧 Email│
│  │[IG] [FB] [P]│ │Testimonial│ │Event     │ │📞 Phone│
│  │             │ │Contact   │ │Lifestyle │ │       ││
│  └─────────────┘ └──────────┘ └──────────┘ └───────┘│
│                                                      │
│  ─────────────────────────────────────────────────   │
│                                                      │
│  © 2026 Hannah McClune Photography. All rights.     │
│  Privacy Policy | Terms of Service                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Brand column with name, tagline, social icons
- Quick links column
- Services column
- Contact column with location, email, phone
- Bottom bar with copyright and legal links

---

## 6. Implementation Notes

### Performance Considerations

1. **Image Optimization:**
   - Use WebP format with fallback to JPEG
   - Lazy load all gallery images (`loading="lazy"`)
   - Implement responsive images with `srcset`
   - Hero image: `loading="eager"` for instant load

2. **Animation Performance:**
   - Use `transform` and `opacity` for animations (GPU-accelerated)
   - Avoid animating `width`, `height`, `top`, `left`
   - Use `will-change` sparingly for complex animations
   - Test on low-end devices (60fps target)

3. **Bundle Size:**
   - Code split by route
   - Lazy load heavy components (lightbox, gallery)
   - Tree-shake unused libraries
   - Minify CSS and JavaScript

### SEO Considerations

1. **Meta Tags:**
   ```html
   <title>Hannah McClune Photography | Melbourne Wedding & Portrait Photographer</title>
   <meta name="description" content="Award-winning photographer in Melbourne specializing in weddings, portraits, and lifestyle photography.">
   <meta property="og:title" content="Hannah McClune Photography">
   <meta property="og:image" content="/images/og-image.jpg">
   ```

2. **Structured Data:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "LocalBusiness",
     "name": "Hannah McClune Photography",
     "image": "/images/logo.jpg",
     "address": {
       "@type": "PostalAddress",
       "addressLocality": "Melbourne",
       "addressCountry": "AU"
     }
   }
   ```

3. **Semantic HTML:**
   - Proper heading hierarchy (h1 → h2 → h3)
   - Use `<section>`, `<article>`, `<nav>`, `<footer>`
   - Add `aria-label` for interactive elements

### Browser Support

- **Target Browsers:**
  - Chrome/Edge (last 2 versions)
  - Firefox (last 2 versions)
  - Safari (last 2 versions)
  - Mobile Safari (iOS 14+)
  - Chrome Mobile (Android 10+)

- **Progressive Enhancement:**
  - Base functionality works without JavaScript
  - Enhanced experience with JavaScript enabled
  - Graceful degradation for older browsers

---

## 7. Next Steps

### Phase 1: Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Set up Framer Motion for animations
- [ ] Create base layout structure

### Phase 2: Components
- [ ] Build reusable UI components (Button, Card, Section)
- [ ] Implement Header/Navigation with mobile menu
- [ ] Create Hero section with parallax
- [ ] Build About section with stats

### Phase 3: Features
- [ ] Implement Gallery with filters and lightbox
- [ ] Build Testimonials carousel
- [ ] Integrate Instagram feed
- [ ] Create contact form

### Phase 4: Polish
- [ ] Add animations and transitions
- [ ] Optimize images and performance
- [ ] Test accessibility (WCAG 2.1 AAA)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

### Phase 5: Deploy
- [ ] Set up Vercel deployment
- [ ] Configure custom domain
- [ ] Add analytics
- [ ] SEO optimization
- [ ] Launch!

---

**Document Version:** 1.0
**Created:** February 27, 2026
**Author:** Cloye ✨
**Status:** Ready for Implementation
