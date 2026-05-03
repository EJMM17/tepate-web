export const initProductModal = () => {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  const closeButtons = modal.querySelectorAll<HTMLElement>('#modal-close, #modal-close-btn');
  let prevFocus: HTMLElement | null = null;
  const close = () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; prevFocus?.focus(); };
  document.querySelectorAll<HTMLElement>('.product-trigger').forEach((trigger) => trigger.addEventListener('click', () => { prevFocus = trigger; modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; (closeButtons[0] || modal).focus(); }));
  closeButtons.forEach((btn) => btn.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.classList.contains('active') && close());
};
