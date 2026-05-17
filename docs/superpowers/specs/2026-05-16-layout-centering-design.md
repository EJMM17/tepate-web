# Layout Centering Fix — Spec

**Fecha:** 2026-05-16
**Estado:** Aprobado

## Problema

En pantallas anchas (≥1280px), los contenedores interiores con `max-width` fijo no tienen `margin: 0 auto`, lo que hace que el contenido quede pegado a la izquierda del área con padding. El resultado es espacio vacío asimétrico: más espacio en la derecha que en la izquierda.

## Solución (Opción A — Targeted)

Agregar `margin: 0 auto` únicamente a los contenedores interiores que tienen `max-width` definido pero sin centrado. Solo cambios en CSS, sin tocar HTML ni romper secciones full-bleed.

## Archivos a modificar

### `src/styles/pages.css`

| Selector | Acción |
|---|---|
| `.ph-inner` | `margin: 0 auto` |
| `.pcat-head` | `margin: 0 auto` |
| `.spec-grid` | `margin: 0 auto` |
| `.duo` | `margin: 0 auto` |
| `.clients` | `margin: 0 auto` |
| `.legal-inner` | `margin: 0 auto` |
| `.contact-page-grid` | `margin: 0 auto` |
| `.mvv` | `margin: 0 auto` |

### `src/styles/pages.css` — `.proj-grid`

| Selector | Acción |
|---|---|
| `.proj-grid` | `max-width: 1200px` + `margin: 0 auto` |

## Elementos intocables (full-bleed intencionales)

- `.hero` — layout cinematográfico full-viewport
- `.prod-bento-grid` — grid edge-to-edge
- `.trust-grid` — banda de estadísticas full-width
- `.cta-band` / `.cta-inner` — ya tiene `max-width: 1400px; margin: 0 auto`
- `.quick-quote-inner` — ya tiene `max-width: 1200px; margin: 0 auto`
- `.contact-inner` — ya tiene `max-width: 1200px; margin: 0 auto`

## Resultado esperado

Contenido centrado simétricamente en todas las páginas a cualquier ancho de viewport, sin alterar la estética industrial ni los bloques full-bleed.
