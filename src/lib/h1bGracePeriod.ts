import {
  H1B_GRACE_PERIOD_REGULATION_TEXT,
  USCIS_EB5_ADJUSTMENT,
  USCIS_GRACE_PERIOD_LENGTH,
  USCIS_GRACE_PERIOD_NO_WORK,
  USCIS_GRACE_PERIOD_ONCE,
  USCIS_GRACE_PERIOD_START,
} from '../data/program';

const regulationSentences = H1B_GRACE_PERIOD_REGULATION_TEXT.split('. ').map((part, index, all) =>
  index === all.length - 1 || part.endsWith('.') ? part : `${part}.`,
);

export const GRACE_PERIOD_FAQS = [
  {
    question: 'When does the 60-day grace period start?',
    answer: `USCIS says: ${USCIS_GRACE_PERIOD_START}`,
  },
  {
    question: 'Do weekends count in the 60 days?',
    answer: `USCIS says: ${USCIS_GRACE_PERIOD_LENGTH} Consecutive calendar days include weekends. 8 CFR 214.1(l)(2) uses the same shorter-of test: up to 60 consecutive days or the end of the authorized validity period, whichever is shorter.`,
  },
  {
    question: 'What happens if the I-94 date comes first?',
    answer:
      '8 CFR 214.1(l)(2) ends the period at up to 60 consecutive days or the end of the authorized validity period, whichever is shorter. This calculator uses the I-94 expiration date as that validity date. If the I-94 date is earlier, that earlier date is the end date.',
  },
  {
    question: 'How many times is the grace period available?',
    answer: `8 CFR 214.1(l)(2) makes the period available once during each authorized validity period. USCIS says: ${USCIS_GRACE_PERIOD_ONCE}`,
  },
  {
    question: 'Can you work during the grace period?',
    answer: `${regulationSentences[2]} USCIS says: ${USCIS_GRACE_PERIOD_NO_WORK}`,
  },
] as const;

export const GRACE_PERIOD_EB5_NOTE = USCIS_EB5_ADJUSTMENT;
