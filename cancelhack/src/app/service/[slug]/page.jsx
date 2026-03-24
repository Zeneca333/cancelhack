import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ServiceLogo from '@/components/ServiceLogo';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import CancelSteps from '@/components/CancelSteps';
import ProTip from '@/components/ProTip';
import SourceNotes from '@/components/SourceNotes';
import Disclaimer from '@/components/Disclaimer';

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

  return {
    title: `${service.name} hidden discount — cancelhack_`,
    description: `Get a discount on ${service.name}: "${service.retention_offer}" — step-by-step guide to unlock it.`,
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

  const savings = Number(service.estimated_savings) || 0;
  const lastVerified = service.last_verified
    ? new Date(service.last_verified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <div className="max-w-content mx-auto px-6 animate-fade-in">
      <div className="pb-20 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
        >
          &larr; All services
        </Link>

        {/* ---- HERO BANNER ---- */}
        <div className="mt-8 relative rounded-2xl bg-surface border border-ink-faint/20 overflow-hidden">
          {/* Decorative accent strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

          <div className="p-8 md:p-10 pt-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: identity */}
              <div className="flex items-center gap-5">
                <ServiceLogo domain={service.domain} name={service.name} size="lg" />
                <div>
                  <h1 className="font-mono text-2xl font-bold text-ink md:text-3xl">
                    {service.name}
                  </h1>
                  <div className="mt-2">
                    <ConfidenceBadge level={service.confidence} size="lg" />
                  </div>
                  <p className="mt-1.5 text-sm capitalize text-ink-muted">
                    {service.category}
                  </p>
                </div>
              </div>

              {/* Right: savings */}
              {savings > 0 && (
                <div className="flex items-baseline gap-1 md:text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Save</span>
                  <span className="font-mono text-5xl font-bold text-accent md:text-6xl">${savings}</span>
                  <span className="text-sm text-ink-muted">/yr</span>
                </div>
              )}
            </div>

            {/* Offer highlight */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-start gap-3 rounded-xl bg-cream px-5 py-4">
                <svg className="h-5 w-5 text-ink-faint shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Regular price</p>
                  <p className="mt-1 text-sm text-ink">{service.normal_price}</p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-3 rounded-xl bg-accent/[0.06] px-5 py-4">
                <svg className="h-5 w-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Discount you can get</p>
                  <p className="mt-1 text-sm font-medium text-accent">{service.retention_offer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- DISCLAIMER ---- */}
        <div className="mt-8">
          <Disclaimer />
        </div>

        {/* ---- CONTENT GRID ---- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Steps: takes 3/5 */}
          <div className="lg:col-span-3">
            <CancelSteps steps={service.cancel_steps} />
          </div>

          {/* Sidebar: takes 2/5 */}
          <div className="lg:col-span-2 space-y-6">
            <ProTip tip={service.tips} />
          </div>
        </div>

        {/* ---- SOURCES ---- */}
        {service.source_notes && (
          <div className="mt-12 border-t border-ink-faint/15 pt-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Sources
              </p>
            </div>
            <SourceNotes text={service.source_notes} />
          </div>
        )}
      </div>
    </div>
  );
}
