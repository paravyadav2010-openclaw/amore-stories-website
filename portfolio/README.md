# Praveen Kumar Portfolio

A stunning, cinematic portfolio website for Praveen Kumar - Senior Rotoscope Artist, Paint Artist, and Full-Stack Developer.

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth, production-ready animations
- **Lucide React** - Beautiful, consistent icons

## ✨ Features

- **Dark mode cinematic design** - Indigo & gold accent colors
- **Smooth scroll animations** - Staggered reveals, parallax effects
- **Responsive layout** - Mobile-first, works on all devices
- **Glassmorphism components** - Modern, sleek UI elements
- **SEO optimized** - Semantic HTML, metadata, Open Graph
- **Accessibility** - ARIA labels, keyboard navigation
- **Performance optimized** - Lazy loading, image optimization

## 🎨 Design System

### Colors
- **Primary Background:** #050505 (Deep charcoal)
- **Surface:** #121212 (Elevated surfaces)
- **Primary Accent:** #6366F1 (Indigo)
- **Secondary Accent:** #FCD34D (Gold)

### Typography
- **Display Font:** Outfit (Bold headings)
- **Body Font:** Inter (Clean, readable)

### Animation Timing
- **Duration:** 0.6s
- **Easing:** [0.16, 1, 0.3, 1] (Snappy but smooth)
- **Stagger Delay:** 0.1s

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure it
4. Deploy! 🎉

### Environment Variables (Optional)

No environment variables required for basic functionality.

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles & utilities
│   └── fonts/              # Font files
├── components/
│   ├── Navigation.tsx      # Responsive navigation
│   ├── Hero.tsx            # Hero section with animations
│   ├── About.tsx           # About section with CV data
│   ├── Work.tsx            # Portfolio/Work section (10 projects)
│   ├── Skills.tsx          # Skills showcase (VFX + Tech)
│   ├── Contact.tsx         # Contact section
│   └── Footer.tsx          # Footer component
├── lib/
│   └── utils.ts            # Utility functions (cn, animations)
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── next.config.mjs         # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Performance Targets

- **Lighthouse Score:** 95+
- **Load Time:** < 2s on 4G
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 3s

## 🔧 Customization

### Update Colors

Edit `tailwind.config.ts` to customize color palette:

```typescript
colors: {
  background: {
    main: "#050505",
    surface: "#121212",
  },
  accent: {
    primary: "#6366F1",
    secondary: "#FCD34D",
  },
}
```

### Modify Animations

Edit `lib/utils.ts` to adjust animation timings:

```typescript
export const ANIMATION_CONFIG = {
  duration: 0.6,
  easing: [0.16, 1, 0.3, 1],
  staggerDelay: 0.1,
};
```

## 📝 Content Updates

### Personal Info

Update `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "Praveen Kumar | Senior Rotoscope Artist",
  description: "Your description",
};
```

### Update Contact Info

Edit `components/Contact.tsx` to change:

```typescript
const contactMethods = [
  {
    title: "Email",
    value: "your@email.com",
    link: "mailto:your@email.com",
  },
  // ... social links
];
```

### Update Projects

Edit `components/Work.tsx` projects array to add/update your work.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Proper color contrast ratios (WCAG AA compliant)
- Screen reader friendly

## 📄 License

This portfolio is personal property of Praveen Kumar.

## 👤 Author

**Praveen Kumar**
- Senior Rotoscope & Paint Artist @ Weta Digital
- 7+ years in VFX industry
- Full-stack developer (Python, React, Next.js)
- Moving to Melbourne, Australia (March 2026)

---

Built with ❤️ using Next.js 14, Tailwind CSS, and Framer Motion.
