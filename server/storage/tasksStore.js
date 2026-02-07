import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(baseDir, "..", "data");
const dataFile = path.join(dataDir, "tasks.json");

let tasks = [];
let nextId = 1;

const ensureDataFile = async () => {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      tasks = parsed;
      const maxId = tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
      nextId = maxId + 1;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const ready = ensureDataFile();

const persist = async () => {
  await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2), "utf8");
};

export const listTasks = async ({
  completed,
  sortBy = "createdAt",
  sortDir = "desc",
  page = 1,
  pageSize = 20,
} = {}) => {
  await ready;
  let result = tasks;
  if (completed !== undefined) {
    result = result.filter((task) => task.completed === completed);
  }

  const dir = sortDir === "asc" ? 1 : -1;
  result = [...result].sort((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];

    if (left == null && right == null) return 0;
    if (left == null) return -1 * dir;
    if (right == null) return 1 * dir;

    if (typeof left === "string" && typeof right === "string") {
      return left.localeCompare(right) * dir;
    }
    return (left > right ? 1 : left < right ? -1 : 0) * dir;
  });

  const total = result.length;
  const start = (page - 1) * pageSize;
  const paged = result.slice(start, start + pageSize);

  return { items: paged, total, page, pageSize };
};

export const getTask = async (id) => {
  await ready;
  return tasks.find((task) => task.id === id) ?? null;
};

export const createTask = async ({ title, description, completed }) => {
  await ready;
  const now = new Date().toISOString();
  const task = {
    id: nextId++,
    title,
    description: description ?? "",
    completed: completed ?? false,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  await persist();
  return task;
};

export const updateTask = async (id, patch) => {
  await ready;
  const task = tasks.find((item) => item.id === id);
  if (!task) return null;

  if ("title" in patch) {
    task.title = patch.title;
  }
  if ("description" in patch) {
    task.description = patch.description ?? "";
  }
  if ("completed" in patch) {
    task.completed = patch.completed ?? task.completed;
  }
  task.updatedAt = new Date().toISOString();
  await persist();
  return task;
};

export const deleteTask = async (id) => {
  await ready;
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const [removed] = tasks.splice(index, 1);
  await persist();
  return removed;
};
