export default function CancelSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section>
      <h2 className="font-mono text-lg font-bold text-ink">
        How to get this offer
      </h2>
      <ol className="mt-4 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
