const inputClass = 'px-3 py-2.5 border border-border rounded bg-background text-foreground w-full max-w-[300px]';

export default function H1bGracePeriodCalculator() {
  return (
    <form className="mt-4 mb-6 max-w-xl rounded border border-border bg-card p-4 text-left text-foreground">
      <label className="block text-sm text-muted-foreground mb-1" htmlFor="grace-last-day">
        Last day of employment
      </label>
      <input id="grace-last-day" type="date" className={inputClass} />
      <label className="block text-sm text-muted-foreground mb-1 mt-3" htmlFor="grace-i94">
        I-94 expiration date
      </label>
      <input id="grace-i94" type="date" className={inputClass} />
      <p className="mt-3 text-sm text-muted-foreground mb-0">
        The grace period can be used once per authorized validity period. This is an estimate, not legal advice.
      </p>
    </form>
  );
}
