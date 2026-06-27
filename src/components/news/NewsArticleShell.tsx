import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import OptimizedImage from '@/components/OptimizedImage';
import type { NewsArticleMeta } from '@/data/newsArticles';
import NewsLegalDisclaimer from './NewsLegalDisclaimer';

interface NewsArticleShellProps {
  article: NewsArticleMeta;
  children: React.ReactNode;
}

const NewsArticleShell = ({ article, children }: NewsArticleShellProps) => (
  <>
    <section
      className={`relative -mt-[120px] pt-[120px] ${article.heroMinHeightClass} flex items-center justify-center overflow-hidden`}
    >
      <OptimizedImage
        src={article.heroImage}
        alt={article.heroImageAlt}
        title={article.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
      <div className="relative z-10 container mx-auto px-6 py-16 text-center text-white max-w-5xl">
        <Badge
          variant="secondary"
          className="mb-5 bg-white/20 text-white border-white/30 uppercase tracking-[0.18em]"
        >
          {article.category}
        </Badge>
        <h1 className={article.heroTitleClass}>{article.title}</h1>
        <p className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8 drop-shadow">
          {article.heroSubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-base text-white/90 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Published {article.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </section>

    <main className="container mx-auto px-6 pt-4 pb-16">
      <article className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="py-4 mb-6">
          <ol className="flex flex-wrap items-center gap-0 text-sm">
            <li className="flex items-center">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium tracking-wide uppercase text-[11px]"
              >
                Home
              </a>
              <ChevronRight className="w-3 h-3 mx-2 text-muted-foreground" />
            </li>
            <li className="flex items-center">
              <a
                href="/news"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium tracking-wide uppercase text-[11px]"
              >
                EB-5 News
              </a>
              <ChevronRight className="w-3 h-3 mx-2 text-muted-foreground" />
            </li>
            <li className="flex items-center">
              <span className="text-foreground font-serif text-base font-semibold">{article.breadcrumbLabel}</span>
            </li>
          </ol>
        </nav>

        <NewsLegalDisclaimer className="mb-8" />

        <div className="prose prose-lg max-w-[880px] mx-auto article-content">{children}</div>

        <Card className="mt-12 p-8 border-border bg-card">
          <h2 className="text-2xl font-serif font-bold mb-4 text-foreground">{article.ctaTitle}</h2>
          <p className="text-muted-foreground mb-6">{article.ctaDescription}</p>
          <a
            href={article.ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            {article.ctaLabel}
          </a>
        </Card>
      </article>
    </main>
  </>
);

export default NewsArticleShell;
