import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-cream">
      <div className="max-w-content mx-auto w-full px-6 flex items-center justify-between py-8">
        <Link href="/" className="font-mono text-xl font-bold text-ink">
          cancelhack<span className="text-accent animate-blink">_</span>
        </Link>
      </div>
    </header>
  );
}
