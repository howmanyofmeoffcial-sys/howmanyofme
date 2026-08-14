import { useEffect, useState } from "react";

/**
 * Auto-builds an A–Z jump bar by scanning the rendered article for `h2` elements
 * whose text starts with `<Letter> — ` (e.g. "A — Alaric"). Each `h2` gets an `id`
 * like `letter-a` so the jump links can scroll to it.
 *
 * This is presentation-only — it doesn't mutate article data.
 */
const AlphabetJumpNav = () => {
  const [available, setAvailable] = useState<Set<string>>(new Set());

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("article h2"));
    const found = new Set<string>();
    headings.forEach((h) => {
      const text = h.textContent?.trim() ?? "";
      const m = text.match(/^([A-Z])\s*[—–-]\s+/);
      if (m) {
        const letter = m[1].toLowerCase();
        const id = `letter-${letter}`;
        if (!h.id) h.id = id;
        found.add(letter);
      }
    });
    setAvailable(found);
  }, []);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <nav
      aria-label="Jump to letter"
      className="my-6 sticky top-2 z-20 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-sm"
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Jump to letter
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {letters.map((l) => {
          const enabled = available.has(l);
          return (
            <li key={l}>
              {enabled ? (
                <a
                  href={`#letter-${l}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-sm font-semibold uppercase text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  {l}
                </a>
              ) : (
                <span
                  aria-disabled
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/40 text-sm font-semibold uppercase text-muted-foreground/50 cursor-not-allowed"
                >
                  {l}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AlphabetJumpNav;
