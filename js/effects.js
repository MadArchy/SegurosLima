/* ============================================================
   LIMA SEGUROS — Dynamic Effects Engine v2
   Premium animations & microinteractions
   ============================================================ */

'use strict';

// ============================================================
// 1. SCROLL PROGRESS BAR
// ============================================================
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ============================================================
// 2. SMART NAVBAR — Hide on scroll down, show on scroll up
// ============================================================
function initSmartNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 120) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================
// 3. HERO FLOATING PARTICLES
// ============================================================
function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'hero-particles';
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    container.appendChild(p);
  }
  hero.prepend(container);
}

// ============================================================
// 4. BUTTON RIPPLE EFFECT
// ============================================================
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

// ============================================================
// 5. 3D TILT EFFECT on Service Cards
// ============================================================
function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .hero-card, .contact-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// 6. TYPING EFFECT on Hero Headline
// ============================================================
function initTypingEffect() {
  const target = document.querySelector('.hero-text h1 .highlight');
  if (!target) return;

  const fullText = target.textContent.trim();
  target.textContent = '';
  target.style.minWidth = '1ch';

  let i = 0;
  const speed = 55;

  function type() {
    if (i < fullText.length) {
      target.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  // Start after a brief delay (hero is already visible)
  setTimeout(type, 600);
}

// ============================================================
// 7. PARALLAX HERO — subtle depth on scroll
// ============================================================
function initParallax() {
  const hero = document.querySelector('.hero');
  const shapes = document.querySelectorAll('.hero-shape');
  if (!hero || !shapes.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    shapes.forEach((shape, i) => {
      const speed = 0.08 + i * 0.04;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// ============================================================
// 8. STAGGERED CHILDREN REVEAL
//    Any parent with [data-stagger] auto-staggers its children
// ============================================================
function initStagger() {
  const parents = document.querySelectorAll('[data-stagger]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.12}s`;
          child.classList.add('animated');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  parents.forEach(p => {
    Array.from(p.children).forEach(child => {
      if (!child.hasAttribute('data-animate')) {
        child.setAttribute('data-animate', 'fade-up');
      }
    });
    observer.observe(p);
  });
}

// ============================================================
// 9. ACTIVE SECTION HIGHLIGHT in Navbar
//    Highlights nav link based on visible section
// ============================================================
function initSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('section-active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('section-active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
}

// ============================================================
// 10. SMOOTH COUNTER (enhanced version with pop anim)
// ============================================================
function animateCounterV2(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(target * eased);
    el.textContent = current.toLocaleString('es-CO') + suffix;
    el.classList.toggle('counting', progress < 1);
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function initCountersV2() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounterV2(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

// ============================================================
// 11. CURSOR GLOW — subtle ambient light follows mouse
// ============================================================
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ============================================================
// INIT ALL EFFECTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initSmartNavbar();
  initHeroParticles();
  initRipple();
  initCardTilt();
  initTypingEffect();
  initParallax();
  initStagger();
  initSectionHighlight();
  initCountersV2();
  initCursorGlow();
});
