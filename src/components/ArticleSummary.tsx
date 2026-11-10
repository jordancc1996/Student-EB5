import type { ReactNode } from 'react';

/** Same markup as ArticleSummary.astro, for news article bodies that are React. */
export default function ArticleSummary({ children }: { children: ReactNode }) {
  return (
    <aside className="article-summary" aria-label="Summary">
      <p className="article-summary__label">Summary</p>
      <div className="article-summary__body">{children}</div>
    </aside>
  );
}
