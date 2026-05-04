# AGENTS.md — Ingeniería Vial TEPATE

> Keep this file concise, current, and action-oriented. Link to repo docs instead of repeating them.

---

## Project Overview

This is the corporate website for **Ingeniería Vial TEPATE, S.A. de C.V.**. It is a static multi-page site for a Mexican B2B road-safety manufacturer/installer. All user-facing content is in Spanish (Mexico), and the visual system is intentionally industrial/brutalist: black surfaces, neon accents, square corners, and monospace details.

The site is not a SPA. Navigation between pages is a full request. Keep changes aligned with the existing HTML-first architecture.

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

Key files and folders:

- [index.html](index.html), [productos.html](productos.html), [servicios.html](servicios.html), [proyectos.html](proyectos.html), [nosotros.html](nosotros.html), [contacto.html](contacto.html), [aviso-privacidad.html](aviso-privacidad.html), [404.html](404.html)
- [src/main.ts](src/main.ts) for bootstrapping the shared UI behavior
- [src/scripts/](src/scripts) for isolated DOM modules
- [src/index.css](src/index.css) as the only stylesheet entry point; it now imports modular styles from [src/styles/](src/styles)
- [public/](public) for static assets served from `/`
- [vercel.json](vercel.json) for edge headers, CSP, and cache rules
- [AUDIT_REPORT.md](AUDIT_REPORT.md) for remediation history and validation notes
- [FIX_ISSUES_PROMPT.md](FIX_ISSUES_PROMPT.md) for the original fix scope and verification checklist

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

Important:
- There is no automated test suite in this repo.
- The only code-quality gate is `npm run lint` (`tsc --noEmit`).
- `npm run clean` uses `rm -rf`; on Windows, prefer deleting `dist/` manually if needed.

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

### Code Organization

### Entry Point (`src/main.ts`)

This file is intentionally thin. It only composes shared modules and a tiny back-to-top handler:

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

If you need new behavior, prefer a new module in `src/scripts/` and keep `src/main.ts` as composition only.

### Script Modules

| Module | Responsibility |
|--------|---------------|
| `analytics.ts` | One-liner wrapper around `@vercel/analytics` `inject()`. |
| `contact-form.ts` | Client-side validation for `#contactForm`. Sets `aria-invalid`, updates `aria-describedby` error messages, shows/hides `#formErrorSummary` (alert role), submits to Formspree endpoint via `fetch`, handles loading/disabled states. |
| `mobile-nav.ts` | Three independent initializers: (1) mobile hamburger menu toggle with `aria-expanded`/`aria-hidden`, Escape key support, and focus management; (2) desktop dropdown buttons with `aria-expanded` toggle, Escape to close, and focus-out handling; (3) mobile accordion toggles for nested category menus. |
| `product-modal.ts` | Opens a product detail modal when `.product-trigger` elements are clicked. Dynamically populates title, subtitle, description, image, and specs from `data-*` attributes and child DOM nodes. Implements focus return to trigger on close, Escape to close, and click-outside-to-close. |

### Styling

The stylesheet is modular now. [src/index.css](src/index.css) imports the layered files under [src/styles/](src/styles); do not reintroduce large inline CSS blocks unless there is a strong reason.

| File | Responsibility |
|------|---------------|
| [src/styles/base.css](src/styles/base.css) | Tokens, reset, focus states, motion reduction, print styles |
| [src/styles/layout.css](src/styles/layout.css) | Shared chrome: topbar, nav, mobile menu, footer, WhatsApp float, back-to-top |
| [src/styles/components.css](src/styles/components.css) | Buttons, cards, forms, accordion, pagination, modal, filters |
| [src/styles/home.css](src/styles/home.css) | Homepage sections |
| [src/styles/pages.css](src/styles/pages.css) | Secondary page layouts and content patterns |
| [src/styles/homepage.css](src/styles/homepage.css) | Homepage-only dropdowns, mobile accordion, gallery, PDF buttons, footer details |

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
Preserve existing HTML comment markers such as `MOD-*` and `AUDIT` unless you are explicitly refactoring the affected section. They are part of the repo’s editing history.

### CSS Conventions
- Class names are lowercase, hyphenated, and often abbreviated (`.hprod`, `.svc`, `.gitem`, `.pcat`, `.mvv`).
- BEM-like naming is not used.
- Keep media queries near the rules they affect.
- `!important` is reserved for global resets or other unavoidable overrides.

### Accessibility (A11y) Requirements
New interactive UI must follow the existing patterns:
- Use real `<button>` elements for triggers.
- Keep `aria-expanded`, `aria-controls`, and Escape handling in sync for expandable widgets.
- Trap focus in modals and return focus to the opener.
- Use `aria-invalid` and `aria-describedby` for form errors.
- Keep visible `:focus-visible` outlines and `prefers-reduced-motion` behavior intact.
- Preserve the skip link and `<main id="main-content">` structure on every page.

### Image Handling
- Hero/gallery images live under `/TEPATE_Imagenes_Organizadas/`.
- Brand logos live under `/TEPATE_Marcas/`.
- Use `loading="lazy"` for non-critical images.
- Use `fetchpriority="high"` and `decoding="async"` for hero images.
- Keep CLS protections such as `aspect-ratio` in place.

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

Warning: if you add a new external domain, update the CSP in [vercel.json](vercel.json) or production will block it.

### Environment Variables

The `.env.example` file documents two variables used when the app runs inside **Google AI Studio**:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Injected by AI Studio for Gemini API calls |
| `APP_URL` | Injected by AI Studio with the Cloud Run service URL |

For normal local development, these are not required.

---

## Testing Strategy

There is no automated test suite in this repo. Validate changes with:
1. `npm run lint`
2. `npm run build`
3. Manual keyboard checks for nav, modal, mobile menu, and contact form behavior

If tests are added later, keep them lightweight and focused on the shared navigation/modal/form flows.

---

## Security Considerations

1. CSP and related headers are enforced through [vercel.json](vercel.json).
2. The contact form uses client-side `fetch` to Formspree; preserve the current validation and ARIA semantics if you change it.
3. Do not commit secrets. The `.env.example` file only documents AI Studio variables.
4. Vercel Analytics is already accounted for in the CSP.

---

## Useful References

- [README.md](README.md) for local run instructions and the short project overview
- [AUDIT_REPORT.md](AUDIT_REPORT.md) for implementation history and validation notes
- [FIX_ISSUES_PROMPT.md](FIX_ISSUES_PROMPT.md) for the remediation scope and checklist
- [vercel.json](vercel.json) for edge headers and caching rules
- [sitemap.xml](sitemap.xml) for the indexed page list

---

## Common Pitfalls

1. Do not treat this as a SPA.
2. Do not add a frontend framework unless the user explicitly asks.
3. Do not bypass [src/index.css](src/index.css); route styles through the modular `src/styles/` files.
4. Do not use `app/applet/optimize.js` as part of the normal build; it is a legacy HTML rewriting script.
