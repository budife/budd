# Brainstorming: Editorial Portfolio Site (budd.my.id)

## Core Intent
Build a portfolio/showcase site at budd.my.id that displays budife's projects/work with Editorial typography-led design, generous whitespace, and Hallmark Cobalt compliance.

## User Constraints (from clarify)
- **Material**: Placeholder/library images for now
- **Audience**: General audience seeing my work
- **Primary Use/CTA**: View GitHub repos / code
- **Tone**: Editorial — typography-led, generous whitespace

## Design Direction: Editorial (Archetype C from anti-slop-design)
- Warm canvas (#faf8f5), white surface (#ffffff)
- Subtle borders (#e8e4df, #d1ccc4)
- Near-black accent (#1a1a1a)
- Display: Playfair Display (serif) - distinctive character
- Body: Newsreader/Inter (sans-serif) - readable
- Monospace: JetBrains Mono for code/technical data
- Zero/minimal radii (0-2px)
- Generous whitespace, 65-75ch line length

## Hallmark Cobalt Integration
Must comply with Hallmark Floor rules:
- OKLCH tokens, no transition: all
- focus-visible on all interactive
- prefers-reduced-motion respected
- Semantic HTML, ARIA labels
- Double-bezel card architecture (from high-end-visual-design)
- Magnetic hover physics (from emil-design-eng)

## Pixel Art Web Consideration
User has pixel-art-web skill active but chose Editorial tone. Need to reconcile:
- Pixel art as subtle texture/accent, not dominant aesthetic
- Could use pixel art for: favicon, small decorative elements, loading states
- Not the main visual language (that's Editorial)

## High-End Visual Design Application
- Double-bezel cards (.card-shell + .card-core)
- Nested CTA keycaps (.keycap-cta__icon inner layer)
- Magnetic hover physics (1px lift + 3px press depth)
- Corner-shape bevel
- Hardware acceleration hints (will-change, backface-visibility)
- Spring physics presets

## Emil Design Engineering Principles
- Custom easing curves (cubic-bezier(0.23, 1, 0.32, 1) for ease-out)
- @starting-style for enter animations
- clip-path reveals
- Spring animations for decorative mouse interactions
- 8-state interactive feedback on all primitives
- prefers-reduced-motion: reduce movement, keep opacity/color
- No ease-in on UI
- transform-origin on trigger for popovers

## Anti-UI-Slop Application
- Work from product: real project data, not fake metrics
- Reuse Hallmark components/tokens
- Design contract for new interface
- Real labels and data
- Render and inspect result

## Anti-Slop-Design 7-Axis Quality Gate
1. Anti-Slop Purity: Zero purple gradients, zero raw emojis, zero fake stats
2. UX Speed & 1-to-3: One primary CTA per section (View GitHub), max 3 secondary
3. Typographic Discipline: Max 2 fonts (Playfair + Newsreader/Inter + JetBrains Mono), tabular-nums, 65-75ch line length
4. Spacing & Geometry: 8pt grid, nested radius formula, 16px min card padding
5. Micro-Interactions: <200ms, 0ms for high-freq, scale(0.97) active, no ease-in
6. Accessibility: focus-visible rings, no outline:none without replacement, aria-labels, semantic HTML
7. Mobile Linearity: Clean vertical stack, no horizontal overflow, 44x44 touch targets

## Site Structure (Hallmark Feature Ledger + Stage Hero)
1. **Header**: Wordmark + one keycap CTA ("View Work" / "GitHub")
2. **Stage Hero**: Marquee headline + subtle ambient canvas (pixel texture?)
3. **Projects Grid** (Workbench/Bento): Project cards with title, description, tech tags, GitHub link
4. **Experiments Grid** (Bento): Smaller experiment cards
5. **About/Stats**: Brief bio + key metrics (repos, commits, years)
6. **Mast Footer**: Links, copyright

## Key Decisions Needed
1. **Project data source**: Static JSON in repo? CMS? GitHub API?
2. **Placeholder images**: Use abstract CSS shapes, SVG illustrations, or stock?
3. **Animation budget**: Subtle ambient only (Emil: rare/first-time can have delight)
4. **Dark mode**: Editorial archetype is light-only? Or adapt?
5. **Responsive breakpoints**: Mobile-first, tablet, desktop

## Ideas for "Make Them Real" (using all skills)
- Hallmark tokens as CSS custom properties (exact Cobalt OKLCH)
- Double-bezel cards for project/experiment items
- Magnetic hover on CTA keycap (spring physics)
- clip-path reveal on scroll for project cards
- Spring-smoothed mouse parallax on hero ambient canvas
- @starting-style enter animations for staggered reveal
- Pixel art favicon + subtle pixel texture overlay (pixel-art-web)
- Real project data from GitHub API (or static JSON for now)
- Zero vanity metrics - only real GitHub stats

## Anti-Goals (what would make this fail)
- Looking like generic AI portfolio template
- Purple/indigo gradients anywhere
- Fake stats like "50k+ users"
- Cluttered cards with 5+ equal-weight buttons
- Raw emojis as icons
- Missing focus-visible states
- Animations on high-frequency actions
- Horizontal scroll on mobile
- Hardcoded pixel values instead of 8pt grid
