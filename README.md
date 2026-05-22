# Ingeniería Vial TEPATE Web

Sitio corporativo estático para Ingeniería Vial TEPATE, S.A. de C.V. Construido con Astro, Tailwind CSS y TypeScript, con islands React únicamente para formularios/modales interactivos.

## Stack

- Astro 5 static output
- Tailwind CSS 4 via `@tailwindcss/vite`
- TypeScript 5
- React 18 islands: `ContactForm` y `ProductModal`
- Vercel Analytics

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Formulario de cotización

Configura `PUBLIC_FORMSPREE_ENDPOINT` para enviar leads reales desde el formulario. Si la variable no existe, el sitio no muestra éxito falso: ofrece WhatsApp y correo con el resumen de la solicitud precargado.

```bash
PUBLIC_FORMSPREE_ENDPOINT="https://formspree.io/f/xxxxxxx"
```

## Notas de arquitectura

- Las rutas viven en `src/pages/*.astro`.
- El sitio no es SPA; usa navegación normal por documento.
- Los estilos entran por `src/styles/global.css`.
- Los productos viven en `src/data/products.ts`; las colecciones de contenido están vacías a propósito hasta migrar el catálogo a Markdown.
- Los enlaces de catálogo apuntan a anchors reales (`/productos#calderas`, `/productos#horizontal`, etc.) o al formulario cuando el PDF aún no existe.
