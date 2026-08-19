import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { FiPlus, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useState } from "react";

export default function Column({ column, tasks, index, onAddTask, onDeleteTask, onEditTask, onDeleteColumn }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`column ${snapshot.isDragging ? "column--dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {/* Column Header */}
          <div className="column__header" {...provided.dragHandleProps}>
            <div className="column__header-left">
              <span className="column__dot" style={{ background: column.color }} />
              <h3 className="column__title">{column.title}</h3>
              <span className="column__count">{tasks.length}</span>
            </div>
            <div className="column__header-right">
              <button
                className="column__icon-btn"
                onClick={() => onAddTask(column.id)}
                title="Add task"
              >
                <FiPlus />
              </button>
              <div className="column__menu-wrapper">
                <button
                  className="column__icon-btn"
                  onClick={() => setShowMenu(!showMenu)}
                  title="More options"
                >
                  <FiMoreHorizontal />
                </button>
                {showMenu && (
                  <div className="column__menu">
                    <button
                      className="column__menu-item column__menu-item--danger"
                      onClick={() => {
                        setShowMenu(false);
                        onDeleteColumn(column.id);
                      }}
                    >
                      <FiTrash2 />
                      Delete Column
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column gradient accent */}
          <div className="column__accent" style={{ background: `linear-gradient(90deg, ${column.color}, transparent)` }} />

          {/* Droppable Task List */}
          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <div
                className={`column__task-list ${snapshot.isDraggingOver ? "column__task-list--active" : ""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, taskIndex) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={taskIndex}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                  />
                ))}
                {provided.placeholder}

                {tasks.length === 0 && !snapshot.isDraggingOver && (
                  <div className="column__empty">
                    <p>No tasks yet</p>
                    <button
                      className="column__empty-btn"
                      onClick={() => onAddTask(column.id)}
                    >
                      <FiPlus /> Add a task
                    </button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
