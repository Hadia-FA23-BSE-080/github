import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./components/Column";
import Header from "./components/Header";
import TaskModal from "./components/TaskModal";
import AddColumnModal from "./components/AddColumnModal";
import {
  fetchBoard,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  createColumn,
  deleteColumn,
  reorderColumns,
} from "./api/boardApi";
import "./App.css";

export default function App() {
  const [columns, setColumns] = useState({});
  const [tasks, setTasks] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load board data
  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBoard();
      setColumns(data.columns);
      setTasks(data.tasks);
      setColumnOrder(data.columnOrder);
    } catch (err) {
      setError("Failed to load board. Make sure the server is running on port 5000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  // ────────────────────────────────────────────
  // DRAG & DROP HANDLER
  // ────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { destination, source, type } = result;

    // Dropped outside droppable
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Column reorder
    if (type === "COLUMN") {
      const newOrder = [...columnOrder];
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      setColumnOrder(newOrder);

      try {
        await reorderColumns({
          sourceIndex: source.index,
          destIndex: destination.index,
        });
      } catch (err) {
        console.error("Failed to reorder columns:", err);
        setColumnOrder(columnOrder); // Rollback
      }
      return;
    }

    // Task reorder
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    // Same column reorder
    if (sourceCol.id === destCol.id) {
      const newTaskIds = [...sourceCol.taskIds];
      const [moved] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, moved);

      setColumns((prev) => ({
        ...prev,
        [sourceCol.id]: { ...sourceCol, taskIds: newTaskIds },
      }));

      try {
        await reorderTasks({
          sourceColumnId: sourceCol.id,
          destColumnId: destCol.id,
          sourceIndex: source.index,
          destIndex: destination.index,
        });
      } catch (err) {
        console.error("Failed to reorder tasks:", err);
        loadBoard(); // Rollback
      }
      return;
    }

    // Cross-column move
    const newSourceTaskIds = [...sourceCol.taskIds];
    const [movedTaskId] = newSourceTaskIds.splice(source.index, 1);
    const newDestTaskIds = [...destCol.taskIds];
    newDestTaskIds.splice(destination.index, 0, movedTaskId);

    setColumns((prev) => ({
      ...prev,
      [sourceCol.id]: { ...sourceCol, taskIds: newSourceTaskIds },
      [destCol.id]: { ...destCol, taskIds: newDestTaskIds },
    }));

    try {
      await reorderTasks({
        sourceColumnId: sourceCol.id,
        destColumnId: destCol.id,
        sourceIndex: source.index,
        destIndex: destination.index,
      });
    } catch (err) {
      console.error("Failed to move task:", err);
      loadBoard(); // Rollback
    }
  };

  // ────────────────────────────────────────────
  // TASK CRUD
  // ────────────────────────────────────────────
  const handleAddTask = (columnId) => {
    setActiveColumnId(columnId);
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update
        const updated = await updateTask(editingTask.id, taskData);
        setTasks((prev) => ({ ...prev, [editingTask.id]: updated }));
        showToast("Task updated successfully!");
      } else {
        // Create
        const newTask = await createTask({
          ...taskData,
          columnId: activeColumnId,
        });
        setTasks((prev) => ({ ...prev, [newTask.id]: newTask }));
        setColumns((prev) => ({
          ...prev,
          [activeColumnId]: {
            ...prev[activeColumnId],
            taskIds: [...prev[activeColumnId].taskIds, newTask.id],
          },
        }));
        showToast("Task created successfully!");
      }
      setTaskModalOpen(false);
    } catch (err) {
      console.error("Task operation failed:", err);
      showToast("Operation failed. Please try again.", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => {
        const copy = { ...prev };
        delete copy[taskId];
        return copy;
      });
      setColumns((prev) => {
        const updated = {};
        for (const [key, col] of Object.entries(prev)) {
          updated[key] = {
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          };
        }
        return updated;
      });
      showToast("Task deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete task.", "error");
    }
  };

  // ────────────────────────────────────────────
  // COLUMN CRUD
  // ────────────────────────────────────────────
  const handleAddColumn = () => setColumnModalOpen(true);

  const handleColumnSubmit = async (colData) => {
    try {
      const newCol = await createColumn(colData);
      setColumns((prev) => ({ ...prev, [newCol.id]: newCol }));
      setColumnOrder((prev) => [...prev, newCol.id]);
      setColumnModalOpen(false);
      showToast("Column created!");
    } catch (err) {
      console.error("Failed to create column:", err);
      showToast("Failed to create column.", "error");
    }
  };

  const handleDeleteColumn = async (colId) => {
    const col = columns[colId];
    const taskCount = col?.taskIds?.length || 0;
    if (taskCount > 0 && !window.confirm(`Delete "${col.title}" and its ${taskCount} task(s)?`)) {
      return;
    }

    try {
      await deleteColumn(colId);
      setColumns((prev) => {
        const copy = { ...prev };
        // Remove tasks in this column
        for (const taskId of col.taskIds) {
          setTasks((prevTasks) => {
            const taskCopy = { ...prevTasks };
            delete taskCopy[taskId];
            return taskCopy;
          });
        }
        delete copy[colId];
        return copy;
      });
      setColumnOrder((prev) => prev.filter((id) => id !== colId));
      showToast("Column deleted!");
    } catch (err) {
      console.error("Failed to delete column:", err);
      showToast("Failed to delete column.", "error");
    }
  };

  // ────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────
  const totalTasks = Object.keys(tasks).length;

  if (loading) {
    return (
      <div className="app-loader">
        <div className="app-loader__spinner" />
        <p>Loading your board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="app-error__icon">⚠️</div>
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button className="app-error__btn" onClick={loadBoard}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onAddColumn={handleAddColumn}
        onRefresh={loadBoard}
        taskCount={totalTasks}
      />

      <main className="board">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div
                className="board__columns"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {columnOrder.map((colId, index) => {
                  const column = columns[colId];
                  if (!column) return null;
                  const columnTasks = column.taskIds
                    .map((taskId) => tasks[taskId])
                    .filter(Boolean);

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                      index={index}
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
      />
      <AddColumnModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSubmit={handleColumnSubmit}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
