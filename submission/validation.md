# Local validation — 2026-11-03

- npm test: 71 tests passed across 4 files, including 5 exact submission positive cases through the Worker JSON-RPC handler with network fetch forbidden. All 5 full structured results match test-cases.json. Output checks reject promotional domains, URLs and generated trace/request ID fields in those examples.
- npm run typecheck: passed, zero TypeScript errors.
- Official registry schema: downloaded https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json using curl; server.json passed Ajv draft-07 validation, including URI checks. The three official registry documentation pages were fetched successfully. Schema validation does not prove domain ownership or publication readiness.
- Character counts: metadata limits asserted locally; displayName 17/30, shortDescription 29/30, longDescription 631/2000 (also below OpenAI 4000), one-liner 121/200. Starter prompts are 68, 40 and 78 characters (each below 128).
- Icon: rendered original SVG with @resvg/resvg-js installed under a temporary directory outside the repository. PNG IHDR confirms 512×512; visually inspected. No new repository dependencies.
- Legal HTML: generated from the three submission Markdown sources using marked installed outside the repository. Three standalone pages have English language, unique title and description, canonical URL, navigation and no noindex directive. Operator placeholders are preserved. Output lives under /home/box/shared/seo/mcp-legal-pages/aicarvideo.com/, outside any website repository.
- bash scripts/secret-scan.sh: gitleaks working-tree and existing-history scans passed with no leaks. A final scan is run before the branch push.

No live assistant routing evaluation, catalog acceptance, domain proof, legal-page publication, deployment or registry publication is claimed. Three negative cases describe expected assistant routing and still require real-client evaluation. Infrastructure retention and runtime bindings cannot be established from this source alone. No secrets directory was read.
