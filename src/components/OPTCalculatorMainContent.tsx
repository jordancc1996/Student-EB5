import { useState, useEffect, useMemo } from 'react';

const ONE_DAY = 24 * 60 * 60 * 1000;

interface EadRow {
  id: string;
  startDate: string;
  endDate: string;
  type: 'full' | 'part';
}

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

const addDaysUTC = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * ONE_DAY);

const addMonthsUTC = (date: Date, months: number): Date => {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + months;
  const d = date.getUTCDate();
  return new Date(Date.UTC(y, m, d));
};

const formatDate = (dateObj: Date | null): string => {
  if (!dateObj || isNaN(dateObj.getTime())) return '...';
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  const yyyy = dateObj.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const OPTCalculatorMainContent = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [levelStudy, setLevelStudy] = useState('all');
  const [term, setTerm] = useState('spring');
  const [year, setYear] = useState(currentYear);
  const [programEndDate, setProgramEndDate] = useState('');

  // Prior OPT
  const [hasPriorOpt, setHasPriorOpt] = useState(false);
  const [eadRows, setEadRows] = useState<EadRow[]>([]);

  // Final start date
  const [reqStartDate, setReqStartDate] = useState('');

  // Auto-fill program end date when term/year change
  useEffect(() => {
    let estimatedDate = '';
    if (term === 'spring') estimatedDate = `${year}-05-15`;
    if (term === 'summer') estimatedDate = `${year}-08-30`;
    if (term === 'fall') estimatedDate = `${year}-12-19`;
    setProgramEndDate(estimatedDate);
  }, [term, year]);

  // Derived calculations (UTC — same calendar result in every browser timezone)
  const PED = useMemo(() => {
    if (!programEndDate) return null;
    return parseDateOnlyUTC(programEndDate);
  }, [programEndDate]);

  const earliestApply = useMemo(() => PED ? addDaysUTC(PED, -90) : null, [PED]);
  const latestApply = useMemo(() => PED ? addDaysUTC(PED, 60) : null, [PED]);
  const earliestStart = useMemo(() => PED ? addDaysUTC(PED, 1) : null, [PED]);
  const latestStart = useMemo(() => PED ? addDaysUTC(PED, 60) : null, [PED]);

  // Auto-calculate days used from EAD rows
  const daysUsed = useMemo(() => {
    let used = 0;
    eadRows.forEach(row => {
      if (row.startDate && row.endDate) {
        const s = parseDateOnlyUTC(row.startDate);
        const e = parseDateOnlyUTC(row.endDate);
        if (!s || !e) return;
        const diffTime = Math.abs(e.getTime() - s.getTime());
        const diffDays = Math.ceil(diffTime / ONE_DAY) + 1;
        if (row.type === 'full') used += diffDays;
        else used += diffDays / 2;
      }
    });
    return Math.round(used);
  }, [eadRows]);

  const daysAvailable = hasPriorOpt ? 365 - daysUsed : 365;

  // Calculate end date
  const { calculatedEndDate, startDateError } = useMemo(() => {
    if (!reqStartDate || !earliestStart || !latestStart || !PED) {
      return { calculatedEndDate: null, startDateError: '' };
    }
    const userStart = parseDateOnlyUTC(reqStartDate);
    if (!userStart) {
      return { calculatedEndDate: null, startDateError: '' };
    }
    if (userStart.getTime() < earliestStart.getTime() || userStart.getTime() > latestStart.getTime()) {
      return {
        calculatedEndDate: null,
        startDateError: `Please select a date between ${formatDate(earliestStart)} and ${formatDate(latestStart)}.`
      };
    }
    if (daysAvailable <= 0) {
      return { calculatedEndDate: null, startDateError: '' };
    }
    let finalEndDate = addDaysUTC(userStart, daysAvailable - 1);
    const max14MonthDate = addMonthsUTC(PED, 14);
    if (finalEndDate.getTime() > max14MonthDate.getTime()) finalEndDate = max14MonthDate;
    return { calculatedEndDate: finalEndDate, startDateError: '' };
  }, [reqStartDate, daysAvailable, earliestStart, latestStart, PED]);

  const addEadRow = () => {
    setEadRows(prev => [...prev, { id: 'row-' + Date.now(), startDate: '', endDate: '', type: 'full' }]);
  };

  const removeEadRow = (id: string) => {
    setEadRows(prev => {
      const filtered = prev.filter(row => row.id !== id);
      return filtered.length === 0 ? [{ id: 'row-' + Date.now(), startDate: '', endDate: '', type: 'full' }] : filtered;
    });
  };

  const updateEadRow = (id: string, field: keyof EadRow, value: string) => {
    setEadRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto px-10 pb-10 max-w-[900px]">

        <h1 className="text-[2.5rem] font-normal text-muted-foreground mb-8">
          OPT Calculator
        </h1>

        {/* Level of Study & Program End Date */}
        <div className="mb-10">
          <div className="mb-8">
            <label className="block mb-2 text-muted-foreground text-lg">Level of study</label>
            <select
              value={levelStudy}
              onChange={(e) => setLevelStudy(e.target.value)}
              className="px-3 py-2.5 border border-border rounded bg-muted text-muted-foreground cursor-pointer"
            >
              <option value="all">All degrees</option>
              <optgroup label="Medical Center Campus">
                <option value="med-all">All degrees</option>
              </optgroup>
              <optgroup label="Morningside Campus">
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="doctoral">Doctoral</option>
                <option value="jd">JD</option>
                <option value="certificate">Certificate</option>
              </optgroup>
            </select>
          </div>

          <label className="block mb-2 text-muted-foreground text-lg">
            I am completing my program at the end of
          </label>
          <div className="flex items-center flex-wrap gap-2.5 mb-8">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="px-3 py-2.5 border border-border rounded bg-muted text-muted-foreground cursor-pointer"
            >
              <option value="spring">Spring Term</option>
              <option value="summer">Summer Term</option>
              <option value="fall">Fall Term</option>
            </select>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-3 py-2.5 border border-border rounded bg-muted text-muted-foreground cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <h2 className="text-[1.8rem] font-normal text-muted-foreground mt-10 mb-2.5">Program End Date</h2>
          <p className="text-muted-foreground mb-4">Refer to your I-20 to fill in your program end date, or use the auto-filled date from your term selection above.</p>

          <div className="flex items-center flex-wrap gap-2.5">
            <label className="text-muted-foreground text-lg">Custom date</label>
            <input
              type="date"
              value={programEndDate}
              onChange={(e) => setProgramEndDate(e.target.value)}
              className="px-3 py-2.5 border border-border rounded bg-background text-foreground max-w-[300px]"
            />
          </div>
        </div>

        {/* Application Window — shows instantly when PED is set */}
        {PED && (
          <div className="mb-10">
            <h2 className="text-[1.8rem] font-normal text-muted-foreground mt-10 mb-2.5">OPT Application Processing Timeline</h2>
            
            <div className="my-10 overflow-x-auto">
              <div className="flex justify-between min-w-[600px] pt-5">
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">First day to apply</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(earliestApply)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end pb-7">
                  <div className="w-full h-0.5 bg-[#0033a0]"></div>
                  <div className="mt-1.5 text-muted-foreground text-[0.8rem]">90 days</div>
                </div>
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">Program completion date</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(PED)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end pb-7">
                  <div className="w-full h-0.5 bg-[#0033a0]"></div>
                  <div className="mt-1.5 text-muted-foreground text-[0.8rem]">60 days</div>
                </div>
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">Last day for USCIS to receive your application</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(latestApply)}</div>
                </div>
              </div>
            </div>

            <p className="text-lg mt-5 text-muted-foreground">
              Your earliest date to apply to the ISSO for an OPT I-20 is <strong className="text-foreground">{formatDate(earliestApply)}</strong>. The last day for USCIS to receive your application is <strong className="text-foreground">{formatDate(latestApply)}</strong>.
            </p>

            <h2 className="text-[1.8rem] font-normal text-muted-foreground mt-10 mb-2.5">Choosing your start date</h2>

            <div className="my-10 overflow-x-auto">
              <div className="flex justify-between min-w-[600px] pt-5">
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">Program completion date</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(PED)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end pb-7">
                  <div className="w-full h-0.5 bg-[#0033a0]"></div>
                </div>
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">Earliest OPT start date</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(earliestStart)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end pb-7">
                  <div className="w-full h-0.5 bg-[#0033a0]"></div>
                </div>
                <div className="text-center flex-none w-[140px] relative">
                  <div className="bg-[#0033a0] text-white px-2.5 py-4 rounded-[20px] text-[0.85rem] font-bold flex items-center justify-center min-h-[50px] mb-6">Last OPT start date</div>
                  <div className="font-bold text-lg text-foreground">{formatDate(latestStart)}</div>
                </div>
              </div>
            </div>

            <p className="text-lg mt-5 text-muted-foreground">
              Your start date can be between <strong className="text-foreground">{formatDate(earliestStart)}</strong> and <strong className="text-foreground">{formatDate(latestStart)}</strong>.
            </p>

            {/* Prior OPT & End Date Calculation */}
            <h2 className="text-[1.8rem] font-normal text-muted-foreground mt-10 mb-2.5">Calculating your OPT end date</h2>
            <p className="text-muted-foreground">This depends on how much OPT time you have left at the same level.</p>

            <p className="font-normal mt-5 text-foreground">Have you ever used OPT during your current level of study?</p>

            <div className="my-5">
              <label className="inline-block mr-5 font-normal cursor-pointer text-foreground">
                <input type="radio" name="priorOpt" checked={hasPriorOpt} onChange={() => { setHasPriorOpt(true); if (eadRows.length === 0) addEadRow(); }} className="mr-1" />
                Yes
              </label>
              <label className="inline-block mr-5 font-normal cursor-pointer text-foreground">
                <input type="radio" name="priorOpt" checked={!hasPriorOpt} onChange={() => { setHasPriorOpt(false); }} className="mr-1" />
                No
              </label>
            </div>

            {hasPriorOpt && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="text-muted-foreground">Fill in your start and end dates below as listed on your EAD Card(s):</p>
                <div className="mt-4">
                  {eadRows.map((row) => (
                    <div key={row.id} className="flex items-end gap-4 mb-4 flex-wrap">
                      <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-muted-foreground">Start date</label>
                        <input type="date" value={row.startDate} onChange={(e) => updateEadRow(row.id, 'startDate', e.target.value)} className="px-3 py-2.5 border border-border rounded bg-background text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-muted-foreground">End date</label>
                        <input type="date" value={row.endDate} onChange={(e) => updateEadRow(row.id, 'endDate', e.target.value)} className="px-3 py-2.5 border border-border rounded bg-background text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-muted-foreground">Type of employment</label>
                        <select value={row.type} onChange={(e) => updateEadRow(row.id, 'type', e.target.value as 'full' | 'part')} className="px-3 py-2.5 border border-border rounded bg-muted text-muted-foreground cursor-pointer">
                          <option value="full">Full-time</option>
                          <option value="part">Part-time</option>
                        </select>
                      </div>
                      <button onClick={() => removeEadRow(row.id)} className="px-4 py-2.5 bg-background border border-border rounded text-muted-foreground cursor-pointer hover:bg-muted">Clear</button>
                    </div>
                  ))}
                </div>
                <button onClick={addEadRow} className="px-4 py-2.5 bg-muted border border-border rounded text-foreground cursor-pointer mt-2.5 hover:bg-muted/80">Add Additional EAD Card</button>
                <div className="mt-5">
                  <span className="text-lg text-muted-foreground">
                    Total: <span className="font-bold text-foreground">{daysUsed}</span> days used of 365
                  </span>
                </div>
              </div>
            )}

            {/* Remaining Time */}
            <div className="mt-10">
              <h2 className="text-[1.8rem] font-normal text-muted-foreground mb-2.5">Remaining OPT Time</h2>
              <p className="text-lg text-muted-foreground">
                You have a total of <span className="font-bold text-foreground">{Math.round(daysAvailable)}</span> days.
              </p>

              <div className="flex items-center flex-wrap gap-2.5 mt-4">
                <label className="text-muted-foreground">Select your OPT start date:</label>
                <input type="date" value={reqStartDate} onChange={(e) => setReqStartDate(e.target.value)} className="px-3 py-2.5 border border-border rounded bg-background text-foreground max-w-[200px]" />
              </div>

              {startDateError && <p className="text-destructive mt-2.5 font-bold">{startDateError}</p>}

              {calculatedEndDate && (
                <p className="text-lg mt-4 text-muted-foreground">
                  Your OPT end date will be <span className="font-bold text-foreground">{formatDate(calculatedEndDate)}</span>.
                </p>
              )}
            </div>

            {/* Summary — shows when all inputs are filled */}
            {calculatedEndDate && (
              <div className="mt-10 border-t border-border pt-10">
                <h2 className="text-[1.8rem] font-normal text-muted-foreground mb-5">Summary</h2>
                
                <table className="w-full border-collapse mb-8">
                  <tbody>
                    <tr>
                      <td className="p-3 border border-border font-bold text-muted-foreground w-[60%] bg-muted/50">Your I-20 Program end date</td>
                      <td className="p-3 border border-border text-foreground">{formatDate(PED)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border font-bold text-muted-foreground w-[60%] bg-muted/50">Earliest date to submit your application to the ISSO</td>
                      <td className="p-3 border border-border text-foreground">{formatDate(earliestApply)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border font-bold text-muted-foreground w-[60%] bg-muted/50">Earliest OPT start date you may request</td>
                      <td className="p-3 border border-border text-foreground">{formatDate(earliestStart)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border font-bold text-muted-foreground w-[60%] bg-muted/50">Latest OPT start date you may request</td>
                      <td className="p-3 border border-border text-foreground">{formatDate(latestStart)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border font-bold text-muted-foreground w-[60%] bg-muted/50">Your OPT end date</td>
                      <td className="p-3 border border-border text-foreground">{formatDate(calculatedEndDate)}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-lg text-muted-foreground">
                  You have <strong className="text-foreground">{Math.round(daysAvailable)} days</strong> left for your OPT.
                </p>

                <p className="text-sm text-muted-foreground mt-5">
                  APPLY AS EARLY AS POSSIBLE! Recently, USCIS has been taking 90-120 days to adjudicate OPT requests.
                </p>

                <button onClick={() => window.print()} className="px-4 py-2.5 bg-muted border border-border rounded text-foreground cursor-pointer mt-5 hover:bg-muted/80">Print</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default OPTCalculatorMainContent;
