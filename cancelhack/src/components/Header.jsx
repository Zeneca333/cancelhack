import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-cream">
      <div className="max-w-content mx-auto w-full px-6 flex items-center justify-between py-4">
        <Link href="/" className="font-mono text-xl font-bold text-ink">
          cancelhack<span className="text-accent animate-blink">_</span>
        </Link>
        <p className="text-[11px] text-ink-muted">
          built by{' '}
          <a href="https://yoshizen.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">yoshizen.co</a>
          {' / '}
          <a href="https://x.com/yoshizen" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">@yoshizen</a>
        </p>
      </div>
    </header>
  );
}
