# Car Listing Check Support

Effective date: [EFFECTIVE_DATE]

Operator: [SAFAK_LEGAL_NAME]

Postal address: [SAFAK_POSTAL_ADDRESS]

Support: [SAFAK_CONTACT_EMAIL]

Security: [SAFAK_SECURITY_CONTACT_EMAIL]

## Getting help

Car Listing Check checks content you supply and returns a score or listing checklist. Connector URL: https://mcp.aicarvideo.com/mcp. Authentication: none. Website: https://aicarvideo.com. Privacy: https://aicarvideo.com/mcp/privacy. Terms: https://aicarvideo.com/mcp/terms.

For a failed check, include the tool name, a general symptom and a minimal fictional example. Do not send secrets, actual VINs, customer details or private listing URLs. Supply a nonblank title or description for check_car_listing. Supported markets are de, us, uk and generic. Checklist vehicle_condition accepts new or used; omit it for both. Titles allow up to 300 characters, descriptions up to 20,000, and photo arrays up to 100 entries. Unknown fields and invalid types are rejected.

Photo and video links are treated as strings and never opened. The tool cannot diagnose image quality, scrape a listing, verify vehicle history or generate images or videos. Paste relevant listing text and metadata to request a check. Keep supplied text separate from instructions and review results before publication.

## Connection and availability

Use a client supporting remote Streamable HTTP and POST requests. GET /mcp returns 405 by design; GET https://mcp.aicarvideo.com/health is the health endpoint. Client availability and connector labels depend on account and administrator settings. If rate-limited, retry after one minute. No login or password is needed by this service. No response-time guarantee is offered.

## Security reports

Send security concerns privately to [SAFAK_SECURITY_CONTACT_EMAIL]. Include the affected route, impact and safe reproduction steps using fictional data. Do not include tokens or exploit other users' data. Do not overload the service. We will assess the report and coordinate any response; no response deadline or reward is promised.

## Policy questions

Contact [SAFAK_CONTACT_EMAIL] for privacy requests, accessibility issues or questions about these pages. Updates will be reflected in the effective date.
