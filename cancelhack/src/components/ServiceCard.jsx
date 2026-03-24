'use client';

import Link from 'next/link';
import ServiceLogo from './ServiceLogo';
import ConfidenceBadge from './ConfidenceBadge';

export default function ServiceCard({ service }) {
  return (
    <Link
      href={`/service/${service.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-ink-faint/20 bg-surface p-4 transition-all hover:border-accent/30 hover:shadow-md"
    >
      <ServiceLogo domain={service.domain} name={service.name} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-mono text-sm font-bold text-ink group-hover:text-accent transition-colors">
          {service.name}
        </h3>
        <ConfidenceBadge level={service.confidence} />
        <p className="mt-0.5 text-xs text-ink-muted line-clamp-1">
          {service.retention_offer}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-mono text-base font-bold text-accent">
          ${Number(service.estimated_savings).toFixed(0)}
        </p>
        <p className="text-[10px] text-ink-muted">/yr</p>
      </div>
    </Link>
  );
}
