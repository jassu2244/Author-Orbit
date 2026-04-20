import { memo, startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useBookDetails } from "../../hooks/useBookDetails.js";
import "./Book.css";

const OPEN_DELAY_MS = 520;
const PAGE_FLIP_DURATION_MS = 3000;
const LAST_FLIP_DELAY_MS = 1250;
const OPEN_DURATION_MS = PAGE_FLIP_DURATION_MS + LAST_FLIP_DELAY_MS + 80;

const turningPages = [
  { id: 1, className: "book__page--turn-1" },
  { id: 2, className: "book__page--turn-2" },
  { id: 3, className: "book__page--turn-3" },
  { id: 4, className: "book__page--turn-4" },
  { id: 5, className: "book__page--turn-5" },
  { id: 6, className: "book__page--turn-6" },
];

const loaderWidths = ["92%", "88%", "79%", "84%", "72%", "76%", "62%"];

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

const BookVisual = memo(function BookVisual({
  className,
  coverStyle,
  displayAuthor,
  title,
  leftPageText,
  rightPageText,
  detailsLine,
  isTextReady,
}) {
  return (
    <div className={className}>
      <span className="book__closed-shell" style={coverStyle}>
        <span className="book__closed-author">{displayAuthor}</span>
        <span className="book__closed-title">{title}</span>
      </span>

      <span className="book__cover book__cover--back" />
      <span className="book__page book__page--base" />

      {turningPages.map((page) => (
        <span
          key={page.id}
          className={`book__page book__page--turn ${page.className} ${isTextReady ? "book__page--turn-ready" : "book__page--turn-loading"}`}>
          <span className="book__page-loader" aria-hidden={isTextReady}>
            <span className="book__page-loader-line book__page-loader-line--w1" />
            <span className="book__page-loader-line book__page-loader-line--w2" />
            <span className="book__page-loader-line book__page-loader-line--w3" />
            <span className="book__page-loader-line book__page-loader-line--w4" />
          </span>
        </span>
      ))}

      <span className="book__cover book__cover--front" style={coverStyle}>
        <span className="book__front-author">{displayAuthor}</span>
      </span>

      <div className="book__spread">
        <article className={`book__leaf book__leaf--left ${isTextReady ? "book__leaf--ready" : "book__leaf--loading"}`}>
          <div className="book__leaf-loader" aria-hidden={isTextReady}>
            {loaderWidths.map((width, i) => (
              <span key={i} className="book__leaf-loader-line" style={{ width }} />
            ))}
          </div>

          <div className="book__leaf-content" aria-hidden={!isTextReady}>
            <p className="book__leaf-title">{title || "Featured work"}</p>
            <p>{leftPageText}</p>
          </div>
        </article>

        <article
          className={`book__leaf book__leaf--right ${isTextReady ? "book__leaf--ready" : "book__leaf--loading"}`}>
          <div className="book__leaf-loader" aria-hidden={isTextReady}>
            {loaderWidths.map((width, i) => (
              <span key={i} className="book__leaf-loader-line" style={{ width }} />
            ))}
          </div>

          <div className="book__leaf-content" aria-hidden={!isTextReady}>
            <p>{rightPageText}</p>
            {detailsLine && <p className="book__leaf-meta">{detailsLine}</p>}
          </div>
        </article>
      </div>

      <span className="book__shadow" />
    </div>
  );
});

export default function Book({ book, authorName, loading, searchToken, onSelect, onDescriptionChange, onPhaseChange }) {
  const [phase, setPhase] = useState("closed");

  useEffect(() => {
    setPhase("closed");
  }, [searchToken, book?.key]);

  useEffect(() => {
    if (!searchToken?.trim() || loading || !book) return;

    let openRaf = 0;
    let settleRaf = 0;

    const openTimer = setTimeout(() => {
      openRaf = requestAnimationFrame(() => setPhase("opening"));
    }, OPEN_DELAY_MS);

    const settleTimer = setTimeout(() => {
      settleRaf = requestAnimationFrame(() => setPhase("open"));
    }, OPEN_DELAY_MS + OPEN_DURATION_MS);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(settleTimer);
      if (openRaf) cancelAnimationFrame(openRaf);
      if (settleRaf) cancelAnimationFrame(settleRaf);
    };
  }, [book?.key, loading, searchToken]);

  useEffect(() => {
    startTransition(() => {
      onPhaseChange?.(phase);
    });
  }, [phase, onPhaseChange]);

  const detailsKey = phase !== "closed" && book?.key ? book.key : null;
  const { status: detailsStatus, data: detailsData } = useBookDetails(detailsKey);
  const isPageTextStable = phase === "open" && detailsStatus !== "loading";

  const narrative = useMemo(() => {
    if (!isPageTextStable || !book) return "";

    const fromApi = normalizeText(detailsData?.description);
    if (fromApi) return fromApi;

    const author = authorName || book.authors?.[0] || "Unknown author";
    const year = book.year ? ` first published in ${book.year},` : "";

    return `${book.title},${year} is one of the highlighted works by ${author}. Explore this featured title and continue reading for editions, subjects, and related titles surfaced from Open Library metadata.`;
  }, [authorName, book?.authors, book?.title, book?.year, detailsData?.description, isPageTextStable]);

  useEffect(() => {
    const nextDescription = isPageTextStable ? narrative : "";
    startTransition(() => {
      onDescriptionChange?.(nextDescription);
    });
  }, [isPageTextStable, narrative, onDescriptionChange]);

  const deferredNarrative = useDeferredValue(narrative);
  const [leftPageText, rightPageText] = useMemo(
    () => (isPageTextStable ? splitAcrossPages(deferredNarrative) : ["", ""]),
    [deferredNarrative, isPageTextStable],
  );

  const displayAuthor = authorName || book?.authors?.[0] || "Unknown author";
  const detailsLine = useMemo(() => {
    if (!isPageTextStable) return "";

    return [book?.year && `Published ${book.year}`, detailsData?.subjects?.[0] && `Subject: ${detailsData.subjects[0]}`]
      .filter(Boolean)
      .join(" | ");
  }, [book?.year, detailsData?.subjects, isPageTextStable]);

  const coverStyle = useMemo(
    () =>
      book?.coverUrl
        ? {
            backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.05), rgba(0,0,0,0.34)), url(${book.coverUrl})`,
          }
        : undefined,
    [book?.coverUrl],
  );

  const clickable = Boolean(book && onSelect && !loading);
  const className = `book book--${phase} ${isPageTextStable ? "book--pages-ready" : "book--pages-pending"}`;
  const title = book?.title || "Search for an author";
  const isTextReady = isPageTextStable && Boolean(deferredNarrative);

  const bookMarkup = (
    <BookVisual
      className={className}
      coverStyle={coverStyle}
      displayAuthor={displayAuthor}
      title={title}
      leftPageText={leftPageText}
      rightPageText={rightPageText}
      detailsLine={detailsLine}
      isTextReady={isTextReady}
    />
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
