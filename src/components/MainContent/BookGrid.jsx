import BookmarkButton from '../ui/BookmarkButton.jsx';

export default function BookGrid({ books, isBookmarked, onToggleBookmark, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book, idx) => (
        <article 
          key={book.key} 
          className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700"
          style={{ animationDelay: `${Math.min(idx * 40, 600)}ms`, animationFillMode: 'both' }}
        >
          <button
            onClick={() => onSelect(book)}
            className="relative block aspect-[2/3] w-full overflow-hidden rounded bg-[#E9E3D3] text-left shadow-[0_8px_20px_rgba(0,0,0,0.08)] ring-offset-4 ring-offset-canvas transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open ${book.title}`}
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-4 text-center">
                <p className="font-serif text-sm italic text-muted/80 line-clamp-5">{book.title}</p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0 pr-2">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink/90 transition-colors group-hover:text-accent">
                {book.title}
              </p>
              {book.year && <p className="mt-1 text-xs italic text-muted">Published {book.year}</p>}
            </div>
            <div className="shrink-0 pt-0.5">
              <BookmarkButton
                size="sm"
                saved={isBookmarked(book.key)}
                onClick={() => onToggleBookmark(book)}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
