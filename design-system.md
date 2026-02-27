# Hannah McClune Photography - Design System

> Complete design system specification for the Hannah McClune photography portfolio website.

---

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Design Elements](#design-elements)
- [Button Styles](#button-styles)
- [Component Styles](#component-styles)
- [CSS Variables](#css-variables)
- [Utility Classes](#utility-classes)
- [Breakpoints](#breakpoints)

---

## Color Palette

### Primary Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| **Black** | `#000000` | Primary text, headers, backgrounds |
| **Dark Gray** | `#1a1a1a` | Section backgrounds, cards |
| **Medium Gray** | `#4a4a4a` | Secondary text, body copy |
| **Light Gray** | `#f5f5f5` | Subtle backgrounds, dividers |
| **White** | `#ffffff` | Primary background, text on dark |

### Accent Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| **Gold** | `#d4af37` | Accent, hover states, highlights |
| **Warm Beige** | `#e8dcc4` | Subtle backgrounds, overlays |
| **Charcoal** | `#2d2d2d` | Dark sections, footer |

### Semantic Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| **Success** | `#10b981` | Form success messages |
| **Error** | `#ef4444` | Form errors |
| **Warning** | `#f59e0b` | Alert messages |

---

## Typography

### Font Families
```css
/* Primary Font - Clean, elegant serif */
font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;

/* Body Font - Modern sans-serif */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Accent Font - Minimalist for UI elements */
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Font Sizes
| Element | Size | Line Height | Weight |
|---------|------|-------------|--------|
| **H1 - Hero Title** | `4rem` (64px) | `1.1` | 400 (Regular) |
| **H2 - Section Title** | `2.5rem` (40px) | `1.2` | 400 (Regular) |
| **H3 - Card Title** | `1.5rem` (24px) | `1.3` | 500 (Medium) |
| **H4 - Subtitle** | `1.25rem` (20px) | `1.4` | 500 (Medium) |
| **Body** | `1rem` (16px) | `1.6` | 400 (Regular) |
| **Small** | `0.875rem` (14px) | `1.5` | 400 (Regular) |
| **Caption** | `0.75rem` (12px) | `1.4` | 400 (Regular) |

### Font Weights
- **Light**: 300 - Decorative text
- **Regular**: 400 - Body copy, headings
- **Medium**: 500 - Buttons, emphasis
- **Bold**: 700 - Strong emphasis

### Letter Spacing
- **Headings**: `-0.02em` (slightly tighter)
- **Body**: `0` (normal)
- **Uppercase text**: `0.1em` (slightly wider)

---

## Layout & Spacing

### Spacing Scale
| Token | Value | Use Case |
|-------|-------|----------|
| `--space-xs` | `0.5rem` (8px) | Tight spacing, icon gaps |
| `--space-sm` | `1rem` (16px) | Default spacing, padding |
| `--space-md` | `1.5rem` (24px) | Section padding, margins |
| `--space-lg` | `2rem` (32px) | Card spacing, gaps |
| `--space-xl` | `3rem` (48px) | Section separation |
| `--space-2xl` | `4rem` (64px) | Large sections |
| `--space-3xl` | `6rem` (96px) | Hero sections |

### Margins
- **Section Top/Bottom**: `--space-2xl` (4rem / 64px)
- **Card Margin**: `--space-sm` (1rem / 16px)
- **Paragraph Margin**: `--space-sm` (1rem / 16px)
- **List Item Margin**: `--space-xs` (0.5rem / 8px)

### Padding
- **Button**: `--space-sm var(--space-md)` (16px 24px)
- **Card**: `--space-md` (1.5rem / 24px)
- **Section**: `--space-2xl` (4rem / 64px)
- **Container**: `--space-sm` (1rem / 16px)

### Container Widths
| Breakpoint | Max Width |
|------------|------------|
| **Mobile** | 100% |
| **Tablet** | `640px` |
| **Desktop** | `1024px` |
| **Wide** | `1280px` |

### Grid System
```css
/* Base grid */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: var(--space-lg);
```

**Grid Patterns:**
- **2-column**: `grid-template-columns: repeat(2, 1fr)` (Gallery)
- **3-column**: `grid-template-columns: repeat(3, 1fr)` (Portfolio)
- **4-column**: `grid-template-columns: repeat(4, 1fr)` (Testimonials)

---

## Design Elements

### Border Radius
| Element | Radius | Use Case |
|---------|--------|----------|
| **Buttons** | `4px` | Subtle rounding |
| **Cards** | `8px` | Soft edges |
| **Images** | `0px` | Sharp corners (photography) |
| **Inputs** | `4px` | Form elements |
| **Badges** | `999px` | Pill-shaped |

### Shadows
| Shadow | CSS | Use Case |
|--------|-----|----------|
| **None** | `none` | Flat elements |
| **Sm** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle depth |
| **Md** | `0 4px 6px rgba(0, 0, 0, 0.07)` | Cards, buttons |
| **Lg** | `0 10px 15px rgba(0, 0, 0, 0.1)` | Hover states |
| **Xl** | `0 20px 25px rgba(0, 0, 0, 0.15)` | Popups, modals |

### Transitions
```css
/* Base transition */
transition: all 0.3s ease;

/* Fast transition (buttons) */
transition: all 0.2s ease;

/* Slow transition (images) */
transition: all 0.5s ease;
```

### Hover Effects
| Element | Effect |
|---------|--------|
| **Buttons** | Background darkening, translateY(-2px) |
| **Links** | Color change, underline animation |
| **Images** | Scale 1.05, shadow-lg |
| **Cards** | translateY(-4px), shadow-lg |

### Opacity Levels
| State | Opacity |
|-------|---------|
| **Active** | `1` |
| **Hover** | `0.9` |
| **Disabled** | `0.5` |
| **Subtle** | `0.75` |

---

## Button Styles

### Primary Button
```css
background-color: #000000;
color: #ffffff;
padding: 16px 32px;
border-radius: 4px;
font-weight: 500;
font-size: 1rem;
transition: all 0.3s ease;

/* Hover state */
&:hover {
  background-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Secondary Button
```css
background-color: transparent;
color: #000000;
border: 1px solid #000000;
padding: 16px 32px;
border-radius: 4px;
font-weight: 500;
font-size: 1rem;
transition: all 0.3s ease;

/* Hover state */
&:hover {
  background-color: #000000;
  color: #ffffff;
}
```

### Accent Button
```css
background-color: #d4af37;
color: #ffffff;
padding: 16px 32px;
border-radius: 4px;
font-weight: 500;
font-size: 1rem;
transition: all 0.3s ease;

/* Hover state */
&:hover {
  background-color: #b8962e;
  transform: translateY(-2px);
}
```

### Ghost Button
```css
background-color: transparent;
color: #4a4a4a;
padding: 12px 24px;
border-radius: 4px;
font-weight: 400;
font-size: 0.875rem;
transition: all 0.2s ease;

/* Hover state */
&:hover {
  color: #000000;
  background-color: rgba(0, 0, 0, 0.05);
}
```

### Button States
| State | Background | Color | Shadow |
|-------|------------|-------|--------|
| **Default** | `#000000` | `#ffffff` | `none` |
| **Hover** | `#333333` | `#ffffff` | `0 4px 12px rgba(0, 0, 0, 0.15)` |
| **Active** | `#666666` | `#ffffff` | `none` |
| **Disabled** | `#cccccc` | `#999999` | `none` |

---

## Component Styles

### Navigation Bar
```css
position: fixed;
top: 0;
left: 0;
right: 0;
height: 80px;
background-color: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border-bottom: 1px solid rgba(0, 0, 0, 0.05);
z-index: 1000;
padding: 0 32px;
```

**Navigation Links:**
```css
color: #4a4a4a;
font-size: 0.875rem;
font-weight: 500;
letter-spacing: 0.05em;
text-transform: uppercase;
margin: 0 24px;
position: relative;
transition: color 0.2s ease;

/* Hover state */
&:hover {
  color: #000000;
}

/* Active indicator */
&::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #000000;
  transition: width 0.3s ease;
}

&:hover::after {
  width: 100%;
}
```

### Cards
```css
background-color: #ffffff;
border-radius: 8px;
padding: 24px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
transition: all 0.3s ease;

/* Hover state */
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Image Gallery
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 16px;
padding: 24px;

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  aspect-ratio: 3 / 4;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  /* Hover effect */
  &:hover img {
    transform: scale(1.05);
  }

  /* Overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0) 50%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
}
```

### Testimonials
```css
background-color: #f5f5f5;
border-radius: 8px;
padding: 32px;
text-align: center;
max-width: 400px;

.quote {
  font-size: 1.25rem;
  font-style: italic;
  color: #1a1a1a;
  line-height: 1.6;
  margin-bottom: 24px;
}

.author {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a4a4a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Hero Section
```css
height: 100vh;
min-height: 600px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.3) 0%,
  rgba(0, 0, 0, 0.5) 100%
);
padding: 64px 24px;

.hero-title {
  font-size: 4rem;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 600px;
}
```

### Contact Form
```css
max-width: 500px;
margin: 0 auto;

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

textarea.form-input {
  min-height: 150px;
  resize: vertical;
}
```

---

## CSS Variables

```css
:root {
  /* Colors - Primary */
  --color-black: #000000;
  --color-dark-gray: #1a1a1a;
  --color-medium-gray: #4a4a4a;
  --color-light-gray: #f5f5f5;
  --color-white: #ffffff;

  /* Colors - Accent */
  --color-gold: #d4af37;
  --color-warm-beige: #e8dcc4;
  --color-charcoal: #2d2d2d;

  /* Colors - Semantic */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-accent: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 4rem;

  /* Font Weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* Container */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;

  /* Opacity */
  --opacity-disabled: 0.5;
  --opacity-subtle: 0.75;
  --opacity-hover: 0.9;
  --opacity-active: 1;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-black: #ffffff;
    --color-dark-gray: #f5f5f5;
    --color-medium-gray: #cccccc;
    --color-light-gray: #1a1a1a;
    --color-white: #000000;
  }
}
```

---

## Utility Classes

### Spacing
```css
.m-0 { margin: 0; }
.mt-1 { margin-top: var(--space-xs); }
.mt-2 { margin-top: var(--space-sm); }
.mt-4 { margin-top: var(--space-md); }
.mt-6 { margin-top: var(--space-lg); }
.mt-8 { margin-top: var(--space-xl); }
.mt-12 { margin-top: var(--space-2xl); }

.mb-1 { margin-bottom: var(--space-xs); }
.mb-2 { margin-bottom: var(--space-sm); }
.mb-4 { margin-bottom: var(--space-md); }
.mb-6 { margin-bottom: var(--space-lg); }
.mb-8 { margin-bottom: var(--space-xl); }
.mb-12 { margin-bottom: var(--space-2xl); }

.my-auto { margin-top: auto; margin-bottom: auto; }

.p-0 { padding: 0; }
.p-1 { padding: var(--space-xs); }
.p-2 { padding: var(--space-sm); }
.p-4 { padding: var(--space-md); }
.p-6 { padding: var(--space-lg); }
.p-8 { padding: var(--space-xl); }
.p-12 { padding: var(--space-2xl); }

.px-2 { padding-left: var(--space-sm); padding-right: var(--space-sm); }
.px-4 { padding-left: var(--space-md); padding-right: var(--space-md); }
.px-6 { padding-left: var(--space-lg); padding-right: var(--space-lg); }

.py-2 { padding-top: var(--space-sm); padding-bottom: var(--space-sm); }
.py-4 { padding-top: var(--space-md); padding-bottom: var(--space-md); }
.py-6 { padding-top: var(--space-lg); padding-bottom: var(--space-lg); }
.py-8 { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
```

### Layout
```css
.container {
  width: 100%;
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 var(--space-sm);
}

.container-sm { max-width: var(--container-sm); }
.container-md { max-width: var(--container-md); }
.container-lg { max-width: var(--container-lg); }
.container-xl { max-width: var(--container-xl); }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-sm); }
.gap-4 { gap: var(--space-md); }
.gap-6 { gap: var(--space-lg); }

.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### Typography
```css
.font-heading { font-family: var(--font-heading); }
.font-body { font-family: var(--font-body); }
.font-accent { font-family: var(--font-accent); }

.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }
.text-5xl { font-size: var(--text-5xl); }
.text-6xl { font-size: var(--text-6xl); }

.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-regular); }
.font-medium { font-weight: var(--font-medium); }
.font-bold { font-weight: var(--font-bold); }

.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

.tracking-tight { letter-spacing: -0.02em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.05em; }

.leading-none { line-height: 1; }
.leading-tight { line-height: 1.1; }
.leading-snug { line-height: 1.2; }
.leading-normal { line-height: 1.6; }
.leading-relaxed { line-height: 1.8; }
```

### Colors
```css
.text-black { color: var(--color-black); }
.text-dark-gray { color: var(--color-dark-gray); }
.text-medium-gray { color: var(--color-medium-gray); }
.text-light-gray { color: var(--color-light-gray); }
.text-white { color: var(--color-white); }
.text-gold { color: var(--color-gold); }

.bg-black { background-color: var(--color-black); }
.bg-dark-gray { background-color: var(--color-dark-gray); }
.bg-medium-gray { background-color: var(--color-medium-gray); }
.bg-light-gray { background-color: var(--color-light-gray); }
.bg-white { background-color: var(--color-white); }
.bg-gold { background-color: var(--color-gold); }
.bg-warm-beige { background-color: var(--color-warm-beige); }
```

### Effects
```css
.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

.rounded-none { border-radius: var(--radius-none); }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-full { border-radius: var(--radius-full); }

.transition { transition: var(--transition-base); }
.transition-fast { transition: var(--transition-fast); }
.transition-slow { transition: var(--transition-slow); }

.opacity-0 { opacity: 0; }
.opacity-25 { opacity: 0.25; }
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }
.opacity-100 { opacity: 1; }
```

### Display
```css
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.hidden { display: none; }
.visible { visibility: visible; }
.invisible { visibility: hidden; }

.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

.z-0 { z-index: 0; }
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }
```

---

## Breakpoints

### Responsive Design

```css
/* Mobile First Approach */

/* Base Styles (0-639px) - Mobile */
.container {
  width: 100%;
  padding: 0 var(--space-sm);
}

/* Small Devices (640px+) - Small Tablets */
@media (min-width: 640px) {
  :root {
    --text-6xl: 5rem;
  }

  .container {
    padding: 0 var(--space-md);
  }
}

/* Medium Devices (768px+) - Tablets */
@media (min-width: 768px) {
  :root {
    --text-6xl: 6rem;
  }

  .container {
    max-width: var(--container-md);
    padding: 0 var(--space-lg);
  }

  .grid-cols-md-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-md-3 { grid-template-columns: repeat(3, 1fr); }
}

/* Large Devices (1024px+) - Desktop */
@media (min-width: 1024px) {
  :root {
    --text-6xl: 7rem;
  }

  .container {
    max-width: var(--container-lg);
    padding: 0 var(--space-xl);
  }

  .grid-cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-lg-4 { grid-template-columns: repeat(4, 1fr); }

  .lg\:flex-row {
    flex-direction: row;
  }

  .lg\:text-left {
    text-align: left;
  }
}

/* Extra Large Devices (1280px+) - Wide Desktop */
@media (min-width: 1280px) {
  .container {
    max-width: var(--container-xl);
  }

  .grid-cols-xl-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-xl-5 { grid-template-columns: repeat(5, 1fr); }
}
```

### Breakpoint Reference

| Name | Min Width | Max Width | Devices |
|------|-----------|-----------|---------|
| **Mobile** | 0px | 639px | Smartphones |
| **Small** | 640px | 767px | Large phones, small tablets |
| **Medium** | 768px | 1023px | Tablets (iPad) |
| **Large** | 1024px | 1279px | Laptops, small desktops |
| **Extra Large** | 1280px+ | — | Large desktops |

### Component Responsive Behavior

**Navigation:**
- Mobile: Hamburger menu, full-screen overlay
- Desktop: Horizontal links, 80px fixed bar

**Gallery:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Hero:**
- Mobile: 80vh height, smaller text
- Desktop: 100vh height, larger text

**Cards:**
- Mobile: Stack vertically
- Tablet: 2 columns
- Desktop: 3 columns

---

## Implementation Notes

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
```

### CSS Reset
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-black);
  background-color: var(--color-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
}
```

---

## Quick Start

### Minimal Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hannah McClune Photography</title>
  <link rel="stylesheet" href="design-system.css">
</head>
<body>
  <nav class="navbar">...</nav>
  <header class="hero">...</header>
  <main class="container">...</main>
  <footer class="footer">...</footer>
</body>
</html>
```

### Key Classes to Use
- **Layout:** `.container`, `.flex`, `.grid`
- **Typography:** `.font-heading`, `.text-6xl`, `.font-medium`
- **Spacing:** `.mt-12`, `.mb-8`, `.p-6`
- **Buttons:** `.btn-primary`, `.btn-secondary`
- **Components:** `.card`, `.gallery`, `.testimonial`

---

**Design System Version:** 1.0  
**Last Updated:** 2026-02-27  
**Maintained By:** Design Team

---

## Customization Guide

### Adjusting Colors
Modify the CSS variables in `:root` to match the brand:
```css
:root {
  --color-gold: #YOUR_HEX_CODE;
  --color-dark-gray: #YOUR_HEX_CODE;
}
```

### Scaling Spacing
Multiply all spacing values by a factor:
```css
:root {
  --space-sm: calc(var(--space-xs) * 2);
  --space-md: calc(var(--space-sm) * 1.5);
}
```

### Changing Typography
Update font families and sizes:
```css
:root {
  --font-heading: 'Your Font', serif;
  --text-6xl: 5rem; /* Adjust as needed */
}
```

---

This design system provides a complete foundation for building the Hannah McClune photography website with consistent styling, responsive layouts, and professional aesthetics.
