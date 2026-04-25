const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. HTML tag
html = html.replace('<html lang="es">', '<html lang="es-MX" dir="ltr">');

// 2. Head replacement
const newHead = `<head>
<!-- [SEC-01] Security Metas (Fallback) -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://wa.me; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- [SEO-02] Title optimizado (< 60 chars) -->
<title>Señalamiento Vial y Termoplástica | TEPATE</title>

<!-- [SEO-03] Meta description (150-155 chars) -->
<meta name="description" content="Fabricantes de calderas termoplásticas, señalamiento horizontal y vertical. Cumplimiento SCT y ASTM. Envíos a todo México. ¡Cotiza tu proyecto hoy!">

<!-- [SEO-04] Canonical absoluta -->
<!-- REEMPLAZAR: Dominio real -->
<link rel="canonical" href="https://www.tepate.com.mx/">

<!-- [SEO-05] Open Graph completo -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="TEPATE">
<meta property="og:title" content="Señalamiento Vial y Termoplástica | TEPATE">
<meta property="og:description" content="Fabricantes de calderas termoplásticas, señalamiento horizontal y vertical. Cumplimiento SCT y ASTM. Envíos a todo México. ¡Cotiza tu proyecto hoy!">
<!-- REEMPLAZAR: Dominio real -->
<meta property="og:url" content="https://www.tepate.com.mx/">
<meta property="og:locale" content="es_MX">
<!-- REEMPLAZAR: URL de imagen OG -->
<meta property="og:image" content="https://www.tepate.com.mx/img/og-image.jpg">
<meta property="og:image:alt" content="Instalación de señalamiento vial por TEPATE">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">

<!-- [SEO-06] Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image:alt" content="Instalación de señalamiento vial por TEPATE">

<!-- [SEO-07] Geo tags -->
<meta name="geo.region" content="MX">
<!-- REEMPLAZAR: Ciudad/Estado real -->
<meta name="geo.placename" content="Apodaca">
<!-- REEMPLAZAR: Coordenadas reales -->
<meta name="geo.position" content="25.7816;-100.1886">
<meta name="ICBM" content="25.7816, -100.1886">

<!-- [SEO-08] Hreflang -->
<!-- REEMPLAZAR: Dominio real -->
<link rel="alternate" hreflang="es-MX" href="https://www.tepate.com.mx/">
<link rel="alternate" hreflang="x-default" href="https://www.tepate.com.mx/">

<!-- [SEO-09] Meta robots granulares -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<!-- [SEO-10] Metas de autoría -->
<meta name="author" content="TEPATE">
<meta name="copyright" content="TEPATE">
<meta name="language" content="es-MX">

<!-- [PERF-01] Preconnects & DNS Prefetch -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://wa.me">

<!-- [PERF-02] Preload LCP Image -->
<!-- REEMPLAZAR: Ruta real de la imagen LCP del Hero si aplica -->
<!-- <link rel="preload" as="image" href="/img/hero-lcp.jpg" fetchpriority="high"> -->

<!-- [PERF-03] Webmanifest -->
<link rel="manifest" href="/site.webmanifest">

<!-- [SEO-11] JSON-LD Schemas -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.tepate.com.mx/#website",
      "url": "https://www.tepate.com.mx/",
      "name": "TEPATE",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.tepate.com.mx/buscar?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "ManufacturingBusiness",
      "@id": "https://www.tepate.com.mx/#organization",
      "name": "Ingeniería Vial TEPATE",
      "url": "https://www.tepate.com.mx/",
      "logo": "https://www.tepate.com.mx/logo.png",
      "image": "https://www.tepate.com.mx/img/og-image.jpg",
      "description": "Fabricación e instalación de calderas termoplásticas, señalamiento horizontal y vertical, dispositivos de protección y equipos solares.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Productos y Servicios Viales",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Calderas Termoplásticas" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Señalamiento Horizontal" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Señalamiento Vertical" } }
        ]
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+52-81-8453-2875",
        "contactType": "customer service",
        "areaServed": "MX",
        "availableLanguage": "es"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Apodaca",
        "addressRegion": "N.L.",
        "addressCountry": "MX"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.7816,
        "longitude": -100.1886
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "foundingDate": "2010",
      "knowsAbout": ["Señalamiento Vial", "Pintura Termoplástica", "Seguridad Vial", "Calderas Termoplásticas"],
      "areaServed": "MX"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://www.tepate.com.mx/"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es la pintura termoplástica horizontal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Es un material de señalización vial de alta durabilidad que se aplica en caliente, ideal para carreteras y vialidades de alto tráfico."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cumplen con las normativas de la SCT?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, todos nuestros señalamientos verticales e informativos cumplen estrictamente con las normas de la Secretaría de Comunicaciones y Transportes (SCT N-CMT-5-001-13) y ASTM."
          }
        }
      ]
    }
  ]
}
</script>

<link rel="icon" type="image/png" href="/img/favicon.png">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/src/index.css">
</head>`;
html = html.replace(/<head>[\s\S]*?<\/head>/, newHead);

// 3. skip-link
html = html.replace('<body>', '<body>\n\n<!-- [A11Y-01] Skip-to-content link -->\n<a href="#main-content" class="skip-link" style="position:absolute; top:-100%; left:0; z-index:9999;">Saltar al contenido principal</a>');

// 4. Nav
html = html.replace('<nav>', '<!-- [A11Y-02] Nav descriptivo -->\n<nav role="navigation" aria-label="Navegación principal">');

// 5. Main wrapper
html = html.replace('<!-- HERO -->', '<!-- [A11Y-04] Main content wrapper -->\n<main id="main-content" role="main">\n\n<!-- HERO -->');
html = html.replace('<!-- FOOTER -->', '</main>\n\n<!-- FOOTER -->');

// 6. Footer
html = html.replace('<footer>', '<!-- [A11Y-10] Footer accesible -->\n<footer role="contentinfo">');

// 7. Sections and headings
html = html.replace('<section class="hero" style="padding:0">', '<section class="hero" style="padding:0" aria-labelledby="hero-heading">');
html = html.replace('<h1 class="hero-h1">', '<h1 id="hero-heading" class="hero-h1">');

html = html.replace('<section class="products" id="productos">', '<section class="products" id="productos" aria-labelledby="productos-heading">');
html = html.replace('<h2 class="sec-h2">NUESTROS<br>PRODUCTOS</h2>', '<h2 id="productos-heading" class="sec-h2">NUESTROS<br>PRODUCTOS</h2>');

html = html.replace('<section class="services" id="servicios">', '<section class="services" id="servicios" aria-labelledby="servicios-heading">');
html = html.replace('<h2 class="sec-h2">SERVICIOS<br>ESPECIALIZADOS</h2>', '<h2 id="servicios-heading" class="sec-h2">SERVICIOS<br>ESPECIALIZADOS</h2>');

html = html.replace('<section class="cta-band" id="cotizar" style="padding:0">', '<section class="cta-band" id="cotizar" style="padding:0" aria-labelledby="cotizar-heading">');
html = html.replace('<h2 class="cta-h2">¿Tienes un proyecto<br>de obra en puerta?</h2>', '<h2 id="cotizar-heading" class="cta-h2">¿Tienes un proyecto<br>de obra en puerta?</h2>');

html = html.replace('<section class="why" id="nosotros">', '<section class="why" id="nosotros" aria-labelledby="nosotros-heading">');
html = html.replace('<h2 class="sec-h2">16 AÑOS<br>SEÑALIZANDO MÉXICO</h2>', '<h2 id="nosotros-heading" class="sec-h2">16 AÑOS<br>SEÑALIZANDO MÉXICO</h2>');

html = html.replace('<section class="gallery" id="proyectos">', '<section class="gallery" id="proyectos" aria-labelledby="proyectos-heading">');
html = html.replace('<h2 class="sec-h2">PROYECTOS<br>REALIZADOS</h2>', '<h2 id="proyectos-heading" class="sec-h2">PROYECTOS<br>REALIZADOS</h2>');

// 8. Grids and lists
html = html.replace('<div class="hero-grid">', '<div class="hero-grid" role="list">');
html = html.replace(/<a href="productos\.html#[^"]+" class="hprod">/g, match => match.replace('class="hprod"', 'class="hprod" role="listitem"'));

html = html.replace('<div class="prod-grid">', '<div class="prod-grid" role="list">');
html = html.replace(/<a href="productos\.html#[^"]+" class="cat">/g, match => match.replace('class="cat"', 'class="cat" role="listitem"'));

html = html.replace('<div class="svc-grid">', '<div class="svc-grid" role="list">');
html = html.replace(/<div class="svc">/g, '<article class="svc" role="listitem">');
html = html.replace(/<\/div>\s*<div class="svc-n">/g, '</article>\n    <article class="svc" role="listitem">\n      <div class="svc-n">');
html = html.replace(/<a href="servicios\.html#[^"]+" class="svc-link">Ver equipos &rarr;<\/a>\s*<\/div>/g, '<a href="servicios.html#fabricacion" class="svc-link">Ver equipos &rarr;</a>\n    </article>');
html = html.replace(/<a href="servicios\.html#[^"]+" class="svc-link">Ver pinturas &rarr;<\/a>\s*<\/div>/g, '<a href="servicios.html#horizontal" class="svc-link">Ver pinturas &rarr;</a>\n    </article>');
html = html.replace(/<a href="servicios\.html#[^"]+" class="svc-link">Solicitar estudio &rarr;<\/a>\s*<\/div>/g, '<a href="servicios.html#estudios" class="svc-link">Solicitar estudio &rarr;</a>\n    </article>');

html = html.replace('<div class="gallery-grid">', '<div class="gallery-grid" role="list">');
html = html.replace(/<div class="gitem">/g, '<article class="gitem" role="listitem">');
html = html.replace(/<\/div>\s*<\/div>\s*<div class="gitem">/g, '</div>\n    </article>\n    <article class="gitem" role="listitem">');
html = html.replace(/<\/div>\s*<\/div>\s*<\/section>/g, '</div>\n    </article>\n  </div>\n</section>');

html = html.replace('<div class="why-panel">', '<aside class="why-panel" aria-labelledby="why-panel-heading">');
html = html.replace('<h3 class="p-title">', '<h3 id="why-panel-heading" class="p-title">');
html = html.replace(/<\/div>\s*<\/div>\s*<\/section>/, '</div>\n    </aside>\n  </div>\n</section>');

// 9. SVGs
html = html.replace(/<svg /g, '<svg aria-hidden="true" focusable="false" ');

// 10. Address in footer
html = html.replace('<div class="fbrand-wrap">', '<address class="fbrand-wrap" style="font-style: normal;">');
html = html.replace('<span class="fnorm">SCT N-CMT-5-001-13</span>\n  </div>', '<span class="fnorm">SCT N-CMT-5-001-13</span>\n  </address>');

// 11. External links
html = html.replace(/<a href="https:\/\/wa\.me\/[^"]+"/g, match => match + ' target="_blank" rel="noopener noreferrer"');

// 12. Images
html = html.replace(/<img /g, match => match + 'decoding="async" ');
html = html.replace(/decoding="async" decoding="async"/g, 'decoding="async"');

// 13. Scripts
// html = html.replace('<script src="/src/main.ts"></script>', '<script type="module" src="/src/main.ts"></script>');

fs.writeFileSync('index.html', html);
console.log('index.html optimized');
