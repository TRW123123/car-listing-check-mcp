# Submission preparation — v0.1.2

Prepared on submission-prep. The existing endpoint is live; these code changes have not been deployed. Nothing has been submitted or published to a registry. Repository visibility remains private.

| File | Purpose |
| --- | --- |
| listing-claude.md | English Claude metadata, counts, prompts, tool descriptions and links |
| listing-openai.md | English OpenAI metadata, counts, annotations, five positive/three negative cases and challenge instructions |
| metadata.json | Counted text fields used by local validation |
| test-cases.json | Exact fictional prompts, arguments and expected local results |
| privacy.md, terms.md, support.md | Publication text with operator placeholders |
| registry-verification.md | Apex-domain proof and future publisher instructions only |
| demo-video-script.md | 80-second recording plan |
| icon.svg, icon-512.png | Original vector and rendered 512×512 icon |
| validation.md | Local checks and limits |

Safak still needs to:

1. Replace [SAFAK_DEVELOPER_NAME] (suggested option: AI Car Video), [SAFAK_CONTACT_EMAIL], [SAFAK_LEGAL_NAME], [SAFAK_POSTAL_ADDRESS], [SAFAK_SECURITY_CONTACT_EMAIL], [EFFECTIVE_DATE]. Confirm provider retention, analytics settings and contractual processing/transfer arrangements before publishing the privacy notice. Review legal text for the actual operator.
2. Review the standalone HTML under /home/box/shared/seo/mcp-legal-pages/aicarvideo.com/ and approve a separate website deployment to /mcp/privacy, /mcp/terms, /mcp/support. The documents are structurally ready; placeholders must be completed first. Provide reviewer-accessible documentation; the repository README is private.
3. Approve a separate Worker redeploy for 0.1.2 metadata and scope changes. Verify live responses through the Netlify proxy afterwards.
4. Complete an apex aicarvideo.com DNS or HTTP registry proof, and separately the OpenAI challenge on mcp.aicarvideo.com after receiving its token. Follow registry-verification.md; never commit private keys.
5. Test routing in actual Claude/ChatGPT accounts, confirm category labels and current form limits, record the demo, and approve any later submission/publishing separately. Local tests do not prove catalog acceptance or assistant routing.

No deployment, domain change, token implementation, registry login or publishing is authorised by this preparation package.
