import { useApp } from '../state/AppContext.jsx';

export default function Notification() {
  const { notification } = useApp();

  if (!notification.open) return null;

  const color = notification.type === 'error'
    ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100'
    : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100';

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">
      <div className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${color}`}>{notification.message}</div>
    </div>
  );
}

