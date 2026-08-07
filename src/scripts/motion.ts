/* ═══════════════════════════════════════════════════════════
   TEPATE — Universal Motion Layer
   Zero dependencies. Runs on every device, touch included.

   The GSAP layer (animations.ts) stays desktop-only and owns
   smooth scroll, preloader, hero split reveal, parallax, cursor
   and grain. This module owns what every visitor should get:
   scroll reveals, counters, header state, scroll progress and
   pointer lighting.
   ═══════════════════════════════════════════════════════════ */

const root = document.documentElement;

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Elements that reveal on their own. */
const REVEAL_SELECTOR = [
  '[data-reveal]',
  '.reveal-up',
  '.sec-tag',
  '.pcat-num',
  '.road-divider',
  '.pedestal',
].join(',');

/* Containers whose direct children reveal in sequence. */
const STAGGER_SELECTOR = [
  '.reveal-stagger',
  '.prod-bento-grid',
  '.quick-quote-grid',
  '.trust-grid',
  '.spec-grid',
  '.mvv',
  '.clients',
  '.duo',
  '.cinfo',
].join(',');

/* Cards whose ::after is free for the pointer light.
   .client and .proj-img are excluded — their ::after is taken. */
const LIT_SELECTOR = '.pbc, .spec, .mvv-card, .duo-panel, .qq-step, .trust-item';

/* Longest possible reveal: max stagger index × step + duration. */
const PLAYBACK_MS = 1800;

/* ── Reveal on scroll ────────────────────────────────── */
function initReveals() {
  const staggerContainers = new Set(
    document.querySelectorAll<HTMLElement>(STAGGER_SELECTOR)
  );

  const singles = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
    if (!staggerContainers.has(el)) singles.add(el);
  });

  // Index the children so CSS can offset each one's transition-delay.
  staggerContainers.forEach((container) => {
    container.classList.add('mo-stagger');
    Array.from(container.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--mo-i', String(Math.min(i, 12)));
    });
  });

  const targets = [...singles, ...staggerContainers];
  if (!targets.length) return;

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    targets.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
  );

  targets.forEach((el) => {
    if (isUnobservable(el)) {
      // Clipped or collapsed by other UI, so it can never intersect and
      // would stay hidden forever. Show it now and leave it alone — the
      // accordion's own open transition already carries the motion.
      reveal(el, 0);
      return;
    }
    observer.observe(el);
  });
}

/* An element the IntersectionObserver can never report: collapsed to
   zero area itself, or clipped away by a collapsed accordion panel. */
function isUnobservable(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return true;

  const panel = el.closest('.accordion-content');
  return panel !== null && panel.getBoundingClientRect().height === 0;
}

/* Reveal an element, then strip the motion hooks so the finished
   element carries no leftover transform or transition-delay and its
   own hover states behave exactly as authored. */
function reveal(el: HTMLElement, cleanupDelay = PLAYBACK_MS) {
  el.classList.add('is-in');

  const strip = () => {
    el.classList.remove('reveal-up', 'mo-stagger');
    el.removeAttribute('data-reveal');
    Array.from(el.children).forEach((child) => {
      (child as HTMLElement).style.removeProperty('--mo-i');
    });
  };

  if (cleanupDelay <= 0) strip();
  else window.setTimeout(strip, cleanupDelay);
}

/* ── Stat counters ───────────────────────────────────── */
function initCounters() {
  const stats = document.querySelectorAll<HTMLElement>('.trust-n[data-value]');
  if (!stats.length) return;

  // Without an observer the markup already holds the final values.
  if (prefersReduced() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        countUp(el, Number.parseInt(el.dataset.value || '0', 10));
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((el) => observer.observe(el));
}

function countUp(el: HTMLElement, target: number) {
  if (!target || Number.isNaN(target)) return;

  const duration = 1600;
  const start = performance.now();
  el.classList.add('is-counting');

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutExpo — fast lift, soft landing
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = Math.round(target * eased).toString();

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toString();
      el.classList.remove('is-counting');
    }
  };

  requestAnimationFrame(tick);
}

/* ── Header state + scroll progress ──────────────────── */
function initScrollChrome() {
  const header = document.querySelector<HTMLElement>('header[role="banner"]');
  const progress = document.querySelector<HTMLElement>('.scroll-progress');
  if (!header && !progress) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;

    header?.classList.toggle('is-scrolled', y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.setProperty('--mo-progress', ratio.toFixed(4));
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* ── Pointer lighting on cards ───────────────────────── */
function initPointerLight() {
  if (prefersReduced() || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll<HTMLElement>(LIT_SELECTOR).forEach((card) => {
    card.classList.add('mo-lit');
    card.addEventListener(
      'pointermove',
      (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });
}

/* ── Boot ────────────────────────────────────────────── */
export function initMotion() {
  initReveals();
  initCounters();
  initScrollChrome();
  initPointerLight();

  // Tells the FOUC guard in <head> that the layer came up.
  root.classList.add('motion-ready');
}
