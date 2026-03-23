export default function Footer() {
  return (
    <footer className="w-full bg-cream mt-auto">
      <div className="max-w-content mx-auto w-full px-6 py-8 text-center text-sm text-ink-muted">
        &copy; {new Date().getFullYear()} Built by YoshiZen Co
      </div>
    </footer>
  );
}
