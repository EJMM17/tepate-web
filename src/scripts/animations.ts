/* ═══════════════════════════════════════════════════════════
   TEPATE — Awwwards-Level Animation Engine
   GSAP + ScrollTrigger + Lenis + SplitType
   ═══════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let cursorRafId: number = 0;
let grainRafId: number = 0;
let grainIntervalId: ReturnType<typeof setInterval> | null = null;
let grainResizeHandler: (() => void) | null = null;

/* ── Smooth Scroll (Lenis) ───────────────────────────── */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

/* ── Preloader ───────────────────────────────────────── */
export function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Safety fallback: force hide after 1s no matter what
  const safetyTimeout = setTimeout(() => {
    forceHidePreloader(preloader);
  }, 1000);

  function forceHidePreloader(el: HTMLElement) {
    clearTimeout(safetyTimeout);
    gsap.set(el, { display: 'none', opacity: 0 });
    el.style.display = 'none';
    document.body.classList.add('loaded');
    initHeroReveal();
  }

  try {
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(safetyTimeout);
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
        initHeroReveal();
      },
    });

    tl.to('.preloader-progress', {
      width: '100%',
      duration: 0.5,
      ease: 'power2.out',
    })
      .to('.preloader-logo-img', {
        opacity: 0,
        y: -12,
        duration: 0.25,
        ease: 'power2.in',
      })
      .to(
        preloader,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.45,
          ease: 'power3.inOut',
        },
        '-=0.05'
      );
  } catch {
    // If GSAP fails, force hide immediately
    forceHidePreloader(preloader);
  }
}

/* ── Hero Typography Reveal ──────────────────────────── */
function initHeroReveal() {
  const heroFabrica = document.querySelector('.hero-fabrica');
  const heroH1 = document.querySelector('.hero-h1');
  const heroSub = document.querySelector('.hero-sub');
  const heroEyebrow = document.querySelector('.eyebrow');
  const heroActions = document.querySelector('.hero-actions');
  const heroVisual = document.querySelector('.hero-visual');
  const heroSocial = document.querySelector('.hero-social');

  // Collect all hero elements for safety fallback
  const allHeroEls = [heroFabrica, heroH1, heroSub, heroEyebrow, heroActions, heroVisual, heroSocial].filter(Boolean) as HTMLElement[];

  // Safety: force all hero elements visible after 2s no matter what
  const heroSafety = setTimeout(() => {
    allHeroEls.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (heroActions) {
      Array.from(heroActions.children).forEach((child) => {
        (child as HTMLElement).style.opacity = '1';
        (child as HTMLElement).style.transform = 'none';
      });
    }
  }, 2000);

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      clearTimeout(heroSafety);
      // Clear GSAP inline styles so CSS takes over cleanly
      allHeroEls.forEach((el) => gsap.set(el, { clearProps: 'all' }));
      if (heroActions) {
        gsap.set(heroActions.children, { clearProps: 'all' });
      }
    },
  });

  if (heroEyebrow) {
    tl.from(heroEyebrow, { y: 16, opacity: 0, duration: 0.5 });
  }

  if (heroFabrica) {
    tl.from(heroFabrica, { y: 20, opacity: 0, duration: 0.5 }, '-=0.2');
  }

  if (heroH1) {
    try {
      const split = new SplitType(heroH1 as HTMLElement, { types: 'lines,words' });
      tl.from(
        split.words || [],
        { y: '40%', opacity: 0, duration: 0.7, stagger: 0.02, skewY: 2 },
        '-=0.25'
      );
    } catch {
      tl.from(heroH1, { y: 30, opacity: 0, duration: 0.6 }, '-=0.25');
    }
  }

  if (heroSub) {
    tl.from(heroSub, { y: 20, opacity: 0, duration: 0.6 }, '-=0.35');
  }

  if (heroActions) {
    tl.from(
      heroActions.children,
      { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 },
      '-=0.3'
    );
  }

  if (heroSocial) {
    tl.from(heroSocial, { y: 10, opacity: 0, duration: 0.4 }, '-=0.2');
  }

  if (heroVisual) {
    tl.from(
      heroVisual,
      { scale: 1.05, opacity: 0, duration: 0.8, ease: 'power2.out' },
      0
    );
  }

  // Parallax on hero visual
  if (heroVisual) {
    const bgImg = heroVisual.querySelector('.hero-bg-img');
    if (bgImg) {
      gsap.to(bgImg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  return true;
}

/* ── Scroll Reveals (global) ─────────────────────────── */
export function initScrollReveals() {
  // Mark document so CSS can hide elements before GSAP animates (prevents FOUC)
  document.documentElement.classList.add('gsap-init');

  // Generic fade-up reveal for sections
  gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Stagger children reveals
  gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((container) => {
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;
    gsap.fromTo(
      children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Counter animation for stats.
  // The HTML contains the final values as a no-JS/mobile fallback; desktop rich motion
  // resets them only when the ScrollTrigger animation is ready to run.
  gsap.utils.toArray<HTMLElement>('.trust-n[data-value]').forEach((stat) => {
    const target = Number.parseInt(stat.dataset.value || '0', 10);
    if (!target || Number.isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          stat.textContent = '0';
        },
      },
      onUpdate: () => {
        stat.textContent = Math.round(obj.val).toString();
      },
      onComplete: () => {
        stat.textContent = target.toString();
      },
    });
  });

  // Note: hero floating stats were removed to avoid duplicate counters.
}

/* ── Magnetic Buttons ────────────────────────────────── */
export function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll<HTMLElement>('.magnetic');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
}

/* ── Custom Cursor ───────────────────────────────────── */
export function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.body.classList.add('rich-motion');

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.05 });
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    gsap.set(cursor, { x: cursorX, y: cursorY });
    cursorRafId = requestAnimationFrame(animateCursor);
  }
  cursorRafId = requestAnimationFrame(animateCursor);

  // Hover states
  const interactives = document.querySelectorAll('a, button, .magnetic, [data-cursor]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

/* ── Marquee Speed on Scroll ─────────────────────────── */
export function initScrollMarquee() {
  const marquees = document.querySelectorAll<HTMLElement>('.prod-ticker-track, .marquee-content');

  marquees.forEach((marquee) => {
    // Use CSS custom property to control animation speed instead of GSAP timeScale
    // (timeScale is only valid on GSAP Tween/Timeline instances, not DOM elements)
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()) / 1000;
        const speed = gsap.utils.clamp(0.5, 3, 1 + velocity * 0.5);
        marquee.style.setProperty('--marquee-speed', `${20 / speed}s`);
      },
    });
  });
}

/* ── Image Parallax ──────────────────────────────────── */
export function initImageParallax() {
  gsap.utils.toArray<HTMLElement>('.parallax-img:not(.hero-bg-img)').forEach((img) => {
    const parent = img.parentElement;
    if (!parent) return;
    gsap.to(img, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: parent,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ── Grain Overlay (optimized) ───────────────────────── */
export function initGrainOverlay() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'grain-overlay';
  document.body.appendChild(canvas);

  const ctxRaw = canvas.getContext('2d');
  if (!ctxRaw) return;
  const ctx: CanvasRenderingContext2D = ctxRaw;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  grainResizeHandler = resize;
  window.addEventListener('resize', grainResizeHandler);

  // Use smaller canvas and scale up for performance
  const grainSize = 128;
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = grainSize;
  grainCanvas.height = grainSize;
  const grainCtxRaw = grainCanvas.getContext('2d');
  if (!grainCtxRaw) return;
  const grainCtx: CanvasRenderingContext2D = grainCtxRaw;

  function updateGrain() {
    const imgData = grainCtx.createImageData(grainSize, grainSize);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 18;
    }
    grainCtx.putImageData(imgData, 0, 0);
  }

  updateGrain();
  grainIntervalId = setInterval(updateGrain, 100);

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat')!;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    grainRafId = requestAnimationFrame(render);
  }
  grainRafId = requestAnimationFrame(render);
}

/* ── Cleanup ─────────────────────────────────────────── */
export function destroyAnimations() {
  document.body.classList.remove('rich-motion');
  document.querySelector('.custom-cursor')?.remove();
  document.querySelector('.custom-cursor-dot')?.remove();
  document.querySelector('.grain-overlay')?.remove();
  if (cursorRafId) cancelAnimationFrame(cursorRafId);
  if (grainRafId) cancelAnimationFrame(grainRafId);
  if (grainIntervalId) clearInterval(grainIntervalId);
  if (grainResizeHandler) window.removeEventListener('resize', grainResizeHandler);
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/* ── Initialize Everything ───────────────────────────── */
export function initAnimations() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.location.pathname.startsWith('/contacto')
  ) {
    document.body.classList.add('loaded');
    document.getElementById('preloader')?.remove();
    return;
  }

  initSmoothScroll();
  initPreloader();
  initScrollReveals();
  initMagneticButtons();
  initCustomCursor();
  initScrollMarquee();
  initImageParallax();
  initGrainOverlay();
  window.addEventListener('pagehide', destroyAnimations, { once: true });
}
