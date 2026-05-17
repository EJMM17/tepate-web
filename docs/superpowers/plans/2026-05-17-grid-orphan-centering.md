# Grid Orphan Centering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `display:grid` with `display:flex + justify-content:center` on three grids so orphan cards (1 or 2 items in the last row) are centered instead of left-aligned with visible empty cells.

**Architecture:** All changes are CSS-only in `src/styles/pages.css`. `proj-grid` is a straightforward flex swap with `gap`. `spec-grid` and `clients` use the `gap:1px; background:var(--steel)` border trick, which is replaced with explicit `border-right` (column dividers) and `border-top` (row dividers) on cards — avoiding conflict with `.spec`'s existing `border-bottom: 3px solid transparent` hover animation. Zero Astro template changes.

**Tech Stack:** Pure CSS, Astro dev server (`npm run dev`)

---

## File Map

| File | What changes |
|------|-------------|
| `src/styles/pages.css:80-86` | `.spec-grid` — flex swap, remove gap+background trick |
| `src/styles/pages.css:88-101` | `.spec` — add flex sizing + `border-right` + `border-top` |
| `src/styles/pages.css:188-195` | `.clients` — flex swap, remove gap+background trick |
| `src/styles/pages.css:197-203` | `.client` — add flex sizing + `border-right` + `border-top` |
| `src/styles/pages.css:273-289` | `.proj-grid` — flex swap, remove grid-template-columns |
| `src/styles/pages.css:290-304` | `.proj` — add flex sizing per breakpoint |

---

## Task 1: Fix `.proj-grid` (Proyectos page)

**Files:**
- Modify: `src/styles/pages.css:273-304`

### Context

`.proj-grid` currently uses `display: grid` with `grid-template-columns` per breakpoint. Cards (`div.proj`) have `width: 100%` and their own `border: 1px solid var(--steel)` + `border-bottom: 3px solid var(--steel)`. With `gap: 16px`, switching to flex is a clean drop-in — no border strategy change needed.

32 items ÷ 3 cols = 10 full rows + 2 orphan cards. After the fix those 2 orphans center automatically.

- [ ] **Step 1: Open the dev server to see the current state**

```bash
npm run dev
```

Navigate to `http://localhost:4321/proyectos` and scroll to the last row of project cards. Confirm: 2 cards are left-aligned at the bottom with empty space to the right.

- [ ] **Step 2: Replace `.proj-grid` CSS**

In `src/styles/pages.css`, find the block at lines ~273-289:

```css
/* BEFORE — remove this entire block */
.proj-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 40px auto 0;
  max-width: 1200px;
}
@media(min-width: 768px) {
  .proj-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media(min-width: 1200px) {
  .proj-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Replace with:

```css
.proj-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 40px auto 0;
  max-width: 1200px;
}
```

- [ ] **Step 3: Add flex sizing to `.proj`**

Find `.proj` in `src/styles/pages.css` (~line 290). It currently has `width: 100%`. Add responsive flex sizing. The block looks like:

```css
.proj {
  background: var(--coal);
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;           /* ← change this */
  transition: ...
  ...
}
```

Change `width: 100%` to `flex: 0 0 100%` so it reads as the flex basis, then add the responsive overrides right after the `.proj` block's closing `}`:

```css
@media(min-width: 768px) {
  .proj { flex: 0 0 calc((100% - 16px) / 2); }
}
@media(min-width: 1200px) {
  .proj { flex: 0 0 calc((100% - 32px) / 3); }
}
```

The math: at 2-col, one 16px gap splits between 2 cards = subtract 16px, divide by 2. At 3-col, two 16px gaps = subtract 32px, divide by 3.

- [ ] **Step 4: Verify in browser**

Check `http://localhost:4321/proyectos`:

- Scroll to the last row — 2 cards should be **centered** with equal dark space on both sides.
- Resize the window to 768–1199px — should show 2-col with orphans also centered.
- Resize to < 768px — single column, full width.
- Hover any card — transform, shadow, and neon bottom border animation must still work.
- Filter buttons (if present on the page) should still work.

- [ ] **Step 5: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center orphan cards in proj-grid via flexbox"
```

---

## Task 2: Fix `.spec-grid` (Productos page)

**Files:**
- Modify: `src/styles/pages.css:80-101`

### Context

`.spec-grid` uses `gap:1px; background:var(--steel)` to create 1px steel dividers between cells — the cards' dark `background:var(--coal)` covers the grid background, leaving only the 1px gaps visible as dividers. This trick requires grid; switching to flex means we must replicate dividers with explicit borders.

`.spec` has `border-bottom: 3px solid transparent` which changes to `var(--neon)` on hover — we must NOT use `border-bottom` for structural dividers. Instead:
- **Column dividers**: `border-right: 1px solid var(--steel)` on each `.spec`
- **Row dividers**: `border-top: 1px solid var(--steel)` on each `.spec`

The container keeps `border: 1px solid var(--steel)` as the outer frame. The first row's `border-top` creates a visually 2px top outer border (card border-top + container border-top are adjacent); this is a minor imperfection that is imperceptible on the dark theme.

- [ ] **Step 1: Verify the current problem**

Navigate to `http://localhost:4321/productos`. Find any product category that has a number of products NOT divisible by 3 (e.g., Calderas). The last row should show 1–2 cards left-aligned with a **steel-colored rectangle** filling the empty cell(s) to the right.

- [ ] **Step 2: Replace `.spec-grid` CSS**

Find the block at lines ~80-86:

```css
/* BEFORE — remove this entire block */
.spec-grid{
  display:grid;grid-template-columns:1fr;gap:1px;
  background:var(--steel);border:1px solid var(--steel);
  max-width:1200px;margin:0 auto;
}
@media(min-width:640px){.spec-grid{grid-template-columns:1fr 1fr}}
@media(min-width:1024px){.spec-grid{grid-template-columns:repeat(3,1fr)}}
```

Replace with:

```css
.spec-grid{
  display:flex;flex-wrap:wrap;justify-content:center;
  border:1px solid var(--steel);
  max-width:1200px;margin:0 auto;
}
```

- [ ] **Step 3: Add flex sizing and border dividers to `.spec`**

Find `.spec` at lines ~88-101. Add flex sizing and border properties inside the `.spec` rule. The rule currently starts:

```css
.spec{
  background:var(--coal);
  display:flex;flex-direction:column;
  overflow:hidden;
  transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
}
```

Add three new properties — `flex`, `border-right`, and `border-top`:

```css
.spec{
  background:var(--coal);
  display:flex;flex-direction:column;
  overflow:hidden;
  transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  flex:0 0 100%;
  border-right:1px solid var(--steel);
  border-top:1px solid var(--steel);
}
```

Then add responsive flex sizing immediately after the closing `}` of `.spec:hover`:

```css
@media(min-width:640px){.spec-grid > .spec{flex:0 0 50%}}
@media(min-width:1024px){.spec-grid > .spec{flex:0 0 calc(100% / 3)}}
```

- [ ] **Step 4: Verify in browser**

Check `http://localhost:4321/productos`:

- Find a category with orphan products. Last row cards must be **centered**, no steel-colored empty area.
- Check a category with exactly 3 or 6 products — full rows, no change in appearance.
- Hover a product card — neon bottom border and lift animation must still work.
- Check the 640px breakpoint — 2-col with any orphans centered.
- Check mobile — single column.

- [ ] **Step 5: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center orphan cards in spec-grid via flexbox"
```

---

## Task 3: Fix `.clients` (Nosotros page — Clientes & Proveedores)

**Files:**
- Modify: `src/styles/pages.css:188-237`

### Context

`.clients` uses the same `gap:1px; background:var(--steel)` border trick as `.spec-grid`. The grid is 3-col (mobile) → 4-col (640px) → 5-col (1024px). `.client` has no `border-bottom` hover animation, so we can use `border-bottom: 1px solid var(--steel)` for row dividers freely — simpler than `.spec`.

Two separate `.clients` grids exist on `/nosotros`: one for clients (14 items) and one for suppliers (12 items). The CSS class is the same for both; fixing the class fixes both at once.

At 5-col desktop: 14 items = 2 full rows + 4 orphans. 12 items = 2 full rows + 2 orphans. Both center.

The neon top border (`border-top: 2px solid var(--neon)`) on the container must be preserved.

- [ ] **Step 1: Verify the current problem**

Navigate to `http://localhost:4321/nosotros` and scroll to the Clientes and Proveedores sections. At desktop (≥1024px), the last row of each grid has orphan logos left-aligned with steel-colored empty cells.

- [ ] **Step 2: Replace `.clients` CSS**

Find the block at lines ~188-195:

```css
/* BEFORE — remove this entire block */
.clients{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1px;background:var(--steel);
  border:1px solid var(--steel);border-top:2px solid var(--neon);
  margin:40px auto 0;max-width:1200px;
}
@media(min-width:640px){.clients{grid-template-columns:repeat(4,1fr)}}
@media(min-width:1024px){.clients{grid-template-columns:repeat(5,1fr)}}
```

Replace with:

```css
.clients{
  display:flex;flex-wrap:wrap;justify-content:center;
  border:1px solid var(--steel);border-top:2px solid var(--neon);
  margin:40px auto 0;max-width:1200px;
}
```

- [ ] **Step 3: Add flex sizing and border dividers to `.client`**

Find `.client` at lines ~197-203. It currently contains no border declarations. Add `flex`, `border-right`, `border-bottom`, and `border-top`:

```css
.client{
  background:var(--coal);
  display:flex;align-items:center;justify-content:center;
  min-height:96px;padding:20px 18px;
  position:relative;overflow:hidden;
  transition:background .25s ease;
  flex:0 0 calc(100% / 3);
  border-right:1px solid var(--steel);
  border-bottom:1px solid var(--steel);
  border-top:1px solid var(--steel);
}
```

Then add responsive overrides immediately after `.client:hover::after{...}` block:

```css
@media(min-width:640px){.clients > .client{flex:0 0 25%}}
@media(min-width:1024px){.clients > .client{flex:0 0 20%}}
```

- [ ] **Step 4: Verify in browser**

Check `http://localhost:4321/nosotros`:

- Clientes section: 14 logos at desktop → last row has 4 centered logos, dark space on both sides.
- Proveedores section: 12 logos at desktop → last row has 2 centered logos.
- Hover a logo — background lightens, neon sweep animation (`.client::after`) still plays.
- At 640px tablet (4-col): check orphans of both grids are centered.
- At mobile (3-col): 14 items = 4 full rows + 2 orphans; 12 items = 4 full rows, no orphans.
- The neon top border on both grids must remain visible.

- [ ] **Step 5: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center orphan cards in clients grid via flexbox"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `proj-grid`: Task 1 covers it fully
- ✅ `spec-grid`: Task 2 covers it fully, including the `border-bottom` hover conflict
- ✅ `.clients`: Task 3 covers it, both clientes and proveedores grids
- ✅ `.mvv` excluded (4 items in 4 cols, no orphan risk) — confirmed not touched
- ✅ Zero Astro template changes — confirmed, all tasks modify only CSS
- ✅ Hover animations preserved — `border-bottom: 3px solid transparent` and `.client::after` neon sweep both kept

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:** No types/methods — pure CSS. Property names consistent across tasks.
