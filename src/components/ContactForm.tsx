import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { ContactFormErrors, ContactFormPayload, ContactFormState } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const PRODUCT_OPTIONS = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'calderas', label: 'Calderas de Precalentado' },
  { value: 'maquinas', label: 'Máquinas Aplicadoras' },
  { value: 'dados', label: 'Dados y Zapatas' },
  { value: 'horizontal', label: 'Señalamiento Horizontal' },
  { value: 'vertical', label: 'Señalamiento Vertical' },
  { value: 'confinamiento', label: 'Dispositivos de Confinamiento' },
  { value: 'solar', label: 'Equipos con Panel Solar' },
  { value: 'fabricacion', label: 'Servicio: Fabricación Termoplástica' },
  { value: 'estudios', label: 'Servicio: Estudios de Ingeniería Vial' },
  { value: 'confinamiento-svc', label: 'Servicio: Confinamiento Vial' },
  { value: 'otro', label: 'Otro / No estoy seguro' },
];

const CLIENT_TYPE_OPTIONS = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'estatal', label: 'Gobierno Estatal' },
  { value: 'municipal', label: 'Gobierno Municipal' },
  { value: 'privada', label: 'Empresa Privada' },
  { value: 'constructora', label: 'Constructora' },
  { value: 'licitacion', label: 'Licitación en curso' },
  { value: 'otro', label: 'Otro' },
];

function getInitialPayload(): ContactFormPayload {
  return {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    interes: '',
    tipoCliente: '',
    volumen: '',
    ubicacion: '',
    fecha: '',
    mensaje: '',
    consent: false,
    _honeypot: '',
  };
}

interface ContactFormProps {
  endpoint?: string;
  successMessage?: string;
  prefillInterest?: string;
  prefillMessage?: string;
}

const fieldClass = 'w-full bg-char border-2 border-steel text-bone placeholder-mist px-3 py-3 font-sans text-sm focus:border-neon focus:outline-none transition-colors duration-200 ease-brand aria-[invalid=true]:border-neon';
const labelClass = 'block font-mono text-[11px] uppercase tracking-widest text-mist mb-2';

function validate(payload: ContactFormPayload): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!payload.nombre.trim()) errors.nombre = 'Este campo es obligatorio.';
  if (!payload.empresa.trim()) errors.empresa = 'Este campo es obligatorio.';
  if (!payload.email.trim()) errors.email = 'Este campo es obligatorio.';
  else if (!EMAIL_REGEX.test(payload.email)) errors.email = 'Correo electrónico inválido.';
  if (!payload.telefono.trim()) errors.telefono = 'Este campo es obligatorio.';
  else if (!PHONE_REGEX.test(payload.telefono.replace(/\D/g, ''))) errors.telefono = 'Ingresa 10 dígitos.';
  if (!payload.mensaje.trim()) errors.mensaje = 'Este campo es obligatorio.';
  else if (payload.mensaje.trim().length < 20) errors.mensaje = 'Mínimo 20 caracteres.';
  if (!payload.consent) errors.consent = 'Debes aceptar el aviso de privacidad.';
  return errors;
}

export default function ContactForm({
  endpoint,
  successMessage = '¡Gracias! Hemos recibido tu solicitud. Un ingeniero te contactará en menos de 24 horas hábiles.',
  prefillInterest,
  prefillMessage,
}: ContactFormProps): JSX.Element {
  const [payload, setPayload] = useState<ContactFormPayload>(getInitialPayload());
  const [state, setState] = useState<ContactFormState>({ status: 'idle' });
  const errors = state.status === 'error' ? state.errors : {};

  // Leer URL params y prefill props al montar
  useEffect(() => {
    const url = new URL(window.location.href);
    const urlInterest = url.searchParams.get('interes') ?? '';
    const urlProduct = url.searchParams.get('producto') ?? '';
    const urlService = url.searchParams.get('servicio') ?? '';
    const urlMessage = url.searchParams.get('mensaje') ?? '';

    let interest = prefillInterest || urlInterest || '';
    let message = prefillMessage || urlMessage || '';

    // Si viene un producto específico, construir mensaje
    if (urlProduct && !message) {
      message = `Solicito cotización para el producto: ${urlProduct}. `;
    }
    if (urlService && !message) {
      message = `Solicito cotización para el servicio: ${urlService}. `;
    }

    setPayload((prev) => ({
      ...prev,
      interes: interest || prev.interes,
      mensaje: message || prev.mensaje,
    }));
  }, [prefillInterest, prefillMessage]);

  const update =
    <K extends keyof ContactFormPayload>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
      const value =
        (key === 'consent' ? (e.target as HTMLInputElement).checked : e.target.value) as ContactFormPayload[K];
      setPayload((prev) => ({ ...prev, [key]: value }));
    };

  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (payload._honeypot) {
      setState({ status: 'success' });
      setPayload(getInitialPayload());
      return;
    }
    const found = validate(payload);
    if (Object.keys(found).length > 0) {
      setState({ status: 'error', errors: found, summary: 'Corrige los campos marcados para enviar el formulario.' });
      return;
    }
    setState({ status: 'submitting' });
    const target = endpoint ?? import.meta.env.PUBLIC_CONTACT_ENDPOINT;
    if (typeof target !== 'string' || target.length === 0) {
      const body = encodeURIComponent(
        `Nombre: ${payload.nombre}\nEmpresa: ${payload.empresa}\nEmail: ${payload.email}\nTeléfono: ${payload.telefono}\nInterés: ${payload.interes}\nTipo de cliente: ${payload.tipoCliente}\nVolumen estimado: ${payload.volumen}\nUbicación: ${payload.ubicacion}\nFecha estimada: ${payload.fecha}\n\n${payload.mensaje}`
      );
      window.location.href = `mailto:ventas_tepate@outlook.com?subject=Solicitud%20de%20cotización%20web&body=${body}`;
      setState({ status: 'success' });
      setPayload(getInitialPayload());
      return;
    }
    try {
      const res = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: 'success' });
      setPayload(getInitialPayload());
    } catch {
      setState({ status: 'error', errors: {}, summary: 'No pudimos enviar tu mensaje. Intenta de nuevo o llámanos.' });
    }
  };

  if (state.status === 'success') {
    return (
      <div role="status" aria-live="polite" className="bg-char border-2 border-neon text-neon p-6 font-mono text-sm uppercase tracking-widest">
        {successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5" aria-describedby="form-summary">
      {/* Honeypot */}
      <div className="sm:col-span-2 sr-only" aria-hidden="true">
        <label>
          Deja en blanco
          <input type="text" tabIndex={-1} autoComplete="off" value={payload._honeypot} onChange={update('_honeypot')} />
        </label>
      </div>

      {/* Nombre */}
      <div>
        <label className={labelClass} htmlFor="cf-nombre">Nombre *</label>
        <input
          id="cf-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          className={fieldClass}
          value={payload.nombre}
          onChange={update('nombre')}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? 'cf-nombre-err' : undefined}
          required
        />
        <p id="cf-nombre-err" className="text-neon text-xs mt-1 font-mono">{errors.nombre}</p>
      </div>

      {/* Empresa */}
      <div>
        <label className={labelClass} htmlFor="cf-empresa">Empresa *</label>
        <input
          id="cf-empresa"
          name="empresa"
          type="text"
          autoComplete="organization"
          className={fieldClass}
          value={payload.empresa}
          onChange={update('empresa')}
          aria-invalid={!!errors.empresa}
          aria-describedby={errors.empresa ? 'cf-empresa-err' : undefined}
          required
        />
        <p id="cf-empresa-err" className="text-neon text-xs mt-1 font-mono">{errors.empresa}</p>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} htmlFor="cf-email">Correo *</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className={fieldClass}
          value={payload.email}
          onChange={update('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-err' : undefined}
          required
        />
        <p id="cf-email-err" className="text-neon text-xs mt-1 font-mono">{errors.email}</p>
      </div>

      {/* Teléfono */}
      <div>
        <label className={labelClass} htmlFor="cf-telefono">Teléfono *</label>
        <input
          id="cf-telefono"
          name="telefono"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          className={fieldClass}
          value={payload.telefono}
          onChange={update('telefono')}
          aria-invalid={!!errors.telefono}
          aria-describedby={errors.telefono ? 'cf-telefono-err' : undefined}
          required
        />
        <p id="cf-telefono-err" className="text-neon text-xs mt-1 font-mono">{errors.telefono}</p>
      </div>

      {/* Interés */}
      <div>
        <label className={labelClass} htmlFor="cf-interes">¿Qué te interesa cotizar?</label>
        <select
          id="cf-interes"
          name="interes"
          className={fieldClass}
          style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23E1FF00' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
          value={payload.interes}
          onChange={update('interes')}
        >
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Tipo de cliente */}
      <div>
        <label className={labelClass} htmlFor="cf-tipo">Tipo de cliente</label>
        <select
          id="cf-tipo"
          name="tipoCliente"
          className={fieldClass}
          style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23E1FF00' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
          value={payload.tipoCliente}
          onChange={update('tipoCliente')}
        >
          {CLIENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Ubicación */}
      <div>
        <label className={labelClass} htmlFor="cf-ubicacion">Ubicación del proyecto</label>
        <input
          id="cf-ubicacion"
          name="ubicacion"
          type="text"
          placeholder="Estado / Municipio"
          className={fieldClass}
          value={payload.ubicacion}
          onChange={update('ubicacion')}
        />
      </div>

      {/* Fecha estimada */}
      <div>
        <label className={labelClass} htmlFor="cf-fecha">Fecha estimada de entrega</label>
        <input
          id="cf-fecha"
          name="fecha"
          type="text"
          placeholder="Ej: Q4 2025, Enero 2026, Urgente"
          className={fieldClass}
          value={payload.fecha}
          onChange={update('fecha')}
        />
      </div>

      {/* Volumen */}
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="cf-volumen">Volumen o cantidad estimada</label>
        <input
          id="cf-volumen"
          name="volumen"
          type="text"
          placeholder="Ej: 2 calderas CP-1000, 5 km de carretera, 50 señales, etc."
          className={fieldClass}
          value={payload.volumen}
          onChange={update('volumen')}
        />
      </div>

      {/* Mensaje */}
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="cf-mensaje">Mensaje *</label>
        <textarea
          id="cf-mensaje"
          name="mensaje"
          rows={5}
          className={fieldClass}
          value={payload.mensaje}
          onChange={update('mensaje')}
          aria-invalid={!!errors.mensaje}
          aria-describedby={errors.mensaje ? 'cf-mensaje-err' : undefined}
          required
        />
        <p id="cf-mensaje-err" className="text-neon text-xs mt-1 font-mono">{errors.mensaje}</p>
      </div>

      {/* Consentimiento */}
      <label className="sm:col-span-2 flex items-start gap-3 text-bone text-sm">
        <input
          type="checkbox"
          checked={payload.consent}
          onChange={update('consent')}
          aria-invalid={!!errors.consent}
          className="mt-1 w-4 h-4 accent-neon"
          required
        />
        <span>
          Acepto el <a href="/aviso-privacidad" className="text-neon underline">aviso de privacidad</a>.
        </span>
      </label>
      {errors.consent && <p className="sm:col-span-2 text-neon text-xs font-mono -mt-3">{errors.consent}</p>}

      {/* Error summary */}
      {state.status === 'error' && state.summary && (
        <div
          id="form-summary"
          role="alert"
          aria-live="polite"
          className="sm:col-span-2 bg-char border-2 border-neon text-neon p-4 font-mono text-xs uppercase tracking-widest"
        >
          {state.summary}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state.status === 'submitting'}
        className="sm:col-span-2 bg-neon text-black font-bold uppercase tracking-widest font-mono text-sm py-4 hover:bg-neonDim disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-brand rounded-btn"
      >
        {state.status === 'submitting' ? 'Enviando…' : 'Solicitar cotización →'}
      </button>
    </form>
  );
}
