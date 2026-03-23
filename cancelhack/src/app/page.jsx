import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import ServiceGrid from '@/components/ServiceGrid';

export const revalidate = 86400;

export default async function Home() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('estimated_savings', { ascending: false });

  const serviceList = services || [];
  const totalSavings = serviceList.reduce(
    (sum, s) => sum + (Number(s.estimated_savings) || 0),
    0
  );

  return (
    <div className="mx-auto w-full max-w-content px-6 animate-fade-in">
      <Hero totalSavings={totalSavings} serviceCount={serviceList.length} />
      <ServiceGrid services={serviceList} />
    </div>
  );
}
