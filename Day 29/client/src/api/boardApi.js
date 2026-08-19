import axios from "axios";

const API_BASE = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Fetch entire board state
export const fetchBoard = async () => {
  const { data } = await api.get("/board");
  return data.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const { data } = await api.post("/tasks", taskData);
  return data.data;
};

// Update a task
export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

// Reorder tasks (drag and drop)
export const reorderTasks = async (reorderData) => {
  const { data } = await api.put("/board/reorder", reorderData);
  return data.data;
};

// Create a new column
export const createColumn = async (columnData) => {
  const { data } = await api.post("/columns", columnData);
  return data.data;
};

// Delete a column
export const deleteColumn = async (id) => {
  const { data } = await api.delete(`/columns/${id}`);
  return data;
};

// Reorder columns
export const reorderColumns = async (reorderData) => {
  const { data } = await api.put("/columns/reorder", reorderData);
  return data.data;
};
