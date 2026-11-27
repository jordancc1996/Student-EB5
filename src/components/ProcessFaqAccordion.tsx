import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export interface ProcessFaqItem {
  question: string;
  answer: string;
  link?: { href: string; text: string };
}

interface Props {
  items: ProcessFaqItem[];
}

function FaqAnswer({ item }: { item: ProcessFaqItem }) {
  if (!item.link) return item.answer;
  const index = item.answer.indexOf(item.link.text);
  if (index === -1) return item.answer;
  return (
    <>
      {item.answer.slice(0, index)}
      <a
        href={item.link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline"
      >
        {item.link.text}
      </a>
      {item.answer.slice(index + item.link.text.length)}
    </>
  );
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
            <CollapsibleContent forceMount className="px-5 pb-5 data-[state=closed]:hidden">
              <p className="editorial-prose text-muted-foreground pt-1">
                <FaqAnswer item={item} />
              </p>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
