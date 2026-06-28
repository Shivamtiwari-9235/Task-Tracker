import { useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';

const STATUS = ['', 'Pending', 'In Progress', 'Completed'];
const PRIORITY = ['', 'High', 'Medium', 'Low'];

function priorityRank(p) {
  if (p === 'High') return 3;
  if (p === 'Medium') return 2;
  if (p === 'Low') return 1;
  return 0;
}

export default function FilterSort() {
  const { filters, setFilters, tasks } = useApp();

  const statsHint = useMemo(() => {
    // Tiny hint for UX: what sorts are being applied.
    return `Sorting by ${filters.sortBy}`;
  }, [filters.sortBy]);

  const statusOptions = STATUS;
  const priorityOptions = PRIORITY;

  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-sm dark:bg-slate-900/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label className="text-sm font-medium" htmlFor="search">Search</label>
          <input
            id="search"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            placeholder="Title or description"
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium" htmlFor="statusFilter">Status</label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s || 'All'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="priorityFilter">Priority</label>
            <select
              id="priorityFilter"
              value={filters.priority}
              onChange={(e) => setFilters({ priority: e.target.value, page: 1 })}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p || 'All'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium" htmlFor="sortBy">Sort by</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value, page: 1 })}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="createdAt">Created date</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="sortDir">Direction</label>
          <select
            id="sortDir"
            value={filters.sortDir}
            onChange={(e) => setFilters({ sortDir: e.target.value, page: 1 })}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="hidden sm:block sm:col-span-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">{statsHint}</div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setFilters({ status: '', priority: '', search: '', page: 1, sortBy: 'createdAt', sortDir: 'desc' })}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

