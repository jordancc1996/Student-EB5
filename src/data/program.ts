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

/** Same November 2026 employment-based final action chart. EB-2 and EB-3. */
export const EB2_FAD_INDIA = '2013-11-01';
export const EB3_FAD_INDIA = '2014-01-22';
export const EB2_FAD_CHINA = '2021-10-01';
export const EB3_FAD_CHINA = '2022-01-22';

export const VISA_BULLETIN_NOVEMBER_2026_URL =
  'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html';

export const VISA_BULLETIN_SOURCE = 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html';

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
