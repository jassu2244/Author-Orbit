import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton.jsx";
import Book from "./Book.jsx";

function truncate(text, max = 260) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}\u2026` : clean;
}

export default function FeaturedSummary({ book, authorName, searchToken, loading, onReadMore }) {
  const [bookNarrative, setBookNarrative] = useState("");
  const [bookPhase, setBookPhase] = useState("closed");

  useEffect(() => {
    setBookNarrative("");
    setBookPhase("closed");
  }, [book?.key, searchToken]);

  if (loading && !book) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-8 w-52 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="mt-3 h-16 w-full rounded" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-sm">
        <h2 className="font-serif text-4xl leading-tight text-ink">No work featured</h2>
        <p className="mt-3 text-sm italic text-muted">Search for an author to surface their defining work.</p>
      </div>
    );
  }

  const summary = truncate(
    bookNarrative ||
      `A central piece in the catalog of ${authorName || "this author"} surfaced from Open Library's indexed editions and metadata.`,
  );

  return (
    <div className="max-w-sm space-y-6">
      <Book
        book={book}
        authorName={authorName}
        searchToken={searchToken}
        loading={loading}
        onSelect={onReadMore}
        onDescriptionChange={setBookNarrative}
        onPhaseChange={setBookPhase}
      />

      <h2 className="font-serif text-3xl leading-tight text-ink line-clamp-3">{book.title}</h2>
      {book.year && (
        <p className="text-sm font-medium text-ink">
          Published <span className="text-muted">{book.year}</span>
        </p>
      )}
      {bookPhase === "open" ? (
        <>
          <p className="text-sm leading-relaxed text-muted">{summary}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onReadMore}
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
        </>
      ) : (
        <p className="text-sm italic text-muted">
          {loading ? "Preparing featured book..." : "Opening the featured book..."}
        </p>
      )}
    </div>
  );
}
