import { Link } from '@/components/RouterLink';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import {
  desktopBarAfter,
  desktopBarBefore,
  homeLink,
  navIcons,
  pathwayLinks,
  resourceCategories,
  toolLinks,
  type NavIconName,
} from '@/data/navigation';

function MenuIcon({ name }: { name: NavIconName }) {
  const Icon = navIcons[name];
  return <Icon size={16} className="text-muted-foreground" />;
}

// transparent prop is no longer needed - nav automatically uses white text at top, dark when scrolled
interface HeaderProps {
  transparent?: boolean; // kept for backwards compatibility but not used
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Determine if we should use white text (over dark hero backgrounds).
  // The mobile menu's open state is applied in MobileNav.astro so the button works before this island hydrates.
  const useWhiteText = !isScrolled;

  // Elegant navigation link styles - uppercase, letter-spaced, refined sizing
  // Larger tap targets via px-3 py-2, smooth color transitions, clear focus ring
  const baseLinkClasses =
    'inline-flex items-center whitespace-nowrap px-1.5 py-1 rounded-sm text-[15px] uppercase tracking-[0.1em] font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
  const linkClasses = useWhiteText
    ? `${baseLinkClasses} text-white hover:text-white/70 focus-visible:ring-white/60`
    : `${baseLinkClasses} text-foreground hover:text-foreground/60 focus-visible:ring-foreground/40`;

  // Logo styles - slightly larger, still elegant
  const logoClasses = useWhiteText
    ? 'text-white hover:text-white/70 transition-colors whitespace-nowrap text-[15px] uppercase tracking-[0.14em] font-medium'
    : 'text-foreground hover:text-foreground/70 transition-colors whitespace-nowrap text-[15px] uppercase tracking-[0.14em] font-medium';

  const dotClasses = `${useWhiteText ? 'text-white/40' : 'text-foreground/25'} text-xs select-none`;

  return (
    <>
      <nav 
        className={`nav-simple fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-sm shadow-sm py-2' 
            : 'bg-transparent py-3'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-x-1 xl:gap-x-3">
            <Link to={homeLink.href} className={`${logoClasses} px-3 py-2`} aria-label="StudentEB5 Home">StudentEB5</Link>
            <span className={dotClasses} aria-hidden="true">•</span>
            {desktopBarBefore.map((link) => (
              <Fragment key={link.href}>
                <Link to={link.href} className={linkClasses}>{link.name}</Link>
                <span className={dotClasses} aria-hidden="true">•</span>
              </Fragment>
            ))}

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
                        {link.icon ? <MenuIcon name={link.icon} /> : null}
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
                      <div className="px-3 pt-2 pb-1 text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
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
                        {link.icon ? <MenuIcon name={link.icon} /> : null}
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {desktopBarAfter.map((link) => (
              <Fragment key={link.href}>
                <span className={dotClasses} aria-hidden="true">•</span>
                <Link to={link.href} className={linkClasses}>{link.name}</Link>
              </Fragment>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center justify-between">
            <Link to={homeLink.href} className={logoClasses} aria-label="StudentEB5 Home">StudentEB5</Link>
            <button
              type="button"
              className={`p-3 -mr-2 rounded-sm transition-colors ${useWhiteText ? 'text-white hover:text-white/70' : 'text-foreground hover:text-foreground/70'}`}
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mobile-nav-drawer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
      <ReadingProgressBar />
    </>
  );
};

export default Header;
