export default function CancelSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <svg className="h-5 w-5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">
          How to unlock this discount
        </h2>
      </div>
      <div className="rounded-2xl border border-ink-faint/20 bg-surface overflow-hidden">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 px-5 py-3.5 ${
              i < steps.length - 1 ? 'border-b border-ink-faint/10' : ''
            } ${i === steps.length - 1 ? 'bg-accent/[0.03]' : ''}`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold mt-px ${
              i === steps.length - 1
                ? 'bg-accent text-white'
                : 'bg-ink-faint/10 text-ink-muted'
            }`}>
              {i + 1}
            </span>
            <p className="text-[13px] leading-snug text-ink">
              {step}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
