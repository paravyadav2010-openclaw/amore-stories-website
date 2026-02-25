# Praveen Kumar Portfolio - Design System & Component Specs

## 1. Design System

### Color Palette (Cinematic Dark Mode)
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Background (Main)** | `#050505` | Primary page background |
| **Background (Surface)** | `#121212` | Card backgrounds, elevated surfaces |
| **Accent (Primary)** | `#6366F1` | Indigo: Buttons, primary highlights, active states |
| **Accent (Secondary)** | `#FCD34D` | Gold: Hover states, decorative elements, accents |
| **Text (Heading)** | `#F8FAFC` | Main titles, high contrast |
| **Text (Body)** | `#94A3B8` | Subtext, descriptions, secondary info |
| **Gradient (Cinematic)** | `linear-gradient(135deg, #6366F1 0%, #FCD34D 100%)` | Hero text, primary CTA backgrounds |
| **Glass Effect** | `rgba(18, 18, 18, 0.8)` | Backdrop blur (12px) for Nav and Cards |

### Typography
- **Primary Font:** `Inter` (Sans-serif) - Clean, modern, highly readable.
- **Secondary/Display Font:** `Outfit` (Sans-serif) - Geometric, professional, high-impact headings.

| Role | Font Family | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Outfit | 5rem (80px) | 800 (ExtraBold) | -0.05em |
| **Section Header** | Outfit | 3rem (48px) | 700 (Bold) | -0.025em |
| **Sub-heading** | Inter | 1.5rem (24px) | 500 (Medium) | 0 |
| **Body Text** | Inter | 1.125rem (18px) | 400 (Regular) | 0.01em |
| **Caption/Small** | Inter | 0.875rem (14px) | 400 (Regular) | 0.05em |

### Spacing Scale (8pt Grid)
- **Unit:** 4px
- **xs:** 4px | **sm:** 8px | **md:** 16px | **lg:** 24px | **xl:** 32px | **2xl:** 48px | **3xl:** 64px | **Section Gap:** 128px

### Effects & Borders
- **Border Radius:** 12px (Standard Cards), 100px (Pills/Buttons)
- **Border Style:** 1px solid `rgba(255, 255, 255, 0.1)` (Subtle glass border)
- **Shadow (Elevation):** `0 20px 50px rgba(0, 0, 0, 0.5)`
- **Indigo Glow:** `0 0 30px rgba(99, 102, 241, 0.2)` (Used on hover)

### Animation Timing (Framer Motion)
- **Transition Duration:** 0.6s
- **Easing:** `[0.16, 1, 0.3, 1]` (Custom cubic-bezier for "snappy but smooth" feel)
- **Stagger Delay:** 0.1s (Between children)
- **Hover Scale:** 1.02 (Subtle)

---

## 2. Component Specs

### Hero Section
- **Layout:** Full-height (100vh), flex-center.
- **Background:** Dark background with a slow-moving, interactive particle mesh or a subtle "indigo-to-gold" aurora blur.
- **Main Heading:** "Praveen Kumar" (ExtraBold, Gradient text).
- **Sub-text:** "Senior Rotoscope Artist @ Weta FX. Bridging VFX and Code."
- **CTAs:** 
    - Primary: "View My Work" (Indigo background, gold border on hover).
    - Secondary: "Melbourne Bound" (Ghost button with subtle glow).
- **Animations:** 
    - Reveal: Opacity 0 -> 1, Y: 20 -> 0.
    - Parallax: The background moves slightly slower than the foreground text on scroll.

### About Section
- **Layout:** 2-column grid. Left: Cinematic portrait or minimalist VFX-themed illustration. Right: Content.
- **Content:** Emphasize the move to Melbourne in March 2026.
- **Visual:** Use a "glowing timeline" graphic to show 7 years at Weta FX leading into the Melbourne transition.

### Work/Projects Cards
- **Layout:** 2-column or 3-column masonry/grid.
- **Design:** Glassmorphism style. Semi-transparent background with backdrop-blur.
- **Interaction:** 
    - **Hover:** 3D Tilt effect (via Framer Motion).
    - **Image:** High-res thumbnail that zooms slightly on hover.
    - **Overlay:** Title and "View Breakdown" button appear on hover.

### Skills Showcase
- **Visual Representation:** Two distinct categories.
    - **VFX Skills:** High-impact icon grid with progress rings (Indigo accent).
    - **Tech Stack:** Floating "pill" tags that move slightly with mouse movement (Gold accent).
- **Tooltips:** Detailed info (e.g., "7+ years in Nuke") appearing on hover.

### Contact Section
- **Layout:** Centered, minimalist.
- **Heading:** "Let's Build the Future Together."
- **Actions:** Large, interactive links for LinkedIn, Email, and GitHub.
- **Effect:** A subtle gold pulse behind the "Send Email" button to draw attention.

---

## 3. Layout Structure

### Section Hierarchy
1. **Navbar** (Sticky, Glassmorphism)
2. **Hero** (Emotional hook)
3. **About** (Who + Where)
4. **Work/Portfolio** (Proof of skill)
5. **Technical Skills** (The toolkit)
6. **Interests/Human Element** (The person)
7. **Contact/Footer** (The conversion)

### Responsive Breakpoints (Tailwind)
- **Mobile (sm):** < 640px (Single column, hidden side-elements)
- **Tablet (md):** 768px (2-column layout for cards)
- **Desktop (lg):** 1024px (Full feature-set, parallax enabled)
- **Ultra-wide (2xl):** 1536px (Max-width container of 1400px)

### Navigation Approach (Mobile)
- **Desktop:** Minimal horizontal links on the right.
- **Mobile:** Full-screen "Overlay Menu" with large typography. Triggered by a morphing hamburger icon. Background blur to keep context.

---

## 4. Animation Strategy

- **Initial Load:** Sequenced reveal of Nav -> Hero Title -> Hero Subtext -> CTA.
- **Scroll Reveal:** All sections use `whileInView` with a 20% threshold. Elements slide in from the bottom with a 0.2s stagger.
- **Parallax:** Scroll-linked background offset for depth perception.
- **Magnetic Buttons:** Primary CTA follows the cursor slightly when hovered for a premium feel.
