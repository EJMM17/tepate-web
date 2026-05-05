import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/types';

interface ProductModalProps {
  products: readonly Product[];
}

const FALLBACK_DESC =
  'Producto fabricado por Ingeniería Vial Tepate. Solicita ficha técnica y cotización personalizada.';

export default function ProductModal({ products }: ProductModalProps): JSX.Element {
  const [selected, setSelected] = useState<Product | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const open = selected !== null;

  useEffect(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const triggers = document.querySelectorAll<HTMLElement>('[data-product-id]');
    const handlers: Array<[HTMLElement, () => void]> = [];

    triggers.forEach((trigger) => {
      const handler = (): void => {
        const product = productMap.get(trigger.dataset.productId ?? '');
        if (product) {
          prevFocusRef.current = trigger;
          setSelected(product);
        }
      };
      trigger.addEventListener('click', handler);
      handlers.push([trigger, handler]);
    });

    return () => {
      handlers.forEach(([el, h]) => el.removeEventListener('click', h));
    };
  }, [products]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      prevFocusRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const close = (): void => setSelected(null);

  const getCotizarUrl = (product: Product): string => {
    const params = new URLSearchParams();
    params.set('producto', product.name);
    params.set('interes', product.category === 'senalamiento' ? 'horizontal' : product.category);
    return `/contacto?${params.toString()}`;
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300 ease-brand ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`relative bg-coal border border-neon w-[92%] md:w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto p-5 md:p-10 transition-transform duration-300 ease-brand ${open ? 'translate-y-0' : 'translate-y-5'}`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 text-mist hover:text-neon text-2xl bg-transparent border-0 cursor-pointer transition-colors duration-200 ease-brand leading-none"
        >
          &times;
        </button>

        {selected && (
          <>
            <img
              src={selected.image}
              alt={selected.imageAlt}
              className="w-full h-auto border border-steel mb-6 bg-asphalt"
            />
            <h3
              id="modal-title"
              className="font-display text-2xl md:text-[32px] font-black uppercase text-white mb-2.5 leading-[1.1] pr-9 md:pr-0"
            >
              {selected.name}
            </h3>
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-neon mb-6">
              {selected.model}
            </div>
            <div id="modal-desc" className="text-bone text-[15px] leading-[1.6] mb-7">
              {selected.description ?? FALLBACK_DESC}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              {selected.specs.map((spec) => (
                <div key={spec.label} className="bg-black p-4 border-l-2 border-neon">
                  <div className="font-mono text-[10px] text-mist uppercase tracking-[1px] mb-1">
                    {spec.label}
                  </div>
                  <div className="font-display text-base text-white">{spec.value}</div>
                </div>
              ))}
            </div>
            {/* CTA de cotización en modal */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-steel">
              <a
                href={getCotizarUrl(selected)}
                className="inline-flex items-center gap-2 bg-neon text-black font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 no-underline hover:bg-neonDim transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Cotizar este producto
              </a>
              <a
                href="https://wa.me/528118959042"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-neon text-neon font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 no-underline hover:bg-neon hover:text-black transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A11.85 11.85 0 0 0 12.06 0C5.42 0 .05 5.37.05 12c0 2.1.56 4.15 1.62 5.97L0 24l6.2-1.62A11.93 11.93 0 0 0 12.06 24C18.7 24 24.07 18.63 24.07 12a11.85 11.85 0 0 0-3.55-8.52z"/>
                </svg>
                Asesoría por WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
