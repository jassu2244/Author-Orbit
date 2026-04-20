import { useMemo, useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import HeaderSearch from "./components/MainContent/HeaderSearch.jsx";
import AuthorGreeting from "./components/MainContent/AuthorGreeting.jsx";
import WorksCarousel from "./components/MainContent/WorksCarousel.jsx";
import LibraryView from "./components/MainContent/LibraryView.jsx";
import BookmarksView from "./components/MainContent/BookmarksView.jsx";
import SettingsView from "./components/MainContent/SettingsView.jsx";
import AuthorProfile from "./components/SidebarRight/AuthorProfile.jsx";
import FeaturedSummary from "./components/SidebarRight/FeaturedSummary.jsx";
import AuthorTimeline from "./components/SidebarRight/AuthorTimeline.jsx";
import RelatedSubjects from "./components/SidebarRight/RelatedSubjects.jsx";
import ErrorState from "./components/ui/ErrorState.jsx";
import FilterChip from "./components/ui/FilterChip.jsx";
import BookDetailDrawer from "./components/ui/BookDetailDrawer.jsx";
import { useDebouncedValue } from "./hooks/useDebouncedValue.js";
import { useAuthorData } from "./hooks/useAuthorData.js";
import { useAuthorDetails } from "./hooks/useAuthorDetails.js";
import { useBookmarks } from "./hooks/useBookmarks.js";

export default function App() {
  const [query, setQuery] = useState("J. K. Rowling");
  const [activeView, setActiveView] = useState("home");
  const [yearFilter, setYearFilter] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const debounced = useDebouncedValue(query, 450);
  const { status, data, error } = useAuthorData(debounced);
  const { data: authorDetails } = useAuthorDetails(data?.authorKey ?? null);
  const bookmarks = useBookmarks();

  const loading = status === "loading";
  const allBooks = data?.books ?? [];
  const authorName = data?.authorName ?? debounced;

  const filteredBooks = useMemo(() => {
    let list = allBooks;
    if (yearFilter) list = list.filter((b) => b.year === yearFilter);
    if (subjectFilter)
      list = list.filter((b) => (b.subjects ?? []).some((s) => s.toLowerCase() === subjectFilter.toLowerCase()));
    return list;
  }, [allBooks, yearFilter, subjectFilter]);

  const featured = filteredBooks[0] ?? allBooks[0] ?? null;
  const yearRange = data?.years?.length ? [data.years[0], data.years[data.years.length - 1]] : null;

  const openBook = (book) => setSelectedBook(book);
  const closeDrawer = () => setSelectedBook(null);

  const toggleBookmark = (book) => bookmarks.toggle(book);

  const goHome = () => setActiveView("home");

  const activeFilters = [
    yearFilter && { kind: "year", label: `Year: ${yearFilter}`, clear: () => setYearFilter(null) },
    subjectFilter && {
      kind: "subject",
      label: `Subject: ${subjectFilter}`,
      clear: () => setSubjectFilter(null),
    },
  ].filter(Boolean);

  const renderHome = () => (
    <div className="flex flex-col gap-10">
      <HeaderSearch value={query} onChange={setQuery} loading={loading} />

      <div>
        <AuthorGreeting
          authorName={authorName}
          totalBooks={data?.totalBooks ?? 0}
          yearRange={yearRange}
          onStartReading={featured ? () => openBook(featured) : undefined}
          disabled={!featured}
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Filters</span>
          {activeFilters.map((f) => (
            <FilterChip key={f.kind} label={f.label} onClear={f.clear} />
          ))}
        </div>
      )}

      {status === "error" ? (
        <ErrorState message={error || "Failed to load author data."} onRetry={() => setQuery((q) => `${q} `)} />
      ) : (
        <WorksCarousel
          title={activeFilters.length ? "Matching Works" : "Popular Works"}
          books={filteredBooks}
          loading={loading}
          isBookmarked={bookmarks.has}
          onToggleBookmark={toggleBookmark}
          onSelect={openBook}
        />
      )}
    </div>
  );

  const renderLibrary = () => (
    <LibraryView
      authorName={authorName}
      books={allBooks}
      loading={loading}
      isBookmarked={bookmarks.has}
      onToggleBookmark={toggleBookmark}
      onSelect={openBook}
    />
  );

  const renderBookmarks = () => (
    <BookmarksView
      bookmarks={bookmarks.items}
      isBookmarked={bookmarks.has}
      onToggleBookmark={toggleBookmark}
      onSelect={openBook}
      onClearAll={bookmarks.clear}
      onGoHome={goHome}
    />
  );

  const renderSettings = () => (
    <SettingsView bookmarkCount={bookmarks.items.length} lastQuery={debounced} onClearBookmarks={bookmarks.clear} />
  );

  const viewMap = {
    home: renderHome,
    library: renderLibrary,
    bookmarks: renderBookmarks,
    settings: renderSettings,
  };

  const showAside = activeView === "home";

  const asideContent = showAside ? (
    <div className="flex flex-col gap-10">
      <AuthorProfile
        authorName={authorName}
        photoUrl={authorDetails?.photoUrl}
        onOpenBookmarks={() => setActiveView("bookmarks")}
        bookmarkCount={bookmarks.items.length}
      />
      <FeaturedSummary
        book={featured}
        authorName={authorName}
        searchToken={query}
        loading={loading}
        onReadMore={featured ? () => openBook(featured) : undefined}
      />
      <AuthorTimeline
        years={data?.years ?? []}
        loading={loading}
        activeYear={yearFilter}
        onSelectYear={(y) => setYearFilter((cur) => (cur === y ? null : y))}
      />
      <RelatedSubjects
        subjects={data?.subjects ?? []}
        loading={loading}
        activeSubject={subjectFilter}
        onSelectSubject={setSubjectFilter}
      />
    </div>
  ) : null;

  return (
    <>
      <DashboardLayout
        sidebar={
          <Sidebar activeView={activeView} onChangeView={setActiveView} bookmarkCount={bookmarks.items.length} />
        }
        main={(viewMap[activeView] ?? renderHome)()}
        aside={asideContent}
      />

      <BookDetailDrawer
        open={!!selectedBook}
        book={selectedBook}
        onClose={closeDrawer}
        isBookmarked={selectedBook ? bookmarks.has(selectedBook.key) : false}
        onToggleBookmark={selectedBook ? () => toggleBookmark(selectedBook) : undefined}
      />
    </>
  );
}
