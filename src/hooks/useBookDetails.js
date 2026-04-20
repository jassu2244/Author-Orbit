import { useEffect, useState } from 'react';

const OL_BASE = 'https://openlibrary.org';

function extractDescription(desc) {
  if (!desc) return null;
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object' && typeof desc.value === 'string') return desc.value;
  return null;
}

export function useBookDetails(workKey) {
  const [state, setState] = useState({ status: 'idle', data: null, error: null });

  useEffect(() => {
    if (!workKey) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: null });

    fetch(`${OL_BASE}${workKey}.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Work fetch failed (${r.status})`);
        return r.json();
      })
      .then((json) => {
        setState({
          status: 'success',
          data: {
            title: json.title,
            description: extractDescription(json.description),
            subjects: Array.isArray(json.subjects) ? json.subjects.slice(0, 12) : [],
            subjectPlaces: Array.isArray(json.subject_places) ? json.subject_places.slice(0, 6) : [],
            firstPublishDate: json.first_publish_date ?? null,
            openLibraryUrl: `${OL_BASE}${workKey}`,
          },
          error: null,
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ status: 'error', data: null, error: err.message });
      });

    return () => controller.abort();
  }, [workKey]);

  return state;
}
