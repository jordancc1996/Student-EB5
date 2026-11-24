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
