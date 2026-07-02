import { SITE_CONFIG } from './config';
import type { ArticleSchema, BreadcrumbItem, FAQItem } from './types';

function publisherWithLogo() {
  return {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: 'Student EB5',
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512,
    },
    image: SITE_CONFIG.defaultOgImage,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    foundingDate: '2024-01-01',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'EB-5 Visa Program',
      'Investment Immigration',
      'F-1 Student Visa',
      'H-1B Visa',
      'US Green Card',
      'Regional Center Investment',
      'Direct EB-5 Investment',
      'Immigration Law',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: SITE_CONFIG.email,
      availableLanguage: ['English'],
    },
  };
}

export function generateProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_CONFIG.url}/#service`,
    name: `${SITE_CONFIG.name} - EB-5 Educational Resources`,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512,
    },
    image: SITE_CONFIG.defaultOgImage,
    description: 'Free educational resources and guidance for international students and H-1B professionals exploring EB-5 investment immigration pathways to US permanent residency.',
    priceRange: '$',
    email: SITE_CONFIG.email,
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceType: [
      'EB-5 Visa Education',
      'Immigration Information',
      'Investment Immigration Guidance',
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'International Students and H-1B Professionals',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'EB-5 Educational Resources',
      itemListElement: [
        {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          itemOffered: {
            '@type': 'Service',
            name: 'EB-5 Guide',
            description: 'Comprehensive guide to EB-5 investment immigration',
            url: `${SITE_CONFIG.url}/research/complete-2027-eb5-guide`,
          },
        },
        {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          itemOffered: {
            '@type': 'Service',
            name: 'EB-5 Market Outlook',
            description: 'Current trends and analysis in EB-5 investment',
            url: `${SITE_CONFIG.url}/resources`,
          },
        },
      ],
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: publisherWithLogo(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/research?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateArticleSchema(article: ArticleSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
    publisher: publisherWithLogo(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url || SITE_CONFIG.url,
    },
    keywords: article.keywords,
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSiteNavigationSchema() {
  const items = [
    { name: 'Home', url: `${SITE_CONFIG.url}/` },
    { name: 'Research', url: `${SITE_CONFIG.url}/research` },
    { name: 'FAQ', url: `${SITE_CONFIG.url}/faq` },
    { name: 'Resources', url: `${SITE_CONFIG.url}/resources` },
    { name: 'Tools', url: `${SITE_CONFIG.url}/eb5-investment-immigration-tools` },
    { name: 'About', url: `${SITE_CONFIG.url}/about` },
    { name: 'Contact', url: `${SITE_CONFIG.url}/contact` },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': items.map((item) => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      url: item.url,
    })),
  };
}
export function generateBlogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_CONFIG.name} Research`,
    description: 'Expert research and updates on EB-5 investment immigration for international students',
    url: `${SITE_CONFIG.url}/research`,
    publisher: publisherWithLogo(),
  };
}

export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_CONFIG.name}`,
    description: 'Get in touch with StudentEB5 for EB-5 investment immigration information and resources',
    url: `${SITE_CONFIG.url}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      email: SITE_CONFIG.email,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
  };
}

export function generateAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_CONFIG.name}`,
    description: 'StudentEB5 is a free educational resource dedicated to helping international students, professionals, and H1B visa holders explore their options for achieving permanent U.S. residency through the EB-5 investment program.',
    url: `${SITE_CONFIG.url}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      description: 'Free educational resource for EB-5 investment immigration guidance',
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
  };
}

export function generateWebPageSchema(name: string, description: string, url: string, breadcrumbs?: BreadcrumbItem[]) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    publisher: publisherWithLogo(),
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
  }

  return schema;
}
