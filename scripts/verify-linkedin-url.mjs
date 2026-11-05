import { normalizeLinkedInUrl } from '../src/lib/linkedinUrl.ts';

const cases = [
  ['', ''],
  ['   ', ''],
  ['linkedin.com/in/name', 'https://www.linkedin.com/in/name'],
  ['www.linkedin.com/in/name', 'https://www.linkedin.com/in/name'],
  ['https://linkedin.com/in/name/', 'https://www.linkedin.com/in/name'],
  ['https://www.linkedin.com/in/name?trk=abc', 'https://www.linkedin.com/in/name'],
  ['uk.linkedin.com/in/name', 'https://www.linkedin.com/in/name'],
  ['https://www.linkedin.com/pub/jane-doe/1/2/3/', 'https://www.linkedin.com/pub/jane-doe/1/2/3'],
  ['facebook.com/x', null],
  ['hello', null],
  ['https://www.linkedin.com/company/foo', null],
];

let failed = 0;
for (const [input, expected] of cases) {
  const result = normalizeLinkedInUrl(input);
  const actual = result.ok ? result.url : null;
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${JSON.stringify(input)} => ${JSON.stringify(actual)} expected ${JSON.stringify(expected)}`);
  }
}

if (failed) {
  console.error(`${failed} LinkedIn URL case(s) failed`);
  process.exit(1);
}

console.log(`OK ${cases.length} LinkedIn URL cases`);
