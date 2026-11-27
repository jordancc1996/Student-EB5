/**
 * USCIS Check Case Processing Times, read on November 25, 2026.
 * https://egov.uscis.gov/processing-times/
 *
 * Each `months` value is the figure USCIS displays as
 * "80% of cases are completed within". The page does not show a range.
 * Office and category:
 * - I-526E, category 526IP, Immigrant Investor Program Office
 * - I-526, category 133IP, Immigrant Investor Program Office
 * - I-829, category 148C, Immigrant Investor Program Office
 * - I-485, employment-based category 131A, Service Center Operations
 *   USCIS states that the Service Center Operations employment-based time
 *   is for EB-4 and EB-5 cases.
 *
 * Update this file monthly from that USCIS page. Do not copy figures from
 * law firm sites or case trackers.
 */

export const PROCESSING_TIMES_SOURCE_URL = 'https://egov.uscis.gov/processing-times/';

/** USCIS publication date: "Last Updated: November 20, 2026". */
export const PROCESSING_TIMES_AS_OF = '2026-11-20';

/** USCIS label: "Processing Time Data from May 2026 to October 2026". */
export const PROCESSING_TIMES_WINDOW = 'May 2026 to October 2026';

/** Sentence shown with the figure on the USCIS processing-times page. */
export const PROCESSING_TIME_DEFINITION =
  'This processing time is based on how long it took us to complete 80% of adjudicated cases over the past six months.';

export interface ProcessingTimeEntry {
  form: string;
  label: string;
  office: string;
  months: number;
  sourceUrl: string;
  asOf: string;
  note: string;
}

export const processingTimes: ProcessingTimeEntry[] = [
  {
    form: 'I-526E',
    label: 'Immigrant petition by regional center investor',
    office: 'Immigrant Investor Program Office',
    months: 35.5,
    sourceUrl: PROCESSING_TIMES_SOURCE_URL,
    asOf: PROCESSING_TIMES_AS_OF,
    note: 'Adjudication of a Form I-526E depends on adjudication of the associated Form I-956F and is completed only after that I-956F is adjudicated. Form I-526E processing times reflect only petitions whose associated Forms I-956F have been adjudicated.',
  },
  {
    form: 'I-526',
    label: 'Immigrant petition by standalone investor',
    office: 'Immigrant Investor Program Office',
    months: 38,
    sourceUrl: PROCESSING_TIMES_SOURCE_URL,
    asOf: PROCESSING_TIMES_AS_OF,
    note: 'USCIS generally first processes Form I-526 for investors for whom a visa is available or will soon be available. The published time is based on completed cases from prior months.',
  },
  {
    form: 'I-829',
    label: 'Petition to remove conditions on permanent residence',
    office: 'Immigrant Investor Program Office',
    months: 27,
    sourceUrl: PROCESSING_TIMES_SOURCE_URL,
    asOf: PROCESSING_TIMES_AS_OF,
    note: 'This processing time does not include the ongoing adjudication of public law cases from 1997 to 2004.',
  },
  {
    form: 'I-485',
    label: 'Employment-based adjustment of status (EB-5)',
    office: 'Service Center Operations',
    months: 47,
    sourceUrl: PROCESSING_TIMES_SOURCE_URL,
    asOf: PROCESSING_TIMES_AS_OF,
    note: 'USCIS states that Service Center Operations employment-based I-485 times are only for fourth preference (EB-4) and fifth preference (EB-5) cases. Those times do not include visa-regressed adjustment applications.',
  },
];

export function processingTimeByForm(form: string): ProcessingTimeEntry {
  const entry = processingTimes.find((item) => item.form === form);
  if (!entry) throw new Error(`Missing processing time: ${form}`);
  return entry;
}

export function formatProcessingMonths(months: number): string {
  return `${months} months`;
}

/** "November 2026" from an ISO date. */
export function formatProcessingMonth(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
