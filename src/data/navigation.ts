import type { NavLink } from '@/types';

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
] as const;

export const CATALOG_PDF: NavLink = {
  label: 'Catálogo PDF',
  href: '/calderas-termoplasticas-tepate.pdf',
  download: true,
  ariaLabel: 'Descargar catálogo PDF',
};

export const TOPBAR_ITEMS: readonly string[] = [
  'Envíos a todo México',
  'Cumplimiento SCT N-CMT-5-001-13',
  'Tel. (81) 8453-2875',
  '16 años de experiencia',
] as const;

export const COMPANY = {
  legalName: 'Ingeniería Vial TEPATE, S.A. de C.V.',
  shortName: 'TEPATE',
  tagline: 'Fomentando la Cultura Vial y sus Valores',
  url: 'https://tepate.com.mx',
  phones: ['+528184532875', '+528118959042'] as const,
  phoneDisplay: '(81) 8453-2875',
  email: 'facturacion_tepate@outlook.com',
  address: {
    streetAddress: 'Apodaca y Guadalupe',
    addressLocality: 'Monterrey',
    addressRegion: 'Nuevo León',
    postalCode: '66000',
    addressCountry: 'MX',
  },
  hours: {
    weekdays: '08:00–18:00',
    saturday: '09:00–14:00',
  },
} as const;
