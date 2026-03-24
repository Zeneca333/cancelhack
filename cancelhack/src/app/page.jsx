import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import ServiceGrid from '@/components/ServiceGrid';
import Disclaimer from '@/components/Disclaimer';

export const revalidate = 86400;

export default async function Home() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('estimated_savings', { ascending: false });

  const serviceList = services || [];

  // Popular services people are most likely to have — pick 3 at random
  const popularSlugs = [
    'netflix', 'hulu', 'disney-plus', 'hbo-max', 'spotify',
    'amazon-prime', 'adobe-creative-cloud',
    'doordash-dashpass', 'uber-one', 'peacock', 'paramount-plus',
    'chatgpt-plus', 'audible', 'instacart-plus', 'apple-tv-plus',
    'grubhub-plus', 'walmart-plus',
  ];
  const popularPool = serviceList.filter((s) => popularSlugs.includes(s.slug));
  // Shuffle and take 3
  const shuffled = popularPool.sort(() => Math.random() - 0.5);
  const featured = shuffled.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-content px-6 animate-fade-in">
      <Hero />
      <Disclaimer />
      <FeaturedServices services={featured} />
      <ServiceGrid services={serviceList} />
    </div>
  );
}
