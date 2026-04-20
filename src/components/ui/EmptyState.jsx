export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/10 bg-white/40 px-6 py-12 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="h-10 w-10 text-muted/60"
      >
        <path d="M4 4h6v16H4z" />
        <path d="M14 4h6v16h-6z" />
      </svg>
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
