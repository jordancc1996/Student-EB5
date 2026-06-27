import { useEffect } from 'react';

const PrivacyPolicyMainContent = () => {
  useEffect(() => {
    // Scroll to anchor if present in URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="text-center space-y-4 pb-8 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
          StudentEB5 Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground">
          Effective Date: January 1, 2025
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          StudentEB5 is committed to protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website.
        </p>
      </header>

      {/* Table of Contents */}
      <nav className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Table of Contents</h2>
        <ol className="space-y-2 text-sm">
          <li>
            <button onClick={() => scrollToSection('introduction')} className="text-primary hover:underline text-left">
              1. Introduction
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('information-collected')} className="text-primary hover:underline text-left">
              2. Information We Collect
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('how-we-use')} className="text-primary hover:underline text-left">
              3. How We Use Your Information
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('sharing-information')} className="text-primary hover:underline text-left">
              4. How We Share Your Information
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('cookies')} className="text-primary hover:underline text-left">
              5. Cookies and Tracking Technologies
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('data-retention')} className="text-primary hover:underline text-left">
              6. Data Retention
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('your-rights')} className="text-primary hover:underline text-left">
              7. Your Privacy Rights
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('california-rights')} className="text-primary hover:underline text-left">
              8. California Residents' Rights (CCPA)
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('security')} className="text-primary hover:underline text-left">
              9. Security of Your Information
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('children')} className="text-primary hover:underline text-left">
              10. Children's Privacy
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('third-party')} className="text-primary hover:underline text-left">
              11. Third-Party Services
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('changes')} className="text-primary hover:underline text-left">
              12. Changes to This Privacy Policy
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} className="text-primary hover:underline text-left">
              13. Contact Us
            </button>
          </li>
        </ol>
      </nav>

      {/* Content Sections */}
      <article className="space-y-12 text-foreground">
        {/* Section 1 */}
        <section id="introduction" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to StudentEB5 ("we," "our," or "us"). We respect your privacy and are committed to protecting
            your personal information. This Privacy Policy describes how we collect, use, and share information
            about you when you use our website at <span className="text-primary font-medium">studenteb5.com</span> (the "Website").
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using our Website, you agree to this Privacy Policy. If you do not agree with our
            policies and practices, please do not use our Website.
          </p>
        </section>

        {/* Section 2 */}
        <section id="information-collected" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">2. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect several types of information from and about users of our Website:
          </p>

          <div className="space-y-6 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Information that identifies you personally, such as:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Mailing address</li>
                <li>Country of origin</li>
                <li>Immigration status (if voluntarily provided)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Information automatically collected when you use our Website:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device identifiers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cookies and Tracking Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Website and hold
                certain information. See Section 5 for more details.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="how-we-use" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>To provide, maintain, and improve our Website and services</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To send you educational content, newsletters, and updates (with your consent)</li>
            <li>To analyze Website usage and trends to improve user experience</li>
            <li>To detect, prevent, and address technical issues and security threats</li>
            <li>To comply with legal obligations and protect our legal rights</li>
            <li>To personalize your experience and deliver relevant content</li>
            <li>To conduct research and analytics</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="sharing-information" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">4. How We Share Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your
            information in the following circumstances:
          </p>

          <div className="space-y-4 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Service Providers</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information with third-party service providers who perform services on our
                behalf, such as email marketing platforms, analytics services, and website hosting providers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Legal Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information if required by law or in response to valid requests by public
                authorities (e.g., court orders, subpoenas).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Business Transfers</h3>
              <p className="text-muted-foreground leading-relaxed">
                If we are involved in a merger, acquisition, or asset sale, your information may be transferred
                as part of that transaction.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="cookies" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">5. Cookies and Tracking Technologies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our Website.
            Cookies are small data files stored on your device that help us recognize you and remember
            your preferences.
          </p>

          <div className="space-y-4 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Types of Cookies We Use</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><span className="font-medium text-foreground">Essential Cookies:</span> Required for the Website to function properly</li>
                <li><span className="font-medium text-foreground">Analytics Cookies:</span> Help us understand how visitors use our Website</li>
                <li><span className="font-medium text-foreground">Functional Cookies:</span> Remember your preferences and settings</li>
                <li><span className="font-medium text-foreground">Marketing Cookies:</span> Track your browsing activity to deliver relevant advertisements</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Managing Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                You can control and manage cookies through your browser settings. However, disabling cookies
                may affect the functionality of our Website.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="data-retention" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined
            in this Privacy Policy, unless a longer retention period is required or permitted by law. When we
            no longer need your information, we will securely delete or anonymize it.
          </p>
        </section>

        {/* Section 7 */}
        <section id="your-rights" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">7. Your Privacy Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><span className="font-medium text-foreground">Right to Access:</span> Request a copy of the personal information we hold about you</li>
            <li><span className="font-medium text-foreground">Right to Rectification:</span> Request correction of inaccurate or incomplete information</li>
            <li><span className="font-medium text-foreground">Right to Deletion:</span> Request deletion of your personal information</li>
            <li><span className="font-medium text-foreground">Right to Opt-Out:</span> Unsubscribe from marketing communications at any time</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            To exercise any of these rights, please contact us at <a href="mailto:privacy@studenteb5.com" className="text-primary hover:underline">privacy@studenteb5.com</a>.
          </p>
        </section>

        {/* Section 8 */}
        <section id="california-rights" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">8. California Residents' Rights (CCPA)</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you are a California resident, you have additional rights under the California Consumer Privacy
            Act (CCPA), including the right to know what personal information we collect, the right to delete
            your personal information, and the right to opt-out of the sale of your personal information.
            We do not sell your personal information.
          </p>
        </section>

        {/* Section 9 */}
        <section id="security" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">9. Security of Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. However, no method of
            transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        {/* Section 10 */}
        <section id="children" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">10. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Website is not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If we learn we have collected information from
            a child under 13, we will delete that information promptly.
          </p>
        </section>

        {/* Section 11 */}
        <section id="third-party" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">11. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Website may contain links to third-party websites and services. We are not responsible for
            the privacy practices of these third parties. We encourage you to read the privacy policies
            of any third-party websites you visit.
          </p>
        </section>

        {/* Section 12 */}
        <section id="changes" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">12. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
          </p>
        </section>

        {/* Section 13 */}
        <section id="contact" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-serif font-semibold text-foreground">13. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-foreground font-medium">StudentEB5</p>
            <p className="text-muted-foreground">Email: <a href="mailto:privacy@studenteb5.com" className="text-primary hover:underline">privacy@studenteb5.com</a></p>
            <p className="text-muted-foreground">Website: <a href="https://studenteb5.com" className="text-primary hover:underline">studenteb5.com</a></p>
          </div>
        </section>
      </article>
    </div>
  );
};

export default PrivacyPolicyMainContent;
