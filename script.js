// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---------- Navbar scroll state ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---------- Typed role text ----------
const roles = [
  'GPU / CUDA Acceleration',
  'C++ Software Engineering',
  'Linux Yocto BSP Development',
  'Custom Linux Images / Driver Integration',
];
const typedEl = document.getElementById('typedRole');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal, .result-bar-wrap');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// wrap result bars so they get 'in-view' class on their wrapper too
document.querySelectorAll('.result-bar-wrap').forEach(el => el.classList.add('reveal'));

// ---------- Count-up stats ----------
const statEls = document.querySelectorAll('.stat-num');
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    statIO.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statIO.observe(el));

// ---------- Skills data + filter ----------
const skills = [
  { name: 'C++', cat: 'lang' },
  { name: 'Python', cat: 'lang' },
  { name: 'C', cat: 'lang' },
  { name: 'CUDA', cat: 'gpu' },
  { name: 'OpenCL', cat: 'gpu' },
  { name: 'Triton', cat: 'gpu' },
  { name: 'Kernel Optimization', cat: 'gpu' },
  { name: 'Tensor Operations', cat: 'gpu' },
  { name: 'CNN', cat: 'vision' },
  { name: 'UNet', cat: 'vision' },
  { name: 'Transformers', cat: 'vision' },
  { name: 'Graph Networks', cat: 'vision' },
  { name: 'ONNX Runtime', cat: 'vision' },
  { name: 'TensorRT', cat: 'vision' },
  { name: 'TVM', cat: 'vision' },
  { name: 'Git', cat: 'tools' },
  { name: 'Docker', cat: 'tools' },
  { name: 'FastAPI', cat: 'tools' },
  { name: 'MLflow', cat: 'tools' },
  { name: 'Azure DevOps CI/CD', cat: 'tools' },
];

const skillCloud = document.getElementById('skillCloud');
if (skillCloud) {
  skillCloud.innerHTML = skills.map(s =>
    `<span class="skill-tag" data-cat="${s.cat}">${s.name}</span>`
  ).join('');
}

document.getElementById('skillFilters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const show = filter === 'all' || tag.dataset.cat === filter;
    tag.classList.toggle('hidden', !show);
  });
});

// ---------- Particle canvas (subtle, low-cost) ----------
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      r: (Math.random() * 1.4 + 0.6) * devicePixelRatio
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5eead4';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    });
    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 * devicePixelRatio) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.08 * (1 - dist / (130 * devicePixelRatio));
          ctx.lineWidth = devicePixelRatio;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
}

// ---------- Cursor glow (desktop only) ----------
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
