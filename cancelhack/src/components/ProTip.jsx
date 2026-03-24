'use client';

function parseTips(text) {
  if (!text) return [];

  // Try splitting on numbered patterns like (1), (2) or 1., 2.
  const numbered = text.split(/(?:\(?\d+\)[\s:]|\d+\.\s)/).filter(Boolean);
  if (numbered.length >= 3) {
    return numbered.map((t) => t.replace(/^[;,.\s]+|[;,.\s]+$/g, '').trim()).filter((t) => t.length > 10);
  }

  // Try splitting on semicolons
  const bySemicolon = text.split(/;\s*/);
  if (bySemicolon.length >= 3) {
    return bySemicolon.map((t) => t.replace(/^[;,.\s]+|[;,.\s]+$/g, '').trim()).filter((t) => t.length > 10);
  }

  // Try splitting on sentence boundaries, take first 3 meaningful ones
  const sentences = text.split(/\.\s+/).filter((s) => s.length > 15);
  if (sentences.length >= 2) {
    return sentences.slice(0, 4).map((s) => s.replace(/\.$/, '').trim());
  }

  return [text];
}

const tipIcons = [
  // Lightbulb
  <svg key="0" className="h-4 w-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>,
  // Chat bubble
  <svg key="1" className="h-4 w-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  // Clock
  <svg key="2" className="h-4 w-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  // Star
  <svg key="3" className="h-4 w-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" /></svg>,
];

export default function ProTip({ tip }) {
  if (!tip) return null;

  const tips = parseTips(tip);
  const visibleTips = tips;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
          Insider Tips
        </h2>
      </div>
      <div className="rounded-2xl border border-accent/15 bg-accent/[0.04] px-5 py-2">
        {visibleTips.map((t, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-3 ${
              i < visibleTips.length - 1 ? 'border-b border-accent/10' : ''
            }`}
          >
            {tipIcons[i % tipIcons.length]}
            <p className="text-[13px] leading-relaxed text-ink-muted">{t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
