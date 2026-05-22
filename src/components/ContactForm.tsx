import { useMemo, useState } from 'react';

type LeadForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  volume: string;
  timeline: string;
  message: string;
  website: string;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'not-configured';

type FieldProps = {
  id: keyof LeadForm;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string | undefined;
};

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT?.trim() ?? '';
const WHATSAPP_NUMBER = '528118959042';
const SALES_EMAIL = 'ventas_tepate@outlook.com';

const projectOptions = [
  { value: '', label: 'Selecciona una necesidad' },
  { value: 'calderas', label: 'Calderas termoplasticas' },
  { value: 'maquinas', label: 'Maquinas aplicadoras' },
  { value: 'horizontal', label: 'Senalamiento horizontal' },
  { value: 'vertical', label: 'Senalamiento vertical' },
  { value: 'estudios', label: 'Estudios de ingenieria vial' },
  { value: 'confinamiento', label: 'Confinamiento vial' },
  { value: 'solar', label: 'Equipos solares' },
  { value: 'otro', label: 'Otro requerimiento' },
];

const interestMap: Record<string, string> = {
  caldera: 'calderas',
  calderas: 'calderas',
  maquinas: 'maquinas',
  maquina: 'maquinas',
  horizontal: 'horizontal',
  pintura: 'horizontal',
  vertical: 'vertical',
  sid: 'vertical',
  estudios: 'estudios',
  estudio: 'estudios',
  confinamiento: 'confinamiento',
  solar: 'solar',
  fabricacion: 'calderas',
};

function getQueryPrefill(): LeadForm {
  if (typeof window === 'undefined') {
    return getEmptyForm();
  }

  const params = new URLSearchParams(window.location.search);
  const product = params.get('producto')?.trim() ?? '';
  const service = params.get('servicio')?.trim() ?? '';
  const interest = params.get('interes')?.trim().toLowerCase() ?? '';
  const explicitMessage = params.get('mensaje')?.trim() ?? '';
  const intentText = product || service;
  const mappedProjectType = interestMap[interest] ?? '';

  const messageParts = [
    explicitMessage,
    product ? `Producto de interes: ${product}` : '',
    service ? `Servicio de interes: ${service}` : '',
  ].filter(Boolean);

  return {
    name: params.get('nombre')?.trim() ?? '',
    company: params.get('empresa')?.trim() ?? '',
    email: params.get('email')?.trim() ?? '',
    phone: params.get('telefono')?.trim() ?? '',
    projectType: mappedProjectType,
    location: params.get('ubicacion')?.trim() ?? '',
    volume: params.get('volumen')?.trim() ?? '',
    timeline: params.get('fecha')?.trim() ?? '',
    message: messageParts.join('\n') || (intentText ? `Hola, quiero cotizar ${intentText}.` : ''),
    website: '',
  };
}

function getEmptyForm(): LeadForm {
  return {
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    volume: '',
    timeline: '',
    message: '',
    website: '',
  };
}

function buildLeadSummary(form: LeadForm) {
  const projectLabel =
    projectOptions.find((option) => option.value === form.projectType)?.label ?? form.projectType;

  return [
    `Nombre: ${form.name}`,
    `Empresa: ${form.company}`,
    `Email: ${form.email}`,
    `Telefono: ${form.phone || 'No indicado'}`,
    `Interes: ${projectLabel || 'No indicado'}`,
    `Ubicacion: ${form.location}`,
    `Volumen: ${form.volume || 'No indicado'}`,
    `Fecha objetivo: ${form.timeline || 'No indicada'}`,
    '',
    'Mensaje:',
    form.message,
  ].join('\n');
}

function validate(form: LeadForm) {
  const errors: Partial<Record<keyof LeadForm, string>> = {};

  if (!form.name.trim()) errors.name = 'Indica tu nombre.';
  if (!form.company.trim()) errors.company = 'Indica la empresa o dependencia.';
  if (!form.email.trim()) {
    errors.email = 'Indica un correo de contacto.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Usa un correo valido.';
  }
  if (!form.projectType) errors.projectType = 'Selecciona el tipo de proyecto.';
  if (!form.location.trim()) errors.location = 'Indica ciudad y estado.';
  if (!form.message.trim()) errors.message = 'Describe brevemente tu requerimiento.';

  return errors;
}

function Field({
  id,
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
  error,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="flabel" htmlFor={id}>
        {label}
        {required && <span className="req-star" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={`finput${error ? ' invalid' : ''}`}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {error && (
        <p id={errorId} className="form-error show" style={{ marginTop: '8px', marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<LeadForm>(() => getQueryPrefill());
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const leadSummary = useMemo(() => buildLeadSummary(form), [form]);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, solicito una cotizacion TEPATE.\n\n${leadSummary}`,
  )}`;
  const mailHref = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(
    'Solicitud de cotizacion TEPATE',
  )}&body=${encodeURIComponent(leadSummary)}`;

  const setField = (field: keyof LeadForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitState !== 'idle') setSubmitState('idle');
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitState('error');
      return;
    }

    if (form.website) return;

    if (!FORMSPREE_ENDPOINT) {
      setSubmitState('not-configured');
      return;
    }

    setSubmitState('submitting');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          projectLabel:
            projectOptions.find((option) => option.value === form.projectType)?.label ??
            form.projectType,
          source: typeof window !== 'undefined' ? window.location.href : 'tepate.com.mx/contacto',
        }),
      });

      if (!response.ok) throw new Error('Form submission failed');

      setSubmitState('success');
      setForm(getEmptyForm());
    } catch {
      setSubmitState('not-configured');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitState === 'success' && (
        <div className="form-success show" role="status">
          Gracias. Recibimos tu solicitud y el equipo de TEPATE te contactara a la brevedad.
        </div>
      )}

      {submitState === 'error' && (
        <div className="form-error show" role="alert">
          Revisa los campos marcados para poder enviar tu solicitud.
        </div>
      )}

      {submitState === 'not-configured' && (
        <div className="form-error show" role="alert">
          El endpoint de formulario aun no esta configurado. Para no perder tu solicitud,
          contactanos directo por{' '}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          o{' '}
          <a href={mailHref}>
            correo
          </a>
          .
        </div>
      )}

      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(event) => setField('website', event.currentTarget.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px' }}
      />

      <div className="form-row">
        <Field
          id="name"
          label="Nombre"
          value={form.name}
          required
          error={errors.name}
          onChange={(value) => setField('name', value)}
        />
        <Field
          id="company"
          label="Empresa / dependencia"
          value={form.company}
          required
          error={errors.company}
          onChange={(value) => setField('company', value)}
        />
      </div>

      <div className="form-row">
        <Field
          id="email"
          label="Correo"
          value={form.email}
          type="email"
          required
          error={errors.email}
          onChange={(value) => setField('email', value)}
        />
        <Field
          id="phone"
          label="Telefono"
          value={form.phone}
          type="tel"
          onChange={(value) => setField('phone', value)}
        />
      </div>

      <div className="form-row">
        <div>
          <label className="flabel" htmlFor="projectType">
            Tipo de proyecto<span className="req-star" aria-hidden="true">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            className={`finput${errors.projectType ? ' invalid' : ''}`}
            value={form.projectType}
            required
            aria-invalid={errors.projectType ? 'true' : 'false'}
            aria-describedby={errors.projectType ? 'projectType-error' : undefined}
            onChange={(event) => setField('projectType', event.currentTarget.value)}
          >
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p id="projectType-error" className="form-error show" style={{ marginTop: '8px', marginBottom: 0 }}>
              {errors.projectType}
            </p>
          )}
        </div>
        <Field
          id="location"
          label="Ubicacion"
          value={form.location}
          placeholder="Ciudad, estado"
          required
          error={errors.location}
          onChange={(value) => setField('location', value)}
        />
      </div>

      <div className="form-row">
        <Field
          id="volume"
          label="Volumen aproximado"
          value={form.volume}
          placeholder="Piezas, m2, km o alcance"
          onChange={(value) => setField('volume', value)}
        />
        <Field
          id="timeline"
          label="Fecha objetivo / urgencia"
          value={form.timeline}
          placeholder="Ej. esta semana, licitacion, Q3"
          onChange={(value) => setField('timeline', value)}
        />
      </div>

      <div>
        <label className="flabel" htmlFor="message">
          Detalles del proyecto<span className="req-star" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          className={`finput${errors.message ? ' invalid' : ''}`}
          value={form.message}
          required
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          placeholder="Cuentanos que necesitas cotizar, donde se ejecuta y cualquier especificacion tecnica."
          onChange={(event) => setField('message', event.currentTarget.value)}
        />
        {errors.message && (
          <p id="message-error" className="form-error show" style={{ marginTop: '8px', marginBottom: 0 }}>
            {errors.message}
          </p>
        )}
      </div>

      <button
        className="btn-primary"
        type="submit"
        disabled={submitState === 'submitting'}
        style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
      >
        {submitState === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
      </button>

      <p style={{ color: 'var(--mist)', fontSize: '12px', lineHeight: 1.6, marginTop: '12px' }}>
        Al enviar tus datos aceptas ser contactado por TEPATE para dar seguimiento a tu
        cotizacion. Consulta nuestro <a href="/aviso-privacidad">aviso de privacidad</a>.
      </p>
    </form>
  );
}
