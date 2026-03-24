'use client';

import { useState } from 'react';

export default function ServiceLogo({ domain, name, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  const sizeClasses = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm';

  if (failed) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-accent/10 font-semibold text-accent ${sizeClasses}`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={`${name} logo`}
      className={`rounded-xl object-cover ${sizeClasses}`}
      onError={() => setFailed(true)}
    />
  );
}
