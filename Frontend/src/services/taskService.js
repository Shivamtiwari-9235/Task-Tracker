import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: API_BASE_URL });

export async function createTask(payload) {
  const res = await client.post('/tasks', payload);
  return res.data;
}

export async function fetchTasks(params) {
  const res = await client.get('/tasks', { params });
  return res.data;
}

export async function updateTask(id, payload) {
  const res = await client.put(`/tasks/${id}`, payload);
  return res.data;
}

export async function deleteTask(id) {
  const res = await client.delete(`/tasks/${id}`);
  return res.data;
}

export default {
  createTask,
  fetchTasks,
  updateTask,
  deleteTask
};

