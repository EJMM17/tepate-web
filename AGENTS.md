# AGENTS.md — Ingeniería Vial TEPATE

> This file contains project-specific context for AI coding agents. The reader is assumed to know nothing about this repository.

---

## Project Overview

This is the official corporate website for **Ingeniería Vial TEPATE, S.A. de C.V.**, a Mexican B2B manufacturer and installer of road safety infrastructure. The company is based in Apodaca/Guadalupe, Nuevo León, Mexico, and serves clients nationwide including municipalities, state governments, and private construction firms.

The site is a **static multi-page website** (not a SPA) built with vanilla TypeScript, custom CSS, and Vite. It follows an "industrial brutalist" visual design: pure black backgrounds, neon yellow-green accents (`#E1FF00`), zero rounded corners, hard edges, and monospace typography.

**Key business lines represented on the site:**
- Thermoplastic boilers and application machines (fabricated in-house)
- Horizontal and vertical road signage
- Work zone protection devices (cones, barrels, barriers)
- Solar-powered traffic equipment
- Traffic engineering studies

All user-facing content is in **Spanish (Mexico)**.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build tool | Vite | 6.2.0 |
| CSS framework | Tailwind CSS | 4.1.14 (via `@tailwindcss/vite`) |
| Language | TypeScript | 5.7.3 |
| Runtime target | ES2022 / ESNext modules | — |
| Package manager | npm | — |
| Node engine | 20.x | — |
| Deployment | Vercel | — |
| Analytics | Vercel Analytics (`@vercel/analytics`) | 2.0.1 |

**No frontend framework** (React, Vue, etc.) is used. All interactivity is implemented with vanilla TypeScript DOM APIs.

---

## Project Structure

```
tepate-web/
├── index.html                 # Homepage
├── productos.html             # Product catalog (calderas, señalamiento, etc.)
├── servicios.html             # Services detail page
├── proyectos.html             # Project portfolio / gallery
├── nosotros.html              # About us / company info
├── contacto.html              # Contact form page
├── aviso-privacidad.html      # Privacy policy (legal)
├── 404.html                   # Not found page
│
├── src/
│   ├── main.ts                # Entry point — composes and initializes all modules
│   ├── index.css              # Main stylesheet (~1800 lines, design system + all page styles)
│   ├── scripts/
│   │   ├── analytics.ts       # Vercel Analytics injection
│   │   ├── contact-form.ts    # Form validation, ARIA error semantics, Formspree submission
│   │   ├── mobile-nav.ts      # Mobile hamburger menu, desktop dropdowns, mobile accordion
│   │   └── product-modal.ts   # Product detail modal with focus trap and focus return
│   └── styles/
│       └── homepage.css       # Homepage-specific styles (nav dropdowns, machinery gallery, PDF buttons, footer)
│
├── public/                    # Static assets served at root
│   ├── TEPATE_Imagenes_Organizadas/   # Product and project photos
│   ├── TEPATE_Marcas/                 # Client and supplier brand logos
│   ├── *.pdf, *.webp, *.png, etc.     # Catalogs, hero images, favicons
│   └── .htaccess
│
├── dist/                      # Vite build output (generated, not committed)
├── vercel.json                # Vercel deployment config (headers, redirects, CSP)
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Crawler instructions
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example               # GEMINI_API_KEY, APP_URL (for AI Studio runtime)
└── metadata.json              # AI Studio app metadata
```

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000, host 0.0.0.0)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Type-check without emitting
npm run lint

# Clean build output
npm run clean
```

**Important:** There is no test suite, no formatter (Prettier), and no linter (ESLint) configured. The only quality gate is `tsc --noEmit`.

---

## Build Configuration

### Vite (`vite.config.ts`)

- **Multi-page input:** All HTML files are declared as Rollup inputs so that Vite processes each page as a separate entry point.
- **Path alias:** `@/` maps to the project root (`__dirname`).
- **HMR:** Disabled when `DISABLE_HMR=true` (AI Studio environment).
- **Tailwind CSS:** Integrated via the official Vite plugin (`@tailwindcss/vite`).

### TypeScript (`tsconfig.json`)

- `target`: ES2022
- `module`: ESNext
- `moduleResolution`: bundler
- `isolatedModules`: true
- `noEmit`: true
- `allowImportingTsExtensions`: true
- `paths`: `@/*` → `./*`

---

## Code Organization

### Entry Point (`src/main.ts`)

This file is intentionally thin. It imports and initializes all feature modules:

```ts
import { initAnalytics } from './scripts/analytics';
import { initContactForm } from './scripts/contact-form';
import { initDesktopDropdowns, initMobileAccordion, initMobileNav } from './scripts/mobile-nav';
import { initProductModal } from './scripts/product-modal';

initAnalytics();
initContactForm();
initMobileNav();
initMobileAccordion();
initDesktopDropdowns();
initProductModal();
```

Plus a small inline handler for the back-to-top button.

### Script Modules

| Module | Responsibility |
|--------|---------------|
| `analytics.ts` | One-liner wrapper around `@vercel/analytics` `inject()`. |
| `contact-form.ts` | Client-side validation for `#contactForm`. Sets `aria-invalid`, updates `aria-describedby` error messages, shows/hides `#formErrorSummary` (alert role), submits to Formspree endpoint via `fetch`, handles loading/disabled states. |
| `mobile-nav.ts` | Three independent initializers: (1) mobile hamburger menu toggle with `aria-expanded`/`aria-hidden`, Escape key support, and focus management; (2) desktop dropdown buttons with `aria-expanded` toggle, Escape to close, and focus-out handling; (3) mobile accordion toggles for nested category menus. |
| `product-modal.ts` | Opens a product detail modal when `.product-trigger` elements are clicked. Dynamically populates title, subtitle, description, image, and specs from `data-*` attributes and child DOM nodes. Implements focus return to trigger on close, Escape to close, and click-outside-to-close. |

### Styling

The CSS has been modularized into a layered architecture. All modules are imported from `src/index.css` (the single entry point consumed by every HTML page).

| File | Responsibility |
|------|---------------|
| `src/styles/base.css` | Design tokens, global reset, accessibility focus states, CLS prevention, animations, skip-link, `prefers-reduced-motion`, print styles |
| `src/styles/layout.css` | Topbar, sticky nav, hamburger, mobile menu, footer, WhatsApp float, back-to-top |
| `src/styles/components.css` | Buttons, cards, forms, accordion, filter bar, pagination, modal, contact info, map overrides |
| `src/styles/home.css` | Hero, stats, products grid, services grid, CTA band, why section, gallery, testimonials, contact section |
| `src/styles/pages.css` | Page headers, product categories (`pcat`), spec grids, duo panels, client grids, MVV cards, project masonry, legal prose, contact page layout |
| `src/styles/homepage.css` | Nav dropdown panels, mobile accordion, machinery gallery, PDF buttons, footer slogan/credits |

**Design system tokens (excerpt):**
```css
--neon: #E1FF00;        /* Primary accent */
--black: #000000;       /* Page background */
--asphalt: #0A0A0A;     /* Elevated surfaces */
--coal: #0F0F0F;        /* Cards */
--char: #141414;        /* Hover cards */
--steel: #262626;       /* Borders */
--bone: #CCCCCC;        /* Body text */
--white: #F2F2F2;       /* Headlines */
--fd: 'Barlow Condensed', sans-serif;  /* Display font */
--fb: 'Barlow', sans-serif;            /* Body font */
--fm: 'IBM Plex Mono', monospace;      /* Mono font */
```

---

## Page Architecture

Each page is a standalone HTML file in the project root. They share:

- The same `<nav>` structure (with dropdowns and mobile menu)
- The same footer structure
- The same `src/main.ts` entry point (loaded as `type="module"`)
- The same `src/index.css` stylesheet
- Google Fonts loaded from `fonts.googleapis.com` (Barlow Condensed, Barlow, IBM Plex Mono)

Pages include SEO metadata per page:
- Unique `<title>` and `<meta name="description">`
- Open Graph and Twitter Card tags
- Canonical URL
- JSON-LD structured data (`LocalBusiness`, `ItemList`, etc.)

---

## Development Conventions

### Comment Markers
You will see inline HTML comments like `<!-- MOD-A-START -->` and `<!-- MOD-A-END -->` throughout `index.html`. These markers denote feature boundaries added during iterative development. They are present in production markup. Do not remove them unless you are explicitly refactoring that section into a cleaner structure.

### CSS Conventions
- Class names are lowercase, hyphenated, and often abbreviated (`.hprod`, `.svc`, `.gitem`, `.pcat`, `.mvv`).
- BEM-like naming is **not** used.
- Media queries are inline next to their rules, not grouped.
- `!important` is used sparingly but intentionally for global resets (e.g., `border-radius: 0 !important`).

### Accessibility (A11y) Requirements
This project has undergone formal accessibility remediation. All new interactive components **must** adhere to these patterns:
- Use `<button>` elements for all clickable triggers (not `<div>` or `<span>`).
- Maintain `aria-expanded` and `aria-controls` on expandable widgets.
- Trap focus inside modals while open and return focus to the trigger on close.
- Use `aria-invalid` and `aria-describedby` for form validation errors.
- Provide visible `:focus-visible` outlines (neon color, 3px solid).
- Support Escape key dismissal for menus, modals, and dropdowns.
- Every page must include a skip-to-content link (`<a href="#main-content" class="skip-link">`) and wrap primary content in `<main id="main-content">`.
- Respect `prefers-reduced-motion` for animations and transitions.
- Provide basic `@media print` styles for printable output.

### Image Handling
- Hero/gallery images are in `/TEPATE_Imagenes_Organizadas/` (organized by category).
- Brand logos are in `/TEPATE_Marcas/`.
- Use `loading="lazy"` for non-critical images.
- Use `fetchpriority="high"` and `decoding="async"` for hero images.
- Use `aspect-ratio` CSS on image containers to prevent CLS.

---

## Deployment

### Vercel (`vercel.json`)

The deployment configuration includes:

- **Security headers:**
  - `Content-Security-Policy` (CSP) — configured for current dependencies (Google Fonts, Formspree, Vercel scripts)
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (restricts camera, microphone, geolocation)
  - `Strict-Transport-Security` (HSTS)
- **Cache headers:**
  - CSS/JS/woff: `max-age=31536000, immutable`
  - Images: `max-age=15552000`
  - PDFs: `max-age=86400` + `Content-Disposition: attachment`
- **Redirects:** `/index.html` → `/` (permanent)
- **Clean URLs:** Disabled (`.html` extensions are preserved in URLs)

**Warning:** If you add new external domains (fonts, APIs, images), you **must** update the CSP in `vercel.json` or the resource will be blocked in production.

### Environment Variables

The `.env.example` file documents two variables used when the app runs inside **Google AI Studio**:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Injected by AI Studio for Gemini API calls |
| `APP_URL` | Injected by AI Studio with the Cloud Run service URL |

For normal local development, these are not required.

---

## Testing Strategy

**Current state:** There is no automated test suite (no Jest, Vitest, Playwright, or Cypress).

Validation is manual and build-based:
1. `npm run lint` — TypeScript type checking
2. `npm run build` — Vite production build must succeed without errors
3. Manual checks:
   - Keyboard navigation for desktop dropdowns (Tab, Shift+Tab, Escape)
   - Modal open/close, focus trap, focus return
   - Mobile hamburger menu open/close
   - Form validation error announcements
   - Responsive layout across breakpoints (mobile, tablet, desktop)

**If adding tests:** The project would benefit from minimal E2E smoke tests for the navigation, modal, and contact form flows. There is no testing infrastructure in place yet.

---

## Security Considerations

1. **CSP is enforced** via Vercel headers. Any new external script, style, font, image, or connect domain must be added to the CSP directive.
2. **The contact form** submits to Formspree (`formspree.io`) via client-side `fetch`. There is no server-side rate limiting or bot protection in this codebase. If adding a backend endpoint, implement honeypot fields and rate limiting.
3. **No sensitive data** (passwords, API keys, PII) is stored in the repository. The `.env.example` is safe to commit.
4. **Vercel Analytics** injects a small script for Web Vitals. This is already whitelisted in the CSP.

---

## Asset Inventory

### Fonts (Google Fonts, external)
- Barlow Condensed (weights 400, 700; used for headlines)
- Barlow (weights 400, 600; used for body)
- IBM Plex Mono (weights 400, 600; used for labels, tags, metadata)

### Static Files in `public/`
- `TEPATE_Imagenes_Organizadas/` — Product photos and project gallery images (WebP)
- `TEPATE_Marcas/` — Client logos and supplier brand marks (WebP)
- `calderas-termoplasticas-tepate.pdf` — Product catalog PDF
- `logo.webp`, `favicon.ico`, `apple-touch-icon.png`, etc. — Brand assets
- `.htaccess` — Apache fallback rules

### Images
Images are largely unoptimized in the repository. Hero images should ideally be < 250 KB WebP, gallery images < 150 KB WebP. Lazy loading is required for all non-hero images.

---

## Common Pitfalls

1. **Do not treat this as a SPA.** Navigation between pages is a full server round-trip. Shared components (nav, footer) are duplicated across HTML files.
2. **Do not add a frontend framework** without explicit user approval. The current architecture is intentionally lightweight.
3. **Modifying `src/index.css` affects all pages.** It is a monolithic stylesheet. For page-specific styles, consider adding a new file under `src/styles/` and importing it from the relevant HTML page.
4. **The `clean` script uses `rm -rf`.** This will not work on Windows natively. Use `npm run build` instead, or delete `dist/` manually.
5. **Comment markers** like `MOD-A`, `MOD-B`, `AUDIT` should be preserved during minor edits. Only remove them during intentional refactoring.

---

## Useful References

- **Audit report:** `AUDIT_REPORT.md` — Full accessibility, performance, SEO, and security audit from 2026-05-02.
- **Fix prompt:** `FIX_ISSUES_PROMPT.md` — Detailed prompt used to implement the audit remediation.
- **Vercel config:** `vercel.json` — Edge headers and caching rules.
- **Sitemap:** `sitemap.xml` — All indexed pages and priorities.
