import { useMemo, useState } from 'react';
import { H1B_GRACE_PERIOD_MAX_DAYS } from '@/data/program';
import { gracePeriodEnd } from '@/lib/h1bGracePeriodDates.mjs';

const inputClass = 'px-3 py-2.5 border border-border rounded bg-background text-foreground w-full max-w-[300px]';

export default function H1bGracePeriodCalculator() {
  const [lastDay, setLastDay] = useState('');
  const [i94Date, setI94Date] = useState('');
  const result = useMemo(
    () => (lastDay && i94Date ? gracePeriodEnd(lastDay, i94Date, H1B_GRACE_PERIOD_MAX_DAYS) : null),
    [lastDay, i94Date],
  );

  return (
    <form
      className="mt-4 mb-6 max-w-xl rounded border border-border bg-card p-4 text-left text-foreground"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="block text-sm text-muted-foreground mb-1" htmlFor="grace-last-day">
        Last day of employment
      </label>
      <input
        id="grace-last-day"
        type="date"
        value={lastDay}
        onChange={(event) => setLastDay(event.target.value)}
        className={inputClass}
      />
      <label className="block text-sm text-muted-foreground mb-1 mt-3" htmlFor="grace-i94">
        I-94 expiration date
      </label>
      <input
        id="grace-i94"
        type="date"
        value={i94Date}
        onChange={(event) => setI94Date(event.target.value)}
        className={inputClass}
      />
      {result && <p className="mt-3 text-sm text-foreground mb-0">{result.sentence}</p>}
      <p className="mt-3 text-sm text-muted-foreground mb-0">
        The grace period can be used once per authorized validity period. This is an estimate, not legal advice.
      </p>
    </form>
  );
}
