# Author Orbit

A clean, dashboard-style web app for exploring any author's complete catalog. Type in a name and instantly browse their works, publication timeline, recurring subjects, and more — all pulled live from the [Open Library API](https://openlibrary.org/developers/api).

Built with React + Vite and styled with Tailwind CSS.

---

## What It Does

Author Orbit gives you a single place to look up everything an author has published. Instead of scrolling through endless search results, you get a structured overview:

- **Search by author name** — debounced input, so it doesn't hammer the API on every keystroke.
- **Works carousel** — the most popular titles (sorted by edition count and cover availability) shown in a horizontal scroll.
- **Full library view** — a grid of every book returned, with search and sort options.
- **Book detail drawer** — click any book to slide open a panel with the description, subjects, edition count, ratings, and a direct link to Open Library.
- **Publication timeline** — a scrollable row of years the author published in. Click a year to filter the catalog.
- **Related subjects** — see recurring themes across the author's body of work. Click one to filter by that subject.
- **Author profile sidebar** — shows the author's photo (when available) alongside key stats.
- **Bookmarks** — save books to a personal reading list stored in `localStorage`. Persists across sessions, no account needed.
- **Settings page** — view app info and manage bookmarks.

Everything runs client-side. There's no backend, no database, and no API key required.

---

## Tech Stack

| Layer       | Tool                                                             |
| ----------- | ---------------------------------------------------------------- |
| Framework   | [React 18](https://react.dev/)                                   |
| Build tool  | [Vite 6](https://vitejs.dev/)                                    |
| Styling     | [Tailwind CSS 3](https://tailwindcss.com/)                       |
| Typography  | Playfair Display + Inter (Google Fonts)                          |
| Data source | [Open Library Search API](https://openlibrary.org/developers/api)|
| Persistence | Browser `localStorage` for bookmarks                             |

---

## Project Structure

```
src/
├── App.jsx                        # Root component — state, routing, layout assembly
├── main.jsx                       # Entry point
├── index.css                      # Global styles & Tailwind directives
│
├── components/
│   ├── MainContent/
│   │   ├── AuthorGreeting.jsx     # Hero section with author name & stats
│   │   ├── BookGrid.jsx           # Responsive grid of book cards
│   │   ├── BookmarksView.jsx      # Saved-for-later page
│   │   ├── HeaderSearch.jsx       # Search bar with popular author suggestions
│   │   ├── LibraryView.jsx        # Full catalog browser
│   │   ├── SettingsView.jsx       # App info & bookmark management
│   │   └── WorksCarousel.jsx      # Horizontal scroll of popular works
│   │
│   ├── Sidebar/
│   │   └── Sidebar.jsx            # Left navigation rail
│   │
│   ├── SidebarRight/
│   │   ├── AuthorProfile.jsx      # Author photo & quick stats
│   │   ├── AuthorTimeline.jsx     # Publication year chips (filterable)
│   │   ├── FeaturedSummary.jsx    # Highlighted book summary card
│   │   └── RelatedSubjects.jsx    # Subject tags with counts
│   │
│   └── ui/
│       ├── BookDetailDrawer.jsx   # Slide-over panel for book details
│       ├── BookmarkButton.jsx     # Toggle bookmark icon
│       ├── EmptyState.jsx         # Placeholder for empty views
│       ├── ErrorBoundary.jsx      # Catch rendering errors gracefully
│       ├── ErrorState.jsx         # Error message with retry
│       ├── FilterChip.jsx         # Active filter pill with dismiss
│       └── Skeleton.jsx           # Loading placeholder
│
├── hooks/
│   ├── useAuthorData.js           # Fetch & normalize author search results
│   ├── useAuthorDetails.js        # Fetch author bio & photo
│   ├── useBookDetails.js          # Fetch individual book metadata
│   ├── useBookmarks.js            # Bookmark CRUD with localStorage
│   ├── useDebouncedValue.js       # Debounce a value by N ms
│   └── useLocalStorage.js         # Generic localStorage hook
│
└── layouts/
    └── DashboardLayout.jsx        # Three-column responsive layout shell
```

---

## Getting Started

Make sure you have **Node.js 18+** installed.

```bash
# Clone the repo
git clone https://github.com/jassu2244/Author-Orbit.git
cd Author-Orbit

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/`.

---

## Building for Production

```bash
npm run build
```

This generates a static bundle in the `dist/` folder. You can preview it locally with:

```bash
npm run preview
```

The preview server runs at `http://localhost:4173/`.

---

## Deployment

Since this is a fully static app with no backend, you can host it pretty much anywhere:

- **Vercel** — auto-detects Vite. Just import the repo and deploy.
- **Netlify** — set build command to `npm run build` and publish directory to `dist`.
- **GitHub Pages** — set `base: '/your-repo-name/'` in `vite.config.js`, then use `gh-pages`.
- **Cloudflare Pages** — same idea, Vite preset works out of the box.

No environment variables are needed. The Open Library API is public and doesn't require authentication.

For detailed deployment instructions (including Docker and Nginx configs), check out [deployment.md](./deployment.md).

---

## How It Works

1. When you type an author's name, the app waits 450ms (debounce) before firing a request to Open Library's search endpoint.
2. The response is normalized — books are sorted by cover availability and edition count, subjects are aggregated and ranked, and publication years are extracted into a timeline.
3. Everything is rendered into a three-column dashboard: navigation on the left, main content in the center, and contextual panels on the right.
4. Clicking a book opens a detail drawer that fetches the full work description from Open Library's works API.
5. Bookmarks are persisted to `localStorage`, so they survive page refreshes without needing any server.

---

## Design Choices

- **No routing library** — the app uses a simple `activeView` state to switch between Home, Library, Bookmarks, and Settings. It keeps the bundle small and avoids unnecessary complexity for what is essentially a single-page experience.
- **Custom hooks for everything** — data fetching, debouncing, bookmarks, and localStorage are all encapsulated in hooks. Components stay focused on rendering.
- **Skeleton loading states** — instead of spinners, every section shows placeholder skeletons while data loads. It feels faster and looks less jarring.
- **AbortController** — search requests are cancelled when the query changes before a response arrives, preventing race conditions and stale data.

---

## API Attribution

All book data, covers, and author information comes from [Open Library](https://openlibrary.org/), a project of the [Internet Archive](https://archive.org/). No API key is required.

---

## License

This project is open source and available under the [MIT License](./LICENSE).
