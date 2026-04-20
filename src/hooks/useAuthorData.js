import { useEffect, useState } from 'react';

const OPEN_LIBRARY_SEARCH = 'https://openlibrary.org/search.json';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';

function coverUrl(coverId, size = 'L') {
  return coverId ? `${COVER_BASE}/${coverId}-${size}.jpg` : null;
}

function normalizeDocs(docs, authorQuery) {
  const books = docs
    .filter((d) => d.title && d.key)
    .map((d) => ({
      key: d.key,
      title: d.title,
      year: d.first_publish_year ?? null,
      coverUrl: coverUrl(d.cover_i, 'L'),
      coverMedium: coverUrl(d.cover_i, 'M'),
      authors: d.author_name ?? [],
      editionCount: d.edition_count ?? 0,
      ratingsAverage: d.ratings_average ?? null,
      subjects: (d.subject ?? []).slice(0, 5),
    }))
    .sort((a, b) => {
      const coverScore = (b.coverUrl ? 1 : 0) - (a.coverUrl ? 1 : 0);
      if (coverScore !== 0) return coverScore;
      return (b.editionCount ?? 0) - (a.editionCount ?? 0);
    });

  const years = [
    ...new Set(
      docs.map((d) => d.first_publish_year).filter((y) => typeof y === 'number')
    ),
  ].sort((a, b) => a - b);

  const subjectCounts = new Map();
  for (const d of docs) {
    for (const s of d.subject ?? []) {
      subjectCounts.set(s, (subjectCounts.get(s) ?? 0) + 1);
    }
  }
  const subjects = [...subjectCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const firstDocWithKey = docs.find((d) => Array.isArray(d.author_key) && d.author_key[0]);
  const authorKey = firstDocWithKey?.author_key?.[0] ?? null;
  const resolvedName = books[0]?.authors?.[0] ?? authorQuery;

  return {
    authorName: resolvedName,
    authorKey,
    totalBooks: docs.length,
    books,
    years,
    subjects,
  };
}

export function useAuthorData(authorName) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    const trimmed = (authorName || '').trim();
    if (!trimmed) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }

    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading', error: null }));

    const url = `${OPEN_LIBRARY_SEARCH}?author=${encodeURIComponent(
      trimmed
    )}&limit=30`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((json) => {
        const data = normalizeDocs(json.docs ?? [], trimmed);
        setState({ status: 'success', data, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({
          status: 'error',
          data: null,
          error: err.message ?? 'Unknown error',
        });
      });

    return () => controller.abort();
  }, [authorName]);

  return state;
}

export { OPEN_LIBRARY_SEARCH };
