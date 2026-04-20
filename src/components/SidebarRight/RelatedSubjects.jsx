import Skeleton from '../ui/Skeleton.jsx';

const palette = ['#D95B54', '#6B7F5A', '#C08A4A', '#4A6B7F', '#8A4A7F'];

function initialsFor(subject) {
  return subject
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function RelatedSubjects({ subjects, loading, activeSubject, onSelectSubject }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink">Recurring Subjects</h3>
        {activeSubject && (
          <button
            onClick={() => onSelectSubject(null)}
            className="text-xs font-medium text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
            </div>
          ))
        ) : subjects.length === 0 ? (
          <p className="text-sm text-muted">No subjects indexed yet.</p>
        ) : (
          subjects.slice(0, 4).map((s, i) => {
            const isActive = s.name === activeSubject;
            return (
              <button
                key={s.name}
                onClick={() => onSelectSubject(isActive ? null : s.name)}
                aria-pressed={isActive}
                className={`flex w-full items-start gap-3 rounded-xl p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  isActive ? 'bg-accent/10' : 'hover:bg-black/5'
                }`}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: palette[i % palette.length] }}
                >
                  {initialsFor(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                  <p className="mt-0.5 text-xs italic text-muted">
                    Appears in {s.count} {s.count === 1 ? 'work' : 'works'}
                  </p>
                  {isActive && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                        <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Filtering active
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
