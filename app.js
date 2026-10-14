/* ─── app.js — Astrix Interactive Logic ─── */

// ══════════════════════════════════════════
// NAVBAR SCROLL BEHAVIOR
// ══════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ══════════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ══════════════════════════════════════════
// ANIMATED SIGNAL CANVAS (HERO BACKGROUND)
// ══════════════════════════════════════════
(function initSignalCanvas() {
  const canvas = document.getElementById('signal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const waves = Array.from({ length: 6 }, (_, i) => ({
    amp:    40 + i * 18,
    freq:   0.004 + i * 0.002,
    speed:  0.4 + i * 0.15,
    offset: i * 80,
    phase:  (i * Math.PI) / 3,
    alpha:  0.06 - i * 0.008,
    y:      0.25 + i * 0.1,
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waves.forEach(w => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 180, 255, ${w.alpha})`;
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height * w.y +
          w.amp * Math.sin(w.freq * x + t * w.speed + w.phase) +
          (w.amp * 0.4) * Math.sin(w.freq * 2.3 * x - t * w.speed * 0.7 + w.phase);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════════════════
// LIVE WAVE CANVAS (ABOUT SECTION)
// ══════════════════════════════════════════
(function initWaveCanvas() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const channels = [
    { color: '#00d4ff', amp: 22, freq: 0.06, speed: 1.2, phase: 0, alpha: 0.9 },
    { color: '#0066ff', amp: 14, freq: 0.1,  speed: 1.8, phase: 1.2, alpha: 0.7 },
    { color: '#00ffcc', amp: 8,  freq: 0.15, speed: 2.5, phase: 2.4, alpha: 0.5 },
  ];

  let t = 0;
  function drawWave() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, W, H);

    channels.forEach(ch => {
      ctx.beginPath();
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = ch.alpha;
      for (let x = 0; x <= W; x += 2) {
        const y = H / 2 + ch.amp * Math.sin(ch.freq * x + t * ch.speed + ch.phase);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Spike effect every ~3 seconds
    const spike = Math.abs(Math.sin(t * 0.3));
    if (spike > 0.97) {
      const sx = Math.random() * W;
      ctx.beginPath();
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.moveTo(sx, H * 0.2);
      ctx.lineTo(sx, H * 0.8);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    t += 0.05;
    requestAnimationFrame(drawWave);
  }
  drawWave();
})();

// ══════════════════════════════════════════
// ANIMATED DATA READOUT (HERO)
// ══════════════════════════════════════════
(function initReadout() {
  const stressFill      = document.querySelector('.stress-fill');
  const deceptionFill   = document.querySelector('.deception-fill');
  const stressVal       = document.getElementById('stress-val');
  const deceptionVal    = document.getElementById('deception-val');

  if (!stressFill) return;

  function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  function updateReadout() {
    const s = randomBetween(18, 48);
    const d = randomBetween(5, 25);

    stressFill.style.width    = s + '%';
    deceptionFill.style.width = d + '%';
    if (stressVal)    stressVal.textContent    = s + '%';
    if (deceptionVal) deceptionVal.textContent = d + '%';
  }

  setInterval(updateReadout, 2800);
})();

// ══════════════════════════════════════════
// COUNTER ANIMATION (HERO STATS)
// ══════════════════════════════════════════
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (target === 0) return; // skip zero
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
(function initScrollReveal() {
  const revealEls = [
    ...document.querySelectorAll('.step-card'),
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.usecase-card'),
    ...document.querySelectorAll('.about-grid > *'),
    ...document.querySelectorAll('.contact-grid > *'),
    ...document.querySelectorAll('.tech-card'),
  ];

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    else if (i % 4 === 2) el.classList.add('reveal-delay-2');
    else if (i % 4 === 3) el.classList.add('reveal-delay-3');
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
})();

// ══════════════════════════════════════════
// ACTIVE NAV LINK ON SCROLL
// ══════════════════════════════════════════
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));
})();

// ══════════════════════════════════════════
// CONTACT FORM SUBMISSION
// ══════════════════════════════════════════
(function initForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    const fname = form.fname.value.trim();
    const email = form.email.value.trim();
    if (!fname || !email) {
      shakeBtn();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending…';

    // Simulate async send
    await new Promise(r => setTimeout(r, 1400));

    form.style.display = 'none';
    successMsg.classList.add('show');
  });

  function shakeBtn() {
    submitBtn.style.animation = 'shake 0.4s ease';
    setTimeout(() => submitBtn.style.animation = '', 500);
  }
})();

// Add shake keyframe dynamically if needed
const styleShake = document.createElement('style');
styleShake.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}
.nav-link.active { color: var(--cyan-accent) !important; }
`;
document.head.appendChild(styleShake);
