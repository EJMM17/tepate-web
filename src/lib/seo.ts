import type { JsonLd, SEOMeta } from '@/types';
import { COMPANY } from '@/data/navigation';

const DEFAULT_OG_IMAGE =
  'https://tepate.com.mx/TEPATE_Imagenes_Organizadas/25_Horizontal_Trafico_Agua/slide32_Horizontal_Trafico_Base_Agua_img1.webp';

export function buildSeo(meta: Partial<SEOMeta> & Pick<SEOMeta, 'title' | 'description' | 'canonical'>): SEOMeta {
  return {
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    ogImage: meta.ogImage ?? DEFAULT_OG_IMAGE,
    ogType: meta.ogType ?? 'website',
    locale: meta.locale ?? 'es_MX',
    ...(meta.jsonLd !== undefined ? { jsonLd: meta.jsonLd } : {}),
  };
}

export function buildLocalBusinessJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.legalName,
    url: `${COMPANY.url}/`,
    image: DEFAULT_OG_IMAGE,
    logo: `${COMPANY.url}/logo.webp`,
    description:
      'Fabricación e instalación de calderas termoplásticas, señalamiento horizontal y vertical, dispositivos de protección y equipos solares. Cumplimiento SCT N-CMT-5-001-13 y ASTM. Envíos en todo México.',
    address: {
      '@type': 'PostalAddress',
      ...COMPANY.address,
    },
    telephone: [...COMPANY.phones],
    email: COMPANY.email,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    areaServed: 'México',
    priceRange: '$$',
  };
}

export function buildBreadcrumbJsonLd(
  items: readonly { readonly name: string; readonly url: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
