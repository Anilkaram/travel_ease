import React, { Suspense, lazy } from 'react';

// Loading component for better UX during lazy loading
const LoadingSpinner = () => (
  <div className="loading-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: '10px'
  }}>
    <div className="spinner" style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4a6bff',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// Error boundary for lazy loaded components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          flexDirection: 'column',
          gap: '10px',
          color: '#666'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#ff6b6b' }}></i>
          <h3>Oops! Something went wrong</h3>
          <p>Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#4a6bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loading wrapper
const withLazyLoading = (importFunc, fallback = <LoadingSpinner />) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default withLazyLoading;
export { LoadingSpinner, ErrorBoundary };
