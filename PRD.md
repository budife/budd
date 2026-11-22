# PRD: Editorial Portfolio Site (budd.my.id)

> **Status:** Approved for implementation
> **Date:** 2026-11-22
> **Owner:** budd (budife)
> **Repo:** https://github.com/budife/budd
> **Deploy:** https://budd.my.id (via NPM proxy + nginx:alpine on Maple VPS)

---

## 1. Intent & Why

Build a personal portfolio/showcase site at `budd.my.id` that displays budife's GitHub projects and work with an **Editorial typography-led design** — generous whitespace, distinctive serif display, restrained color, and subtle motion. The site must comply with **Hallmark Cobalt** design system (Floor rules + Arcade/Cobalt tokens) and pass the **7-Axis Anti-Slop Quality Gate**.

**Why now:** Current live site is a biomechanical digging animation placeholder. User wants a real portfolio that "shows off work/projects" with a cohesive, crafted design using all accumulated design engineering skills.

**Success looks like:**
- Live at https://budd.my.id with HTTPS/HTTP2
- Hallmark Floor compliant (tokens, focus-visible, reduced-motion, semantic HTML)
- 7-Axis Quality Gate: all axes ≥ 4
- Real project data displayed (placeholder images OK for now)
- Primary CTA "View GitHub" drives traffic to https://github.com/budife
- Feels crafted, not generated — "unseen details compound"

---

## 2. Goals, Non-Goals, Anti-Goals

### Goals
- [ ] Hallmark Cobalt token compliance (exact OKLCH values from spec)
- [ ] Editorial archetype: Playfair Display (display) + Newsreader/Inter (body) + JetBrains Mono (data)
- [ ] Double-bezel card architecture for project/experiment cards
- [ ] Magnetic hover physics on CTA keycap (spring-based)
- [ ] clip-path scroll reveals for project cards
- [ ] Spring-smoothed mouse parallax on hero ambient canvas
- [ ] @starting-style staggered enter animations
- [ ] Real project data from static JSON (GitHub API later)
- [ ] Zero vanity metrics, zero fake data
- [ ] 7-Axis Quality Gate pass
- [ ] Deploy to budd.my.id via existing NPM/nginx pipeline

### Non-Goals
- [ ] CMS or dynamic backend (static site only)
- [ ] User authentication
- [ ] Comments or social features
- [ ] Dark mode (Editorial archetype is light-first; can add later if needed)
- [ ] Complex pixel art aesthetic (pixel-art-web skill used only for favicon/subtle texture)
- [ ] Blog/CMS — this is a portfolio index, not a writing platform

### Anti-Goals (Failure if present)
- ❌ Purple/indigo radial gradients ("AI Dark Mode Blob")
- ❌ Raw emojis as functional icons (🚀 🔥 💡 📊)
- ❌ Fake vanity stats ("50k+ users", "10x faster")
- ❌ Single-word italicized/gradient headlines
- ❌ 3-card cookie-cutter grids with identical hover glow
- ❌ Missing `:focus-visible` on any interactive element
- ❌ `transition: all` anywhere
- ❌ `ease-in` on UI animations
- ❌ Animations on high-frequency actions (100+/day)
- ❌ Horizontal overflow on mobile
- ❌ Hardcoded pixel values breaking 8pt grid
- ❌ `outline: none` without focus replacement ring
- ❌ Duplicate metric cards or redundant buttons

---

## 3. Constraints

| Constraint | Value |
|------------|-------|
| **Domain** | `budd.my.id` (root, via NPM config #4) |
| **Repo** | `budife/budd` (GitHub Pages not used; VPS deploy) |
| **Stack** | Static HTML/CSS/JS, nginx:alpine on port 8087 |
| **Fonts** | Google Fonts: Playfair Display, Newsreader, Inter, JetBrains Mono |
| **Tokens** | Hallmark Cobalt exact OKLCH (paper 98.6% 0.005 250, ink 21% 0.028 262, accent 52% 0.19 258, graphite, glyphs 1-4, keycaps, rules, shadows, radii, spacing, tracking, durations, easings, font stacks) |
| **Performance** | Inline critical CSS (~3KB), preconnect fonts, preload CSS/JS, font-display: optional WOFF2, gzip level 6, Early Hints (103) |
| **Accessibility** | WCAG 2.1 AA: focus-visible, semantic HTML, ARIA labels, prefers-reduced-motion, 44x44 touch targets |
| **Browser Support** | Modern (ES2020+, CSS custom properties, clip-path, @starting-style) |
| **Existing Infra** | NPM proxy host #4 → 172.17.0.1:8087, Let's Encrypt ECDSA cert `npm-3` |

---

## 4. Design Contract

### 4.1 Visual Hierarchy (1-to-3 Rule)

**Header (viewport top):**
- 1 Primary: Wordmark "budd" (Playfair Display, tracking-tight)
- 1 Action: Keycap CTA "View Work" → https://github.com/budife (primary accent)

**Hero (above fold):**
- 1 Primary: Marquee headline "Selected Work" (Playfair Display, fluid clamp)
- 1 Ambient: Subtle canvas texture (pixel grain + slow drift)
- 0 Actions (hero is passive)

**Projects Section:**
- 1 Primary per card: Project title + GitHub link (keycap CTA)
- Max 3 Secondary: Description (1 line), Tech tags (2-3), Last updated
- Layout: Bento grid (asymmetric, content-driven)

**Experiments Section:**
- 1 Primary per card: Experiment title + Link
- Max 2 Secondary: Description, Tag
- Layout: Smaller cut-cards (Hallmark Cobalt .cut-card)

**Stats/About:**
- 1 Primary: Bio (2-3 sentences, Newsreader)
- 3 Metrics: Repos, Commits (year), Years active (tabular-nums, JetBrains Mono)

**Footer:**
- 1 Primary: Copyright
- 3 Links: GitHub, Email, RSS (if exists)

### 4.2 Typography Scale (Editorial Archetype)

| Role | Font | Size (clamp) | Weight | Line Height | Tracking |
|------|------|--------------|--------|-------------|----------|
| Wordmark | Playfair Display | `clamp(1.5rem, 3vw, 2.5rem)` | 600 | 1.1 | -0.02em |
| Hero Headline | Playfair Display | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | 1.05 | -0.03em |
| Section Title | Playfair Display | `clamp(1.75rem, 4vw, 2.5rem)` | 600 | 1.15 | -0.02em |
| Card Title | Playfair Display | `clamp(1.125rem, 2vw, 1.375rem)` | 600 | 1.2 | -0.01em |
| Body | Newsreader | `clamp(1rem, 1.5vw, 1.125rem)` | 400 | 1.7 | 0 |
| Meta/Caption | Inter | `0.875rem` | 500 | 1.5 | 0.01em |
| Code/Data | JetBrains Mono | `0.8125rem` | 400 | 1.6 | 0 |
| Keycap CTA | JetBrains Mono | `0.75rem` | 500 | 1 | 0.05em |

**Line length cap:** `max-width: 70ch` on all prose containers.

### 4.3 Color Tokens (Hallmark Cobalt Exact)

```css
:root {
  /* Cobalt OKLCH - EXACT from Hallmark spec */
  --color-paper: oklch(0.986 0.005 250);
  --color-ink: oklch(0.21 0.028 262);
  --color-accent: oklch(0.52 0.19 258);
  --color-graphite: oklch(0.18 0.02 260);
  --color-glyph-1: oklch(0.35 0.02 262);
  --color-glyph-2: oklch(0.5 0.02 262);
  --color-glyph-3: oklch(0.65 0.02 262);
  --color-glyph-4: oklch(0.8 0.02 262);
  --color-keycap-bg: oklch(0.92 0.01 260);
  --color-keycap-ink: oklch(0.25 0.02 262);
  --color-keycap-accent: oklch(0.52 0.19 258);
  --color-rule-hairline: oklch(0.85 0.01 260);
  --color-rule-bold: oklch(0.7 0.02 260);
  --color-shadow-1: oklch(0 0 0 / 0.05);
  --color-shadow-2: oklch(0 0 0 / 0.1);
  --color-shadow-3: oklch(0 0 0 / 0.15);
}
```

**Editorial overrides (layered on Cobalt base):**
- `--color-canvas: var(--color-paper)`
- `--color-surface: #ffffff`
- `--color-border: var(--color-rule-hairline)`
- `--color-border-hover: var(--color-rule-bold)`
- `--color-text-primary: var(--color-ink)`
- `--color-text-secondary: var(--color-glyph-2)`
- `--color-text-muted: var(--color-glyph-3)`
- `--accent-primary: var(--color-accent)`

### 4.4 Spacing Geometry (8pt Grid)

```css
:root {
  --space-4xs: 2px;   /* hairline */
  --space-3xs: 4px;   /* 1 */
  --space-2xs: 8px;   /* 2 */
  --space-xs: 12px;   /* 3 */
  --space-sm: 16px;   /* 4 - card padding minimum */
  --space-md: 24px;   /* 6 - component gap */
  --space-lg: 32px;   /* 8 - section gutter */
  --space-xl: 48px;   /* 12 - macro section */
  --space-2xl: 64px;  /* 16 */
  --space-3xl: 96px;  /* 24 */
  --space-4xl: 128px; /* 32 */
  --space-5xl: 192px; /* 48 */
}
```

**Nested radius formula:** `radius_inner = max(0, radius_outer - padding)`
- Card shell: `--radius-card: 2px` (Cobalt spec)
- Card core: `--radius-card-core: 0px` (2px - 2px padding = 0)
- Keycap: `--radius-key: 4px` (Cobalt spec)

### 4.5 Motion Tokens (Emil Kowalski)

```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 120ms;      /* tooltips, small popovers */
  --duration-base: 160ms;      /* button press, hover */
  --duration-standard: 200ms;  /* dropdowns, selects */
  --duration-modal: 250ms;     /* modals, drawers */
  --duration-reveal: 400ms;    /* scroll reveals, enter */
  
  /* Easings - CUSTOM, not built-in */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* UI interactions */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* on-screen movement */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* iOS-like drawers */
  --ease-spring: cubic-bezier(0.34, 1.61, 0.7, 1.3); /* spring feel */
  --ease-linear: linear;                               /* constant motion */
  
  /* Spring presets (for JS animations) */
  --spring-gentle: 100 15 1;    /* stiffness damping mass */
  --spring-standard: 150 18 1;
  --spring-snappy: 200 20 1;
  --spring-bouncy: 180 12 1;    /* bounce ~0.2 */
}
```

**Reduced motion overrides:**
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-standard: 0ms;
    --duration-modal: 0ms;
    --duration-reveal: 0ms;
  }
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 5. Component Specifications

### 5.1 Header (Hallmark: edge-aligned, wordmark + one action)

```html
<header class="site-header" role="banner">
  <div class="header-inner">
    <a href="/" class="wordmark" aria-label="budd home">budd</a>
    <a href="https://github.com/budife" class="keycap-cta" target="_blank" rel="noopener">
      <span class="keycap-cta__label">View Work</span>
      <svg class="keycap-cta__icon" aria-hidden="true"><use href="#icon-external-link"/></svg>
    </a>
  </div>
</header>
```

**States (8-state system):**
- Default: Paper bg, ink text, hairline border bottom
- Hover (CTA): Accent bg, paper text, lift -1px (transform: translateY(-1px))
- Focus-visible: 2px accent ring, offset 2px
- Active: scale(0.97), press depth +1px
- Disabled: N/A (always enabled)

### 5.2 Hero (Stage Hero + Marquee)

```html
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-canvas" aria-hidden="true">
    <canvas id="ambient-canvas"></canvas>
  </div>
  <div class="hero-content">
    <h1 id="hero-title" class="marquee-headline">
      <span class="marquee-inner" aria-hidden="true">Selected Work</span>
      <span class="marquee-inner" aria-hidden="true">Selected Work</span>
    </h1>
  </div>
</section>
```

**Ambient Canvas (pixel-art-web + emil-design-eng):**
- Subtle pixel grain texture (1-2% opacity)
- Slow parallax drift (spring-smoothed mouse position, radius 200px)
- 60fps budget, DPR-capped, respects prefers-reduced-motion (freeze)
- No functional purpose — pure atmosphere

**Marquee Headline:**
- CSS animation: infinite horizontal scroll (linear, 20s loop)
- Duplicate text for seamless loop
- Pauses on hover/focus
- Reduced motion: static

### 5.3 Project Card (Double-Bezel / Workbench)

```html
<article class="project-card card-shell" data-reveal>
  <div class="card-core">
    <header class="card-header">
      <h2 class="card-title">Project Name</h2>
      <span class="card-meta">Updated Jan 2026</span>
    </header>
    <p class="card-desc">One-line description of what this does.</p>
    <ul class="card-tags" aria-label="Technologies">
      <li>TypeScript</li>
      <li>SvelteKit</li>
      <li>Supabase</li>
    </ul>
    <footer class="card-footer">
      <a href="https://github.com/budife/project" class="keycap-cta keycap-cta--card" target="_blank" rel="noopener">
        <span class="keycap-cta__label">View Code</span>
        <svg class="keycap-cta__icon"><use href="#icon-github"/></svg>
      </a>
    </footer>
  </div>
</article>
```

**Double-Bezel Architecture:**
- `.card-shell`: Graphite border (1px), shadow-1, radius 2px, overflow hidden
- `.card-core`: White surface, padding 16px, radius 0px (nested formula)
- Hover: Shell shadow-2, border-bold, core lifts -1px (transform: translateY(-1px))
- Focus-within: Shell ring-2 accent

**Scroll Reveal (clip-path):**
```css
.card-shell[data-reveal] {
  clip-path: inset(0 0 100% 0);
  opacity: 0;
  transition: clip-path var(--duration-reveal) var(--ease-out), opacity var(--duration-reveal) var(--ease-out);
}
.card-shell[data-reveal].is-visible {
  clip-path: inset(0 0 0 0);
  opacity: 1;
}
```

### 5.4 Experiment Card (Cut-Card / Cobalt)

```html
<article class="experiment-card cut-card" data-reveal>
  <div class="cut-card__corner" aria-hidden="true"></div>
  <h3 class="cut-card__title">Experiment Name</h3>
  <p class="cut-card__desc">Brief description.</p>
  <a href="https://github.com/budife/experiment" class="keycap-cta keycap-cta--cut" target="_blank" rel="noopener">
    View
  </a>
</article>
```

**Cut-Corner:** CSS clip-path notch (Cobalt spec), accent accent on hover.

### 5.5 Stats/About Section

```html
<section class="about-stats" aria-labelledby="about-title">
  <div class="about-prose">
    <h2 id="about-title" class="section-title">About</h2>
    <p class="about-bio">Builder. Maker. Shipping things at <a href="https://github.com/budife">github.com/budife</a>.</p>
  </div>
  <dl class="stats-grid" aria-label="Key metrics">
    <div class="stat">
      <dt class="stat-label">Repositories</dt>
      <dd class="stat-value" data-counter="42">0</dd>
    </div>
    <div class="stat">
      <dt class="stat-label">Commits (2026)</dt>
      <dd class="stat-value" data-counter="1247">0</dd>
    </div>
    <div class="stat">
      <dt class="stat-label">Years Active</dt>
      <dd class="stat-value" data-counter="7">0</dd>
    </div>
  </dl>
</section>
```

**Counter Animation:** Spring-based count-up on scroll reveal (IntersectionObserver), ease-out-expo, tabular-nums.

### 5.6 Mast Footer

```html
<footer class="mast-footer" role="contentinfo">
  <p class="footer-copy">© <span data-year></span> budd. Built with Hallmark.</p>
  <nav class="footer-links" aria-label="Footer navigation">
    <a href="https://github.com/budife" target="_blank" rel="noopener">GitHub</a>
    <a href="mailto:budi.indra94@gmail.com">Email</a>
    <a href="/feed.xml">RSS</a>
  </nav>
</footer>
```

---

## 6. Data Schema (Static JSON)

```json
// /data/projects.json
{
  "projects": [
    {
      "id": "ubichee",
      "title": "Ubichee",
      "description": "WooCommerce + Midtrans storefront for Indonesian snacks",
      "tags": ["WordPress", "WooCommerce", "PHP", "Midtrans"],
      "github": "https://github.com/ecaaa-dev/ubichee",
      "live": "https://ubichee.budd.my.id",
      "updated": "2026-11-20",
      "featured": true
    },
    {
      "id": "reqord",
      "title": "Reqord",
      "description": "Google Drive folder scanner for creative requests with Supabase sync",
      "tags": ["Vanilla JS", "Supabase", "Google Drive API", "IndexedDB"],
      "github": "https://github.com/budife/reqord",
      "live": "https://reqord.budd.my.id",
      "updated": "2026-11-16",
      "featured": true
    }
  ],
  "experiments": [
    {
      "id": "pixel-desk",
      "title": "Pixel Desk Workspace",
      "description": "Interactive pixel art desk with draggable items",
      "tags": ["Canvas 2D", "Vanilla JS", "Drag API"],
      "github": "https://github.com/budife/pixel-desk",
      "updated": "2026-11-22"
    }
  ],
  "stats": {
    "repos": 42,
    "commits_2026": 1247,
    "years_active": 7
  }
}
```

---

## 7. Technical Architecture

### 7.1 File Structure

```
/srv/projects/budd/
├── index.html              # Main HTML (inlined critical CSS)
├── assets/
│   ├── tokens.css          # Hallmark Cobalt tokens + Editorial overrides
│   ├── base.css            # Hallmark base + double-bezel, keycaps, utilities
│   ├── style.css           # Page-specific styles (projects, experiments, etc.)
│   ├── script.js           # All JS: ambient canvas, reveals, counters, spring physics
│   └── favicon.svg         # Pixel art favicon
├── data/
│   └── projects.json       # Static project data
├── nginx.conf              # Custom nginx config (gzip, security, Early Hints)
└── docker-compose.yml      # (optional, for local dev)
```

### 7.2 CSS Load Strategy (Performance)

1. **Critical CSS inlined** in `<style>` block (~3KB): tokens, reset, header, hero, keycaps, field frame
2. **Non-critical CSS preloaded** via `<link rel="preload" as="style" media="print" onload="this.media='all'">`
3. **Fonts preloaded** with `font-display: optional` WOFF2 links
4. **JS deferred** in `<head>` with `defer`

### 7.3 JS Architecture

```javascript
// script.js modules (IIFE or ES modules)
const App = {
  // 1. AmbientCanvas - hero background (spring mouse parallax, grain, drift)
  // 2. ScrollReveal - IntersectionObserver + clip-path + @starting-style
  // 3. CounterAnimator - spring count-up on reveal
  // 4. SpringPhysics - interruptible spring (stiffness, damping, mass)
  // 5. MagneticKeycap - hover lift, press depth, icon translate
  // 6. DataLoader - fetch projects.json, hydrate grids
  // 7. YearUpdater - current year in footer
}
```

**Spring Physics (Emil Kowalski):**
- Apple-style: `{ duration: 0.5, bounce: 0.2 }` for UI
- `{ stiffness: 150, damping: 18, mass: 1 }` for mouse parallax
- Interruptible, maintains velocity

**Performance:**
- `requestIdleCallback` for non-critical DOM
- `DocumentFragment` batching
- Cached RGB arrays for canvas
- `visibilitychange` pause

---

## 8. Acceptance Criteria (7-Axis Gate)

### Axis 1: Anti-Slop Purity (≥4)
- [ ] Zero purple/indigo radial gradients
- [ ] Zero raw emojis as icons (all SVG)
- [ ] Zero single-word italicized headlines
- [ ] Zero fake vanity stats
- [ ] Zero 3-card identical grids

### Axis 2: UX Speed & 1-to-3 (≥4)
- [ ] 1 clear primary CTA per section (GitHub link)
- [ ] Max 3 secondary actions per card
- [ ] Global filters unified (none needed for portfolio)
- [ ] Zero duplicated metrics

### Axis 3: Typographic Discipline (≥4)
- [ ] Max 2 font families (Playfair + Newsreader/Inter + JetBrains Mono = 3 but mono is data-only)
- [ ] `font-variant-numeric: tabular-nums` on all metrics
- [ ] Body line length ≤ 75ch
- [ ] Sentence case labels, no ALL CAPS screaming

### Axis 4: Spacing & Geometry (≥4)
- [ ] Strict 8pt grid (all spacing from --space-* tokens)
- [ ] Nested radius formula respected
- [ ] Min 16px card padding
- [ ] Optical icon-text alignment (gap-1.5 to gap-2)

### Axis 5: Micro-Interactions (≥4)
- [ ] UI transitions < 200ms
- [ ] High-frequency actions (none in portfolio) = 0ms
- [ ] `:active { transform: scale(0.97) }` on all pressables
- [ ] No `ease-in` curves

### Axis 6: Accessibility (≥4)
- [ ] Visible `:focus-visible` rings on all interactive
- [ ] No `outline: none` without replacement
- [ ] Icon-only buttons have `aria-label`
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`

### Axis 7: Mobile Linearity (≥4)
- [ ] Clean vertical stack on < 640px
- [ ] Zero horizontal overflow (`overflow-x: clip` on body)
- [ ] Min 44x44px touch targets
- [ ] Stats grid stacks to single column

---

## 9. Implementation Phases

### Phase 1: Foundation (Tokens + Base + HTML Shell)
- [ ] Write `assets/tokens.css` (Cobalt exact + Editorial overrides)
- [ ] Write `assets/base.css` (Hallmark base + double-bezel, keycaps, utilities)
- [ ] Write `index.html` (semantic structure, inlined critical CSS, preload hints)
- [ ] Write `assets/favicon.svg` (pixel art)
- [ ] Verify: loads, tokens apply, no console errors

### Phase 2: Components + Data
- [ ] Write `data/projects.json`
- [ ] Write `assets/style.css` (page-specific: hero, projects grid, experiments, about, footer)
- [ ] Write `assets/script.js` (DataLoader, hydrate grids)
- [ ] Verify: projects render, links work, responsive

### Phase 3: Motion + Polish
- [ ] Implement `AmbientCanvas` (grain, drift, spring mouse parallax)
- [ ] Implement `ScrollReveal` (IntersectionObserver, clip-path, @starting-style)
- [ ] Implement `CounterAnimator` (spring count-up)
- [ ] Implement `MagneticKeycap` (hover lift, press, icon translate)
- [ ] Implement `SpringPhysics` class
- [ ] Verify: 60fps, reduced-motion works, no jank

### Phase 4: Performance + Deploy
- [ ] Optimize critical CSS inlining (measure ~3KB)
- [ ] Add font preloads with `font-display: optional`
- [ ] Update `nginx.conf` (gzip 6, Early Hints, security headers)
- [ ] Docker rebuild + restart
- [ ] Verify: HTTPS/HTTP2, all assets load, Lighthouse ≥ 90

### Phase 5: Quality Gate + Ship
- [ ] Run 7-Axis self-review (this PRD Section 8)
- [ ] Fix any axis < 4
- [ ] Git commit + force-push to `budife/budd`
- [ ] Verify live at https://budd.my.id

---

## 10. Review Focus (Uncovered Failure Modes)

| Input/Condition | Expected Behavior | Test Location |
|-----------------|-------------------|---------------|
| `prefers-reduced-motion: reduce` | All transform animations disabled; opacity/color transitions kept; ambient canvas frozen | Phase 3 verify |
| Mobile viewport < 480px | Single-column stack, no horizontal scroll, 44x44 touch targets | Phase 2 verify |
| Tab navigation | Visible focus ring on every interactive element, logical order | Phase 5 review |
| Slow network (3G) | Critical CSS renders hero/header immediately; non-critical loads async | Phase 4 Lighthouse |
| Missing `projects.json` | Graceful fallback: empty grids with "No projects yet" message | Phase 2 error handling |
| High DPR (2x, 3x) | Canvas DPR-capped, fonts sharp, no blurry assets | Phase 3 verify |
| Keyboard-only user | All functionality accessible via Tab/Enter/Space, no mouse-only interactions | Phase 5 review |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hallmark Cobalt tokens drift from spec | Low | High | Copy exact values from Hallmark reference; validate in browser |
| Spring physics jank on low-end mobile | Medium | Medium | Frame budget guard (16.67ms), `requestIdleCallback`, reduce particle count |
| Font loading flash (FOUT) | Medium | Low | `font-display: optional`, preload WOFF2, system font fallback stack |
| NPM proxy config conflict | Low | High | Backup config #4 before changes; test staging first |
| GitHub API rate limit (if used later) | N/A | N/A | Use static JSON for v1; add caching later |

---

## 12. Sign-Off

**Designer/Engineer:** Hermes Agent (all skills applied)
**Approver:** budd (user)
**Approval:** "Plan captures what I want. Proceed with implementation."

---

*This PRD implements the Hallmark Cobalt design system with Editorial archetype, using brainstorming, writing-plans, hallmark, high-end-visual-design, pixel-art-web, emil-design-eng, anti-ui-slop, and anti-slop-design skills.*
