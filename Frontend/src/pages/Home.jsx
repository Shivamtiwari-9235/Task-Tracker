import { useEffect } from 'react';
import { useApp } from '../state/AppContext.jsx';
import TaskForm from '../components/TaskForm.jsx';
import FilterSort from '../components/FilterSort.jsx';
import TaskList from '../components/TaskList.jsx';
import Notification from '../components/Notification.jsx';
import TaskStats from '../components/TaskStats.jsx';
import ExportActions from '../components/ExportActions.jsx';

export default function Home() {
  const {
    fetchTasks,
    isLoadingTasks,
    filters
  } = useApp();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.search, filters.sortBy, filters.sortDir, filters.page, filters.limit]);


  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Task Tracker</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Create, track, filter and manage tasks.</p>
          </div>
          <TaskStats />
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <TaskForm />
          </section>

          <section className="lg:col-span-2">
            <FilterSort />
            <ExportActions />
            <div className="mt-4">
              <TaskList loading={isLoadingTasks} />
            </div>
          </section>

        </div>
      </div>

      <Notification />
    </div>
  );
}

