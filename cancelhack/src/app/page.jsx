export default function Home() {
  return (
    <div className="max-w-content mx-auto w-full px-6">
      <header className="flex items-center justify-between py-8">
        <div className="font-mono text-xl font-bold text-ink">
          cancelhack<span className="text-accent animate-blink">_</span>
        </div>
      </header>
      <main className="animate-fade-in">
        <h1 className="font-mono text-4xl font-bold tracking-tight">
          Cancel to save. Seriously.
        </h1>
      </main>
    </div>
  );
}
