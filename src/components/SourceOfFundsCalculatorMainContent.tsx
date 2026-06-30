import { useState, useMemo } from 'react';
import { Link } from '@/components/RouterLink';
import { Wallet, TrendingUp, Building, PiggyBank, DollarSign, ChevronDown, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TEA_INVESTMENT_THRESHOLD } from '@/lib/eb5-investment';

type TaxStatus = 'nra' | 'resident';

const SourceOfFundsCalculatorMainContent = () => {
  const [step, setStep] = useState(1);
  const [taxStatus, setTaxStatus] = useState<TaxStatus>('nra');
  const [targetFunding, setTargetFunding] = useState<string>(String(TEA_INVESTMENT_THRESHOLD));
  const [brokerageCostBasis, setBrokerageCostBasis] = useState<string>('');
  const [brokerageCurrentValue, setBrokerageCurrentValue] = useState<string>('');
  const [iraBalance, setIraBalance] = useState<string>('');
  const [helocAmount, setHelocAmount] = useState<string>('');
  const [mathOpen, setMathOpen] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const result = useMemo(() => {
    const costBasis = parseFloat(brokerageCostBasis) || 0;
    const currentValue = parseFloat(brokerageCurrentValue) || 0;
    const ira = parseFloat(iraBalance) || 0;
    const heloc = parseFloat(helocAmount) || 0;

    let brokerageCost: number | null = null;
    let iraCost: number | null = null;
    let helocCost: number | null = null;

    if (currentValue > 0 && costBasis > 0) {
      const gain = currentValue - costBasis;
      if (gain > 0) {
        const taxRate = taxStatus === 'nra' ? 0.30 : 0.20;
        brokerageCost = gain * taxRate;
      } else {
        brokerageCost = 0;
      }
    }

    if (ira > 0) {
      iraCost = ira * (0.10 + 0.25);
    }

    if (heloc > 0) {
      helocCost = heloc * 0.085;
    }

    const costs: { name: string; cost: number }[] = [];
    if (brokerageCost !== null) costs.push({ name: 'Brokerage', cost: brokerageCost });
    if (iraCost !== null) costs.push({ name: 'IRA/401k', cost: iraCost });
    if (helocCost !== null) costs.push({ name: 'HELOC', cost: helocCost });

    let optimalPath = 'Enter asset data to analyze';
    let recommendation = 'Please enter your financial data in Step 2 to receive a personalized recommendation.';

    if (costs.length > 0) {
      costs.sort((a, b) => a.cost - b.cost);
      const optimal = costs[0];
      optimalPath = optimal.name;

      if (optimal.name === 'Brokerage') {
        recommendation = `Liquidating your brokerage assets is the most tax-efficient path with an estimated cost of ${formatCurrency(optimal.cost)}. ${taxStatus === 'nra' ? 'As a Non-Resident Alien, be aware of the 30% flat tax on capital gains.' : 'Long-term capital gains rates apply, making this an efficient choice.'}`;
      } else if (optimal.name === 'IRA/401k') {
        recommendation = `While retirement account withdrawal incurs a 10% early withdrawal penalty plus income taxes (estimated total: ${formatCurrency(optimal.cost)}), this may still be your most cost-effective option based on the data provided.`;
      } else if (optimal.name === 'HELOC') {
        recommendation = `Using home equity via HELOC has an estimated annual interest cost of ${formatCurrency(optimal.cost)}. Note that interest is not deductible for EB-5 investments, but this preserves your investment assets.`;
      }
    }

    return { brokerageCost, iraCost, helocCost, optimalPath, recommendation };
  }, [taxStatus, brokerageCostBasis, brokerageCurrentValue, iraBalance, helocAmount]);

  const steps = [
    { num: 1, label: 'Visa Profile' },
    { num: 2, label: 'Assets' },
    { num: 3, label: 'Results' },
  ];

  return (
    <main className="container mx-auto px-4 pt-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Source of Funds Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimize your EB-5 funding source for tax efficiency
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  step === s.num
                    ? 'bg-foreground text-background'
                    : step > s.num
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.num ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">{s.num}</span>
                )}
                {s.label}
              </button>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Visa Profile */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                Visa Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="taxStatus">Current Visa / Tax Profile</Label>
                <Select value={taxStatus} onValueChange={(value: TaxStatus) => setTaxStatus(value)}>
                  <SelectTrigger id="taxStatus">
                    <SelectValue placeholder="Select your visa / tax profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nra">F-1 Student / OPT (In US less than 5 years)</SelectItem>
                    <SelectItem value="resident">H-1B, L-1, or F-1 (In US more than 5 years)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  <strong>Why this matters:</strong> F-1 students under 5 years often pay 0% US Capital Gains tax. 
                  H-1B and longer-term residents are taxed on worldwide income (Resident Aliens).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetFunding">Target Funding Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="targetFunding"
                    type="number"
                    value={targetFunding}
                    onChange={(e) => setTargetFunding(e.target.value)}
                    className="pl-9"
                    placeholder="800000"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} className="gap-2">
                  Next: Assets <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Assets */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                Asset Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Option A: Brokerage */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Option A: Brokerage (Stocks/Crypto)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costBasis">Cost Basis ($)</Label>
                    <Input id="costBasis" type="number" value={brokerageCostBasis} onChange={(e) => setBrokerageCostBasis(e.target.value)} placeholder="0" />
                    <p className="text-xs text-muted-foreground">Original purchase price</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentValue">Current Value ($)</Label>
                    <Input id="currentValue" type="number" value={brokerageCurrentValue} onChange={(e) => setBrokerageCurrentValue(e.target.value)} placeholder="0" />
                    <p className="text-xs text-muted-foreground">Current market price</p>
                  </div>
                </div>
              </div>

              {/* Option B: IRA/401k */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <PiggyBank className="w-5 h-5 text-primary" />
                  Option B: Traditional IRA / 401k
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="iraBalance">IRA/401k Balance ($)</Label>
                  <Input id="iraBalance" type="number" value={iraBalance} onChange={(e) => setIraBalance(e.target.value)} placeholder="0" />
                  <p className="text-xs text-muted-foreground">Assumes 10% penalty unless used for Education.</p>
                </div>
              </div>

              {/* Option C: HELOC */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <Building className="w-5 h-5 text-primary" />
                  Option C: Home Equity / HELOC
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="helocAmount">HELOC Amount ($)</Label>
                  <Input id="helocAmount" type="number" value={helocAmount} onChange={(e) => setHelocAmount(e.target.value)} placeholder="0" />
                  <p className="text-xs text-muted-foreground">Interest is non-deductible for EB-5.</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  View Results <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                  Strategic Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">Brokerage Effective Cost:</p>
                    <p className="text-xl font-bold text-foreground">
                      {result.brokerageCost !== null ? formatCurrency(result.brokerageCost) : '-'}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">IRA Effective Cost (Tax + Penalty):</p>
                    <p className="text-xl font-bold text-foreground">
                      {result.iraCost !== null ? formatCurrency(result.iraCost) : '-'}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">HELOC Annual Cost (Interest):</p>
                    <p className="text-xl font-bold text-foreground">
                      {result.helocCost !== null ? formatCurrency(result.helocCost) : '-'}
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-6 border-2 border-primary/30">
                  <h4 className="text-lg font-semibold mb-2">
                    Optimal Path: <span className="text-primary">{result.optimalPath}</span>
                  </h4>
                  <p className="text-muted-foreground">{result.recommendation}</p>
                  
                  <Collapsible open={mathOpen} onOpenChange={setMathOpen} className="mt-4">
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                      View the math behind this strategy
                      <ChevronDown className={`w-4 h-4 transition-transform ${mathOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4 text-sm text-muted-foreground">
                      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">Brokerage Calculation</h5>
                          <p>Capital Gain = Current Value - Cost Basis</p>
                          <p>Tax = Gain × {taxStatus === 'nra' ? '30% (NRA flat rate)' : '20% (Long-term capital gains rate)'}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">IRA/401k Calculation</h5>
                          <p>Early Withdrawal Penalty = Balance × 10%</p>
                          <p>Income Tax = Balance × 25% (estimated marginal rate)</p>
                          <p>Total Cost = Penalty + Income Tax = Balance × 35%</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">HELOC Calculation</h5>
                          <p>Annual Interest Cost = HELOC Amount × 8.5% (average rate)</p>
                          <p>Note: Interest is not tax-deductible for investment purposes.</p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="flex justify-start pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Assets
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Legal Disclaimer */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">IMPORTANT LEGAL DISCLAIMER</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  This tool is for educational and illustrative purposes only and does not constitute legal, tax, investment, or immigration advice. The "Liquidation Strategy Engine" provides estimates based on simplified assumptions and current US tax laws, which are subject to change.
                </p>
                <p>
                  <strong className="text-foreground">Immigration Warning:</strong> Minimizing tax liability may not always align with the "Source of Funds" tracking requirements for the EB-5 visa. A strategy that saves tax money but obscures the paper trail could lead to a visa denial.
                </p>
                <p>
                  <strong className="text-foreground">No Attorney-Client Relationship:</strong> Use of this tool does not create an attorney-client relationship. You should strictly consult with a qualified Immigration Attorney and Certified Public Accountant (CPA) before executing any financial transactions or submitting documents to USCIS. StudentEB5.com assumes no responsibility for actions taken based on these calculations.
                </p>
              </div>
            </div>

            <p className="mt-10 text-left font-serif font-light text-foreground/55 text-sm leading-relaxed">
              Wealth preservation analysis for families <Link to="/pathways/h1b-to-green-card" className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground/80 transition-colors">escaping the H-1B backlog</Link> through tax-efficient residency pathways.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default SourceOfFundsCalculatorMainContent;
