# cancelhack_ — Design Spec

A directory of subscription services that offer retention discounts when you attempt to cancel. Helps users save money by showing what discount to expect, how confident the data is, and step-by-step instructions to trigger the offer.

## Product Overview

**Problem:** Most subscription services offer significant discounts when customers try to cancel, but most people don't know this. They either overpay or cancel entirely when they could be paying less.

**Solution:** A searchable, browsable directory of subscription services with documented retention offers — what discount to expect, how to trigger it, and how reliable the data is.

**Target user:** Cost-conscious consumers who subscribe to multiple services and want to reduce their monthly spend without giving up the services they use.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS |
| Framework | Next.js (App Router, ISR/static) |
| Hosting | Vercel |
| Database | Supabase (Postgres) |
| AI Pipeline | Node script using Claude API via Venice inference endpoint (`@anthropic-ai/sdk` with Venice base URL) |
| Logos | Domain-based logo API (Clearbit or similar, e.g. `https://logo.clearbit.com/{domain}`) |

## Visual Design

- **Personality:** Warm Light (per YoshiZen style guide)
- **Background:** `#faf7f2` (warm cream)
- **Surface:** `#ffffff` (white cards)
- **Text Primary:** `#2d2a26` (dark brown/charcoal)
- **Text Muted:** `#8a857d`
- **Accent:** `#10b981` (mint green — signals savings/money)
- **Accent Hover:** `#059669`
- **Accent Subtle:** `rgba(16, 185, 129, 0.1)`
- **Fonts:** Space Mono (brand, headings, labels, buttons) + Inter (body)
- **Logo:** `cancelhack_` with blinking mint green underscore
- **Layout:** Single-column, max-width 56rem, mobile-first

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│  AI Batch Script │────▶│   Supabase   │◀────│  Next.js App │
│  (cron/manual)  │     │  (Postgres)  │     │  (Vercel)    │
└─────────────────┘     └──────────────┘     └──────────────┘
                                                    │
                                              ISR/Static pages
                                                    │
                                                    ▼
                                               End Users
```

- **AI Batch Script** researches subscription services via Claude API with web search, extracts structured retention offer data, and upserts rows into Supabase.
- **Supabase** stores all service data in a single `services` table.
- **Next.js on Vercel** renders static/ISR pages from Supabase. Pages are pre-rendered at build time and revalidated every 24 hours (`revalidate: 86400`).
- **Client-side search** filters the full dataset in the browser (~100 services is small enough for this to be performant).

## Data Model

### `services` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (default `gen_random_uuid()`) |
| `slug` | text (unique) | URL-friendly name, e.g. `netflix` |
| `name` | text | Display name, e.g. "Netflix" |
| `domain` | text | Service domain, e.g. `netflix.com` (used for logo URL) |
| `logo_url` | text (nullable) | Service logo URL, auto-populated from domain |
| `category` | text | One of: streaming, software, fitness, music, gaming, news, cloud, other |
| `normal_price` | text | Regular price as displayed, e.g. "$15.99/mo" |
| `retention_offer` | text | What they offer, e.g. "50% off for 3 months" |
| `estimated_savings` | decimal | Estimated annual savings in USD |
| `confidence` | text | `high`, `medium`, or `low` — reliability of the offer data |
| `cancel_steps` | jsonb | Ordered array of strings — step-by-step instructions |
| `tips` | text (nullable) | Pro tips or extra advice |
| `source_notes` | text | Where the data came from (for transparency) |
| `last_verified` | timestamptz | When the AI last researched this service |
| `created_at` | timestamptz | Row creation time (default `now()`) |
| `updated_at` | timestamptz | Last modification time (default `now()`) |

### Indexes

- Unique index on `slug`
- Index on `category` for filtering queries

## Pages

### Homepage (`/`)

Top to bottom:

1. **Header** — `cancelhack_` logo (left), "about" link (right)
2. **Hero section:**
   - Label: "STOP OVERPAYING FOR SUBSCRIPTIONS"
   - Headline: "Cancel to save. Seriously."
   - Subtitle explaining the concept in one sentence
   - Two stat callouts: total potential savings + number of services tracked
3. **Search bar** — Client-side filtering by service name
4. **Category pills** — Horizontal row of category filters (All, Streaming, Software, Music, Fitness, Gaming, etc.). "All" selected by default.
5. **Service card grid** — 2-column grid (stacks to 1 on mobile). Each card shows:
   - Service name + logo
   - Category label
   - Confidence badge (high=green, medium=yellow, low=red)
   - Retention offer text
   - Estimated savings
   - Entire card is clickable, links to detail page
6. **Footer** — "built by yoshizen co" + @yoshizen link

### Service Detail Page (`/service/[slug]`)

Individual pages per service for SEO. Top to bottom:

1. **Header** — Same as homepage
2. **Back link** — Arrow back to homepage
3. **Service header** — Name, logo, category label, confidence badge
4. **Pricing row** — Three cards side by side:
   - Normal price
   - Retention offer (in accent color)
   - Estimated savings (in accent color)
5. **Cancel steps** — Numbered step-by-step instructions in a card
6. **Pro tip** — Highlighted tip box (accent subtle background) if tips exist
7. **Source info** — Last verified date and source notes (small text)
8. **Footer** — Same as homepage

## AI Batch Pipeline

### Overview

A Node.js script (`scripts/research.mjs`) that:

1. Reads a seed list of subscription services (name + domain)
2. For each service, calls Claude API with web search to research retention offers
3. Parses the structured JSON response
4. Upserts the data into the Supabase `services` table
5. Auto-sets `logo_url` from the service domain

### Recency Requirement

This is a hard constraint. The AI prompt must:

- Instruct Claude to only consider data from the **last 12 months**
- Use web search with date-range filtering to find recent sources
- Discount or ignore older data entirely
- Set confidence to `low` if only old data (>12 months) can be found
- Include source dates in `source_notes` so freshness is transparent

### Prompt Structure

The prompt asks Claude to return a JSON object with:

```json
{
  "name": "Netflix",
  "domain": "netflix.com",
  "category": "streaming",
  "normal_price": "$15.99/mo",
  "retention_offer": "50% off for 3 months",
  "estimated_savings": 24.00,
  "confidence": "high",
  "cancel_steps": [
    "Go to Account → Cancel Membership",
    "Select any cancellation reason and click Continue",
    "On the 'before you go' screen, look for the discount offer",
    "Accept the offer — your discount applies immediately"
  ],
  "tips": "If no offer appears, complete cancellation. Netflix often sends a comeback email within 24-48 hours with a better deal.",
  "source_notes": "Reddit r/netflix (Feb 2026), Slickdeals thread (Jan 2026)"
}
```

### Seed List

Start with ~100 popular subscription services across categories:

- **Streaming:** Netflix, Hulu, Disney+, HBO Max, Peacock, Paramount+, Apple TV+, YouTube Premium, Crunchyroll
- **Music:** Spotify, Apple Music, Tidal, Amazon Music, YouTube Music
- **Software:** Adobe Creative Cloud, Microsoft 365, Notion, Canva Pro, Grammarly, 1Password, Dropbox
- **Fitness:** Peloton, Planet Fitness, LA Fitness, ClassPass, Strava
- **Gaming:** Xbox Game Pass, PlayStation Plus, Nintendo Online, EA Play
- **News:** NYT, WSJ, Washington Post, The Athletic, Medium
- **Cloud:** iCloud, Google One, OneDrive
- **Other:** Amazon Prime, Costco, HelloFresh, BarkBox, Audible, LinkedIn Premium

### Scheduling

- **v1:** Run manually via `node scripts/research.mjs`
- **Future:** Vercel Cron or GitHub Actions on a weekly schedule

### Cost Control

- ~100 API calls per run, each a single turn with web search
- Estimate: ~$1–5 per full batch run (100 calls at ~$0.01–0.05 each with web search on Claude Sonnet)

### Savings Calculation

`estimated_savings` represents the total dollar amount saved over the offer period (not annualized). The AI should calculate this from the normal price and offer terms — e.g., "50% off for 3 months" on a $15.99/mo plan = $24.00 saved. This keeps the number concrete and verifiable.

## MVP Scope

### In Scope

- Homepage with savings hero, search, category filtering, service card grid
- Service detail pages with pricing, cancel steps, tips, confidence
- AI batch pipeline for ~100 services with recency-prioritized research
- Static/ISR rendering for performance and SEO
- Service logos via domain-based logo API
- Mobile-responsive layout
- YoshiZen brand compliance (Warm Light, mint green, Space Mono + Inter)

### Out of Scope (Future)

- User accounts and authentication
- User-submitted retention offers
- On-demand AI lookups for unlisted services
- Subscription tracker (log your own subs)
- Email alerts for offer changes
- Mobile app / PWA
- Analytics or admin dashboard

## Error Handling

- **AI pipeline failures:** Log errors per service, skip and continue. Don't let one failure block the batch.
- **Missing data:** If Claude can't find retention offer data for a service, skip it (don't insert a row with empty data).
- **Logo fallback:** If logo API returns 404, show a generic placeholder icon or the first letter of the service name.
- **Empty states:** If no services match a search/filter, show a friendly "no results" message.

## Testing Strategy

- **Pipeline:** Validate JSON response shape from Claude before upserting. Log malformed responses.
- **Frontend:** Manual testing across breakpoints (mobile, tablet, desktop). Verify ISR revalidation works.
- **Data integrity:** Ensure `slug` uniqueness. Validate `confidence` values are one of the three allowed strings.
