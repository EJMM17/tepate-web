import { useEffect, useRef, useState } from 'react';
import type { NavLink } from '@/types';

interface MobileNavProps {
  navItems: readonly NavLink[];
  catalogPdf: NavLink;
}

export default function MobileNav({ navItems, catalogPdf }: MobileNavProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const trigger = document.getElementById('ham-btn');
    if (!(trigger instanceof HTMLButtonElement)) return;
    triggerRef.current = trigger;
    const handleClick = (): void => setOpen((prev) => !prev);
    trigger.addEventListener('click', handleClick);
    return () => trigger.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    } else {
      trigger?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const linkClass =
    'block px-6 py-4 border-b border-rule text-bone hover:text-neon focus-visible:text-neon transition-colors duration-200 ease-brand font-mono text-sm uppercase tracking-widest';

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      data-open={open}
      className="md:hidden fixed inset-0 top-0 right-0 z-50 w-full max-w-sm ml-auto h-screen bg-asphalt border-l border-steel transform transition-transform duration-300 ease-brand data-[open=false]:translate-x-full data-[open=true]:translate-x-0"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cerrar menú"
        className="w-full flex items-center justify-end px-6 py-4 text-neon font-mono text-xs uppercase tracking-widest border-b border-rule hover:text-neonDim"
      >
        CERRAR ×
      </button>
      <nav aria-label="Móvil" className="flex flex-col h-full overflow-y-auto">
        {navItems.map((link) => (
          <a key={link.href} href={link.href} className={linkClass} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a
          href={catalogPdf.href}
          download
          aria-label={catalogPdf.ariaLabel}
          className="flex items-center gap-2 px-6 py-4 border-b border-rule text-neon hover:text-neonDim font-mono text-sm uppercase tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar Catálogo PDF
        </a>
      </nav>
    </div>
  );
}
