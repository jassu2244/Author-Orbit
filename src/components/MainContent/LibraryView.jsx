import BookGrid from './BookGrid.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Skeleton from '../ui/Skeleton.jsx';

function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className="aspect-[2/3] rounded-sm" />
          <Skeleton className="mt-3 h-4 w-28 rounded" />
          <Skeleton className="mt-1.5 h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function LibraryView({ authorName, books, loading, isBookmarked, onToggleBookmark, onSelect }) {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Library</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">
          Full catalog of <span className="italic">{authorName || 'this author'}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Every indexed work we could find on Open Library, sorted by cover availability.
        </p>
      </header>

      {loading ? (
        <LibrarySkeleton />
      ) : books.length === 0 ? (
        <EmptyState
          title="No works in the library"
          description="Search for an author to populate their complete catalog."
        />
      ) : (
        <BookGrid
          books={books}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
