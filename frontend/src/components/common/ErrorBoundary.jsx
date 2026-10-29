import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0F1512] flex items-center justify-center p-6 text-stone-900 dark:text-stone-100">
          <div className="card max-w-lg w-full p-8 text-center border border-stone-200 dark:border-stone-800 shadow-xl bg-white dark:bg-stone-900">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle size={28} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              KaamConnect Guard
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white mt-1 mb-2">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
              We encountered an unexpected error while rendering this page. You can reload the page or return to the home screen.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full sm:w-auto text-xs font-bold py-2.5 px-5 flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="btn-outline w-full sm:w-auto text-xs font-bold py-2.5 px-5 flex items-center justify-center gap-2"
              >
                <Home size={14} />
                <span>Return Home</span>
              </button>
            </div>

            {/* Error diagnostics */}
            {this.state.error && (
              <details className="text-left mt-4 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                <summary className="cursor-pointer font-semibold text-stone-600 dark:text-stone-300">
                  Technical Details
                </summary>
                <div className="mt-2 text-rose-600 dark:text-rose-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

