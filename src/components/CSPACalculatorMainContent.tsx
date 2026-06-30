import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import heroImage from '@/assets/about-hero-new.jpg';
import NextStepsCTA from '@/components/tools/NextStepsCTA';

const DAYS_PER_YEAR = 365.25;

/** Parse YYYY-MM-DD as UTC calendar date (timezone-independent). */
const parseDateOnlyUTC = (dateStr: string): Date | null => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  return isNaN(date.getTime()) ? null : date;
};

const diffDays = (a: Date, b: Date) => (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);

interface Result {
  status: 'protected' | 'risk' | 'aged-out';
  cspaAge: number;
  biologicalAge: number;
  pendingDays: number;
  title: string;
  msg: string;
}

const CSPACalculatorMainContent = () => {
  const [dob, setDob] = useState('');
  const [filingDate, setFilingDate] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [visaDate, setVisaDate] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const calculate = () => {
    if (!dob || !filingDate || !approvalDate || !visaDate) {
      setError('Please complete all four date fields to calculate CSPA age.');
      return;
    }
    const dobD = parseDateOnlyUTC(dob);
    const filD = parseDateOnlyUTC(filingDate);
    const aprD = parseDateOnlyUTC(approvalDate);
    const visD = parseDateOnlyUTC(visaDate);

    if (!dobD || !filD || !aprD || !visD) {
      setError('Please complete all four date fields to calculate CSPA age.');
      return;
    }

    if (aprD < filD) {
      setError('I-526E Approval Date cannot be earlier than the Filing Date.');
      return;
    }
    setError('');

    // Visa "becomes available" on the later of: Final Action Date or I-526E Approval Date
    const availabilityDate = visD > aprD ? visD : aprD;

    const biologicalAge = diffDays(availabilityDate, dobD) / DAYS_PER_YEAR;
    const pendingDays = diffDays(aprD, filD);
    const cspaAge = biologicalAge - pendingDays / DAYS_PER_YEAR;

    let status: Result['status'];
    let title: string;
    let msg: string;

    if (cspaAge < 20.5) {
      status = 'protected';
      title = 'Likely Protected';
      msg = 'Based on these inputs, the calculated CSPA age remains comfortably under 21. Your derivative child appears protected from aging out, provided the visa is sought within one year of availability.';
    } else if (cspaAge < 21) {
      status = 'risk';
      title = 'At Risk: Narrow Margin';
      msg = 'The calculated CSPA age is under 21 but within a narrow margin. Filing delays, retrogression, or missing the one-year sought-to-acquire deadline could trigger an age-out. Confirm timing with immigration counsel.';
    } else {
      status = 'aged-out';
      title = 'Age-Out Risk Detected';
      msg = 'The calculated CSPA age is 21 or above, indicating the child may not qualify as a derivative under current rules. Strategic options such as filing earlier, switching to a Reserved category, or alternate visa pathways should be reviewed.';
    }

    setResult({
      status,
      cspaAge: Math.max(0, cspaAge),
      biologicalAge: Math.max(0, biologicalAge),
      pendingDays: Math.max(0, pendingDays),
      title,
      msg,
    });
  };

  const reset = () => {
    setDob('');
    setFilingDate('');
    setApprovalDate('');
    setVisaDate('');
    setError('');
    setResult(null);
  };

  const fieldClasses =
    'w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-white appearance-none cursor-pointer [color-scheme:dark]';

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
              EB-5 CSPA Age
              <br />
              Calculator
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Predict whether your derivative child is protected from "aging out" before EB-5 residency is granted.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl">
            {!result ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-3 opacity-80">
                    Child's Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={fieldClasses}
                  />
                </div>

                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-3 opacity-80">
                    I-526E Filing Date
                  </label>
                  <input
                    type="date"
                    value={filingDate}
                    onChange={(e) => setFilingDate(e.target.value)}
                    className={fieldClasses}
                  />
                </div>

                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-3 opacity-80">
                    I-526E Approval Date
                  </label>
                  <input
                    type="date"
                    value={approvalDate}
                    onChange={(e) => setApprovalDate(e.target.value)}
                    className={fieldClasses}
                  />
                </div>

                <div>
                  <label className="block text-white text-xs uppercase tracking-widest mb-3 opacity-80">
                    Visa Availability Date (Final Action Date)
                  </label>
                  <input
                    type="date"
                    value={visaDate}
                    onChange={(e) => setVisaDate(e.target.value)}
                    className={fieldClasses}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-200 text-center">{error}</p>
                )}

                <button
                  type="button"
                  onClick={calculate}
                  className="w-full py-4 mt-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                >
                  Calculate CSPA Age
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/60 uppercase tracking-widest text-xs mb-4">Result</p>
                <h2 className="font-serif text-white text-3xl md:text-4xl mb-2">
                  {result.title}
                </h2>
                <p className="text-white/80 text-sm uppercase tracking-widest mb-8">
                  Calculated CSPA Age: <span className="text-white font-semibold">{result.cspaAge.toFixed(2)} years</span>
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8 max-w-lg mx-auto text-left">
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Biological Age at Visa Availability</p>
                    <p className="text-white text-lg font-serif">{result.biologicalAge.toFixed(2)} yrs</p>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Petition Pending Time Subtracted</p>
                    <p className="text-white text-lg font-serif">{Math.round(result.pendingDays)} days</p>
                  </div>
                </div>

                <p className="text-gray-200 mb-8 leading-relaxed max-w-xl mx-auto">
                  {result.msg}
                </p>
                <NextStepsCTA
                  heading="Protect Your Child's EB-5 Eligibility"
                  description="A CSPA specialist can review filing windows, sought-to-acquire deadlines, and Reserved category timing for your family."
                  ctaLabel="Speak with a CSPA Specialist"
                  secondaryLinkLabel="Read: The CSPA Aging-Out Crisis and How EB-5 Solves It"
                  secondaryLinkHref="/research/eb5-visa-aging-out-crisis-solution"
                  variant="light"
                />
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto mt-8 inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Restart Calculator
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="text-xs text-white/60 italic leading-relaxed">
              CSPA age is calculated as the child's age on the visa availability date, minus the time the I-526E petition was pending. A CSPA age under 21 generally protects the child as a derivative, provided the visa is "sought" within one year of availability. This educational tool offers a directional estimate only and does not constitute legal advice. Confirm specific eligibility with qualified immigration counsel.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CSPACalculatorMainContent;
