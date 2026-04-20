import { useRef } from 'react';
import Skeleton from '../ui/Skeleton.jsx';

export default function AuthorTimeline({ years, loading, activeYear, onSelectYear }) {
  const scrollRef = useRef(null);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink">Publication Timeline</h3>
        <div className="flex gap-1">
          <button
            aria-label="Scroll timeline left"
            onClick={() => scrollBy(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Scroll timeline right"
            onClick={() => scrollBy(1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-14 rounded-full" />
          ))}
        </div>
      ) : years.length === 0 ? (
        <p className="text-sm text-muted">No publication data yet.</p>
      ) : (
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {years.map((y) => {
            const isActive = y === activeYear;
            return (
              <button
                key={y}
                onClick={() => onSelectYear(y)}
                aria-pressed={isActive}
                title={`Filter by ${y}`}
                className={`flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  isActive
                    ? 'bg-accent/15 ring-1 ring-accent/30'
                    : 'hover:bg-black/5'
                }`}
              >
                <span className="text-[11px] uppercase tracking-wide text-muted">Yr</span>
                <span className={`font-serif text-lg ${isActive ? 'text-accent' : 'text-ink'}`}>
                  {String(y).slice(-2)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
