import { Mail, ExternalLink, Cookie } from 'lucide-react';
import { Link } from '@/components/RouterLink';
import { MultiStepLeadCapture } from '@/components/MultiStepLeadCapture';
import logoImg from '@/assets/studenteb5-logo.png';
import logoImgWebp from '@/assets/studenteb5-logo.webp';
import OptimizedImage from '@/components/OptimizedImage';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Research", href: "/research" },
    { name: "Resources", href: "/resources" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" }
  ];

  const resourceLinks = [
    { name: "EB-5 Report", href: "/eb5-report" },
    { name: "Resources", href: "/resources" },
    { name: "Research", href: "/research" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "USCIS Resources", href: "https://www.uscis.gov/eb-5", external: true },
    { name: "IMI Daily", href: "https://www.imidaily.com/", external: true }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16 grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center space-x-3 mb-6 hover:opacity-90 transition-opacity"
              aria-label="StudentEB5 Home"
            >
              <OptimizedImage src={logoImg} webpSrc={logoImgWebp} alt="StudentEB5" className="h-10 w-auto" />
            </Link>
            
            <p className="text-primary-foreground/90 leading-relaxed mb-6 max-w-md">
              StudentEB5 is an educational resource helping international students, 
              professionals, and H1B visa holders understand the EB-5 investment program 
              and explore pathways to US permanent residency.
            </p>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Mail size={18} className="text-accent mr-2" />
                Stay Updated
              </h4>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Get the latest EB-5 news and resources delivered to your inbox.
              </p>
              <MultiStepLeadCapture
                showLabel={false}
                buttonText="Subscribe"
                inputClassName="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                buttonClassName="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* EB-5 Resources */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">EB-5 Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-serif font-semibold mb-4 mt-6">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-primary-muted/20 rounded-lg">
              <h5 className="font-semibold text-accent mb-2">Educational Resource</h5>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                This website provides educational information only and does not constitute legal or financial advice. 
                For legal matters, consult with a qualified immigration attorney. For investment and financial guidance, 
                consult with a FINRA-registered financial advisor or broker-dealer for your specific situation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-primary-foreground/70">
              <span>© {currentYear} StudentEB5. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <Link 
                to="/privacy-policy" 
                className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="hidden md:inline">•</span>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
                className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline flex items-center gap-1"
              >
                <Cookie size={14} />
                Cookie Settings
              </button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href="mailto:admin@studenteb5.com"
                className="flex items-center space-x-2 text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail size={16} />
                <span>admin@studenteb5.com</span>
              </a>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80 font-medium">Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;