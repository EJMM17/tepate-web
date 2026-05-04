export type ProductCategory =
  | 'calderas'
  | 'maquinas'
  | 'dados'
  | 'confinamiento'
  | 'solar'
  | 'senalamiento';

export interface ProductSpec {
  readonly label: string;
  readonly value: string;
}

export interface Product {
  readonly id: string;
  readonly model: string;
  readonly name: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly category: ProductCategory;
  readonly specs: readonly ProductSpec[];
  readonly description?: string;
  readonly datasheet?: string;
}

export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
  readonly download?: boolean;
  readonly ariaLabel?: string;
}

export type JsonLd = Record<string, unknown>;

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  locale?: string;
  jsonLd?: JsonLd | readonly JsonLd[];
}

export interface ContactFormPayload {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
  consent: boolean;
  _honeypot: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormPayload, string>>;

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; errors: ContactFormErrors; summary: string };

export interface GlobalSiteState {
  menuOpen: boolean;
  modalProductId: string | null;
}
