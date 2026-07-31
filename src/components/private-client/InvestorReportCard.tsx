import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';

export interface InvestorReportCardProps {
  title: string;
  summary: string;
  price: string;
  /** Optional meta badge (e.g. page length). Omit for digital products. */
  updatedDate?: string;
  reportLength?: string;
  /** 1-based index for left-aligned numeral (01, 02, …). */
  index?: number;
  /** Optional cover image (local import or URL). Prefer over stock photography. */
  imageSrc?: string | { src: string };
  imageAlt?: string;
}

/**
 * Shared product card for Private Client Services catalogs
 * (Intelligence Reports + Resource Library).
 */
const InvestorReportCard = ({
  title,
  summary,
  price,
  updatedDate,
  reportLength,
  index,
  imageSrc,
  imageAlt,
}: InvestorReportCardProps) => {
  const hasMeta = Boolean(reportLength || updatedDate);

  return (
    <Card className="overflow-hidden h-full flex flex-col rounded-lg border border-border hover:shadow-lg transition-shadow group">
      {imageSrc ? (
        <div className="aspect-[16/10] overflow-hidden border-b border-border">
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}

      <CardHeader className="pb-3">
        {index != null ? (
          <span className="block text-sm font-medium text-muted-foreground tracking-wider mb-3">
            {String(index).padStart(2, '0')}
          </span>
        ) : null}
        {hasMeta && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {reportLength ? <Badge variant="outline">{reportLength}</Badge> : null}
            {updatedDate ? (
              <span className="text-sm text-muted-foreground">Updated {updatedDate}</span>
            ) : null}
          </div>
        )}
        <CardTitle className="font-serif text-xl leading-snug">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground leading-relaxed text-sm mb-4">{summary}</p>
        <p className="text-sm font-medium text-foreground">{price}</p>
      </CardContent>

      <CardFooter>
        <Button type="button" className="w-full" disabled aria-disabled="true">
          Coming Soon
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvestorReportCard;
