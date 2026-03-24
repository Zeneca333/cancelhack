export default function Hero() {
  return (
    <section className="pt-8 pb-6 md:pt-12 md:pb-8 text-center">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        Pay less for the same subscriptions
      </p>
      <h1 className="mt-4 font-mono text-4xl font-bold leading-tight tracking-tight md:text-6xl">
        Get the discount.<br className="hidden sm:block" /> Keep the service.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-base text-ink-muted leading-relaxed">
        Most subscription services have hidden discounts you can unlock
        by starting the cancellation flow. We show you exactly how.
      </p>
      <p className="mt-6 font-mono text-sm text-ink-muted">
        no sign-up. no bs. just discounts.
      </p>
    </section>
  );
}
