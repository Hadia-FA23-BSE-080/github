import { Draggable } from "@hello-pangea/dnd";
import { FiTrash2, FiEdit2, FiClock, FiFlag } from "react-icons/fi";

const priorityConfig = {
  high: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  low: { label: "Low", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
};

const tagColors = [
  "#6366f1", "#ec4899", "#14b8a6", "#f97316", "#8b5cf6",
  "#06b6d4", "#f43f5e", "#84cc16",
];

function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskCard({ task, index, onDelete, onEdit }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? "task-card--dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Priority indicator */}
          <div className="task-card__priority-bar" style={{ background: priority.color }} />

          <div className="task-card__content">
            {/* Header */}
            <div className="task-card__header">
              <h4 className="task-card__title">{task.title}</h4>
              <div className="task-card__actions">
                <button
                  className="task-card__action-btn"
                  onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                  title="Edit task"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="task-card__action-btn task-card__action-btn--delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  title="Delete task"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="task-card__description">{task.description}</p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="task-card__tags">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="task-card__tag"
                    style={{
                      background: `${getTagColor(tag)}20`,
                      color: getTagColor(tag),
                      borderColor: `${getTagColor(tag)}40`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="task-card__footer">
              <span
                className="task-card__priority-badge"
                style={{ background: priority.bg, color: priority.color }}
              >
                <FiFlag size={11} />
                {priority.label}
              </span>
              <span className="task-card__date">
                <FiClock size={11} />
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
