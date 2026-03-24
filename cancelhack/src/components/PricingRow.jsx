export default function PricingRow({ normalPrice, retentionOffer, estimatedSavings }) {
  const savings = Number(estimatedSavings) || 0;

  return (
    <div className="rounded-2xl border border-ink-faint/20 bg-surface overflow-hidden">
      <div className="grid grid-cols-1 divide-y divide-ink-faint/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            Normal Price
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {normalPrice}
          </p>
        </div>

        <div className="px-6 py-5 bg-accent/[0.03]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Retention Offer
          </p>
          <p className="mt-2 text-lg font-semibold text-accent">
            {retentionOffer}
          </p>
        </div>

        <div className="px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            You Save
          </p>
          <p className="mt-2 text-lg font-semibold text-accent">
            {savings > 0 ? (
              <><span className="font-mono text-2xl">${savings}</span><span className="text-sm text-ink-muted font-normal"> /yr</span></>
            ) : (
              <span className="text-ink-muted">Varies</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
