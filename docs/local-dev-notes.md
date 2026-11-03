# Local development notes

2026-11-03: npm install completed. Local Wrangler 4.157.0 started with `npx wrangler dev --port 8788 --ip 127.0.0.1`, reporting `Ready on http://127.0.0.1:8788`. No Cloudflare login, deployment or account binding was used.

The smoke script passed initialize (2025-06-18), tools/list (two tools) and check_car_listing (score 61/C for the documented sparse sample, 18 checks). The process was stopped after verification. This was a local test only. The endpoint is now live at https://mcp.aicarvideo.com/mcp through the Netlify proxy; submission-prep changes have not been deployed.

npm emitted install-script review notices for esbuild and workerd; both resolved binaries worked during local tests/startup. Initial Vitest 3 dependencies had audit advisories; the build upgraded to Vitest 5.1.0. The final dependency audit reported no vulnerabilities.

Performance tests use local wall time, not isolated Cloudflare CPU accounting. Confirm deployed CPU use before a public launch. The app does not persist input; Wrangler's local development diagnostics may capture development requests, so use fictional examples. `.wrangler` is gitignored.
