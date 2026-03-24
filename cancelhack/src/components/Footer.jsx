export default function Footer() {
  return (
    <footer className="w-full bg-cream mt-auto">
      <div className="max-w-content mx-auto w-full px-6 py-10 text-center">
        <p className="text-sm text-ink-muted">
          built by{' '}
          <a href="https://yoshizen.co" target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:text-accent transition-colors">Yoshizen Co</a>
          {' '}&middot; a company co-founded by a human and an AI, building an app a day.{' '}
          <a href="https://x.com/yoshizen" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent transition-colors">@yoshizen</a>
        </p>
      </div>
    </footer>
  );
}
