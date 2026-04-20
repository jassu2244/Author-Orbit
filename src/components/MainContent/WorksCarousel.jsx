import { useRef } from 'react';
import Skeleton from '../ui/Skeleton.jsx';
import BookmarkButton from '../ui/BookmarkButton.jsx';

function BookCard({ book, isBookmarked, onToggleBookmark, onSelect }) {
  return (
    <article className="group flex w-[140px] flex-shrink-0 flex-col">
      <button
        onClick={() => onSelect(book)}
        aria-label={`Open ${book.title}`}
        className="relative aspect-[2/3] overflow-hidden rounded-sm bg-[#E9E3D3] shadow-[10px_20px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[12px_24px_36px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-3 text-center">
            <p className="font-serif text-xs italic text-muted line-clamp-4">{book.title}</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-ink">{book.title}</p>
          {book.year && <p className="text-xs italic text-muted">Published {book.year}</p>}
        </div>
        <BookmarkButton size="sm" saved={isBookmarked(book.key)} onClick={() => onToggleBookmark(book)} />
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="flex w-[140px] flex-shrink-0 flex-col">
      <Skeleton className="aspect-[2/3] rounded-sm" />
      <Skeleton className="mt-3 h-4 w-28 rounded" />
      <Skeleton className="mt-1.5 h-3 w-20 rounded" />
    </div>
  );
}

export default function WorksCarousel({
  books,
  loading,
  title = 'Popular Works',
  isBookmarked,
  onToggleBookmark,
  onSelect,
  filterChip,
}) {
  const scrollRef = useRef(null);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          {filterChip}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : books.length === 0 ? (
          <p className="text-sm italic text-muted">No works match the current filter.</p>
        ) : (
          books.slice(0, 12).map((b) => (
            <BookCard
              key={b.key}
              book={b}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
