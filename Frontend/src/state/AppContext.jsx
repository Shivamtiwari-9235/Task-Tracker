import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const initialFilters = {
  page: 1,
  limit: 10,
  status: '',
  priority: '',
  search: '',
  sortBy: 'createdAt',
  sortDir: 'desc'
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const [filters, setFilters] = useState(initialFilters);

  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState({ open: false, type: 'success', message: '' });

  const showNotification = useCallback((type, message) => {
    setNotification({ open: true, type, message });
    // Auto-close
    window.setTimeout(() => {
      setNotification((prev) => ({ ...prev, open: false }));
    }, 3200);
  }, []);

  const api = useMemo(() => axios.create({ baseURL: API_BASE_URL }), []);

  const fetchTasks = useCallback(async (override = {}) => {
    const merged = { ...filters, ...override };

    setIsLoadingTasks(true);
    setError(null);

    try {
      const params = {
        page: merged.page,
        limit: merged.limit,
        status: merged.status || undefined,
        priority: merged.priority || undefined,
        search: merged.search || undefined,
        sortBy: merged.sortBy,
        sortDir: merged.sortDir
      };

      const res = await api.get('/tasks', { params });

      setTasks(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch tasks');
      showNotification('error', err?.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  }, [api, filters, showNotification]);

  // Initial load
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTask = useCallback(async (payload) => {
    setError(null);
    try {
      const res = await api.post('/tasks', payload);
      showNotification('success', 'Task created');
      // Refresh current page (simpler/consistent)
      await fetchTasks({ page: 1 });
      return res.data;
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to create task';
      showNotification('error', msg);
      throw err;
    }
  }, [api, fetchTasks, showNotification]);

  const updateTask = useCallback(async (id, payload) => {
    setError(null);
    try {
      const res = await api.put(`/tasks/${id}`, payload);
      showNotification('success', 'Task updated');
      await fetchTasks();
      return res.data;
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to update task';
      showNotification('error', msg);
      throw err;
    }
  }, [api, fetchTasks, showNotification]);

  const deleteTask = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      showNotification('success', 'Task deleted');
      // If deleting last item on the page, adjust.
      await fetchTasks();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to delete task';
      showNotification('error', msg);
      throw err;
    }
  }, [api, fetchTasks, showNotification]);

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    // When filters change, fetch.
    fetchTasks();
  }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, filters.sortBy, filters.sortDir, fetchTasks]);

  const value = {
    theme,
    setTheme,
    filters,
    setFilters: updateFilters,
    tasks,
    totalCount,
    totalPages,
    isLoadingTasks,
    error,
    notification,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

