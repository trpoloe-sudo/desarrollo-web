import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "../storage/tasksStore.js";

const router = Router();

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isBoolean = (value) => typeof value === "boolean";

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const validateTaskInput = (body, { partial = false } = {}) => {
  const errors = [];

  if (!partial || "title" in body) {
    if (!isNonEmptyString(body.title)) {
      errors.push("title is required and must be a non-empty string");
    }
  }

  if ("description" in body && body.description != null) {
    if (typeof body.description !== "string") {
      errors.push("description must be a string");
    }
  }

  if ("completed" in body && body.completed != null) {
    if (!isBoolean(body.completed)) {
      errors.push("completed must be a boolean");
    }
  }

  return errors;
};

router.get("/", async (req, res) => {
  const { completed, sortBy, sortDir, page, pageSize } = req.query;

  const allowedSortBy = new Set(["createdAt", "updatedAt", "title", "completed"]);
  if (sortBy !== undefined && !allowedSortBy.has(sortBy)) {
    return res.status(400).json({
      error: "sortBy must be one of createdAt, updatedAt, title, completed",
    });
  }

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      return res.status(400).json({
        error: "completed must be 'true' or 'false' when provided",
      });
    }
  }

  if (sortDir !== undefined && sortDir !== "asc" && sortDir !== "desc") {
    return res.status(400).json({ error: "sortDir must be 'asc' or 'desc'" });
  }

  const pageNumber = page ? Number.parseInt(page, 10) : 1;
  const sizeNumber = pageSize ? Number.parseInt(pageSize, 10) : 20;

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ error: "page must be a positive number" });
  }
  if (Number.isNaN(sizeNumber) || sizeNumber < 1 || sizeNumber > 100) {
    return res
      .status(400)
      .json({ error: "pageSize must be between 1 and 100" });
  }

  const result = await listTasks({
    completed: completed === undefined ? undefined : completed === "true",
    sortBy: sortBy ?? "createdAt",
    sortDir: sortDir ?? "desc",
    page: pageNumber,
    pageSize: sizeNumber,
  });

  return res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    return res.status(400).json({ error: "id must be a number" });
  }

  const task = await getTask(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.json(task);
});

router.post("/", async (req, res) => {
  const errors = validateTaskInput(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const task = await createTask({
    title: req.body.title.trim(),
    description: req.body.description ?? "",
    completed: req.body.completed ?? false,
  });
  return res.status(201).json(task);
});

router.patch("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    return res.status(400).json({ error: "id must be a number" });
  }

  if (!Object.keys(req.body ?? {}).length) {
    return res.status(400).json({ error: "body must include fields to update" });
  }

  const errors = validateTaskInput(req.body, { partial: true });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const task = await getTask(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const patch = {};
  if ("title" in req.body) {
    patch.title = req.body.title.trim();
  }
  if ("description" in req.body) {
    patch.description = req.body.description ?? "";
  }
  if ("completed" in req.body) {
    patch.completed = req.body.completed ?? task.completed;
  }

  const updated = await updateTask(id, patch);

  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    return res.status(400).json({ error: "id must be a number" });
  }

  const removed = await deleteTask(id);
  if (!removed) {
    return res.status(404).json({ error: "Task not found" });
  }
  return res.json({ deleted: true, task: removed });
});

export default router;
