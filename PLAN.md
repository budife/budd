# Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Hallmark Cobalt-compliant Editorial portfolio site at budd.my.id with real project data, double-bezel cards, spring physics, clip-path reveals, and 7-Axis Quality Gate pass.

**Architecture:** Static HTML/CSS/JS served by nginx:alpine on Maple VPS port 8087, proxied via NPM config #4 to budd.my.id. Hallmark Cobalt tokens as CSS custom properties, Editorial archetype typography (Playfair Display + Newsreader/Inter + JetBrains Mono), double-bezel card architecture, spring-based interactions.

**Tech Stack:** HTML5, CSS (custom properties, clip-path, @starting-style, prefers-reduced-motion), Vanilla ES2020+ JS (IntersectionObserver, requestAnimationFrame, Spring physics), nginx:alpine, Docker.

**Spec:** /srv/projects/budd/PRD.md

---

## Global Constraints
- Hallmark Cobalt exact OKLCH tokens (paper 98.6% 0.005 250, ink 21% 0.028 262, accent 52% 0.19 258)
- No `transition: all`, no `ease-in`, no purple/indigo gradients, no raw emojis
- All interactive: 8-state feedback (default, hover, focus-visible, active, disabled, loading, error, success)
- `prefers-reduced-motion`: disable transforms, keep opacity/color
- 8pt spacing grid (--space-* tokens), nested radius formula
- Critical CSS inlined (~3KB), non-critical preloaded, fonts preloaded with font-display: optional
- Semantic HTML5, ARIA labels, WCAG 2.1 AA
- Mobile-first, no horizontal overflow, 44x44 touch targets

---

## Review Focus
1. **Reduced motion**: All transform animations disabled, canvas frozen, opacity transitions kept
2. **Mobile < 480px**: Single-column stack, no horizontal scroll, 44x44 touch targets
3. **Keyboard navigation**: Visible focus ring on every interactive, logical tab order
4. **Slow network**: Critical CSS renders hero/header immediately
5. **Missing data**: Graceful empty state for projects/experiments grids
6. **High DPR**: Canvas DPR-capped, fonts sharp
7. **Keyboard-only**: All functionality via Tab/Enter/Space

---

### Task 1: Tokens & Base CSS

**Files:**
- Create: `/srv/projects/budd/assets/tokens.css`
- Create: `/srv/projects/budd/assets/base.css`

**Interfaces:**
- Produces: All CSS custom properties (--color-*, --space-*, --radius-*, --duration-*, --ease-*, --font-*)

- [ ] **Step 1: Write tokens.css (Cobalt exact + Editorial overrides)**
```css
/* Hallmark Cobalt exact OKLCH tokens */
:root {
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
  
  /* Editorial semantic aliases */
  --color-canvas: var(--color-paper);
  --color-surface: #ffffff;
  --color-border: var(--color-rule-hairline);
  --color-border-hover: var(--color-rule-bold);
  --color-text-primary: var(--color-ink);
  --color-text-secondary: var(--color-glyph-2);
  --color-text-muted: var(--color-glyph-3);
  --accent-primary: var(--color-accent);
  
  /* Spacing 8pt grid */
  --space-4xs: 2px; --space-3xs: 4px; --space-2xs: 8px; --space-xs: 12px;
  --space-sm: 16px; --space-md: 24px; --space-lg: 32px; --space-xl: 48px;
  --space-2xl: 64px; --space-3xl: 96px; --space-4xl: 128px; --space-5xl: 192px;
  
  /* Radii */
  --radius-card: 2px;
  --radius-card-core: 0px;
  --radius-key: 4px;
  
  /* Durations */
  --duration-instant: 0ms; --duration-fast: 120ms; --duration-base: 160ms;
  --duration-standard: 200ms; --duration-modal: 250ms; --duration-reveal: 400ms;
  
  /* Custom easings (Emil Kowalski) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-spring: cubic-bezier(0.34, 1.61, 0.7, 1.3);
  --ease-linear: linear;
  
  /* Font stacks */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Newsreader', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-ui: var(--font-mono);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms; --duration-base: 0ms; --duration-standard: 0ms;
    --duration-modal: 0ms; --duration-reveal: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write base.css (Hallmark base + double-bezel, keycaps, utilities)**
```css
/* Hallmark base reset + components */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; }
body {
  margin: 0; min-height: 100vh;
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  line-height: 1.7;
  color: var(--color-text-primary);
  background: var(--color-canvas);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; line-height: 1.1; color: var(--color-text-primary); }
h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: -0.03em; }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); letter-spacing: -0.02em; }
h3 { font-size: clamp(1.125rem, 2vw, 1.375rem); letter-spacing: -0.01em; }
code, kbd, samp, pre { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
a { color: var(--accent-primary); text-decoration: none; transition: color var(--duration-base) var(--ease-out); }
a:hover { color: var(--color-ink); }
:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
.skip-link { position: absolute; top: -100%; left: var(--space-sm); padding: var(--space-xs) var(--space-sm); background: var(--color-ink); color: var(--color-paper); border-radius: var(--radius-key); z-index: 10000; }
.skip-link:focus { top: var(--space-sm); }

/* Double-bezel card architecture */
.card-shell {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: 0 1px 3px var(--color-shadow-1), 0 1px 2px var(--color-shadow-1);
  overflow: hidden;
  transition: box-shadow var(--duration-standard) var(--ease-out), border-color var(--duration-standard) var(--ease-out), transform var(--duration-base) var(--ease-out);
}
.card-shell:hover {
  box-shadow: 0 4px 12px var(--color-shadow-2), 0 2px 4px var(--color-shadow-2);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}
.card-shell:focus-within {
  box-shadow: 0 0 0 2px var(--accent-primary);
}
.card-core {
  padding: var(--space-sm);
  border-radius: var(--radius-card-core);
}

/* Nested CTA keycap (Hallmark Cobalt .key/.key--primary) */
.keycap-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-3xs);
  padding: var(--space-3xs) var(--space-xs);
  font-family: var(--font-ui); font-size: 0.75rem; font-weight: 500; line-height: 1;
  background: var(--color-keycap-bg); color: var(--color-keycap-ink);
  border: 1px solid var(--color-border); border-radius: var(--radius-key);
  cursor: pointer; user-select: none;
  transition: background var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out), transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-base) var(--ease-out);
  will-change: transform, box-shadow;
}
.keycap-cta__icon { display: inline-block; width: 1em; height: 1em; transition: transform var(--duration-base) var(--ease-out); }
.keycap-cta:hover { background: var(--accent-primary); color: var(--color-paper); border-color: var(--accent-primary); transform: translateY(-1px); box-shadow: 0 4px 12px oklch(0.52 0.19 258 / 0.3); }
.keycap-cta:hover .keycap-cta__icon { transform: translateX(2px); }
.keycap-cta:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
.keycap-cta:active { transform: scale(0.97) translateY(1px); box-shadow: none; }
.keycap-cta--primary { background: var(--accent-primary); color: var(--color-paper); border-color: var(--accent-primary); }
.keycap-cta--primary:hover { background: var(--color-ink); border-color: var(--color-ink); }

/* Cut-corner (Cobalt .cut-card) */
.cut-card { position: relative; border-radius: var(--radius-card); overflow: hidden; }
.cut-card::before { content: ''; position: absolute; top: 0; right: 0; width: 24px; height: 24px; background: linear-gradient(135deg, transparent 50%, var(--accent-primary) 50%); clip-path: polygon(100% 0, 100% 100%, 0 100%); opacity: 0; transition: opacity var(--duration-standard) var(--ease-out); }
.cut-card:hover::before { opacity: 1; }

/* Graphite panel (Cobalt) */
.graphite-panel { background: var(--color-graphite); color: var(--color-paper); border-radius: var(--radius-card); padding: var(--space-md); }

/* Hairline rules */
.rule-hairline { border-top: 1px solid var(--color-rule-hairline); }
.rule-bold { border-top: 2px solid var(--color-rule-bold); }

/* Container */
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 var(--space-md); }
.section { padding: var(--space-3xl) 0; }

/* Reveal utilities */
.reveal { clip-path: inset(0 0 100% 0); opacity: 0; transition: clip-path var(--duration-reveal) var(--ease-out), opacity var(--duration-reveal) var(--ease-out); }
.reveal.is-visible { clip-path: inset(0 0 0 0); opacity: 1; }

/* Hardware acceleration hints */
.gpu { will-change: transform; backface-visibility: hidden; transform: translateZ(0); }
```

- [ ] **Step 3: Verify tokens apply**
Run: Open `/srv/projects/budd/index.html` (minimal shell) in browser, check computed styles match tokens.
Expected: No console errors, colors match Cobalt spec.

- [ ] **Step 4: Commit**
```bash
git -C /srv/projects/budd add assets/tokens.css assets/base.css
git -C /srv/projects/budd commit -m "feat: Hallmark Cobalt tokens + base components (double-bezel, keycaps, cut-card)"
```

---

### Task 2: HTML Shell + Critical CSS + Data

**Files:**
- Create: `/srv/projects/budd/index.html`
- Create: `/srv/projects/budd/data/projects.json`
- Modify: `/srv/projects/budd/assets/style.css` (page-specific)

**Interfaces:**
- Consumes: tokens.css, base.css (via @import or link)
- Produces: Semantic HTML structure, project data JSON

- [ ] **Step 1: Write data/projects.json**
```json
{
  "projects": [
    {"id":"ubichee","title":"Ubichee","description":"WooCommerce + Midtrans storefront for Indonesian snacks","tags":["WordPress","WooCommerce","PHP","Midtrans"],"github":"https://github.com/ecaaa-dev/ubichee","live":"https://ubichee.budd.my.id","updated":"2026-11-20","featured":true},
    {"id":"reqord","title":"Reqord","description":"Google Drive folder scanner for creative requests with Supabase sync","tags":["Vanilla JS","Supabase","Google Drive API","IndexedDB"],"github":"https://github.com/budife/reqord","live":"https://reqord.budd.my.id","updated":"2026-11-16","featured":true},
    {"id":"easy-absen","title":"Easy Absen","description":"Client-side attendance tracker with SheetJS export, no backend","tags":["Vanilla JS","SheetJS","localStorage","GitHub Pages"],"github":"https://github.com/budife/easy-absen","live":"https://budd.my.id/easy-absen","updated":"2026-11-10","featured":true}
  ],
  "experiments": [
    {"id":"pixel-desk","title":"Pixel Desk Workspace","description":"Interactive pixel art desk with draggable items","tags":["Canvas 2D","Vanilla JS","Drag API"],"github":"https://github.com/budife/pixel-desk","updated":"2026-11-22"},
    {"id":"ascii-field","title":"ASCII Field Canvas","description":"16x40 glyph field with spring mouse lens","tags":["Canvas 2D","Spring Physics","WAAPI"],"github":"https://github.com/budife/ascii-field","updated":"2026-11-22"}
  ],
  "stats": {"repos": 42, "commits_2026": 1247, "years_active": 7}
}
```

- [ ] **Step 2: Write index.html (semantic, inlined critical CSS, preload hints)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="budd — selected work and experiments by budife">
  <title>budd</title>
  
  <!-- Preconnect fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Font preloads with font-display: optional -->
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtUA.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/newsreader/v12/2sDcZG1Wl4xPprVtVgQ5.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/jetbrainsmono/v23/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKg.woff2">
  
  <!-- Critical CSS inlined (~3KB) -->
  <style>
    /* === CRITICAL CSS: tokens, reset, header, hero, keycaps, field frame === */
    :root{--color-paper:oklch(0.986 0.005 250);--color-ink:oklch(0.21 0.028 262);--color-accent:oklch(0.52 0.19 258);--color-graphite:oklch(0.18 0.02 260);--color-glyph-1:oklch(0.35 0.02 262);--color-glyph-2:oklch(0.5 0.02 262);--color-glyph-3:oklch(0.65 0.02 262);--color-glyph-4:oklch(0.8 0.02 262);--color-keycap-bg:oklch(0.92 0.01 260);--color-keycap-ink:oklch(0.25 0.02 262);--color-keycap-accent:oklch(0.52 0.19 258);--color-rule-hairline:oklch(0.85 0.01 260);--color-rule-bold:oklch(0.7 0.02 260);--color-shadow-1:oklch(0 0 0/0.05);--color-shadow-2:oklch(0 0 0/0.1);--color-shadow-3:oklch(0 0 0/0.15);--color-canvas:var(--color-paper);--color-surface:#fff;--color-border:var(--color-rule-hairline);--color-border-hover:var(--color-rule-bold);--color-text-primary:var(--color-ink);--color-text-secondary:var(--color-glyph-2);--color-text-muted:var(--color-glyph-3);--accent-primary:var(--color-accent);--space-3xs:4px;--space-2xs:8px;--space-xs:12px;--space-sm:16px;--space-md:24px;--space-lg:32px;--space-xl:48px;--space-2xl:64px;--space-3xl:96px;--radius-card:2px;--radius-key:4px;--duration-base:160ms;--duration-standard:200ms;--duration-reveal:400ms;--ease-out:cubic-bezier(.23,1,.32,1);--font-display:'Playfair Display',Georgia,serif;--font-body:'Newsreader','Inter',system-ui,sans-serif;--font-mono:'JetBrains Mono','Fira Code',monospace;--font-ui:var(--font-mono)}@media(prefers-reduced-motion:reduce){:root{--duration-base:0ms;--duration-standard:0ms;--duration-reveal:0ms}*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;tab-size:4}body{margin:0;min-height:100vh;font-family:var(--font-body);font-size:clamp(1rem,1.5vw,1.125rem);line-height:1.7;color:var(--color-text-primary);background:var(--color-canvas);-webkit-font-smoothing:antialiased;overflow-x:clip}h1,h2,h3{font-family:var(--font-display);font-weight:600;line-height:1.1;color:var(--color-text-primary)}h1{font-size:clamp(2.5rem,6vw,4.5rem);letter-spacing:-.03em}h2{font-size:clamp(1.75rem,4vw,2.5rem);letter-spacing:-.02em}a{color:var(--accent-primary);text-decoration:none;transition:color var(--duration-base) var(--ease-out)}:focus-visible{outline:2px solid var(--accent-primary);outline-offset:2px}.skip-link{position:absolute;top:-100%;left:var(--space-sm);padding:var(--space-xs) var(--space-sm);background:var(--color-ink);color:var(--color-paper);border-radius:var(--radius-key);z-index:10000}.skip-link:focus{top:var(--space-sm)}.site-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--color-border)}.wordmark{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.5rem);font-weight:600;letter-spacing:-.02em;color:var(--color-text-primary);text-decoration:none}.keycap-cta{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-3xs);padding:var(--space-3xs) var(--space-xs);font-family:var(--font-ui);font-size:.75rem;font-weight:500;line-height:1;background:var(--color-keycap-bg);color:var(--color-keycap-ink);border:1px solid var(--color-border);border-radius:var(--radius-key);cursor:pointer;user-select:none;transition:background var(--duration-base) var(--ease-out),color var(--duration-base) var(--ease-out),border-color var(--duration-base) var(--ease-out),transform var(--duration-fast) var(--ease-out),box-shadow var(--duration-base) var(--ease-out);will-change:transform,box-shadow}.keycap-cta__icon{display:inline-block;width:1em;height:1em;transition:transform var(--duration-base) var(--ease-out)}.keycap-cta:hover{background:var(--accent-primary);color:var(--color-paper);border-color:var(--accent-primary);transform:translateY(-1px);box-shadow:0 4px 12px oklch(0.52 0.19 258/.3)}.keycap-cta:hover .keycap-cta__icon{transform:translateX(2px)}.keycap-cta:focus-visible{outline:2px solid var(--accent-primary);outline-offset:2px}.keycap-cta:active{transform:scale(.97) translateY(1px);box-shadow:none}.hero{position:relative;min-height:60vh;display:flex;align-items:center;overflow:hidden}.hero-canvas{position:absolute;inset:0;z-index:0}.hero-content{position:relative;z-index:1;width:100%;max-width:1200px;margin:0 auto;padding:0 var(--space-lg)}.marquee-headline{display:flex;overflow:hidden;white-space:nowrap}.marquee-inner{display:flex;align-items:center;padding-right:var(--space-3xl);animation:marquee 20s linear infinite}.marquee-inner:hover,.marquee-inner:focus{animation-play-state:paused}@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.marquee-inner{animation:none}}
  </style>
  
  <!-- Non-critical CSS preload -->
  <link rel="preload" as="style" href="assets/tokens.css" media="print" onload="this.media='all'">
  <link rel="preload" as="style" href="assets/base.css" media="print" onload="this.media='all'">
  <link rel="preload" as="style" href="assets/style.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="assets/tokens.css"><link rel="stylesheet" href="assets/base.css"><link rel="stylesheet" href="assets/style.css"></noscript>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  
  <!-- Deferred JS -->
  <script defer src="assets/script.js"></script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header class="site-header" role="banner">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
      <a href="/" class="wordmark" aria-label="budd home">budd</a>
      <a href="https://github.com/budife" class="keycap-cta keycap-cta--primary" target="_blank" rel="noopener" aria-label="View work on GitHub">
        <span class="keycap-cta__label">View Work</span>
        <svg class="keycap-cta__icon" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
      </a>
    </div>
  </header>
  
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-canvas" aria-hidden="true">
        <canvas id="ambient-canvas"></canvas>
      </div>
      <div class="hero-content">
        <h1 id="hero-title" class="marquee-headline" aria-hidden="true">
          <span class="marquee-inner">Selected Work</span>
          <span class="marquee-inner">Selected Work</span>
        </h1>
      </div>
    </section>
    
    <section class="section projects" aria-labelledby="projects-title">
      <div class="container">
        <header class="section-header">
          <h2 id="projects-title" class="section-title">Projects</h2>
          <p class="section-desc">Production work and shipped products.</p>
        </header>
        <div class="projects-grid" id="projects-grid" role="list"></div>
      </div>
    </section>
    
    <section class="section experiments" aria-labelledby="experiments-title">
      <div class="container">
        <header class="section-header">
          <h2 id="experiments-title" class="section-title">Experiments</h2>
          <p class="section-desc">Playground prototypes and side quests.</p>
        </header>
        <div class="experiments-grid" id="experiments-grid" role="list"></div>
      </div>
    </section>
    
    <section class="section about-stats" aria-labelledby="about-title">
      <div class="container">
        <div class="about-stats-grid">
          <div class="about-prose">
            <h2 id="about-title" class="section-title">About</h2>
            <p class="about-bio">Builder. Maker. Shipping things at <a href="https://github.com/budife">github.com/budife</a> since 2019.</p>
          </div>
          <dl class="stats-grid" aria-label="Key metrics">
            <div class="stat"><dt class="stat-label">Repositories</dt><dd class="stat-value" data-counter="42">0</dd></div>
            <div class="stat"><dt class="stat-label">Commits (2026)</dt><dd class="stat-value" data-counter="1247">0</dd></div>
            <div class="stat"><dt class="stat-label">Years Active</dt><dd class="stat-value" data-counter="7">0</dd></div>
          </dl>
        </div>
      </div>
    </section>
  </main>
  
  <footer class="mast-footer" role="contentinfo">
    <div class="container">
      <p class="footer-copy">© <span data-year></span> budd. Built with <a href="https://www.usehallmark.com">Hallmark</a>.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="https://github.com/budife" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:budi.indra94@gmail.com">Email</a>
      </nav>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Write assets/style.css (page-specific styles)**
```css
/* Page-specific styles: hero, projects grid, experiments, about, footer */

/* Section header */
.section-header { margin-bottom: var(--space-xl); }
.section-title { margin: 0 0 var(--space-xs); }
.section-desc { margin: 0; color: var(--color-text-secondary); font-size: clamp(1rem, 1.5vw, 1.125rem); }

/* Hero ambient canvas */
.hero-canvas { position: absolute; inset: 0; z-index: 0; }
#ambient-canvas { display: block; width: 100%; height: 100%; }

/* Projects grid (bento/asymmetric) */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-md);
}
@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1.5fr 1fr;
    grid-auto-rows: 360px;
  }
  .project-card:nth-child(1) { grid-row: span 2; }
  .project-card:nth-child(2) { grid-column: 2; }
  .project-card:nth-child(3) { grid-column: 2; }
}

/* Project card */
.project-card { display: flex; flex-direction: column; }
.card-header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); margin-bottom: var(--space-xs); flex-wrap: wrap; }
.card-title { margin: 0; font-size: clamp(1.125rem, 2vw, 1.375rem); }
.card-meta { font-size: 0.8125rem; color: var(--color-text-muted); font-family: var(--font-mono); white-space: nowrap; }
.card-desc { margin: 0 0 var(--space-sm); color: var(--color-text-secondary); line-height: 1.6; }
.card-tags { display: flex; flex-wrap: wrap; gap: var(--space-3xs); margin: 0 0 var(--space-md); padding: 0; list-style: none; }
.card-tags li { font-size: 0.75rem; font-family: var(--font-mono); padding: var(--space-4xs) var(--space-2xs); background: var(--color-canvas); border: 1px solid var(--color-border); border-radius: var(--radius-key); color: var(--color-text-secondary); }
.card-footer { margin-top: auto; padding-top: var(--space-sm); border-top: 1px solid var(--color-border); }

/* Experiments grid (cut-cards) */
.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}
.experiment-card { padding: var(--space-md); }
.cut-card__title { margin: 0 0 var(--space-xs); font-size: clamp(1rem, 1.5vw, 1.125rem); }
.cut-card__desc { margin: 0 0 var(--space-md); color: var(--color-text-secondary); font-size: 0.875rem; line-height: 1.6; }
.cut-card .keycap-cta { padding: var(--space-3xs) var(--space-xs); font-size: 0.6875rem; }

/* About/Stats */
.about-stats-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-3xl); align-items: start; }
@media (max-width: 768px) { .about-stats-grid { grid-template-columns: 1fr; } }
.about-bio { margin: 0; color: var(--color-text-secondary); line-height: 1.8; }
.about-bio a { font-weight: 500; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin: 0; padding: 0; list-style: none; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
.stat { text-align: center; }
.stat-label { display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2xs); }
.stat-value { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.1; color: var(--color-text-primary); font-variant-numeric: tabular-nums; }

/* Mast footer */
.mast-footer { padding: var(--space-3xl) 0; border-top: 1px solid var(--color-border); background: var(--color-surface); }
.mast-footer .container { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md); }
.footer-copy { margin: 0; font-size: 0.8125rem; color: var(--color-text-muted); }
.footer-copy a { color: var(--color-text-muted); }
.footer-copy a:hover { color: var(--accent-primary); }
.footer-links { display: flex; gap: var(--space-lg); }
.footer-links a { font-size: 0.8125rem; color: var(--color-text-secondary); transition: color var(--duration-base) var(--ease-out); }
.footer-links a:hover { color: var(--accent-primary); }

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  .marquee-inner { animation: none; }
  .reveal { clip-path: inset(0 0 0 0); opacity: 1; transition: none; }
}
```

- [ ] **Step 4: Verify HTML structure**
Run: Open in browser, check semantic HTML, no console errors, projects grid renders empty (data not loaded yet).
Expected: Header, hero, projects section, experiments section, about/stats, footer all present.

- [ ] **Step 5: Commit**
```bash
git -C /srv/projects/budd add index.html data/projects.json assets/style.css
git -C /srv/projects/budd commit -m "feat: HTML shell, critical CSS, project data, page styles"
```

---

### Task 3: JavaScript - Data Loading + Hydration

**Files:**
- Create: `/srv/projects/budd/assets/script.js`

**Interfaces:**
- Consumes: `data/projects.json`, DOM elements (#projects-grid, #experiments-grid, .stat-value[data-counter], [data-year])
- Produces: Hydrated project cards, experiment cards, animated counters, current year

- [ ] **Step 1: Write script.js (DataLoader + hydration)**
```javascript
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
      if (dt > 0.1) dt = 0.1; // frame budget guard
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
          ${project.tags.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
        <footer class="card-footer">
          <a href="${escapeHtml(project.github)}" class="keycap-cta" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.title)} on GitHub">
            <span class="keycap-cta__label">View Code</span>
            <svg class="keycap-cta__icon" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          ${project.live ? `<a href="${escapeHtml(project.live)}" class="keycap-cta" target="_blank" rel="noopener" aria-label="View live demo"><span class="keycap-cta__label">Live</span></a>` : ''}
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
      <a href="${escapeHtml(exp.github)}" class="keycap-cta keycap-cta--cut" target="_blank" rel="noopener" aria-label="View ${escapeHtml(exp.title)} on GitHub">
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
    return String(str).replace(/[&<>"']/g, s => ({'&':'&','<':'<','>':'>','"':'"',"'":'''}[s]));
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
```

- [ ] **Step 2: Verify hydration**
Run: Open in browser, check projects/experiments render, links work, counters show 0 (animation not yet), year shows current.
Expected: No console errors, all cards present, GitHub links correct.

- [ ] **Step 3: Commit**
```bash
git -C /srv/projects/budd add assets/script.js
git -C /srv/projects/budd commit -m "feat: JS data loader, project/experiment hydration, Spring class"
```

---

### Task 4: Ambient Canvas + Scroll Reveal + Counter Animation

**Files:**
- Modify: `/srv/projects/budd/assets/script.js` (append modules)

**Interfaces:**
- Consumes: #ambient-canvas, .reveal elements, [data-counter] elements
- Produces: Animated ambient canvas, clip-path scroll reveals, spring count-up counters

- [ ] **Step 1: Append AmbientCanvas module to script.js**
```javascript
// ----- Ambient Canvas (Hero background) -----
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
      data[i+3] = 15; // ~6% opacity
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
    
    // Spring-smoothed mouse follow
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
    
    // Clear
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Subtle grain (regenerate every 8 frames for organic feel)
    this.noiseFrame++;
    if (this.noiseFrame % 8 === 0) this.generateNoise();
    ctx.putImageData(this.noiseCache, 0, 0);
    
    // Slow drift gradient (mouse-influenced)
    const gx = w * 0.5 + (this.mouse.x - 0.5) * w * 0.15;
    const gy = h * 0.5 + (this.mouse.y - 0.5) * h * 0.15;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.7);
    grad.addColorStop(0, 'oklch(0.986 0.005 250 / 0)');
    grad.addColorStop(1, 'oklch(0.986 0.005 250 / 0.03)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    // Very subtle floating particles (3-4 max)
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
    // Single frame for reduced motion
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
```

- [ ] **Step 2: Append ScrollReveal module to script.js**
```javascript
// ----- Scroll Reveal (IntersectionObserver + clip-path + @starting-style) -----
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
      el.style.transitionDelay = `${i * 60}ms`; // stagger 60ms
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
```

- [ ] **Step 3: Append CounterAnimator module to script.js**
```javascript
// ----- Counter Animator (Spring count-up) -----
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
    
    const duration = 1200; // ms
    const start = performance.now();
    
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out expo for counter feel
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
```

- [ ] **Step 4: Verify all modules work**
Run: Open in browser, check:
- Ambient canvas renders grain + subtle drift + mouse parallax
- Scroll reveals trigger on projects/experiments cards (staggered)
- Counters animate on scroll into view
- Reduced motion: canvas static, reveals instant, counters instant
Expected: 60fps, no console errors, all animations smooth.

- [ ] **Step 5: Commit**
```bash
git -C /srv/projects/budd add assets/script.js
git -C /srv/projects/budd commit -m "feat: AmbientCanvas, ScrollReveal, CounterAnimator modules"
```

---

### Task 5: Favicon + Nginx Config + Deploy

**Files:**
- Create: `/srv/projects/budd/assets/favicon.svg`
- Create: `/srv/projects/budd/nginx.conf`

**Interfaces:**
- Consumes: None (static assets)
- Produces: Favicon, nginx config for production

- [ ] **Step 1: Write favicon.svg (pixel art 'b' - pixel-art-web skill)**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <!-- Canvas background: paper -->
  <rect width="32" height="32" fill="oklch(0.986 0.005 250)"/>
  <!-- Subtle border -->
  <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="oklch(0.85 0.01 260)" stroke-width="1"/>
  <!-- Letter 'b' in Playfair Display style (simplified pixel) -->
  <text x="16" y="22" font-family="Georgia, serif" font-size="18" font-weight="600" fill="oklch(0.52 0.19 258)" text-anchor="middle" dominant-baseline="middle">b</text>
</svg>
```

- [ ] **Step 2: Write nginx.conf (production hardening)**
```nginx
# budd.my.id — nginx config for static portfolio
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self';" always;
    
    # HSTS (handled by NPM SSL termination, but keep for defense)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 512;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 6;
    
    # Static assets: long-term immutable cache
    location ~* \.(css|js|svg|woff2?|png|jpg|jpeg|gif|webp|avif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
    }
    
    # HTML: short cache, must-revalidate
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "public, must-revalidate";
        add_header Vary "Accept-Encoding";
    }
    
    # Early Hints (103) via Link headers
    location = /index.html {
        add_header Link "<https://fonts.googleapis.com>; rel=preconnect; crossorigin" always;
        add_header Link "<https://fonts.gstatic.com>; rel=preconnect; crossorigin" always;
        add_header Link "<assets/tokens.css>; rel=preload; as=style" always;
        add_header Link "<assets/base.css>; rel=preload; as=style" always;
        add_header Link "<assets/style.css>; rel=preload; as=style" always;
        add_header Link "<assets/script.js>; rel=preload; as=script" always;
    }
    
    # SPA fallback (not needed for static, but safe)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- [ ] **Step 3: Deploy to VPS**
```bash
# Stop old container
docker stop budd 2>/dev/null; docker rm budd 2>/dev/null

# Run new container with custom nginx.conf
docker run -d --name budd --restart unless-stopped   -p 0.0.0.0:8087:80   -v /srv/projects/budd:/usr/share/nginx/html:ro   -v /srv/projects/budd/nginx.conf:/etc/nginx/conf.d/default.conf:ro   nginx:alpine

# Reload NPM
docker exec npm nginx -s reload
```

- [ ] **Step 4: Verify live**
Run: `curl -I https://budd.my.id` and open in browser.
Expected: HTTP/2 200, all assets load, security headers present, gzip working.

- [ ] **Step 5: Commit + Push**
```bash
git -C /srv/projects/budd add assets/favicon.svg nginx.conf
git -C /srv/projects/budd commit -m "feat: favicon, nginx config, deploy"
git -C /srv/projects/budd push -f origin main
```

---

### Task 6: 7-Axis Quality Gate Review + Final Polish

**Files:**
- Review: All files in `/srv/projects/budd/`

**Interfaces:**
- Consumes: Complete implementation
- Produces: Pass/fail on each axis, fix list

- [ ] **Step 1: Axis 1 - Anti-Slop Purity**
Check: No purple gradients, no raw emojis, no fake stats, no italicized single words, no 3-card identical grids.
Fix: Any violations → patch immediately.

- [ ] **Step 2: Axis 2 - UX Speed & 1-to-3**
Check: 1 primary CTA per section, max 3 secondary, no duplicate metrics, unified filters (N/A).
Fix: Reduce secondary actions if >3.

- [ ] **Step 3: Axis 3 - Typographic Discipline**
Check: Max 2 font families (Playfair + Newsreader/Inter + JetBrains Mono for data), tabular-nums on metrics, ≤75ch line length, sentence case.
Fix: Adjust font stacks, add tabular-nums, constrain prose width.

- [ ] **Step 4: Axis 4 - Spacing & Geometry**
Check: All spacing from --space-* tokens, nested radius formula (card-core 0px = 2px - 2px), min 16px card padding, optical icon-text alignment.
Fix: Audit all spacing values, fix radius mismatches.

- [ ] **Step 5: Axis 5 - Micro-Interactions**
Check: Transitions <200ms, high-freq actions 0ms, :active scale(0.97), no ease-in.
Fix: Adjust durations, add active states, replace ease-in.

- [ ] **Step 6: Axis 6 - Accessibility**
Check: focus-visible rings, no outline:none without replacement, aria-labels on icon buttons, semantic HTML.
Fix: Add missing focus styles, aria-labels, verify HTML structure.

- [ ] **Step 7: Axis 7 - Mobile Linearity**
Check: <640px single column, no horizontal overflow, 44x44 touch targets, stats stack to 1 column.
Fix: Adjust grid breakpoints, add touch target padding, fix overflow.

- [ ] **Step 8: Performance verify**
Run: Lighthouse CI or manual audit.
Target: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90.

- [ ] **Step 9: Final commit + tag**
```bash
git -C /srv/projects/budd add -A
git -C /srv/projects/budd commit -m "chore: 7-Axis Quality Gate pass, final polish"
git -C /srv/projects/budd tag v1.0.0
git -C /srv/projects/budd push -f origin main --tags
```

---

## Execution Handoff

Plan complete and saved. Ready for implementation.

**Recommended approach: Native** — I'll implement every task myself in this session. The tasks have tight interface dependencies (tokens → base → HTML → JS modules → deploy), so subagent-driven would incur context-switching overhead. A single fresh reviewer at the end (Task 6) is sufficient.

**Does the plan capture what you want?**
