import BookGrid from './BookGrid.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function BookmarksView({ bookmarks, isBookmarked, onToggleBookmark, onSelect, onClearAll, onGoHome }) {
  const count = bookmarks.length;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Bookmarks</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Saved for later</h1>
          <p className="mt-2 text-sm text-muted">
            {count === 0
              ? 'You haven\u2019t saved any works yet.'
              : `${count} ${count === 1 ? 'work' : 'works'} stored in this browser.`}
          </p>
        </div>
        {count > 0 && (
          <button
            onClick={onClearAll}
            className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Clear all
          </button>
        )}
      </header>

      {count === 0 ? (
        <EmptyState
          title="Your bookshelf is empty"
          description="Tap the bookmark icon on any book to keep a trail of what caught your eye."
          action={
            <button
              onClick={onGoHome}
              className="mt-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Explore works
            </button>
          }
        />
      ) : (
        <BookGrid
          books={bookmarks}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
