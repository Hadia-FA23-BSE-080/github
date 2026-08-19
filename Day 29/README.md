# 🗂️ Day 29 — Kanban Board with Drag & Drop

A full-stack **Kanban Board** application built with React + `@hello-pangea/dnd` (the maintained fork of `react-beautiful-dnd`) connected to an Express REST API backend.

---

## 📁 Project Structure

```
Day 29/
├── server/                  # Express API Backend
│   ├── index.js             # Main server + all routes
│   └── package.json
│
└── client/                  # React Frontend (Vite)
    ├── src/
    │   ├── api/
    │   │   └── boardApi.js        # Axios API service layer
    │   ├── components/
    │   │   ├── Column.jsx         # Draggable column component
    │   │   ├── TaskCard.jsx       # Draggable task card component
    │   │   ├── TaskModal.jsx      # Create/edit task modal
    │   │   ├── AddColumnModal.jsx # Create column modal
    │   │   └── Header.jsx        # App header with actions
    │   ├── App.jsx                # Main app + DnD logic
    │   ├── App.css                # Premium dark-mode styles
    │   └── main.jsx               # Entry point
    └── index.html
```

---

## 🚀 How to Run

### 1. Start the Express API server (port 4000)

```bash
cd server
npm start
```

### 2. Start the React dev server (port 3000)

```bash
cd client
npm run dev
```

Open → **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /api/board            | Fetch full board state        |
| POST   | /api/tasks            | Create a new task             |
| PUT    | /api/tasks/:id        | Update a task                 |
| DELETE | /api/tasks/:id        | Delete a task                 |
| PUT    | /api/board/reorder    | Reorder tasks via DnD         |
| POST   | /api/columns          | Create a new column           |
| DELETE | /api/columns/:id      | Delete a column               |
| PUT    | /api/columns/reorder  | Reorder columns via DnD       |

---

## ✨ Features

- **Drag & Drop** tasks between columns (cross-column and same-column)
- **Drag & Drop** entire columns to reorder them
- **Create/Edit/Delete** tasks with title, description, priority, tags
- **Create/Delete** columns with custom color
- **Priority indicators** (High / Medium / Low) with color-coded badges
- **Tag system** with auto-color assignment
- **Optimistic UI updates** — the board updates instantly, then syncs to API
- **Toast notifications** for all actions
- **Premium dark-mode UI** with glassmorphism, gradient backgrounds, micro-animations

---

## 🧠 Concepts Covered (React Beautiful DnD Tutorial)

| Concept | Implementation |
|---|---|
| `DragDropContext` | Wraps the entire board; `onDragEnd` handles all drop logic |
| `Droppable` | Column list (horizontal) + task list inside each column (vertical) |
| `Draggable` | Each Column and each TaskCard is individually draggable |
| `type="COLUMN"` | Separates column DnD from task DnD |
| Optimistic updates | State updated before API call for smooth UX |
| Cross-column moves | Moving tasks between different columns handled properly |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| DnD Library | `@hello-pangea/dnd` (react-beautiful-dnd successor) |
| HTTP Client | Axios |
| Icons | React Icons (Feather set) |
| Backend | Express.js (Node.js) |
| Data Store | In-memory (no database needed) |
| Styling | Vanilla CSS (custom dark design system) |
