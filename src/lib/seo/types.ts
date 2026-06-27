export interface SEOConfig {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
  noindex?: boolean;
}

export interface ArticleSEO extends SEOConfig {
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category?: string;
  tags?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  email?: string;
  sameAs?: string[];
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  keywords?: string;
  url?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageRoute {
  path: string;
  title: string;
  description: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}
