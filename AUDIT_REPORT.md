# Fullstack Audit — tepate.com.mx (Homepage)

Date: 2026-05-02
Scope: `index.html`, `src/main.ts`, `src/index.css`

## Executive Summary

This homepage has a strong visual identity and generally good SEO fundamentals (meta tags, canonical, OpenGraph/Twitter, and JSON-LD present). However, there are key improvements needed in **maintainability, accessibility, performance hygiene, and security hardening**.

### Priority snapshot
- **P0 (critical):** Add CSP and additional security headers at edge (Vercel config).
- **P1 (high):** Improve keyboard/screen-reader behavior for hover-only dropdown nav and modal focus trap.
- **P1 (high):** Reduce inline CSS/JS coupling inside `index.html` and centralize styles/scripts.
- **P2 (medium):** Optimize webfont loading strategy and reduce render-blocking risk.
- **P2 (medium):** Improve form error semantics and ARIA live region behavior.

---

## Findings by Category

## 1) Architecture & Maintainability

### ✅ What is good
- TypeScript is used for interaction logic in `src/main.ts`.
- Styling variables and design-system-like tokens exist in `src/index.css`.

### ⚠️ Gaps
1. **Large inline style block in `index.html`** mixes page structure and UI behavior styles.
   - Impact: harder long-term maintenance, difficult style ownership, larger HTML payload.
   - Recommendation: move inline blocks into modular CSS files (`src/styles/nav.css`, `src/styles/gallery.css`) and import once.

2. **Comment markers like MOD-A/MOD-B/AUDIT in production markup** suggest iterative patching rather than componentization.
   - Impact: onboarding friction and accidental regression risk.
   - Recommendation: move feature sections into clearly named partials/components (or at least separate source sections with build-time templates).

3. **Script file handles many unrelated concerns** (analytics injection, form, nav, modal) in one place.
   - Impact: low cohesion and harder testing.
   - Recommendation: split `src/main.ts` into `analytics.ts`, `contact-form.ts`, `mobile-nav.ts`, `product-modal.ts`.

---

## 2) Accessibility (A11y)

### ✅ What is good
- Visible focus state is defined using `:focus-visible`.
- Mobile menu includes `aria-hidden` and `aria-expanded` state changes.

### ⚠️ Gaps
1. **Desktop dropdown depends on `:hover` + `:focus-within` without explicit button semantics/state.**
   - Risk: inconsistent keyboard and screen-reader discoverability.
   - Recommendation: use real `<button aria-haspopup="true" aria-expanded="false">` triggers and update expanded state via JS.

2. **Modal lacks full focus trap and focus return origin tracking.**
   - Risk: keyboard users can tab into background content.
   - Recommendation: trap focus while modal open, set `aria-modal="true" role="dialog"`, return focus to triggering card.

3. **Form validation only applies visual invalid class.**
   - Risk: assistive tech may not announce which fields failed.
   - Recommendation: set `aria-invalid="true"`, connect per-field errors via `aria-describedby`, and add `role="alert"` on summary error container.

---

## 3) Performance

### ✅ What is good
- Hero image preload is present with `fetchpriority="high"`.
- Aspect-ratio usage helps avoid CLS in several visual containers.

### ⚠️ Gaps
1. **Google Fonts loaded via external CSS in `<head>` still introduces network dependency and potential render delay.**
   - Recommendation: self-host fonts or reduce families/weights to only used variants.

2. **Global grayscale/filter hover effects on many images** may increase paint cost on lower-end devices.
   - Recommendation: apply effects only to key images or use static optimized variants.

3. **Potentially heavy image inventory in repo** suggests risk of oversized transfers.
   - Recommendation: enforce image budgets (e.g., hero < 250KB webp/avif, gallery < 150KB each) and lazy-load non-critical images.

---

## 4) SEO

### ✅ What is good
- Canonical, description, OpenGraph, Twitter tags and JSON-LD LocalBusiness are present.
- `og:locale` and business metadata are coherent for MX audience.

### ⚠️ Gaps
1. **Single-page SEO quality depends on consistent per-page metadata across other HTML pages.**
   - Recommendation: audit all pages (`servicios.html`, `productos.html`, etc.) for unique title/description/canonical and schema suitability.

2. **No explicit breadcrumb schema on deeper pages (likely needed).**
   - Recommendation: add `BreadcrumbList` JSON-LD on secondary pages.

---

## 5) Security

### ⚠️ High-priority gaps
1. **No Content Security Policy (CSP) found in page/edge config.**
   - Recommendation: add CSP in `vercel.json` headers and tighten gradually.

2. **No explicit `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` in current review scope.**
   - Recommendation: define secure defaults in Vercel headers.

3. **Form endpoint handling is client-side only.**
   - Recommendation: add bot protection (honeypot/time check), rate limiting at endpoint provider, and explicit consent logging if legally required.

---

## 6) QA & Observability

### Recommendations
- Add Lighthouse CI in pipeline for performance/a11y/SEO budgets.
- Add minimal E2E checks for:
  - keyboard navigation in desktop dropdown,
  - modal escape/focus trap,
  - form validation and success/error messaging.
- Keep Vercel analytics, and add custom event tracking for CTA clicks and form submits.

---

## Action Plan (30/60/90)

### Next 30 days
- Split monolithic `src/main.ts` logic into modules.
- Move inline nav/gallery styles from `index.html` into dedicated CSS files.
- Implement modal focus trap + dropdown button semantics.

### Next 60 days
- Add security headers in `vercel.json` (CSP, HSTS, Referrer-Policy, Permissions-Policy).
- Standardize metadata templates for all HTML pages.

### Next 90 days
- Introduce CI quality gates (Lighthouse + a11y + E2E smoke).
- Establish image/font performance budgets and automated checks.

---

## Overall score (current snapshot)
- Maintainability: **6.5/10**
- Accessibility: **6/10**
- Performance: **7/10**
- SEO: **8/10**
- Security hardening: **5/10**

**Composite:** **6.5/10** with strong branding/SEO baseline and clear path to 8+/10.
