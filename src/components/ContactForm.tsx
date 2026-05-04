import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ContactFormErrors, ContactFormPayload, ContactFormState } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const EMPTY_PAYLOAD: ContactFormPayload = {
  nombre: '', empresa: '', email: '', telefono: '', mensaje: '', consent: false, _honeypot: '',
};

interface ContactFormProps {
  endpoint?: string;
  successMessage?: string;
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

export default function ContactForm({ endpoint, successMessage = '¡Gracias! Hemos recibido tu solicitud.' }: ContactFormProps): JSX.Element {
  const [payload, setPayload] = useState<ContactFormPayload>(EMPTY_PAYLOAD);
  const [state, setState] = useState<ContactFormState>({ status: 'idle' });
  const errors = state.status === 'error' ? state.errors : {};

  const update = <K extends keyof ContactFormPayload>(key: K) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const value = (key === 'consent' ? (e.target as HTMLInputElement).checked : e.target.value) as ContactFormPayload[K];
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (payload._honeypot) { setState({ status: 'success' }); setPayload(EMPTY_PAYLOAD); return; }
    const found = validate(payload);
    if (Object.keys(found).length > 0) {
      setState({ status: 'error', errors: found, summary: 'Corrige los campos marcados para enviar el formulario.' });
      return;
    }
    setState({ status: 'submitting' });
    const target = endpoint ?? import.meta.env.PUBLIC_CONTACT_ENDPOINT;
    if (typeof target !== 'string' || target.length === 0) {
      window.location.href = `mailto:facturacion_tepate@outlook.com?subject=Solicitud%20web&body=${encodeURIComponent(payload.mensaje)}`;
      setState({ status: 'success' }); setPayload(EMPTY_PAYLOAD); return;
    }
    try {
      const res = await fetch(target, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: 'success' }); setPayload(EMPTY_PAYLOAD);
    } catch {
      setState({ status: 'error', errors: {}, summary: 'No pudimos enviar tu mensaje. Intenta de nuevo o llámanos.' });
    }
  };

  if (state.status === 'success') {
    return <div role="status" aria-live="polite" className="bg-char border-2 border-neon text-neon p-6 font-mono text-sm uppercase tracking-widest">{successMessage}</div>;
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5" aria-describedby="form-summary">
      <div className="sm:col-span-2 sr-only" aria-hidden="true"><label>Deja en blanco<input type="text" tabIndex={-1} autoComplete="off" value={payload._honeypot} onChange={update('_honeypot')} /></label></div>
      <div><label className={labelClass} htmlFor="cf-nombre">Nombre *</label><input id="cf-nombre" name="nombre" type="text" autoComplete="name" className={fieldClass} value={payload.nombre} onChange={update('nombre')} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'cf-nombre-err' : undefined} required /><p id="cf-nombre-err" className="text-neon text-xs mt-1 font-mono">{errors.nombre}</p></div>
      <div><label className={labelClass} htmlFor="cf-empresa">Empresa *</label><input id="cf-empresa" name="empresa" type="text" autoComplete="organization" className={fieldClass} value={payload.empresa} onChange={update('empresa')} aria-invalid={!!errors.empresa} aria-describedby={errors.empresa ? 'cf-empresa-err' : undefined} required /><p id="cf-empresa-err" className="text-neon text-xs mt-1 font-mono">{errors.empresa}</p></div>
      <div><label className={labelClass} htmlFor="cf-email">Correo *</label><input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" className={fieldClass} value={payload.email} onChange={update('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} required /><p id="cf-email-err" className="text-neon text-xs mt-1 font-mono">{errors.email}</p></div>
      <div><label className={labelClass} htmlFor="cf-telefono">Teléfono *</label><input id="cf-telefono" name="telefono" type="tel" autoComplete="tel-national" inputMode="tel" className={fieldClass} value={payload.telefono} onChange={update('telefono')} aria-invalid={!!errors.telefono} aria-describedby={errors.telefono ? 'cf-telefono-err' : undefined} required /><p id="cf-telefono-err" className="text-neon text-xs mt-1 font-mono">{errors.telefono}</p></div>
      <div className="sm:col-span-2"><label className={labelClass} htmlFor="cf-mensaje">Mensaje *</label><textarea id="cf-mensaje" name="mensaje" rows={5} className={fieldClass} value={payload.mensaje} onChange={update('mensaje')} aria-invalid={!!errors.mensaje} aria-describedby={errors.mensaje ? 'cf-mensaje-err' : undefined} required /><p id="cf-mensaje-err" className="text-neon text-xs mt-1 font-mono">{errors.mensaje}</p></div>
      <label className="sm:col-span-2 flex items-start gap-3 text-bone text-sm"><input type="checkbox" checked={payload.consent} onChange={update('consent')} aria-invalid={!!errors.consent} className="mt-1 w-4 h-4 accent-neon" required /><span>Acepto el <a href="/aviso-privacidad" className="text-neon underline">aviso de privacidad</a>.</span></label>
      {state.status === 'error' && state.summary && (<div id="form-summary" role="alert" aria-live="polite" className="sm:col-span-2 bg-char border-2 border-neon text-neon p-4 font-mono text-xs uppercase tracking-widest">{state.summary}</div>)}
      <button type="submit" disabled={state.status === 'submitting'} className="sm:col-span-2 bg-neon text-black font-bold uppercase tracking-widest font-mono text-sm py-4 hover:bg-neonDim disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-brand rounded-btn">{state.status === 'submitting' ? 'Enviando…' : 'Enviar solicitud →'}</button>
    </form>
  );
}
