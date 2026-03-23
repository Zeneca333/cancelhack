export default function Hero({ totalSavings, serviceCount }) {
  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalSavings);

  return (
    <section className="py-12 md:py-16">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
        Stop overpaying for subscriptions
      </p>
      <h1 className="mt-3 font-mono text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        Cancel to save. Seriously.
      </h1>
      <p className="mt-4 max-w-lg text-lg text-ink-muted">
        Most subscription services offer discounts when you try to cancel.
        We track the best retention offers so you keep more of your money.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-6 py-4">
          <p className="font-mono text-2xl font-bold text-accent md:text-3xl">
            {formattedSavings}
          </p>
          <p className="mt-1 text-sm text-ink-muted">total potential savings</p>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-6 py-4">
          <p className="font-mono text-2xl font-bold text-accent md:text-3xl">
            {serviceCount}
          </p>
          <p className="mt-1 text-sm text-ink-muted">services tracked</p>
        </div>
      </div>
    </section>
  );
}
