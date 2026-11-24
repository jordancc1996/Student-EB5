# Deadline wording changes

Each row is a changed line. Before lines use the old line number. After lines use the new line number.


## scripts/seo-check.mjs

- **After** line 159: const upcomingDeadline = /(before|by)\s+Sept(ember|\.)?\s+30,?\s+2026/i;
- **After** line 160: const indexable = new Set(sitemapPaths.filter((urlPath) => !noindexPaths.has(urlPath)));
- **After** line 161: 
- **After** line 162: function visibleText(html) {
- **After** line 163:   const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
- **After** line 164:   return decode(
- **After** line 165:     body
- **After** line 166:       .replace(/<script[\s\S]*?<\/script>/gi, ' ')
- **After** line 167:       .replace(/<style[\s\S]*?<\/style>/gi, ' ')
- **After** line 168:       .replace(/<[^>]+>/g, ' '),
- **After** line 169:   );
- **After** line 170: }
- **After** line 171: 
- **After** line 172: for (const page of pages) {
- **After** line 173:   if (!indexable.has(page.urlPath)) continue;
- **After** line 174:   for (const sentence of visibleText(page.html).split(/(?<=[.!?])\s+/)) {
- **After** line 175:     if (upcomingDeadline.test(sentence) && !/on or before/i.test(sentence)) {
- **After** line 176:       warnings.push(`${page.urlPath}: upcoming September 30, 2026 wording: ${sentence.slice(0, 180)}`);
- **After** line 177:     }
- **After** line 178:   }
- **After** line 179: }
- **After** line 180: 

## src/components/ResourcesMainContent.tsx

- **Before** line 156:           $800,000 TEA and Sept 30, 2026 filing window.
- **After** line 156:           $800,000 TEA and planning after the September 30, 2026 grandfathering date.

## src/components/news/Eb5LandscapeMay2026Body.tsx

- **Before** line 108:                 The most pressing information for investors today is the series of deadlines approaching in 2026 and 2027. These are not merely administrative dates. They are statutory triggers that may change cost, timing, and protection levels within the EB-5 program.
- **After** line 108:                 The September 30, 2026 grandfathering filing date has passed. The regional center program is authorized through September 30, 2027. These dates are statutory triggers for protection and authorization.
- **Before** line 112:                 The RIA introduced a grandfathering provision that is one of the most important protections offered to EB-5 investors. This provision is designed to protect investors who file by September 30, 2026, even if the program later faces a lapse in authorization.
- **After** line 112:                 The RIA introduced a grandfathering provision for regional center petitions properly filed on or before September 30, 2026. Those petitions have statutory protection if the program later lapses.
- **Before** line 115:                 In the past, when the Regional Center program expired, many investors were left in uncertainty with petitions frozen for months or years. Investors who file before the grandfathering deadline may be locked in under the current statutory framework, regardless of what happens in Congress later. This deadline is a primary driver of the filing surge expected through the end of 2026. Use the <a href="/tools/grandfathering-countdown">EB-5 grandfathering countdown tool</a> to track this window.
- **After** line 115:                 In the past, when the Regional Center program expired, many investors were left in uncertainty with petitions frozen for months or years. Petitions filed on or before September 30, 2026 have statutory protection if the program later lapses. Petitions filed after that date do not. Use the <a href="/tools/grandfathering-countdown">EB-5 grandfathering countdown tool</a> to track authorization through September 30, 2027.
- **Before** line 182:                 The EB-5 grandfathering deadline is September 30, 2026. Investors who file before this date may receive protection if the Regional Center program later faces a lapse in authorization.
- **After** line 182:                 The EB-5 grandfathering filing date was September 30, 2026. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions filed after that date do not get that protection, but they can still be filed while the program is authorized through September 30, 2027.

## src/components/news/Eb5LandscapeMay2026Content.tsx

- **Before** line 111:                 The most pressing information for investors today is the series of deadlines approaching in 2026 and 2027. These are not merely administrative dates. They are statutory triggers that may change cost, timing, and protection levels within the EB-5 program.
- **After** line 111:                 The September 30, 2026 grandfathering filing date has passed. The regional center program is authorized through September 30, 2027. These dates are statutory triggers for protection and authorization.
- **Before** line 115:                 The RIA introduced a grandfathering provision that is one of the most important protections offered to EB-5 investors. This provision is designed to protect investors who file by September 30, 2026, even if the program later faces a lapse in authorization.
- **After** line 115:                 The RIA introduced a grandfathering provision for regional center petitions properly filed on or before September 30, 2026. Those petitions have statutory protection if the program later lapses.
- **Before** line 118:                 In the past, when the Regional Center program expired, many investors were left in uncertainty with petitions frozen for months or years. Investors who file before the grandfathering deadline may be locked in under the current statutory framework, regardless of what happens in Congress later. This deadline is a primary driver of the filing surge expected through the end of 2026. Use the <a href="/tools/grandfathering-countdown">EB-5 grandfathering countdown tool</a> to track this window.
- **After** line 118:                 In the past, when the Regional Center program expired, many investors were left in uncertainty with petitions frozen for months or years. Petitions filed on or before September 30, 2026 have statutory protection if the program later lapses. Petitions filed after that date do not. Use the <a href="/tools/grandfathering-countdown">EB-5 grandfathering countdown tool</a> to track authorization through September 30, 2027.
- **Before** line 185:                 The EB-5 grandfathering deadline is September 30, 2026. Investors who file before this date may receive protection if the Regional Center program later faces a lapse in authorization.
- **After** line 185:                 The EB-5 grandfathering filing date was September 30, 2026. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions filed after that date do not get that protection, but they can still be filed while the program is authorized through September 30, 2027.

## src/content/blog/best-immigration-backup-plan-indian-tech-workers-2026.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 74: A critical deadline for prospective investors is September 30, 2026. The RIA included a <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a> that protects investors who file their I-526E petitions on or before this date. This provision ensures that petitions filed by this date will continue to be processed by USCIS even if the Regional Center Program is not reauthorized beyond its current expiration date of September 30, 2027. Filing after this date exposes investors to significant regulatory and political risk as the investment amount will likely increase to stay on pace with inflation on January 1, 2027.
- **After** line 75: The grandfathering filing date was September 30, 2026. The RIA included a <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a> for regional center petitions properly filed on or before that date. Those petitions have statutory protection if the program later lapses. The program is authorized through September 30, 2027. Filing after September 30, 2026 does not get that protection. Filing after this date exposes investors to significant regulatory and political risk as the investment amount will likely increase to stay on pace with inflation on January 1, 2027.
- **Before** line 86: For tech workers in the USA grappling with H-1B uncertainty and prolonged green card queues, the EB-5 immigrant investor program offers a compelling value proposition. The EB-5 is the only program that offers a direct, self-sponsored pathway to U.S. permanent residency, granting unparalleled stability, career freedom and family security. The reforms introduced by the RIA, particularly concurrent filing, have significantly enhanced its appeal, offering interim benefits that mitigate the risks associated with H-1B layoffs and visa insecurity. While the investment is substantial, the long-term benefits of permanent residency make the EB-5 a valuable proposition for investors. The approaching September 30, 2026 grandfathering deadline is a critical window of opportunity allowing investors to secure their place under the current more favorable program rules. Acting promptly is essential to avoid potential regulatory changes, increased investment amounts and the complexities of future retrogression. The EB-5 program stands as the most robust, future-proof immigration strategy for Indian tech workers to secure a future in the United States.
- **After** line 87: For tech workers in the USA grappling with H-1B uncertainty and prolonged green card queues, the EB-5 immigrant investor program offers a compelling value proposition. The EB-5 is the only program that offers a direct, self-sponsored pathway to U.S. permanent residency, granting unparalleled stability, career freedom and family security. The reforms introduced by the RIA, particularly concurrent filing, have significantly enhanced its appeal, offering interim benefits that mitigate the risks associated with H-1B layoffs and visa insecurity. While the investment is substantial, the long-term benefits of permanent residency make the EB-5 a valuable proposition for investors. The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. The EB-5 program stands as the most robust, future-proof immigration strategy for Indian tech workers to secure a future in the United States.

## src/content/blog/best-opportunity-investment-migration-2026.md

- **Before** line 9: updatedDate: April 15, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 30: <intro>Investment migration 2026 is the last year to file an EB-5 petition at the current $800,000 TEA minimum before the scheduled January 1, 2027 inflation adjustment, and the September 30, 2026 grandfathering deadline locks in adjudication protection under existing rules. Rural TEA set-aside visa categories remain current for all countries including India and China as of late 2025, allowing backlogged nationals to bypass decades-long waits in the unreserved category. The sections below explain set-aside visa mechanics, the grandfathering deadline, and the step-by-step filing process for international students entering the program this year.</intro>
- **After** line 30: <intro>Investment migration 2026 is the last year to file an EB-5 petition at the current $800,000 TEA minimum before the scheduled January 1, 2027 inflation adjustment, and petitions filed on or before September 30, 2026 kept grandfathering protection. Rural TEA set-aside visa categories remain current for all countries including India and China as of late 2025, allowing backlogged nationals to bypass decades-long waits in the unreserved category. The sections below explain set-aside visa mechanics, the grandfathering deadline, and the step-by-step filing process for international students entering the program this year.</intro>
- **Before** line 46: The most urgent factor within the rare 2026 opportunity window is the looming legislative deadline for the EB-5 program. The EB-5 regional center program is scheduled to sunset in 2027 and grandfathering protections are expiring on September 30, 2026. Track this deadline with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 46: The September 30, 2026 grandfathering filing date has passed. The EB-5 regional center program is authorized through September 30, 2027. Petitions filed on or before September 30, 2026 kept grandfathering protection. Track the authorization date with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **Before** line 48: Under current law, investors who file their petition after that date may not benefit from statutory protections if the program is allowed to lapse. Filing before this grandfathering date is the most obvious and critical step for risk mitigation. There is strong confidence within the industry that the program will be reauthorized due to its bipartisan support and beneficial economic impact, but it is not worth taking the gamble and waiting to see. The September 2026 deadline represents a clear line in the sand for investors that are thinking about getting a green card. Learn more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering explained</a>.
- **After** line 48: Under current law, investors who file their petition after that date may not benefit from statutory protections if the program is allowed to lapse. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. The September 30, 2026 filing date has passed. Learn more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering explained</a>.

## src/content/blog/choosing-rural-eb5-regional-center-guide.md

- **Before** line 9: updatedDate: April 15, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 88: The EB-5 program is set to sunset September 30, 2027. The grandfathering clause for the current EB-5 conditions is set to expire a year earlier on September 30, 2026. Track these deadlines with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>. This clause provides a crucial layer of protection for investors who file their I-526E before September 30, 2026. RIA introduced a mechanism to adjust the minimum threshold for investment for inflation every year with the first adjustment scheduled for January 1, 2027. The current amount is $800,000 for TEA. Experts anticipate a significant upward adjustment at the start of 2027. If investors file before September 30, 2026, they effectively lock in the same conditions and the lower investment amount. Read more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering explained</a>.
- **After** line 88: The EB-5 program is authorized through September 30, 2027. The grandfathering filing date was September 30, 2026. Track the authorization date with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>. Regional center petitions properly filed on or before September 30, 2026 have statutory protection if the program later lapses. RIA introduced a mechanism to adjust the minimum threshold for investment for inflation every year with the first adjustment scheduled for January 1, 2027. The current amount is $800,000 for TEA. Experts anticipate a significant upward adjustment at the start of 2027. Petitions filed after September 30, 2026 do not get grandfathering protection. Read more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering explained</a>.

## src/content/blog/comparisons/is-eb5-worth-it-indian-chinese-students.md

- **Before** line 9: updatedDate: September 1, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 92: The Reform and Integrity Act included a critical <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a> that protects investors who file their I-526E petitions on or before September 30, 2026. This provision ensures that petitions filed by this date will continue to be processed by USCIS even if the regional center program is not reauthorized beyond its current expiration date. Filing after this date exposes investors to regulatory and political risk, as well as expected increases in the minimum investment amount to account for inflation. Many industry professionals expect an increase to $920,000–$940,000 for TEA projects and $1.1M–$1.2M for non-TEA projects.
- **After** line 92: The Reform and Integrity Act included a critical <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a> for regional center petitions properly filed on or before September 30, 2026. Those petitions have statutory protection if the program later lapses. Petitions filed after that date do not get that protection. Filing after this date exposes investors to regulatory and political risk, as well as expected increases in the minimum investment amount to account for inflation. Many industry professionals expect an increase to $920,000–$940,000 for TEA projects and $1.1M–$1.2M for non-TEA projects.
- **Before** line 98: Ready to take the next step toward U.S. permanent residency? With the September 30, 2026 grandfathering deadline approaching, today is the best time to secure your place in the current EB-5 program before the window closes. Review the <a href="/eb5-green-card-international-students-playbook">International Student Playbook</a> and the <a href="/eb5-investment-process">EB-5 investment process</a>. <a href="/contact">Contact the StudentEB5 team</a> to explore your options and begin your journey to a green card.
- **After** line 98: Ready to take the next step toward U.S. permanent residency? The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Petitions can still be filed while the program is authorized through September 30, 2027, without that protection. Review the <a href="/eb5-green-card-international-students-playbook">International Student Playbook</a> and the <a href="/eb5-investment-process">EB-5 investment process</a>. <a href="/contact">Contact the StudentEB5 team</a> to explore your options and begin your journey to a green card.

## src/content/blog/complete-2027-eb5-guide.md

- **Before** line 6: metaDescription: "The EB-5 immigrant investor program 2027 still uses an $800,000 TEA minimum covering filing steps, rural set-asides, and the Sept 30, 2026 deadline."
- **After** line 6: metaDescription: "The EB-5 immigrant investor program 2027 still uses an $800,000 TEA minimum. The Sept 30, 2026 deadline for grandfathering protection has passed."
- **Before** line 9: updatedDate: March 3, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 39: <intro>The EB-5 immigrant investor program 2027 still grants U.S. permanent residency to foreign nationals who invest $800,000 in a rural or high-unemployment Targeted Employment Area project, or $1,050,000 in a standard-area project. Investors must also create at least 10 full-time U.S. jobs. Since the 2022 Reform and Integrity Act, investors already in the U.S. on F-1, H-1B, or similar status can file their I-485 adjustment of status concurrently with their I-526E petition and receive work and travel authorization within 3–6 months. Filing before September 30, 2026 locks in current program rules under the grandfathering provision. The sections below cover every requirement, the step-by-step filing process, rural set-aside visas, and the 2027 reauthorization deadline.</intro>
- **After** line 39: <intro>The EB-5 immigrant investor program 2027 still grants U.S. permanent residency to foreign nationals who invest $800,000 in a rural or high-unemployment Targeted Employment Area project, or $1,050,000 in a standard-area project. Investors must also create at least 10 full-time U.S. jobs. Since the 2022 Reform and Integrity Act, investors already in the U.S. on F-1, H-1B, or similar status can file their I-485 adjustment of status concurrently with their I-526E petition and receive work and travel authorization within 3–6 months. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. The sections below cover every requirement, the step-by-step filing process, rural set-aside visas, and the 2027 authorization date.</intro>
- **After** line 40: 
- **After** line 41: Update, November 23, 2026: The September 30, 2026 grandfathering filing date has passed. This article now explains what that means for petitions filed before and after it.
- **Before** line 231: The regional center program is currently authorized through September 30, 2027. Its future will depend on congressional actions. **Investors who file their petitions before September 30, 2026 will protect themselves from any changes and be protected by grandfathering provisions.** Learn more about the <a href="/research/eb5-grandfathering-2026-2027-deadlines">critical 2026 and 2027 deadlines</a> and track the countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 233: The regional center program is currently authorized through September 30, 2027. Its future will depend on congressional actions. **Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed after that date do not, but they can still be filed while the program is authorized through September 30, 2027.** Learn more about the <a href="/research/eb5-grandfathering-2026-2027-deadlines">critical 2026 and 2027 deadlines</a> and track the countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.

## src/content/blog/eb5-2026-official-white-paper.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 38: However, the window of opportunity to take full advantage of the more favorable current rules is closing. A critical <a href="/research/eb5-grandfathering-2026-2027-deadlines">"grandfathering" provision</a> is set to expire on September 30, 2026, giving those interested in EB-5 only a few months to make a move. Track the countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 39: The September 30, 2026 grandfathering filing date has passed. A <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a> protects regional center petitions properly filed on or before that date if the program later lapses. Petitions filed after that date do not get that protection. Track authorization through September 30, 2027 with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **Before** line 56: The RIA has brought many positive changes but the legislation has also introduced a critical timeline that investors cannot afford to ignore. The Reform and Integrity Act included a grandfathering provision that protects investors who file their I-526E petitions on or before September 30, 2026. This provision ensures that petitions filed by this date will continue to be processed by USCIS even if the Regional Center Program is not reauthorized beyond its current expiration date of September 30, 2027. Anyone who files before September 30, 2026 is protected from any future changes to the EB-5 program.
- **After** line 57: The RIA has brought many positive changes but the legislation has also introduced a critical timeline that investors cannot afford to ignore. The Reform and Integrity Act included a grandfathering provision for regional center petitions properly filed on or before September 30, 2026. The program is authorized through September 30, 2027. Regional center petitions properly filed on or before September 30, 2026 have statutory protection if the program later lapses. Petitions filed after that date do not.
- **Before** line 60: This creates a powerful incentive to act quickly. Filing after this date exposes investors to significant regulatory and political risk. The investment amount is already scheduled to increase to account for inflation on January 1, 2027 and other changes could be implemented in any future reauthorization of the program. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Investment Feasibility Calculator</a> to assess your financial readiness.
- **After** line 61: Petitions filed after September 30, 2026 do not get grandfathering protection. Filing after this date exposes investors to significant regulatory and political risk. The investment amount is already scheduled to increase to account for inflation on January 1, 2027 and other changes could be implemented in any future reauthorization of the program. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Investment Feasibility Calculator</a> to assess your financial readiness.
- **Before** line 159: The September 30, 2026, deadline is critical because investors must file their I-526E petitions by this date to be protected under the <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a>. This protection ensures their cases will continue processing even if the Regional Center Program is not reauthorized beyond its sunset date of September 30, 2027. Filing after September 30, 2026 exposes investors to potential regulatory changes, political risks and an anticipated increase in the minimum investment amount due to inflation starting January 1, 2027. Track the countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 160: The September 30, 2026 filing date has passed. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions can still be filed while the program is authorized through September 30, 2027, without that protection. Filing after September 30, 2026 exposes investors to potential regulatory changes, political risks and an anticipated increase in the minimum investment amount due to inflation starting January 1, 2027. Track the countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.

## src/content/blog/eb5-grandfathering-2026-2027-deadlines.md

- **Before** line 6: metaDescription: "The EB-5 grandfathering deadline 2026 is September 30. File I-526E by then to keep adjudication protection even if Congress changes the program in 2027."
- **Before** line 7: excerpt: Understanding the critical September 30, 2026 grandfathering deadline and the 2027 program reauthorization - why acting now secures your path to a U.S. Green Card.
- **After** line 6: metaDescription: "The EB-5 grandfathering deadline 2026 was September 30. Filings on or before it kept protection. Later filings lack it through September 30, 2027."
- **After** line 7: excerpt: The September 30, 2026 grandfathering filing date has passed. This article explains protection for petitions filed before and after it while the program is authorized through September 30, 2027.
- **Before** line 9: updatedDate: February 26, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 27: <intro>The EB-5 grandfathering deadline 2026 is September 30: if you file your I-526E petition on or before that date, USCIS must continue adjudicating it even if Congress lets the regional center program expire or changes the rules afterward. Filing after that date leaves your green card path dependent on a September 30, 2027 reauthorization vote, and the minimum investment is scheduled to increase from $800,000 on January 1, 2027. If you are considering EB-5, the September 2026 filing deadline is the date that locks in both program protection and the current investment threshold. Read on for the full timeline, the 2027 reauthorization risk, and what to do now.</intro>
- **After** line 27: <intro>The EB-5 grandfathering deadline 2026 was September 30. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions filed after September 30, 2026 do not get that protection, but petitions can still be filed while the program is authorized through September 30, 2027, and the minimum investment is scheduled to increase from $800,000 on January 1, 2027. The September 30, 2026 grandfathering filing date has passed. Read on for what that means for petitions filed before and after it.</intro>
- **After** line 28: 
- **After** line 29: Update, November 23, 2026: The September 30, 2026 grandfathering filing date has passed. This article now explains what that means for petitions filed before and after it.
- **Before** line 37: The Reform and Integrity Act sought to rectify this systemic problem by adding a grandfathering clause into law. This clause provides a crucial layer of protection for investors who file their I-526 (direct investment) or I-526E (Regional Center program) petitions before September 30, 2026. This protection is the guarantee that the investor's application will continue to be adjudicated regardless of whether the program is suspended, amended, or terminated.
- **After** line 39: The Reform and Integrity Act sought to rectify this systemic problem by adding a grandfathering clause into law. This clause provides statutory protection for regional center petitions properly filed on or before September 30, 2026 if the program later lapses. This protection is the guarantee that the investor's application will continue to be adjudicated regardless of whether the program is suspended, amended, or terminated.
- **Before** line 39: Filing before September 30, 2026 locks in the investor's place in the program and insulates them from future political or legislative changes. This is the single most compelling reason for new investors to act with urgency in the beginning of 2026. The same $800,000 TEA window is the subject of <a href="/research/best-opportunity-investment-migration-2026">investment migration 2026</a>.
- **After** line 41: Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed after that date do not. The same $800,000 TEA window is the subject of <a href="/research/best-opportunity-investment-migration-2026">investment migration 2026</a>.
- **Before** line 41: <aside class="not-prose my-10 border border-border bg-primary/5 px-8 py-6 rounded-sm"><p class="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-3">Interactive Tool · Grandfathering Countdown</p><h3 class="font-serif text-xl font-semibold text-foreground mb-3">How Many Days Until the Grandfathering Deadline?</h3><p class="text-muted-foreground text-base leading-relaxed mb-5">You just read what grandfathering protects — now see exactly how much time remains before September 30, 2026. Enter today's date and get a live countdown to the filing cutoff that locks in adjudication protection.</p><a href="/tools/grandfathering-countdown" class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-none text-sm font-semibold hover:bg-primary/90 transition-colors duration-150">Track the Sept 30 Deadline →</a></aside>
- **After** line 43: <aside class="not-prose my-10 border border-border bg-primary/5 px-8 py-6 rounded-sm"><p class="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-3">Interactive Tool · Grandfathering Countdown</p><h3 class="font-serif text-xl font-semibold text-foreground mb-3">The September 30, 2026 Filing Date Has Passed</h3><p class="text-muted-foreground text-base leading-relaxed mb-5">The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept statutory protection if the program later lapses. The countdown tracks authorization through September 30, 2027.</p><a href="/tools/grandfathering-countdown" class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-none text-sm font-semibold hover:bg-primary/90 transition-colors duration-150">Track the Sept 30 Deadline →</a></aside>
- **Before** line 45: The grandfathering deadline is set for 2026, but the current authorization for the EB-5 regional center program extends until September 30, 2027. For those who file after the 2026 cutoff, their investment may be safe, but their path to a green card becomes contingent on Congress reauthorizing the program in 2027. If your investment is made after the grandfathering date, your green card could be in limbo.
- **After** line 47: The grandfathering filing date was September 30, 2026. The regional center program is authorized through September 30, 2027. Petitions filed after September 30, 2026 do not get grandfathering protection. Petitions can still be filed while the program remains authorized.
- **Before** line 49: If investors file before September 2026, they effectively lock in the current lower investment amount, providing a substantial financial advantage before the increase takes effect. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Investment Feasibility Calculator</a> to assess your financial readiness.
- **After** line 51: Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed after that date do not get that protection. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Investment Feasibility Calculator</a> to assess your financial readiness.
- **Before** line 53: Once more potential investors become aware of the grandfathering deadline and the impending investment increase, we expect a significant surge in I-526/I-526E filings leading up to September 30, 2026. This anticipated rush underscores the need for immediate action, particularly given the complexity of the initial application phase. For a comprehensive due diligence framework, read our guide on <a href="/research/19-questions-rural-eb5-project-due-diligence">19 Questions to Analyze an EB-5 Deal</a>.
- **After** line 55: The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date have statutory protection if the program later lapses. Preparing an I-526 or I-526E still takes time, particularly given the complexity of the initial application phase. For a comprehensive due diligence framework, read our guide on <a href="/research/19-questions-rural-eb5-project-due-diligence">19 Questions to Analyze an EB-5 Deal</a>.
- **Before** line 57: For potential investors, the next 18 to 24 months are not a period for passive consideration of the EB-5 program but for aggressive due diligence. Starting the process now—vetting a project with the help of our <a href="/research/choosing-rural-eb5-regional-center-guide">regional center selection guide</a> and formally engaging experienced immigration counsel to begin the Source of Funds documentation—is the only way to ensure the petition is filed before the September 30, 2026 grandfathering deadline.
- **After** line 59: Source-of-funds work still takes time. Vetting a project with the help of our <a href="/research/choosing-rural-eb5-regional-center-guide">regional center selection guide</a> and engaging immigration counsel does not restore grandfathering protection for a petition filed after September 30, 2026. Petitions can still be filed while the program is authorized through September 30, 2027, without that protection.
- **Before** line 59: This proactive approach can secure adjudication certainty and the current more favorable investment threshold. The decision to start the process now will make all the difference between a protected and predictable path versus one that is filled with legislative uncertainty and higher investment thresholds.
- **After** line 61: A petition filed on or before September 30, 2026 has statutory protection if the program later lapses. A petition filed after that date does not.

## src/content/blog/eb5-guide-indian-professionals-2026.md

- **Before** line 9: updatedDate: April 14, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 53: There is a looming deadline for prospective EB-5 investors, and it falls on September 30, 2026. The EB-5 Reform and Integrity Act of 2022 introduced a "grandfathering" provision that added a countdown clock to the EB-5 program. If an investor's Form I-526E petition is filed by this date, USCIS will continue to process it even if the Regional Center program is not reauthorized in the future. The grandfathering protection only applies to petitions filed by the 2026 deadline. This creates a hard stop for investors who want to ensure their petition is adjudicated under the current rules.
- **After** line 53: The grandfathering filing date was September 30, 2026, and it has passed. The EB-5 Reform and Integrity Act of 2022 introduced a grandfathering provision. A regional center petition properly filed on or before that date has statutory protection if the program later lapses. Petitions filed after September 30, 2026 do not get that protection. Petitions can still be filed while the program is authorized through September 30, 2027.
- **Before** line 81: Rushing this process creates risk. The pressure of the <a href="/tools/grandfathering-countdown">September 30, 2026 deadline</a> can tempt investors to take shortcuts such as filing an incomplete or "skeleton" petition, but this is a dangerous strategy that can lead to significant delays and even denial.
- **After** line 81: Rushing this process creates risk. The <a href="/tools/grandfathering-countdown">September 30, 2026 filing date</a> has passed. Rushing an incomplete or "skeleton" petition is still a dangerous strategy that can lead to significant delays and even denial.
- **Before** line 95: The September 30, 2026, deadline is a grandfathering provision introduced by the EB-5 Reform and Integrity Act. An investor who files their I-526E petition by this date is guaranteed to have their petition processed by USCIS regardless of whether the Regional Center program is reauthorized in the future.
- **After** line 95: The September 30, 2026 filing date has passed. A regional center petition properly filed on or before that date has statutory protection if the program later lapses. Petitions filed after that date do not get that protection.
- **Before** line 116: <p>Indian professionals face decades-long backlogs in EB-2 and EB-3 visa categories which makes permanent residency through traditional employment-based routes almost impossible (decade-long waits are expected). Additionally, the instability of H-1B visas and the critical September 30, 2026 grandfathering deadline under the EB-5 Reform and Integrity Act create a narrow window to file Form I-526E petitions and secure processing under current rules.</p>
- **After** line 116: <p>Indian professionals face decades-long backlogs in EB-2 and EB-3 visa categories which makes permanent residency through traditional employment-based routes almost impossible (decade-long waits are expected). Additionally, the instability of H-1B visas remains. The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection.</p>

## src/content/blog/eb5-investments-africa-mena-regions.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 126: By taking a sequential, well-structured approach and acting before the critical September 30, 2026 deadline, investors can navigate the complexities of the EB-5 program with confidence. The EB-5 program is a strategic decision that can secure a lasting legacy and exciting opportunities for future African and MENA generations in the United States.
- **After** line 127: The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Petitions can still be filed while the program is authorized through September 30, 2027, without that protection. The EB-5 program is a strategic decision that can secure a lasting legacy and exciting opportunities for future African and MENA generations in the United States.

## src/content/blog/eb5-investor-qa-part-1.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 54: The grandfathering clause was introduced by the EB-5 reform and Integrity Act of 2022 and protects investors from future legislative changes or program expirations. Any investor who files their I-526E petition before September 30, 2026, is grandfathered into the program. Even if congress fails to reauthorize the regional center program or changes the investment requirements after that date, the grandfathered applications will be processed under the rules in place at the time of filing and ensure the investor remains eligible for their green card.
- **After** line 55: The grandfathering clause was introduced by the EB-5 reform and Integrity Act of 2022 and protects investors from future legislative changes or program expirations. A regional center petition properly filed on or before September 30, 2026 has statutory protection if the program later lapses. Even if congress fails to reauthorize the regional center program or changes the investment requirements after that date, the grandfathered applications will be processed under the rules in place at the time of filing and ensure the investor remains eligible for their green card.

## src/content/blog/eb5-lifeline-h1b-workers.md

- **Before** line 6: metaDescription: "EB-5 visa H-1B workers can file I-526E and I-485 together, get an EAD within months, and exit lottery risk via an $800,000 rural TEA before Sept 30, 2026."
- **After** line 6: metaDescription: "EB-5 visa H-1B workers can file I-526E and I-485 together, get an EAD within months, and use an $800,000 rural TEA. The Sept 30, 2026 date has passed."
- **Before** line 9: updatedDate: February 26, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 35: <intro>EB-5 visa H-1B workers get the only self-sponsored green card path that removes employer dependency, lets you file I-526E and I-485 together, and delivers an Employment Authorization Document within months. An $800,000 investment in a rural TEA project also qualifies for the 20% rural visa set-aside, which can reduce wait times to 4–8 months for backlogged nationals from India and China. Filing before September 30, 2026 locks in grandfathering protection under current program rules. The sections below compare EB-5 against H-1B on sponsorship, job mobility, family inclusion, and concurrent filing mechanics.</intro>
- **After** line 35: <intro>EB-5 visa H-1B workers get the only self-sponsored green card path that removes employer dependency, lets you file I-526E and I-485 together, and delivers an Employment Authorization Document within months. An $800,000 investment in a rural TEA project also qualifies for the 20% rural visa set-aside, which can reduce wait times to 4–8 months for backlogged nationals from India and China. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. The sections below compare EB-5 against H-1B on sponsorship, job mobility, family inclusion, and concurrent filing mechanics.</intro>

## src/content/blog/eb5-timing-risks-petition-invalidation.md

- **After** line 9: updatedDate: November 23, 2026
- **After** line 37: Update, November 23, 2026: The September 30, 2026 grandfathering filing date has passed. This article now explains what that means for petitions filed before and after it.
- **After** line 38: 
- **Before** line 48: The EB-5 program has a series of important deadlines coming in the next 6–24 months. EB-5 prospective investors are panicking due to a misunderstanding of current legislative risk. It is essential to separate the actual legislative risk from the marketing noise designed to create artificial urgency by EB-5 brokers and regional centers.
- **After** line 51: The September 30, 2026 grandfathering filing date has passed. EB-5 prospective investors are panicking due to a misunderstanding of current legislative risk. It is essential to separate the actual legislative risk from the marketing noise designed to create artificial urgency by EB-5 brokers and regional centers.
- **Before** line 52: When Congress drafted the Reform and Integrity Act, they sought to address a critical flaw from previous program lapses. The critical flaw affected pending investors when the program's reauthorization temporarily expired. To resolve this, Congress created a grandfathering provision. The statute dictates that any investor who files their I-526E petition on or before September 30, 2026 will have their petition processed to its conclusion regardless of whether the broader regional center program is subsequently reauthorized.
- **After** line 55: When Congress drafted the Reform and Integrity Act, they sought to address a critical flaw from previous program lapses. The critical flaw affected pending investors when the program's reauthorization temporarily expired. To resolve this, Congress created a grandfathering provision. The statute dictates that a regional center petition properly filed on or before September 30, 2026 has statutory protection if the program later lapses.
- **Before** line 56: The 2026 date is not an expiration, but it remains a critical deadline for risk mitigation. Investors who file after September 30, 2026 will not benefit from this grandfathering protection. If Congress fails to renew the program in 2027, those post-2026 investors could find their petitions held in abeyance indefinitely. While panic is unwarranted, deliberate action to file before the grandfathering deadline is highly advisable. Track the countdown directly with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 59: The 2026 date is not an expiration. It is the grandfathering filing date, and it has passed. Petitions filed after September 30, 2026 do not get that protection. Petitions can still be filed while the program is authorized through September 30, 2027. Track the authorization countdown with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.

## src/content/blog/evaluating-eb5-projects-pending-i956f.md

- **Before** line 7: excerpt: Many viable EB-5 projects come to market with I-956F applications still pending USCIS adjudication. For Indian and Chinese H-1B professionals and international students racing against visa backlogs and the September 30, 2026 grandfathering deadline, understanding how to evaluate a pre-approval project is critical. This guide covers regional center track record, capital stack scrutiny, business plan data, TEA designation, and the contingency provisions to demand before wiring capital.
- **After** line 7: excerpt: Many viable EB-5 projects come to market with I-956F applications still pending USCIS adjudication. For Indian and Chinese H-1B professionals and international students comparing visa backlogs after the September 30, 2026 grandfathering filing date, understanding how to evaluate a pre-approval project is critical. This guide covers regional center track record, capital stack scrutiny, business plan data, TEA designation, and the contingency provisions to demand before wiring capital.
- **After** line 9: updatedDate: November 23, 2026

## src/content/blog/f1-students/eb5-funding-strategies-students.md

- **Before** line 9: updatedDate: September 3, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 98: Source-of-funds packages take time. Coordinating bank letters, translated tax filings, property valuations, and broker statements across multiple jurisdictions typically requires three to six months of work with immigration counsel before a petition is filing-ready. Families planning to file under current rules need to start the funding documentation process well before the <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 grandfathering deadline</a>, after which the minimum investment is projected to rise to approximately $1,050,000 for TEA projects in 2027. Our <a href="/tools/grandfathering-countdown">Grandfathering Countdown</a> tracks the remaining window.
- **After** line 98: Source-of-funds packages take time. Coordinating bank letters, translated tax filings, property valuations, and broker statements across multiple jurisdictions typically requires three to six months of work with immigration counsel before a petition is filing-ready. The <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 grandfathering filing date</a> has passed. Petitions filed on or before that date kept protection. The minimum investment is projected to rise to approximately $1,050,000 for TEA projects in 2027. Our <a href="/tools/grandfathering-countdown">Grandfathering Countdown</a> tracks authorization through September 30, 2027.

## src/content/blog/f1-students/eb5-indian-chinese-students-f1-stem-opt.md

- **Before** line 9: updatedDate: August 31, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 73: RIA grandfathering protects I-526E petitions filed on or before September 30, 2026. Those filings remain adjudicable even if the regional center program is not reauthorized on the later schedule. STEM OPT students who wait for one more lottery cycle can lose both work authorization runway and that filing protection at once.
- **After** line 73: RIA grandfathering protects I-526E petitions filed on or before September 30, 2026. Those filings remain adjudicable even if the regional center program is not reauthorized on the later schedule. STEM OPT students who did not file on or before that date did not keep that filing protection.
- **Before** line 75: For deadline mechanics and the 2027 distinction, see <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering deadlines</a>. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Feasibility Calculator</a> to check whether your current assets qualify before the September 30, 2026 grandfathering deadline, then <a href="/contact">schedule a free consultation</a> to review your STEM OPT timeline against the filing window.
- **After** line 75: For deadline mechanics and the 2027 distinction, see <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering deadlines</a>. Use our <a href="/tools/2026-eb5-investment-feasibility-calculator">EB-5 Feasibility Calculator</a> to check whether your current assets qualify. The September 30, 2026 grandfathering filing date has passed.

## src/content/blog/f1-students/f1-to-eb5-green-card.md

- **Before** line 9: updatedDate: March 5, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 40: <intro>F-1 to EB-5 is the clearest green card path for international students facing F-1 limits and H-1B lottery risk, with an $800,000 TEA investment and concurrent filing for work authorization in 3 to 6 months. The program grants green cards to investors who commit $800,000 in a Targeted Employment area (or $1,050,000 elsewhere) and create at least 10 full time U.S. jobs. In 2022, the EB-5 program was revamped and made significantly more attractive to prospective investors by allowing F-1 students to simultaneously file their investor petition and green card application which allowed the investor to gain the benefits of the green card without having the green card within just 3-6 months. Two critical deadlines are looming in the next 12-36 months that threaten the current EB-5 opportunity. Filing by September 30, 2026 guarantees petition processing while the program itself is authorized only through September 30, 2027. F-1 students with the financial means are urged to act quickly and file before the 2026 deadline to secure a green card before the current environment is changed.</intro>
- **After** line 40: <intro>F-1 to EB-5 is the clearest green card path for international students facing F-1 limits and H-1B lottery risk, with an $800,000 TEA investment and concurrent filing for work authorization in 3 to 6 months. The program grants green cards to investors who commit $800,000 in a Targeted Employment area (or $1,050,000 elsewhere) and create at least 10 full time U.S. jobs. In 2022, the EB-5 program was revamped and made significantly more attractive to prospective investors by allowing F-1 students to simultaneously file their investor petition and green card application which allowed the investor to gain the benefits of the green card without having the green card within just 3-6 months. The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. The program is authorized through September 30, 2027, and petitions filed after September 30, 2026 do not get that protection.</intro>
- **Before** line 112: The RIA includes a provision that protects investors who file their I-526E petition on or before September 30, 2026. This grandfathering clause is codified in the Immigration and Nationality act and ensures that any petition filed by this date will be adjudicated by USCIS even if the regional center program is not reauthorized by Congress in the future. This represents a safe deadline for investors. By filing on or before September 30, 2026 investors insulate themselves from any political uncertainty regarding program reauthorization. Learn more about the <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a>.
- **After** line 112: The RIA protects regional center petitions properly filed on or before September 30, 2026 if the program later lapses. That filing date has passed. Petitions filed after that date do not get that protection. Learn more about the <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering provision</a>.
- **Before** line 116: The EB-5 regional center program is currently authorized to exist until September 30, 2027. This means that investors can file I-526E petitions after the September 30, 2026 grandfathering deadline. However, these petitions will not be protected by the grandfathering clause.
- **After** line 116: The EB-5 regional center program is authorized through September 30, 2027. Petitions can still be filed. Petitions filed after September 30, 2026 do not get grandfathering protection.
- **Before** line 118: If congress fails to reauthorize the program by September 30, 2027, USCIS would lose the legal authority to process any petitions filed after the 2026 deadline. Investors who file between October 1, 2026 and September 30, 2027 are betting on Congress to reauthorize the program.
- **After** line 118: Petitions filed after the 2026 filing date do not have the statutory protection that applies to petitions filed on or before September 30, 2026.
- **Before** line 120: The most prudent course of action for any F-1 student considering the EB-5 path is to treat September 30, 2026 as the true deadline.
- **After** line 120: The September 30, 2026 grandfathering filing date has passed.
- **Before** line 124: The transition from an F-1 student visa to an EB-5 green card is a complex but a highly rewarding journey. The EB-5 program offers a unique opportunity for F-1 students to bypass the uncertainties of the H-1B lottery, and the long backlogs of other employment based Green Card categories. The window of opportunity to take advantage of the EB-5 program with full protection of the grandfathering clause is closing. The September 30, 2026 deadline represents a potential hard cut off for prospective investors. For F-1 students that have the financial means to invest now is the time to act. Review the <a href="/eb5-green-card-international-students-playbook">International Student Playbook</a> and the <a href="/eb5-investment-process">EB-5 investment process</a> before you file. Seeking the guidance of experienced immigration and investment professionals and moving forward with a sense of urgency can turn an American dream into reality. <a href="/contact">Contact StudentEB5</a> for a free consultation.
- **After** line 124: The transition from an F-1 student visa to an EB-5 green card is a complex but a highly rewarding journey. The EB-5 program offers a unique opportunity for F-1 students to bypass the uncertainties of the H-1B lottery, and the long backlogs of other employment based Green Card categories. The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. Review the <a href="/eb5-green-card-international-students-playbook">International Student Playbook</a> and the <a href="/eb5-investment-process">EB-5 investment process</a> before you file. Seeking the guidance of experienced immigration and investment professionals and moving forward with a sense of urgency can turn an American dream into reality. <a href="/contact">Contact StudentEB5</a> for a free consultation.
- **Before** line 217: The September 30, 2026 deadline is a grandfathering deadline. If the investor files their I-526E petition on or before this date USCIS is legally required to process the investors petition even if congress does not reauthorize the EB-5 regional center program. The September 30, 2027 deadline is the date the program itself is set to expire. Petitions filed after the 2026 deadline but before the 2027 deadline are not protected by the grandfathering clause.
- **After** line 217: The September 30, 2026 date was the grandfathering filing date, and it has passed. A regional center petition properly filed on or before that date has statutory protection if the program later lapses. The program is authorized through September 30, 2027. Petitions filed after September 30, 2026 do not get that protection.

## src/content/blog/h1b-60-day-grace-period-layoff-guide.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 102: The EB-5 program is the best option for recently laid-off H-1B professionals, but this might not last long. Grandfathering provisions that protect investors from future legislative lapses or program expirations are scheduled to expire on September 30, 2026. Additionally, an inflation-adjusted increase is anticipated in early 2027, which is expected to raise the minimum TEA investment to $940,000 – $950,000. For the full deadline breakdown, review our <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering and 2027 price increase analysis</a>.
- **After** line 103: The EB-5 program is the best option for recently laid-off H-1B professionals, but this might not last long. The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Petitions filed after that date do not. Additionally, an inflation-adjusted increase is anticipated in early 2027, which is expected to raise the minimum TEA investment to $940,000 – $950,000. For the full deadline breakdown, review our <a href="/research/eb5-grandfathering-2026-2027-deadlines">EB-5 grandfathering and 2027 price increase analysis</a>.

## src/content/blog/h1b-tech-layoffs-eb5-entrepreneurship.md

- **Before** line 9: updatedDate: April 14, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 95: The EB-5 immigrant investor program remains a viable and direct path to permanent residency in the United States for those who have the necessary capital. The EB-5 offers a degree of control and flexibility not found in any other visa categories. The recent reforms allowing for concurrent filing have made the program even more attractive to individuals already in the United States. While the initial investment is significant, the long-term returns make it a compelling proposition. <a href="/research/eb5-grandfathering-2026-2027-deadlines">Grandfathering deadlines</a> for the current program are on September 30, 2026, and investors are encouraged to act now to receive the benefits of the current program before the grandfathering provision expires. Track the deadline with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>.
- **After** line 95: The EB-5 immigrant investor program remains a viable and direct path to permanent residency in the United States for those who have the necessary capital. The EB-5 offers a degree of control and flexibility not found in any other visa categories. The recent reforms allowing for concurrent filing have made the program even more attractive to individuals already in the United States. While the initial investment is significant, the long-term returns make it a compelling proposition. The <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 grandfathering filing date</a> has passed. Petitions filed on or before that date kept protection. Petitions can still be filed while the program is authorized through September 30, 2027, without that protection.
- **Before** line 97: Ready to take the next step toward U.S. permanent residency? With the September 30, 2026 grandfathering deadline approaching now is the time to secure your place in the current EB-5 program before the window closes. Review the <a href="/pathways/h1b-to-green-card">H-1B to green card pathway</a> and the <a href="/eb5-investment-process">EB-5 investment process</a>.
- **After** line 97: Ready to take the next step toward U.S. permanent residency? The September 30, 2026 grandfathering filing date has passed. Petitions filed on or before that date kept protection. Review the <a href="/pathways/h1b-to-green-card">H-1B to green card pathway</a> and the <a href="/eb5-investment-process">EB-5 investment process</a>.

## src/content/blog/investment/i526e-filing-cost.md

- **Before** line 9: updatedDate: September 3, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 96: The Reform and Integrity Act of 2022 extended the program through September 30, 2027. The RIA also added a grandfathering provision dated September 30, 2026: investors who apply before that date will be ushered into the EB-5 program under the current rules and processed through final adjudication regardless of what happens to the program's authorization afterward. This grandfathering clause is a critical protection for investors committing capital to EB-5 today.
- **After** line 96: The Reform and Integrity Act of 2022 extended the program through September 30, 2027. The RIA also added a grandfathering provision dated September 30, 2026. That filing date has passed. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions filed after that date do not get that protection.

## src/content/blog/j1-f1-h1b-eb5-concurrent-filing.md

- **After** line 9: updatedDate: November 23, 2026
- **Before** line 81: With the upcoming <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering deadline on September 30, 2026</a>, and the projected price increase on January 1, 2027, J-1, F-1, and H-1B visa holders need to consider this pathway and initiate preparation early if they want a chance at the EB-5. Compiling seven years of source of funds documentation and conducting project due diligence typically requires several months of coordination with experienced immigration counsel and reputable regional centers. By taking proactive steps non-immigrant professionals can secure their status and establish a permanent foundation in the United States.
- **After** line 82: The <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 grandfathering filing date</a> has passed. Petitions filed on or before that date kept protection. The projected price increase on January 1, 2027 is a separate date. J-1, F-1, and H-1B visa holders can still file while the program is authorized through September 30, 2027, without grandfathering protection. Compiling seven years of source of funds documentation and conducting project due diligence typically requires several months of coordination with experienced immigration counsel and reputable regional centers. By taking proactive steps non-immigrant professionals can secure their status and establish a permanent foundation in the United States.

## src/content/blog/post-reform-integrity-act-analysis.md

- **Before** line 9: updatedDate: March 3, 2026
- **After** line 9: updatedDate: November 23, 2026
- **Before** line 79: The program has two looming deadlines that were established by the Reform and Integrity Act. Track these with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>:
- **After** line 79: The program has two dates that were established by the Reform and Integrity Act. Track the authorization date with our <a href="/tools/grandfathering-countdown">Grandfathering Countdown Timer</a>:
- **Before** line 81: **September 30, 2026 (Grandfathering Deadline):** Petitions filed before this date will be protected under current rules even if the law changes or expires later. Read more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering explained</a>.
- **After** line 81: **September 30, 2026 (Grandfathering Deadline):** That filing date has passed. Regional center petitions properly filed on or before it have statutory protection if the program later lapses. Petitions filed after it do not. Read more about <a href="/research/eb5-grandfathering-2026-2027-deadlines">grandfathering explained</a>.
- **Before** line 109: Petitions filed before September 30, 2026 are grandfathered meaning they will continue to be processed according to current rules even if the EB-5 law expires or is changed by congress.
- **After** line 109: Petitions filed on or before September 30, 2026 have statutory protection if the program later lapses. Petitions filed after that date do not get that protection.

## src/content/blog/regional-center-shutdown-eb5-investor-protections.md

- **Before** line 9: updatedDate: August 31, 2026
- **After** line 9: updatedDate: November 23, 2026
- **After** line 35: Update, November 23, 2026: The September 30, 2026 grandfathering filing date has passed. This article now explains what that means for petitions filed before and after it.
- **After** line 36: 
- **Before** line 88: With the <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 deadline</a> approaching, we highly recommend securing a place in the current EB-5 program before the window closes. If you are an international student or H-1B professional seeking a reliable path to a U.S. green card, please <a href="/contact">contact StudentEB5 today</a> to explore your options.
- **After** line 90: The <a href="/research/eb5-grandfathering-2026-2027-deadlines">September 30, 2026 grandfathering filing date</a> has passed. Petitions filed on or before that date kept protection. Petitions filed now can still proceed while the program is authorized through September 30, 2027, without that protection. If you are an international student or H-1B professional seeking a reliable path to a U.S. green card, please <a href="/contact">contact StudentEB5 today</a> to explore your options.

## src/data/newsFaqSchemas.ts

- **Before** line 10:         text: 'The EB-5 grandfathering deadline is September 30, 2026. Investors who file before this date may receive protection if the Regional Center program later faces a lapse in authorization.',
- **After** line 10:         text: 'The EB-5 grandfathering filing date was September 30, 2026. Regional center petitions properly filed on or before that date have statutory protection if the program later lapses. Petitions filed after that date do not get that protection, but they can still be filed while the program is authorized through September 30, 2027.',

## src/pages/pathways/f1-to-eb5-self-sponsored-green-card.astro

- **After** line 22: import {
- **After** line 23:   GRANDFATHERING_FILING_DEADLINE,
- **After** line 24:   RC_PROGRAM_AUTHORIZED_THROUGH,
- **After** line 25:   formatProgramDate,
- **After** line 26: } from '@/data/program';
- **Before** line 195:               EB-5 reserved categories are current on the most recent Visa Bulletin. International students on F-1/OPT can <span class="underline">file I-526E and I-485 concurrently</span> and bypass the H-1B lottery entirely. See our guide to <a href="/research/j1-f1-h1b-eb5-concurrent-filing" class="underline">EB-5 concurrent filing for F-1 and H-1B holders</a>. Petitions filed before September 30, 2026 are grandfathered under current provisions. After that date, these protections disappear. Review the <a href="/research/eb5-grandfathering-2026-2027-deadlines" class="underline">EB-5 grandfathering deadline analysis</a> for timing details.
- **After** line 200:               EB-5 reserved categories are current on the most recent Visa Bulletin. International students on F-1/OPT can <span class="underline">file I-526E and I-485 concurrently</span> and bypass the H-1B lottery entirely. See our guide to <a href="/research/j1-f1-h1b-eb5-concurrent-filing" class="underline">EB-5 concurrent filing for F-1 and H-1B holders</a>. Petitions filed on or before {formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} kept grandfathering protection. Petitions filed now can still proceed while the program is authorized through {formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)}, without that protection. Review the <a href="/research/eb5-grandfathering-2026-2027-deadlines" class="underline">EB-5 grandfathering deadline analysis</a> for timing details.

## src/pages/pathways/h1b-to-green-card.astro

- **After** line 23: import {
- **After** line 24:   GRANDFATHERING_FILING_DEADLINE,
- **After** line 25:   RC_PROGRAM_AUTHORIZED_THROUGH,
- **After** line 26:   formatProgramDate,
- **After** line 27: } from '@/data/program';
- **Before** line 231:               EB-5 reserved categories are current on the most recent March 2026 Visa Bulletin. This means that eligible investors in the United States can <span class="underline">file I-526E and I-485 at the same time</span> and bypass years of waiting in other visa categories. See our guide to <a href="/research/j1-f1-h1b-eb5-concurrent-filing" class="underline">EB-5 concurrent filing for H-1B holders</a>. Petitions filed before September 30, 2026, will be grandfathered under current provisions and protect EB-5 investors from any future lapse or congressional inaction. After September 30, 2026, these protections disappear. Review the <a href="/research/eb5-grandfathering-2026-2027-deadlines" class="underline">EB-5 grandfathering deadline analysis</a> for timing details.
- **After** line 236:               EB-5 reserved categories are current on the most recent March 2026 Visa Bulletin. This means that eligible investors in the United States can <span class="underline">file I-526E and I-485 at the same time</span> and bypass years of waiting in other visa categories. See our guide to <a href="/research/j1-f1-h1b-eb5-concurrent-filing" class="underline">EB-5 concurrent filing for H-1B holders</a>. Petitions filed on or before {formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} kept grandfathering protection. Petitions filed now can still proceed while the program is authorized through {formatProgramDate(RC_PROGRAM_AUTHORIZED_THROUGH)}, without that protection. Review the <a href="/research/eb5-grandfathering-2026-2027-deadlines" class="underline">EB-5 grandfathering deadline analysis</a> for timing details.

## src/pages/resources.astro

- **After** line 16: import { GRANDFATHERING_FILING_DEADLINE, formatProgramDate } from '@/data/program';
- **Before** line 19:   'EB-5 resources international students need include filing guides, source-of-funds checklists, research articles, and tools tied to the Sept 30, 2026 deadline.';
- **After** line 20:   `EB-5 resources international students need include guides, checklists, research, and tools for planning after the ${formatProgramDate(GRANDFATHERING_FILING_DEADLINE)} grandfathering date.`;

## Round 2, November 23, 2026

Dates render from GRANDFATHERING_FILING_DEADLINE and RC_PROGRAM_AUTHORIZED_THROUGH.

### src/pages/pathways/index.astro

- **Before** line 15: EB-5 green card pathways help H-1B professionals and F-1 students choose concurrent filing routes before the Sept 30, 2026 grandfathering deadline hits.
- **After** line 16: EB-5 green card pathways compare concurrent filing. The September 30, 2026 protection date has passed. Filing continues through September 30, 2027.
- **Before** line 76: EB-5 green card pathways for H-1B and F-1 applicants compare concurrent filing, $800,000 TEA capital, and the Sept 30, 2026 grandfathering deadline.
- **After** line 76: EB-5 green card pathways for H-1B and F-1 applicants compare concurrent filing and $800,000 TEA capital. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions can still be filed through September 30, 2027 without that protection.

### src/pages/about.astro

- **Before** line 22: EB-5 immigration advisors international students use StudentEB5 for F-1 and H-1B green card strategy, $800,000 TEA paths, and Sept 30, 2026 filing timing.
- **After** line 23: EB-5 immigration advisors international students map $800,000 TEA paths. The September 30, 2026 date has passed. Filing continues through September 30, 2027.
- **Before** line 75: EB-5 immigration advisors international students trust StudentEB5 to map $800,000 TEA filings, concurrent EAD timing, and the Sept 30, 2026 grandfathering window.
- **After** line 75: EB-5 immigration advisors international students trust StudentEB5 to map $800,000 TEA filings and concurrent EAD timing. The September 30, 2026 protection date has passed. Filing continues through September 30, 2027.

### src/pages/contact.astro

- **Before** line 18: EB-5 immigration consultation helps F-1 and H-1B investors map concurrent filing, $800,000 TEA capital, and the Sept 30, 2026 grandfathering deadline.
- **After** line 19: EB-5 immigration consultation covers $800,000 TEA capital. The September 30, 2026 date has passed. Filing continues through September 30, 2027.
- **Before** line 70: EB-5 immigration consultation for F-1 and H-1B applicants covers $800,000 TEA capital, concurrent filing, and the Sept 30, 2026 grandfathering deadline.
- **After** line 70: EB-5 immigration consultation for F-1 and H-1B applicants covers $800,000 TEA capital and concurrent filing. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions can still be filed through September 30, 2027 without that protection.

### src/pages/eb5-green-card-international-students-playbook.astro

- **Before** line 19: EB-5 green card international students playbook covers OPT timelines, STEM OPT risks, concurrent filing, and the Sept 30, 2026 grandfathering deadline.
- **After** line 20: EB-5 green card international students playbook covers OPT timelines. The September 30, 2026 date has passed. Filing continues through September 30, 2027.

### src/pages/eb5-investment-immigration-tools.astro

- **Before** line 13: EB-5 immigration tools calculators cover OPT timelines, $800,000 feasibility checks, H-1B lottery odds, and the Sept 30, 2026 grandfathering countdown.
- **After** line 14: EB-5 immigration tools calculators cover $800,000 checks and planning after September 30, 2026. Filing continues through September 30, 2027.

### src/pages/faq/index.astro

- **Before** line 90: EB-5 investor FAQ topics include the $800,000 TEA threshold, concurrent filing EADs, gifted funds, and the Sept 30, 2026 grandfathering deadline.
- **After** line 90: EB-5 investor FAQ topics include the $800,000 TEA threshold, concurrent filing EADs, and gifted funds. The September 30, 2026 protection date has passed. Filing continues through September 30, 2027.
- This line is the hero paragraph, not a FAQ answer. The FAQ JSON-LD was left unchanged.

### src/components/ToolsHubMainContent.tsx

- **Before** line 18: Track time remaining until the September 30, 2026 EB-5 grandfathering deadline with milestone markers.
- **After** line 19: The September 30, 2026 grandfathering filing date has passed. The countdown tracks authorization through September 30, 2027.
- **Before** line 67: EB-5 immigration tools calculators here include OPT dates, $800,000 feasibility, lottery odds, and the Sept 30, 2026 grandfathering countdown.
- **After** line 67: EB-5 immigration tools calculators here include OPT dates, $800,000 feasibility, and lottery odds. The September 30, 2026 grandfathering filing date has passed. The countdown tracks authorization through September 30, 2027.

### src/components/StudentPlaybookMainContent.tsx

- **Before** line 117: EB-5 green card international students use this playbook to navigate OPT timelines, STEM OPT extension risks, concurrent filing, and the September 30, 2026 grandfathering deadline.
- **After** line 117: EB-5 green card international students use this playbook to navigate OPT timelines, STEM OPT extension risks, and concurrent filing. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions can still be filed through September 30, 2027 without that protection.

### src/components/PlaybookInteractive.tsx

- **Before** line 53: Our advisors work specifically with international students navigating OPT expiration, H-1B lottery risk, and the September 30, 2026 grandfathering deadline.
- **After** line 53: Our advisors work specifically with international students navigating OPT expiration and H-1B lottery risk. Petitions filed on or before September 30, 2026 kept grandfathering protection. Petitions can still be filed through September 30, 2027 without that protection.

### src/content/blog/eb5-grandfathering-2026-2027-deadlines.md

- **Before** line 6: The EB-5 grandfathering deadline 2026 was September 30. Filings on or before it kept protection. Later filings lack it through September 30, 2027.
- **After** line 6: The EB-5 grandfathering deadline 2026 was September 30. Earlier filings kept protection; later ones can still be filed through Sept 30, 2027.

## Round 3, November 23, 2026

### src/data/program.ts

- **After**: VISA_BULLETIN_LATEST_MONTH = 'November 2026'
- **After**: VISA_BULLETIN_SOURCE = 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html'

### src/pages/pathways/h1b-to-green-card.astro

- **Before**: EB-5 reserved categories are current on the most recent March 2026 Visa Bulletin.
- **After**: As of the November 2026 Visa Bulletin, the EB-5 rural, high-unemployment and infrastructure set-aside categories are current for all countries, including India and China.

### src/pages/pathways/f1-to-eb5-self-sponsored-green-card.astro

- **Before**: EB-5 reserved categories are current on the most recent Visa Bulletin.
- **After**: As of the November 2026 Visa Bulletin, the EB-5 rural, high-unemployment and infrastructure set-aside categories are current for all countries.

### src/content/blog/best-opportunity-investment-migration-2026.md

- **Before** intro: Rural TEA set-aside visa categories remain current for all countries including India and China as of late 2025.
- **After** intro: Rural TEA set-aside visa categories remained current for all countries, including India and China, in the November 2026 Visa Bulletin.
- **Before** metaDescription: Investment migration 2026 is the last year to file EB-5 at the $800,000 TEA minimum before the Jan 1, 2027 inflation hike and Sept 30 grandfathering cutoff.
- **After** metaDescription: Investment migration 2026 is the last year to file EB-5 at the $800,000 TEA minimum before the Jan 1, 2027 inflation adjustment.

### src/content/blog/eb5-2026-official-white-paper.md

- **Before** title: EB-5 2026 White Paper - Attorney Insights on Filing Before Sept 30
- **After** title: EB-5 2026 White Paper - Attorney Insights on Filing and Grandfathering
- **Before** metaDescription: EB-5 2026 white paper findings for H-1B and F-1 investors: concurrent filing, rural set-asides, and why the Sept 30, 2026 grandfathering window is closing.
- **After** metaDescription: EB-5 2026 white paper findings for H-1B and F-1 investors: concurrent filing, rural set-asides, and what the passed Sept 30, 2026 grandfathering date means.

### src/content/blog/f1-students/eb5-indian-chinese-students-f1-stem-opt.md

- **Before** metaDescription: EB-5 for Indian and Chinese students on F-1 and STEM OPT covers cap-gap timing, the 85,000 H-1B lottery, and the Sept 30, 2026 grandfathering deadline.
- **After** metaDescription: EB-5 for Indian and Chinese students on F-1 and STEM OPT covers cap-gap timing, the 85,000 H-1B lottery, and filing after the Sept 30, 2026 grandfathering date.
- **Before** excerpt phrase: before the September 30, 2026 grandfathering deadline
- **After** excerpt phrase: after the September 30, 2026 grandfathering date

### src/content/blog/f1-students/f1-to-eb5-green-card.md

- **Before** metaDescription: F-1 to EB-5 in 2026: invest $800,000 in a TEA, file I-526E and I-485 together, and aim for an EAD within 3 to 6 months before Sept 30 grandfathering.
- **After** metaDescription: F-1 to EB-5 in 2026: invest $800,000 in a TEA, file I-526E and I-485 together, and aim for an EAD within 3 to 6 months. Grandfathering ended Sept 30, 2026.
- **Before** excerpt: Two critical deadlines in the next 12-36 months threaten this opportunity.
- **After** excerpt: The September 30, 2026 grandfathering date has passed, and the program is authorized through September 30, 2027.
- **Before** line 44: the critical upcoming deadlines of September 30, 2026, and September 30, 2027
- **After** line 44: the September 30, 2026 grandfathering date, which has passed, and the September 30, 2027 authorization date

### src/content/blog/eb5-timing-risks-petition-invalidation.md

- **Before** metaDescription: EB-5 petition invalidation risk spikes in 2026 around Sept 30 grandfathering, the Jan 1, 2027 investment hike, and partial-funding mistakes USCIS denies.
- **After** metaDescription: EB-5 petition invalidation risk in 2026 and 2027: the passed Sept 30 grandfathering date, the Jan 1, 2027 investment hike, and partial-funding mistakes.
- **Before** excerpt phrase: the September 30, 2026 grandfathering window
- **After** excerpt phrase: the September 30, 2026 grandfathering date, now passed

### src/content/blog/eb5-investments-africa-mena-regions.md

- **Before** metaDescription: EB-5 Africa MENA demand is rising under the Reform and Integrity Act for $800,000 TEA filings, source-of-funds hurdles, and the Sept 30, 2026 cutoff.
- **After** metaDescription: EB-5 Africa MENA demand is rising under the Reform and Integrity Act for $800,000 TEA filings, source-of-funds hurdles, and the passed Sept 30, 2026 date.
- **Before** excerpt phrase: the critical September 30, 2026 grandfathering deadline
- **After** excerpt phrase: what the passed September 30, 2026 grandfathering date means

### Filing continues through

- **Before** about description: EB-5 immigration advisors international students map $800,000 TEA paths. The September 30, 2026 date has passed. Filing continues through September 30, 2027.
- **After** about description: EB-5 immigration advisors international students use for $800,000 TEA paths after September 30, 2026. The program is authorized through September 30, 2027.
- **Before** about hero: Filing continues through September 30, 2027.
- **After** about hero: The program is authorized through September 30, 2027.
- **Before** pathways description: Filing continues through September 30, 2027.
- **After** pathways description: The program is authorized through September 30, 2027.
- **Before** pathways hero: Petitions can still be filed through September 30, 2027 without that protection.
- **After** pathways hero: Petitions can still be filed while the program is authorized through September 30, 2027, without that protection.
- **Before** contact, tools, and FAQ hero: Filing continues through September 30, 2027.
- **After** contact, tools, and FAQ hero: The program is authorized through September 30, 2027.
- **Not changed** src/pages/eb5-green-card-international-students-playbook.astro description. Replacing "Filing continues through" makes the description 163 characters, above the 160 limit. It was not rewritten.

### Playbook description (supplied replacement)

- **Before** src/pages/eb5-green-card-international-students-playbook.astro description: EB-5 green card international students playbook covers OPT timelines. The September 30, 2026 date has passed. Filing continues through September 30, 2027.
- **After** src/pages/eb5-green-card-international-students-playbook.astro description: EB-5 green card international students playbook covers OPT timelines after September 30, 2026. The program is authorized through September 30, 2027. (148 characters)
