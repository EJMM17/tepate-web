export const initProductModal = () => {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  const closeButtons = modal.querySelectorAll<HTMLElement>('#modal-close, #modal-close-btn');
  const titleEl = modal.querySelector<HTMLElement>('#modal-title');
  const subtitleEl = modal.querySelector<HTMLElement>('#modal-subtitle');
  const descEl = modal.querySelector<HTMLElement>('#modal-desc');
  const imgEl = modal.querySelector<HTMLImageElement>('#modal-image');
  const specsEl = modal.querySelector<HTMLElement>('#modal-specs-container');
  let prevFocus: HTMLElement | null = null;
  const close = () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; prevFocus?.focus(); };
  const fallbackDesc = 'Producto fabricado por Ingeniería Vial Tepate. Solicita ficha técnica y cotización personalizada.';
  document.querySelectorAll<HTMLElement>('.product-trigger').forEach((trigger) => trigger.addEventListener('click', () => {
    prevFocus = trigger;
    const model = trigger.querySelector('.spec-model')?.textContent?.trim() ?? '';
    const name = trigger.querySelector('.spec-name')?.textContent?.trim() ?? '';
    const desc = trigger.dataset.desc ?? fallbackDesc;
    const img = trigger.dataset.img ?? '';
    if (titleEl) titleEl.textContent = name;
    if (subtitleEl) subtitleEl.textContent = model;
    if (descEl) descEl.textContent = desc;
    if (imgEl) {
      if (img) { imgEl.src = img; imgEl.alt = name; imgEl.style.display = ''; }
      else { imgEl.removeAttribute('src'); imgEl.style.display = 'none'; }
    }
    if (specsEl) {
      specsEl.innerHTML = '';
      trigger.querySelectorAll('.spec-list li').forEach((li) => {
        const text = li.textContent?.trim() ?? '';
        const colonIdx = text.indexOf(':');
        const hasLabel = colonIdx > 0;
        const label = hasLabel ? text.slice(0, colonIdx).trim() : 'Característica';
        const val = hasLabel ? text.slice(colonIdx + 1).trim() : text;
        const div = document.createElement('div');
        div.className = 'modal-spec-item';
        const labelDiv = document.createElement('div');
        labelDiv.className = 'modal-spec-label';
        labelDiv.textContent = label;
        const valDiv = document.createElement('div');
        valDiv.className = 'modal-spec-val';
        valDiv.textContent = val;
        div.appendChild(labelDiv);
        div.appendChild(valDiv);
        specsEl.appendChild(div);
      });
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    (closeButtons[0] || modal).focus();
  }));
  closeButtons.forEach((btn) => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.classList.contains('active') && close());
};
