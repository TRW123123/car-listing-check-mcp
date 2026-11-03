# Demo video script — 80 seconds

Record a real client session after the approved release is available. Do not simulate tool calls. Hide account details and use only the fictional prompts below. Exact menu wording depends on client version. This is a shot list, not a recorded video.

| Time | Shot and action | Exact prompt or on-screen text |
| --- | --- | --- |
| 00–08 | Show title card | Car Listing Check — supplied text and metadata checks |
| 08–23 | In ChatGPT developer mode, add the remote connector/app; alternatively use Claude Settings → Connectors → Add custom connector. Show URL and no authentication. | https://mcp.aicarvideo.com/mcp |
| 23–43 | Select connector, paste prompt, expand check_car_listing arguments/result. Show missing fields and score. | Check this supplied listing: title Ford Focus Automatic; six photos. |
| 43–61 | Paste second prompt, expand get_car_listing_checklist and photo guidance. | Give me a UK used-car listing checklist. |
| 61–73 | Paste negative prompt; show assistant explaining the limit and no tool call in activity. If the client calls a tool, fix routing and re-record honestly. | Generate a walkaround video and images of this car. |
| 73–80 | Close with scope and website | Checks supplied data. No URL fetching or scraping. No AI image or video generation. aicarvideo.com |

Narration: “Supply the listing text and metadata. The check returns missing information and prioritised editorial fixes. The checklist helps plan vehicle details and photos. This service does not generate media or verify vehicle facts.”

Expected first result: score 58/100, grade D, missing make/model and other structured fields; six reported photos are below the recommended eight. Second result: UK used checklist includes inspection_due. Confirm actual live results before recording. Do not display authentication tokens or private account data.
