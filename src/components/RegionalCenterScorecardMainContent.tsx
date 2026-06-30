import NextStepsCTA from '@/components/tools/NextStepsCTA';
import { useState } from 'react';
import heroImage from '@/assets/eb5-scorecard-hero.jpg';

interface ScoreResult {
  score: number;
  label: string;
  labelColor: string;
}

const RegionalCenterScorecardMainContent = () => {
  const [years, setYears] = useState('');
  const [approvals, setApprovals] = useState('');
  const [violations, setViolations] = useState('0');
  const [defaultsHist, setDefaultsHist] = useState('0');
  const [result, setResult] = useState<ScoreResult | null>(null);

  const calculate = () => {
    // Bound inputs to safe ranges to avoid overflow / abuse
    const y = Math.max(0, Math.min(100, parseInt(years) || 0));
    const a = Math.max(0, Math.min(100000, parseInt(approvals) || 0));
    const v = parseInt(violations);
    const d = parseInt(defaultsHist);

    let score = 50; // Baseline
    score += y * 2; // Experience weighting
    score += a > 500 ? 20 : a / 25; // Approval weighting

    if (v === 2) score -= 40;
    if (v === 1) score -= 15;
    if (d === 2) score -= 50;
    if (d === 1) score -= 20;

    score = Math.max(0, Math.min(100, Math.round(score)));

    let label: string;
    let labelColor: string;
    if (score >= 85) {
      label = 'Tier 1: Institutional Grade';
      labelColor = 'text-green-400';
    } else if (score >= 60) {
      label = 'Tier 2: Established Profile';
      labelColor = 'text-yellow-400';
    } else {
      label = 'Tier 3: High Risk / Emerging';
      labelColor = 'text-red-400';
    }

    setResult({ score, label, labelColor });
  };

  const fieldClasses =
    'w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-white placeholder-white/30';

  const selectClasses =
    'w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-white appearance-none cursor-pointer [color-scheme:dark]';

  return (
    <main>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center p-6 py-24"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="font-serif text-white text-4xl mb-4 tracking-tight">Regional Center Scorecard</h1>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em]">Objective Institutional Due Diligence</p>
          </div>

          {!result ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 md:p-12 shadow-2xl text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="rc-years" className="block text-[10px] uppercase tracking-widest mb-2 opacity-70">
                      Years in Operation
                    </label>
                    <input
                      id="rc-years"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="e.g. 15"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="rc-approvals" className="block text-[10px] uppercase tracking-widest mb-2 opacity-70">
                      Historical I-829 Approvals
                    </label>
                    <input
                      id="rc-approvals"
                      type="number"
                      min={0}
                      max={100000}
                      placeholder="Total permanent green cards"
                      value={approvals}
                      onChange={(e) => setApprovals(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="rc-violations" className="block text-[10px] uppercase tracking-widest mb-2 opacity-70">
                      SEC/USCIS Violations
                    </label>
                    <select
                      id="rc-violations"
                      value={violations}
                      onChange={(e) => setViolations(e.target.value)}
                      className={selectClasses}
                    >
                      <option className="text-black" value="0">None / Clean Record</option>
                      <option className="text-black" value="1">Minor Administrative Issues</option>
                      <option className="text-black" value="2">Major Violation / SEC Action</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rc-defaults" className="block text-[10px] uppercase tracking-widest mb-2 opacity-70">
                      History of Project Defaults
                    </label>
                    <select
                      id="rc-defaults"
                      value={defaultsHist}
                      onChange={(e) => setDefaultsHist(e.target.value)}
                      className={selectClasses}
                    >
                      <option className="text-black" value="0">None / 100% Repayment</option>
                      <option className="text-black" value="1">1-2 Defaults</option>
                      <option className="text-black" value="2">Significant History of Loss</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={calculate}
                className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-200 transition-all"
              >
                Generate Trust Score
              </button>
            </div>
          ) : (
            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-xl text-center">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Proprietary Trust Rating</p>
              <div className="font-serif text-white text-7xl mb-6">{result.score}/100</div>
              <div className={`text-sm font-bold uppercase tracking-[0.3em] mb-8 ${result.labelColor}`}>
                {result.label}
              </div>

              <p className="text-gray-300 text-sm max-w-md mx-auto mb-10 leading-relaxed italic">
                Note: This score is an estimate based on self-reported institutional data. A high score does not guarantee financial return, but indicates a strong historical compliance profile.
              </p>

              <NextStepsCTA
                heading="Move Beyond Self-Reported Data"
                description="Access vetted Tier-1 EB-5 projects screened for compliance, sponsor track record, and capital preservation."
                ctaLabel="Access Tier-1 Project Vetting"
                secondaryLinkLabel="Read the Latest SEC Compliance and EB-5 Industry News"
                secondaryLinkHref="/news"
                variant="transparent"
              />

              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-white/50 hover:text-white text-[10px] uppercase tracking-widest underline"
                >
                  Re-Score Another Center
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RegionalCenterScorecardMainContent;
