import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';

const STATUS = ['Pending', 'In Progress', 'Completed'];
const PRIORITY = ['High', 'Medium', 'Low'];

function isValidISODate(value) {
  if (!value) return true;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export default function TaskForm() {
  const { createTask } = useApp();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return form.title.trim().length > 0 && form.description.trim().length > 0;
  }, [form.title, form.description]);

  function validate() {
    const next = {};

    if (!form.title.trim()) next.title = 'Title is required';
    else if (form.title.trim().length > 120) next.title = 'Title must be at most 120 characters';

    if (!form.description.trim()) next.description = 'Description is required';
    else if (form.description.trim().length > 2000) next.description = 'Description must be at most 2000 characters';

    if (!STATUS.includes(form.status)) next.status = 'Invalid status';
    if (!PRIORITY.includes(form.priority)) next.priority = 'Invalid priority';

    if (form.dueDate && !isValidISODate(form.dueDate)) next.dueDate = 'Invalid due date';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
      });

      setForm({ title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '' });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-sm dark:bg-slate-900/30">
      <h2 className="text-base font-semibold">Create Task</h2>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium" htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            placeholder="e.g. Prepare presentation"
          />
          {errors.title && <div className="mt-1 text-xs text-red-600">{errors.title}</div>}
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="mt-1 w-full min-h-[90px] resize-y rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Task details..."
          />
          {errors.description && <div className="mt-1 text-xs text-red-600">{errors.description}</div>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium" htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && <div className="mt-1 text-xs text-red-600">{errors.status}</div>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            >
              {PRIORITY.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.priority && <div className="mt-1 text-xs text-red-600">{errors.priority}</div>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="dueDate">Due date (optional)</label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
          />
          {errors.dueDate && <div className="mt-1 text-xs text-red-600">{errors.dueDate}</div>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

