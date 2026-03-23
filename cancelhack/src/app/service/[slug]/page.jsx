import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ServiceLogo from '@/components/ServiceLogo';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import PricingRow from '@/components/PricingRow';
import CancelSteps from '@/components/CancelSteps';
import ProTip from '@/components/ProTip';

export const revalidate = 86400;

export async function generateStaticParams() {
  const { data } = await supabase.from('services').select('slug');
  return (data || []).map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: service } = await supabase
    .from('services')
    .select('name, retention_offer, estimated_savings')
    .eq('slug', slug)
    .single();

  if (!service) {
    return { title: 'Service not found — cancelhack_' };
  }

  const savings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.estimated_savings);

  return {
    title: `${service.name} retention offer — cancelhack_`,
    description: `${service.name} offers "${service.retention_offer}" when you try to cancel. Save ${savings}/yr.`,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!service) {
    notFound();
  }

  const lastVerified = service.last_verified
    ? new Date(service.last_verified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="max-w-content mx-auto px-6 animate-fade-in">
      <div className="pb-16 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-accent"
        >
          &larr; Back to homepage
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <ServiceLogo domain={service.domain} name={service.name} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold text-ink">
                {service.name}
              </h1>
              <ConfidenceBadge level={service.confidence} />
            </div>
            <p className="mt-0.5 text-sm capitalize text-ink-muted">
              {service.category}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <PricingRow
            normalPrice={service.normal_price}
            retentionOffer={service.retention_offer}
            estimatedSavings={service.estimated_savings}
          />
        </div>

        <div className="mt-10">
          <CancelSteps steps={service.cancel_steps} />
        </div>

        <div className="mt-8">
          <ProTip tip={service.tips} />
        </div>

        {(lastVerified || service.source_notes) && (
          <footer className="mt-10 border-t border-ink-faint/20 pt-6">
            {lastVerified && (
              <p className="text-xs text-ink-faint">
                Last verified: {lastVerified}
              </p>
            )}
            {service.source_notes && (
              <p className="mt-1 text-xs text-ink-faint">
                Source: {service.source_notes}
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
