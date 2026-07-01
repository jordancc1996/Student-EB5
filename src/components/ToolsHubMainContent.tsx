import type { PropsWithChildren } from 'react';
import { GraduationCap, Clock, Calendar, Dice5, DollarSign, Wallet } from 'lucide-react';
import toolsHero from '@/assets/tools-hero.jpg';

const pathwayFont = "'Inter', 'Helvetica Neue', sans-serif";

const tools = [
  {
    href: '/tools/tuition-calculator',
    icon: GraduationCap,
    title: 'Tuition Savings Calculator',
    desc: 'Compare F-1 international tuition vs. green card in-state tuition and see how EB-5 savings offset costs.',
  },
  {
    href: '/tools/grandfathering-countdown',
    icon: Clock,
    title: 'Grandfathering Countdown',
    desc: 'Track time remaining until the September 30, 2026 EB-5 grandfathering deadline with milestone markers.',
  },
  {
    href: '/tools/opt-calculator',
    icon: Calendar,
    title: 'OPT Calculator',
    desc: 'Calculate your OPT application window, start date range, and employment end date.',
  },
  {
    href: '/tools/h1b-lottery-odds-calculator',
    icon: Dice5,
    title: 'H-1B Lottery Odds Calculator',
    desc: 'Calculate your H-1B lottery selection odds based on registration count and cap limits.',
  },
  {
    href: '/tools/2026-eb5-investment-feasibility-calculator',
    icon: DollarSign,
    title: 'EB-5 Feasibility Calculator',
    desc: 'Assess your financial readiness for EB-5 investment including TEA and Non-TEA thresholds, living reserves, and legal fees.',
  },
  {
    href: '/tools/source-of-funds-calculator',
    icon: Wallet,
    title: 'Source of Funds Calculator',
    desc: 'Evaluate your funding sources including RSUs, 401k, savings, and other assets for EB-5 investment.',
  },
];

export default function ToolsHubMainContent({ children }: PropsWithChildren) {
  return (
    <>
      <section
        className="relative -mt-[120px] pt-[120px] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${toolsHero.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-[60px] font-sans font-bold text-white mb-6 drop-shadow-lg leading-tight"
            style={{ fontFamily: pathwayFont }}
          >
            EB-5 Investment Immigration Tools
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
            style={{ fontFamily: pathwayFont }}
          >
            Access free EB-5 investment calculators and tools designed for international students and foreign
            investors seeking U.S. permanent residency through the EB-5 visa program.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 pt-8 pb-6">
        {children}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 py-10 border border-border rounded-xl bg-card">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-3" style={{ fontFamily: pathwayFont }}>
              Not sure where to start?
            </h2>
            <p
              className="text-muted-foreground max-w-xl mx-auto mb-6 px-4"
              style={{ fontFamily: pathwayFont }}
            >
              The EB-5 Feasibility Calculator is the best place to begin. Answer a few questions about your finances
              and get an instant read on whether you qualify.
            </p>
            <a
              href="/tools/2026-eb5-investment-feasibility-calculator"
              className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3 text-base font-medium hover:bg-foreground/90 transition-colors"
            >
              Check Your EB-5 Feasibility
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <h2
                  className="text-xl font-sans font-medium mb-2 group-hover:text-primary transition-colors"
                  style={{ fontFamily: pathwayFont }}
                >
                  {tool.title}
                </h2>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: pathwayFont }}>
                  {tool.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
