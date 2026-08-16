-- ============================================================================
-- Day 28 Capstone: Kanban Board Database Schema
-- Migration 004: Tasks Table + Labels + Task Assignments
-- ============================================================================
-- Tasks (cards) live inside Lists. They support:
--   • Priority levels  (low, medium, high, urgent)
--   • Due dates
--   • Rich description
--   • Position for drag-and-drop reordering
--   • Cover image
--   • Multiple assignees (via junction table)
--   • Labels / tags   (via junction table)
-- ============================================================================

-- Priority enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================================
-- Labels Table (reusable per board)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.labels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 40),
    color           TEXT NOT NULL DEFAULT '#6366f1',  -- hex color
    board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    UNIQUE (board_id, name)
);

CREATE INDEX idx_labels_board ON public.labels(board_id);

-- ============================================================================
-- Tasks Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    description     TEXT DEFAULT '',
    position        INTEGER NOT NULL DEFAULT 0,
    priority        task_priority DEFAULT 'medium' NOT NULL,
    due_date        DATE DEFAULT NULL,
    cover_image     TEXT DEFAULT NULL,
    is_completed    BOOLEAN DEFAULT FALSE NOT NULL,
    is_archived     BOOLEAN DEFAULT FALSE NOT NULL,

    -- Foreign keys
    list_id         UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
    board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    created_by      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,

    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_tasks_list ON public.tasks(list_id);
CREATE INDEX idx_tasks_board ON public.tasks(board_id);
CREATE INDEX idx_tasks_position ON public.tasks(list_id, position);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);

-- Auto-update `updated_at`
CREATE TRIGGER on_task_updated
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Task Assignees (Many-to-Many: Tasks ↔ Users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_assignees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    UNIQUE (task_id, user_id)
);

CREATE INDEX idx_task_assignees_task ON public.task_assignees(task_id);
CREATE INDEX idx_task_assignees_user ON public.task_assignees(user_id);

-- ============================================================================
-- Task Labels (Many-to-Many: Tasks ↔ Labels)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_labels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    label_id        UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,

    UNIQUE (task_id, label_id)
);

CREATE INDEX idx_task_labels_task ON public.task_labels(task_id);
CREATE INDEX idx_task_labels_label ON public.task_labels(label_id);

-- ============================================================================
-- Row Level Security for Tasks
-- ============================================================================

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT: Board members can view tasks
CREATE POLICY "Board members can view tasks"
    ON public.tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = tasks.board_id
            AND board_members.user_id = auth.uid()
        )
    );

-- INSERT: Board members (not viewers) can create tasks
CREATE POLICY "Board members can create tasks"
    ON public.tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = tasks.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

-- UPDATE: Board members (not viewers) can update tasks
CREATE POLICY "Board members can update tasks"
    ON public.tasks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = tasks.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

-- DELETE: Owner/admin or the task creator can delete
CREATE POLICY "Owners, admins, or task creator can delete tasks"
    ON public.tasks
    FOR DELETE
    USING (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = tasks.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Row Level Security for Labels
-- ============================================================================

ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members can view labels"
    ON public.labels
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = labels.board_id
            AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Board members can create labels"
    ON public.labels
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = labels.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

CREATE POLICY "Board owners/admins can delete labels"
    ON public.labels
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = labels.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Row Level Security for Task Assignees
-- ============================================================================

ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members can view task assignees"
    ON public.task_assignees
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_assignees.task_id
            AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Board members can manage task assignees"
    ON public.task_assignees
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_assignees.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

CREATE POLICY "Board members can remove task assignees"
    ON public.task_assignees
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_assignees.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Row Level Security for Task Labels
-- ============================================================================

ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members can view task labels"
    ON public.task_labels
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_labels.task_id
            AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Board members can manage task labels"
    ON public.task_labels
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_labels.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

CREATE POLICY "Board members can remove task labels"
    ON public.task_labels
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_labels.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );
