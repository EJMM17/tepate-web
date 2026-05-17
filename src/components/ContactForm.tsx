import { useState, type ChangeEvent, type FormEvent } from 'react';

type ProjectType =
  | ''
  | 'calderas'
  | 'maquinas'
  | 'zapatas'
  | 'senalamiento-horizontal'
  | 'senalamiento-vertical'
  | 'pintura-aplicacion'
  | 'remolques'
  | 'otro';

interface FormState {
  name: string;
  phone: string;
  projectType: ProjectType;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  projectType?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const PROJECT_OPTIONS: ReadonlyArray<{ value: ProjectType; label: string }> = [
  { value: '', label: 'Selecciona el tipo de proyecto…' },
  { value: 'calderas', label: 'Calderas Termoplásticas' },
  { value: 'maquinas', label: 'Máquinas Aplicadoras' },
  { value: 'zapatas', label: 'Dados y Zapatas' },
  { value: 'senalamiento-horizontal', label: 'Señalamiento Horizontal' },
  { value: 'senalamiento-vertical', label: 'Señalamiento Vertical' },
  { value: 'pintura-aplicacion', label: 'Aplicación de Pintura (tráfico/epóxica/termoplástica)' },
  { value: 'remolques', label: 'Remolques' },
  { value: 'otro', label: 'Otro / No estoy seguro' },
];

const PHONE_REGEX = /^[\d\s()+-]{10,15}$/;

const INITIAL_STATE: FormState = {
  name: '',
  phone: '',
  projectType: '',
  message: '',
};

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (state.name.trim().length < 2) errors.name = 'Ingresa tu nombre completo.';
  if (!PHONE_REGEX.test(state.phone.trim())) errors.phone = 'Teléfono inválido (10 dígitos).';
  if (!state.projectType) errors.projectType = 'Selecciona un tipo de proyecto.';
  if (state.message.trim().length < 10) errors.message = 'Cuéntanos al menos 10 caracteres.';
  return errors;
}

async function fakeSubmit(payload: FormState): Promise<{ ok: boolean }> {
  // TODO: integrar con endpoint real (Resend / Formspree / Edge Function).
  await new Promise((res) => setTimeout(res, 900));
  if (typeof window !== 'undefined') console.info('[ContactForm] payload', payload);
  return { ok: true };
}

export default function ContactForm(): JSX.Element {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }) as FormState);
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const v = validate(state);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setStatus('submitting');
    try {
      const res = await fakeSubmit(state);
      if (res.ok) {
        setStatus('success');
        setState(INITIAL_STATE);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputBase =
    'w-full bg-[#0A0A0A] border border-gray-800 text-gray-100 placeholder-gray-300/50 rounded-md px-4 py-3 text-base focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#121212] border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
      aria-label="Formulario de cotización TEPATE"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-name" className="text-sm font-bold uppercase tracking-wide text-gray-100">
          Nombre completo *
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          value={state.name}
          onChange={handleChange}
          className={inputBase}
          placeholder="Ej. María González"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
        />
        {errors.name && (
          <span id="cf-name-err" className="text-xs text-red-400">
            {errors.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-phone" className="text-sm font-bold uppercase tracking-wide text-gray-100">
          Teléfono *
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={state.phone}
          onChange={handleChange}
          className={inputBase}
          placeholder="(81) 1234 5678"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'cf-phone-err' : undefined}
        />
        {errors.phone && (
          <span id="cf-phone-err" className="text-xs text-red-400">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="cf-project"
          className="text-sm font-bold uppercase tracking-wide text-gray-100"
        >
          Tipo de proyecto *
        </label>
        <select
          id="cf-project"
          name="projectType"
          value={state.projectType}
          onChange={handleChange}
          className={inputBase}
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? 'cf-project-err' : undefined}
        >
          {PROJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0A0A] text-gray-100">
              {opt.label}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <span id="cf-project-err" className="text-xs text-red-400">
            {errors.projectType}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-message" className="text-sm font-bold uppercase tracking-wide text-gray-100">
          Mensaje *
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={state.message}
          onChange={handleChange}
          className={`${inputBase} resize-y min-h-[120px]`}
          placeholder="Cuéntanos volumen estimado, ubicación de obra y plazos."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
        />
        {errors.message && (
          <span id="cf-message-err" className="text-xs text-red-400">
            {errors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'ENVIANDO…' : 'COTIZAR AHORA'}
        {status !== 'submitting' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {status === 'success' && (
        <p
          role="status"
          className="text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-md p-3"
        >
          ✓ Recibimos tu solicitud. Te contactamos en menos de 24 horas hábiles.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md p-3">
          Ocurrió un error al enviar. Intenta nuevamente o escríbenos por WhatsApp.
        </p>
      )}

      <p className="text-xs text-gray-300 leading-relaxed">
        Al enviar aceptas nuestro{' '}
        <a href="/aviso-privacidad" className="text-yellow-400 underline hover:no-underline">
          Aviso de Privacidad
        </a>
        . No compartimos tus datos.
      </p>
    </form>
  );
}
