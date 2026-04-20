export default function BookmarkButton({ saved, onClick, size = 'md', className = '' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
      title={saved ? 'Remove bookmark' : 'Save for later'}
      className={`${box} inline-flex items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-accent/40 ${
        saved
          ? 'border-accent bg-accent text-white hover:bg-accent/90'
          : 'border-black/10 bg-white/90 text-ink/70 hover:border-accent/40 hover:text-accent'
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={icon}
      >
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  );
}
