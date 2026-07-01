import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TEA_INVESTMENT_THRESHOLD,
  NON_TEA_INVESTMENT_THRESHOLD,
} from "@/lib/eb5-investment";

const FEASIBILITY_PATH = "/tools/2026-eb5-investment-feasibility-calculator";

// --- Shared Components ---

const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="cursor-help text-amber-600 ml-2 inline-flex">
        <Info size={14} />
      </span>
    </TooltipTrigger>
    <TooltipContent className="max-w-64 text-xs">
      {text}
    </TooltipContent>
  </Tooltip>
);

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
}

const CurrencyInput = ({ label, value, onChange, tooltip }: CurrencyInputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-muted-foreground mb-1">
      {label} {tooltip && <InfoTooltip text={tooltip} />}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-muted-foreground sm:text-sm">$</span>
      </div>
      <input
        type="number"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="focus:ring-foreground focus:border-foreground block w-full pl-7 pr-3 py-2 sm:text-sm border border-border rounded-md bg-background text-foreground"
        placeholder="0"
      />
    </div>
  </div>
);

interface TimelineStepProps {
  title: string;
  time: string;
  desc: string;
  last?: boolean;
}

const TimelineStep = ({ title, time, desc, last }: TimelineStepProps) => (
  <div className={`relative pl-8 pb-8 border-l-2 border-amber-600 ${last ? 'border-0 pb-0' : ''}`}>
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-foreground border-2 border-background"></div>
    <div className="font-serif font-bold text-foreground">
      {title} <span className="text-xs font-sans font-normal text-muted-foreground ml-2">({time})</span>
    </div>
    <div className="text-sm text-muted-foreground mt-1">{desc}</div>
  </div>
);

const AssetLiquidationCalc = () => {
  const [amount, setAmount] = useState(200000);
  const penalty = amount * 0.10;
  const taxes = amount * 0.30;
  const net = amount - penalty - taxes;

  return (
    <div className="bg-muted p-4 rounded-lg mt-4 text-sm border border-border">
      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
        <span>📉</span> Asset Liquidation Impact Calculator
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Estimate the real cost of withdrawing from a 401(k) or similar tax-deferred account.
      </p>
      
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-bold">Withdraw Amount:</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="w-32 p-1 text-xs border border-border rounded bg-background text-foreground"
        />
      </div>

      <div className="space-y-1 bg-background p-3 rounded border border-border">
        <div className="flex justify-between text-red-600">
          <span>Early Withdrawal Penalty (10%):</span>
          <span>-${penalty.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-red-600 border-b border-border pb-1 mb-1">
          <span>Est. Income Taxes (30%):</span>
          <span>-${taxes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-green-700 text-base">
          <span>Actual Cash Received:</span>
          <span>{net.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const EB5FeasibilityToolMainContent = () => {
  // Inputs
  const [income, setIncome] = useState(0);
  const [liquidAssets, setLiquidAssets] = useState(0);
  const [semiLiquidAssets, setSemiLiquidAssets] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [debts, setDebts] = useState(0);
  const [investmentType, setInvestmentType] = useState<'TEA' | 'NON_TEA'>('TEA');

  // Constants
  const INVESTMENT_AMOUNT = investmentType === 'TEA' ? TEA_INVESTMENT_THRESHOLD : NON_TEA_INVESTMENT_THRESHOLD;
  const FEES_ATTORNEY = 35000;
  const FEES_USCIS = 11160;
  const FEES_ADMIN = 60000;
  const FEES_DOCS = 7500;
  const FEES_RELOCATION = 35000;
  const RESERVE_MONTHS = 24;

  // Calculations
  const livingReserve = monthlyExpenses * RESERVE_MONTHS;
  const totalEBCosts = INVESTMENT_AMOUNT + FEES_ATTORNEY + FEES_USCIS + FEES_ADMIN + FEES_DOCS + FEES_RELOCATION;
  const totalNeeded = totalEBCosts + livingReserve;
  
  const remainingLiquid = liquidAssets - totalEBCosts;
  const totalAvailableAssets = (liquidAssets + semiLiquidAssets) - debts;
  const totalShortfall = totalNeeded - totalAvailableAssets;

  // Logic Determination
  let status: 'GREEN' | 'YELLOW' | 'RED' = 'RED';
  if (remainingLiquid >= livingReserve) {
    status = 'GREEN';
  } else if (totalAvailableAssets >= totalNeeded) {
    status = 'YELLOW';
  } else {
    status = 'RED';
  }

  const handlePrint = () => window.print();

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background">
        {/* Top Disclaimer */}
        <div className="bg-amber-100 text-center py-2 text-xs text-foreground border-b border-amber-200 font-medium print:hidden">
          ⚠️ This calculator provides preliminary guidance only and is NOT legal or financial advice.
        </div>

        {/* Hero Section */}
        <div className="bg-foreground text-background py-6">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold tracking-wide">
              StudentEB5 <span className="font-sans text-amber-500 font-light text-lg">| Feasibility Tool</span>
            </h2>
            <button 
              onClick={handlePrint} 
              className="text-sm border border-muted-foreground px-3 py-1 rounded hover:bg-muted-foreground/20 transition print:hidden"
            >
              Print Report
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4">
          <Breadcrumb customTitle="EB-5 Investment Feasibility Tool" initialPathname={FEASIBILITY_PATH} />
          <h1 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-foreground">
            2026 EB-5 Investment Feasibility Calculator
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4 border-b border-border pb-2">
                1. Financial Snapshot
              </h2>
              
              <CurrencyInput 
                label="Total Annual Income" 
                value={income} 
                onChange={setIncome} 
              />
              <CurrencyInput 
                label="Total Liquid Assets" 
                value={liquidAssets} 
                onChange={setLiquidAssets} 
                tooltip="Cash, Savings, Stocks, Bonds you can access quickly"
              />
              <CurrencyInput 
                label="Semi-Liquid Assets" 
                value={semiLiquidAssets} 
                onChange={setSemiLiquidAssets} 
                tooltip="401k, IRA, Real Estate Equity, Business Value"
              />
              <CurrencyInput 
                label="Monthly Living Expenses" 
                value={monthlyExpenses} 
                onChange={setMonthlyExpenses} 
              />
              <CurrencyInput 
                label="Total Debts / Liabilities" 
                value={debts} 
                onChange={setDebts} 
              />
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4 border-b border-border pb-2">
                2. EB-5 Selection
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-border rounded cursor-pointer hover:bg-muted transition">
                  <input 
                    type="radio" 
                    name="invType" 
                    checked={investmentType === 'TEA'} 
                    onChange={() => setInvestmentType('TEA')}
                    className="h-4 w-4 text-foreground focus:ring-foreground"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-foreground">TEA (Targeted Employment Area)</span>
                    <span className="block text-xs text-muted-foreground">$800,000 Investment</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-border rounded cursor-pointer hover:bg-muted transition">
                  <input 
                    type="radio" 
                    name="invType" 
                    checked={investmentType === 'NON_TEA'} 
                    onChange={() => setInvestmentType('NON_TEA')}
                    className="h-4 w-4 text-foreground focus:ring-foreground"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-foreground">Non-TEA (Standard)</span>
                    <span className="block text-xs text-muted-foreground">$1,050,000 Investment</span>
                  </div>
                </label>
              </div>
            </div>

            <AssetLiquidationCalc />
          </div>

          {/* --- RIGHT COLUMN: RESULTS --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section 1: Cost Breakdown */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">Total EB-5 Cost Breakdown</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>EB-5 Investment ({investmentType}):</span> <span>${INVESTMENT_AMOUNT.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Attorney Fees (Est):</span> <span>${FEES_ATTORNEY.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>USCIS Filing Fees:</span> <span>${FEES_USCIS.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Administrative Fees:</span> <span>${FEES_ADMIN.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Docs/Translation:</span> <span>${FEES_DOCS.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Relocation Budget:</span> <span>${FEES_RELOCATION.toLocaleString()}</span></div>
                <div className="flex justify-between text-amber-600 font-medium"><span>24-Month Living Reserve:</span> <span>${livingReserve.toLocaleString()}</span></div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>TOTAL NEEDED:</span>
                  <span>${totalNeeded.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Financial Position */}
            <div className="bg-muted p-6 rounded-lg border border-border">
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">Your Financial Position</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Available Liquid Assets:</span>
                  <span className="font-medium">${liquidAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Total Cost of EB-5 (w/ fees):</span>
                  <span>-${totalEBCosts.toLocaleString()}</span>
                </div>
                <div className="h-px bg-border"></div>
                
                <div className="flex justify-between items-center font-bold">
                  <span>Remaining Liquid Capital:</span>
                  <span className={remainingLiquid >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {remainingLiquid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Semi-Liquid Assets Available:</span>
                    <span>${semiLiquidAssets.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    *Note: Accessing semi-liquid assets (401k, Real Estate) takes time and may incur taxes/penalties.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Feasibility Result */}
            <div className={`p-6 rounded-lg shadow-md border-l-8 ${
              status === 'GREEN' ? 'bg-green-50 border-green-600' : 
              status === 'YELLOW' ? 'bg-yellow-50 border-yellow-500' : 
              'bg-red-50 border-red-600'
            }`}>
              {/* GREEN SCENARIO */}
              {status === 'GREEN' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🟢</span>
                    <h2 className="text-2xl font-serif font-bold text-green-900">STRONG POSITION</h2>
                  </div>
                  <p className="font-medium text-green-800 mb-4">
                    "You have sufficient liquid assets to cover the full EB-5 investment plus maintain a healthy financial cushion."
                  </p>
                  
                  <div className="bg-white p-4 rounded border border-green-200 mb-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase">What this means:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✅ You can likely proceed without major financial stress.</li>
                      <li>✅ You won't need to liquidate retirement accounts (avoiding penalties).</li>
                      <li>✅ You'll have {(remainingLiquid / monthlyExpenses).toFixed(1)} months of living expenses remaining.</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase">Next Steps:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      <li>Consult with an EB-5 immigration attorney (budget 3-6 months for initial process).</li>
                      <li>Begin gathering source of funds documentation (needs 5+ years of tax returns).</li>
                      <li>Research regional centers or direct investment projects.</li>
                      <li>Consult with CPA about tax implications.</li>
                    </ul>
                  </div>
                </>
              )}

              {/* YELLOW SCENARIO */}
              {status === 'YELLOW' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🟡</span>
                    <h2 className="text-2xl font-serif font-bold text-yellow-900">MODERATE POSITION - PREPARATION NEEDED</h2>
                  </div>
                  <p className="font-medium text-yellow-900 mb-4">
                    "You can potentially qualify, but you'll need to carefully plan and access semi-liquid assets."
                  </p>
                  
                  <div className="bg-white p-4 rounded border border-yellow-200 mb-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase">Your Challenges:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>⚠️ Liquid Asset Shortfall: <strong>${Math.abs(remainingLiquid).toLocaleString()}</strong>.</li>
                      <li>⚠️ You may need to liquidate retirement or real estate assets.</li>
                      <li>⚠️ Early 401(k) withdrawal could cost ~10% penalty + ~30% tax.</li>
                      <li>⚠️ Real estate sales can take 3-6 months.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase">Recommended Timeline (12-18 Months):</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="p-2 bg-yellow-100 rounded">
                        <strong>Months 1-6:</strong> Build liquid savings. Delay non-essential purchases.
                      </div>
                      <div className="p-2 bg-yellow-100 rounded">
                        <strong>Months 6-12:</strong> Begin liquidation planning. List property or consult tax advisor about 401(k).
                      </div>
                      <div className="p-2 bg-yellow-100 rounded">
                        <strong>Months 12-18:</strong> Hire attorney once funds are liquid.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* RED SCENARIO */}
              {status === 'RED' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔴</span>
                    <h2 className="text-2xl font-serif font-bold text-red-900">CHALLENGING POSITION - NOT RECOMMENDED NOW</h2>
                  </div>
                  <p className="font-medium text-red-900 mb-4">
                    "Based on your current financial situation, EB-5 investment would create significant financial risk."
                  </p>
                  
                  <div className="bg-white p-4 rounded border border-red-200 mb-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase">Why this is risky:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>❌ Total Shortfall: <strong>${Math.abs(totalShortfall).toLocaleString()}</strong> (including living reserve).</li>
                      <li>❌ Investment would consume a dangerous % of your total net worth.</li>
                      <li>❌ Risk of running out of funds during the 2-3 year waiting period.</li>
                    </ul>
                  </div>

                </>
              )}
            </div>

            {/* Section 4: Timeline Visualizer */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border print:hidden">
              <h3 className="text-lg font-serif font-bold text-foreground mb-6">Typical EB-5 Timeline</h3>
              <div className="ml-2">
                <TimelineStep 
                  title="Preparation Phase" 
                  time="Month 0-6" 
                  desc="Hire attorney, liquidate assets, gather Source of Funds documents." 
                />
                <TimelineStep 
                  title="File I-526E Petition" 
                  time="Month 6" 
                  desc="Investment funds are transferred to escrow/project." 
                />
                <TimelineStep 
                  title="USCIS Adjudication" 
                  time="Month 6-30+" 
                  desc="Waiting period. Funds are committed. No work authorization yet." 
                />
                <TimelineStep 
                  title="Conditional Green Card" 
                  time="Month 30+" 
                  desc="If approved, you can enter the US and work/live freely." 
                  last
                />
              </div>
            </div>

            {/* Section 5: Source of Funds Checklist */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border print:hidden">
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">Required Documentation Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>5 Years of Personal Tax Returns</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bank Statements (showing accumulation)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Employment Verification Letters</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Sale of Property Records (if applicable)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Gift Letters & Donor's Taxes (if applicable)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Business Financials (if business owner)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-foreground text-muted py-8 mt-12 text-sm text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="mb-4">
              <strong>Critical Disclaimer:</strong> EB-5 regulations are complex. Investment capital is at risk and not guaranteed to be returned. Processing times vary. Regional center vs. direct investment differences exist. Always consult with a licensed immigration attorney and financial advisor.
            </p>
            <p>© 2026 StudentEB5. All rights reserved.</p>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
};

export default EB5FeasibilityToolMainContent;
