import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, ArrowRight } from 'lucide-react';
import { faqCategories } from '@/lib/faq/categories';

export interface FaqListingItem {
  id: number;
  slug: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface FaqListingProps {
  faqs: FaqListingItem[];
}

const FaqListing = ({ faqs }: FaqListingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setSelectedCategory('All')}
          >
            All ({faqs.length})
          </Badge>
          {faqCategories.map((category) => {
            const count = faqs.filter((faq) => faq.category === category).length;
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredFaqs.map((faq) => (
          <a key={faq.id} href={`/faq/${faq.slug}`} className="block group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {faq.category}
                  </Badge>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-muted-foreground line-clamp-3 [&_a]:text-primary"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
                {faq.keywords && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {faq.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No FAQs Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/contact">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Contact Us
                </button>
              </a>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-2 border rounded-md hover:bg-muted"
              >
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaqListing;
