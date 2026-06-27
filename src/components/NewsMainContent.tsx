import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';
import { newsArticles } from '@/data/newsArticles';

const NewsMainContent = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Timely reporting on USCIS announcements, visa bulletin movement, legislation, and the regional center industry.
      </p>
    </div>

    <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">Latest Articles</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {newsArticles.map((article) => (
        <a key={article.id} href={article.href} className="block">
          <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video overflow-hidden">
              <OptimizedImage
                src={article.image}
                alt={article.imageAlt}
                title={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{article.category}</Badge>
                <span className="text-base text-muted-foreground">{article.readTime}</span>
              </div>
              <CardTitle className="font-serif">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
              <span className="text-base font-medium text-muted-foreground">Published {article.date}</span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>

    <div className="mt-16 text-center">
      <Card className="p-8">
        <h3 className="text-2xl font-serif font-bold mb-4">Stay Updated on EB-5 News</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Get the latest insights, regulatory updates, and success stories delivered directly to your inbox.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Subscribe to Updates
        </a>
      </Card>
    </div>
  </div>
);

export default NewsMainContent;
