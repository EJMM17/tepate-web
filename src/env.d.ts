/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
