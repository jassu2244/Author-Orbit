const Icon = ({ path, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-5 w-5 ${className}`}
  >
    {path}
  </svg>
);

const items = [
  {
    id: 'home',
    label: 'Home',
    icon: <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />,
  },
  {
    id: 'library',
    label: 'Library',
    icon: (
      <>
        <path d="M4 4h6v16H4z" />
        <path d="M14 4h6v16h-6z" />
      </>
    ),
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    icon: <path d="M6 3h12v18l-6-4-6 4z" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
  },
];

export default function Sidebar({ activeView, onChangeView, bookmarkCount = 0 }) {
  return (
    <div className="flex h-full flex-col items-center justify-between py-2">
      <button
        onClick={() => onChangeView('home')}
        aria-label="Author Orbit home"
        className="font-serif text-2xl italic text-ink transition hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
      >
        Ao
      </button>

      <nav aria-label="Primary" className="flex flex-col items-center gap-6">
        {items.map((it) => {
          const active = activeView === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChangeView(it.id)}
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
              title={it.label}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                active
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-muted hover:bg-black/5 hover:text-ink'
              }`}
            >
              <Icon path={it.icon} />
              {it.id === 'bookmarks' && bookmarkCount > 0 && !active && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        aria-label="About"
        onClick={() => onChangeView('settings')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <Icon path={<path d="M4 6h16M4 12h10M4 18h16" />} />
      </button>
    </div>
  );
}
