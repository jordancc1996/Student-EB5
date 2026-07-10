import { Link } from '@/components/RouterLink';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, GraduationCap, Clock, Calendar, DollarSign, Wallet, Dice5, Briefcase, Route, FileCheck, Baby, ListChecks, ShieldCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ReadingProgressBar from '@/components/ReadingProgressBar';

// transparent prop is no longer needed - nav automatically uses white text at top, dark when scrolled
interface HeaderProps {
  transparent?: boolean; // kept for backwards compatibility but not used
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDropdownEnter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };
  const handleDropdownLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 220);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const mainNavLinks = [
    { name: 'Research', href: '/research' },
    { name: 'News', href: '/news' },
    { name: 'Tools', href: '/eb5-investment-immigration-tools' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const resourceCategories = [
    {
      label: 'For Students',
      links: [
        { name: 'The F-1 Student Guide', href: '/student-playbook' },
        { name: 'Student Timeline (Step-by-Step)', href: '/pathways/f1-to-eb5-self-sponsored-green-card' },
      ],
    },
    {
      label: 'For Professionals',
      links: [
        { name: 'The H-1B to EB-5 Guide', href: '/resources' },
        { name: 'H-1B Processing Timeline', href: '/pathways/h1b-to-green-card' },
      ],
    },
    {
      label: 'Financial',
      links: [
        { name: 'Source of Funds Strategies', href: '/guides/source-of-funds-strategies' },
      ],
    },
  ];

  const pathwayLinks = [
    { name: 'H-1B to Green Card', href: '/pathways/h1b-to-green-card', icon: Briefcase },
    { name: 'International Student to Green Card', href: '/pathways/f1-to-eb5-self-sponsored-green-card', icon: GraduationCap },
    { name: 'The EB-5 Process', href: '/eb5-investment-process', icon: Route },
  ];

  const toolLinks = [
    { name: 'H-1B Lottery Calculator', href: '/tools/h1b-lottery-odds-calculator', icon: Dice5 },
    { name: 'Tuition Savings Calculator', href: '/tools/tuition-calculator', icon: GraduationCap },
    { name: 'Grandfathering Countdown', href: '/tools/grandfathering-countdown', icon: Clock },
    { name: 'OPT Calculator', href: '/tools/opt-calculator', icon: Calendar },
    { name: 'EB-5 Feasibility Tool', href: '/tools/2026-eb5-investment-feasibility-calculator', icon: DollarSign },
    { name: 'Source of Funds Calculator', href: '/tools/source-of-funds-calculator', icon: Wallet },
    { name: 'Concurrent Filing Checker', href: '/tools/eb5-concurrent-filing-eligibility', icon: FileCheck },
    { name: 'CSPA Age Calculator', href: '/tools/eb5-cspa-calculator', icon: Baby },
    { name: 'Source of Funds Checklist', href: '/tools/eb5-source-of-funds-checklist', icon: ListChecks },
    { name: 'Regional Center Scorecard', href: '/tools/eb5-regional-center-scorecard', icon: ShieldCheck },
  ];

  // Determine if we should use white text (over dark hero backgrounds)
  const useWhiteText = !isScrolled && !isMobileMenuOpen;

  // Elegant navigation link styles - uppercase, letter-spaced, refined sizing
  // Larger tap targets via px-3 py-2, smooth color transitions, clear focus ring
  const baseLinkClasses =
    'inline-flex items-center px-3 py-2 rounded-sm text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
  const linkClasses = useWhiteText
    ? `${baseLinkClasses} text-white hover:text-white/70 focus-visible:ring-white/60`
    : `${baseLinkClasses} text-foreground hover:text-foreground/60 focus-visible:ring-foreground/40`;

  // Logo styles - slightly larger, still elegant
  const logoClasses = useWhiteText
    ? 'text-white hover:text-white/70 transition-colors text-[15px] uppercase tracking-[0.2em] font-semibold'
    : 'text-foreground hover:text-foreground/70 transition-colors text-[15px] uppercase tracking-[0.2em] font-semibold';

  const dotClasses = `${useWhiteText ? 'text-white/40' : 'text-foreground/25'} text-xs select-none`;

  return (
    <>
      <nav 
        className={`nav-simple fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-background/95 backdrop-blur-sm shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-x-2 lg:gap-x-3">
            <Link to="/" className={`${logoClasses} px-3 py-2`} aria-label="StudentEB5 Home">StudentEB5</Link>
            <span className={dotClasses} aria-hidden="true">•</span>
            <Link to="/research" className={linkClasses}>Research</Link>
            <span className={dotClasses} aria-hidden="true">•</span>

            <Link to="/news" className={linkClasses}>News</Link>
            <span className={dotClasses} aria-hidden="true">•</span>

            {/* Pathways Dropdown */}
            <div
              onMouseEnter={() => handleDropdownEnter('pathways')}
              onMouseLeave={handleDropdownLeave}
            >
              <DropdownMenu modal={false} open={openDropdown === 'pathways'} onOpenChange={(o) => setOpenDropdown(o ? 'pathways' : null)}>
                <DropdownMenuTrigger
                  aria-label="Pathways menu"
                  className={`${linkClasses} gap-1.5 cursor-pointer border-none outline-none data-[state=open]:bg-transparent`}
                >
                  Pathways
                  <ChevronDown size={12} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={12}
                  onMouseEnter={() => handleDropdownEnter('pathways')}
                  onMouseLeave={handleDropdownLeave}
                  className="bg-background border shadow-lg z-[100] min-w-[240px] p-2"
                >
                  {pathwayLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild className="py-2.5 px-3 cursor-pointer">
                      <Link to={link.href} className="w-full cursor-pointer flex items-center gap-2.5">
                        <link.icon size={16} className="text-muted-foreground" />
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <span className={dotClasses} aria-hidden="true">•</span>

            {/* Resources Dropdown */}
            <div
              onMouseEnter={() => handleDropdownEnter('resources')}
              onMouseLeave={handleDropdownLeave}
            >
              <DropdownMenu modal={false} open={openDropdown === 'resources'} onOpenChange={(o) => setOpenDropdown(o ? 'resources' : null)}>
                <DropdownMenuTrigger
                  aria-label="EB-5 Resources menu"
                  className={`${linkClasses} gap-1.5 cursor-pointer border-none outline-none data-[state=open]:bg-transparent`}
                >
                  EB-5 Resources
                  <ChevronDown size={12} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={12}
                  onMouseEnter={() => handleDropdownEnter('resources')}
                  onMouseLeave={handleDropdownLeave}
                  className="bg-background border shadow-lg z-[100] min-w-[260px] p-2"
                >
                  {resourceCategories.map((category) => (
                    <div key={category.label} className="mb-1 last:mb-0">
                      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {category.label}
                      </div>
                      {category.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="py-2.5 px-3 cursor-pointer">
                          <Link to={link.href} className="w-full cursor-pointer">{link.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <span className={dotClasses} aria-hidden="true">•</span>

            {/* Tools Dropdown */}
            <div
              onMouseEnter={() => handleDropdownEnter('tools')}
              onMouseLeave={handleDropdownLeave}
            >
              <DropdownMenu modal={false} open={openDropdown === 'tools'} onOpenChange={(o) => setOpenDropdown(o ? 'tools' : null)}>
                <DropdownMenuTrigger
                  aria-label="Tools menu"
                  className={`${linkClasses} gap-1.5 cursor-pointer border-none outline-none data-[state=open]:bg-transparent`}
                >
                  Tools
                  <ChevronDown size={12} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={12}
                  onMouseEnter={() => handleDropdownEnter('tools')}
                  onMouseLeave={handleDropdownLeave}
                  className="bg-background border shadow-lg z-[100] min-w-[240px] p-2 max-h-[70vh] overflow-y-auto"
                >
                  {toolLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild className="py-2.5 px-3 cursor-pointer">
                      <Link to={link.href} className="w-full cursor-pointer flex items-center gap-2.5">
                        <link.icon size={16} className="text-muted-foreground" />
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <span className={dotClasses} aria-hidden="true">•</span>
            <Link to="/about" className={linkClasses}>About</Link>
            <span className={dotClasses} aria-hidden="true">•</span>
            <Link to="/contact" className={linkClasses}>Contact</Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between">
            <Link to="/" className={logoClasses} aria-label="StudentEB5 Home">StudentEB5</Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 -mr-2 rounded-sm transition-colors ${useWhiteText ? 'text-white hover:text-white/70' : 'text-foreground hover:text-foreground/70'}`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer - right-side slide-in */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          id="mobile-nav-drawer"
          side="right"
          className="w-[88%] max-w-sm p-0 bg-background flex flex-col"
        >
          <SheetHeader className="px-6 py-5 border-b border-border/40 text-left">
            <SheetTitle className="text-[15px] uppercase tracking-[0.2em] font-semibold text-foreground">
              StudentEB5
            </SheetTitle>
          </SheetHeader>
          <nav
            className="flex-1 overflow-y-auto px-2 py-4"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-4 py-4 text-foreground text-[15px] font-medium rounded-md hover:bg-muted/60 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-border/40">
                <span className="px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Pathways
                </span>
                {pathwayLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 text-foreground text-[14px] rounded-md hover:bg-muted/60 transition-colors flex items-center gap-2.5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon size={16} className="text-muted-foreground" />
                    {link.name}
                  </Link>
                ))}
              </div>

              {resourceCategories.map((category) => (
                <div key={category.label} className="mt-3 pt-3 border-t border-border/40">
                  <span className="px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    {category.label}
                  </span>
                  {category.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block px-4 py-3 text-foreground text-[14px] rounded-md hover:bg-muted/60 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-border/40">
                <span className="px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Tools
                </span>
                {toolLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 text-foreground text-[14px] rounded-md hover:bg-muted/60 transition-colors flex items-center gap-2.5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon size={16} className="text-muted-foreground" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <ReadingProgressBar />
    </>
  );
};

export default Header;
