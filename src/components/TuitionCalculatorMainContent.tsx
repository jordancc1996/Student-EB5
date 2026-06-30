import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from '@/components/RouterLink';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const tuitionData: Record<string, { intl: number; inState: number }> = {
  "Arizona State University (ASU)": { intl: 39910, inState: 12482 },
  "UC San Diego": { intl: 48878, inState: 14610 },
  "UC Irvine": { intl: 48006, inState: 14312 },
  "UC Berkeley": { intl: 48176, inState: 14312 },
  "UCLA": { intl: 48315, inState: 13804 },
  "University of Illinois Urbana-Champaign (UIUC)": { intl: 38860, inState: 18042 },
  "University of Michigan (Ann Arbor)": { intl: 60094, inState: 17786 },
  "University of Washington (Seattle)": { intl: 44076, inState: 12643 }
};

const TuitionCalculatorMainContent = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');

  const universityNames = Object.keys(tuitionData);

  const data = selectedUniversity ? tuitionData[selectedUniversity] : null;
  const annualIntl = data?.intl || 0;
  const annualInState = data?.inState || 0;
  const annualSavings = annualIntl - annualInState;
  const totalSavings = annualSavings * 4;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <main className="container mx-auto px-6 pt-8 pb-8">

      {/* Calculator Widget */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 md:p-10 shadow-lg border-border/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">
              Tuition Savings Calculator
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Compare F-1 International tuition vs. Green Card (In-State) tuition to see how EB-5 can lower your education costs.
            </p>
          </div>

          {/* University Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Select University
            </label>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Choose a university..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {universityNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {data && (
            <div className="space-y-6">
              {/* Visual Bar Chart */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">4-Year Cost Comparison</p>

                {/* F-1 Cost Bar */}
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-foreground">F-1 International</span>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(annualIntl * 4)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-sm h-10 overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-sm transition-all duration-700 ease-out"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Green Card Cost Bar */}
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-foreground">Green Card (In-State)</span>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(annualInState * 4)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-sm h-10 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-sm transition-all duration-700 ease-out"
                      style={{ width: `${(annualInState / annualIntl) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Annual Breakdown */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="py-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Annual International</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(annualIntl)}</p>
                </div>
                <div className="py-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Annual In-State</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(annualInState)}</p>
                </div>
                <div className="py-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Annual Savings</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(annualSavings)}</p>
                </div>
              </div>

              {/* Total 4-Year Savings */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 text-center border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Total 4-Year Savings</p>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 transition-all duration-300">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Money saved over a standard 4-year degree
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              *Figures are estimates based on 2024-2025 academic year tuition data for non-resident (International) vs. resident (In-State) status. Actual costs may vary by specific college within the university, credit load, and annual tuition increases. Does not include room, board, or other fees unless part of the standard tuition calculation.
            </p>
          </div>
        </Card>

        <p className="mt-10 text-left font-serif font-light text-foreground/55 text-sm leading-relaxed">
          ROI figures are optimized for students <Link to="/pathways/f1-to-eb5-self-sponsored-green-card" className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground/80 transition-colors">securing US residency after graduation</Link> to unlock domestic tuition rates.
        </p>
      </div>

      {/* Footer Link */}
      <div className="text-center mt-8">
        <Link
          to="/eb5-investment-immigration-tools"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Explore more tools
        </Link>
      </div>
    </main>
  );
};

export default TuitionCalculatorMainContent;
