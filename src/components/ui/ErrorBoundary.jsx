import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') {
      console.error('[AuthorOrbit] Uncaught error', error, info);
    }
  }

  handleReset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-serif text-3xl text-ink">Something broke.</h1>
        <p className="text-sm text-muted">
          {this.state.error.message || 'An unexpected error occurred while rendering the page.'}
        </p>
        <button
          onClick={this.handleReset}
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Reload the dashboard
        </button>
      </div>
    );
  }
}
