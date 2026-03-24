'use client';

import Link from 'next/link';
import ServiceLogo from './ServiceLogo';

export default function FeaturedServices({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="pb-10">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-6 text-center">
        Popular discounts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/service/${service.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <ServiceLogo domain={service.domain} name={service.name} size="lg" />
              <div>
                <h3 className="font-mono text-base font-bold text-ink group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-ink-muted capitalize">{service.category}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed line-clamp-2">
              {service.retention_offer}
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-accent">
                ${Number(service.estimated_savings).toFixed(0)}
              </span>
              <span className="text-xs text-ink-muted">/yr saved</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
