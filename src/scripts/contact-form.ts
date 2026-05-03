export const initContactForm = () => {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;
  const summary = document.getElementById('formErrorSummary');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const required = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]');

  const validate = (): boolean => {
    let ok = true;
    required.forEach((field) => {
      const invalid = !field.value.trim();
      field.classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', String(invalid));
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = invalid ? 'Este campo es obligatorio.' : '';
      if (invalid) { field.setAttribute('aria-describedby', `${field.id}-error`); ok = false; }
    });
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = validate();
    if (!ok) {
      if (summary) summary.textContent = 'Corrige los campos marcados para enviar el formulario.';
      errorEl?.classList.add('show');
      successEl?.classList.remove('show');
      return;
    }
    if (summary) summary.textContent = '';
    errorEl?.classList.remove('show');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) {
        successEl?.classList.add('show');
        form.reset();
        required.forEach((f) => { f.classList.remove('invalid'); f.setAttribute('aria-invalid', 'false'); });
      } else {
        errorEl?.classList.add('show');
      }
    } catch {
      errorEl?.classList.add('show');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar solicitud →'; }
    }
  });
};
