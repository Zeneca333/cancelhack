'use client';

function linkify(text) {
  // Match URLs (with or without protocol) and common domain patterns
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s,)]*)?)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const matchStart = match.index;

    // Add text before the match
    if (matchStart > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, matchStart) });
    }

    // Build the href — add protocol if missing
    const href = fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`;

    parts.push({ type: 'link', value: fullMatch, href });
    lastIndex = matchStart + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}

export default function SourceNotes({ text }) {
  if (!text) return null;

  const parts = linkify(text);

  return (
    <p className="font-mono text-[10px] leading-relaxed tracking-wide text-ink-faint">
      {parts.map((part, i) =>
        part.type === 'link' ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/60 underline decoration-accent/20 underline-offset-2 hover:text-accent hover:decoration-accent/40 transition-colors"
          >
            {part.value}
          </a>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  );
}
