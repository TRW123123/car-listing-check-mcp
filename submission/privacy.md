# Car Listing Check Privacy Policy

Effective date: 2026-11-03

## Operator and contact

The operator and controller is Safak Tepecik, operating as AI Car Video, Heidestraße 2, 58239 Schwerte, Germany. Privacy questions and rights requests: hello@aicarvideo.com. Security reports: hello@aicarvideo.com.

## Data and purposes

Car Listing Check processes the title, description, optional vehicle specifications, broad location, photo URL strings/counts and shot labels, video URL strings/presence, market and language preferences that you send. Text may contain personal data if you include it. We use these data to return a deterministic completeness and presentation check or a static checklist. We do not fetch or scrape listing or media URLs, inspect images, verify vehicle facts, or generate images or videos. Do not include credentials, actual VINs, identity documents, customer records or unnecessary personal details.

The endpoint receives request bodies, protocol metadata and network metadata through its infrastructure. The application uses the Cloudflare-provided IP address for best-effort abuse protection in volatile Worker memory, with a one-minute counting window and a maximum of 2,048 buckets. Expired buckets are removed lazily on the next request carrying an IP, or on isolate recycling; an idle isolate can retain an expired bucket beyond one minute. IPs are not written to application logs or a database.

## Storage, logging and retention

The application processes listing inputs and results in request memory and does not persist them in a database or account. It logs one console event per tool call containing only the event type, recognised tool name (otherwise “unknown”), success/failure and elapsed milliseconds. It does not log listing content, URLs, IP addresses or generated trace/request identifiers. Optional Cloudflare Analytics Engine code sends only tool name, outcome and elapsed time if its binding is enabled; the checked-in configuration leaves it disabled. Application code has no log deletion scheduler or configured log retention duration. Provider log retention, proxy logging and production analytics configuration are controlled outside this repository and have not been independently verified. We cannot promise that infrastructure retains nothing or specify an unverified deletion period. Contact us for the settings applicable to your request.

## Recipients and infrastructure

The live endpoint uses the Netlify proxy site mcp-aicar-proxy in front of a Cloudflare Worker. Netlify and Cloudflare receive request contents and network metadata to route and operate the service and may retain infrastructure/security logs under their configurations and contracts. They may process data internationally, including outside your country. Applicable transfer safeguards depend on the operator's provider agreements and relevant law; contact us for details. The connected assistant provider also processes your conversation and tool data under its own policy. No other external service receives inputs through application code. The application has no Cloudflare Images binding, image-generation service, advertising tracking or listing database, and does not sell listing inputs.

## Legal grounds and controls

Where GDPR applies, processing necessary to deliver a requested service relies on Article 6(1)(b) where a contract applies; availability and narrowly scoped abuse prevention rely on the legitimate interest in operating a reliable service under Article 6(1)(f). These grounds apply only insofar as their legal conditions are met. Do not provide another person's data without an appropriate basis.

You choose what to submit, may omit optional fields and may stop using or disconnect the connector at any time. Depending on applicable law, you may request access, correction, erasure, restriction, portability or object to processing, including processing based on legitimate interests. Contact hello@aicarvideo.com with enough context to identify the issue, without resending sensitive listing content. There is no application account or saved listing record to retrieve or delete. Provider records may require separate handling. You may complain to your local data-protection supervisory authority; contact us for the authority competent for the operator.

## Children

The service is intended for adults preparing vehicle listings and is not directed to children. Do not use it if you are under 18. We do not request age or knowingly seek children's personal data. Contact us if a child has supplied personal data so we can assess available deletion steps.

## Changes

We will update the effective date when this policy changes and explain material processing changes on this page. Contact the operator for questions about the policy or current infrastructure settings.
