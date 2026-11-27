import {
  NON_TEA_INVESTMENT_THRESHOLD,
  TEA_INVESTMENT_THRESHOLD,
} from '@/lib/eb5-investment';

/**
 * Facts used by the tool pages. Dollar allowances that are not a published
 * USCIS or school figure are calculator planning figures already shown on
 * the tool. They are not new official amounts.
 */

export const GRANDFATHERING_FILING_DEADLINE = '2026-09-30';

export const RC_PROGRAM_AUTHORIZED_THROUGH = '2027-09-30';

export const VISA_BULLETIN_LATEST_MONTH = 'November 2026';

/**
 * November 2026 Visa Bulletin, Employment-Based Final Action.
 * 5th Unreserved (C5, T5, I5, R5, NU, RU): China 01DEC16, India 01DEC23.
 * Set-asides (rural, high unemployment, infrastructure) are C for both in that bulletin only.
 */
export const EB5_UNRESERVED_FAD_CHINA = '2016-12-01';
export const EB5_UNRESERVED_FAD_INDIA = '2023-12-01';
export const EB5_SET_ASIDES_CURRENT = true;

/** USCIS, About the EB-5 Visa Classification. Share of EB-5 visas reserved each fiscal year. */
export const EB5_RESERVED_SHARE_RURAL = 20;
export const EB5_RESERVED_SHARE_HIGH_UNEMPLOYMENT = 10;
export const EB5_RESERVED_SHARE_INFRASTRUCTURE = 2;
export const EB5_RESERVED_SHARES_SOURCE =
  'https://www.uscis.gov/working-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/about-eb-5-visa';

/**
 * USCIS EB-5 Questions and Answers, Inventory Management.
 * "The INA also requires us to prioritize processing petitions for rural areas."
 */
export const USCIS_RURAL_PRIORITY_SOURCE =
  'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/eb-5-questions-and-answers';

/** 8 CFR 204.6(e), definition of capital. */
export const ECFR_EB5_CAPITAL_URL =
  'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-204/subpart-A/section-204.6';

/** USCIS Policy Manual, Volume 6, Part G, Chapter 2. Capital, indebtedness, and loan proceeds. */
export const USCIS_EB5_CAPITAL_POLICY_URL =
  'https://www.uscis.gov/policy-manual/volume-6-part-g-chapter-2';

/** USCIS EB-5 Questions and Answers. Same page as USCIS_RURAL_PRIORITY_SOURCE. */
export const USCIS_EB5_QA_URL = USCIS_RURAL_PRIORITY_SOURCE;

/** Same November 2026 employment-based final action chart. EB-2 and EB-3. */
export const EB2_FAD_INDIA = '2013-11-01';
export const EB3_FAD_INDIA = '2014-01-22';
export const EB2_FAD_CHINA = '2021-10-01';
export const EB3_FAD_CHINA = '2022-01-22';

export const VISA_BULLETIN_NOVEMBER_2026_URL =
  'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html';

export const VISA_BULLETIN_SOURCE = 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html';

/** Remittance rule names already stated on the family pathway pages. */
export const INDIA_REMITTANCE_RULE = 'Liberalised Remittance Scheme';
export const CHINA_REMITTANCE_RULE = 'SAFE facilitation quota';

/**
 * End of the authorization calendar day in US Eastern time.
 * September 30 falls in daylight time, so the offset is -04:00.
 */
export const RC_PROGRAM_AUTHORIZED_THROUGH_INSTANT = `${RC_PROGRAM_AUTHORIZED_THROUGH}T23:59:59-04:00`;

export { NON_TEA_INVESTMENT_THRESHOLD, TEA_INVESTMENT_THRESHOLD };

export const FEASIBILITY_ATTORNEY_ALLOWANCE = 35000;
export const FEASIBILITY_USCIS_ALLOWANCE = 11160;
export const FEASIBILITY_ADMIN_ALLOWANCE = 60000;
export const FEASIBILITY_DOCS_ALLOWANCE = 7500;
export const FEASIBILITY_RELOCATION_ALLOWANCE = 35000;
export const FEASIBILITY_RESERVE_MONTHS = 24;
export const FEASIBILITY_DEFAULT_MONTHLY_EXPENSES = 5000;
export const FEASIBILITY_LIQUIDATION_SAMPLE_AMOUNT = 200000;
export const FEASIBILITY_EARLY_WITHDRAWAL_RATE = 0.1;
export const FEASIBILITY_ESTIMATED_TAX_RATE = 0.3;

export const H1B_WEIGHTED_SELECTION_EFFECTIVE = '2026-02-27';

export const H1B_ENTRIES_PER_WAGE_LEVEL = { 1: 1, 2: 2, 3: 3, 4: 4 };

export const H1B_WEIGHTED_RULE_SOURCE = 'https://www.govinfo.gov/content/pkg/FR-2025-12-29/pdf/2025-23853.pdf';

/** 8 CFR 214.1(l)(2), current eCFR text. */
export const H1B_GRACE_PERIOD_REGULATION_URL =
  'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1';

export const H1B_GRACE_PERIOD_MAX_DAYS = 60;

export const H1B_GRACE_PERIOD_REGULATION_TEXT =
  'An alien admitted or otherwise provided status in E-1, E-2, E-3, H-1B, H-1B1, L-1, O-1 or TN classification and his or her dependents shall not be considered to have failed to maintain nonimmigrant status solely on the basis of a cessation of the employment on which the alien\'s classification was based, for up to 60 consecutive days or until the end of the authorized validity period, whichever is shorter, once during each authorized validity period. DHS may eliminate or shorten this 60-day period as a matter of discretion. Unless otherwise authorized under 8 CFR 274a.12, the alien may not work during such a period.';

/**
 * USCIS guidance (archived). No current non-archived page exists on uscis.gov.
 * The 60-day rule itself is 8 CFR 214.1(l)(2).
 */
export const USCIS_TERMINATION_OPTIONS_URL =
  'https://www.uscis.gov/working-in-the-united-states/information-for-employers-and-employees/options-for-nonimmigrant-workers-following-termination-of-employment';

export const USCIS_TERMINATION_LINK_LABEL = 'USCIS guidance (archived)';

export const USCIS_TERMINATION_PAGE_ARCHIVED =
  'The information on this page is out of date. However, some of the content may still be useful, so we have archived the page.';

export const USCIS_POST_TERMINATION_OPTIONS = [
  'File an application for a change of nonimmigrant status.',
  'File an application for adjustment of status.',
  'File an application for a compelling circumstances employment authorization document.',
  'Be the beneficiary of a nonfrivolous petition to change employer.',
  'Depart the United States.',
] as const;

export const USCIS_H1B_NEW_PETITION =
  'If the worker is an eligible H-1B nonimmigrant and an employer files a new nonfrivolous H-1B petition on their behalf, the worker can begin work immediately after USCIS receives the petition and continue to maintain their H-1B status.';

export const USCIS_GRACE_PERIOD_LENGTH =
  'Regulations permit a discretionary grace period that allows workers in E-1, E-2, E-3, H-1B, H-1B1, L-1, O-1, or TN classifications (and their dependents) to be considered as having maintained status in that same classification after the end of employment for up to 60 consecutive calendar days or until the end of the authorized nonimmigrant validity period, whichever is shorter.';

export const USCIS_GRACE_PERIOD_START =
  'The maximum 60-day grace period starts the day after termination of employment, which is typically determined based on the last day for which a salary or wage is paid.';

export const USCIS_GRACE_PERIOD_NO_ACTION =
  'If the worker takes no action within the grace period, they and their dependents may then need to depart the United States within 60 days, or when their authorized validity period ends, whichever is shorter.';

export const USCIS_GRACE_PERIOD_ONCE =
  'You are eligible for the maximum 60-day grace period once during each authorized employer petition validity period.';

export const USCIS_GRACE_PERIOD_NO_WORK =
  'Employment is prohibited during the up to 60-day grace period unless otherwise authorized.';

export const USCIS_EB5_ADJUSTMENT =
  'Some workers may be eligible to file a self-petitioned immigrant visa petition concurrently with an adjustment of status application. Examples of immigrant classifications that are eligible for self-petitioning include EB-1 Extraordinary Ability and EB-5 Immigrant Investor.';

export function formatProgramDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatProgramDollars(amount: number): string {
  return amount.toLocaleString('en-US');
}
