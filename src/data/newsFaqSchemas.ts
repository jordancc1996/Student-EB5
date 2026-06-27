export const landscapeMay2026FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the EB-5 grandfathering deadline in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The EB-5 grandfathering deadline is September 30, 2026. Investors who file before this date may receive protection if the Regional Center program later faces a lapse in authorization.',
      },
    },
    {
      '@type': 'Question',
      name: 'When could EB-5 investment amounts increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EB-5 investment thresholds are scheduled to adjust for inflation on January 1, 2027. Current projections indicate the TEA threshold could rise from $800,000 to roughly $900,000 to $937,500.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are rural EB-5 projects receiving attention in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rural EB-5 projects are receiving attention because the Reform and Integrity Act gives them priority processing. Recent reporting periods show rural petitions moving faster than many urban project petitions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does concurrent filing help H-1B and F-1 visa holders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Concurrent filing may allow eligible investors already in the United States to file adjustment of status with the EB-5 petition and later receive employment authorization and advance parole while the petition is pending.',
      },
    },
  ],
};

export const julyBulletinQ3FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the "U" mean for India Unreserved in the Visa Bulletin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The "U" indicates that the annual limit for the category has been reached and no further visas are available for the remainder of the fiscal year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I still file an EB-5 petition if my country’s unreserved category is unavailable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The unavailability of the unreserved category does not affect the reserved categories (rural, high unemployment, and infrastructure). Investors from all countries can continue to file in these categories.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a current priority date mean I will get my green card immediately upon I-526E approval?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your priority date must be current at the time your I-526E is approved for USCIS to adjudicate your adjustment of status. If the category retrogresses before approval, you will be placed in a backlog.',
      },
    },
  ],
};

export function getNewsFaqSchema(slug: string) {
  if (slug === 'eb5-visa-landscape-news-update-may-2026') {
    return landscapeMay2026FaqSchema;
  }
  if (slug === 'july-2026-visa-bulletin-eb5-q3-outlook') {
    return julyBulletinQ3FaqSchema;
  }
  return null;
}
