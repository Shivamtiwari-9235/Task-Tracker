import { useApp } from '../state/AppContext.jsx';

function toCsv(rows) {
  if (!rows || !rows.length) return '';

  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    if (/[\n\r,\"]/g.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export default function ExportActions() {
  const { tasks } = useApp();

  function download(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    download(`tasks-export.json`, JSON.stringify(tasks, null, 2));
  }

  function exportCsv() {
    const csv = toCsv(tasks);
    download(`tasks-export.csv`, csv);
  }

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={exportJson}
        className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={exportCsv}
        className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
      >
        Export CSV
      </button>
    </div>
  );
}

