# Day 28 — Capstone: Kanban Board Database Design

> **Database schema for a full-featured Kanban board** using Supabase PostgreSQL.  
> Inspired by **React DnD Kanban + Realworld Full Stack** (Web Dev Simplified).

## What's Included

### 📦 10 Database Tables
- **`profiles`** — User profiles extending Supabase Auth
- **`boards`** — Top-level Kanban boards
- **`board_members`** — Board membership with roles (owner/admin/member/viewer)
- **`lists`** — Columns within boards (e.g., To Do, In Progress, Done)
- **`tasks`** — Cards/tickets with priority, due dates, cover images
- **`labels`** — Color-coded tags per board
- **`task_assignees`** — Many-to-many: tasks ↔ users
- **`task_labels`** — Many-to-many: tasks ↔ labels
- **`task_comments`** — Discussion threads on tasks
- **`activity_log`** — Full audit trail of all actions

### 🔐 Row Level Security (RLS)
Every table has granular RLS policies based on board membership roles.

### ⚡ Triggers & Functions
- Auto-create profile on signup
- Auto-add creator as board owner
- Auto-update timestamps
- Drag-and-drop reorder helpers
- Board statistics aggregator

### 📊 Database Views
- `board_details` — Dashboard-ready board summaries
- `task_details` — Full task cards with embedded assignees & labels

## Getting Started

1. Open **Supabase Dashboard → SQL Editor**
2. Run each migration file in order (001 → 005)
3. Sign up test users through Auth
4. Optionally run seed data (006) with real user IDs

## Schema Diagram

See the full ER diagram and documentation in the walkthrough artifact.

## Tech Stack
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Frontend (planned):** React + @dnd-kit for drag-and-drop
