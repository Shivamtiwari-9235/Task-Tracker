import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export function ErrorBoundary({ fallback, children }) {
  return (
    <ReactErrorBoundary
      fallback={
        <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
          <h2 className="text-lg font-semibold">{fallback.title}</h2>
          <p className="mt-1 text-sm opacity-90">{fallback.description}</p>
        </div>
      }
    >
      {children}
    </ReactErrorBoundary>
  );
}

