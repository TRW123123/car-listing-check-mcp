# Car Listing Check

Dealer vehicle listings often omit the information a buyer needs: exact specifications, known issues, service records, useful photos or a clear next step. This remote MCP server applies a consistent, inspectable checklist to content supplied by the user and returns a score and concrete fixes.

## Status: live endpoint; submission preparation

Version 0.1.2 is prepared on `submission-prep`; these changes need an approved redeploy. The existing live endpoint is **https://mcp.aicarvideo.com/mcp**, served through Netlify site `mcp-aicar-proxy` in front of the Cloudflare Worker. No deployment or submission is part of this preparation.

Display name: **Car Listing Check**. Website: https://aicarvideo.com. Developer: **AI Car Video** (operated by Safak Tepecik, per https://aicarvideo.com/about). Legal identity and contacts are filled in [submission/](submission/README.md). Tool descriptions and results contain no brand promotion.

## Tools

| Tool | Inputs | Outputs |
| --- | --- | --- |
| `check_car_listing` | Nonblank `title` (≤300 characters) or `description` (≤20,000); optional `fields`, `image_urls` (≤100 strings, ≤2,048 chars each) or `photo_count` (0–100), `photo_order`, `video_url`, `has_walkaround_video`, `market`, `language` | Score 0–100, grade A/B/C/D/F, checks with id/category/status/message/fix, up to five prioritised fixes, missing fields, detected language and scope |
| `get_car_listing_checklist` | Optional `market` (`de`, `us`, `uk`, `generic`, default generic), `vehicle_condition` (`new`, `used`) | Core fields, additional fields, recommended photo order, title pattern, description structure, market guidance and scope |

`fields` supports make, model, variant, price, currency, first_registration (`YYYY-MM`), model_year, mileage, mileage_unit (`km`/`mi`), fuel_type, power_kw/power_hp, transmission, body_type, color, doors, seats, previous_owners, condition (`new`/`used`), accident_free, service_history, inspection_due, vin_provided (boolean only), consumption, co2, energy_efficiency, location, known_damage and contact_provided. Numeric values are nonnegative and bounded; the discoverable JSON Schemas in [src/schema.ts](src/schema.ts) document every parameter and example. Unknown arguments are rejected.

Provide structured fields even when values appear in prose: missing-field checks inspect the field object and do not reliably extract specifications from natural language. Zero mileage and false booleans are preserved. No clean-title, accident-free, warranty or equipment claims are invented. Feature tips mean “list it if fitted and verified”. English results recognise common English/German keywords; automatic language detection is a simple heuristic.

Photo URLs are **never fetched**. URL count takes precedence over `photo_count`, including an empty array. Duplicate checks compare URL strings (normalised with fragments removed), not image pixels. Explicit `photo_order` takes precedence over obvious filename labels. No judgement of image quality, actual coverage or availability is possible. Recommended order: front 3/4, side, rear, front interior, dashboard, odometer, trunk, wheels/tyres, engine, damage where relevant. Count recommendation: at least 8 distinct photos, ideally 12–20. No portal minimum is claimed.

Scores use equal weighting: pass = 1, warn = 0.5, fail = 0, divided by the number of applicable checks and rounded to 100. A ≥90, B ≥75, C ≥60, D ≥40, F below 40. Fail fixes come before warn fixes, then checklist order. This is an editorial completeness score, not vehicle quality, valuation, compliance certification or a sales forecast. Title 30–80 and description 300–5,000 character windows are recommendations, not verified portal limits. See reference-path comments in [src/logic.ts](src/logic.ts).

Based on [Pkw-EnVKV Annex 4](https://www.gesetze-im-internet.de/pkw-envkv/anlage_4.html), German new-car guidance flags consumption, CO2 and energy-efficiency information under Pkw-EnVKV as a general publishing reminder. It does not determine applicable exceptions or validate values. **Not legal advice.** No website is fetched or scraped, no vehicle facts are verified, and no images, audio or videos are generated.

## Example prompts and output

ChatGPT: “Check this dealer listing for the generic market: title ‘Volkswagen Golf 1.5 TSI Automatic’. I have four photos. Tell me the highest-priority fixes.”

Claude: “Review this listing I supply: title ‘Volkswagen Golf 1.5 TSI Automatic’, photo_count 4. Which core details and photos are missing?”

Both map to:

```json
{"name":"check_car_listing","arguments":{"title":"Volkswagen Golf 1.5 TSI Automatic","photo_count":4}}
```

Verified local output excerpt (complete response includes all checks):

```json
{"score":61,"grade":"C","market":"generic","language":"en","top_fixes":[{"id":"core_data","priority":"high","fix":"Supply the missing fields from vehicle records; do not guess. Text may contain data that this structured-field check cannot recognise."}]}
```

Checklist prompt: “Give me a UK used-car listing checklist with a recommended photo sequence.” No listing URL is needed.

## Connect to the endpoint

The production endpoint above is live; these client configurations have not been evaluated end to end in assistant accounts. Local HTTP is usable by clients that permit localhost; hosted assistants normally need a publicly reachable HTTPS endpoint.

Claude: Settings → Connectors → Add custom connector → enter the remote URL `https://mcp.aicarvideo.com/mcp`. Labels and availability can vary by account. Claude Code:

```sh
claude mcp add --transport http car-listing-check https://mcp.aicarvideo.com/mcp
```

ChatGPT: enable Developer mode in the account/workspace settings, create a custom connector/app, enter the remote MCP URL, and select it in a conversation. Availability depends on account and administrator settings. See [official connection documentation](https://developers.openai.com/plugins/deploy/connect-chatgpt).

Codex, `~/.codex/config.toml`:

```toml
[mcp_servers.car-listing-check]
url = "https://mcp.aicarvideo.com/mcp"
```

Or `codex mcp add car-listing-check --url https://mcp.aicarvideo.com/mcp`. Syntax verified locally with `codex mcp add --help`; see [official MCP setup examples](https://developers.openai.com/learn/docs-mcp). No API key or login is needed by this server.

Cursor, `.cursor/mcp.json`:

```json
{"mcpServers":{"car-listing-check":{"url":"https://mcp.aicarvideo.com/mcp"}}}
```

## Local development

Use Node.js 22 or newer supported by the locked Wrangler release.

```sh
npm install
npm run dev
# In another terminal:
npm run typecheck
npm test
bash scripts/smoke.sh http://127.0.0.1:8788
npm run secret-scan
```

`npm run dev` uses local Wrangler on 127.0.0.1:8788 without Cloudflare bindings or login. The smoke script defaults to port 8787 when no URL is provided, so pass 8788 explicitly for this project. Dependencies are local devDependencies; no runtime dependency or paid API is used. Do not deploy or submit without operator approval.

`POST /mcp` supports initialize, notifications/initialized, ping, tools/list and tools/call. Responses use application/json; notifications return HTTP 202 with no body. It is stateless: no sessions or auth. Negotiated versions: 2025-03-26, 2025-06-18 and 2025-11-25, default 2025-06-18 for unsupported initialize versions. Unknown protocol headers are rejected. GET /mcp returns 405; GET /health returns `{"status":"ok"}`; GET / explains the service. CORS allows any origin and the MCP headers. JSON-RPC response ids only correlate the client's own ids; no generated trace/request ids are added.

Body limit: 300,000 UTF-8 bytes; body read timeout: five seconds; arrays max 100; output bounded by a fixed checklist. Batches are rejected. A best-effort isolate-local IP limiter permits 120 POSTs/minute and holds at most 2,048 short-lived buckets. IPs stay in volatile memory for a one-minute counting window, are not logged or persisted, and disappear on lazy expiry cleanup or isolate recycling; idle isolates may retain expired buckets longer. This is not a global limit; edge protection needs operator configuration before public launch. URLs cannot trigger SSRF because there is no outbound fetch. A warm local benchmark exercises maximum-size listing text and 100 URLs; it is indicative wall time, not a guarantee of deployed Workers CPU usage. Measure production CPU before launch.

## Privacy and operations

Inputs are processed in memory only and never stored by the application. Avoid private contact details, actual VINs, credentials and documents containing personal data. Tools need only listing text, town/region and VIN availability. Application logs record one anonymous line per tool call: `{"evt":"tool_call","tool":"check_car_listing","ok":true,"ms":1}`. Unknown tool names log as `unknown`, preventing arbitrary input from entering logs. No inputs or IPs enter logs. Cloudflare and the Netlify proxy process request contents and network metadata independently; operator settings and retention need review. IP bucket expiry is lazy: stale entries are removed on the next request with an IP, or on isolate recycling.

Optional Workers Analytics Engine support is guarded by `if (env.ANALYTICS)`. To enable after operator approval, uncomment the dataset block in wrangler.toml and configure the dataset in the operator's account. Data points use blobs `[tool, "true" or "false"]` and doubles `[milliseconds]` only. Review provider limits before enabling. Console logging remains enabled. Set a retention policy before launch; no production retention or processor terms have been confirmed. Review aggregate tool selection weekly and configure an external uptime monitor for /health after deployment. No external monitoring is set up.

Drafts: [Privacy](docs/privacy-policy.md), [Terms](docs/terms-of-service.md), [Support and security contact](docs/support.md), [Catalog metadata](docs/listing.md), [Submission cases and golden prompts](docs/openai-test-cases.md). Contact and postal details are filled from aicarvideo.com (privacy, terms, about).

`server.json` is prepared for `com.aicarvideo/car-listing-check`, using the [2025-12-11 registry schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json). It is NOT published. Domain authentication (DNS TXT or the registry well-known route) and Safak's approval remain required; no key or challenge is created. Before catalog submission: confirm domain and URLs, publish approved legal/support documents, verify developer identity, review the prepared square icon and record the demonstration video, run the golden prompts in real ChatGPT/Claude accounts, confirm retention/hosting terms and monitor the live service. Neither assistant end-to-end evaluation nor catalog acceptance is claimed.

MIT license, copyright Safak Tepecik.
