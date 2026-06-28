import TaskItem from './TaskItem.jsx';
import { useApp } from '../state/AppContext.jsx';

function Skeleton() {
  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-sm animate-pulse dark:bg-slate-900/30">
      <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-9 w-full rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export default function TaskList({ loading }) {
  const { tasks, totalPages, filters, setFilters } = useApp();

  const canPrev = filters.page > 1;
  const canNext = filters.page < totalPages;

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border bg-white/70 p-6 text-center text-sm text-slate-600 dark:bg-slate-900/30 dark:text-slate-300">
          No tasks found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((t) => (
            <TaskItem key={t._id} task={t} />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/30">
        <button
          type="button"
          disabled={!canPrev || loading}
          onClick={() => setFilters({ page: Math.max(filters.page - 1, 1) })}
          className="rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-xs text-slate-600 dark:text-slate-300">
          Page <span className="font-semibold">{filters.page}</span> of <span className="font-semibold">{totalPages}</span>
        </div>

        <button
          type="button"
          disabled={!canNext || loading}
          onClick={() => setFilters({ page: Math.min(filters.page + 1, totalPages) })}
          className="rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

