import type { PhotoPlacement, PhotoRecord } from '@/lib/photos/types';

export const photoRegistry: PhotoRecord[] = [
  {
    id: 'uw-campus',
    filename: 'uw-campus.jpg',
    unsplashId: 'PXoUUAtHTbw',
    unsplashUrl: 'https://unsplash.com/photos/brick-building-on-campus-with-people-walking-PXoUUAtHTbw',
    photographer: 'Zoshua Colah',
    profileUrl: 'https://unsplash.com/@zoshuacolah',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Brick campus buildings and a plaza at the University of Washington in Seattle',
    containsRecognizablePeople: true,
  },
  {
    id: 'campus-archway',
    filename: 'campus-archway.jpg',
    unsplashId: 'MUiv880yORo',
    unsplashUrl: 'https://unsplash.com/photos/students-walking-through-a-university-campus-archway-MUiv880yORo',
    photographer: 'Brelyn Bashrum',
    profileUrl: 'https://unsplash.com/@brelynkk',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Students walking through a university campus archway',
    containsRecognizablePeople: true,
  },
  {
    id: 'cuhk-campus',
    filename: 'cuhk-campus.jpg',
    unsplashId: 'sA5l7DimlqY',
    unsplashUrl: 'https://unsplash.com/photos/modern-building-with-people-walking-outside-sA5l7DimlqY',
    photographer: 'Raymond Yeung',
    profileUrl: 'https://unsplash.com/@optiny',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Modern university library and plaza at the Chinese University of Hong Kong',
    containsRecognizablePeople: true,
  },
  {
    id: 'suzzallo-interior',
    filename: 'suzzallo-interior.jpg',
    unsplashId: 'MX1jDkQJBQY',
    unsplashUrl: 'https://unsplash.com/photos/a-grand-library-with-high-ceilings-and-bookshelves-MX1jDkQJBQY',
    photographer: 'Zoshua Colah',
    profileUrl: 'https://unsplash.com/@zoshuacolah',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Reading room with high ceilings and bookshelves at Suzzallo Library, University of Washington',
    containsRecognizablePeople: false,
  },
  {
    id: 'nyc-financial',
    filename: 'nyc-financial.jpg',
    unsplashId: '63W4HqhDNYc',
    unsplashUrl: 'https://unsplash.com/photos/city-skyline-under-cloudy-sky-during-daytime-63W4HqhDNYc',
    photographer: 'Alev Takil',
    profileUrl: 'https://unsplash.com/@alevtakil',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Lower Manhattan financial district skyline under a cloudy sky',
    containsRecognizablePeople: false,
  },
  {
    id: 'chicago-river',
    filename: 'chicago-river.jpg',
    unsplashId: 'tKkQBaxiWVE',
    unsplashUrl: 'https://unsplash.com/photos/skyscrapers-line-the-chicago-river-in-a-cityscape-tKkQBaxiWVE',
    photographer: 'Tobias Reich',
    profileUrl: 'https://unsplash.com/@electerious',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Chicago River lined with downtown office towers',
    containsRecognizablePeople: false,
  },
  {
    id: 'dc-capitol',
    filename: 'dc-capitol.jpg',
    unsplashId: 'GiOcVe2PVpg',
    unsplashUrl: 'https://unsplash.com/photos/the-us-capitol-building-with-people-walking-GiOcVe2PVpg',
    photographer: 'Connor Gan',
    profileUrl: 'https://unsplash.com/@connorgan',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'United States Capitol building in Washington, D.C.',
    containsRecognizablePeople: true,
  },
  {
    id: 'dc-pillars',
    filename: 'dc-pillars.jpg',
    unsplashId: 'SwEKEwzOcWE',
    unsplashUrl: 'https://unsplash.com/photos/a-person-walking-in-front-of-two-large-pillars-SwEKEwzOcWE',
    photographer: 'Zach Camp',
    profileUrl: 'https://unsplash.com/@zachccamp',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Stone columns on the United States Capitol grounds',
    containsRecognizablePeople: true,
  },
  {
    id: 'rural-grader',
    filename: 'rural-grader.jpg',
    unsplashId: 'htc-q2ZcSYY',
    unsplashUrl: 'https://unsplash.com/photos/yellow-motor-grader-parked-in-a-grassy-field-htc-q2ZcSYY',
    photographer: 'Roger Starnes Sr',
    profileUrl: 'https://unsplash.com/@rstar50',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Yellow motor grader parked in a grassy field',
    containsRecognizablePeople: false,
  },
  {
    id: 'oregon-highway',
    filename: 'oregon-highway.jpg',
    unsplashId: 'hDA5kGf0S6U',
    unsplashUrl: 'https://unsplash.com/photos/a-yellow-and-gray-tanker-truck-driving-down-a-road-hDA5kGf0S6U',
    photographer: 'Tom Shamberger',
    profileUrl: 'https://unsplash.com/@tshamberger',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Highway maintenance truck on a rural road in Oregon',
    containsRecognizablePeople: false,
  },
  {
    id: 'lisbon-sunset',
    filename: 'lisbon-sunset.jpg',
    unsplashId: 'zEFfW3kXQR8',
    unsplashUrl: 'https://unsplash.com/photos/lisbons-skyline-glows-under-a-beautiful-sunset-zEFfW3kXQR8',
    photographer: 'Aleksandr Zaitsev',
    profileUrl: 'https://unsplash.com/@anwaltzzz',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Lisbon skyline at sunset',
    containsRecognizablePeople: false,
  },
  {
    id: 'shanghai-night',
    filename: 'shanghai-night.jpg',
    unsplashId: '2PgV2SS1JiE',
    unsplashUrl: 'https://unsplash.com/photos/shanghai-skyline-illuminated-at-night-2PgV2SS1JiE',
    photographer: 'Roger Goh',
    profileUrl: 'https://unsplash.com/@rogergzw',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Shanghai Bund skyline illuminated at night',
    containsRecognizablePeople: false,
  },
  {
    id: 'shanghai-bund',
    filename: 'shanghai-bund.jpg',
    unsplashId: '0p37Ch2LYQc',
    unsplashUrl: 'https://unsplash.com/photos/shanghai-skyline-on-a-cloudy-day-0p37Ch2LYQc',
    photographer: 'Nicolas Jehly',
    profileUrl: 'https://unsplash.com/@nicolasjehly',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Shanghai skyline from the Bund on a cloudy day',
    containsRecognizablePeople: false,
  },
  {
    id: 'seoul-skyline',
    filename: 'seoul-skyline.jpg',
    unsplashId: 'CfqYTLLWATA',
    unsplashUrl: 'https://unsplash.com/photos/a-city-skyline-with-tall-buildings-CfqYTLLWATA',
    photographer: 'Adil Edin',
    profileUrl: 'https://unsplash.com/@artististanbul',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Seoul downtown skyline with high-rise buildings',
    containsRecognizablePeople: false,
  },
  {
    id: 'mumbai-marine',
    filename: 'mumbai-marine.jpg',
    unsplashId: 'nsunJX3Q9lg',
    unsplashUrl: 'https://unsplash.com/photos/a-body-of-water-with-a-city-in-the-background-nsunJX3Q9lg',
    photographer: 'Nishith Parikh',
    profileUrl: 'https://unsplash.com/@nishithparikh90',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Mumbai Marine Drive waterfront and skyline at dusk',
    containsRecognizablePeople: false,
  },
  {
    id: 'mumbai-night',
    filename: 'mumbai-night.jpg',
    unsplashId: '9SDgek2e7Bs',
    unsplashUrl: 'https://unsplash.com/photos/a-view-of-a-city-at-night-from-across-the-water-9SDgek2e7Bs',
    photographer: 'Sidharth Kumar',
    profileUrl: 'https://unsplash.com/@storiesbysid_',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Mumbai Marine Drive at night seen from across the water',
    containsRecognizablePeople: false,
  },
  {
    id: 'hanoi-old',
    filename: 'hanoi-old.jpg',
    unsplashId: 'Lg3JjZ1XJA0',
    unsplashUrl: 'https://unsplash.com/photos/an-aerial-view-of-a-city-with-lots-of-buildings-Lg3JjZ1XJA0',
    photographer: 'Alex Wolfe',
    profileUrl: 'https://unsplash.com/@alxwlfe',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Aerial view of Hanoi Old Quarter rooftops',
    containsRecognizablePeople: false,
  },
  {
    id: 'hanoi-night',
    filename: 'hanoi-night.jpg',
    unsplashId: 'rbWr2av3Bp8',
    unsplashUrl: 'https://unsplash.com/photos/city-skyline-with-lights-reflecting-on-water-at-night-rbWr2av3Bp8',
    photographer: 'Ivy Dao',
    profileUrl: 'https://unsplash.com/@peachlatte',
    source: 'unsplash',
    license: 'unsplash',
    alt: 'Hanoi city lights reflecting on water at night',
    containsRecognizablePeople: false,
  },
];

export const photoById = new Map(photoRegistry.map((photo) => [photo.id, photo]));
export const photoByFilename = new Map(photoRegistry.map((photo) => [photo.filename, photo]));

export function getPhoto(id: string): PhotoRecord | undefined {
  return photoById.get(id);
}

export function getPhotoByFilename(filename: string): PhotoRecord | undefined {
  return photoByFilename.get(filename);
}

/** Editorial placements keyed by site path. Related pages may share a cluster photo. */
export const photoPlacementsByPath: Record<string, PhotoPlacement[]> = {
  '/research/eb5-inflation-adjustment-f1-h1b': [
    { id: 'dc-capitol', layout: 'wide' },
  ],
  '/research/f1-students/f1-to-eb5-green-card': [
    { id: 'uw-campus', layout: 'right' },
    { id: 'suzzallo-interior', layout: 'wide' },
  ],
  '/research/f1-students/eb5-indian-chinese-students-f1-stem-opt': [
    { id: 'campus-archway', layout: 'left' },
  ],
  '/research/f1-students/eb5-funding-strategies-students': [
    { id: 'suzzallo-interior', layout: 'right' },
  ],
  '/research/how-eb5-visa-transforms-us-education-experience': [
    { id: 'uw-campus', layout: 'wide' },
  ],
  '/research/golden-visas-vs-eb5-elite-students': [
    { id: 'lisbon-sunset', layout: 'wide' },
  ],
  '/research/golden-visa-global-education-student-stories': [
    { id: 'lisbon-sunset', layout: 'right' },
  ],
  '/research/comparisons/is-eb5-worth-it-indian-chinese-students': [
    { id: 'mumbai-marine', layout: 'wide' },
  ],
  '/research/best-alternative-to-h1b-o1-eb1-eb5': [
    { id: 'nyc-financial', layout: 'right' },
  ],
  '/research/eb5-lifeline-h1b-workers': [
    { id: 'chicago-river', layout: 'wide' },
  ],
  '/research/5-reasons-switch-h1b-to-eb5': [
    { id: 'nyc-financial', layout: 'left' },
  ],
  '/research/h1b-60-day-grace-period-layoff-guide': [
    { id: 'chicago-river', layout: 'right' },
  ],
  '/research/h1b-eb5-financial-planning': [
    { id: 'nyc-financial', layout: 'wide' },
  ],
  '/research/h1b-tech-layoffs-eb5-entrepreneurship': [
    { id: 'chicago-river', layout: 'left' },
  ],
  '/research/best-immigration-backup-plan-indian-tech-workers-2026': [
    { id: 'mumbai-night', layout: 'wide' },
  ],
  '/research/eb5-guide-indian-professionals-2026': [
    { id: 'mumbai-marine', layout: 'right' },
  ],
  '/research/j1-f1-h1b-eb5-concurrent-filing': [
    { id: 'dc-capitol', layout: 'wide' },
  ],
  '/research/eb5-visa-aging-out-crisis-solution': [
    { id: 'dc-pillars', layout: 'right' },
  ],
  '/research/choosing-rural-eb5-regional-center-guide': [
    { id: 'rural-grader', layout: 'wide' },
    { id: 'oregon-highway', layout: 'left' },
  ],
  '/research/19-questions-rural-eb5-project-due-diligence': [
    { id: 'oregon-highway', layout: 'wide' },
  ],
  '/research/investment/what-to-know-before-investing-in-eb5': [
    { id: 'nyc-financial', layout: 'right' },
  ],
  '/research/investment/i526e-filing-cost': [
    { id: 'dc-pillars', layout: 'left' },
  ],
  '/research/ways-to-fund-eb5-investment-2026': [
    { id: 'chicago-river', layout: 'wide' },
  ],
  '/research/eb5-economic-calculus-investment-cost': [
    { id: 'nyc-financial', layout: 'left' },
  ],
  '/research/eb5-capital-stack': [
    { id: 'chicago-river', layout: 'right' },
  ],
  '/research/eb5-cryptocurrency-source-of-funds': [
    { id: 'nyc-financial', layout: 'wide' },
  ],
  '/research/complete-2027-eb5-guide': [
    { id: 'dc-capitol', layout: 'wide' },
  ],
  '/research/eb5-grandfathering-2026-2027-deadlines': [
    { id: 'dc-capitol', layout: 'right' },
  ],
  '/research/post-reform-integrity-act-analysis': [
    { id: 'dc-pillars', layout: 'wide' },
  ],
  '/research/eb5-vs-trump-gold-card-2026': [
    { id: 'dc-capitol', layout: 'left' },
  ],
  '/research/best-opportunity-investment-migration-2026': [
    { id: 'lisbon-sunset', layout: 'wide' },
  ],
  '/research/eb5-investments-africa-mena-regions': [
    { id: 'nyc-financial', layout: 'right' },
  ],
  '/research/regional-center-shutdown-eb5-investor-protections': [
    { id: 'dc-pillars', layout: 'wide' },
  ],
  '/research/evaluating-eb5-projects-pending-i956f': [
    { id: 'rural-grader', layout: 'right' },
  ],
  '/research/eb5-timing-risks-petition-invalidation': [
    { id: 'dc-capitol', layout: 'left' },
  ],
  '/research/eb5-investor-qa-part-1': [
    { id: 'suzzallo-interior', layout: 'wide' },
  ],
  '/research/eb5-comprehensive-faq-timeline-international-students': [
    { id: 'campus-archway', layout: 'right' },
  ],
  '/research/eb5-2026-official-white-paper': [
    { id: 'dc-capitol', layout: 'wide' },
  ],
  '/news/july-2026-visa-bulletin-eb5-q3-outlook': [
    { id: 'dc-capitol', layout: 'wide' },
  ],
  '/news/uscis-adjustment-of-status-memo-eb5-investors': [
    { id: 'dc-pillars', layout: 'right' },
  ],
  '/news/eb5-visa-landscape-news-update-may-2026': [
    { id: 'nyc-financial', layout: 'wide' },
  ],
  '/pathways/eb5-for-opt-students': [{ id: 'campus-archway', layout: 'wide' }],
  '/pathways/eb5-for-graduate-students': [{ id: 'suzzallo-interior', layout: 'wide' }],
  '/pathways/eb5-for-indian-students': [{ id: 'mumbai-marine', layout: 'wide' }],
  '/pathways/eb5-for-chinese-students': [{ id: 'cuhk-campus', layout: 'wide' }],
  '/pathways/f1-to-eb5-self-sponsored-green-card': [{ id: 'uw-campus', layout: 'wide' }],
  '/pathways/eb5-for-families-with-us-students': [{ id: 'campus-archway', layout: 'right' }],
  '/pathways/parents-and-families': [{ id: 'dc-pillars', layout: 'wide' }],
  '/pathways/eb5-for-h4-families': [{ id: 'dc-pillars', layout: 'left' }],
  '/pathways/eb5-for-indian-families': [{ id: 'mumbai-night', layout: 'wide' }],
  '/pathways/eb5-for-chinese-families': [{ id: 'shanghai-bund', layout: 'wide' }],
  '/pathways/eb5-for-wealthy-families': [{ id: 'nyc-financial', layout: 'wide' }],
  '/pathways/eb5-for-indian-h1b': [{ id: 'mumbai-marine', layout: 'right' }],
  '/pathways/eb5-for-indian-investors': [{ id: 'mumbai-night', layout: 'wide' }],
  '/pathways/eb5-for-chinese-investors': [{ id: 'shanghai-night', layout: 'wide' }],
  '/pathways/eb5-for-korean-investors': [{ id: 'seoul-skyline', layout: 'wide' }],
  '/pathways/eb5-for-vietnamese-investors': [{ id: 'hanoi-old', layout: 'wide' }],
  '/pathways/eb5-for-taiwanese-investors': [{ id: 'nyc-financial', layout: 'right' }],
  '/pathways/eb5-for-tech-workers': [{ id: 'chicago-river', layout: 'wide' }],
  '/pathways/eb5-for-startup-founders': [{ id: 'chicago-river', layout: 'right' }],
  '/pathways/eb5-for-entrepreneurs': [{ id: 'nyc-financial', layout: 'wide' }],
  '/pathways/h1b-to-green-card': [{ id: 'nyc-financial', layout: 'wide' }],
  '/pathways/eb5-vs-h1b': [{ id: 'chicago-river', layout: 'wide' }],
  '/pathways/eb5-for-j1': [{ id: 'uw-campus', layout: 'right' }],
  '/pathways/eb5-for-l1': [{ id: 'nyc-financial', layout: 'left' }],
  '/pathways/eb5-concurrent-filing': [{ id: 'dc-capitol', layout: 'wide' }],
  '/pathways/eb2-to-eb5': [{ id: 'dc-pillars', layout: 'wide' }],
  '/pathways/eb3-to-eb5': [{ id: 'dc-capitol', layout: 'right' }],
  '/pathways/eb5-vs-eb2-niw': [{ id: 'dc-capitol', layout: 'wide' }],
  '/pathways/eb5-vs-other-visa-options': [{ id: 'lisbon-sunset', layout: 'wide' }],
  '/pathways/rural-eb5': [{ id: 'rural-grader', layout: 'wide' }],
  '/pathways/eb5-project-due-diligence': [{ id: 'oregon-highway', layout: 'wide' }],
  '/pathways/i956f-approved-eb5-projects': [{ id: 'rural-grader', layout: 'right' }],
  '/pathways/eb5-risk-and-due-diligence': [{ id: 'oregon-highway', layout: 'left' }],
  '/pathways/eb5-source-of-funds': [{ id: 'chicago-river', layout: 'wide' }],
  '/pathways/eb5-gifted-funds': [{ id: 'suzzallo-interior', layout: 'right' }],
  '/pathways/eb5-business-income': [{ id: 'chicago-river', layout: 'wide' }],
  '/pathways/eb5-property-sale-funds': [{ id: 'nyc-financial', layout: 'right' }],
  '/pathways/eb5-child-aging-out': [{ id: 'dc-pillars', layout: 'wide' }],
  '/pathways/h1b-60-day-clock': [{ id: 'chicago-river', layout: 'wide' }],
};

export function getPlacementsForPath(pathname: string): PhotoPlacement[] {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return photoPlacementsByPath[normalized] ?? [];
}

export function getPhotosUsedOnPath(pathname: string): PhotoRecord[] {
  return getPlacementsForPath(pathname)
    .map((placement) => getPhoto(placement.id))
    .filter((photo): photo is PhotoRecord => photo != null);
}
