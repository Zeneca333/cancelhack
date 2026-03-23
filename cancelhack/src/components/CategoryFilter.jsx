'use client';

const categories = [
  'all',
  'streaming',
  'software',
  'music',
  'fitness',
  'gaming',
  'news',
  'cloud',
  'other',
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              isActive
                ? 'bg-accent text-white'
                : 'border border-ink-faint/30 bg-surface text-ink-muted hover:border-accent hover:text-accent'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
