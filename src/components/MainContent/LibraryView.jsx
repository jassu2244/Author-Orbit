import BookGrid from './BookGrid.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Skeleton from '../ui/Skeleton.jsx';

function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <Skeleton className="mt-4 h-4 w-3/4 rounded" />
          <Skeleton className="mt-2 h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function LibraryView({ authorName, books, loading, isBookmarked, onToggleBookmark, onSelect }) {
  return (
    <div className="animate-in fade-in flex flex-col space-y-12 pb-16 duration-500">
      <header className="relative border-b border-black/10 pb-10 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Complete Library</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.1] text-ink lg:text-6xl">
          The collected works of <br />
          <span className="italic text-ink/80">{authorName || 'this author'}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Explore the exhaustive catalog of publications, editions, and defining works curated from Open Library data, sorted by visual availability.
        </p>
        
        {!loading && books.length > 0 && (
          <div className="absolute -bottom-3 right-4 bg-canvas px-4 font-serif text-sm italic text-muted">
            <span className="font-semibold text-ink">{books.length}</span> works available
          </div>
        )}
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
