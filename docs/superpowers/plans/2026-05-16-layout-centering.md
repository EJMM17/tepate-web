# Layout Centering Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centrar simétricamente todos los contenedores interiores con `max-width` en `pages.css` para eliminar el espacio vacío asimétrico del lado izquierdo/derecho en pantallas anchas.

**Architecture:** Solo cambios en CSS — agregar `margin: 0 auto` a selectores específicos con `max-width` definido pero sin centrado explícito. Las secciones full-bleed intencionales (hero, bento grid, trust-band, CTA) no se tocan.

**Tech Stack:** CSS puro, Astro, Tailwind.

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/styles/pages.css` | Agregar `margin: 0 auto` a 8 selectores; agregar `max-width: 1200px` + `margin: 0 auto` a `.proj-grid` |

---

### Task 1: Centrar `.ph-inner` (page header de subpáginas)

**Files:**
- Modify: `src/styles/pages.css` (selector `.ph-inner`, línea ~21)

- [ ] **Step 1: Localizar el selector**

Abrir `src/styles/pages.css`. Buscar `.ph-inner`. Se ve así:

```css
.ph-inner{position:relative;z-index:1;max-width:1200px}
```

- [ ] **Step 2: Agregar `margin: 0 auto`**

Reemplazar por:

```css
.ph-inner{position:relative;z-index:1;max-width:1200px;margin:0 auto}
```

- [ ] **Step 3: Verificar visualmente**

Levantar el dev server si no está corriendo:
```
npm run dev
```
Abrir `/productos`, `/servicios`, `/nosotros`, `/proyectos` en el navegador a ≥1280px de ancho. El título de la página y el breadcrumb deben estar centrados horizontalmente dentro del área con padding, simétricos a ambos lados.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .ph-inner in page header sections"
```

---

### Task 2: Centrar `.pcat-head` (encabezados de categorías de producto)

**Files:**
- Modify: `src/styles/pages.css` (selector `.pcat-head`, línea ~57)

- [ ] **Step 1: Localizar el selector**

Buscar `.pcat-head` en `src/styles/pages.css`. Se ve así:

```css
.pcat-head{
  display:grid;grid-template-columns:1fr;gap:16px;
  margin-bottom:32px;
  max-width:1200px;
}
```

- [ ] **Step 2: Agregar centrado horizontal**

Reemplazar por (usar propiedades separadas para no interferir con el `margin-bottom` que las media queries sobreescriben):

```css
.pcat-head{
  display:grid;grid-template-columns:1fr;gap:16px;
  margin-bottom:32px;
  max-width:1200px;
  margin-left:auto;margin-right:auto;
}
```

- [ ] **Step 3: Verificar visualmente**

En `/productos` a ≥1280px: los encabezados "Calderas Termoplásticas", "Máquinas Aplicadoras", etc. deben estar centrados respecto al viewport.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .pcat-head in product category sections"
```

---

### Task 3: Centrar `.spec-grid` (tabla de especificaciones)

**Files:**
- Modify: `src/styles/pages.css` (selector `.spec-grid`, línea ~79)

- [ ] **Step 1: Localizar el selector**

Buscar `.spec-grid` en `src/styles/pages.css`. Se ve así:

```css
.spec-grid{
  display:grid;grid-template-columns:1fr;gap:1px;
  background:var(--steel);border:1px solid var(--steel);
  max-width:1200px;
}
```

- [ ] **Step 2: Agregar `margin: 0 auto`**

Reemplazar por:

```css
.spec-grid{
  display:grid;grid-template-columns:1fr;gap:1px;
  background:var(--steel);border:1px solid var(--steel);
  max-width:1200px;margin:0 auto;
}
```

- [ ] **Step 3: Verificar visualmente**

En `/productos` a ≥1280px: las tarjetas de especificaciones (calderas, máquinas, etc.) deben estar centradas.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .spec-grid product spec cards"
```

---

### Task 4: Centrar `.duo` (paneles de dos columnas en servicios)

**Files:**
- Modify: `src/styles/pages.css` (selector `.duo`, línea ~144)

- [ ] **Step 1: Localizar el selector**

Buscar `.duo` en `src/styles/pages.css`. Se ve así:

```css
.duo{
  display:grid;grid-template-columns:1fr;gap:24px;
  max-width:1200px;
}
```

- [ ] **Step 2: Agregar `margin: 0 auto`**

Reemplazar por:

```css
.duo{
  display:grid;grid-template-columns:1fr;gap:24px;
  max-width:1200px;margin:0 auto;
}
```

- [ ] **Step 3: Verificar visualmente**

En `/servicios` a ≥1280px: los paneles de dos columnas deben estar centrados.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .duo two-column panels in services page"
```

---

### Task 5: Centrar `.clients` (grid de logos de clientes)

**Files:**
- Modify: `src/styles/pages.css` (selector `.clients`, línea ~186)

- [ ] **Step 1: Localizar el selector**

Buscar `.clients` en `src/styles/pages.css`. Se ve así:

```css
.clients{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1px;background:var(--steel);
  border:1px solid var(--steel);border-top:2px solid var(--neon);
  margin-top:40px;max-width:1200px;
}
```

- [ ] **Step 2: Agregar `margin: 0 auto`**

Reemplazar por:

```css
.clients{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1px;background:var(--steel);
  border:1px solid var(--steel);border-top:2px solid var(--neon);
  margin:40px auto 0;max-width:1200px;
}
```

> Nota: `margin:40px auto 0` preserva el `margin-top:40px` original y añade centrado horizontal.

- [ ] **Step 3: Verificar visualmente**

En `/nosotros` a ≥1280px: el grid de logos de clientes (Mercedes-Benz, OMA, etc.) debe estar centrado.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .clients logo grid in nosotros page"
```

---

### Task 6: Centrar `.mvv` (misión/visión/valores)

**Files:**
- Modify: `src/styles/pages.css` (selector `.mvv`, línea ~239)

- [ ] **Step 1: Localizar el selector**

Buscar `.mvv` en `src/styles/pages.css`. Se ve así:

```css
.mvv{
  display:grid;grid-template-columns:1fr;gap:1px;
  background:var(--steel);border:1px solid var(--steel);
  margin-top:40px;max-width:1200px;
}
```

- [ ] **Step 2: Agregar `margin: 0 auto`**

Reemplazar por:

```css
.mvv{
  display:grid;grid-template-columns:1fr;gap:1px;
  background:var(--steel);border:1px solid var(--steel);
  margin:40px auto 0;max-width:1200px;
}
```

- [ ] **Step 3: Verificar visualmente**

En `/nosotros` a ≥1280px: las tarjetas de Misión, Visión y Valores deben estar centradas.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .mvv mission/vision/values grid"
```

---

### Task 7: Centrar `.proj-grid` (grid de proyectos)

**Files:**
- Modify: `src/styles/pages.css` (selector `.proj-grid`, línea ~271)

- [ ] **Step 1: Localizar el selector**

Buscar `.proj-grid` en `src/styles/pages.css`. Se ve así:

```css
.proj-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 40px;
}
```

- [ ] **Step 2: Agregar `max-width` y centrado**

Reemplazar por:

```css
.proj-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 40px auto 0;
  max-width: 1200px;
}
```

- [ ] **Step 3: Verificar visualmente**

En `/proyectos` a ≥1280px: las tarjetas de proyectos deben estar centradas y no exceder 1200px de ancho.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center and constrain .proj-grid in projects page"
```

---

### Task 8: Centrar `.legal-inner` y `.contact-page-grid`

**Files:**
- Modify: `src/styles/pages.css` (selectores `.legal-inner` y `.contact-page-grid`, líneas ~376 y ~406)

- [ ] **Step 1: Localizar `.legal-inner`**

Buscar `.legal-inner`. Se ve así:

```css
.legal-inner{max-width:820px}
```

Reemplazar por:

```css
.legal-inner{max-width:820px;margin:0 auto}
```

- [ ] **Step 2: Localizar `.contact-page-grid`**

Buscar `.contact-page-grid`. Se ve así:

```css
.contact-page-grid{
  display:grid;grid-template-columns:1fr;gap:48px;
  max-width:1200px;
}
```

Reemplazar por:

```css
.contact-page-grid{
  display:grid;grid-template-columns:1fr;gap:48px;
  max-width:1200px;margin:0 auto;
}
```

- [ ] **Step 3: Verificar visualmente**

- En `/aviso-privacidad` a ≥1280px: el texto legal debe estar centrado (máx 820px) con espacio simétrico.
- En `/contacto` a ≥1280px: el grid de formulario + info debe estar centrado.

- [ ] **Step 4: Commit**

```bash
git add src/styles/pages.css
git commit -m "fix: center .legal-inner and .contact-page-grid"
```

---

### Task 9: Verificación final cross-page

- [ ] **Step 1: Revisar todas las páginas a 1280px, 1440px y 1920px**

Con el dev server corriendo, abrir cada página y confirmar centrado simétrico:
- `/` — homepage (quick-quote, contact ya estaban bien; verificar que no haya regresiones)
- `/productos` — ph-inner, pcat-head, spec-grid
- `/servicios` — ph-inner, pcat-head, duo
- `/proyectos` — ph-inner, proj-grid
- `/nosotros` — ph-inner, clients, mvv
- `/contacto` — ph-inner, contact-page-grid
- `/aviso-privacidad` — legal-inner

- [ ] **Step 2: Confirmar que los elementos full-bleed no cambiaron**

Verificar que `.hero`, `.prod-bento-grid`, `.trust-grid`, `.cta-band` siguen edge-to-edge sin margen lateral.

- [ ] **Step 3: Commit final si todo está bien**

```bash
git add src/styles/pages.css
git commit -m "fix: complete layout centering audit — all inner containers now symmetric"
```
