# Grid Orphan Centering — Design Spec

**Date:** 2026-05-17  
**Status:** Approved

## Problem

Three grids on the site use a 3-column (or 5-column) layout at desktop. When the number of items is not a multiple of the column count, the last row has 1 or 2 "orphan" cards left-aligned with visible empty cells to their right.

For `.spec-grid` and `.clients`, the grid uses `gap:1px; background:var(--steel)` as a border trick. Empty cells in the last row expose the full steel-colored background across the remaining column(s) — a visually jarring rectangle that breaks consistency with other full grids.

For `.proj-grid`, orphan cards sit left-aligned with blank space on the right.

## Decision

**Approach: Flexbox with `justify-content: center`**

All three affected grids switch from `display: grid` to `display: flex; flex-wrap: wrap; justify-content: center`. This eliminates the concept of empty grid cells entirely. Orphan cards (1 or 2) are automatically centered at any count, at all breakpoints, with no JavaScript or template changes.

Rejected alternatives:
- **CSS Grid nth-child selectors** — centering 2 orphans in a 3-col grid requires a fragile 6-column internal hack; impractical for dynamic item counts.
- **Astro template last-row wrapper** — works but requires modifying every template and adds unnecessary complexity.

## Scope

Three grids are affected. One grid (`.mvv`, exactly 4 items in 4 cols) is excluded — no orphan risk.

| Grid | File | Desktop cols | Items | Orphan risk |
|------|------|-------------|-------|-------------|
| `.spec-grid` | `src/styles/pages.css:80` | 3 | variable per category | High |
| `.clients` | `src/styles/pages.css:188` | 5 | 14 / 12 | High |
| `.proj-grid` | `src/styles/pages.css:273` | 3 | 32 | High (2 orphans) |

## Design

### Orphan behavior
- **1 or 2 orphan cards:** centered in the last row, same card width as the rest.
- **Empty sides:** show the dark section background (not steel) — clean, intentional.
- No special-casing for number of orphans — flexbox handles it automatically.

### `.spec-grid` and `.clients`

These grids currently use the gap+background border trick (`gap:1px; background:var(--steel)`). Switching to flexbox removes empty cells, but requires replacing the border trick with explicit card borders.

**Container:**
- Remove `background: var(--steel)` and `gap: 1px`
- Add `border: 1px solid var(--steel)` (outer frame)
- Add `display: flex; flex-wrap: wrap; justify-content: center`
- `.clients` retains `border-top: 2px solid var(--neon)`

**Cards (`.spec` and `.client`):**
- Add `border-right: 1px solid var(--steel)` (column dividers)
- Add `border-bottom: 1px solid var(--steel)` (row dividers)
- Explicit flex widths per breakpoint replacing grid-template-columns

`.spec-grid` breakpoints:
- Default (mobile): `flex: 0 0 100%`
- `≥640px`: `flex: 0 0 50%`
- `≥1024px`: `flex: 0 0 calc(100% / 3)`

`.clients` breakpoints:
- Default (mobile): `flex: 0 0 calc(100% / 3)`
- `≥640px`: `flex: 0 0 25%`
- `≥1024px`: `flex: 0 0 20%`

### `.proj-grid`

Cards already have their own `border: 1px solid var(--steel)` — no border migration needed.

**Container:**
- Replace `display: grid` with `display: flex; flex-wrap: wrap; justify-content: center`
- Keep `gap: 16px`

**Cards (`.proj`):**
- Add explicit flex widths per breakpoint replacing grid-template-columns
- `flex: 0 0 100%` (mobile) → `calc(50% - 8px)` (≥768px) → `calc(33.333% - 11px)` (≥1200px)
- All existing hover styles, borders, and animations remain unchanged

## What does NOT change

- All card content, images, hover effects, animations, and transitions
- Responsive breakpoint values (640px / 768px / 1024px / 1200px)
- The `.mvv` grid (4 exact items, no orphan risk)
- Astro templates — zero template changes required
- The neon top border on `.clients`
