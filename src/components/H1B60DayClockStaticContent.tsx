import { CheckCircle, XCircle, FileText, Briefcase, Home, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Link } from '@/components/RouterLink';

const pathwayFont = "'Inter', 'Helvetica Neue', sans-serif";

const comparisonData = [
  {
    category: 'Job Freedom',
    h1b: 'Tied to a single employer',
    eb5: 'Work for anyone — or start your own company',
  },
  {
    category: 'Layoff Risk',
    h1b: '60-day grace period to find new sponsor',
    eb5: 'Protected by Concurrent Filing (EAD/AP)',
  },
  {
    category: 'Green Card Wait (India)',
    h1b: '15–20+ years in EB-2/EB-3 backlog',
    eb5: '2–4 years via EB-5 Rural/High-Unemployment',
  },
  {
    category: 'Spouse Work Rights',
    h1b: 'H-4 EAD — uncertain, frequently challenged',
    eb5: 'Unrestricted work authorization via EAD',
  },
  {
    category: 'Children Aging Out',
    h1b: 'Risk of children aging out at 21',
    eb5: 'File before they age out — separate green card',
  },
];

const sourcesOfFunds = [
  {
    icon: TrendingUp,
    title: 'RSUs & Stock Options',
    description:
      'Vested restricted stock units from your employer can be liquidated and documented as a lawful source of investment capital.',
  },
  {
    icon: Briefcase,
    title: '401(k) Loans',
    description:
      'You may borrow against your 401(k) balance. The loan proceeds can serve as part of your investment, with proper documentation.',
  },
  {
    icon: Home,
    title: 'Home Equity',
    description:
      'A home equity line of credit (HELOC) or cash-out refinance on U.S. or foreign property can fund your EB-5 investment.',
  },
  {
    icon: Shield,
    title: 'Savings & Income',
    description:
      'Accumulated savings from your professional income, documented with tax returns and bank statements over the past 5–7 years.',
  },
];

interface H1B60DayClockStaticContentProps {
  teaInvestmentFormatted: string;
}

export default function H1B60DayClockStaticContent({ teaInvestmentFormatted }: H1B60DayClockStaticContentProps) {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2
            className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-4 text-center"
            style={{ fontFamily: pathwayFont }}
          >
            H-1B vs. EB-5: A Side-by-Side Reality Check
          </h2>
          <p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-base"
            style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
          >
            The H-1B was never designed as a permanent solution. Here's how the two paths compare for Indian professionals.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th
                    className="text-left py-4 px-4 font-sans font-medium text-foreground w-1/4"
                    style={{ fontFamily: pathwayFont }}
                  ></th>
                  <th
                    className="text-left py-4 px-4 font-sans font-medium text-foreground w-[37.5%]"
                    style={{ fontFamily: pathwayFont }}
                  >
                    H-1B Path
                  </th>
                  <th
                    className="text-left py-4 px-4 font-sans font-medium text-primary w-[37.5%]"
                    style={{ fontFamily: pathwayFont }}
                  >
                    EB-5 Path
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.category} className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium text-foreground text-sm" style={{ fontFamily: pathwayFont }}>
                      {row.category}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2">
                        <XCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm" style={{ fontFamily: pathwayFont }}>
                          {row.h1b}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm" style={{ fontFamily: pathwayFont }}>
                          {row.eb5}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-sans text-xl md:text-2xl font-medium text-foreground mb-3" style={{ fontFamily: pathwayFont }}>
              The Numbers Don't Lie. What's Your Best Path?
            </h3>
            <p
              className="text-muted-foreground text-base mb-6 max-w-xl mx-auto"
              style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
            >
              See how your specific salary, visa status, and priority date stack up in under 2 minutes.
            </p>
            <Link
              to="/tools/2026-eb5-investment-feasibility-calculator"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
              style={{ fontFamily: pathwayFont }}
            >
              Check Your Feasibility <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2
            className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-4 text-center"
            style={{ fontFamily: pathwayFont }}
          >
            Concurrent Filing: The Killer Feature
          </h2>
          <p
            className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto text-base"
            style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
          >
            This is the #1 reason H-1B holders choose EB-5. Concurrent Filing allows you to submit your green card
            application and receive work/travel authorization while your I-526E petition is still being processed.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <FileText size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-sans text-lg font-medium text-foreground mb-2" style={{ fontFamily: pathwayFont }}>
                Form I-485
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                Adjustment of Status — your actual green card application, filed at the same time as your I-526E.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Briefcase size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-sans text-lg font-medium text-foreground mb-2" style={{ fontFamily: pathwayFont }}>
                Form I-765 (EAD)
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                Employment Authorization Document — work for any employer, start a business, or change jobs freely.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Shield size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-sans text-lg font-medium text-foreground mb-2" style={{ fontFamily: pathwayFont }}>
                Form I-131 (AP)
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                Advance Parole — travel internationally and re-enter the U.S. without risking your pending application.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <p
              className="text-foreground font-medium text-center text-base"
              style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
            >
              <strong>The bottom line:</strong> Within months of filing, you can receive an EAD and AP combo card —
              effectively freeing you from H-1B employer dependency while your green card is processed. If you get laid
              off, you're protected.
            </p>
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-sans text-xl md:text-2xl font-medium text-foreground mb-3" style={{ fontFamily: pathwayFont }}>
              Your Concurrent Filing Timeline Starts With One Call
            </h3>
            <p
              className="text-muted-foreground text-base mb-6 max-w-xl mx-auto"
              style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
            >
              Every situation is different. Let an experienced EB-5 attorney map out your personal filing timeline, EAD
              receipt estimate, and next steps.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
              style={{ fontFamily: pathwayFont }}
            >
              Schedule Your Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2
            className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-4 text-center"
            style={{ fontFamily: pathwayFont }}
          >
            Source of Funds for Professionals
          </h2>
          <p
            className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto text-base"
            style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
          >
            Many H-1B professionals already have access to the {teaInvestmentFormatted} minimum investment through a
            combination of existing assets. Here are the most common sources.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {sourcesOfFunds.map((source) => (
              <div key={source.title} className="flex gap-4 p-6 border border-border rounded-lg bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <source.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-medium text-foreground mb-1" style={{ fontFamily: pathwayFont }}>
                    {source.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}>
                    {source.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-sans text-xl md:text-2xl font-medium text-foreground mb-3" style={{ fontFamily: pathwayFont }}>
              You May Already Have the $800K. Find Out in 60 Seconds.
            </h3>
            <p
              className="text-muted-foreground text-base mb-6 max-w-xl mx-auto"
              style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
            >
              Enter your RSUs, 401(k) balance, and home equity to see exactly where you stand.
            </p>
            <Link
              to="/tools/source-of-funds-calculator"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
              style={{ fontFamily: pathwayFont }}
            >
              Calculate Your Source of Funds <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2
            className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-8 text-center"
            style={{ fontFamily: pathwayFont }}
          >
            Case Study: From FAANG to Freedom
          </h2>
          <div className="bg-card border border-border rounded-xl p-8 md:p-10">
            <blockquote
              className="text-foreground italic mb-6 text-base"
              style={{ fontFamily: pathwayFont, lineHeight: 1.85 }}
            >
              "I spent 8 years at a major tech company on H-1B, watching my EB-2 priority date barely move. My wife
              couldn't work, my kids were growing up, and every performance review came with the silent fear: what if I
              get let go? Filing EB-5 with concurrent filing changed everything. Within 6 months I had my EAD. I changed
              jobs to a startup I'd always wanted to join, my wife started her own business, and for the first time in a
              decade, we felt like we belonged here — not as guests, but as future Americans."
            </blockquote>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: pathwayFont }}>
              — Senior Software Engineer, former H-1B holder, EB-5 filed in 2024
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2
            className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-8 text-center"
            style={{ fontFamily: pathwayFont }}
          >
            Backed by Attorneys and Regional Centers With a Proven Track Record
          </h2>

          <div className="space-y-6 text-muted-foreground text-base" style={{ fontFamily: pathwayFont, lineHeight: 1.85 }}>
            <p>
              The EB-5 process is one of the most consequential financial and legal decisions an H-1B professional will
              make. Guidance from the wrong team — or the wrong regional center — can mean years of delays, denied
              petitions, or lost capital.
            </p>
            <p>
              The immigration attorneys and USCIS-approved regional centers behind the resources on this site bring more
              than two decades of experience in EB-5 investment immigration. Together, they have successfully processed
              over 1,000 approved EB-5 petitions, representing investors from across the globe seeking U.S. permanent
              residency.
            </p>
            <p>
              The regional center partners featured here have I-926F approvals from USCIS, the most rigorous vetting a
              regional center can undergo — and a credential that fewer than a fraction of entities in the EB-5 market can
              claim. Their investment projects span targeted employment areas (TEAs), rural set-asides, and
              high-unemployment designations — precisely the categories that give H-1B investors like you a faster path
              to a green card.
            </p>
            <p>
              When you schedule a consultation through this site, you're connected to legal and investment partners who
              have been navigating USCIS policy changes, priority date fluctuations, and EB-5 Reform Act requirements
              since before most current H-1B holders arrived in the U.S.
            </p>
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-8 md:p-10 text-center">
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <div>
                <span className="block text-3xl font-bold text-primary" style={{ fontFamily: pathwayFont }}>
                  1,000+
                </span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                  Approved Petitions
                </span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-primary" style={{ fontFamily: pathwayFont }}>
                  I-926F
                </span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                  USCIS Approved RCs
                </span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-primary" style={{ fontFamily: pathwayFont }}>
                  20+
                </span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: pathwayFont }}>
                  Years in EB-5
                </span>
              </div>
            </div>
            <p
              className="text-foreground font-medium text-base max-w-2xl mx-auto"
              style={{ fontFamily: pathwayFont, lineHeight: 1.7 }}
            >
              The attorneys and regional centers connected through this platform have built one of the most documented EB-5
              track records in the industry.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-sans text-2xl md:text-[28px] font-medium text-foreground mb-4" style={{ fontFamily: pathwayFont }}>
            Ready to Take the First Step?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-base" style={{ fontFamily: pathwayFont }}>
            Download our free H-1B to EB-5 Strategy Checklist, or schedule a consultation to discuss your specific
            situation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              style={{ fontFamily: pathwayFont }}
            >
              Schedule a Consultation
            </Link>
            <Link
              to="/tools/2026-eb5-investment-feasibility-calculator"
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-md font-medium hover:bg-muted transition-colors"
              style={{ fontFamily: pathwayFont }}
            >
              Check Your Feasibility
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
