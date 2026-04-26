/**
 * script.js — Ani Portfolio  (Ink & Neon Theme)
 * Modules:
 *   1. Dark / Light Theme Toggle
 *   2. Navbar — Scroll Shadow + Active Link Highlight
 *   3. Mobile Hamburger Menu
 *   4. Typewriter Effect — Hero Tagline
 *   5. Floating Particles (hero atmosphere)
 *   6. Scroll-Reveal — IntersectionObserver
 *   7. Contact Form — Validation + Mock Submit
 *   8. Smooth Scroll — Anchor Click Handler
 */

'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);


/* ============================================================
   1. DARK / LIGHT THEME TOGGLE
============================================================ */
(function initTheme() {
  const html        = document.documentElement;
  const themeToggle = qs('#theme-toggle');

  const savedTheme = localStorage.getItem('ani-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ani-theme', next);
  });
})();


/* ============================================================
   2. NAVBAR — Scroll Shadow + Active Link Highlight
============================================================ */
(function initNavbar() {
  const navbar   = qs('#navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    let activeSectionId = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        activeSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeSectionId}`;
      link.classList.toggle('active', isActive);
    });
  }, { passive: true });
})();


/* ============================================================
   3. MOBILE HAMBURGER MENU
============================================================ */
(function initMobileNav() {
  const hamburger   = qs('#hamburger');
  const mobileNav   = qs('#mobile-nav');
  const mobileLinks = qsa('.mobile-nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   4. TYPEWRITER EFFECT — Hero Tagline
============================================================ */
(function initTypewriter() {
  const phrases = [
    'Anime Sketch Artist from Uttar Pradesh.',
    'Bringing characters to life, one line at a time.',
    'Custom anime commissions — just $10 per sketch.',
    'Where imagination meets ink.'
  ];

  const typeEl   = qs('#typewriter-text');
  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      typeEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        isDeleting = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      typeEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(tick, isDeleting ? 45 : 70);
  }

  tick();
})();


/* ============================================================
   5. FLOATING PARTICLES — Hero atmosphere (Ink & Neon)
   Tiny glowing dots that drift upward for an electric feel.
============================================================ */
(function initParticles() {
  const heroSection = qs('#home');

  const colors = ['#6366F1', '#22D3EE', '#818CF8', '#67E8F9'];

  function createParticle() {
    const p    = document.createElement('div');
    p.classList.add('particle');
    p.setAttribute('aria-hidden', 'true');

    const size     = Math.random() * 5 + 2;          // 2–7px
    const startX   = Math.random() * 100;
    const duration = Math.random() * 12 + 10;         // 10–22s
    const delay    = Math.random() * 6;
    const color    = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      bottom: 0;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    heroSection.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }

  for (let i = 0; i < 14; i++) createParticle();
  setInterval(createParticle, 2000);
})();


/* ============================================================
   6. SCROLL-REVEAL — IntersectionObserver
============================================================ */
(function initScrollReveal() {
  const revealEls = qsa('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   7. CONTACT FORM — Validation + Mock Submit
============================================================ */
(function initContactForm() {
  const form       = qs('#contact-form');
  const successMsg = qs('#form-success');

  function shakeField(el) {
    el.style.borderColor = '#F87171';
    el.animate(
      [
        { transform: 'translateX(-6px)' },
        { transform: 'translateX( 6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX( 4px)' },
        { transform: 'translateX( 0px)' }
      ],
      { duration: 300, iterations: 1 }
    );
    setTimeout(() => (el.style.borderColor = ''), 2000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl    = qs('#name',    form);
    const emailEl   = qs('#email',   form);
    const messageEl = qs('#message', form);

    const invalid = [
      { el: nameEl,    val: nameEl.value.trim()    },
      { el: emailEl,   val: emailEl.value.trim()   },
      { el: messageEl, val: messageEl.value.trim() }
    ].filter(f => !f.val);

    if (invalid.length > 0) {
      invalid.forEach(f => shakeField(f.el));
      return;
    }

    const submitBtn = qs('.btn-submit', form);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1500);
  });
})();


/* ============================================================
   8. SMOOTH SCROLL — Anchor Click Handler
============================================================ */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = qs(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();