/* ============================================
   SEGUROS LIMA — App JavaScript
   ============================================ */

const WHATSAPP_NUMBER = '573132928641';

// ============================================
// WHATSAPP FUNCTIONS
// ============================================
function openWhatsApp(message) {
  const text = message || '¡Hola! Me interesa información sobre sus seguros. ¿Me pueden ayudar?';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function openWhatsAppQuote(tipo) {
  const messages = {
    'auto': '¡Hola! Quiero cotizar un seguro de auto en Cúcuta. ¿Pueden ayudarme?',
    'hogar': '¡Hola! Quiero cotizar un seguro de hogar en Cúcuta. ¿Pueden ayudarme?',
    'vida': '¡Hola! Estoy interesado en un seguro de vida. ¿Pueden darme información?',
    'empresarial': '¡Hola! Necesito información sobre seguros empresariales para mi negocio en Cúcuta.',
    'default': '¡Hola! Quiero cotizar un seguro. ¿Me pueden ayudar?'
  };
  const msg = messages[tipo] || messages['default'];
  openWhatsApp(msg);
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  const nav = document.querySelector('.navbar-nav');

  if (!navbar) return;

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// STATS COUNTER
// ============================================
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('es-CO') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ============================================
// QUICK QUOTE FORM (Hero)
// ============================================
function initQuickQuote() {
  const form = document.getElementById('quick-quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = form.querySelector('#quote-tipo')?.value || '';
    const nombre = form.querySelector('#quote-nombre')?.value?.trim() || '';
    const tel = form.querySelector('#quote-tel')?.value?.trim() || '';

    if (!tipo) {
      showAlert('Por favor selecciona el tipo de seguro que necesitas.', 'error');
      return;
    }
    if (!nombre) {
      showAlert('Por favor ingresa tu nombre para continuar.', 'error');
      return;
    }

    let msg = `¡Hola! Mi nombre es ${nombre}`;
    if (tel) msg += `, mi teléfono es ${tel}`;
    msg += `. Quiero cotizar: ${getTipoLabel(tipo)}.`;

    openWhatsApp(msg);
  });
}

function getTipoLabel(tipo) {
  const labels = {
    'auto': 'Seguro de Auto',
    'hogar': 'Seguro de Hogar',
    'vida': 'Seguro de Vida',
    'empresarial': 'Seguro Empresarial',
    'default': 'un seguro'
  };
  return labels[tipo] || labels['default'];
}

// ============================================
// CONTACT/QUOTE FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.querySelector('[name="nombre"]')?.value?.trim() || '';
    const telefono = form.querySelector('[name="telefono"]')?.value?.trim() || '';
    const email = form.querySelector('[name="email"]')?.value?.trim() || '';
    const tipo = form.querySelector('[name="tipo"]')?.value || '';
    const mensaje = form.querySelector('[name="mensaje"]')?.value?.trim() || '';

    if (!nombre) {
      showAlert('Por favor ingresa tu nombre completo.', 'error');
      return;
    }
    if (!telefono) {
      showAlert('Por favor ingresa tu número de teléfono.', 'error');
      return;
    }
    // Validate Colombian phone number
    const telefonoClean = telefono.replace(/[\s\-().+]/g, '');
    const colPhone = /^(57)?3[0-9]{9}$/;
    if (!colPhone.test(telefonoClean)) {
      showAlert('Ingresa un número colombiano válido. Ej: 3001234567', 'error');
      return;
    }
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('El correo electrónico ingresado no es válido.', 'error');
        return;
      }
    }

    let msg = `¡Hola Seguros Lima! \n\n`;
    msg += `*Nombre:* ${nombre}\n`;
    msg += `*Teléfono:* ${telefono}\n`;
    if (email) msg += `*Email:* ${email}\n`;
    if (tipo) msg += `*Tipo de seguro:* ${getTipoLabel(tipo)}\n`;
    if (mensaje) msg += `\n*Mensaje:* ${mensaje}`;
    msg += '\n\n_Enviado desde su sitio web_';

    openWhatsApp(msg);
  });
}

// ============================================
// ALERT MESSAGES
// ============================================
function showAlert(message, type = 'success') {
  const existing = document.querySelector('.sl-alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = `sl-alert sl-alert-${type}`;
  alert.style.cssText = `
    position: fixed; top: 100px; right: 24px; z-index: 9998;
    padding: 16px 24px; border-radius: 12px;
    background: ${type === 'error' ? '#C41E3A' : '#25D366'};
    color: white; font-size: 0.9rem; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    font-family: 'Inter', sans-serif;
    max-width: 360px;
  `;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3500);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimations();
  initCounters();
  initQuickQuote();
  initContactForm();
  initSmoothScroll();
});

