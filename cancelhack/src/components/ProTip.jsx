export default function ProTip({ tip }) {
  if (!tip) return null;

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">
        Pro tip
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        {tip}
      </p>
    </div>
  );
}
