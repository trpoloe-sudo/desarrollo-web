import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const listTasks = async ({
  completed,
  sortBy,
  sortDir,
  page,
  pageSize,
} = {}) => {
  const params = {};
  if (completed !== undefined) params.completed = completed;
  if (sortBy) params.sortBy = sortBy;
  if (sortDir) params.sortDir = sortDir;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;

  const { data } = await api.get("/tasks", { params });
  return data;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTask = async (id, patch) => {
  const { data } = await api.patch(`/tasks/${id}`, patch);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
