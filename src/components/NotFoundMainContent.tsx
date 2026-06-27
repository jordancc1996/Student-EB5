import { useEffect } from 'react';

const NotFoundMainContent = () => {
  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', window.location.pathname);
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Return to Home
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Popular pages you might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="/research" className="text-primary hover:underline">
              Research
            </a>
            <a href="/faq" className="text-primary hover:underline">
              FAQs
            </a>
            <a href="/resources" className="text-primary hover:underline">
              Resources
            </a>
            <a href="/about" className="text-primary hover:underline">
              About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundMainContent;
