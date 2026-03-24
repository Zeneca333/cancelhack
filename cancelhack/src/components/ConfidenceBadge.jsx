const config = {
  high: {
    label: 'Very likely to work',
    fill: 'w-full',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
  },
  medium: {
    label: 'Likely to work',
    fill: 'w-2/3',
    barColor: 'bg-amber-400',
    textColor: 'text-amber-700',
  },
  low: {
    label: 'May vary',
    fill: 'w-1/3',
    barColor: 'bg-ink-faint/50',
    textColor: 'text-ink-muted',
  },
};

export default function ConfidenceBadge({ level, size = 'sm' }) {
  const { label, fill, barColor, textColor } = config[level] || config.low;

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-1.5 rounded-full bg-ink-faint/15 overflow-hidden">
          <div className={`h-full rounded-full ${barColor} ${fill}`} />
        </div>
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1 rounded-full bg-ink-faint/15 overflow-hidden">
        <div className={`h-full rounded-full ${barColor} ${fill}`} />
      </div>
      <span className={`text-[10px] font-medium ${textColor}`}>{label}</span>
    </div>
  );
}
