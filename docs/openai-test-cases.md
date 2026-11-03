# OpenAI submission test cases — DRAFT

Prepared cases only. No real ChatGPT/Claude connector evaluation has been performed; no public endpoint exists. Expected behaviour is the test oracle, not a claimed observed outcome.

## Positive cases (exactly 5)

1. Prompt: “Check this supplied title: Ford Focus Automatic. I have six photos.”
   Expected tool: `check_car_listing`. Expected behaviour: Return a score, missing structured data and photo recommendations.

2. Prompt: “Review my supplied German listing: Zustand gut, Sitzheizung, 60.000 km.”
   Expected tool: `check_car_listing`. Expected behaviour: Detect German keywords; return English findings without inventing equipment.

3. Prompt: “Check this new-car ad for Germany using my supplied title and fields.”
   Expected tool: `check_car_listing`. Expected behaviour: Flag missing applicable energy disclosures as general guidance, not compliance certification.

4. Prompt: “Give me a UK used-car listing checklist.”
   Expected tool: `get_car_listing_checklist`. Expected behaviour: Return MOT/inspection guidance, fields and ordered shots.

5. Prompt: “Check this supplied ad and image URL list for duplicates; do not open the links.”
   Expected tool: `check_car_listing`. Expected behaviour: Compare URL strings only and disclose limits; no network calls.

## Negative cases (exactly 3)

1. Prompt: “Open a mobile.de URL and scrape the listing and photos.”
   Expected tool: None. Expected behaviour: Do not invoke either tool to fetch; ask for pasted content if a check is wanted.

2. Prompt: “Generate a walkaround video and images of this car.”
   Expected tool: None. Expected behaviour: Do not invoke; media generation is outside scope.

3. Prompt: “Certify that my warranty disclaimer is legally valid.”
   Expected tool: None. Expected behaviour: Do not invoke for legal certification; explain the scope.

## Golden prompt set

For execution after deployment: run each prompt in both assistants, record actual tool selection and correctness, then compute precision = correct invocations / all invocations and recall = correctly invoked applicable cases / all applicable cases. Record date, client version, outcome and no private content. Direct/indirect cases should select the relevant check/checklist tool; negative cases should select neither. Supply fictional listing text where a prompt refers to it.

### Direct (10)

1. Score this pasted dealer listing.
2. Check my listing title for shouting.
3. Review my supplied description for missing equipment topics.
4. Check my supplied photo URLs for duplicates.
5. Give me a German new-car listing checklist.
6. Give me a US used-car listing checklist.
7. Check this listing with four reported photos.
8. Check this description for vague condition wording.
9. Review these photo shot labels in order.
10. Check the price and contact transparency of this pasted ad.

### Indirect (10)

1. What information is missing from this pasted car ad?
2. Could buyers understand the condition from my text below?
3. I have only front photos; what else should my listing include?
4. How should I organise a dealer ad before publishing?
5. My description says full spec but names no features; what should I change?
6. Is this supplied title too repetitive?
7. What should I photograph for a used-car listing?
8. Help me prioritise improvements to this listing text.
9. What should go between the vehicle overview and contact section?
10. My German new-car ad has no consumption data; what should I review?

### Negative (10)

1. Scrape AutoScout24 for me.
2. Generate a vehicle video.
3. Make synthetic photos of my car.
4. Tell me whether this car is mechanically safe.
5. Verify this VIN against a database.
6. Find the cheapest Golf near me.
7. Certify my dealership is legally compliant.
8. Publish my ad on a portal.
9. Log into my dealer account.
10. Estimate resale value from current market ads.

