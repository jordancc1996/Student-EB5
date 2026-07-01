import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';
import { TEA_INVESTMENT_THRESHOLD } from '@/lib/eb5-investment';

const pathwayFont = "'Inter', 'Helvetica Neue', sans-serif";

// Average annual tuition data (international vs in-state/domestic)
const TUITION_DATA: Record<string, { international: number; domestic: number; label: string }> = {
  'public-instate': { international: 45000, domestic: 12000, label: 'Public (In-State)' },
  'public-outofstate': { international: 45000, domestic: 28000, label: 'Public (Out-of-State)' },
  private: { international: 58000, domestic: 55000, label: 'Private' },
};

const InlineTuitionCalculator = () => {
  const [uniType, setUniType] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{ savings: number; percentage: number } | null>(null);

  const handleCalculate = () => {
    if (!uniType || !years) return;
    const data = TUITION_DATA[uniType];
    const numYears = parseInt(years);
    const savings = (data.international - data.domestic) * numYears;
    const percentage = Math.round((savings / TEA_INVESTMENT_THRESHOLD) * 100);
    setResult({ savings, percentage });
  };

  return (
    <div
      className="bg-white border-2 border-black rounded-none mt-10"
      style={{ padding: '32px' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <DollarSign size={20} className="text-foreground" />
        <h3
          className="font-sans text-lg font-semibold text-foreground uppercase tracking-wider"
          style={{ fontFamily: pathwayFont, fontSize: '13px', letterSpacing: '0.12em' }}
        >
          Tuition Savings Estimator
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: pathwayFont }}>
            University Type
          </label>
          <Select value={uniType} onValueChange={setUniType}>
            <SelectTrigger className="h-11 rounded-none border-black">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public-instate">Public (In-State)</SelectItem>
              <SelectItem value="public-outofstate">Public (Out-of-State)</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: pathwayFont }}>
            Years Remaining
          </label>
          <Select value={years} onValueChange={setYears}>
            <SelectTrigger className="h-11 rounded-none border-black">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              {['1', '2', '3', '4'].map((y) => (
                <SelectItem key={y} value={y}>{y} {y === '1' ? 'year' : 'years'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={!uniType || !years}
        className="w-full h-11 rounded-full font-semibold text-sm"
      >
        Calculate My Savings
      </Button>

      {result && (
        <div className="mt-6 border-t-2 border-black pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: pathwayFont }}>
                Estimated Total Savings
              </p>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: pathwayFont }}>
                ${result.savings.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: pathwayFont }}>
                EB-5 Investment Offset
              </p>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: pathwayFont }}>
                {result.percentage}%
              </p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ fontFamily: pathwayFont }}>
                <span className="text-muted-foreground uppercase tracking-wider font-medium">F-1 International Tuition</span>
                <span className="text-foreground font-semibold">
                  ${(TUITION_DATA[uniType].international * parseInt(years)).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-sm">
                <div className="h-full bg-foreground rounded-sm" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ fontFamily: pathwayFont }}>
                <span className="text-muted-foreground uppercase tracking-wider font-medium">Green Card (Domestic) Tuition</span>
                <span className="text-foreground font-semibold">
                  ${(TUITION_DATA[uniType].domestic * parseInt(years)).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-sm">
                <div
                  className="h-full bg-primary rounded-sm transition-all duration-500"
                  style={{ width: `${(TUITION_DATA[uniType].domestic / TUITION_DATA[uniType].international) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineTuitionCalculator;
