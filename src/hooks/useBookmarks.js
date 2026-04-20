import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

const KEY = 'author-orbit:bookmarks';

export function useBookmarks() {
  const [items, setItems] = useLocalStorage(KEY, []);

  const keys = useMemo(() => new Set(items.map((b) => b.key)), [items]);

  const has = useCallback((key) => keys.has(key), [keys]);

  const add = useCallback(
    (book) => {
      setItems((prev) => {
        if (prev.some((p) => p.key === book.key)) return prev;
        return [{ ...book, savedAt: Date.now() }, ...prev];
      });
    },
    [setItems]
  );

  const remove = useCallback(
    (key) => {
      setItems((prev) => prev.filter((p) => p.key !== key));
    },
    [setItems]
  );

  const toggle = useCallback(
    (book) => {
      setItems((prev) => {
        if (prev.some((p) => p.key === book.key)) {
          return prev.filter((p) => p.key !== book.key);
        }
        return [{ ...book, savedAt: Date.now() }, ...prev];
      });
    },
    [setItems]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  return { items, has, add, remove, toggle, clear };
}
