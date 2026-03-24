# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-03-23 | self | Used Clearbit logo API which is dead (HTTP 000) | Use Google Favicons API: `https://www.google.com/s2/favicons?domain={domain}&sz=128` |
| 2026-03-23 | self | Venice AI max_tokens=1500 caused 12/45 truncated JSON responses | Use max_tokens=3000 for Venice research calls |
| 2026-03-23 | user | Used wrong Venice model (claude-3-5-sonnet) | User wants `claude-opus-4-6` on Venice |
| 2026-03-23 | user | Framed copy around "how to cancel" | ALL copy must be "get the discount, keep the service" — user NEVER wants cancel framing |
| 2026-03-23 | user | Detail pages were too text-heavy | Parse tips into bullet points, use iconography, two-column layouts |
| 2026-03-23 | self | dotenv loads `.env` by default | Must use `dotenv.config({ path: ".env.local" })` for this project |

## User Preferences
- Simplicity first — no unnecessary UI elements
- Messaging: "get the discount, keep the service" not "cancel to save"
- Remove services with no real offers rather than showing them
- Sources should be clickable links
- Inspired by pickagame.fun / sumrize.ink aesthetics
- YoshiZen Warm Light theme: cream #faf7f2, accent #10b981, ink #2d2a26

## Patterns That Work
- Parallel subagent dispatch for independent tasks
- Combining tasks that touch the same file to avoid conflicts
- Frontend filtering with multiple "no offer" patterns before DB cleanup
- Venice AI with `venice_parameters: { enable_web_search: "on" }` works well

## Patterns That Don't Work
- Clearbit API — dead, don't use
- max_tokens < 3000 for Venice research — truncates JSON

## Domain Notes
- Venice AI uses OpenAI SDK with custom baseURL
- ServiceLogo uses `domain`/`name` props (not `logoUrl`)
- ConfidenceBadge uses `level` prop (not `confidence`)
- Next.js 15+: `params` must be awaited in page components
