import { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";

const COLOR_OPTIONS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#f59e0b", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6",
];

export default function AddColumnModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setColor(COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), color });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Add New Column</h2>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__field">
            <label className="modal__label">Column Name</label>
            <input
              ref={inputRef}
              className="modal__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Backlog, QA Testing..."
              required
            />
          </div>
          <div className="modal__field">
            <label className="modal__label">Color</label>
            <div className="modal__color-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`modal__color-swatch ${color === c ? "modal__color-swatch--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__btn modal__btn--submit">
              Create Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
