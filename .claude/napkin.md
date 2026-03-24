# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|

## User Preferences
- (accumulate here as we learn them)

## Patterns That Work
- Venice AI with Opus 4.6 + web search works well for structured research
- Retry loop with higher max_tokens (3000 vs 1500) fixed all truncated JSON failures

## Patterns That Don't Work
- max_tokens: 1500 too low for Venice AI research responses — truncated JSON on 12/45 services. Use 3000+.

## Domain Notes
- App concept: "Cancel to Save" — helps users discover subscription services that offer retention discounts when you attempt to cancel
- This is a greenfield project, starting from scratch
- YouTube Premium removed (2026-03-24): user reported it actually cancelled their account instead of offering a discount. Added Disclaimer component site-wide.
- AI-researched data carries real risk — services may just cancel accounts. Always include disclaimers.
