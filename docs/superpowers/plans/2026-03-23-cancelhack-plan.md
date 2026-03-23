# cancelhack_ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browsable directory of subscription services with known retention/cancel discount offers, powered by AI-researched data stored in Supabase.

**Architecture:** Next.js App Router with ISR static pages reads from a Supabase `services` table. A separate Node.js batch script uses the Venice AI API (OpenAI-compatible, proxying Claude) with web search to research and populate service data. Client-side search and category filtering over the full dataset.

**Tech Stack:** Next.js 14+, React, Tailwind CSS, Supabase (Postgres), Venice AI API (OpenAI SDK), Vercel hosting

---

## File Structure

```
cancelhack/
├── .env.local                          # API keys (gitignored)
├── .env.example                        # Template for env vars
├── .gitignore
├── package.json
├── next.config.mjs
├── tailwind.config.mjs
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.jsx                  # Root layout (fonts, metadata, footer)
│   │   ├── globals.css                 # Tailwind directives + custom styles
│   │   ├── page.jsx                    # Homepage (hero, search, grid)
│   │   └── service/
│   │       └── [slug]/
│   │           └── page.jsx            # Service detail page
│   ├── components/
│   │   ├── Header.jsx                  # Logo + nav link
│   │   ├── Footer.jsx                  # YoshiZen footer
│   │   ├── Hero.jsx                    # Savings hook + stats
│   │   ├── SearchBar.jsx               # Client-side search input
│   │   ├── CategoryFilter.jsx          # Category pill buttons
│   │   ├── ServiceCard.jsx             # Card in the grid
│   │   ├── ServiceGrid.jsx             # Grid + search/filter state
│   │   ├── PricingRow.jsx              # Three pricing cards on detail page
│   │   ├── CancelSteps.jsx             # Step-by-step instructions
│   │   ├── ProTip.jsx                  # Tip callout box
│   │   └── ConfidenceBadge.jsx         # High/medium/low badge
│   └── lib/
│       └── supabase.js                 # Supabase client
├── scripts/
│   ├── seed-services.json              # List of ~100 services (name + domain)
│   └── research.mjs                    # AI batch pipeline script
└── supabase/
    └── migrations/
        └── 001_create_services.sql     # Table creation SQL
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.mjs`, `tailwind.config.mjs`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.jsx`, `src/app/page.jsx`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd C:\Users\zenec\Cancelsaving
npx create-next-app@latest cancelhack --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack --use-npm
```

Expected: New `cancelhack/` directory with Next.js boilerplate.

- [ ] **Step 2: Move env files into the project**

Move `.env.local` and `.env.example` from repo root into `cancelhack/`.

Run:
```bash
mv .env.local cancelhack/.env.local
mv .env.example cancelhack/.env.example
```

- [ ] **Step 3: Update Tailwind config with YoshiZen Warm Light theme**

Replace `cancelhack/tailwind.config.mjs` with the cancelhack color scheme:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          subtle: 'rgba(16, 185, 129, 0.1)',
        },
        cream: '#faf7f2',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#2d2a26',
          muted: '#8a857d',
          faint: '#b5b0a8',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      maxWidth: {
        content: '56rem',
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

- [ ] **Step 4: Set up globals.css**

Replace `cancelhack/src/app/globals.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #faf7f2;
  color: #2d2a26;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: #10b981;
  color: #ffffff;
}
```

- [ ] **Step 5: Set up root layout**

Replace `cancelhack/src/app/layout.jsx` with:

```jsx
import './globals.css';

export const metadata = {
  title: 'cancelhack_ — Save money by canceling subscriptions',
  description: 'Discover which subscription services offer discounts when you try to cancel. Stop overpaying.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder homepage**

Replace `cancelhack/src/app/page.jsx` with:

```jsx
export default function Home() {
  return (
    <div className="max-w-content mx-auto w-full px-6">
      <header className="flex items-center justify-between py-8">
        <div className="font-mono text-xl font-bold text-ink">
          cancelhack<span className="text-accent animate-blink">_</span>
        </div>
      </header>
      <main className="animate-fade-in">
        <h1 className="font-mono text-4xl font-bold tracking-tight">
          Cancel to save. Seriously.
        </h1>
      </main>
    </div>
  );
}
```

- [ ] **Step 7: Verify dev server runs**

Run:
```bash
cd cancelhack && npm run dev
```

Expected: App runs at `http://localhost:3000`, shows the logo with blinking underscore and headline on cream background.

- [ ] **Step 8: Commit**

```bash
git add cancelhack/
git commit -m "feat: scaffold Next.js project with YoshiZen Warm Light theme"
```

---

## Task 2: Supabase Setup & Database Schema

**Files:**
- Create: `cancelhack/supabase/migrations/001_create_services.sql`, `cancelhack/src/lib/supabase.js`

- [ ] **Step 1: Write migration SQL**

Create `cancelhack/supabase/migrations/001_create_services.sql`:

```sql
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  domain text not null,
  logo_url text,
  category text not null check (category in ('streaming', 'software', 'fitness', 'music', 'gaming', 'news', 'cloud', 'other')),
  normal_price text not null,
  retention_offer text not null,
  estimated_savings decimal not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  cancel_steps jsonb not null,
  tips text,
  source_notes text not null,
  last_verified timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_category on services(category);
```

- [ ] **Step 2: Run migration in Supabase**

Go to the Supabase dashboard → SQL Editor → paste and run the migration SQL. Alternatively, if using Supabase CLI:

```bash
npx supabase db push
```

- [ ] **Step 3: Install Supabase client**

```bash
cd cancelhack && npm install @supabase/supabase-js
```

- [ ] **Step 4: Create Supabase client helper**

Create `cancelhack/src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 5: Update .env.example and .env.local**

Add `NEXT_PUBLIC_` prefixed vars to `.env.example`:

```
VENICE_API_KEY=your_venice_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

Update `.env.local` with the actual Supabase project URL and keys from the Supabase dashboard.

- [ ] **Step 6: Commit**

```bash
git add cancelhack/supabase/ cancelhack/src/lib/ cancelhack/.env.example cancelhack/package.json cancelhack/package-lock.json
git commit -m "feat: add Supabase schema and client"
```

---

## Task 3: AI Batch Pipeline

**Files:**
- Create: `cancelhack/scripts/seed-services.json`, `cancelhack/scripts/research.mjs`

- [ ] **Step 1: Install OpenAI SDK**

Venice uses OpenAI-compatible API format. Install the SDK:

```bash
cd cancelhack && npm install openai @supabase/supabase-js dotenv
```

- [ ] **Step 2: Create seed services list**

Create `cancelhack/scripts/seed-services.json` — a JSON array of objects with `name`, `domain`, and `category`:

```json
[
  { "name": "Netflix", "domain": "netflix.com", "category": "streaming" },
  { "name": "Hulu", "domain": "hulu.com", "category": "streaming" },
  { "name": "Disney+", "domain": "disneyplus.com", "category": "streaming" },
  { "name": "HBO Max", "domain": "max.com", "category": "streaming" },
  { "name": "Peacock", "domain": "peacocktv.com", "category": "streaming" },
  { "name": "Paramount+", "domain": "paramountplus.com", "category": "streaming" },
  { "name": "Apple TV+", "domain": "tv.apple.com", "category": "streaming" },
  { "name": "YouTube Premium", "domain": "youtube.com", "category": "streaming" },
  { "name": "Crunchyroll", "domain": "crunchyroll.com", "category": "streaming" },
  { "name": "Spotify", "domain": "spotify.com", "category": "music" },
  { "name": "Apple Music", "domain": "music.apple.com", "category": "music" },
  { "name": "Tidal", "domain": "tidal.com", "category": "music" },
  { "name": "Amazon Music", "domain": "music.amazon.com", "category": "music" },
  { "name": "YouTube Music", "domain": "music.youtube.com", "category": "music" },
  { "name": "Adobe Creative Cloud", "domain": "adobe.com", "category": "software" },
  { "name": "Microsoft 365", "domain": "microsoft.com", "category": "software" },
  { "name": "Notion", "domain": "notion.so", "category": "software" },
  { "name": "Canva Pro", "domain": "canva.com", "category": "software" },
  { "name": "Grammarly", "domain": "grammarly.com", "category": "software" },
  { "name": "1Password", "domain": "1password.com", "category": "software" },
  { "name": "Dropbox", "domain": "dropbox.com", "category": "software" },
  { "name": "Peloton", "domain": "onepeloton.com", "category": "fitness" },
  { "name": "Planet Fitness", "domain": "planetfitness.com", "category": "fitness" },
  { "name": "LA Fitness", "domain": "lafitness.com", "category": "fitness" },
  { "name": "ClassPass", "domain": "classpass.com", "category": "fitness" },
  { "name": "Strava", "domain": "strava.com", "category": "fitness" },
  { "name": "Xbox Game Pass", "domain": "xbox.com", "category": "gaming" },
  { "name": "PlayStation Plus", "domain": "playstation.com", "category": "gaming" },
  { "name": "Nintendo Switch Online", "domain": "nintendo.com", "category": "gaming" },
  { "name": "EA Play", "domain": "ea.com", "category": "gaming" },
  { "name": "New York Times", "domain": "nytimes.com", "category": "news" },
  { "name": "Wall Street Journal", "domain": "wsj.com", "category": "news" },
  { "name": "Washington Post", "domain": "washingtonpost.com", "category": "news" },
  { "name": "The Athletic", "domain": "theathletic.com", "category": "news" },
  { "name": "Medium", "domain": "medium.com", "category": "news" },
  { "name": "iCloud+", "domain": "icloud.com", "category": "cloud" },
  { "name": "Google One", "domain": "one.google.com", "category": "cloud" },
  { "name": "OneDrive", "domain": "onedrive.com", "category": "cloud" },
  { "name": "Amazon Prime", "domain": "amazon.com", "category": "other" },
  { "name": "Costco", "domain": "costco.com", "category": "other" },
  { "name": "HelloFresh", "domain": "hellofresh.com", "category": "other" },
  { "name": "BarkBox", "domain": "barkbox.com", "category": "other" },
  { "name": "Audible", "domain": "audible.com", "category": "other" },
  { "name": "LinkedIn Premium", "domain": "linkedin.com", "category": "other" }
]
```

This is ~44 services to start. Expand to ~100 later.

- [ ] **Step 3: Write the batch research script**

Create `cancelhack/scripts/research.mjs`:

```js
import 'dotenv/config';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const venice = new OpenAI({
  apiKey: process.env.VENICE_API_KEY,
  baseURL: 'https://api.venice.ai/api/v1',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const services = JSON.parse(
  readFileSync(join(__dirname, 'seed-services.json'), 'utf-8')
);

const PROMPT = (service) => `You are a subscription service researcher. Research the cancellation retention offer for "${service.name}" (${service.domain}).

IMPORTANT RULES:
- Only use information from the LAST 12 MONTHS (after March 2025). Ignore anything older.
- If you can only find old data (before March 2025), set confidence to "low".
- Be specific about what the offer is and how to trigger it.
- Calculate estimated_savings as the total saved over the offer period based on normal price minus discounted price.

Return ONLY a JSON object (no markdown, no explanation) with this exact structure:
{
  "name": "${service.name}",
  "domain": "${service.domain}",
  "category": "${service.category}",
  "normal_price": "price as displayed e.g. $15.99/mo",
  "retention_offer": "what discount they offer when you try to cancel",
  "estimated_savings": 0.00,
  "confidence": "high | medium | low",
  "cancel_steps": ["step 1", "step 2", "..."],
  "tips": "any pro tips or null if none",
  "source_notes": "where you found this info with dates"
}

If this service has NO known retention offer, return null.`;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function researchService(service) {
  try {
    console.log(`Researching ${service.name}...`);

    const response = await venice.chat.completions.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: PROMPT(service) }],
      venice_parameters: {
        enable_web_search: 'on',
      },
    });

    const text = response.choices[0].message.content.trim();

    if (text === 'null' || text === '') {
      console.log(`  No retention offer found for ${service.name}, skipping.`);
      return null;
    }

    const data = JSON.parse(text);

    const row = {
      slug: slugify(service.name),
      name: data.name,
      domain: data.domain,
      logo_url: `https://logo.clearbit.com/${data.domain}`,
      category: data.category,
      normal_price: data.normal_price,
      retention_offer: data.retention_offer,
      estimated_savings: data.estimated_savings,
      confidence: data.confidence,
      cancel_steps: data.cancel_steps,
      tips: data.tips || null,
      source_notes: data.source_notes,
      last_verified: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('services')
      .upsert(row, { onConflict: 'slug' });

    if (error) {
      console.error(`  Supabase error for ${service.name}:`, error.message);
      return null;
    }

    console.log(`  Saved ${service.name} (${data.confidence} confidence, $${data.estimated_savings} savings)`);
    return row;
  } catch (err) {
    console.error(`  Error researching ${service.name}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`Starting research for ${services.length} services...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const service of services) {
    const result = await researchService(service);
    if (result) success++;
    else skipped++;

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\nDone! ${success} saved, ${skipped} skipped/failed.`);
}

main();
```

- [ ] **Step 4: Test the script with a single service**

Temporarily edit the script to only process the first service, then run:

```bash
cd cancelhack && node scripts/research.mjs
```

Expected: Logs "Researching Netflix...", calls Venice API, saves a row to Supabase. Verify the row exists in Supabase dashboard.

Revert the temporary edit after testing.

- [ ] **Step 5: Run the full batch**

```bash
cd cancelhack && node scripts/research.mjs
```

Expected: Processes all ~44 services. Logs progress. Some may be skipped if no retention offer exists. Check Supabase dashboard for populated rows.

- [ ] **Step 6: Commit**

```bash
git add cancelhack/scripts/
git commit -m "feat: add AI batch research pipeline with Venice API"
```

---

## Task 4: Shared Components

**Files:**
- Create: `cancelhack/src/components/Header.jsx`, `cancelhack/src/components/Footer.jsx`, `cancelhack/src/components/ConfidenceBadge.jsx`, `cancelhack/src/components/ServiceLogo.jsx`
- Modify: `cancelhack/src/app/layout.jsx`

- [ ] **Step 1: Create Header component**

Create `cancelhack/src/components/Header.jsx`:

```jsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-8">
      <Link href="/" className="font-mono text-xl font-bold text-ink">
        cancelhack<span className="text-accent animate-blink">_</span>
      </Link>
      <a
        href="https://yoshizen.co"
        className="font-mono text-xs text-ink-muted hover:text-accent transition-colors"
      >
        about
      </a>
    </header>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `cancelhack/src/components/Footer.jsx`:

```jsx
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10">
      <div className="max-w-content mx-auto w-full px-6 py-8 flex justify-between items-center">
        <span className="font-mono text-[11px] text-ink-muted">
          built by{' '}
          <a href="https://yoshizen.co" className="hover:text-accent transition-colors">
            yoshizen co
          </a>
        </span>
        <a
          href="https://x.com/yoshizenco"
          className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors"
        >
          @yoshizen
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create ConfidenceBadge component**

Create `cancelhack/src/components/ConfidenceBadge.jsx`:

```jsx
const styles = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-600',
};

export default function ConfidenceBadge({ confidence }) {
  return (
    <span className={`${styles[confidence]} px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase`}>
      {confidence}
    </span>
  );
}
```

- [ ] **Step 4: Create ServiceLogo component (client, with fallback)**

Create `cancelhack/src/components/ServiceLogo.jsx`:

```jsx
'use client';

export default function ServiceLogo({ name, logoUrl, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'w-12 h-12 rounded-lg text-lg' : 'w-8 h-8 rounded-md text-sm';

  return (
    <div className={`${sizeClass} relative flex-shrink-0`}>
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${sizeClass} object-contain`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div
        className={`${sizeClass} bg-accent/10 text-accent font-mono font-bold items-center justify-center absolute inset-0 hidden`}
      >
        {name[0]}
      </div>
    </div>
  );
}
```

This is reused in both `ServiceCard` (Task 6) and the detail page (Task 7), handling logo fallback consistently everywhere.

- [ ] **Step 5: Wire Header and Footer into root layout**

Update `cancelhack/src/app/layout.jsx`:

```jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'cancelhack_ — Save money by canceling subscriptions',
  description: 'Discover which subscription services offer discounts when you try to cancel. Stop overpaying.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <div className="max-w-content mx-auto w-full px-6">
          <Header />
          <main className="animate-fade-in">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify layout renders**

Run `npm run dev`, check `http://localhost:3000`. Should show header with blinking logo and footer pinned to bottom.

- [ ] **Step 6: Commit**

```bash
git add cancelhack/src/components/ cancelhack/src/app/layout.jsx
git commit -m "feat: add Header, Footer, and ConfidenceBadge components"
```

---

## Task 5: Homepage — Hero Section

**Files:**
- Create: `cancelhack/src/components/Hero.jsx`
- Modify: `cancelhack/src/app/page.jsx`

- [ ] **Step 1: Create Hero component**

Create `cancelhack/src/components/Hero.jsx`:

```jsx
export default function Hero({ totalSavings, serviceCount }) {
  return (
    <section className="text-center py-16 sm:py-24">
      <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-accent mb-3">
        Stop overpaying for subscriptions
      </div>
      <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-ink leading-tight">
        Cancel to save.<br />Seriously.
      </h1>
      <p className="text-ink-muted text-sm sm:text-base mt-4 max-w-lg mx-auto">
        Most subscription services will offer you a discount when you try to cancel.
        We track which ones, what they offer, and exactly how to get it.
      </p>
      <div className="flex justify-center gap-12 sm:gap-16 mt-10">
        <div className="text-center">
          <div className="font-mono text-3xl sm:text-4xl font-bold text-accent">
            ${totalSavings.toLocaleString()}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted mt-1">
            total potential savings
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-3xl sm:text-4xl font-bold text-accent">
            {serviceCount}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted mt-1">
            services tracked
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Hero into homepage with data**

Update `cancelhack/src/app/page.jsx`:

```jsx
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';

export const revalidate = 86400;

async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('estimated_savings', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error.message);
    return [];
  }
  return data;
}

export default async function Home() {
  const services = await getServices();
  const totalSavings = services.reduce((sum, s) => sum + Number(s.estimated_savings), 0);

  return (
    <>
      <Hero totalSavings={totalSavings} serviceCount={services.length} />
    </>
  );
}
```

- [ ] **Step 3: Verify Hero renders with data from Supabase**

Run `npm run dev`, check `http://localhost:3000`. Should show hero with dynamic savings total and service count from Supabase.

- [ ] **Step 4: Commit**

```bash
git add cancelhack/src/components/Hero.jsx cancelhack/src/app/page.jsx
git commit -m "feat: add Hero section with dynamic stats from Supabase"
```

---

## Task 6: Homepage — Search, Filter, and Service Grid

**Files:**
- Create: `cancelhack/src/components/SearchBar.jsx`, `cancelhack/src/components/CategoryFilter.jsx`, `cancelhack/src/components/ServiceCard.jsx`, `cancelhack/src/components/ServiceGrid.jsx`
- Modify: `cancelhack/src/app/page.jsx`

- [ ] **Step 1: Create SearchBar component**

Create `cancelhack/src/components/SearchBar.jsx`:

```jsx
'use client';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search services..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-ink/10 rounded-xl px-4 py-3 font-mono text-sm text-ink placeholder-ink-muted outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create CategoryFilter component**

Create `cancelhack/src/components/CategoryFilter.jsx`:

```jsx
'use client';

const CATEGORIES = ['all', 'streaming', 'software', 'music', 'fitness', 'gaming', 'news', 'cloud', 'other'];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 justify-center flex-wrap mt-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase transition-colors ${
            selected === cat
              ? 'bg-accent text-white'
              : 'bg-surface border border-ink/10 text-ink-muted hover:text-ink'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create ServiceCard component**

Create `cancelhack/src/components/ServiceCard.jsx`:

```jsx
'use client';

import Link from 'next/link';
import ConfidenceBadge from './ConfidenceBadge';
import ServiceLogo from './ServiceLogo';

export default function ServiceCard({ service }) {
  return (
    <Link
      href={`/service/${service.slug}`}
      className="block bg-surface border border-ink/[0.08] rounded-xl p-5 hover:border-accent/30 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <ServiceLogo name={service.name} logoUrl={service.logo_url} />
          <div>
            <div className="font-semibold text-[15px] text-ink">{service.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted mt-0.5">
              {service.category}
            </div>
          </div>
        </div>
        <ConfidenceBadge confidence={service.confidence} />
      </div>
      <div className="mt-3 text-[13px] text-accent font-semibold">{service.retention_offer}</div>
      <div className="mt-1 text-xs text-ink-muted">Save ~${Number(service.estimated_savings).toFixed(0)}</div>
    </Link>
  );
}
```

Uses the shared `ServiceLogo` component (Task 4) for consistent logo fallback handling.

```jsx
'use client';

import Link from 'next/link';
// ... rest of component
```

- [ ] **Step 4: Create ServiceGrid component (client-side search + filter state)**

Create `cancelhack/src/components/ServiceGrid.jsx`:

```jsx
'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ServiceCard from './ServiceCard';

export default function ServiceGrid({ services }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="pb-16">
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter selected={category} onChange={setCategory} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-ink-muted font-mono text-sm">
          No services found. Try a different search or category.
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Wire ServiceGrid into homepage**

Update `cancelhack/src/app/page.jsx`:

```jsx
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import ServiceGrid from '@/components/ServiceGrid';

export const revalidate = 86400;

async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('estimated_savings', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error.message);
    return [];
  }
  return data;
}

export default async function Home() {
  const services = await getServices();
  const totalSavings = services.reduce((sum, s) => sum + Number(s.estimated_savings), 0);

  return (
    <>
      <Hero totalSavings={totalSavings} serviceCount={services.length} />
      <ServiceGrid services={services} />
    </>
  );
}
```

- [ ] **Step 6: Verify homepage with real data**

Run `npm run dev`, check `http://localhost:3000`. Should show:
- Hero with correct totals
- Search bar filters cards by name in real time
- Category pills filter by category
- Cards show service name, logo, offer, savings, confidence
- Empty state shows when no results match

- [ ] **Step 7: Commit**

```bash
git add cancelhack/src/components/ cancelhack/src/app/page.jsx
git commit -m "feat: add search, category filter, and service card grid"
```

---

## Task 7: Service Detail Page

**Files:**
- Create: `cancelhack/src/app/service/[slug]/page.jsx`, `cancelhack/src/components/PricingRow.jsx`, `cancelhack/src/components/CancelSteps.jsx`, `cancelhack/src/components/ProTip.jsx`

- [ ] **Step 1: Create PricingRow component**

Create `cancelhack/src/components/PricingRow.jsx`:

```jsx
export default function PricingRow({ normalPrice, retentionOffer, estimatedSavings }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      <div className="bg-surface border border-ink/[0.08] rounded-xl p-4 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Normal Price
        </div>
        <div className="text-xl font-bold mt-1 text-ink">{normalPrice}</div>
      </div>
      <div className="bg-surface border border-ink/[0.08] rounded-xl p-4 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
          Retention Offer
        </div>
        <div className="text-xl font-bold mt-1 text-accent">{retentionOffer}</div>
      </div>
      <div className="bg-surface border border-ink/[0.08] rounded-xl p-4 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          You Save
        </div>
        <div className="text-xl font-bold mt-1 text-accent">
          ~${Number(estimatedSavings).toFixed(0)}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CancelSteps component**

Create `cancelhack/src/components/CancelSteps.jsx`:

```jsx
export default function CancelSteps({ steps }) {
  return (
    <div className="mt-8">
      <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted mb-3">
        How to get this offer
      </div>
      <div className="bg-surface border border-ink/[0.08] rounded-xl p-6">
        {steps.map((step, i) => (
          <div key={i} className={`flex gap-3 items-start ${i < steps.length - 1 ? 'mb-4' : ''}`}>
            <div className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
              {i + 1}
            </div>
            <div className="text-sm text-ink pt-0.5">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProTip component**

Create `cancelhack/src/components/ProTip.jsx`:

```jsx
export default function ProTip({ tip }) {
  if (!tip) return null;

  return (
    <div className="mt-5 bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
      <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-accent mb-2">
        Pro tip
      </div>
      <div className="text-sm text-ink">{tip}</div>
    </div>
  );
}
```

- [ ] **Step 4: Create the service detail page**

Create `cancelhack/src/app/service/[slug]/page.jsx`:

```jsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import ServiceLogo from '@/components/ServiceLogo';
import PricingRow from '@/components/PricingRow';
import CancelSteps from '@/components/CancelSteps';
import ProTip from '@/components/ProTip';

export const revalidate = 86400;

export async function generateStaticParams() {
  const { data } = await supabase.from('services').select('slug');
  return (data || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await supabase
    .from('services')
    .select('name, retention_offer')
    .eq('slug', slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.name} Cancel Discount — cancelhack_`,
    description: `${data.name} offers "${data.retention_offer}" when you try to cancel. Here's how to get it.`,
  };
}

async function getService(slug) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  return (
    <div className="pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-mono text-xs text-ink-muted hover:text-accent transition-colors mb-8"
      >
        ← Back
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <ServiceLogo name={service.name} logoUrl={service.logo_url} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-ink">{service.name}</h1>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted mt-1">
              {service.category}
            </div>
          </div>
        </div>
        <ConfidenceBadge confidence={service.confidence} />
      </div>

      <PricingRow
        normalPrice={service.normal_price}
        retentionOffer={service.retention_offer}
        estimatedSavings={service.estimated_savings}
      />

      <CancelSteps steps={service.cancel_steps} />

      <ProTip tip={service.tips} />

      <div className="mt-6 font-mono text-[10px] text-ink-faint">
        Last verified: {new Date(service.last_verified).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        {' · '}Sources: {service.source_notes}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify detail pages work**

Run `npm run dev`. Click a service card on the homepage — should navigate to `/service/netflix` (or whichever slug). Should show:
- Back link
- Service name + logo + category + confidence badge
- Pricing row with three cards
- Numbered cancel steps
- Pro tip (if service has tips)
- Source info at bottom

- [ ] **Step 6: Commit**

```bash
git add cancelhack/src/app/service/ cancelhack/src/components/PricingRow.jsx cancelhack/src/components/CancelSteps.jsx cancelhack/src/components/ProTip.jsx
git commit -m "feat: add service detail page with pricing, steps, and tips"
```

---

## Task 8: Polish and Deploy

**Files:**
- Modify: `cancelhack/src/app/page.jsx` (if needed), various components for visual tweaks

- [ ] **Step 1: Test responsive layout**

Run `npm run dev`, resize browser to mobile width (~375px). Verify:
- Hero text scales down
- Cards stack to single column
- Category pills wrap
- Detail page pricing cards stack
- Footer stays at bottom

- [ ] **Step 2: Test all service detail pages**

Click through 5-10 service cards. Verify:
- All pages load without error
- Logo images load (or fallback appears)
- Cancel steps render correctly (no empty arrays, no broken JSON)
- Back link returns to homepage

- [ ] **Step 3: Build production bundle**

```bash
cd cancelhack && npm run build
```

Expected: Build completes without errors. ISR pages are pre-rendered.

- [ ] **Step 4: Commit any polish fixes**

```bash
git add -A
git commit -m "fix: polish responsive layout and visual tweaks"
```

(Only if changes were needed.)

- [ ] **Step 5: Deploy to Vercel**

```bash
cd cancelhack && npx vercel
```

Follow prompts to link to Vercel project. Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Expected: Site is live at a `.vercel.app` URL.

- [ ] **Step 6: Verify production site**

Open the Vercel URL. Test:
- Homepage loads with data
- Search and filter work
- Service detail pages load
- Logos render
- Mobile responsive

- [ ] **Step 7: Commit Vercel config if generated**

```bash
git add -A
git commit -m "chore: add Vercel deployment config"
```
