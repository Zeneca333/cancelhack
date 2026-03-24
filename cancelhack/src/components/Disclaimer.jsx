export default function Disclaimer() {
  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-50/60 px-5 py-4 flex items-start gap-3">
      <svg
        className="h-5 w-5 text-amber-500 shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <p className="text-xs leading-relaxed text-amber-900/80">
        <span className="font-semibold">Heads up:</span> This info is researched
        by AI and not guaranteed to be accurate. Companies change their
        cancellation and retention processes at any time. There is always a risk
        that following these steps could result in your account being cancelled
        rather than receiving a discount. Proceed at your own discretion.
      </p>
    </div>
  );
}
