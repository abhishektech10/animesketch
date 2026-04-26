/**
 * script.js — Ani Portfolio  (Enhanced Premium Anime Theme)
 * Modules:
 *   1. Theme Toggle (Dark/Light)
 *   2. Scroll Progress Bar
 *   3. Custom Cursor
 *   4. Navbar — Scroll + Active Links
 *   5. Mobile Menu
 *   6. Typewriter Effect
 *   7. Canvas Particle System
 *   8. Scroll Reveal (IntersectionObserver)
 *   9. Counter Animation
 *  10. Gallery Lightbox
 *  11. Carousel (Naruto Sketches)
 *  12. Contact Form
 *  13. Background Music (Web Audio API)
 *  14. Smooth Scroll
 */

'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ============================================================
   All images used in lightbox (indices match data-index)
============================================================ */
const galleryImages = [
  { src: 'https://github.com/abhishektech04/animesketch/releases/download/video%26image/Sketch.1.jpg',  caption: 'Original Sketch #1 — Custom Anime Art · $10' },
  { src: 'https://github.com/abhishektech04/animesketch/releases/download/video%26image/sketch.2.jpg',  caption: 'Original Sketch #2 — Custom Anime Art · $10' },
  { src: 'https://github.com/abhishektech04/animesketch/releases/download/video%26image/sketch.3.jpg',  caption: 'Original Sketch #3 — Custom Anime Art · $10' },
  { src: 'https://github.com/abhishektech04/animesketch/releases/download/video%26image/sketch.4.jpg',  caption: 'Original Sketch #4 — Custom Anime Art · $10' },
  { src: 'https://github.com/abhishektech04/animesketch/releases/download/video%26image/sketch.5.jpg',  caption: 'Original Sketch #5 — Custom Anime Art · $10' },
  { src: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=85',  caption: 'Pencil Art #1 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=85',  caption: 'Pencil Art #2 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1559181567-c3190ca9d70e?w=800&q=85',     caption: 'Pencil Art #3 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=85',     caption: 'Pencil Art #4 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=85',  caption: 'Pencil Art #5 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=85',  caption: 'Pencil Art #6 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=85',  caption: 'Pencil Art #7 — Anime Style Sketch' },
  { src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=85',  caption: 'Pencil Art #8 — Anime Style Sketch' },
];

/* ============================================================
   1. THEME TOGGLE
============================================================ */
(function initTheme() {
  const html      = document.documentElement;
  const btn       = qs('#theme-toggle');
  const icon      = qs('#theme-icon');
  const saved     = localStorage.getItem('ani-theme') || 'dark';

  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ani-theme', next);
    updateIcon(next);
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => btn.style.transform = '', 400);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
})();

/* ============================================================
   2. SCROLL PROGRESS BAR
============================================================ */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  window.addEventListener('scroll', () => {
    const max  = document.body.scrollHeight - window.innerHeight;
    const pct  = (window.scrollY / max) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   3. CUSTOM CURSOR
============================================================ */
(function initCursor() {
  const cursor  = qs('#cursor');
  const trail   = qs('#cursor-trail');
  let mouseX = -100, mouseY = -100;
  let trailX = -100, trailY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Trail follows with lag
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale cursor on clickable elements
  const clickables = 'a, button, .sketch-card, .carousel-btn, .lb-nav, .skill-tag';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(clickables)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      trail.style.transform  = 'translate(-50%,-50%) scale(0.5)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(clickables)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    }
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    trail.style.display  = 'none';
    document.body.style.cursor = 'auto';
  }
})();

/* ============================================================
   4. NAVBAR — Scroll Shadow + Active Link Highlight
============================================================ */
(function initNavbar() {
  const navbar   = qs('#navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    let activeSectionId = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        activeSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeSectionId}`);
    });
  }, { passive: true });
})();

/* ============================================================
   5. MOBILE HAMBURGER MENU
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

  mobileLinks.forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));
})();

/* ============================================================
   6. TYPEWRITER EFFECT
============================================================ */
(function initTypewriter() {
  const phrases = [
    'Anime Sketch Artist from Uttar Pradesh.',
    'Bringing characters to life, one line at a time.',
    'Custom anime commissions — just $10 per sketch.',
    'Naruto-inspired pencil art, full of soul.',
    'Where imagination meets ink and paper.'
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
        setTimeout(tick, 2200);
        return;
      }
    } else {
      typeEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, isDeleting ? 38 : 62);
  }
  tick();
})();

/* ============================================================
   7. CANVAS PARTICLE SYSTEM
============================================================ */
(function initParticles() {
  const canvas = qs('#particle-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H;
  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(255,107,157,',
    'rgba(255,209,102,',
    'rgba(92,124,250,',
    'rgba(6,214,160,',
    'rgba(255,179,206,'
  ];

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 2 + 0.5;
    this.color= COLORS[Math.floor(Math.random() * COLORS.length)];
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.alpha= Math.random() * 0.6 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.age  = 0;
  };
  Particle.prototype.update = function() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.age++;
    if (this.age > this.life) this.reset();
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function() {
    const fade = Math.min(1, this.age / 20, (this.life - this.age) / 20);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + (this.alpha * fade) + ')';
    ctx.fill();
  };

  const COUNT = Math.min(120, Math.floor(W * H / 10000));
  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.age = Math.random() * p.life; // stagger
    particles.push(p);
  }

  // Connecting lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(255,107,157,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   8. SCROLL REVEAL — IntersectionObserver
============================================================ */
(function initScrollReveal() {
  const revealEls = qsa('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  revealEls.forEach(el => obs.observe(el));
})();

/* ============================================================
   9. COUNTER ANIMATION
============================================================ */
(function initCounters() {
  const counters = qsa('.stat-num[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let current = 0;
      const step  = end / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, end);
        el.textContent = Math.floor(current) + '+';
        if (current >= end) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

/* ============================================================
   10. LIGHTBOX
============================================================ */
let currentLbIndex = 0;

function openLightbox(index) {
  currentLbIndex = index;
  const lb = qs('#lightbox');
  updateLightbox();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = qs('#lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img  = qs('#lbImage');
  const cap  = qs('#lbCaption');
  const data = galleryImages[currentLbIndex];
  if (!data) return;

  img.style.opacity = '0';
  img.style.transform = 'scale(0.9)';

  img.src = data.src;
  cap.textContent = data.caption;

  img.onload = () => {
    img.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  };
}

(function initLightbox() {
  const lb        = qs('#lightbox');
  const backdrop  = qs('#lightboxBackdrop');
  const closeBtn  = qs('#lbClose');
  const prevBtn   = qs('#lbPrev');
  const nextBtn   = qs('#lbNext');

  if (!lb) return;

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', () => {
    currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  });

  nextBtn.addEventListener('click', () => {
    currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
    updateLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')  { currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentLbIndex = (currentLbIndex + 1) % galleryImages.length; updateLightbox(); }
  });

  // Touch swipe
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) { currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length; }
    else        { currentLbIndex = (currentLbIndex + 1) % galleryImages.length; }
    updateLightbox();
  });
})();

// Expose globally (called from inline onclick)
window.openLightbox = openLightbox;

/* ============================================================
   11. CAROUSEL (Naruto Sketches)
============================================================ */
(function initCarousel() {
  const track     = qs('#carouselTrack');
  const dotsWrap  = qs('#carouselDots');
  const prevBtn   = qs('#prevBtn');
  const nextBtn   = qs('#nextBtn');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  let current  = 0;
  let slidesVisible = getSlidesVisible();
  let total    = Math.ceil(slides.length / slidesVisible);

  function getSlidesVisible() {
    if (window.innerWidth <= 400) return 1;
    if (window.innerWidth <= 600) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    total = Math.ceil(slides.length / slidesVisible);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const slideWidth = slides[0].offsetWidth + 16; // gap
    track.style.transform = `translateX(-${current * slidesVisible * slideWidth}px)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) goTo(current - 1);
    else        goTo(current + 1);
  });

  // Auto-play
  let autoPlay = setInterval(() => {
    current = current >= total - 1 ? 0 : current + 1;
    goTo(current);
  }, 3500);

  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      current = current >= total - 1 ? 0 : current + 1;
      goTo(current);
    }, 3500);
  });

  // Responsive re-init
  window.addEventListener('resize', () => {
    const newVisible = getSlidesVisible();
    if (newVisible !== slidesVisible) {
      slidesVisible = newVisible;
      current = 0;
      buildDots();
      goTo(0);
    }
  });

  buildDots();
})();

/* ============================================================
   12. CONTACT FORM — Validation + Mock Submit
============================================================ */
(function initContactForm() {
  const form       = qs('#contact-form');
  const successMsg = qs('#form-success');
  if (!form) return;

  function shakeField(el) {
    el.style.borderColor = '#F87171';
    el.animate(
      [
        { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' },
        { transform: 'translateX(0px)'  }
      ],
      { duration: 300 }
    );
    setTimeout(() => el.style.borderColor = '', 2500);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl    = qs('#name', form);
    const emailEl   = qs('#email', form);
    const messageEl = qs('#message', form);

    const invalid = [
      { el: nameEl,    val: nameEl.value.trim() },
      { el: emailEl,   val: emailEl.value.trim() },
      { el: messageEl, val: messageEl.value.trim() }
    ].filter(f => !f.val);

    if (invalid.length) { invalid.forEach(f => shakeField(f.el)); return; }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      shakeField(emailEl); return;
    }

    const submitBtn = qs('.btn-submit', form);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message <span class="btn-shimmer"></span>';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1800);
  });
})();

/* ============================================================
   13. BACKGROUND MUSIC (Web Audio API — Generative Ambient)
   Creates a soft, anime-style ambient soundscape without
   needing any external audio file.
============================================================ */
(function initMusic() {
  const toggleBtn  = qs('#music-toggle');
  const musicIcon  = qs('#music-icon');
  const musicWaves = qs('#music-waves');
  const musicLabel = qs('.music-label');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let nodes = [];
  let masterGain = null;

  function createAudioContext() {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // Create a reverb convolver for atmosphere
  function createReverb(ctx) {
    const convolver = ctx.createConvolver();
    const len = ctx.sampleRate * 2.5;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
    }
    convolver.buffer = buf;
    return convolver;
  }

  // Play a soft pad note
  function playNote(freq, startTime, duration, vol = 0.04) {
    if (!audioCtx || !masterGain) return;

    const osc      = audioCtx.createOscillator();
    const gain     = audioCtx.createGain();
    const reverb   = createReverb(audioCtx);
    const revGain  = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    // Slight vibrato
    osc.frequency.setValueAtTime(freq * 1.002, startTime + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(freq, startTime + duration);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.8);
    gain.gain.setValueAtTime(vol, startTime + duration - 0.8);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    revGain.gain.value = 0.4;

    osc.connect(gain);
    gain.connect(masterGain);
    gain.connect(reverb);
    reverb.connect(revGain);
    revGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);

    nodes.push(osc, gain, reverb, revGain);
  }

  // Pentatonic scale (anime-style: A minor pentatonic)
  const pentatonic = [220, 261.63, 311.13, 349.23, 392, 440, 523.25, 587.33, 659.25, 783.99];

  let musicScheduler = null;
  let nextNoteTime   = 0;

  function scheduleNotes() {
    if (!isPlaying || !audioCtx) return;

    const now = audioCtx.currentTime;
    // Schedule a burst of notes every ~2.5s
    if (nextNoteTime < now + 0.5) {
      // Pick 2-4 random notes from pentatonic
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const freq  = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const start = nextNoteTime + i * (0.25 + Math.random() * 0.3);
        const dur   = 2.5 + Math.random() * 2;
        const vol   = 0.025 + Math.random() * 0.025;
        playNote(freq, start, dur, vol);
      }
      // Bass drone every 4 cycles
      if (Math.random() > 0.6) {
        playNote(110, nextNoteTime, 3.5, 0.03); // A2 drone
      }
      nextNoteTime += 2.0 + Math.random() * 1.5;
    }
    musicScheduler = requestAnimationFrame(scheduleNotes);
  }

  function startMusic() {
    if (!audioCtx) createAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isPlaying = true;
    nextNoteTime = audioCtx.currentTime + 0.1;

    // Fade in
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);

    scheduleNotes();

    toggleBtn.classList.add('playing');
    musicWaves.classList.add('active');
    musicIcon.className = 'fa-solid fa-pause';
    musicLabel.textContent = 'On';
  }

  function stopMusic() {
    isPlaying = false;
    if (musicScheduler) cancelAnimationFrame(musicScheduler);
    if (audioCtx && masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
    }
    toggleBtn.classList.remove('playing');
    musicWaves.classList.remove('active');
    musicIcon.className = 'fa-solid fa-music';
    musicLabel.textContent = 'Music';
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) stopMusic();
    else startMusic();
  });
})();

/* ============================================================
   14. SMOOTH SCROLL
============================================================ */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = qs(targetId);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   15. SCROLL-TRIGGERED CARD TILT (Subtle 3D on sketch cards)
============================================================ */
(function initCardTilt() {
  const cards = qsa('.sketch-card, .slide-img-wrap');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-12px) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.8,0.25,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ============================================================
   16. FLOATING SAKURA PETALS
============================================================ */
(function initPetals() {
  const hero   = qs('#home');
  if (!hero) return;
  const petals = ['🌸', '🌺', '✿', '❀', '🌷'];

  function spawnPetal() {
    const p   = document.createElement('span');
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.setAttribute('aria-hidden', 'true');
    p.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      top:-30px;
      font-size:${Math.random() * 14 + 10}px;
      pointer-events:none;
      opacity:0;
      animation:petal-fall ${Math.random() * 8 + 8}s linear forwards;
      z-index:1;
    `;
    hero.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }

  // Inject keyframe if not already present
  if (!qs('#petal-keyframe')) {
    const style = document.createElement('style');
    style.id = 'petal-keyframe';
    style.textContent = `
      @keyframes petal-fall {
        0%   { transform:translateY(-30px) rotate(0deg) translateX(0);  opacity:0; }
        8%   { opacity:0.7; }
        90%  { opacity:0.4; }
        100% { transform:translateY(105vh) rotate(720deg) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random()*80+20)}px); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 1200);
  setInterval(spawnPetal, 2200);
})();
