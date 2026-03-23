'use client';

import { useState } from 'react';

export default function ServiceLogo({ domain, name }) {
  const [failed, setFailed] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (failed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${name} logo`}
      width={40}
      height={40}
      className="h-10 w-10 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
