import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export function withSuspense<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithSuspense(props: P) {
    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
}
