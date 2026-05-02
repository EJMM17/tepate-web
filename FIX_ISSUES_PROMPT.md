# Prompt to Fix Homepage Audit Issues on a New Branch

Use this prompt with your coding agent:

---

You are a senior fullstack engineer working in the repository at `/workspace/tepate-web`.

## Goal
Implement and verify the critical and high-priority issues identified in `AUDIT_REPORT.md` for the homepage (`index.html`) and related shared assets.

## Git workflow (required)
1. Create and switch to a new branch named:
   - `fix/homepage-audit-remediation`
2. Make focused commits with clear messages.
3. Open a PR with:
   - Summary of implemented fixes
   - Before/after behavior
   - Test evidence

## Scope of implementation

### 1) Accessibility fixes (P1)
- Replace hover-only desktop dropdown triggers with keyboard-accessible buttons.
  - Use semantic `<button>` elements.
  - Add and maintain `aria-haspopup="true"` and `aria-expanded`.
  - Ensure Escape closes open menus.
  - Ensure Tab/Shift+Tab behavior is logical.
- Implement robust modal accessibility.
  - Add `role="dialog"`, `aria-modal="true"`, and proper labeling.
  - Add focus trap while modal is open.
  - Restore focus to original trigger when modal closes.
- Improve form validation semantics.
  - Add `aria-invalid` for invalid inputs.
  - Add field-specific error text linked with `aria-describedby`.
  - Add a summary error container with `role="alert"` or `aria-live="assertive"`.

### 2) Security hardening (P0/P1)
- Update `vercel.json` with secure headers:
  - Content-Security-Policy (start safe and practical for current dependencies)
  - X-Frame-Options
  - Referrer-Policy
  - Permissions-Policy
  - Strict-Transport-Security
- Validate no functionality regressions after CSP is applied.

### 3) Maintainability refactor (P1)
- Split `src/main.ts` into cohesive modules:
  - `src/scripts/analytics.ts`
  - `src/scripts/contact-form.ts`
  - `src/scripts/mobile-nav.ts`
  - `src/scripts/product-modal.ts`
  - `src/main.ts` should become lightweight composition/bootstrap.
- Move large inline CSS blocks from `index.html` into dedicated CSS files under `src/styles/` and import them through the main stylesheet flow.

### 4) Performance hygiene (P2)
- Optimize font loading strategy:
  - Reduce weights/families to only those used OR self-host fonts.
- Confirm non-critical images are lazy-loaded.
- Keep CLS protections intact.

## Constraints
- Preserve existing visual design and branding.
- Do not break existing routes/pages.
- Keep changes backwards compatible and production-safe.
- Prefer incremental, readable refactors over risky rewrites.

## Validation checklist (must run)
Run and report output for:
1. `npm ci` (if needed)
2. `npm run -s build`
3. `npm run -s lint` (if available)
4. `npm run -s test` (if available)

Also perform manual checks:
- Keyboard-only navigation for desktop dropdowns.
- Modal open/close + focus trap + focus return.
- Form validation announcements with screen reader semantics.
- Confirm security headers present in built/deployed response configuration.

## Deliverables
1. Code changes implementing the items above.
2. Updated docs/changelog section summarizing what was fixed.
3. PR body including:
   - What changed
   - Why it changed
   - Risks and mitigations
   - Test evidence (commands + results)

---

If there is ambiguity, prioritize accessibility and security first, then maintainability, then performance.
