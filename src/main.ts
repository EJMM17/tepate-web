import { initAnalytics } from './scripts/analytics';
import { initContactForm } from './scripts/contact-form';
import { initDesktopDropdowns, initMobileAccordion, initMobileNav } from './scripts/mobile-nav';
import { initProductModal } from './scripts/product-modal';

initAnalytics();
initContactForm();
initMobileNav();
initMobileAccordion();
initDesktopDropdowns();
initProductModal();

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => backToTopBtn.classList.toggle('visible', window.scrollY > 300));
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
