import BookmarkButton from '../ui/BookmarkButton.jsx';

export default function BookGrid({ books, isBookmarked, onToggleBookmark, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <article key={book.key} className="group flex flex-col">
          <button
            onClick={() => onSelect(book)}
            className="relative block aspect-[2/3] overflow-hidden rounded-sm bg-[#E9E3D3] text-left shadow-[10px_20px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[12px_24px_36px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label={`Open ${book.title}`}
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
                <p className="font-serif text-xs italic text-muted line-clamp-5">{book.title}</p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-ink">{book.title}</p>
              {book.year && <p className="text-xs italic text-muted">Published {book.year}</p>}
            </div>
            <BookmarkButton
              size="sm"
              saved={isBookmarked(book.key)}
              onClick={() => onToggleBookmark(book)}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
