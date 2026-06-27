import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

export interface FaqDetailLink {
  text: string;
  url: string;
}

export interface FaqDetailRelatedFaq {
  id: number;
  slug: string;
  question: string;
  answer: string;
}

export interface FaqDetailContentProps {
  faq: {
    category: string;
    question: string;
    links?: FaqDetailLink[];
  };
  answer: string;
  relatedFaqs: FaqDetailRelatedFaq[];
}

const FaqDetailContent = ({ faq, answer, relatedFaqs }: FaqDetailContentProps) => {
  return (
    <main className="container mx-auto px-6 pt-4 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <a href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </a>
          <span>/</span>
          <a href="/faq" className="hover:text-foreground transition-colors">
            FAQs
          </a>
          <span>/</span>
          <span className="text-foreground">{faq.question.substring(0, 50)}...</span>
        </nav>

        {/* Back Button */}
        <a
          href="/faq"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All FAQs
        </a>

        {/* FAQ Content */}
        <article>
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {faq.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {faq.question}
            </h1>
          </header>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <p
                  className="text-lg leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:hover:underline"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </div>

              {/* Related Resources Links */}
              {faq.links && faq.links.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Related Resources
                  </h2>
                  <ul className="space-y-3">
                    {faq.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-2"
                        >
                          <span className="text-primary">→</span>
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related FAQs */}
          {relatedFaqs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Related Questions</h2>
              <div className="grid gap-4">
                {relatedFaqs.map((relatedFaq) => (
                  <a key={relatedFaq.id} href={`/faq/${relatedFaq.slug}`} className="block">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
                          {relatedFaq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p
                          className="text-muted-foreground line-clamp-2 [&_a]:text-primary [&_a]:hover:underline"
                          dangerouslySetInnerHTML={{ __html: relatedFaq.answer }}
                        />
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-serif font-bold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our team of EB-5 specialists is here to help you navigate your immigration journey.
                Get personalized guidance tailored to your situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/resources">Browse Resources</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </main>
  );
};

export default FaqDetailContent;
