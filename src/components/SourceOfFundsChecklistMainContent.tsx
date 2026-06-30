import { useState } from 'react';
import NextStepsCTA from '@/components/tools/NextStepsCTA';
import heroImage from '@/assets/about-hero-new.jpg';

type SourceKey = 'salary' | 'gift' | 'property' | 'stock';

interface SourceOption {
  key: SourceKey;
  label: string;
  blurb: string;
  title: string;
  documents: string[];
}

const SOURCES: SourceOption[] = [
  {
    key: 'salary',
    label: 'Salary & Savings',
    blurb: 'Accumulated income over time.',
    title: 'Salary & Savings Requirements',
    documents: [
      'Employment Verification Letter (Title, Salary, Tenure)',
      'Individual Income Tax Returns (Last 5 years)',
      'Bank Statements showing salary deposits (Last 12-24 months)',
      'Resume/CV highlighting career progression',
      'Proof of any bonuses or performance-based compensation',
    ],
  },
  {
    key: 'gift',
    label: 'Gifted Funds',
    blurb: 'Capital from parents or relatives.',
    title: 'Gifted Funds Requirements',
    documents: [
      'Signed Gift Letter (Affidavit of Gift)',
      "Proof of Donor's Lawful Source of Funds (Salary/Property docs)",
      'Wire transfer record from Donor to Investor',
      "Donor's Income Tax Returns (Last 5 years)",
      'Proof of relationship (Birth Certificate or Affidavit)',
    ],
  },
  {
    key: 'property',
    label: 'Property Sale / Loan',
    blurb: 'Liquidation of real estate assets.',
    title: 'Property Sale Requirements',
    documents: [
      'Original Purchase Contract and Deed',
      'Proof of Lawful Funds used for original purchase',
      'Official Sale Agreement and HUD-1 Settlement Statement',
      'Bank statements showing receipt of sale proceeds',
      'Proof of Capital Gains tax payment (if applicable)',
    ],
  },
  {
    key: 'stock',
    label: 'Equity & Investments',
    blurb: 'Sale of stocks, crypto, or business equity.',
    title: 'Investment Liquidation Requirements',
    documents: [
      'Stock/Investment Account Statements (Last 3 years)',
      'Records showing the original purchase of shares/crypto',
      'Trade confirmation receipts for the sale/liquidation',
      'Bank statements showing transfer of proceeds to main account',
      'Corporate tax records (if selling business equity)',
    ],
  },
];

const SourceOfFundsChecklistMainContent = () => {
  const [selected, setSelected] = useState<SourceKey | ''>('');

  const active = SOURCES.find((s) => s.key === selected);

  return (
    <main>
      <div
        className="relative min-h-screen flex items-center justify-center p-6 py-20"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="font-serif text-white text-4xl mb-3">
              Document Checklist Generator
            </h1>
            <p className="text-gray-300 text-sm uppercase tracking-widest italic">
              Source of Funds Personalization
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 md:p-12 shadow-2xl">
            {!active ? (
              <div>
                <h2 className="text-white font-serif text-xl mb-6 text-center">
                  Select your primary source of investment capital:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SOURCES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSelected(s.key)}
                      className="p-6 border border-white/20 text-white hover:bg-white hover:text-black transition-all text-left"
                    >
                      <span className="block font-bold">{s.label}</span>
                      <span className="text-xs opacity-60">{s.blurb}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
                  <h2 className="text-white font-serif text-2xl">{active.title}</h2>
                  <button
                    type="button"
                    onClick={() => setSelected('')}
                    className="text-white/50 hover:text-white text-xs uppercase underline"
                  >
                    Reset
                  </button>
                </div>

                <ul className="space-y-4 text-gray-200 text-sm mb-10">
                  {active.documents.map((doc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 mt-1 text-white opacity-40">□</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>

                <NextStepsCTA
                  heading="Audit Your Source of Funds Before Filing"
                  description="A preliminary SOF audit identifies tracing gaps and missing evidence well before USCIS issues a Request for Evidence."
                  ctaLabel="Get a Preliminary SOF Audit"
                  secondaryLinkLabel="Deep Dive: Tracing Foreign Exchange and How to Document Capital Transfers"
                  secondaryLinkHref="/research/ways-to-fund-eb5-investment-2026"
                  variant="light"
                />
              </div>
            )}
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="text-xs text-white/60 italic leading-relaxed">
              This checklist is a starting framework based on common USCIS Requests for Evidence. Source-of-funds requirements vary by jurisdiction and individual circumstances. Confirm your documentation strategy with qualified EB-5 counsel before filing your I-526E.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SourceOfFundsChecklistMainContent;
