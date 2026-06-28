import { useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';

function safeNum(n) {
  return Number.isFinite(n) ? n : 0;
}

export default function TaskStats() {
  const { tasks } = useApp();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;

    return { total: safeNum(total), completed, pending, inProgress };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 sm:items-center">
      <div className="rounded-xl border bg-white/70 px-3 py-2 dark:bg-slate-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
        <div className="text-lg font-bold">{stats.total}</div>
      </div>
      <div className="rounded-xl border bg-white/70 px-3 py-2 dark:bg-slate-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
      </div>
      <div className="hidden rounded-xl border bg-white/70 px-3 py-2 sm:block dark:bg-slate-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
        <div className="text-lg font-bold">{stats.pending}</div>
      </div>
      <div className="hidden rounded-xl border bg-white/70 px-3 py-2 sm:block dark:bg-slate-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400">In Progress</div>
        <div className="text-lg font-bold">{stats.inProgress}</div>
      </div>
    </div>
  );
}

