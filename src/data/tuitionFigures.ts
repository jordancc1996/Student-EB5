export type TuitionFigure = {
  school: string;
  amount: number;
  academicYear: string;
  sourceUrl: string;
  asOf: string;
  residency: 'international' | 'in-state';
};

const academicYear = '2024-2025';

function row(
  school: string,
  residency: TuitionFigure['residency'],
  amount: number,
): TuitionFigure {
  return {
    school,
    amount,
    academicYear,
    sourceUrl: '',
    asOf: '',
    residency,
  };
}

export const TUITION_ACADEMIC_YEAR = academicYear;

export const tuitionFigures: TuitionFigure[] = [
  row('Arizona State University (ASU)', 'international', 39910),
  row('Arizona State University (ASU)', 'in-state', 12482),
  row('UC San Diego', 'international', 48878),
  row('UC San Diego', 'in-state', 14610),
  row('UC Irvine', 'international', 48006),
  row('UC Irvine', 'in-state', 14312),
  row('UC Berkeley', 'international', 48176),
  row('UC Berkeley', 'in-state', 14312),
  row('UCLA', 'international', 48315),
  row('UCLA', 'in-state', 13804),
  row('University of Illinois Urbana-Champaign (UIUC)', 'international', 38860),
  row('University of Illinois Urbana-Champaign (UIUC)', 'in-state', 18042),
  row('University of Michigan (Ann Arbor)', 'international', 60094),
  row('University of Michigan (Ann Arbor)', 'in-state', 17786),
  row('University of Washington (Seattle)', 'international', 44076),
  row('University of Washington (Seattle)', 'in-state', 12643),
];

export function tuitionPair(school: string): { intl: number; inState: number; academicYear: string } | null {
  const rows = tuitionFigures.filter((figure) => figure.school === school);
  const intl = rows.find((figure) => figure.residency === 'international');
  const inState = rows.find((figure) => figure.residency === 'in-state');
  if (!intl || !inState) return null;
  return { intl: intl.amount, inState: inState.amount, academicYear: intl.academicYear };
}

export function tuitionSchools(): string[] {
  return [...new Set(tuitionFigures.map((figure) => figure.school))];
}
