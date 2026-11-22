// ============================================
// budd — Editorial Portfolio
// Vanilla ES2020, no dependencies
// ============================================

(() => {
  'use strict';
  
  // ----- Spring Physics (Emil Kowalski / Apple-style) -----
  class Spring {
    constructor({ stiffness = 150, damping = 18, mass = 1 } = {}) {
      this.stiffness = stiffness;
      this.damping = damping;
      this.mass = mass;
      this.position = 0;
      this.velocity = 0;
      this.target = 0;
      this._raf = null;
    }
    
    setTarget(target) { this.target = target; }
    setPosition(pos) { this.position = pos; this.velocity = 0; }
    
    tick(dt) {
      if (dt > 0.1) dt = 0.1;
      const force = -this.stiffness * (this.position - this.target);
      const dampingForce = -this.damping * this.velocity;
      const acceleration = (force + dampingForce) / this.mass;
      this.velocity += acceleration * dt;
      this.position += this.velocity * dt;
      return this.position;
    }
    
    isSettled(threshold = 0.01) {
      return Math.abs(this.position - this.target) < threshold && Math.abs(this.velocity) < threshold;
    }
    
    start() {
      if (this._raf) return;
      let last = performance.now();
      const step = (now) => {
        const dt = (now - last) / 1000;
        last = now;
        this.tick(dt);
        this._raf = requestAnimationFrame(step);
        if (this.isSettled()) this.stop();
      };
      this._raf = requestAnimationFrame(step);
    }
    
    stop() { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; } }
  }
  
  // ----- Utility: prefers-reduced-motion -----
  const prefersReducedMotion = () => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // ----- Data Loader -----
  async function loadProjects() {
    try {
      const res = await fetch('data/projects.json');
      if (!res.ok) throw new Error('Failed to load projects');
      return await res.json();
    } catch (e) {
      console.error('Project data load failed:', e);
      return { projects: [], experiments: [], stats: { repos: 0, commits_2026: 0, years_active: 0 } };
    }
  }
  
  // ----- Project Card Template -----
  function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project-card card-shell reveal';
    article.setAttribute('role', 'listitem');
    article.innerHTML = `
      <div class="card-core">
        <header class="card-header">
          <h3 class="card-title">${escapeHtml(project.title)}</h3>
          <time class="card-meta" datetime="${project.updated}">${formatDate(project.updated)}</time>
        </header>
        <p class="card-desc">${escapeHtml(project.description)}</p>
        <ul class="card-tags" aria-label="Technologies">
          ${project.tags.map(t => '<li>' + escapeHtml(t) + '</li>').join('')}
        </ul>
        <footer class="card-footer">
          <a href="${escapeHtml(project.github)}" class="keycap-cta" target="_blank" rel="noopener" aria-label="View " + escapeHtml(project.title) + " on GitHub">
            <span class="keycap-cta__label">View Code</span>
            <svg class="keycap-cta__icon" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          ${project.live ? '<a href="' + escapeHtml(project.live) + '" class="keycap-cta" target="_blank" rel="noopener" aria-label="View live demo"><span class="keycap-cta__label">Live</span></a>' : ''}
        </footer>
      </div>
    `;
    return article;
  }
  
  // ----- Experiment Card Template -----
  function createExperimentCard(exp) {
    const article = document.createElement('article');
    article.className = 'experiment-card cut-card reveal';
    article.setAttribute('role', 'listitem');
    article.innerHTML = `
      <div class="cut-card__corner" aria-hidden="true"></div>
      <h3 class="cut-card__title">${escapeHtml(exp.title)}</h3>
      <p class="cut-card__desc">${escapeHtml(exp.description)}</p>
      <a href="${escapeHtml(exp.github)}" class="keycap-cta keycap-cta--cut" target="_blank" rel="noopener" aria-label="View " + escapeHtml(exp.title) + " on GitHub">
        View Code
      </a>
    `;
    return article;
  }
  
  // ----- Hydration -----
  async function hydrate() {
    const data = await loadProjects();
    
    // Projects grid
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && data.projects?.length) {
      const fragment = document.createDocumentFragment();
      data.projects.forEach(p => fragment.appendChild(createProjectCard(p)));
      projectsGrid.appendChild(fragment);
    } else if (projectsGrid) {
      projectsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--color-text-muted);padding:var(--space-xl);">No projects yet.</p>';
    }
    
    // Experiments grid
    const expGrid = document.getElementById('experiments-grid');
    if (expGrid && data.experiments?.length) {
      const fragment = document.createDocumentFragment();
      data.experiments.forEach(e => fragment.appendChild(createExperimentCard(e)));
      expGrid.appendChild(fragment);
    } else if (expGrid) {
      expGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--color-text-muted);padding:var(--space-xl);">No experiments yet.</p>';
    }
    
    // Stats counters
    if (data.stats) {
      document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter, 10);
        el.dataset.target = target;
      });
    }
    
    // Current year
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Trigger scroll reveals after hydration
    if (window.ScrollReveal) window.ScrollReveal.init();
    if (window.CounterAnimator) window.CounterAnimator.init();
  }
  
  // ----- Helpers -----
  function escapeHtml(str) {
    const map = { "&": "&", "<": "<", ">": ">", '"': '"', "'": "'" };
    return String(str).replace(/[&<>"']/g, s => map[s]);
  }
  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  
  // ----- Init -----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
  
  // Expose for other modules
  window.Spring = Spring;
  window.prefersReducedMotion = prefersReducedMotion;
})();

// ============================================
// Ambient Canvas (Hero background)
// ============================================

class AmbientCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { desynchronized: true, alpha: true });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 0; this.height = 0;
    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.time = 0;
    this.springs = { x: new Spring({ stiffness: 120, damping: 20 }), y: new Spring({ stiffness: 120, damping: 20 }) };
    this.noiseCache = null;
    this.noiseFrame = 0;
    this._raf = null;
    this._boundResize = this.resize.bind(this);
    this._boundMouse = this.onMouse.bind(this);
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', this._boundResize);
    document.addEventListener('mousemove', this._boundMouse);
    this.canvas.addEventListener('mouseenter', () => this.springs.x.setTarget(this.mouse.targetX), { once: true });
    this.loop();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.floor(rect.width * this.dpr);
    this.height = Math.floor(rect.height * this.dpr);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    this.generateNoise();
  }
  
  generateNoise() {
    const w = Math.ceil(this.width / this.dpr);
    const h = Math.ceil(this.height / this.dpr);
    this.noiseCache = this.ctx.createImageData(w, h);
    const data = this.noiseCache.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 15;
    }
  }
  
  onMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.targetX = (e.clientX - rect.left) / rect.width;
    this.mouse.targetY = (e.clientY - rect.top) / rect.height;
  }
  
  loop() {
    if (prefersReducedMotion()) {
      this.drawStatic();
      return;
    }
    const now = performance.now();
    const dt = (now - this.time) / 1000;
    this.time = now;
    
    this.springs.x.setTarget(this.mouse.targetX);
    this.springs.y.setTarget(this.mouse.targetY);
    this.springs.x.tick(dt);
    this.springs.y.tick(dt);
    this.mouse.x = this.springs.x.position;
    this.mouse.y = this.springs.y.position;
    
    this.draw(dt);
    this._raf = requestAnimationFrame(() => this.loop());
  }
  
  draw(dt) {
    const ctx = this.ctx;
    const w = this.width / this.dpr;
    const h = this.height / this.dpr;
    
    ctx.clearRect(0, 0, this.width, this.height);
    
    this.noiseFrame++;
    if (this.noiseFrame % 8 === 0) this.generateNoise();
    ctx.putImageData(this.noiseCache, 0, 0);
    
    const gx = w * 0.5 + (this.mouse.x - 0.5) * w * 0.15;
    const gy = h * 0.5 + (this.mouse.y - 0.5) * h * 0.15;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.7);
    grad.addColorStop(0, 'oklch(0.986 0.005 250 / 0)');
    grad.addColorStop(1, 'oklch(0.986 0.005 250 / 0.03)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    for (let i = 0; i < 3; i++) {
      const px = (w * 0.2 + (i * w * 0.25) + Math.sin(this.time * 0.3 + i) * 40 + (this.mouse.x - 0.5) * 30);
      const py = (h * 0.3 + (i % 2) * h * 0.4 + Math.cos(this.time * 0.2 + i) * 30 + (this.mouse.y - 0.5) * 25);
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'oklch(0.52 0.19 258 / 0.08)';
      ctx.fill();
    }
  }
  
  drawStatic() {
    const ctx = this.ctx;
    const w = this.width / this.dpr;
    const h = this.height / this.dpr;
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.noiseCache) ctx.putImageData(this.noiseCache, 0, 0);
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.7);
    grad.addColorStop(0, 'oklch(0.986 0.005 250 / 0)');
    grad.addColorStop(1, 'oklch(0.986 0.005 250 / 0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  
  destroy() {
    window.removeEventListener('resize', this._boundResize);
    document.removeEventListener('mousemove', this._boundMouse);
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

// Init ambient canvas
const ambientCanvas = document.getElementById('ambient-canvas');
if (ambientCanvas) {
  new AmbientCanvas(ambientCanvas);
}

// ============================================
// Scroll Reveal (IntersectionObserver + clip-path + @starting-style)
// ============================================

const ScrollReveal = (() => {
  const prefersReduced = prefersReducedMotion();
  const revealElements = [];
  let observer = null;
  
  function init() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }
    
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 60) + 'ms';
      revealElements.push(el);
    });
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
  }
  
  return { init };
})();

// ============================================
// Counter Animator (Spring count-up)
// ============================================

const CounterAnimator = (() => {
  const prefersReduced = prefersReducedMotion();
  const counters = [];
  let observer = null;
  
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.dataset.counter, 10);
    if (isNaN(target)) return;
    
    if (prefersReduced) {
      el.textContent = target.toLocaleString();
      return;
    }
    
    const spring = new Spring({ stiffness: 180, damping: 22 });
    spring.setPosition(0);
    spring.setTarget(target);
    
    const duration = 1200;
    const start = performance.now();
    
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(tick);
  }
  
  function init() {
    document.querySelectorAll('[data-counter]').forEach(el => counters.push(el));
    if (!counters.length) return;
    
    if (prefersReduced) {
      counters.forEach(el => el.textContent = (parseInt(el.dataset.counter, 10) || 0).toLocaleString());
      return;
    }
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.5 });
    
    counters.forEach(el => observer.observe(el));
  }
  
  return { init };
})();