'use client';

import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ServiceCard from './ServiceCard';

export default function ServiceGrid({ services }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === 'all' || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  return (
    <section className="pb-16">
      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-mono text-lg text-ink-muted">
            No services found.
          </p>
          <p className="mt-1 text-sm text-ink-faint">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  );
}
