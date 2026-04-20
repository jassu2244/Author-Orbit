export default function AuthorGreeting({ authorName, totalBooks, yearRange, onStartReading, disabled }) {
  const display = authorName || '\u2014';
  const range =
    yearRange && yearRange[0] && yearRange[1]
      ? yearRange[0] === yearRange[1]
        ? `Active in ${yearRange[0]}`
        : `Active ${yearRange[0]}\u2013${yearRange[1]}`
      : null;

  const blurb =
    totalBooks > 0
      ? `We found ${totalBooks}+ works orbiting this author. Step into their catalog, explore recurring themes, and trace the arc of their publishing years.`
      : 'Search for an author above to begin exploring their works, recurring themes, and publishing history across decades.';

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">
        Exploring the works of,
        <br />
        <span className="italic">{display}</span>
      </h1>
      {range && <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">{range}</p>}
      <p className="mt-5 text-sm leading-relaxed text-muted">{blurb}</p>
      <button
        onClick={onStartReading}
        disabled={disabled}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Start reading
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
