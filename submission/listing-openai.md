# OpenAI listing draft

- displayName: Car Listing Check
  Character count: 17 / 30.
- shortDescription: Check vehicle listing details
  Character count: 29 / 30.
- longDescription: Review vehicle listings using text, structured vehicle fields and photo metadata you supply. Receive a completeness score, missing information and up to five prioritised fixes, or request a checklist for Germany, the US, the UK or a generic market. Results are in English and recognise common English and German keywords. URLs are treated as strings: the tools do not fetch or scrape listing pages or media, inspect images, verify vehicle facts, appraise vehicles or certify compliance. No AI image or video generation is provided. Recommendations are editorial guidance; verify facts and applicable requirements before publishing.
  Character count: 631 / 4000.

Category suggestion: Productivity (confirm form options).

Developer: AI Car Video (operated by Safak Tepecik); must match the verified publisher identity.

## Starter prompts

- Starter 1: Check this supplied listing: title Ford Focus Automatic; six photos.
  Character count: 68 / 128.
- Starter 2: Give me a UK used-car listing checklist.
  Character count: 40 / 128.
- Starter 3: Check this supplied German new-car title: New car. Condition: new; market: de.
  Character count: 78 / 128.

## Required URLs

- websiteURL: https://aicarvideo.com
- supportURL: https://aicarvideo.com/mcp/support — page must be published first
- privacyPolicyURL: https://aicarvideo.com/mcp/privacy — page must be published first
- termsOfServiceURL: https://aicarvideo.com/mcp/terms — page must be published first

Documentation: the private repository README requires reviewer access; publish accessible documentation before submission if required.

## Tools and annotations

### check_car_listing — Check Car Listing

Annotations: title=Check Car Listing, readOnlyHint=true, destructiveHint=false, idempotentHint=true, openWorldHint=false.

Checks supplied title/description, optional vehicle fields and photo metadata; returns score, grade, individual findings, missing fields and up to five fixes. Use when the user wants a check of content they supply. Do not use for URL retrieval, scraping, valuations, vehicle inspections, legal certification or media generation. At least a title (maximum 300 characters) or description (maximum 20,000) is required. Photo arrays allow 100 entries. URLs are never fetched; filenames and labels cannot verify image content. Inputs are not saved or modified; operational metrics are logged.

### get_car_listing_checklist — Car Listing Checklist

Annotations: title=Car Listing Checklist, readOnlyHint=true, destructiveHint=false, idempotentHint=true, openWorldHint=false.

Returns static recommended fields, photo order, title pattern and description structure. Use when the user wants preparation guidance for de, us, uk or generic, optionally new/used. Do not use for checking current portal rules, retrieving ads, inspections, legal certification or generating images/videos. No network access, saved listings or mutations; operational metrics are logged.

For both tools, readOnlyHint=true because they do not modify user resources; destructiveHint=false because they delete or overwrite nothing; openWorldHint=false because they do not contact external resources. Logging and optional infrastructure analytics are disclosed operational side effects, not external content retrieval. Input schemas and parameter examples are in src/schema.ts; the runtime descriptions are in src/tools.ts.

## Authentication and data handling

Authentication: none. Remote transport: streamable-http at https://mcp.aicarvideo.com/mcp.

Data handling: supplied content is processed in request memory without an application database. Console logs contain recognised tool name, outcome and timing, without content, URLs or IPs. Optional Analytics Engine receives the same measures only when bound (disabled in checked-in configuration). IP rate-limit buckets use a one-minute window and lazy cleanup in volatile memory. Netlify and Cloudflare process request bodies and network metadata; infrastructure retention/settings need operator confirmation. No Cloudflare Images binding or outbound content requests exist. See privacy.md for limits and user controls.

## Test cases

The five positive and three negative cases below are the complete submission set. Positive argument/result assertions run against local code in tests/submission.test.ts. Inputs are fictional examples suitable for public demonstration; example.org URLs are strings only. Local tests do not prove assistant tool selection. Negative cases are routing expectations to verify in an assistant account.

### P1 — positive

Prompt: Check this supplied listing: title Ford Focus Automatic; six photos.

Expected tool: `check_car_listing`

Exact arguments:

```json
{
  "title": "Ford Focus Automatic",
  "photo_count": 6
}
```

Expected result (locally confirmed): Score 58/100, grade D, market generic, language en. core_data: fail — Missing structured core data: make, model, price, currency, mileage, mileage_unit, fuel_type, transmission, condition, location, first_registration, service_history. photo_count: warn — 6 photos reported. Recommended minimum 8; ideal 12–20 distinct views; no portal requirement implied.  Full deterministic result is in test-cases.json and is asserted locally.

### P2 — positive

Prompt: Review this supplied German listing: Zustand gut, Sitzheizung, 60.000 km.

Expected tool: `check_car_listing`

Exact arguments:

```json
{
  "description": "Zustand gut, Sitzheizung, 60.000 km."
}
```

Expected result (locally confirmed): Score 58/100, grade D, market generic, language de. equipment: warn — Equipment topics not detected: navigation, LED headlights, adaptive cruise control, parking sensors, camera, Apple CarPlay / Android Auto, tow bar, air conditioning, alloy wheels, sunroof. Keyword presence does not prove fitment. condition_disclosure: pass — Condition and known-issue wording check.  Full deterministic result is in test-cases.json and is asserted locally.

### P3 — positive

Prompt: Check this supplied German new-car title: New car. Condition: new; market: de.

Expected tool: `check_car_listing`

Exact arguments:

```json
{
  "title": "New car",
  "market": "de",
  "fields": {
    "condition": "new"
  }
}
```

Expected result (locally confirmed): Score 55/100, grade D, market de, language en. new_car_energy: warn — General guidance: new cars need applicable Pkw-EnVKV consumption, CO2 and energy-efficiency information; supplied values are not compliance-checked.  Full deterministic result is in test-cases.json and is asserted locally.

### P4 — positive

Prompt: Give me a UK used-car listing checklist.

Expected tool: `get_car_listing_checklist`

Exact arguments:

```json
{
  "market": "uk",
  "vehicle_condition": "used"
}
```

Expected result (locally confirmed): Market uk, vehicle_condition used; required_fields includes inspection_due; photo_shots begins front_3_4, side, rear. Full deterministic result is in test-cases.json and is asserted locally.

### P5 — positive

Prompt: Check this supplied title Car and these photo URL strings for duplicates without opening them: https://example.org/front_3_4.jpg and https://example.org/front_3_4.jpg#copy.

Expected tool: `check_car_listing`

Exact arguments:

```json
{
  "title": "Car",
  "image_urls": [
    "https://example.org/front_3_4.jpg",
    "https://example.org/front_3_4.jpg#copy"
  ]
}
```

Expected result (locally confirmed): Score 61/100, grade C, market generic, language en. photo_count: warn — 2 photos reported. Recommended minimum 8; ideal 12–20 distinct views; no portal requirement implied. photo_duplicates: warn — 1 duplicate URL entries detected; different URLs may still show the same image.  Full deterministic result is in test-cases.json and is asserted locally.

### N1 — negative

Prompt: Open a mobile.de URL and scrape the listing and photos.

Expected tool: none. Expected arguments: none.

Expected result: Do not invoke either tool for retrieval. Explain that URLs are not fetched and request pasted content for a check.

### N2 — negative

Prompt: Generate a walkaround video and images of this car.

Expected tool: none. Expected arguments: none.

Expected result: Do not invoke either tool. Explain that AI image and video generation is outside scope.

### N3 — negative

Prompt: Certify that my warranty disclaimer is legally valid.

Expected tool: none. Expected arguments: none.

Expected result: Do not invoke either tool for legal certification. Explain that qualified legal review is needed.


## Release notes — v0.1.2

Align package, server and registry versions; switch website and registry namespace to aicarvideo.com; clarify supplied-data checks, no AI image/video generation and operational logging. Retain tool names and accepted input schemas. Include make-alias/title and photo-filename fixes shipped on main in 0.1.1. These branch changes require an approved Worker redeploy before live metadata matches.

## Domain challenge — instructions only

The exact token provided by OpenAI must be returned as plain text with HTTP 200 at https://mcp.aicarvideo.com/.well-known/openai-apps-challenge. Do not put HTML, JSON or an example token there. This is separate from the registry proof on aicarvideo.com.

The MCP host is Netlify site mcp-aicar-proxy, forwarding to the Cloudflare Worker. Option A: add an exact Worker GET route for this path and a deployment environment variable holding the supplied token; redeploy only after approval, and ensure the Netlify proxy forwards that path. Option B: place a plain-text file at public/.well-known/openai-apps-challenge (or the configured publish directory) on the Netlify proxy site, served before the catch-all proxy rewrite; publish only after approval. Verify the public host returns the exact token. No token route, environment setting or file is implemented here.

Sources checked 2026-11-03: [OpenAI submission documentation](https://developers.openai.com/plugins/deploy/submission), [OpenAI guidelines](https://developers.openai.com/plugins/plugin-guidelines). Character limits here follow the requested preparation brief; confirm current dashboard fields before submission.
