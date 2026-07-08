import { Component } from 'preact';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '32px 16px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Something went wrong
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
            {this.props.fallback || 'Try refreshing the page.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '16px',
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
