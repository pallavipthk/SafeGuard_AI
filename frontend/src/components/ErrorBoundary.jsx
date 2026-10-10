import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-theme flex items-center justify-center p-8">
          <div className="glass-card p-8 max-w-lg w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Something went wrong</h2>
            <p className="text-sm text-muted font-mono bg-[var(--input-bg)] p-3 rounded-xl text-left break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/dashboard'; }} className="btn-primary text-sm">
              Try Again
            </button>
            <button onClick={() => window.location.href = '/login'} className="btn-secondary text-sm ml-2">
              Back to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
