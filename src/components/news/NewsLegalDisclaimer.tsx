interface NewsLegalDisclaimerProps {
  className?: string;
}

const NewsLegalDisclaimer = ({ className = '' }: NewsLegalDisclaimerProps) => (
  <div
    className={`rounded-lg border border-border bg-secondary/50 p-4 sm:p-5 flex gap-3 items-start ${className}`}
    role="note"
    aria-label="Legal disclaimer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
    <p className="text-sm text-muted-foreground leading-relaxed m-0">
      This content is for educational purposes only and does not constitute legal or investment advice.
      For your specific situation, consult a licensed immigration attorney and{' '}
      <a
        href="https://www.finra.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        FINRA-registered
      </a>{' '}
      financial advisor.
    </p>
  </div>
);

export default NewsLegalDisclaimer;
