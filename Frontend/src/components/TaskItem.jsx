import { useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';

function formatDate(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString();
  } catch {
    return '—';
  }
}

function priorityClass(p) {
  if (p === 'High') return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200';
  if (p === 'Medium') return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200';
  return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200';
}

function statusClass(s) {
  if (s === 'Completed') return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200';
  if (s === 'In Progress') return 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200';
  return 'bg-slate-50 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200';
}

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useApp();

  const statusOptions = useMemo(() => ['Pending', 'In Progress', 'Completed'], []);

  async function onChangeStatus(e) {
    const nextStatus = e.target.value;
    await updateTask(task._id, { status: nextStatus });
  }

  async function onDelete() {
    const ok = window.confirm('Delete this task?');
    if (!ok) return;
    await deleteTask(task._id);
  }

  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-sm dark:bg-slate-900/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold">{task.title}</h3>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClass(task.priority)}`}>{task.priority}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div><span className="font-semibold text-slate-700 dark:text-slate-200">Due:</span> {formatDate(task.dueDate)}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-200">Created:</span> {formatDate(task.createdAt)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(task.status)}`}>{task.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={task.status}
              onChange={onChangeStatus}
              className="rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              aria-label="Update status"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

