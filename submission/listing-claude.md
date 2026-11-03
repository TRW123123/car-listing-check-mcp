# Claude directory listing draft

- Name: Car Listing Check
  Character count: 17 / 100.
- One-liner: Check supplied vehicle listing text and photo metadata for missing information, clear presentation and prioritised fixes.
  Character count: 121 / 200.
- Long description: Review vehicle listings using text, structured vehicle fields and photo metadata you supply. Receive a completeness score, missing information and up to five prioritised fixes, or request a checklist for Germany, the US, the UK or a generic market. Results are in English and recognise common English and German keywords. URLs are treated as strings: the tools do not fetch or scrape listing pages or media, inspect images, verify vehicle facts, appraise vehicles or certify compliance. No AI image or video generation is provided. Recommendations are editorial guidance; verify facts and applicable requirements before publishing.
  Character count: 631 / 2000.

Suggested categories: Productivity; Business (two suggestions; confirm available directory labels in the submission form).

Developer: AI Car Video (operated by Safak Tepecik); must match the verified publisher identity.

## Example prompts

- Check this supplied listing: title Ford Focus Automatic; six photos.
- Give me a UK used-car listing checklist.
- Check this supplied German new-car title: New car. Condition: new; market: de.
- Check duplicate URL strings in my supplied photo list without opening them.

## Tools

### check_car_listing — Check Car Listing

Annotations: title=Check Car Listing, readOnlyHint=true, destructiveHint=false, idempotentHint=true, openWorldHint=false.

Checks supplied title/description, optional vehicle fields and photo metadata; returns score, grade, individual findings, missing fields and up to five fixes. Use when the user wants a check of content they supply. Do not use for URL retrieval, scraping, valuations, vehicle inspections, legal certification or media generation. At least a title (maximum 300 characters) or description (maximum 20,000) is required. Photo arrays allow 100 entries. URLs are never fetched; filenames and labels cannot verify image content. Inputs are not saved or modified; operational metrics are logged.

### get_car_listing_checklist — Car Listing Checklist

Annotations: title=Car Listing Checklist, readOnlyHint=true, destructiveHint=false, idempotentHint=true, openWorldHint=false.

Returns static recommended fields, photo order, title pattern and description structure. Use when the user wants preparation guidance for de, us, uk or generic, optionally new/used. Do not use for checking current portal rules, retrieving ads, inspections, legal certification or generating images/videos. No network access, saved listings or mutations; operational metrics are logged.

For both tools, readOnlyHint=true because they do not modify user resources; destructiveHint=false because they delete or overwrite nothing; openWorldHint=false because they do not contact external resources. Logging and optional infrastructure analytics are disclosed operational side effects, not external content retrieval. Input schemas and parameter examples are in src/schema.ts; the runtime descriptions are in src/tools.ts.

## Links

- Website: https://aicarvideo.com
- Documentation: https://github.com/TRW123123/car-listing-check-mcp/blob/submission-prep/README.md (private; reviewers need access or a public documentation page must be published first)
- Privacy: https://aicarvideo.com/mcp/privacy — page must be published first
- Terms: https://aicarvideo.com/mcp/terms — page must be published first
- Support: https://aicarvideo.com/mcp/support — page must be published first

## Authentication and data handling

Authentication: none. Remote transport: streamable-http at https://mcp.aicarvideo.com/mcp.

Data handling: supplied content is processed in request memory without an application database. Console logs contain recognised tool name, outcome and timing, without content, URLs or IPs. Optional Analytics Engine receives the same measures only when bound (disabled in checked-in configuration). IP rate-limit buckets use a one-minute window and lazy cleanup in volatile memory. Netlify and Cloudflare process request bodies and network metadata; infrastructure retention/settings need operator confirmation. No Cloudflare Images binding or outbound content requests exist. See privacy.md for limits and user controls.
