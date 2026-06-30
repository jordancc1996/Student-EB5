import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import NextStepsCTA from '@/components/tools/NextStepsCTA';
import heroImage from '@/assets/about-hero-new.jpg';

type LocationField = 'inside' | 'outside' | null;
type Country = '' | 'current' | 'backlogged';
type Category = '' | 'reserved' | 'unreserved';

const ConcurrentFilingCheckerMainContent = () => {
  const [location, setLocation] = useState<LocationField>(null);
  const [country, setCountry] = useState<Country>('');
  const [category, setCategory] = useState<Category>('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (location === null || !country || !category) {
      setError('Please complete all fields to analyze your eligibility.');
      return;
    }
    setError('');
    setShowResult(true);
  };

  const reset = () => {
    setLocation(null);
    setCountry('');
    setCategory('');
    setShowResult(false);
    setError('');
  };

  const getResult = () => {
    if (location === 'outside') {
      return {
        title: 'Consular Processing',
        msg: 'Concurrent filing is a benefit for those currently in the U.S. Since you are abroad, you will follow the standard Consular path via the National Visa Center.',
      };
    }
    if (category === 'reserved' || country === 'current') {
      return {
        title: 'You Are Eligible',
        msg: 'Excellent. You can file your I-526E and I-485 together. This unlocks your EAD work permit and Advance Parole travel documents in a matter of months.',
      };
    }
    return {
      title: 'Retrogression Warning',
      msg: "In the 'Unreserved' category, China and India face backlogs. We recommend a Rural or Reserved project to bypass this and file concurrently.",
    };
  };

  return (
    <main>
      <div
        className="relative min-h-screen flex items-center justify-center p-6"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="font-serif text-white text-5xl md:text-6xl mb-4 leading-tight">
              EB-5 Concurrent Filing
              <br />
              Eligibility Checker
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Determine if you can file your I-485 immediately to secure work and travel authorization.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl">
            {!showResult ? (
              <div className="space-y-10">
                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-4 opacity-80">
                    Current Location
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setLocation('inside')}
                      className={`py-3 border border-white/30 transition-all ${
                        location === 'inside'
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      Inside U.S.
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('outside')}
                      className={`py-3 border border-white/30 transition-all ${
                        location === 'outside'
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      Outside U.S.
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-4 opacity-80">
                    Country of Birth
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as Country)}
                    className="w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-white appearance-none cursor-pointer"
                  >
                    <option className="text-black" value="">Select Country...</option>
                    <option className="text-black" value="current">Rest of World (Current)</option>
                    <option className="text-black" value="backlogged">China or India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-4 opacity-80">
                    Project Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-white appearance-none cursor-pointer"
                  >
                    <option className="text-black" value="">Select Project Type...</option>
                    <option className="text-black" value="reserved">Rural / Reserved (Priority)</option>
                    <option className="text-black" value="unreserved">Urban / Unreserved</option>
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-red-200 text-center">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="w-full py-4 mt-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                >
                  Analyze Eligibility
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/60 uppercase tracking-widest text-xs mb-4">Result</p>
                <h2 className="font-serif text-white text-3xl md:text-4xl mb-4">
                  {getResult().title}
                </h2>
                <p className="text-gray-200 mb-8 leading-relaxed max-w-xl mx-auto">
                  {getResult().msg}
                </p>
                <NextStepsCTA
                  heading="Lock In Your Place in the EB-5 Queue"
                  description="If you are eligible, concurrent filing protects your priority date and unlocks an EAD and Advance Parole within months."
                  ctaLabel="Lock Your Priority Date"
                  secondaryLinkLabel="Read: Understanding the 90-Day Rule for Adjustment of Status"
                  secondaryLinkHref="/research/f1-students/f1-to-eb5-green-card"
                  variant="light"
                />
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto mt-8 inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Restart Checker
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="text-xs text-white/60 italic leading-relaxed">
              This educational tool provides a directional eligibility assessment only. Concurrent filing rules under the EB-5 Reform and Integrity Act change as visa bulletins update. Confirm your specific eligibility with qualified immigration counsel before filing.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConcurrentFilingCheckerMainContent;
