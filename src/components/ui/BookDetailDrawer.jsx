import { useEffect } from 'react';
import { useBookDetails } from '../../hooks/useBookDetails.js';
import BookmarkButton from './BookmarkButton.jsx';
import Skeleton from './Skeleton.jsx';

export default function BookDetailDrawer({ book, open, onClose, isBookmarked, onToggleBookmark }) {
  const { status, data, error } = useBookDetails(open && book ? book.key : null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={book?.title || 'Book details'}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Book detail</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!book ? (
            <p className="text-sm text-muted">No book selected.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-5">
                <div className="relative h-[180px] w-[120px] flex-shrink-0 overflow-hidden rounded-sm bg-[#E9E3D3] shadow-[10px_20px_30px_rgba(0,0,0,0.18)]">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-3 text-center">
                      <p className="font-serif text-xs italic text-muted line-clamp-5">{book.title}</p>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl leading-tight text-ink">{book.title}</h2>
                  {book.authors?.[0] && (
                    <p className="mt-1 text-sm text-muted">by {book.authors[0]}</p>
                  )}
                  <dl className="mt-4 space-y-1.5 text-xs">
                    {book.year && (
                      <div className="flex justify-between">
                        <dt className="text-muted">First published</dt>
                        <dd className="font-medium text-ink">{book.year}</dd>
                      </div>
                    )}
                    {book.editionCount > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-muted">Editions</dt>
                        <dd className="font-medium text-ink">{book.editionCount}</dd>
                      </div>
                    )}
                    {typeof book.ratingsAverage === 'number' && (
                      <div className="flex justify-between">
                        <dt className="text-muted">Avg. rating</dt>
                        <dd className="font-medium text-ink">{book.ratingsAverage.toFixed(1)} / 5</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              <div className="flex gap-3">
                <BookmarkButton saved={isBookmarked} onClick={onToggleBookmark} />
                <a
                  href={data?.openLibraryUrl || `https://openlibrary.org${book.key}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  View on Open Library
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <section>
                <h3 className="font-serif text-lg text-ink">Description</h3>
                <div className="mt-2">
                  {status === 'loading' && (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-3 w-11/12 rounded" />
                      <Skeleton className="h-3 w-10/12 rounded" />
                      <Skeleton className="h-3 w-9/12 rounded" />
                    </div>
                  )}
                  {status === 'error' && (
                    <p className="text-sm text-muted">Couldn't load description ({error}).</p>
                  )}
                  {status === 'success' &&
                    (data.description ? (
                      <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">
                        {data.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted">
                        No description available on Open Library for this work.
                      </p>
                    ))}
                </div>
              </section>

              {status === 'success' && data.subjects.length > 0 && (
                <section>
                  <h3 className="font-serif text-lg text-ink">Subjects</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {data.subjects.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-ink/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
