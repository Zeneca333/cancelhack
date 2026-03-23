/**
 * research.mjs — AI Batch Pipeline for cancelhack_
 *
 * Reads seed-services.json, calls Venice AI API (with web search) to research
 * retention/cancel discount offers for each service, then upserts structured
 * results into the Supabase `services` table.
 *
 * Usage:
 *   node scripts/research.mjs               # process all services
 *   node scripts/research.mjs --only netflix # process one service (by slug)
 *   node scripts/research.mjs --dry-run      # skip Supabase writes, print JSON
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const VENICE_BASE_URL = "https://api.venice.ai/api/v1";
const VENICE_MODEL = "claude-3-5-sonnet-20241022";
const DELAY_MS = 1500; // delay between API calls to respect rate limits
const MAX_RETRIES = 2; // retry failed API calls up to this many times

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

function requireEnv(name) {
  const val = process.env[name];
  if (!val || val.startsWith("your_")) {
    console.error(`ERROR: Missing or placeholder environment variable: ${name}`);
    console.error(`       Set it in your .env file or export it before running.`);
    process.exit(1);
  }
  return val;
}

// ---------------------------------------------------------------------------
// Parse CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const onlyIndex = args.indexOf("--only");
const ONLY_SLUG = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

if (DRY_RUN) console.log(">> DRY RUN — Supabase writes will be skipped.\n");

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const VENICE_API_KEY = requireEnv("VENICE_API_KEY");

const venice = new OpenAI({
  apiKey: VENICE_API_KEY,
  baseURL: VENICE_BASE_URL,
});

let supabase = null;
if (!DRY_RUN) {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build the prompt that asks Venice AI to research a service's retention offer.
 */
function buildPrompt(service) {
  const currentDate = new Date().toISOString().split("T")[0];

  return `You are a subscription savings researcher. Today is ${currentDate}.

Research the cancellation retention offer (also known as a "save offer" or "cancel discount") for **${service.name}** (${service.domain}).

IMPORTANT: Only use information from the last 12 months. Ignore anything older.

Find out:
1. The current standard subscription price (most popular plan)
2. What discount or offer they give customers who attempt to cancel (the retention offer)
3. The estimated dollar savings per year from accepting the retention offer
4. Your confidence in this data (high = multiple recent reports confirm it; medium = some reports or community posts; low = sparse or anecdotal)
5. The step-by-step instructions a customer follows to reach the cancel/retention screen
6. Any tips for maximizing the discount (e.g., "say you're switching to a competitor", "wait for the second offer")
7. Where you found this information (source notes — URLs, Reddit threads, articles, etc.)

Respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) matching this exact schema:

{
  "normal_price": "string — e.g. '$15.49/mo' or '$71.88/yr'",
  "retention_offer": "string — e.g. '50% off for 3 months' or 'Free month added'",
  "estimated_savings": number,
  "confidence": "high" | "medium" | "low",
  "cancel_steps": ["step 1", "step 2", "..."],
  "tips": "string or null",
  "source_notes": "string — describe where this info came from"
}

If you cannot find any retention offer information, set retention_offer to "No known retention offer" and confidence to "low", and set estimated_savings to 0.`;
}

/**
 * Call Venice AI API with web search enabled. Retries on failure.
 */
async function callVeniceAI(service, attempt = 1) {
  try {
    const response = await venice.chat.completions.create({
      model: VENICE_MODEL,
      messages: [{ role: "user", content: buildPrompt(service) }],
      temperature: 0.2,
      max_tokens: 1500,
      // Venice-specific: enable web search
      venice_parameters: {
        enable_web_search: "on",
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Venice AI");
    }
    return content;
  } catch (err) {
    if (attempt <= MAX_RETRIES) {
      const backoff = attempt * 2000;
      console.warn(
        `  WARN: Attempt ${attempt} failed for ${service.name}: ${err.message}. Retrying in ${backoff}ms...`
      );
      await sleep(backoff);
      return callVeniceAI(service, attempt + 1);
    }
    throw err;
  }
}

/**
 * Parse the AI response into structured data. Handles possible markdown
 * code fences or extra whitespace the model might include despite instructions.
 */
function parseResponse(raw) {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const required = [
    "normal_price",
    "retention_offer",
    "estimated_savings",
    "confidence",
    "cancel_steps",
    "source_notes",
  ];
  for (const field of required) {
    if (parsed[field] === undefined || parsed[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Normalize confidence to allowed values
  const allowedConfidence = ["high", "medium", "low"];
  if (!allowedConfidence.includes(parsed.confidence)) {
    parsed.confidence = "low";
  }

  // Ensure cancel_steps is an array
  if (!Array.isArray(parsed.cancel_steps)) {
    parsed.cancel_steps = [String(parsed.cancel_steps)];
  }

  // Ensure estimated_savings is a number
  parsed.estimated_savings = Number(parsed.estimated_savings) || 0;

  return parsed;
}

/**
 * Upsert a service record into Supabase.
 */
async function upsertService(record) {
  const { data, error } = await supabase
    .from("services")
    .upsert(record, { onConflict: "slug" })
    .select();

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Load seed services
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const seedPath = join(__dirname, "seed-services.json");
  const services = JSON.parse(readFileSync(seedPath, "utf-8"));

  console.log(`Loaded ${services.length} services from seed-services.json`);

  // Filter if --only flag is set
  const queue = ONLY_SLUG
    ? services.filter((s) => toSlug(s.name) === ONLY_SLUG)
    : services;

  if (queue.length === 0) {
    console.error(`No services matched slug "${ONLY_SLUG}".`);
    process.exit(1);
  }

  console.log(`Processing ${queue.length} service(s)...\n`);

  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < queue.length; i++) {
    const service = queue[i];
    const slug = toSlug(service.name);
    const progress = `[${i + 1}/${queue.length}]`;

    console.log(`${progress} Researching ${service.name} (${slug})...`);

    try {
      // Call Venice AI
      const rawResponse = await callVeniceAI(service);

      // Parse response
      const parsed = parseResponse(rawResponse);

      // Build the database record
      const record = {
        slug,
        name: service.name,
        domain: service.domain,
        logo_url: `https://logo.clearbit.com/${service.domain.split("/")[0]}`,
        category: service.category,
        normal_price: parsed.normal_price,
        retention_offer: parsed.retention_offer,
        estimated_savings: parsed.estimated_savings,
        confidence: parsed.confidence,
        cancel_steps: parsed.cancel_steps,
        tips: parsed.tips || null,
        source_notes: parsed.source_notes,
        last_verified: new Date().toISOString(),
      };

      if (DRY_RUN) {
        console.log(`  OK (dry run) — ${parsed.retention_offer}`);
        console.log(`  ${JSON.stringify(record, null, 2)}\n`);
      } else {
        // Upsert to Supabase
        await upsertService(record);
        console.log(`  OK — ${parsed.retention_offer}`);
      }

      results.success++;
    } catch (err) {
      console.error(`  FAILED — ${err.message}`);
      results.errors.push({ service: service.name, error: err.message });
      results.failed++;
    }

    // Rate-limit delay (skip after the last item)
    if (i < queue.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Summary
  console.log("\n========================================");
  console.log("Research complete!");
  console.log(`  Success: ${results.success}`);
  console.log(`  Failed:  ${results.failed}`);
  if (results.errors.length > 0) {
    console.log("\nFailed services:");
    for (const e of results.errors) {
      console.log(`  - ${e.service}: ${e.error}`);
    }
  }
  console.log("========================================\n");

  // Exit with error code if any failed
  if (results.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
