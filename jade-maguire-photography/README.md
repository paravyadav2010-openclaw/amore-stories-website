# Jade Maguire Photography - Website Replica

A Next.js replica of the Jade Maguire Photography website, featuring modern wedding photography portfolio with authentic storytelling.

## Tech Stack

- **Next.js 14.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful icons
- **Google Fonts** - Playfair Display, Montserrat, Carter One, Mr Dafoe, Open Sans

## Features Implemented

### Pages (7 total)
1. **Home** (/) - Hero slider, about section, gallery carousel, testimonials, contact form
2. **About** (/about) - Detailed about page with photography philosophy
3. **Gallery** (/gallery) - Filterable image gallery with 12+ wedding photos
4. **Pricing** (/pricing) - Three wedding packages with add-ons
5. **FAQ** (/faq) - Frequently asked questions (placeholder)
6. **Blog** (/blog) - Blog listing (placeholder)
7. **Contact** (/contact) - Full contact page with form and info

### Design Elements
- **Color Palette**: 
  - Primary: #efe9e9 (cream)
  - Accent: #6e7250 (olive)
  - Highlight: #f8e7bb (beige)
  - Special: #EDA89A (pink), #93D2CF (cyan)

- **Typography**:
  - Headings: Playfair Display (serif)
  - Body: Montserrat (sans-serif)
  - Special: Carter One, Mr Dafoe (decorative)
  - Utility: Open Sans

### Animations & Effects
1. **Parallax Scrolling** - Hero sections with scroll-based movement
2. **Fade-in Animations** - Sections animate in on scroll
3. **Slider/Carousel** - Auto-rotating hero images
4. **Gallery Carousel** - Horizontal scroll with arrows
5. **Testimonial Slider** - Auto-rotating client reviews
6. **Scrolling Text** - Continuous "Client Love Letters" banner
7. **Hover Effects** - Image zoom, button scales
8. **Wave Dividers** - SVG wave shapes between sections
9. **Shape Dividers** - Decorative section transitions

### Components
- Header with mobile responsive navigation
- HeroSlider with parallax effect
- AboutSection with highlighted text
- GalleryCarousel with horizontal scroll
- Testimonials with auto-rotation
- ContactForm with validation
- Footer with navigation links

## Setup Instructions

1. **Install dependencies**:
   ```bash
   cd jade-maguire-photography
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## Project Structure

```
jade-maguire-photography/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx (home)
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── HeroSlider.tsx
│       ├── AboutSection.tsx
│       ├── GalleryCarousel.tsx
│       ├── Testimonials.tsx
│       └── ContactForm.tsx
├── public/
│   └── images/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
└── README.md
```

## Customization

### Colors
Edit `tailwind.config.ts` to modify the color palette:
```typescript
colors: {
  'jade-cream': '#efe9e9',
  'jade-olive': '#6e7250',
  // ... etc
}
```

### Fonts
Modify font imports in `src/app/layout.tsx` and update Tailwind config.

### Images
Replace image URLs in component files with your own wedding photos.

### Content
Update text content directly in the page files to personalize for your own photography business.

## Responsive Design

- **Mobile**: < 768px (stacked layouts, hamburger menu)
- **Tablet**: 768px - 1024px (2-column grids)
- **Desktop**: > 1024px (full layouts, horizontal navigation)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Next.js Image component for automatic optimization
- Lazy loading for images
- Framer Motion for smooth animations
- Minimal JavaScript bundle size

## Future Enhancements

- [ ] Add actual blog functionality
- [ ] Implement FAQ content
- [ ] Add image lightbox for gallery
- [ ] Implement contact form backend
- [ ] Add more wedding portfolio images
- [ ] SEO optimization with metadata
- [ ] Add social sharing buttons

## Credits

Original website: https://www.jademaguirephotography.uk/
Theme: WordPress Salient Theme (replicated with Next.js)

## License

This is a personal project replica for educational purposes.
