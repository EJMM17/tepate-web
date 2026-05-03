export const initContactForm = () => {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;
  const summary = document.getElementById('formErrorSummary');
  const required = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    required.forEach((field) => {
      const invalid = !field.value.trim();
      field.classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', String(invalid));
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = invalid ? 'Este campo es obligatorio.' : '';
      if (invalid) { field.setAttribute('aria-describedby', `${field.id}-error`); ok = false; }
    });
    if (!ok && summary) summary.textContent = 'Corrige los campos marcados para enviar el formulario.';
  });
};
