# Country-specific pathway plan

Plan only. Do not edit the seven pages, `src/data/program.ts`, or any layout in this step.

Pages:

- `/pathways/eb5-for-indian-students`
- `/pathways/eb5-for-indian-families`
- `/pathways/eb5-for-indian-investors`
- `/pathways/eb5-for-indian-h1b`
- `/pathways/eb5-for-chinese-students`
- `/pathways/eb5-for-chinese-families`
- `/pathways/eb5-for-chinese-investors`

## Summary

| Page | Now, share with country pair | Now, on any other pathway | Projected worst share with any pathway page | Words in main now | Projected words |
| --- | --- | --- | --- | --- | --- |
| Indian families | 68% (26/38) | 74% (28/38) | 26% vs Chinese families (8/31) | 768 | 711 |
| Chinese families | 67% the other way (26/39) | 67% (26/39) | 26% vs Indian families (8/31) | 721 | 655 |
| Indian students | 58% (18/31) | 61% (19/31) | 23% vs Indian H-1B (7/30) | 677 | 707 |
| Chinese students | 58% (18/31) | 61% (19/31) | 23% vs Chinese investors (7/30) | 690 | 717 |
| Indian investors | 48% (16/33) | 52% (17/33) | 21% vs Chinese investors (7/33) | 763 | 764 |
| Chinese investors | 47% the other way (16/34) | 53% (18/34) | 20% vs Chinese students (7/35) | 764 | 791 |
| Indian H-1B | no country pair | 27% (7/26) | 23% vs Indian students (7/30) | 585 | 669 |

Projected country-pair shares after the edits: families 26%, students 20%, investors 21%. Every page stays above 450 words. No projected page shares more than 30% of its 8-word-or-longer sentences with any other pathway page.

The projected numbers are a sentence-set model of the replacements below, using the same splitter as `scripts/measure-duplication.mjs`. Layout sentences stay. After the pages are edited, rebuild and run the script. The rebuilt HTML is the check, not this table.

## Measurement

`node scripts/measure-duplication.mjs` on the current `dist/pathways` build printed:

```
Indian families vs Chinese families: 68% (26/38)
Indian students vs Chinese students: 58% (18/31)
Indian investors vs Chinese investors: 48% (16/33)

eb5-for-indian-families: 74% (28/38)
eb5-for-chinese-families: 67% (26/39)
eb5-for-indian-students: 61% (19/31)
eb5-for-chinese-students: 61% (19/31)
eb5-for-indian-investors: 52% (17/33)
eb5-for-chinese-investors: 53% (18/34)
eb5-for-indian-h1b: 27% (7/26)
```

Method, also commented in the script:

- Built `dist/pathways/<slug>/index.html`, inside `<main>` only.
- Drop `<script>` and `<style>`, strip tags, decode entities, collapse whitespace.
- Split on `.` `!` or `?` followed by whitespace. `U.S.` and `vs.` end a measured sentence. That is why several shared rows below stop at `(U.S` or `(EB-5 vs`.
- Keep a sentence when it has 8 or more words. Compare unique sentences.
- Pairwise percent is the first page's sentences that also appear on the second page, rounded to the nearest integer.
- "Any other" uses every built page under `dist/pathways`, not only these seven.

FAQ answers are not in this set. `ProcessFaqAccordion` puts the answer text in the island payload, which the script strips with `<script>`. The visible questions are in the set. This plan does not change any FAQ question or answer, so it does not change FAQ JSON-LD.

## Unchanged on every page

- `title`, `metaDescription`, slug, `h1`, and `subhead` (the opening paragraph).
- Existing `h2` text. Those are the section anchors. New `h2` elements are not part of this plan.
- FAQ questions and answers. No JSON-LD change.
- Dollar amounts. The investor sentence that contains `$800,000` stays character for character. Do not edit `TEA_INVESTMENT_THRESHOLD` or any other amount.

Opening paragraphs that stay:

- Indian families: "What families need to document before moving capital toward an EB-5 investment, and why the paper trail matters as much as the funds."
- Chinese families: "What families need to document before moving capital toward a child's EB-5 investment, and why the paper trail matters as much as the funds."
- Indian students: "A self-sponsored path to a U.S. green card for Indian F-1 students (independent of the H-1B lottery and employer sponsorship)."
- Chinese students: "A self-sponsored path to a U.S. green card for Chinese F-1 students (independent of the H-1B lottery and employer sponsorship)."
- Indian investors: "What Indian nationals need to know about investment requirements, visa category timing, and the filing process before pursuing an EB-5 green card."
- Chinese investors: "What Chinese nationals need to know about investment requirements, visa category timing, and the filing process before pursuing an EB-5 green card."
- Indian H-1B: "Why some Indian H-1B holders evaluate EB-5 when employment-based green card timelines tied to India chargeability feel out of their control."

Section anchors that stay:

- Families: Who this page is for. How the gift structure typically works. Common documentation questions. Tax and advisory considerations.
- Students: The two paths after graduation. Why Indian F-1 students look at EB-5, or Why Chinese F-1 students look at EB-5. How parental funding usually works. Timing considerations.
- Investors: Investment requirements. Visa category and timing (the existing heading, including the country name). The filing process, in brief. Choosing a project. For students and H-1B professionals, or For students and families.
- Indian H-1B: India chargeability and why EB-5 enters the conversation. A separate process from your H-1B employer petition. IT staffing and consulting H-1B holders. Next steps.

## Layout sentences (KEEP on all seven)

These six are inside `<main>` and are identical on pathway pages because they come from `PreferredSourcesCTA`, `ConsultationCTA`, and `LegalDisclaimer`. Do not rewrite those components for this pass. They are part of the residual share (about 6 sentences).

1. Follow StudentEB5 on Google Add StudentEB5 as a preferred source to see more of our research, guides, and analysis in Google Search
2. Find out if EB-5 fits your situation and learn the next step
3. Honest assessment of your situation We'll tell you if it's not a fit No obligation Website Full Name * Work or School Email * 100% confidential
4. Phone Number (optional) LinkedIn profile (optional) Get My Free Evaluation By submitting, you agree to receive communications about EB-5 programs
5. This content is for educational purposes only and does not constitute legal or investment advice
6. For your specific situation, consult a licensed immigration attorney and FINRA-registered financial advisor

Photo credits stay. "Photograph credits Photo by Sidharth Kumar on Unsplash" is shared by Indian families and Indian investors. "Photograph credits Photo by Nishith Parikh on Unsplash" is shared by Indian students and Indian H-1B. Action on each of those pages: KEEP.

One layout fragment stays because the Chinese families H1 is unchanged and `U.S.` ends the sentence: "Related Pathways How Chinese Parents Can Fund an EB-5 Investment for a Child in the U.S." It is shared by Chinese students and Chinese investors. KEEP. Do not change RelatedPathways or that H1 to chase it.

## Constants to add later

Add these next to `VISA_BULLETIN_LATEST_MONTH` in `src/data/program.ts` when the pages are edited. Do not add them in this commit.

```ts
/** November 2026 Visa Bulletin, Employment-Based Final Action, 5th Unreserved (C5, T5, I5, R5, NU, RU). */
export const EB5_UNRESERVED_FINAL_ACTION_CHINA = '2016-12-01';
export const EB5_UNRESERVED_FINAL_ACTION_INDIA = '2023-12-01';
export const VISA_BULLETIN_NOVEMBER_2026_URL =
  'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html';
```

Same chart, same month, for sentences that compare categories. These are not investment amounts.

- India EB-2 final action: November 1, 2013 (01NOV13)
- India EB-3 final action: January 22, 2014 (22JAN14)
- China EB-2 final action: October 1, 2021 (01OCT21)
- China EB-3 final action: January 22, 2022 (22JAN22)
- 5th set-aside rural, high unemployment, and infrastructure: C (current) for China and for India

Pages should import the two unreserved constants and the bulletin URL. Do not hardcode a second copy of the dates.

### How the dates were confirmed

The Department of State bulletin index lists "Visa Bulletin For November 2026" under Fiscal Year 2027: https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html

The month page is the FY2027 path above, not the `/2026/visa-bulletin-for-november-2026.html` path. A direct fetch of travel.state.gov returned Cloudflare 403, including in a browser tab that stopped on the verification page. The bulletin text that matches Department of State Publication 9514, CA/VO October 5, 2026, Number 20 Volume XI, is published in full at https://www.immigration.com/visa-bulletin/visa-bulletin-november-2026. That copy's employment-based final action chart has 5th Unreserved China 01DEC16 and India 01DEC23, and the three set-asides at C. Foster Global and Heller Immigration publish the same two unreserved cells.

Before the constants are committed, open the travel.state.gov November 2026 URL in a normal browser and check those cells. If they differ, do not ship the sentences below.

## Shared sentences and actions

Each page list below is every measured sentence on that page that also appears on at least one other pathway page, after the six layout sentences and any photo-credit KEEP noted above. Quoted text is the measured sentence, not the source paragraph.

LINK-OUT means delete the shared wording and leave one new sentence that links to the owner. REPLACE means the proposed sentence below. Proposed sentences avoid `U.S.` and `vs.` so the country name is not cut off by the splitter.

### Indian families

KEEP (FAQ questions, unchanged):

- Common documentation questions Does the student have to prove they earned the investment money themselves
- How far back does source of funds documentation need to go

LINK-OUT. Remove these. The gift letter and the path of funds are owned by `/pathways/eb5-gifted-funds` and `/pathways/eb5-source-of-funds`.

- This is a normal and accepted structure in EB-5
- USCIS does not require the investor to have personally earned the investment capital
- What USCIS does require is a clear, documented, lawful trail showing where the money came from and how it reached the investor
- This page focuses on that funding and documentation process; for the broader student decision (EB-5 vs
- the H-1B path), see our guide to EB-5 for Indian international students
- How the gift structure typically works Establish the gift relationship
- A parent (or other family member) formally gifts funds to the student investor, documented with a signed gift letter or deed of gift
- USCIS looks through to the original source of the gifted funds, not just the gift itself
- This can include income records, business ownership documentation, property sale records, or other lawful sources going back multiple years
- Bank records showing the money moving from the parent's account to the student's account, and then to the new commercial enterprise or regional center escrow account, need to form a complete, unbroken paper trail
- Gathering these records early (ideally before a project is selected or a petition is filed) gives families more time to address any gaps

Replacement sentences under the existing headings:

- The gift letter for an Indian parent, and the records that show the gift reached the student, are on the EB-5 with gifted funds page.
- The lawful-source file those records have to support is on the EB-5 source of funds page.
- The student decision for an Indian F-1 applicant is on the EB-5 for Indian international students page.
- How the gift structure typically works For an Indian family, start with the EB-5 with gifted funds page and the EB-5 source of funds page rather than restating those steps here.

The first three are body sentences. The fourth is the measured form of the unchanged h2 glued to the new first sentence. Links: `/pathways/eb5-gifted-funds`, `/pathways/eb5-source-of-funds`, `/pathways/eb5-for-indian-students`.

REPLACE the two existing LRS sentences (they are unique today, and they tell the reader not to rely on a figure). New text, from the RBI Master Direction on the Liberalised Remittance Scheme, updated September 6, 2024: https://www.rbi.org.in/Scripts/BS_ViewMasterDirections.aspx?id=10192

- Under the Reserve Bank of India Liberalised Remittance Scheme, an authorised dealer may allow a resident individual to remit up to USD 250,000 per financial year, April through March, for a permitted current or capital account transaction.
- The scheme is not available to companies, partnership firms, Hindu Undivided Families, or trusts.
- A resident individual may remit up to that annual amount as a gift to a person resident outside India.
- For a capital-account remittance, the Master Direction tells the bank to obtain the prior-year bank statement or, if none is available, the latest income-tax assessment order or return.
- The same direction says banks should not extend credit to a resident individual to fund a capital-account remittance under the scheme.

USD 250,000 here is the RBI remittance cap, not the EB-5 investment amount. Do not present it as the EB-5 threshold, and do not change the EB-5 thresholds.

REPLACE the tax block. No new tax rule. The rewrite only stops `U.S.` from making the India and China pages share a fragment.

- Tax and advisory considerations This page does not give tax advice for capital moving from India to an EB-5 investment.
- A family in India should have a cross-border tax adviser and a United States immigration attorney review the transfer before money moves.

Remove the old measured fragments: "Tax and advisory considerations Moving investment capital across borders can carry tax implications on both sides (U.S", "and India), separate from the immigration process itself", "This page does not provide tax or legal advice", "Families considering this path typically work with a cross-border tax adviser and a U.S", and "immigration attorney together, early in the process, rather than addressing tax questions after funds have already moved".

REPLACE shared card blurbs and the shared CTA line. Keep the card URLs.

- Gift, loan, and other lawful funding paths USCIS reviews when the investor's capital is coming from India.
- What an Indian family should verify before committing capital and filing Form I-526E.
- Talk with someone about an EB-5 remittance from India Talk to Someone Who Knows EB-5 Book a free 30-minute consultation

That last line is the measured CTA after `secondaryCtaText` becomes "Talk with someone about an EB-5 remittance from India".

REPLACE the extra-compliance paragraph so it is not identical to the Chinese families page.

- This page provides educational information about EB-5 funding from India and does not constitute legal, financial, tax, or immigration advice.
- Consult a qualified immigration attorney and a cross-border tax adviser before a family in India moves investment capital or signs a gift arrangement.

### Chinese families

KEEP the same two FAQ question sentences as Indian families.

LINK-OUT the same gift, source, path-of-funds, and "gathering records early" sentences listed under Indian families. Also remove:

- the H-1B path), see our guide to EB-5 for Chinese international students
- Moving significant capital out of China involves its own set of considerations under Chinese foreign exchange rules
- Families typically work with both a China-side financial/legal adviser and their U.S
- immigration attorney to plan this properly and in advance

Replacement link sentences:

- The gift letter for a Chinese parent, and the records that show the gift reached the student, are on the EB-5 with gifted funds page.
- The lawful-source file for capital from China is on the EB-5 source of funds page.
- The student decision for a Chinese F-1 applicant is on the EB-5 for Chinese international students page.
- How the gift structure typically works For a Chinese family, start with the EB-5 with gifted funds page and the EB-5 source of funds page rather than restating those steps here.

REPLACE the currency bullet. Source: SAFE Tianjin branch notice of November 13, 2025, which cites Huifa [2020] No. 14, articles 54 and 59, for a facilitation quota of the equivalent of USD 50,000 per person per year for individual settlement and for domestic individuals' purchase of foreign exchange. https://www.safe.gov.cn/tianjin/2025/1113/2926.html

An English SAFE press transcript from January 19, 2017 states the same USD 50,000 annual purchase quota and says a current-account purchase above the quota needs documents that show the transaction. https://www.safe.gov.cn/en/2017/0119/1244.html

- The State Administration of Foreign Exchange sets an annual facilitation quota of USD 50,000 equivalent per person for an individual's purchase of foreign exchange and for settlement of foreign exchange.
- A November 13, 2025 notice from the SAFE Tianjin branch cites Huifa [2020] No. 14 for that per-person annual quota.
- Above the quota, a current-account purchase requires the bank to review documents that show the transaction.

Do not write that an EB-5 subscription qualifies for the above-quota route. That is on the check list.

REPLACE the tax block, card blurbs, CTA, and extra compliance the same way as India, with China in the sentence:

- Tax and advisory considerations This page does not give tax advice for capital moving from China to an EB-5 investment.
- A family in China should have a cross-border tax adviser and a United States immigration attorney review the transfer before money moves.
- Gift, loan, and other lawful funding paths USCIS reviews when the investor's capital is coming from China.
- What a Chinese family should verify before committing capital and filing Form I-526E.
- Talk with someone about an EB-5 remittance from China Talk to Someone Who Knows EB-5 Book a free 30-minute consultation
- This page provides educational information about EB-5 funding from China and does not constitute legal, financial, tax, or immigration advice.
- Consult a qualified immigration attorney and a cross-border tax adviser before a family in China moves investment capital or signs a gift arrangement.

Also remove the shared measured sentence "What to Know Before Investing in EB-5 What to verify before committing capital and filing I-526E" by using the new blurb above. Keep the card URL.

### Indian students

LINK-OUT or REPLACE these shared sentences:

- Filing an EB-5 petition is a separate immigration process with its own eligibility, documentation, and timeline requirements
- Talk with a qualified immigration attorney about your specific situation
- For students whose families have the financial capacity to consider it, some begin evaluating EB-5 while still in school, which allows more time to document source of funds and select a project before OPT or STEM OPT authorization ends
- For the broader student pathway overview, see F-1 to EB-5 self-sponsored green card
- A parent or family member often provides the funds, typically as a documented gift
- USCIS requires a clear, lawful paper trail for any funds used in an EB-5 investment, regardless of who originally earned them
- Timing considerations EB-5 program rules and filing windows change
- Students evaluating this path should confirm current deadlines, investment thresholds, and visa category rules before making a decision
- See our Grandfathering Deadline tool and current EB-5 guide for the latest information
- Country-specific STEM OPT timing risks are covered in EB-5 for Indian and Chinese students on F-1 and STEM OPT
- Lifetime earnings and H-1B vs EB-5 cost tradeoffs for students comparing the two paths
- Talk to Someone Who Understands the F-1 to EB-5 Path Talk to Someone Who Knows EB-5 Book a free 30-minute consultation

The two-path cards and the "Why Indian F-1 students look at EB-5" paragraph stay. They are already country-specific in the measured text.

Proposed text:

- Filing an EB-5 petition for an Indian student is a separate immigration process with its own eligibility, documentation, and timeline requirements.
- An Indian student should talk with a qualified immigration attorney about that student's specific situation.
- Indian F-1 students can use the F-1 to EB-5 self-sponsored green card page for the filing overview that is not specific to India. Link: `/pathways/f1-to-eb5-self-sponsored-green-card`.
- How parental funding usually works Many Indian F-1 students should read how Indian families fund an EB-5 investment before treating a parent's gift as the source of capital. Link: `/pathways/eb5-for-indian-families`.
- The current Liberalised Remittance Scheme amount and the bank-document rule are stated on the Indian families page, with the Reserve Bank of India Master Direction. Link: `/pathways/eb5-for-indian-families`. Do not repeat the USD 250,000 figure here.
- Timing considerations In the November 2026 Visa Bulletin, the EB-5 unreserved final action date for India is December 1, 2023. Source: the November 2026 bulletin URL above. Render the date from `EB5_UNRESERVED_FINAL_ACTION_INDIA`.
- The rural, high-unemployment, and infrastructure EB-5 set-asides are current for India in that same November 2026 bulletin. Link the rural set-aside to `/pathways/rural-eb5`.
- Those India dates are final action cutoffs for a visa number, not a processing-time promise, and they should be read next to the grandfathering deadline tool. Keep the existing links to `/tools/grandfathering-countdown` and `/research/complete-2027-eb5-guide`.
- STEM OPT timing for students born in India is covered in the cap-gap analysis of EB-5 for Indian and Chinese students on F-1 and STEM OPT. Same article URL as today.
- Lifetime earnings and H-1B versus EB-5 cost tradeoffs for Indian students comparing the two paths. Same card URL. The blurb change is what makes the sentence different.
- Talk with someone about EB-5 for an Indian student on F-1. That becomes `secondaryCtaText`. The measured line will still include "Talk to Someone Who Knows EB-5 Book a free 30-minute consultation".

### Chinese students

Same shared list as Indian students, plus KEEP "Related Pathways How Chinese Parents Can Fund an EB-5 Investment for a Child in the U.S."

The traditional-path card and the "Why Chinese F-1 students look at EB-5" paragraph stay. They already differ from the Indian page.

Proposed text, parallel to India:

- Filing an EB-5 petition for a Chinese student is a separate immigration process with its own eligibility, documentation, and timeline requirements.
- A Chinese student should talk with a qualified immigration attorney about that student's specific situation.
- Chinese F-1 students can use the F-1 to EB-5 self-sponsored green card page for the filing overview that is not specific to China.
- How parental funding usually works Many Chinese F-1 students should read how Chinese parents fund an EB-5 investment before treating a parent's gift as the source of capital. Link: `/pathways/eb5-for-chinese-families`.
- China's per-person foreign exchange quota, and the limit of what that quota authorizes, is explained on the Chinese families page. Do not repeat the USD 50,000 figure here.
- Timing considerations In the November 2026 Visa Bulletin, the EB-5 unreserved final action date for China, mainland born, is December 1, 2016. Render it from `EB5_UNRESERVED_FINAL_ACTION_CHINA`.
- The rural, high-unemployment, and infrastructure EB-5 set-asides are current for China in that same November 2026 bulletin. Link: `/pathways/rural-eb5`.
- Those China dates are final action cutoffs for a visa number, not a processing-time promise, and they should be read next to the grandfathering deadline tool.
- STEM OPT timing for students born in China is covered in the cap-gap analysis of EB-5 for Indian and Chinese students on F-1 and STEM OPT.
- Lifetime earnings and H-1B versus EB-5 cost tradeoffs for Chinese students comparing the two paths.
- `secondaryCtaText`: Talk with someone about EB-5 for a Chinese student on F-1.

### Indian investors

KEEP, because the dollar amount is on hold:

- Most investors use the reduced Targeted Employment Area (TEA) investment threshold of $800,000 rather than the standard amount.

Leave that sentence untouched, including the figure. It remains one shared sentence with the Chinese investors page. That is an accepted residual.

REPLACE or LINK-OUT:

- Investment requirements EB-5 requires a qualifying investment in a new commercial enterprise, structured to create the required number of U.S
- See our full EB-5 Investment Cost breakdown for current figures
- The filing process, in brief Select a project and complete source-of-funds documentation File Form I-526E (with concurrent adjustment of status filing for investors already in the U.S
- on a valid nonimmigrant status, or consular processing for investors abroad) Receive work authorization and travel document during the concurrent filing period, where applicable Await visa number availability and I-526E adjudication File Form I-829 to remove conditions on permanent residence For the full step-by-step guide, see the EB-5 investment process
- Choosing a project Project selection is one of the most consequential decisions in the EB-5 process
- Regional centers with USCIS I-956F approval have had their compliance and job-creation methodology reviewed by USCIS, which is one factor (not the only factor) in evaluating a project
- See our due diligence guide and rural EB-5 regional center guide for the fuller list of questions to ask before committing capital
- EB-5 investment involves financial risk, including potential loss of principal, and does not guarantee a green card, visa availability, or any specific processing time
- Consult a qualified immigration attorney and a FINRA-registered financial adviser for guidance specific to your situation

The h2 "The filing process, in brief" and "Choosing a project" stay. The numbered list under the filing heading is what produces the two long shared sentences. Replace that list with one sentence. Do not copy the five steps onto this page.

Proposed text:

- Investment requirements For Indian nationals, an EB-5 petition needs a qualifying investment in a new commercial enterprise structured to create the required number of United States jobs.
- Indian investors can separate the capital amount from fees on the EB-5 investment cost breakdown. Link: `/research/eb5-economic-calculus-investment-cost`. Do not restate fee amounts.
- In the November 2026 Visa Bulletin, the EB-5 unreserved final action date for India is December 1, 2023.
- In that same bulletin, the EB-2 final action date for India is November 1, 2013, and the EB-3 final action date for India is January 22, 2014.
- The rural, high-unemployment, and infrastructure EB-5 set-asides are current for India in the November 2026 Visa Bulletin. Link: `/pathways/rural-eb5`.
- The filing process, in brief Indian investors already in the United States should read EB-5 concurrent filing for the adjustment step, and the EB-5 investment process page for Form I-526E through Form I-829. Links: `/pathways/eb5-concurrent-filing` and `/eb5-investment-process`.
- Choosing a project The rural EB-5 page explains the rural set-aside, and the due diligence guide plus the rural regional center guide hold the project questions for an Indian investor. Keep the current research URLs.
- EB-5 investment by an Indian national involves financial risk, including potential loss of principal, and does not guarantee a green card, visa availability, or any specific processing time.
- An Indian national should consult a qualified immigration attorney and a FINRA-registered financial adviser before relying on this page.

The India chargeability paragraph that is already unique stays. The student and H-1B cards stay. Their measured sentences are not shared with the Chinese investors page.

### Chinese investors

KEEP the same `$800,000` sentence.

REPLACE or LINK-OUT the same shared filing, project, jobs, cost-link, and risk sentences listed under Indian investors.

KEEP "Related Pathways How Chinese Parents Can Fund an EB-5 Investment for a Child in the U.S."

Proposed text:

- Investment requirements For Chinese nationals, an EB-5 petition needs a qualifying investment in a new commercial enterprise structured to create the required number of United States jobs.
- Chinese investors can separate the capital amount from fees on the EB-5 investment cost breakdown.
- In the November 2026 Visa Bulletin, the EB-5 unreserved final action date for China, mainland born, is December 1, 2016.
- In that same bulletin, the EB-2 final action date for China is October 1, 2021, and the EB-3 final action date for China is January 22, 2022.
- The rural, high-unemployment, and infrastructure EB-5 set-asides are current for China in the November 2026 Visa Bulletin.
- The filing process, in brief Chinese investors already in the United States should read EB-5 concurrent filing for the adjustment step, and the EB-5 investment process page for Form I-526E through Form I-829.
- Choosing a project The rural EB-5 page explains the rural set-aside, and the due diligence guide plus the rural regional center guide hold the project questions for a Chinese investor.
- For a Chinese national, the annual foreign exchange facilitation quota is explained on the EB-5 for Chinese families page and is not restated here. Link: `/pathways/eb5-for-chinese-families`.
- EB-5 investment by a Chinese national involves financial risk, including potential loss of principal, and does not guarantee a green card, visa availability, or any specific processing time.
- A Chinese national should consult a qualified immigration attorney and a FINRA-registered financial adviser before relying on this page.

### Indian H-1B

The only shared sentences are the six layout lines and the Nishith Parikh photo credit. KEEP all of them. The page is already under the 30% cap (worst pairwise 27% today, 7/26).

Add four sentences under "India chargeability and why EB-5 enters the conversation". Do not remove the existing paragraphs. Source is the same November 2026 final action chart.

- In the November 2026 Visa Bulletin, the final action date for India is November 1, 2013 in EB-2 and January 22, 2014 in EB-3.
- The EB-5 unreserved final action date for India in that same bulletin is December 1, 2023.
- The EB-5 rural, high-unemployment, and infrastructure set-asides are current for India in the November 2026 Visa Bulletin.
- A final action date is the priority-date cutoff for a visa number in that month, not a promise that a new Indian H-1B filing will be current.

Link the rural set-aside to `/pathways/rural-eb5`. Keep the existing link to `/pathways/h1b-to-green-card` for concurrent filing. Do not restate that page's steps.

## What the residual share is

After the edits, the sentences that still match another pathway page are:

- The six layout lines on every page.
- The two identical FAQ question sentences on the two family pages.
- The `$800,000` sentence on the two investor pages.
- Sidharth Kumar's credit on Indian families and Indian investors.
- Nishith Parikh's credit on Indian students and Indian H-1B.
- The "Child in the U.S." related-pathway fragment on Chinese students and Chinese investors.

That set is small enough that no page's share with any other pathway page rounds above 30%, and main-element word counts stay between 655 and 791.

## Owner and attorney check list

Do not put any of these on a page until someone checks them.

1. Open https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html in a browser before committing the constants. This session could not get past Cloudflare. The dates in this plan match Publication 9514 as republished at immigration.com. If the State Department cells differ, stop.
2. Do not say which chart USCIS is using for adjustment of status in November 2026. Check https://www.uscis.gov/visabulletininfo. The bulletin itself says applicants use Final Action Dates unless USCIS says otherwise.
3. Do not describe the June 2026 India unreserved cutoff (category unavailable for the rest of FY2026) as the current bulletin. That is a different notice: https://travel.state.gov/content/travel/en/News/visas-news/india-per-country-limit-reached-in-the-eb-5-unreserved-category.html. November 2026 is the next fiscal year.
4. Do not say an EB-5 subscription is a permitted Liberalised Remittance Scheme capital-account transaction. The Master Direction lists overseas direct investment, overseas portfolio investment, a foreign currency account, property abroad, and loans to NRI relatives. It does not name EB-5. An authorised dealer has to classify the transfer.
5. Do not say family members can pool LRS limits to fund one EB-5 investment. The Direction allows each resident individual to remit within the limit, and it says clubbing is not permitted for a capital-account investment unless those family members are co-owners of the overseas investment. Whether an EB-5 subscription is that kind of investment is a legal question.
6. Do not say a student in the United States is "a person residing outside India" for the LRS gift rule. Quote the rule only, as the families page does.
7. Do not add a TCS rate or threshold on LRS remittances. No current Finance Act figure was confirmed for this plan.
8. Do not say China's USD 50,000 facilitation quota can be used for an EB-5 capital contribution, and do not say relatives may each buy foreign exchange for the same investment. The SAFE pages state the quota and the current-account document rule. They do not authorize EB-5.
9. Do not add a country document checklist beyond the RBI items already proposed (prior-year bank statement, or the latest income-tax assessment order or return, for a capital-account remittance). Sale deeds, gift deeds, Form 26AS, Chinese business licenses, audited financials, and property-sale contracts are already mentioned in passing on these pages or in the unchanged FAQ. Do not add a new list. There is no official India or China EB-5 source-of-funds exhibit list in the sources used here.
10. Do not add India or China gift-tax rules, or U.S. gift tax on a gift from a nonresident. No source was pinned down for a sentence that would stay accurate.
11. Do not say the set-asides are always current. Say they are current in the November 2026 bulletin.
12. Reserved-category "current" is not a processing-time claim. The proposed sentences already say a final action date is not a processing-time promise. Keep that limit when the copy is edited.
