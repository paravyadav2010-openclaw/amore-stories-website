# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Option 1: Netlify (Easiest - Free)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Click "Deploy site"

3. **Done!** Your site is live in seconds.

### Option 2: Vercel (Also Free)

1. Push to GitHub (same as above)

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

### Option 3: GitHub Pages (Free)

1. Push to GitHub (same as above)

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main → / (root)
   - Save

3. Your site will be at: `https://username.github.io/amore-stories`

### Option 4: Traditional Web Hosting

1. **Upload files via FTP**
   - Connect to your web server
   - Upload all files to `public_html` or `www` folder

2. **Or use cPanel File Manager**
   - Go to File Manager
   - Upload all files to public_html

3. Done! Visit your domain.

---

## ✅ Pre-Deployment Checklist

- [ ] Replace "Amore Stories" with your brand name
- [ ] Update contact information (email, phone, address)
- [ ] Replace placeholder images with your own
- [ ] Update social media links
- [ ] Test the contact form (connect to backend if needed)
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Check all links work
- [ ] Verify SEO meta tags
- [ ] Add Google Analytics (optional)

---

## 🎨 Quick Customization

### Change Colors
Edit `styles.css` lines 10-40:
```css
:root {
    --color-primary: #8B7355;      /* Main color */
    --color-secondary: #D4C5B0;    /* Secondary color */
}
```

### Change Contact Info
Edit `index.html` around line 420:
```html
<a href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>
<a href="tel:+61390000000">+61 3 9000 0000</a>
```

### Update Instagram Feed
Edit `scripts.js` around line 120:
```javascript
const instagramImages = [
    'https://your-image-url-1.jpg',
    'https://your-image-url-2.jpg',
    // ... add more URLs
];
```

---

## 📧 Connect Contact Form to Email

### Option 1: Formspree (Free)
1. Go to [formspree.io](https://formspree.io)
2. Create an account and get your form endpoint
3. Update form HTML:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: Netlify Forms
1. Deploy on Netlify
2. Add `netlify` attribute to form:
   ```html
   <form name="contact" method="POST" data-netlify="true">
   ```
3. Forms are automatically handled!

### Option 3: EmailJS (Free tier available)
1. Go to [emailjs.com](https://www.emailjs.com)
2. Set up email service and template
3. Add EmailJS SDK to HTML and configure

---

## 🔍 Add Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create an account and property
3. Get your tracking ID (GA_MEASUREMENT_ID)
4. Add to `index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

---

## 🌐 Custom Domain

### After Deploying to Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records at your domain registrar

### After Deploying to Vercel
1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records

### After Deploying to GitHub Pages
1. Go to repository Settings → Pages
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (wait for DNS propagation)

---

## 🎯 Performance Tips

1. **Compress images** before uploading
   - Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)

2. **Minify CSS and JS** (optional)
   - Use [CSS Minifier](https://cssminifier.com)
   - Use [JS Minifier](https://javascript-minifier.com)

3. **Enable CDN** for static assets (optional)
   - Cloudflare (free)
   - AWS CloudFront

---

## 📱 Test on Mobile

Use these tools:
- Chrome DevTools (F12) → Device toolbar
- Safari → Develop → Enter Responsive Design Mode
- Real device testing

---

## 💡 Need Help?

- Check `README.md` for detailed documentation
- Read code comments in each file
- Test locally first: `python3 -m http.server 8000`

---

**Happy Deploying! 🚀**
