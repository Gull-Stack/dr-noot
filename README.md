# GullStack Client Starter Template

A professional 11ty starter template for GullStack client sites. This template provides a complete, production-ready website foundation that can be customized for any client in under an hour.

## ✨ Features

- **StoryBrand Framework** - Homepage built with proven conversion structure
- **Complete Minification** - HTML, CSS, and JS are fully minified for SEMrush compliance
- **Responsive Design** - Mobile-first, professional styling out of the box
- **Spam Protection** - Honeypot + timestamp validation built into forms
- **SEO Optimized** - Meta tags, Open Graph, JSON-LD structured data, sitemap
- **Performance Ready** - CSS variables, efficient JavaScript, optimized assets
- **Client-First Config** - Single site.json file contains all customizable content

## 🚀 Quick Start

1. **Clone the template:**
   ```bash
   cp -r /path/to/gullstack-starter your-client-name
   cd your-client-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Edit client configuration:**
   - Open `src/_data/site.json`
   - Update ALL client-specific information (see Configuration Guide below)

4. **Customize content:**
   - Replace placeholder text in pages (search for `<!-- CUSTOMIZE:` comments)
   - Update hero headlines, service descriptions, team info
   - Add client-specific imagery and content

5. **Start development server:**
   ```bash
   npm start
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

## ⚙️ Configuration Guide

### Primary Configuration (src/_data/site.json)

This is the **ONLY** file that needs editing for basic client setup:

```json
{
  "name": "Your Client Name",
  "tagline": "Brief tagline or value proposition",
  "description": "SEO meta description for homepage",
  "url": "https://yourclient.com",
  "phone": "555-123-4567",
  "email": "info@yourclient.com",
  "address": {
    "street": "123 Main Street",
    "city": "Your City",
    "state": "ST",
    "zip": "12345"
  },
  "colors": {
    "primary": "#1a365d",
    "secondary": "#3182ce", 
    "accent": "#ed8936",
    "light": "#f7fafc",
    "dark": "#1a202c"
  },
  "social": {
    "facebook": "https://facebook.com/yourclient",
    "instagram": "https://instagram.com/yourclient",
    "linkedin": "https://linkedin.com/company/yourclient"
  },
  "ga4": "G-XXXXXXXXXX",
  "schemaType": "LocalBusiness",
  "nav": [
    { "label": "Services", "url": "/services/" },
    { "label": "About", "url": "/about/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "services": [
    { "name": "Service One", "description": "Description", "url": "/services/" }
  ],
  "team": [],
  "cta": { "text": "Get Started", "url": "/contact/" },
  "footerLinks": []
}
```

### Color Customization

The template uses CSS custom properties that match the colors in `site.json`. To customize colors:

**Option 1: Update defaults in styles.css**
Edit the `:root` section in `src/assets/css/styles.css`:

```css
:root {
  --primary: #1a365d;      /* Update to match site.json */
  --secondary: #3182ce;    /* Update to match site.json */
  --accent: #ed8936;       /* Update to match site.json */
  /* ... */
}
```

**Option 2: Keep defaults and use site.json for reference**
The colors in `site.json` serve as documentation/reference. Update the CSS variables to match.

### Schema Type Options

Common `schemaType` values for JSON-LD:
- `LocalBusiness` (default)
- `RealEstateAgent`
- `Attorney`
- `Dentist`
- `Restaurant`
- `Organization`

## 📝 Content Customization

### Search for Customization Comments

Look for `<!-- CUSTOMIZE:` comments in all `.njk` files - these mark areas that need client-specific content.

### Key Content Areas

1. **Homepage Headlines** (`src/index.njk`)
   - Hero headline and subtitle
   - Problem/solution messaging
   - Service descriptions
   - Call-to-action text

2. **About Page** (`src/about/index.njk`)
   - Company story and mission
   - Team member information
   - Credentials and certifications

3. **Services Page** (`src/services/index.njk`)
   - Service descriptions and benefits
   - Process steps
   - Pricing (if applicable)

4. **Contact Page** (`src/contact/index.njk`)
   - Business hours
   - FAQ section
   - Contact methods

## 🌐 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set environment variable: `ELEVENTY_PATH_PREFIX=/repository-name`
4. Deploy with: `ELEVENTY_PATH_PREFIX=/repo-name npm run build`

### Vercel (Recommended)

1. **Personal Account:**
   ```bash
   npx vercel --prod --token=$(cat ~/.openclaw/credentials/vercel-token.txt)
   ```

2. **GullStack Team:**
   ```bash
   npx vercel --prod --token=$(cat ~/.openclaw/credentials/vercel-gullstack-token.txt) --scope=gullstack-projects
   ```

### Other Platforms

The built `_site` directory can be deployed to any static hosting service:
- Netlify
- Firebase Hosting
- AWS S3
- Cloudflare Pages

## 📧 Form Setup (SendGrid Integration)

The contact form submits to `/api/contact` and expects a SendGrid serverless function. 

### Spam Protection Features

1. **Honeypot Field** - Hidden `fax_number` field catches bots
2. **Timestamp Token** - Forms must be submitted 3+ seconds after page load
3. **Client-side Validation** - Basic validation before submission

### SendGrid Setup Notes

- Form posts to `/api/contact`
- Include honeypot and timestamp validation on server
- Return JSON responses: `{success: true}` or `{success: false, message: "error"}`

## 📋 Launch Checklist

### Content Review
- [ ] Updated all site.json information
- [ ] Replaced placeholder text in all pages
- [ ] Added client-specific imagery
- [ ] Reviewed and customized service descriptions
- [ ] Added team member information
- [ ] Updated contact information and hours

### Technical Setup
- [ ] Set up Google Analytics 4 (update GA4 in site.json)
- [ ] Configured contact form endpoint
- [ ] Added favicon and brand imagery
- [ ] Updated meta descriptions for all pages
- [ ] Tested mobile responsiveness
- [ ] Verified all links work correctly

### SEO & Performance
- [ ] Submitted sitemap to Google Search Console
- [ ] Verified structured data with Google's Rich Results Test
- [ ] Tested Core Web Vitals with PageSpeed Insights
- [ ] Confirmed HTML/CSS/JS minification is working
- [ ] Checked SEMrush compliance (minified output)

### Final Testing
- [ ] Tested contact form submission
- [ ] Verified mobile menu functionality
- [ ] Checked all pages on mobile devices
- [ ] Confirmed fast loading times
- [ ] Tested with accessibility tools

## 📁 File Structure

```
gullstack-starter/
├── README.md              # This file
├── .eleventy.js           # 11ty configuration with HTML minification
├── package.json           # Dependencies and build scripts
├── .gitignore            # Git ignore rules
├── minify.js             # CSS/JS minification script
├── src/
│   ├── _data/
│   │   └── site.json     # ALL client configuration
│   ├── _includes/
│   │   ├── base.njk      # HTML shell with meta tags, GA4, JSON-LD
│   │   ├── header.njk    # Navigation with mobile menu
│   │   ├── footer.njk    # Footer with GullStack credit
│   │   └── form.njk      # Contact form with spam protection
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css # Complete responsive CSS framework
│   │   └── js/
│   │       └── main.js   # Mobile menu, form handling, utilities
│   ├── about/index.njk   # About page template
│   ├── services/index.njk # Services overview template
│   ├── contact/index.njk # Contact page with form
│   ├── index.njk         # StoryBrand homepage template
│   ├── robots.txt        # SEO robots file
│   └── sitemap.njk       # Auto-generated XML sitemap
```

## 🎯 Design Philosophy

This template follows the **StoryBrand** framework:
1. **Hero:** Customer is the hero with a problem
2. **Problem:** Amplify the customer's pain points
3. **Solution:** Position your client as the guide
4. **Plan:** Show a simple 3-step process
5. **Call to Action:** Clear, prominent CTAs throughout

## 🚨 Important Notes

- **GullStack Credit:** Footer credit is REQUIRED on all client sites
- **Minification:** All HTML, CSS, and JS is automatically minified for SEO compliance
- **Mobile First:** Template is designed mobile-first, then enhanced for desktop
- **Performance:** Optimized for Core Web Vitals and fast loading times
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation support

## 🔧 Build Scripts

- `npm start` - Development server with live reload
- `npm run build` - Production build with full minification
- `npm run minify` - Manual CSS/JS minification (runs automatically in build)

## 💡 Tips for Success

1. **Start with site.json** - Get all the basic info right first
2. **Use the comments** - Search for `<!-- CUSTOMIZE:` to find all content areas
3. **Test mobile first** - Most traffic will be mobile
4. **Keep it simple** - Don't over-customize; the template works as-is
5. **Focus on outcomes** - Every piece of content should connect to customer results

---

**Built by GullStack** • Professional websites that convert • [gullstack.com](https://gullstack.com)