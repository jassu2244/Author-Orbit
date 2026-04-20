import { useEffect, useMemo, useState } from "react";
import { useBookDetails } from "../../hooks/useBookDetails.js";
import "./Book.css";

const OPEN_DELAY_MS = 520;
const OPEN_DURATION_MS = 3000;

const turningPages = [
  { id: 1, className: "book__page--turn-1" },
  { id: 2, className: "book__page--turn-2" },
  { id: 3, className: "book__page--turn-3" },
  { id: 4, className: "book__page--turn-4" },
  { id: 5, className: "book__page--turn-5" },
  { id: 6, className: "book__page--turn-6" },
];

function normalizeText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function splitAcrossPages(text) {
  const clean = normalizeText(text);
  if (!clean) {
    return [
      "No excerpt is available for this featured work yet.",
      "Run a new search to load another title and preview it here.",
    ];
  }

  const words = clean.split(" ");
  const splitAt = Math.max(15, Math.ceil(words.length * 0.54));
  const left = words.slice(0, splitAt).join(" ");
  const right = words.slice(splitAt).join(" ");

  return [left, right || "Open Library does not provide additional text for this work."];
}

export default function Book({ book, authorName, loading, searchToken, onSelect, onDescriptionChange, onPhaseChange }) {
  const [phase, setPhase] = useState("closed");

  useEffect(() => {
    setPhase("closed");
  }, [searchToken, book?.key]);

  useEffect(() => {
    if (!searchToken?.trim() || loading || !book) return;

    const openTimer = setTimeout(() => setPhase("opening"), OPEN_DELAY_MS);
    const settleTimer = setTimeout(() => setPhase("open"), OPEN_DELAY_MS + OPEN_DURATION_MS);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(settleTimer);
    };
  }, [book?.key, loading, searchToken]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const detailsKey = phase === "open" && book?.key ? book.key : null;
  const { status: detailsStatus, data: detailsData } = useBookDetails(detailsKey);

  const narrative = useMemo(() => {
    if (!book || phase !== "open") return "";

    const fromApi = normalizeText(detailsData?.description);
    if (fromApi) return fromApi;

    if (detailsStatus === "loading") {
      return "Fetching the book description from Open Library...";
    }

    const author = authorName || book.authors?.[0] || "Unknown author";
    const year = book.year ? ` first published in ${book.year},` : "";

    return `${book.title},${year} is one of the highlighted works by ${author}. Explore this featured title and continue reading for editions, subjects, and related titles surfaced from Open Library metadata.`;
  }, [authorName, book, detailsData?.description, detailsStatus, phase]);

  useEffect(() => {
    if (phase !== "open") {
      onDescriptionChange?.("");
      return;
    }

    onDescriptionChange?.(narrative);
  }, [phase, narrative, onDescriptionChange]);

  const [leftPageText, rightPageText] = useMemo(() => splitAcrossPages(narrative), [narrative]);

  const displayAuthor = authorName || book?.authors?.[0] || "Unknown author";
  const detailsLine = [
    book?.year && `Published ${book.year}`,
    detailsData?.subjects?.[0] && `Subject: ${detailsData.subjects[0]}`,
    detailsStatus === "loading" && "Loading excerpt...",
  ]
    .filter(Boolean)
    .join(" | ");

  const coverStyle = book?.coverUrl
    ? {
        backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.05), rgba(0,0,0,0.34)), url(${book.coverUrl})`,
      }
    : undefined;

  const clickable = Boolean(book && onSelect && !loading);
  const className = `book book--${phase}`;

  const bookMarkup = (
    <div className={className}>
      <span className="book__closed-shell" style={coverStyle}>
        <span className="book__closed-author">{displayAuthor}</span>
        <span className="book__closed-title">{book?.title || "Search for an author"}</span>
      </span>

      <span className="book__cover book__cover--back" />
      <span className="book__page book__page--base" />

      {turningPages.map((page) => (
        <span key={page.id} className={`book__page book__page--turn ${page.className}`} />
      ))}

      <span className="book__cover book__cover--front" style={coverStyle}>
        <span className="book__front-author">{displayAuthor}</span>
      </span>

      <div className="book__spread">
        <article className="book__leaf book__leaf--left">
          <p className="book__leaf-title">{book?.title || "Featured work"}</p>
          <p>{leftPageText}</p>
        </article>

        <article className="book__leaf book__leaf--right">
          <p>{rightPageText}</p>
          {detailsLine && <p className="book__leaf-meta">{detailsLine}</p>}
        </article>
      </div>

      <span className="book__shadow" />
    </div>
  );

  return (
    <div className="book-slot">
      {clickable ? (
        <button
          type="button"
          onClick={() => onSelect(book)}
          className="book-slot__button"
          aria-label={`Open ${book.title}`}>
          {bookMarkup}
        </button>
      ) : (
        <div className="book-slot__static">{bookMarkup}</div>
      )}
    </div>
  );
}
