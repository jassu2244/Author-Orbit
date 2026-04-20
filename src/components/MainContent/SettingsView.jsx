export default function SettingsView({ bookmarkCount, lastQuery, onClearBookmarks }) {
  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Settings</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Preferences &amp; data</h1>
        <p className="mt-2 text-sm text-muted">
          Everything here is stored locally in your browser. Author Orbit never sends your data anywhere.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white/60 p-6">
        <h2 className="font-serif text-xl text-ink">Local data</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Bookmarks stored</dt>
            <dd className="font-medium text-ink">{bookmarkCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Last author searched</dt>
            <dd className="font-medium text-ink">{lastQuery || '\u2014'}</dd>
          </div>
        </dl>
        <button
          onClick={onClearBookmarks}
          disabled={bookmarkCount === 0}
          className="mt-6 rounded-full border border-accent/40 bg-accent/5 px-4 py-2 text-xs font-medium text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear all bookmarks
        </button>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white/60 p-6">
        <h2 className="font-serif text-xl text-ink">Data source</h2>
        <p className="mt-2 text-sm text-muted">
          All author and book information is served directly from the public{' '}
          <a
            href="https://openlibrary.org/developers/api"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent underline-offset-2 hover:underline"
          >
            Open Library API
          </a>
          . Cover images are delivered by{' '}
          <code className="rounded bg-black/5 px-1 py-0.5 text-[11px]">covers.openlibrary.org</code>.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white/60 p-6">
        <h2 className="font-serif text-xl text-ink">Keyboard shortcuts</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-muted">Focus search</span>
            <kbd className="rounded border border-black/15 bg-white px-2 py-0.5 font-mono text-[11px] text-ink">/</kbd>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted">Close drawer</span>
            <kbd className="rounded border border-black/15 bg-white px-2 py-0.5 font-mono text-[11px] text-ink">Esc</kbd>
          </li>
        </ul>
      </section>
    </div>
  );
}
