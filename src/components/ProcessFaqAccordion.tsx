import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export interface ProcessFaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: ProcessFaqItem[];
}

export default function ProcessFaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <Collapsible
            key={item.question}
            open={isOpen}
            onOpenChange={(next) => setOpenIndex(next ? index : null)}
            className="border border-border rounded-lg bg-card overflow-hidden"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-muted/40 transition-colors duration-150">
              <span className="font-serif text-base md:text-lg font-semibold text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-150 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-5">
              <p
                className="text-muted-foreground leading-relaxed pt-1"
                style={{ fontFamily: 'Georgia, serif', lineHeight: 1.75 }}
              >
                {item.answer}
              </p>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
