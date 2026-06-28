import { useEffect, useMemo } from 'react';
import { useApp } from './state/AppContext.jsx';
import Home from './pages/Home.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';

export default function App() {
  const { theme, setTheme } = useApp();

  useEffect(() => {
    const stored = localStorage.getItem('tt_theme');
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const errorFallback = useMemo(() => {
    return {
      title: 'Something went wrong',
      description: 'Refresh the page or try again.'
    };
  }, []);

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Home />
    </ErrorBoundary>
  );
}

