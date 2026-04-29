/**
 * script.js — Ani Portfolio
 * Modules:
 *   1. Theme Toggle
 *   2. Scroll Progress Bar
 *   3. Custom Cursor
 *   4. Navbar Scroll + Active Link
 *   5. Mobile Hamburger
 *   6. Typewriter Effect
 *   7. Floating Sakura Petals (hero)
 *   8. Scroll-Reveal (IntersectionObserver)
 *   9. Contact Form Validation + Mock Submit
 *  10. Smooth Scroll
 */

'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ── 1. THEME TOGGLE ── */
(function initTheme() {
  const html   = document.documentElement;
  const btn    = qs('#theme-toggle');
  const saved  = localStorage.getItem('ani-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ani-theme', next);
  });
})();


/* ── 2. SCROLL PROGRESS BAR ── */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();


/* ── 3. CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = qs('#cursor');
  const trail  = qs('#cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail follows with lerp
  (function animTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  })();

  // Hover effect on interactive elements
  const interactives = 'a, button, .sketch-card, .social-link, .skill-tag';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    });
  });
})();


/* ── 4. NAVBAR SCROLL + ACTIVE LINK ── */
(function initNavbar() {
  const navbar   = qs('#navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    let activeId = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) activeId = s.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  }, { passive: true });
})();


/* ── 5. MOBILE HAMBURGER ── */
(function initMobileNav() {
  const hamburger  = qs('#hamburger');
  const mobileNav  = qs('#mobile-nav');
  const links      = qsa('.mobile-nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));
})();


/* ── 6. TYPEWRITER EFFECT ── */
(function initTypewriter() {
  const phrases = [
    'Anime Sketch Artist from Uttar Pradesh.',
    'Bringing characters to life, one line at a time.',
    'Custom anime commissions — just $10 per sketch.',
    'Where imagination meets ink.'
  ];

  const el = qs('#typewriter-text');
  if (!el) return;

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 45 : 72);
  }
  tick();
})();


/* ── 7. FLOATING SAKURA PETALS ── */
(function initPetals() {
  const hero   = qs('#home');
  if (!hero) return;
  const emojis = ['🌸', '🌺', '✿', '❀', '🌷'];

  function spawnPetal() {
    const p        = document.createElement('span');
    p.classList.add('petal');
    p.setAttribute('aria-hidden', 'true');
    p.textContent  = emojis[Math.floor(Math.random() * emojis.length)];
    const size     = Math.random() * 14 + 10;
    const startX   = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const delay    = Math.random() * 5;
    p.style.cssText = `
      left: ${startX}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    hero.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }

  for (let i = 0; i < 14; i++) spawnPetal();
  setInterval(spawnPetal, 2200);
})();


/* ── 8. SCROLL REVEAL ── */
(function initScrollReveal() {
  const els = qsa('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ── 9. CONTACT FORM ── */
(function initContactForm() {
  const form       = qs('#contact-form');
  const successMsg = qs('#form-success');
  if (!form) return;

  function shake(el) {
    el.style.borderColor = '#f87171';
    el.animate(
      [{ transform:'translateX(-6px)' },{ transform:'translateX(6px)' },
       { transform:'translateX(-4px)' },{ transform:'translateX(4px)' },
       { transform:'translateX(0)' }],
      { duration: 300, iterations: 1 }
    );
    setTimeout(() => el.style.borderColor = '', 2000);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = qs('#name', form);
    const emailEl = qs('#email', form);
    const msgEl = qs('#message', form);

    const invalid = [nameEl, emailEl, msgEl].filter(el => !el.value.trim());
    if (invalid.length) { invalid.forEach(shake); return; }

    const btn = qs('.btn-submit', form);
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message <span class="btn-shimmer"></span>';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1500);
  });
})();


/* ── 10. SMOOTH SCROLL ── */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
})();
