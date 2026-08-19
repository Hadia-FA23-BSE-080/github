const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────────
// In-Memory Data Store
// ──────────────────────────────────────────────
let data = {
  columns: {
    "col-1": {
      id: "col-1",
      title: "To Do",
      color: "#6366f1",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "col-2": {
      id: "col-2",
      title: "In Progress",
      color: "#f59e0b",
      taskIds: ["task-5", "task-6"],
    },
    "col-3": {
      id: "col-3",
      title: "In Review",
      color: "#8b5cf6",
      taskIds: ["task-7"],
    },
    "col-4": {
      id: "col-4",
      title: "Done",
      color: "#10b981",
      taskIds: ["task-8", "task-9"],
    },
  },
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Design database schema",
      description: "Create ERD diagram and define all table relationships for the project",
      priority: "high",
      tags: ["backend", "database"],
      createdAt: "2026-08-10T10:00:00Z",
    },
    "task-2": {
      id: "task-2",
      title: "Setup authentication flow",
      description: "Implement JWT-based auth with login, register, and password reset",
      priority: "high",
      tags: ["backend", "security"],
      createdAt: "2026-08-11T09:00:00Z",
    },
    "task-3": {
      id: "task-3",
      title: "Create landing page wireframe",
      description: "Design the hero section, features, and CTA sections",
      priority: "medium",
      tags: ["design", "frontend"],
      createdAt: "2026-08-12T14:00:00Z",
    },
    "task-4": {
      id: "task-4",
      title: "Write API documentation",
      description: "Document all REST endpoints using Swagger/OpenAPI spec",
      priority: "low",
      tags: ["docs"],
      createdAt: "2026-08-13T08:00:00Z",
    },
    "task-5": {
      id: "task-5",
      title: "Build user dashboard",
      description: "Implement the main dashboard with analytics widgets and charts",
      priority: "high",
      tags: ["frontend", "ui"],
      createdAt: "2026-08-09T11:00:00Z",
    },
    "task-6": {
      id: "task-6",
      title: "Integrate payment gateway",
      description: "Connect Stripe API for subscription billing and one-time payments",
      priority: "medium",
      tags: ["backend", "payments"],
      createdAt: "2026-08-10T16:00:00Z",
    },
    "task-7": {
      id: "task-7",
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      priority: "medium",
      tags: ["devops"],
      createdAt: "2026-08-08T12:00:00Z",
    },
    "task-8": {
      id: "task-8",
      title: "Initialize project repository",
      description: "Set up monorepo with proper folder structure and linting rules",
      priority: "high",
      tags: ["setup"],
      createdAt: "2026-08-07T09:00:00Z",
    },
    "task-9": {
      id: "task-9",
      title: "Configure environment variables",
      description: "Set up .env files for development, staging, and production",
      priority: "low",
      tags: ["setup", "devops"],
      createdAt: "2026-08-07T10:00:00Z",
    },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4"],
};

// ──────────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────────

// GET /api/board — Fetch entire board state
app.get("/api/board", (req, res) => {
  res.json({
    success: true,
    data,
  });
});

// POST /api/tasks — Create a new task
app.post("/api/tasks", (req, res) => {
  const { title, description, priority, tags, columnId } = req.body;

  if (!title || !columnId) {
    return res.status(400).json({
      success: false,
      message: "Title and columnId are required",
    });
  }

  if (!data.columns[columnId]) {
    return res.status(404).json({
      success: false,
      message: "Column not found",
    });
  }

  const newTask = {
    id: `task-${uuidv4().slice(0, 8)}`,
    title,
    description: description || "",
    priority: priority || "medium",
    tags: tags || [],
    createdAt: new Date().toISOString(),
  };

  data.tasks[newTask.id] = newTask;
  data.columns[columnId].taskIds.push(newTask.id);

  res.status(201).json({
    success: true,
    data: newTask,
  });
});

// PUT /api/tasks/:id — Update a task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task = data.tasks[id];

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { title, description, priority, tags } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (tags !== undefined) task.tags = tags;

  res.json({
    success: true,
    data: task,
  });
});

// DELETE /api/tasks/:id — Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  if (!data.tasks[id]) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Remove from columns
  for (const col of Object.values(data.columns)) {
    col.taskIds = col.taskIds.filter((taskId) => taskId !== id);
  }

  delete data.tasks[id];

  res.json({
    success: true,
    message: "Task deleted",
  });
});

// PUT /api/board/reorder — Handle drag-and-drop reorder
app.put("/api/board/reorder", (req, res) => {
  const { sourceColumnId, destColumnId, sourceIndex, destIndex } = req.body;

  if (!sourceColumnId || !destColumnId || sourceIndex === undefined || destIndex === undefined) {
    return res.status(400).json({
      success: false,
      message: "sourceColumnId, destColumnId, sourceIndex, and destIndex are required",
    });
  }

  const sourceCol = data.columns[sourceColumnId];
  const destCol = data.columns[destColumnId];

  if (!sourceCol || !destCol) {
    return res.status(404).json({
      success: false,
      message: "Column not found",
    });
  }

  // Remove task from source
  const [movedTaskId] = sourceCol.taskIds.splice(sourceIndex, 1);

  // Insert task into destination
  destCol.taskIds.splice(destIndex, 0, movedTaskId);

  res.json({
    success: true,
    data: {
      columns: data.columns,
    },
  });
});

// POST /api/columns — Create a new column
app.post("/api/columns", (req, res) => {
  const { title, color } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const newColumn = {
    id: `col-${uuidv4().slice(0, 8)}`,
    title,
    color: color || colors[Math.floor(Math.random() * colors.length)],
    taskIds: [],
  };

  data.columns[newColumn.id] = newColumn;
  data.columnOrder.push(newColumn.id);

  res.status(201).json({
    success: true,
    data: newColumn,
  });
});

// DELETE /api/columns/:id — Delete a column
app.delete("/api/columns/:id", (req, res) => {
  const { id } = req.params;

  if (!data.columns[id]) {
    return res.status(404).json({
      success: false,
      message: "Column not found",
    });
  }

  // Delete all tasks in the column
  for (const taskId of data.columns[id].taskIds) {
    delete data.tasks[taskId];
  }

  delete data.columns[id];
  data.columnOrder = data.columnOrder.filter((colId) => colId !== id);

  res.json({
    success: true,
    message: "Column deleted",
  });
});

// PUT /api/columns/reorder — Handle column drag-and-drop reorder
app.put("/api/columns/reorder", (req, res) => {
  const { sourceIndex, destIndex } = req.body;

  if (sourceIndex === undefined || destIndex === undefined) {
    return res.status(400).json({
      success: false,
      message: "sourceIndex and destIndex are required",
    });
  }

  const [movedColId] = data.columnOrder.splice(sourceIndex, 1);
  data.columnOrder.splice(destIndex, 0, movedColId);

  res.json({
    success: true,
    data: {
      columnOrder: data.columnOrder,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kanban API server running on http://localhost:${PORT}`);
});
