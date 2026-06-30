import Link from '@/components/RouterLink';

interface NextStepsCTAProps {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  secondaryLinkLabel?: string;
  secondaryLinkHref?: string;
  variant?: 'light' | 'transparent';
}

const NextStepsCTA = ({
  heading,
  description,
  ctaLabel,
  ctaHref = '/contact',
  secondaryLinkLabel,
  secondaryLinkHref,
  variant = 'light',
}: NextStepsCTAProps) => {
  const wrapperClasses =
    variant === 'light'
      ? 'bg-white p-10 text-center rounded-sm'
      : 'bg-transparent p-10 text-center';
  const headingClasses = variant === 'light' ? 'text-black' : 'text-white';
  const descriptionClasses = variant === 'light' ? 'text-gray-500' : 'text-gray-300';
  const ctaClasses =
    variant === 'light'
      ? 'inline-block bg-black text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-800 transition-all'
      : 'inline-block bg-white text-black px-10 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-200 transition-all';
  const secondaryClasses =
    variant === 'light'
      ? 'text-xs text-gray-700 underline underline-offset-4 hover:text-black transition-colors'
      : 'text-xs text-white/70 underline underline-offset-4 hover:text-white transition-colors';
  const eyebrowClasses =
    variant === 'light' ? 'text-gray-500' : 'text-white/60';

  return (
    <div className={wrapperClasses}>
      <p className={`${eyebrowClasses} text-[10px] uppercase tracking-[0.3em] mb-3`}>
        Next Steps
      </p>
      <h4 className={`font-serif text-2xl mb-2 ${headingClasses}`}>{heading}</h4>
      <p className={`text-sm mb-6 max-w-md mx-auto leading-relaxed ${descriptionClasses}`}>
        {description}
      </p>
      <Link to={ctaHref} className={ctaClasses}>
        {ctaLabel}
      </Link>
      {secondaryLinkLabel && secondaryLinkHref && (
        <div className="mt-6">
          <Link to={secondaryLinkHref} className={secondaryClasses}>
            {secondaryLinkLabel} →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NextStepsCTA;
