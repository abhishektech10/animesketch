/**
 * script.js — Ani Portfolio  v2.0
 *
 * Modules:
 *   1.  Theme Toggle
 *   2.  Navbar — Scroll + Active Link
 *   3.  Mobile Menu
 *   4.  Typewriter Effect
 *   5.  Sakura Petals
 *   6.  Scroll Reveal
 *   7.  Sketch Viewer Modal  ← NEW
 *       · Open / close with animation
 *       · Zoom in/out (buttons, mouse wheel, pinch)
 *       · Pan (mouse drag, touch drag)
 *       · Prev / Next navigation
 *       · Thumbnail strip navigation
 *       · Keyboard (Esc, ←, →, +, -)
 *   8.  Contact Form
 *   9.  Smooth Scroll
 */

'use strict';

/* ─────────────────────────────────────────────
   Utilities
───────────────────────────────────────────── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


/* ================================================================
   1. THEME TOGGLE
================================================================ */
(function initTheme () {
  const html   = document.documentElement;
  const toggle = qs('#theme-toggle');

  html.setAttribute('data-theme', localStorage.getItem('ani-theme') || 'dark');

  toggle.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ani-theme', next);
  });
})();


/* ================================================================
   2. NAVBAR — scroll shadow + active-link highlight
================================================================ */
(function initNavbar () {
  const navbar   = qs('#navbar');
  const links    = qsa('.nav-link');
  const sections = qsa('section[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 28);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });

    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ================================================================
   3. MOBILE MENU
================================================================ */
(function initMobileMenu () {
  const hamburger = qs('#hamburger');
  const drawer    = qs('#mobile-nav');

  const toggle = () => {
    const open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  };

  hamburger.addEventListener('click', toggle);

  // Close when any link clicked
  qsa('.mobile-nav-link').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (drawer.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !hamburger.contains(e.target)) {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();


/* ================================================================
   4. TYPEWRITER EFFECT
================================================================ */
(function initTypewriter () {
  const el = qs('#typewriter-text');
  if (!el) return;

  const phrases = [
    'Anime Sketch Artist from Uttar Pradesh.',
    'Bringing characters to life, one line at a time.',
    'Custom commissions — just $10 per sketch.',
    'Where imagination meets ink.'
  ];

  let pi = 0, ci = 0, del = false;

  const tick = () => {
    const phrase = phrases[pi];
    el.textContent = del ? phrase.slice(0, --ci) : phrase.slice(0, ++ci);

    if (!del && ci === phrase.length) {
      del = true;
      setTimeout(tick, 2200);
      return;
    }
    if (del && ci === 0) {
      del = false;
      pi  = (pi + 1) % phrases.length;
    }
    setTimeout(tick, del ? 44 : 72);
  };

  tick();
})();


/* ================================================================
   5. SAKURA PETALS
================================================================ */
(function initPetals () {
  const hero = qs('#home');
  if (!hero) return;

  const spawn = () => {
    const p = document.createElement('div');
    p.className = 'petal';
    p.setAttribute('aria-hidden', 'true');

    const size = Math.random() * 12 + 5;
    const dur  = Math.random() * 11 + 13;
    const del  = Math.random() * 7;

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 102}%;
      animation-duration:${dur}s;
      animation-delay:${del}s;
      opacity:${(Math.random() * 0.14 + 0.04).toFixed(2)};
    `;

    hero.appendChild(p);
    setTimeout(() => p.remove(), (dur + del) * 1000);
  };

  for (let i = 0; i < 14; i++) spawn();
  setInterval(spawn, 2800);
})();


/* ================================================================
   6. SCROLL REVEAL
================================================================ */
(function initReveal () {
  const els = qsa('.reveal, .reveal-left, .reveal-right');

  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -55px 0px' }
  );

  els.forEach(el => io.observe(el));
})();


/* ================================================================
   7. SKETCH VIEWER MODAL
================================================================ */
(function initModal () {
  /* ── DOM references ── */
  const backdrop    = qs('.sketch-modal-backdrop');
  const modal       = qs('.sketch-modal');
  const viewport    = qs('.modal-viewport');
  const imgWrap     = qs('.modal-img-wrap');
  const modalImg    = qs('.modal-img');
  const thumbStrip  = qs('.modal-thumbs');
  const modalTitle  = qs('.modal-title');
  const modalSub    = qs('.modal-subtitle');
  const counter     = qs('.modal-counter');
  const zoomLabel   = qs('.zoom-level');
  const btnClose    = qs('.modal-btn-close');
  const btnZoomIn   = qs('#btn-zoom-in');
  const btnZoomOut  = qs('#btn-zoom-out');
  const btnReset    = qs('#btn-zoom-reset');
  const btnPrev     = qs('#btn-prev');
  const btnNext     = qs('#btn-next');

  if (!backdrop) return; // safety guard

  /* ── State ── */
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.35;

  let sketches = [];      // [{ src, title, sub }]
  let currentIdx = 0;
  let scale      = 1;
  let ox = 0, oy = 0;    // pan offset
  let dragging   = false;
  let dragStart  = { x: 0, y: 0 };
  let panStart   = { x: 0, y: 0 };

  /* ── Build sketches array from DOM ── */
  const cards = qsa('.sketch-card[data-src]');

  /* ── Helpers ── */
  const setTransform = (animated = false) => {
    imgWrap.classList.toggle('animate-zoom', animated);
    imgWrap.style.transform = `translate(${ox}px, ${oy}px) scale(${scale})`;
    if (zoomLabel) zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  };

  const resetView = (animated = true) => {
    scale = 1;
    ox = 0;
    oy = 0;
    setTransform(animated);
  };

  const clampPan = () => {
    // Limit pan so image can't go fully out of viewport
    const maxPanX = (viewport.clientWidth  * (scale - 1)) / 2 + 60;
    const maxPanY = (viewport.clientHeight * (scale - 1)) / 2 + 60;
    ox = clamp(ox, -maxPanX, maxPanX);
    oy = clamp(oy, -maxPanY, maxPanY);
  };

  const zoom = (delta, animated = true) => {
    scale = clamp(scale + delta, MIN_ZOOM, MAX_ZOOM);
    if (scale <= 1) { ox = 0; oy = 0; }
    else clampPan();
    setTransform(animated);
  };

  const loadSketch = (idx) => {
    const s = sketches[idx];
    if (!s) return;

    currentIdx = idx;

    // Swap image with fade
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'scale(0.96)';
    setTimeout(() => {
      modalImg.src = s.src;
      modalImg.alt = s.title;
      modalImg.style.opacity = '';
      modalImg.style.transform = '';
    }, 180);

    if (modalTitle) modalTitle.textContent = s.title;
    if (modalSub)   modalSub.textContent   = s.sub;
    if (counter)    counter.textContent    = `${idx + 1} / ${sketches.length}`;

    // Update thumbnails
    qsa('.modal-thumb', thumbStrip).forEach((t, i) => {
      t.classList.toggle('active', i === idx);
      if (i === idx) t.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    });

    // Update nav buttons
    if (btnPrev) btnPrev.disabled = idx === 0;
    if (btnNext) btnNext.disabled = idx === sketches.length - 1;

    resetView(false);
  };

  const openModal = (idx) => {
    loadSketch(idx);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    // Small delay then reset view so it's clean for next open
    setTimeout(resetView, 400);
  };

  /* ── Build thumbnails ── */
  const buildThumbs = () => {
    if (!thumbStrip) return;
    thumbStrip.innerHTML = '';
    sketches.forEach((s, i) => {
      const img = document.createElement('img');
      img.className  = 'modal-thumb';
      img.src        = s.src;
      img.alt        = s.title;
      img.loading    = 'lazy';
      img.addEventListener('click', () => {
        loadSketch(i);
      });
      thumbStrip.appendChild(img);
    });
  };

  /* ── Collect sketch cards ── */
  const collectSketches = () => {
    sketches = qsa('.sketch-card').map(card => ({
      src:   card.dataset.src || qs('img', card)?.src,
      title: card.dataset.title || qs('.card-overlay-label', card)?.textContent || 'Sketch',
      sub:   card.dataset.sub   || qs('.card-overlay-sub',   card)?.textContent || 'Custom Sketch · $10'
    })).filter(s => s.src);
    buildThumbs();
  };

  collectSketches();

  /* ── Attach open listeners to cards ── */
  const attachCardListeners = () => {
    qsa('.sketch-card').forEach((card, i) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View sketch: ${sketches[i]?.title}`);

      const open = () => openModal(i);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  };
  attachCardListeners();

  /* ── Button listeners ── */
  btnClose?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });

  btnZoomIn?.addEventListener('click',  () => zoom(+ZOOM_STEP));
  btnZoomOut?.addEventListener('click', () => zoom(-ZOOM_STEP));
  btnReset?.addEventListener('click',   () => resetView(true));

  btnPrev?.addEventListener('click', () => {
    if (currentIdx > 0) loadSketch(currentIdx - 1);
  });
  btnNext?.addEventListener('click', () => {
    if (currentIdx < sketches.length - 1) loadSketch(currentIdx + 1);
  });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (!backdrop.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':     closeModal();                           break;
      case 'ArrowLeft':  btnPrev?.click();                       break;
      case 'ArrowRight': btnNext?.click();                       break;
      case '+':
      case '=':          zoom(+ZOOM_STEP);                       break;
      case '-':          zoom(-ZOOM_STEP);                       break;
      case '0':          resetView(true);                        break;
    }
  });

  /* ── Mouse Wheel Zoom ── */
  viewport?.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? +ZOOM_STEP * 0.6 : -ZOOM_STEP * 0.6;
    zoom(delta, false);
  }, { passive: false });

  /* ── Mouse Pan (drag) ── */
  viewport?.addEventListener('mousedown', e => {
    if (scale <= 1) return;
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    panStart  = { x: ox, y: oy };
    viewport.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    ox = panStart.x + (e.clientX - dragStart.x);
    oy = panStart.y + (e.clientY - dragStart.y);
    clampPan();
    setTransform(false);
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    viewport.style.cursor = scale > 1 ? 'grab' : 'default';
  });

  /* ── Touch — pan + pinch-to-zoom ── */
  let touchStartDist  = 0;
  let touchStartScale = 1;
  let touchStartPan   = { x: 0, y: 0 };
  let touchMid        = { x: 0, y: 0 };

  const getTouchDist = (a, b) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const getTouchMid = (a, b) => ({
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2
  });

  viewport?.addEventListener('touchstart', e => {
    if (e.touches.length === 1 && scale > 1) {
      dragging  = true;
      dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart  = { x: ox, y: oy };
    } else if (e.touches.length === 2) {
      dragging        = false;
      touchStartDist  = getTouchDist(e.touches[0], e.touches[1]);
      touchStartScale = scale;
      touchMid        = getTouchMid(e.touches[0], e.touches[1]);
      touchStartPan   = { x: ox, y: oy };
    }
    e.preventDefault();
  }, { passive: false });

  viewport?.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && dragging) {
      ox = panStart.x + (e.touches[0].clientX - dragStart.x);
      oy = panStart.y + (e.touches[0].clientY - dragStart.y);
      clampPan();
      setTransform(false);
    } else if (e.touches.length === 2) {
      const dist  = getTouchDist(e.touches[0], e.touches[1]);
      scale = clamp(touchStartScale * (dist / touchStartDist), MIN_ZOOM, MAX_ZOOM);
      clampPan();
      setTransform(false);
    }
    e.preventDefault();
  }, { passive: false });

  viewport?.addEventListener('touchend', e => {
    if (e.touches.length < 1) dragging = false;
    if (scale < 1) resetView(true);
  });

  /* ── Double-click to toggle zoom ── */
  viewport?.addEventListener('dblclick', () => {
    if (scale > 1) resetView(true);
    else zoom(1.5);
  });

})();


/* ================================================================
   8. CONTACT FORM
================================================================ */
(function initForm () {
  const form    = qs('#contact-form');
  const success = qs('#form-success');
  if (!form) return;

  const shake = el => {
    el.style.borderColor = '#ef5350';
    el.animate(
      [
        { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' },
        { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 280, iterations: 1 }
    );
    setTimeout(() => (el.style.borderColor = ''), 1800);
  };

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl = qs('#name', form);
    const mailEl = qs('#email', form);
    const msgEl  = qs('#message', form);

    const invalid = [
      { el: nameEl, v: nameEl.value.trim() },
      { el: mailEl, v: mailEl.value.trim() },
      { el: msgEl,  v: msgEl.value.trim()  }
    ].filter(f => !f.v);

    if (invalid.length) { invalid.forEach(f => shake(f.el)); return; }

    const btn = qs('.btn-send', form);
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1400);
  });
})();


/* ================================================================
   9. SMOOTH SCROLL
================================================================ */
(function initSmoothScroll () {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
