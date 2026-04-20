import { useEffect, useState } from 'react';

const AUTHORS_BASE = 'https://openlibrary.org/authors';
const AUTHOR_COVER = 'https://covers.openlibrary.org/a/olid';

function extractBio(bio) {
  if (!bio) return null;
  if (typeof bio === 'string') return bio;
  if (typeof bio === 'object' && typeof bio.value === 'string') return bio.value;
  return null;
}

export function useAuthorDetails(authorKey) {
  const [state, setState] = useState({ status: 'idle', data: null, error: null });

  useEffect(() => {
    if (!authorKey) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: null });

    fetch(`${AUTHORS_BASE}/${authorKey}.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Author fetch failed (${r.status})`);
        return r.json();
      })
      .then((json) => {
        setState({
          status: 'success',
          data: {
            name: json.name,
            bio: extractBio(json.bio),
            birthDate: json.birth_date ?? null,
            deathDate: json.death_date ?? null,
            photoUrl: `${AUTHOR_COVER}/${authorKey}-M.jpg`,
          },
          error: null,
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ status: 'error', data: null, error: err.message });
      });

    return () => controller.abort();
  }, [authorKey]);

  return state;
}
