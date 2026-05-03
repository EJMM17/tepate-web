export const initMobileNav = () => {
  const hamBtn = document.getElementById('ham-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-close-btn');
  if (!hamBtn || !mobileMenu) return;
  const toggleMenu = (open: boolean) => {
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    hamBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : hamBtn)?.focus();
  };
  hamBtn.addEventListener('click', () => toggleMenu(true));
  closeBtn?.addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && mobileMenu.classList.contains('open') && toggleMenu(false));
};
export const initDesktopDropdowns = () => {
  const dropdowns = Array.from(document.querySelectorAll('.nav-has-dropdown'));
  dropdowns.forEach((drop) => {
    const trigger = drop.querySelector<HTMLButtonElement>('.nav-drop-trigger');
    if (!trigger) return;
    const setOpen = (open: boolean) => { drop.classList.toggle('is-open', open); trigger.setAttribute('aria-expanded', String(open)); };
    trigger.addEventListener('click', () => setOpen(!drop.classList.contains('is-open')));
    drop.addEventListener('focusout', () => setTimeout(() => !drop.contains(document.activeElement) && setOpen(false), 0));
    drop.addEventListener('keydown', (e) => e.key === 'Escape' && (setOpen(false), trigger.focus()));
  });
};
