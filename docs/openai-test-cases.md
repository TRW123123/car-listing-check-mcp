# OpenAI submission test cases

The exact five positive and three negative submission cases, argument objects and locally asserted results are maintained in [submission/listing-openai.md](../submission/listing-openai.md) and [test-cases.json](../submission/test-cases.json). Local execution is covered by tests/submission.test.ts. Assistant routing still needs real client evaluation; the existing endpoint is live but this branch is not deployed.

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

