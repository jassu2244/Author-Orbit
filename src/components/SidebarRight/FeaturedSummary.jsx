import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton.jsx";

function truncate(text, max = 260) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}\u2026` : clean;
}

export default function FeaturedSummary({
  book,
  authorName,
  searchToken,
  loading,
  onReadMore,
}) {
  if (loading && !book) {
    return (
      <div className="space-y-3">
        <Skeleton className="mr-auto h-[210px] w-[140px] rounded-sm" />
        <Skeleton className="h-8 w-52 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="mt-3 h-16 w-full rounded" />
      </div>
    );
  }

  if (!book && !loading) {
    return (
      <div className="max-w-sm">
        <h2 className="font-serif text-4xl leading-tight text-ink">No works available</h2>
        <p className="mt-3 text-sm italic text-muted">Try removing some filters.</p>
      </div>
    );
  }

  const summary = truncate(
    `A central piece in the catalog of ${authorName || "this author"} surfaced from Open Library's indexed editions and metadata.`
  );

  return (
    <div className="max-w-sm space-y-6">
      <div className="flex">
        <button
          onClick={() => onReadMore?.(book)}
          aria-label={`Open ${book.title}`}
          className="group relative aspect-[2/3] w-[140px] overflow-hidden rounded-sm bg-[#E9E3D3] shadow-[10px_20px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[12px_24px_36px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-3 text-center">
              <p className="font-serif text-xs italic text-muted line-clamp-4">{book.title}</p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={book.key}>
        <h2 className="font-serif text-3xl leading-tight text-ink line-clamp-3">{book.title}</h2>
        {book.year && (
          <p className="font-medium text-ink">
            Published <span className="text-muted">{book.year}</span>
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-muted">{summary}</p>
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => onReadMore?.(book)}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40">
            Read more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="font-serif text-xs italic text-muted">
            {"\u2014"} {authorName || "unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
