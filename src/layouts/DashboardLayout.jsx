export default function DashboardLayout({ sidebar, main, aside }) {
  const hasAside = !!aside;

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <div
        className={`mx-auto grid min-h-screen max-w-[1400px] gap-6 px-4 py-6 lg:gap-10 lg:px-6 lg:py-8 ${
          hasAside
            ? 'grid-cols-[5rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,6fr)_minmax(0,4fr)]'
            : 'grid-cols-[5rem_minmax(0,1fr)]'
        }`}
      >
        <aside className="sticky top-6 h-[calc(100vh-3rem)] rounded-2xl bg-white/40 p-4 shadow-sm lg:top-8 lg:h-[calc(100vh-4rem)]">
          {sidebar}
        </aside>

        <main id="main-content" className="relative min-w-0 overflow-visible">
          {main}
        </main>

        {hasAside && (
          <section className="relative hidden min-w-0 overflow-visible lg:block">
            {aside}
          </section>
        )}
      </div>
    </div>
  );
}
