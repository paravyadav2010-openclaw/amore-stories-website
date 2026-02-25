# Praveen Kumar Portfolio - NEW Design System v2.0

## 1. Color Palette (Vibrant Modern Gradient-Based)

### Primary Colors
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Background Deep** | `#0A0A0F` | Primary dark background |
| **Background Accent** | `#12121A` | Secondary backgrounds |
| **Primary Gradient** | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | Main gradient (Purple-Indigo) |
| **Secondary Gradient** | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` | Accent gradient (Pink-Red) |
| **Accent Gradient** | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` | Highlight gradient (Blue-Cyan) |
| **Text Primary** | `#FFFFFF` | Main headings |
| **Text Secondary** | `#CBD5E0` | Body text |
| **Text Tertiary** | `#94A3B8` | Subtext |

### Glassmorphism Colors
| Token | Value | Usage |
| :--- | :--- | :--- |
| **Glass Light** | `rgba(255, 255, 255, 0.05)` | Light glass surfaces |
| **Glass Medium** | `rgba(255, 255, 255, 0.1)` | Medium glass surfaces |
| **Glass Dark** | `rgba(0, 0, 0, 0.3)` | Dark glass overlay |
| **Border Glass** | `rgba(255, 255, 255, 0.1)` | Glass borders |

## 2. Typography System

### Font Families
```css
--font-heading: 'Outfit', sans-serif; /* Modern, geometric */
--font-body: 'Inter', sans-serif; /* Clean, readable */
--font-mono: 'JetBrains Mono', monospace; /* Technical, code */
```

### Typography Scale
| Role | Font | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | Outfit | 5.5rem (88px) | 800 | 1.1 |
| **Hero Title** | Outfit | 4.5rem (72px) | 700 | 1.1 |
| **Section Title** | Outfit | 3rem (48px) | 700 | 1.2 |
| **Subtitle** | Outfit | 2rem (32px) | 600 | 1.3 |
| **Heading** | Outfit | 1.5rem (24px) | 600 | 1.4 |
| **Body** | Inter | 1.125rem (18px) | 400 | 1.6 |
| **Small** | Inter | 0.875rem (14px) | 400 | 1.5 |
| **Mono** | JetBrains Mono | 0.875rem (14px) | 400 | 1.5 |

## 3. Spacing System (8px base)
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px | 4xl: 96px | 5xl: 128px

## 4. Effects & Animations

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Glow Effects
```css
.glow-primary { box-shadow: 0 0 40px rgba(102, 126, 234, 0.3); }
.glow-accent { box-shadow: 0 0 40px rgba(240, 147, 251, 0.3); }
.glow-blue { box-shadow: 0 0 40px rgba(79, 172, 254, 0.3); }
```

### Animations (Framer Motion)
- **Page Load**: Staggered fade-up (0.1s delays)
- **Scroll Reveal**: WhileInView with 20% threshold
- **Hover**: Scale 1.05, rotateX 5deg, rotateY 5deg
- **Duration**: 0.6s
- **Easing**: custom cubic-bezier(0.16, 1, 0.3, 1)

## 5. Component Architecture

### Reusable Components
1. **GlassCard**: Glassmorphic card container
2. **AnimatedSection**: Section with scroll reveal
3. **GradientText**: Text with gradient fill
4. **MagneticButton**: Button with magnetic hover
5. **ProgressCircle**: Animated circular progress
6. **StatCounter**: Animated number counter
7. **ProjectModal**: Modal for project details
8. **ParticleBackground**: Canvas particle system

### Section Structure
1. **Hero**: Full-screen with dynamic background
2. **About**: Timeline + Stats + Photo
3. **Work**: Filterable grid + Modals
4. **Skills**: Categorized with animations
5. **Contact**: Form + Social + Map

## 6. Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1536px
- Ultra-wide: > 1536px

## 7. Performance Optimizations
- Lazy load images
- Code splitting by route
- Intersection Observer for animations
- Canvas for particle system
- Memoize expensive components
