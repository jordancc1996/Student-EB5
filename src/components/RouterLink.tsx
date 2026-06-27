import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children?: ReactNode;
}

/** Drop-in replacement for react-router-dom Link in Astro static pages. */
const Link = ({ to, children, ...props }: LinkProps) => (
  <a href={to} {...props}>
    {children}
  </a>
);

export { Link };
export default Link;
