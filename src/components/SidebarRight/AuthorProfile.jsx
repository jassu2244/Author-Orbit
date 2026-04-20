import { useState } from 'react';

export default function AuthorProfile({ authorName, photoUrl, onOpenBookmarks, bookmarkCount = 0 }) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = (authorName || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const showPhoto = photoUrl && !imgFailed;

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-medium text-white ring-2 ring-white">
          {showPhoto ? (
            <img
              src={photoUrl}
              alt={authorName}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
      </div>
      <span className="max-w-[180px] truncate text-sm font-medium text-ink" title={authorName}>
        {authorName || 'No author'}
      </span>
      <button
        onClick={onOpenBookmarks}
        aria-label={`Bookmarks (${bookmarkCount})`}
        title="Bookmarks"
        className="relative ml-2 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
        {bookmarkCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
            {bookmarkCount > 9 ? '9+' : bookmarkCount}
          </span>
        )}
      </button>
    </div>
  );
}
