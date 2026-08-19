import { FiLayout, FiPlus, FiRefreshCw } from "react-icons/fi";

export default function Header({ onAddColumn, onRefresh, taskCount }) {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <FiLayout />
        </div>
        <div className="header__info">
          <h1 className="header__title">Kanban Board</h1>
          <p className="header__subtitle">{taskCount} tasks across your board</p>
        </div>
      </div>
      <div className="header__right">
        <button className="header__btn header__btn--secondary" onClick={onRefresh}>
          <FiRefreshCw />
          <span>Refresh</span>
        </button>
        <button className="header__btn header__btn--primary" onClick={onAddColumn}>
          <FiPlus />
          <span>Add Column</span>
        </button>
      </div>
    </header>
  );
}
