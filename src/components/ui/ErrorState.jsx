export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      <p className="font-serif text-lg text-ink">Something went wrong</p>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
