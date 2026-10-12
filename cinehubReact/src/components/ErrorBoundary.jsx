import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-red-400">An error occurred</h2>
          <pre className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded bg-slate-900 p-4 text-sm text-red-200">
            {String(error && (error.stack || error.message || error))}
            {info && info.componentStack}
          </pre>
          <div className="mt-4">
            <button
              className="rounded bg-brand-500 px-4 py-2 text-white"
              onClick={() => this.setState({ error: null, info: null })}
            >
              Dismiss
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
