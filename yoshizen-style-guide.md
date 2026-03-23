# YoshiZen Co — Design System & Style Guide

> Drop this file into any new project as `CLAUDE.md` context or reference it during development to maintain visual consistency across all YoshiZen Co products.

---

## Brand DNA

Every YoshiZen Co product shares these non-negotiable traits:

- **Trailing underscore motif** — Every product logo ends with `_` in the accent color, animated with a blink cursor effect (`animation: blink 1s step-end infinite`)
- **Inter + Space Mono** — The universal font pairing. No exceptions.
- **Space Mono is the personality font** — Used for branding, headings, labels, buttons, nav. It's what makes our sites feel like *us*.
- **Minimal navigation** — No hamburger menus, no dropdowns. Just the logo and 1-2 links max.
- **Ultra-minimal footers** — One line: "built by yoshizen co" + social link. That's it.
- **Single-purpose pages** — Each product is focused. No feature creep in the UI.
- **Tailwind CSS + React** — The tech stack. Always.

---

## Color System

Each product gets its own **accent color**. The rest of the palette derives from the chosen mode.

### Per-Product Accents (existing)

| Product | Accent | Hex |
|---------|--------|-----|
| pickmy.ai | Amber | `#f59e0b` |
| articleviz_ | Amber | `#f59e0b` |
| profiled.lol | Emerald | `#059669` |
| pickagame.fun | Burnt Orange | `#e85d3a` |
| palettepirate.ink | Violet | `#8b5cf6` |

### Dark Mode Palette (default)

Use this for most products. Warm-dark navy, not pure black (unless going brutalist like profiled.lol).

```
Background:       #0a1628   (navy-950, primary bg)
Surface:          #0f1d32   (navy-900, inputs, subtle cards)
Card:             #111c32   (elevated surfaces)
Border:           #1c2a42   (default borders)
Border Light:     #1e293b   (dividers, secondary borders)

Text Primary:     #ffffff   (headings, important text)
Text Secondary:   #94a3b8   (body text, descriptions)
Text Tertiary:    #64748b   (captions, metadata)
Text Faint:       #475569   (footer, timestamps)

Accent:           [per-product]
Accent Hover:     [slightly lighter variant]
Accent Subtle:    [accent at 10-15% opacity, for backgrounds]
```

### Light Mode Palette (pickagame.fun style)

```
Background:       #faf7f2   (warm cream)
Surface:          #ffffff   (white cards)
Surface Hover:    #f5f0e8   (hover states)
Border:           ink/10    (very subtle)

Text Primary:     #2d2a26   (dark brown/charcoal)
Text Muted:       #8a857d   (secondary text)

Accent:           [per-product]
```

### Brutalist Dark Palette (profiled.lol style)

```
Background:       #000000   (pure black)
Card:             #0a0c10   (near-black)
Border:           #1c2333
Text:             #f0f0f0
Muted:            #9ca3af / #6b7280 / #374151 (3-tier hierarchy)
```

---

## Typography

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Or via CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
```

### Font Roles

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Brand/Logo** | Space Mono | 700 | Product name with blinking `_` |
| **Headings** | Space Mono or Inter | 700-900 | Page titles, section headers |
| **Labels** | Space Mono | 400-700 | Uppercase, letter-spaced (0.1-0.2em), small (11-13px) |
| **Buttons** | Space Mono | 700 | All interactive elements |
| **Body** | Inter | 400-500 | Paragraphs, descriptions |
| **Input Text** | Space Mono | 400 | Form fields |

### Type Scale

```
Hero headline:    text-4xl sm:text-5xl (36-48px), font-mono, font-bold, tracking-tight
Section heading:  text-xl (20px), font-mono or font-sans, font-bold
Body:             text-sm to text-base (14-16px), font-sans
Label:            text-[0.65rem] (10.4px), font-mono, uppercase, tracking-[0.15em]
Caption/Footer:   text-[11px], font-mono
```

### Text Rendering

Always apply to body:
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## Tailwind Config

```js
// tailwind.config.js — starter for new YoshiZen projects
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Swap accent per product
        accent: {
          DEFAULT: '#f59e0b',  // amber — change per project
          light: '#fbbf24',
          subtle: 'rgba(245, 158, 11, 0.1)',
        },
        navy: {
          950: '#0a1628',
          900: '#0f1d32',
          800: '#162441',
          700: '#1e3054',
          600: '#2a4270',
        },
        border: '#1c2a42',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      maxWidth: {
        content: '56rem', // 896px — main content width
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeInUp 0.4s ease-out both',
      },
      keyframes: {
        blink: { '50%': { opacity: '0' } },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## Component Patterns

### Logo

```jsx
<div className="font-mono text-xl font-bold text-white">
  productname<span className="text-accent animate-blink">_</span>
</div>
```

### Header

```jsx
<header className="flex items-center justify-between py-8">
  <Logo />
  <div className="flex gap-4">
    <a href="#" className="font-mono text-xs text-slate-500 hover:text-accent transition-colors">about</a>
    <a href="#" className="font-mono text-xs text-slate-500 hover:text-accent transition-colors">@yoshizen</a>
  </div>
</header>
```

### Primary Button (CTA)

```jsx
<button className="bg-accent hover:bg-accent-light text-navy-950 font-mono font-bold text-sm px-6 py-3 rounded-lg transition-colors">
  ACTION TEXT →
</button>
```

Brutalist variant (profiled.lol):
```jsx
<button className="bg-accent text-white font-mono font-bold text-sm px-6 py-3 rounded-none transition-colors">
  ACTION TEXT
</button>
```

### Secondary Button

```jsx
<button className="bg-white/[0.03] border border-border text-slate-400 hover:text-white font-mono text-sm px-6 py-3 rounded-lg transition-colors">
  SECONDARY
</button>
```

### Text Input

```jsx
<input className="flex-1 bg-navy-900 border border-border rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder-slate-500 outline-none focus:border-accent transition-colors" />
```

### Section Label

```jsx
<div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-slate-500 mb-2">
  Section Name
</div>
```

### Card

```jsx
<div className="bg-navy-900/60 border border-border rounded-xl p-5 animate-fade-in">
  {/* content */}
</div>
```

### Error Message

```jsx
<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg font-mono text-sm text-red-400">
  {errorMessage}
</div>
```

### Footer

```jsx
<footer className="mt-auto border-t border-border">
  <div className="max-w-content mx-auto w-full px-6 py-8 flex justify-between items-center">
    <span className="font-mono text-[11px] text-slate-500">
      built by <a href="https://yoshizen.co" className="hover:text-accent transition-colors">yoshizen co</a>
    </span>
    <a href="https://x.com/yoshizenco" className="font-mono text-[11px] text-slate-500 hover:text-accent transition-colors">
      @yoshizen
    </a>
  </div>
</footer>
```

---

## Background Textures

### Dot Pattern (used on pickmy.ai, palettepirate.ink, articleviz_)

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Tint the dots with the accent color at ~7% opacity */
  background: radial-gradient(circle, rgba(245, 158, 11, 0.07) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

Swap the rgba color to match the product accent:
- Amber: `rgba(245, 158, 11, 0.07)`
- Violet: `rgba(139, 92, 246, 0.15)` (needs higher opacity — violet is darker)
- Emerald: `rgba(5, 150, 105, 0.07)`

### No Texture (profiled.lol, pickagame.fun)

Some products skip the dot pattern for a cleaner look. This is fine.

---

## Animations

### Blink Cursor (brand motif)
```css
@keyframes blink {
  50% { opacity: 0; }
}
/* animation: blink 1s step-end infinite */
```

### Fade In Up (page entrance)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
/* animation: fadeInUp 0.4s ease-out both */
```

### Interactions
- Links/buttons: `transition-colors` (150ms default)
- Hover states: lighten the accent color or change text to white
- Disabled: `opacity-50` or `opacity-30`
- No complex animations — keep it subtle

---

## Layout Principles

1. **Max content width**: `56rem` (896px) for main content, centered with `mx-auto`
2. **Side padding**: `px-6` (24px) on the content container
3. **Vertical rhythm**: Use `py-8` for header/footer, generous gaps between sections
4. **Full-height pages**: `min-h-screen` with `flex flex-col`, footer pushed to bottom with `mt-auto`
5. **Mobile-first**: All sites are responsive. Use `sm:` breakpoint for larger text on desktop.
6. **No sidebars**: Single-column layouts. If two columns are needed, use a simple grid that stacks on mobile.

---

## Page Structure Template

```jsx
<div className="min-h-screen flex flex-col font-sans">
  <div className="max-w-content mx-auto w-full px-6">
    <Header />

    {/* Main content with animate-fade-in */}
    <main className="animate-fade-in">
      {/* ... */}
    </main>
  </div>

  <Footer />
</div>
```

---

## Global CSS Starter

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a1628;
  color: #e2e8f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dot pattern texture — optional, swap accent color */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.07) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Ensure content sits above the dot pattern */
body > * {
  position: relative;
  z-index: 1;
}

::selection {
  background: #f59e0b;
  color: #0a1628;
}
```

---

## Checklist for New Projects

- [ ] Inter + Space Mono loaded via Google Fonts
- [ ] Tailwind config with navy palette, accent color, Space Mono + Inter
- [ ] Product name ends with `_` in accent color, animated blink
- [ ] Header: logo left, 1-2 links right, `py-8`
- [ ] Footer: "built by yoshizen co" + @yoshizen link
- [ ] Primary button: accent bg, navy text, mono font, `rounded-lg`
- [ ] Inputs: navy-900 bg, border, mono font, focus:accent
- [ ] `min-h-screen flex flex-col` layout with `mt-auto` footer
- [ ] Antialiased text rendering
- [ ] `animate-fade-in` on main content
- [ ] Dot pattern texture (optional — match accent color)
- [ ] `max-w-content` (56rem) centered container
- [ ] No complex navigation
- [ ] Mobile-responsive with `sm:` breakpoint

---

## Product Personality Guide

While all products share the DNA above, each has its own personality:

| Personality | When to use | Key traits |
|-------------|-------------|------------|
| **Warm Dark** (pickmy, articleviz) | Tools, utilities, productivity apps | Navy bg `#0a1628`, amber accent, dot texture, rounded corners |
| **Brutalist** (profiled) | Developer tools, CLI-adjacent products | Pure black `#000`, emerald accent, `rounded-none`, no texture, narrow layout |
| **Warm Light** (pickagame) | Consumer/fun/casual products | Cream bg `#faf7f2`, orange accent, shadows, rounded-2xl, playful |
| **Tech Dark** (palettepirate) | Creative/design tools | Dark navy `#020617`, violet accent, dot texture, modern glow effects |

Pick the personality that fits the product, swap the accent color, and you're good.
