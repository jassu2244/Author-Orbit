import { useEffect, useRef } from 'react';

export default function HeaderSearch({ value, onChange, loading }) {
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === '/' && !typing) {
        e.preventDefault();
        ref.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5 flex-shrink-0 text-muted"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>

      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by author name..."
        aria-label="Search by author name"
        className="w-full bg-transparent text-sm text-ink placeholder-muted outline-none"
      />

      {loading ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 flex-shrink-0 animate-spin text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Loading"
        >
          <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
        </svg>
      ) : value ? (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <kbd className="hidden rounded border border-black/15 bg-white px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-block">
          /
        </kbd>
      )}
    </div>
  );
}
