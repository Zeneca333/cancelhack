export default function PricingRow({ normalPrice, retentionOffer, estimatedSavings }) {
  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(estimatedSavings);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-ink-faint/20 bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Normal Price
        </p>
        <p className="mt-2 font-mono text-xl font-bold text-ink">
          {normalPrice}
        </p>
      </div>

      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          Retention Offer
        </p>
        <p className="mt-2 font-mono text-xl font-bold text-accent">
          {retentionOffer}
        </p>
      </div>

      <div className="rounded-xl border border-ink-faint/20 bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          You Save
        </p>
        <p className="mt-2 font-mono text-xl font-bold text-accent">
          {formattedSavings}
        </p>
      </div>
    </div>
  );
}
