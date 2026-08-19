import { useState, useEffect, useRef } from "react";
import { FiX, FiPlus } from "react-icons/fi";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "#10b981" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "high", label: "High", color: "#ef4444" },
];

export default function TaskModal({ isOpen, onClose, onSubmit, editTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        setTitle(editTask.title || "");
        setDescription(editTask.description || "");
        setPriority(editTask.priority || "medium");
        setTags(editTask.tags || []);
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setTags([]);
      }
      setTagInput("");
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, editTask]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description, priority, tags });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">
            {editTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="modal__field">
            <label className="modal__label">Title *</label>
            <input
              ref={titleRef}
              className="modal__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div className="modal__field">
            <label className="modal__label">Description</label>
            <textarea
              className="modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a detailed description..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="modal__field">
            <label className="modal__label">Priority</label>
            <div className="modal__priority-group">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`modal__priority-btn ${priority === opt.value ? "modal__priority-btn--active" : ""}`}
                  style={{
                    "--priority-color": opt.color,
                    borderColor: priority === opt.value ? opt.color : "transparent",
                    background: priority === opt.value ? `${opt.color}20` : "transparent",
                    color: priority === opt.value ? opt.color : "var(--text-secondary)",
                  }}
                  onClick={() => setPriority(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="modal__field">
            <label className="modal__label">Tags</label>
            <div className="modal__tag-input-group">
              <input
                className="modal__input modal__input--tag"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
              />
              <button
                type="button"
                className="modal__tag-add-btn"
                onClick={handleAddTag}
              >
                <FiPlus />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="modal__tags">
                {tags.map((tag) => (
                  <span key={tag} className="modal__tag">
                    {tag}
                    <button
                      type="button"
                      className="modal__tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__btn modal__btn--submit">
              {editTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
