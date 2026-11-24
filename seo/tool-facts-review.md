# Tool facts review

Owner and attorney review list. Each row is a rule, date, dollar figure, or scoring band used by one of the 10 tool pages. "none" means this repository does not cite a published source for that exact figure. Do not treat a "none" row as a USCIS or school fact.

| tool | statement | value | source URL | constant name |
| --- | --- | --- | --- | --- |
| Grandfathering countdown | Grandfathering filing date. Petitions properly filed on or before this date have grandfathering protection. The date has passed. | 2026-09-30 | https://studenteb5.com/research/eb5-grandfathering-2026-2027-deadlines | GRANDFATHERING_FILING_DEADLINE |
| Grandfathering countdown | Regional center program authorized through this date. The countdown targets the end of this calendar day in US Eastern time. | 2027-09-30 | https://studenteb5.com/research/eb5-grandfathering-2026-2027-deadlines | RC_PROGRAM_AUTHORIZED_THROUGH |
| Grandfathering countdown | Clock instant is 11:59:59 p.m. US Eastern on the authorization date. | 2027-09-30T23:59:59-04:00 | none | RC_PROGRAM_AUTHORIZED_THROUGH_INSTANT |
| H-1B lottery odds | Registration base used by the model. Not a USCIS table on this site. | 343000 | none | BASE_REGISTRATIONS |
| H-1B lottery odds | Share of the registration base kept in the model. | 0.75 | none | inline totalRegistrations |
| H-1B lottery odds | Selections used by the model. | 120141 | none | totalSelectionsNeeded |
| H-1B lottery odds | Share of registrations assigned to levels 1, 2, 3, and 4. | 0.40, 0.42, 0.11, 0.07 | none | dist |
| H-1B lottery odds | Entries per wage level under the weighted selection rule effective 2026-02-27. | 1, 2, 3, 4 | https://www.govinfo.gov/content/pkg/FR-2025-12-29/pdf/2025-23853.pdf | H1B_ENTRIES_PER_WAGE_LEVEL |
| H-1B lottery odds | Example salary-band label start and step. The actual level depends on the job and location. This calculator does not look up that wage. | 64000 start, 14000 step | none | baseWage, gap |
| H-1B lottery odds | Low-odds flag when the selected job level percent is under this number. | 30 | none | inline userOddsLow |
| H-1B lottery odds | Methodology text states a consular processing fee. No source is stored for that sentence. | 100000 | none | inline methodology text |
| Feasibility calculator | TEA capital investment amount only. Excludes fees. | 800000 | https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/about-the-eb-5-visa-classification | TEA_INVESTMENT_THRESHOLD |
| Feasibility calculator | Standard capital investment amount only. Excludes fees. | 1050000 | https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/about-the-eb-5-visa-classification | NON_TEA_INVESTMENT_THRESHOLD |
| Feasibility calculator | Attorney planning allowance. Not a quote. | 35000 | none | FEASIBILITY_ATTORNEY_ALLOWANCE |
| Feasibility calculator | USCIS planning allowance. The financial-planning article states an I-526 filing fee of 11160 as of 2025. This calculator uses that figure as a planning allowance, not as a live fee schedule. | 11160 | https://studenteb5.com/research/h1b-eb5-financial-planning | FEASIBILITY_USCIS_ALLOWANCE |
| Feasibility calculator | Administration planning allowance. The filing-cost article states a regional center admin range of 60000 to 80000. This calculator uses 60000. | 60000 | https://studenteb5.com/research/investment/i526e-filing-cost | FEASIBILITY_ADMIN_ALLOWANCE |
| Feasibility calculator | Documents planning allowance. | 7500 | none | FEASIBILITY_DOCS_ALLOWANCE |
| Feasibility calculator | Relocation planning allowance. | 35000 | none | FEASIBILITY_RELOCATION_ALLOWANCE |
| Feasibility calculator | Living-reserve length in months. | 24 | none | FEASIBILITY_RESERVE_MONTHS |
| Feasibility calculator | Default monthly expenses. | 5000 | none | FEASIBILITY_DEFAULT_MONTHLY_EXPENSES |
| Feasibility calculator | Sample withdrawal amount in the liquidation panel. | 200000 | none | FEASIBILITY_LIQUIDATION_SAMPLE_AMOUNT |
| Feasibility calculator | Early-withdrawal rate in the liquidation panel. | 0.10 | none | FEASIBILITY_EARLY_WITHDRAWAL_RATE |
| Feasibility calculator | Estimated tax rate in the liquidation panel. | 0.30 | none | FEASIBILITY_ESTIMATED_TAX_RATE |
| Feasibility calculator | Strong Position when liquid assets minus the cost stack are at least the living reserve. | comparison, not a fixed dollar | none | inline status test |
| Regional center scorecard | Starting score. | 50 | none | inline score |
| Regional center scorecard | Years of experience add this many points per year. Years are capped at 0 to 100. | 2 | none | inline y * 2 |
| Regional center scorecard | Approvals above 500 add this many points. Otherwise approvals divided by 25. Approvals are capped at 100000. | 20, or approvals / 25 | none | inline approval weighting |
| Regional center scorecard | One violation subtracts this many points. Two violations subtract 40. | 15 and 40 | none | inline v |
| Regional center scorecard | One default subtracts this many points. Two defaults subtract 50. | 20 and 50 | none | inline d |
| Regional center scorecard | Score is clamped to this range. | 0 to 100 | none | inline Math.min |
| Regional center scorecard | Tier 1 at or above this score. Tier 2 at or above 60. Otherwise Tier 3. | 85 and 60 | none | inline label bands |
| Concurrent filing | Outside the United States returns Consular Processing. | location rule | none | inline getResult |
| Concurrent filing | Inside the United States, and reserved category or a current country, returns You Are Eligible. | location plus category or country | none | inline getResult |
| Concurrent filing | Inside the United States, China or India, unreserved category, returns Retrogression Warning. | country plus category | none | inline getResult |
| CSPA calculator | Age divisor. | 365.25 | none | DAYS_PER_YEAR |
| CSPA calculator | Likely Protected when CSPA age is under this number. | 20.5 | none | inline cspaAge < 20.5 |
| CSPA calculator | At Risk when CSPA age is under 21 and not under 20.5. Age-Out Risk at 21 or above. | 21 | https://www.uscis.gov/policy-manual/volume-7-part-a-chapter-7 | inline cspaAge < 21 |
| Tuition calculator | Academic year label on every stored rate. No school source URL is stored. | 2024-2025 | none | TUITION_ACADEMIC_YEAR |
| Tuition calculator | Arizona State University international and in-state annual amounts. | 39910 and 12482 | none | tuitionFigures |
| Tuition calculator | UC San Diego international and in-state annual amounts. | 48878 and 14610 | none | tuitionFigures |
| Tuition calculator | UC Irvine international and in-state annual amounts. | 48006 and 14312 | none | tuitionFigures |
| Tuition calculator | UC Berkeley international and in-state annual amounts. | 48176 and 14312 | none | tuitionFigures |
| Tuition calculator | UCLA international and in-state annual amounts. | 48315 and 13804 | none | tuitionFigures |
| Tuition calculator | University of Illinois Urbana-Champaign international and in-state annual amounts. | 38860 and 18042 | none | tuitionFigures |
| Tuition calculator | University of Michigan Ann Arbor international and in-state annual amounts. | 60094 and 17786 | none | tuitionFigures |
| Tuition calculator | University of Washington Seattle international and in-state annual amounts. | 44076 and 12643 | none | tuitionFigures |
| OPT calculator | Earliest application is this many days before the program end date, in UTC. | -90 | none | earliestApply |
| OPT calculator | Latest application and latest start are this many days after the program end date, in UTC. | 60 | none | latestApply, latestStart |
| OPT calculator | Earliest start is this many days after the program end date, in UTC. | 1 | none | earliestStart |
| Source of funds | Default target funding. The tax math does not use this target. | 800000 | https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/about-the-eb-5-visa-classification | TEA_INVESTMENT_THRESHOLD |
| Source of funds | Brokerage gain tax rate for nonresident alien status. | 0.30 | none | inline taxRate nra |
| Source of funds | Brokerage gain tax rate for resident status. | 0.20 | none | inline taxRate resident |
| Source of funds | IRA or 401k cost rate. The code adds 0.10 and 0.25. | 0.35 | none | inline iraCost |
| Source of funds | HELOC cost rate. | 0.085 | none | inline helocCost |
| Source of funds checklist | No dollar threshold, date, or scoring band. The page stores a document list. | none | none | none |
