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

/* ── Smooth Scroll (Lenis) ───────────────────────────── */
export function initSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

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

  // Safety fallback: force hide after 3.5s no matter what
  const safetyTimeout = setTimeout(() => {
    forceHidePreloader(preloader);
  }, 3500);

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
      duration: 1.2,
      ease: 'power2.inOut',
    })
      .to('.preloader-logo', {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      })
      .to(
        preloader,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
        },
        '-=0.1'
      );
  } catch {
    // If GSAP fails, force hide immediately
    forceHidePreloader(preloader);
  }
}

/* ── Hero Typography Reveal ──────────────────────────── */
function initHeroReveal() {
  const heroH1 = document.querySelector('.hero-h1');
  const heroSub = document.querySelector('.hero-sub');
  const heroEyebrow = document.querySelector('.eyebrow');
  const heroActions = document.querySelector('.hero-actions');
  const heroVisual = document.querySelector('.hero-visual');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  let hasAnimated = false;

  if (heroEyebrow) {
    hasAnimated = true;
    tl.from(heroEyebrow, {
      y: 30,
      opacity: 0,
      duration: 0.8,
    });
  }

  if (heroH1) {
    hasAnimated = true;
    try {
      const split = new SplitType(heroH1 as HTMLElement, { types: 'lines,words' });
      tl.from(
        split.words || [],
        {
          y: '120%',
          opacity: 0,
          duration: 1.2,
          stagger: 0.03,
          skewY: 4,
        },
        '-=0.4'
      );
    } catch {
      // Fallback if SplitType fails
      tl.from(heroH1, {
        y: 60,
        opacity: 0,
        duration: 1,
      }, '-=0.4');
    }
  }

  if (heroSub) {
    hasAnimated = true;
    tl.from(
      heroSub,
      {
        y: 40,
        opacity: 0,
        duration: 1,
      },
      '-=0.8'
    );
  }

  if (heroActions) {
    hasAnimated = true;
    tl.from(
      heroActions.children,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      },
      '-=0.6'
    );
  }

  if (heroVisual) {
    hasAnimated = true;
    tl.from(
      heroVisual,
      {
        scale: 1.15,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
      },
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

  return hasAnimated;
}

/* ── Scroll Reveals (global) ─────────────────────────── */
export function initScrollReveals() {
  // Generic fade-up reveal for sections
  gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Stagger children reveals
  gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((container) => {
    const children = container.children;
    if (!children.length) return;
    gsap.from(children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Counter animation for stats
  gsap.utils.toArray<HTMLElement>('.trust-n[data-value]').forEach((stat) => {
    const target = parseInt(stat.dataset.value || '0', 10);
    if (!target || isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
      },
      onUpdate: () => {
        stat.textContent = Math.round(obj.val).toString();
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('.hfs-n[data-value]').forEach((stat) => {
    const target = parseInt(stat.dataset.value || '0', 10);
    if (!target || isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5, // after hero animation
      onUpdate: () => {
        stat.textContent = Math.round(obj.val).toString();
      },
    });
  });
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
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

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
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()) / 1000;
        const speed = gsap.utils.clamp(0.5, 3, 1 + velocity * 0.5);
        gsap.to(marquee, {
          timeScale: speed,
          duration: 0.3,
        });
      },
    });
  });
}

/* ── Image Parallax ──────────────────────────────────── */
export function initImageParallax() {
  gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
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
  const canvas = document.createElement('canvas');
  canvas.className = 'grain-overlay';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Use smaller canvas and scale up for performance
  const grainSize = 128;
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = grainSize;
  grainCanvas.height = grainSize;
  const grainCtx = grainCanvas.getContext('2d');
  if (!grainCtx) return;

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
  setInterval(updateGrain, 100); // update grain texture every 100ms

  // Render loop
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat')!;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(render);
  }
  render();
}

/* ── Initialize Everything ───────────────────────────── */
export function initAnimations() {
  initSmoothScroll();
  initPreloader();
  initScrollReveals();
  initMagneticButtons();
  initCustomCursor();
  initScrollMarquee();
  initImageParallax();
  initGrainOverlay();
}
