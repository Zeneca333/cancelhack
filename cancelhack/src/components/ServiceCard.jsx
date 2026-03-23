'use client';

import Link from 'next/link';
import ServiceLogo from './ServiceLogo';
import ConfidenceBadge from './ConfidenceBadge';

export default function ServiceCard({ service }) {
  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.estimated_savings);

  return (
    <Link
      href={`/service/${service.slug}`}
      className="group block rounded-xl border border-ink-faint/20 bg-surface p-5 transition-all hover:border-accent/30 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <ServiceLogo domain={service.domain} name={service.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-mono text-sm font-bold text-ink group-hover:text-accent">
              {service.name}
            </h3>
            <ConfidenceBadge level={service.confidence} />
          </div>
          <p className="mt-0.5 text-xs capitalize text-ink-muted">
            {service.category}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">{service.retention_offer}</p>
      <p className="mt-2 font-mono text-lg font-bold text-accent">
        Save {formattedSavings}
      </p>
    </Link>
  );
}
