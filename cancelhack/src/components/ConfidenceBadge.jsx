const config = {
  high: {
    label: 'Verified',
    classes: 'bg-emerald-100 text-emerald-800',
  },
  medium: {
    label: 'Likely',
    classes: 'bg-amber-100 text-amber-800',
  },
  low: {
    label: 'Reported',
    classes: 'bg-gray-100 text-gray-600',
  },
};

export default function ConfidenceBadge({ level }) {
  const { label, classes } = config[level] || config.low;

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
