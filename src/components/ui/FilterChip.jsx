export default function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      {label}
      <button
        onClick={onClear}
        aria-label={`Clear filter: ${label}`}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
          <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}
