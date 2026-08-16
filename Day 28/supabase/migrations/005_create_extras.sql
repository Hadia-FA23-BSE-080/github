-- ============================================================================
-- Day 28 Capstone: Kanban Board Database Schema
-- Migration 005: Activity Log + Comments + Views & Functions
-- ============================================================================
-- Extras that make the Kanban board production-ready:
--   • Activity log    – tracks every change (move, rename, assign, etc.)
--   • Task comments   – discussion thread per task
--   • Database views  – convenient joins for the frontend
--   • Helper functions – reorder positions, board stats
-- ============================================================================

-- ============================================================================
-- Activity Log (Audit Trail)
-- ============================================================================

CREATE TYPE activity_action AS ENUM (
    'board_created', 'board_updated', 'board_archived',
    'list_created', 'list_moved', 'list_archived',
    'task_created', 'task_moved', 'task_updated', 'task_completed',
    'task_archived', 'task_assigned', 'task_unassigned',
    'label_added', 'label_removed',
    'member_added', 'member_removed',
    'comment_added'
);

CREATE TABLE IF NOT EXISTS public.activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    task_id         UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    list_id         UUID REFERENCES public.lists(id) ON DELETE SET NULL,
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action          activity_action NOT NULL,
    metadata        JSONB DEFAULT '{}',  -- flexible data (e.g. old/new values)
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_activity_board ON public.activity_log(board_id);
CREATE INDEX idx_activity_task ON public.activity_log(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_activity_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_created ON public.activity_log(created_at DESC);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members can view activity"
    ON public.activity_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = activity_log.board_id
            AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Board members can log activity"
    ON public.activity_log
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = activity_log.board_id
            AND board_members.user_id = auth.uid()
        )
    );

-- ============================================================================
-- Task Comments
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content         TEXT NOT NULL CHECK (char_length(content) >= 1),
    is_edited       BOOLEAN DEFAULT FALSE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_comments_task ON public.task_comments(task_id);
CREATE INDEX idx_comments_user ON public.task_comments(user_id);

CREATE TRIGGER on_comment_updated
    BEFORE UPDATE ON public.task_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Board members can view comments on tasks in their boards
CREATE POLICY "Board members can view comments"
    ON public.task_comments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_comments.task_id
            AND board_members.user_id = auth.uid()
        )
    );

-- Board members (not viewers) can add comments
CREATE POLICY "Board members can add comments"
    ON public.task_comments
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_comments.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

-- Users can edit their own comments
CREATE POLICY "Users can edit their own comments"
    ON public.task_comments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments; owners/admins can delete any
CREATE POLICY "Comment authors or board admins can delete comments"
    ON public.task_comments
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.board_members ON board_members.board_id = tasks.board_id
            WHERE tasks.id = task_comments.task_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Database View: Board with full details (for dashboard)
-- ============================================================================

CREATE OR REPLACE VIEW public.board_details AS
SELECT
    b.id AS board_id,
    b.title,
    b.description,
    b.background,
    b.is_archived,
    b.owner_id,
    b.created_at,
    b.updated_at,
    p.username AS owner_username,
    p.avatar_url AS owner_avatar,
    (SELECT COUNT(*) FROM public.lists l WHERE l.board_id = b.id AND l.is_archived = FALSE) AS list_count,
    (SELECT COUNT(*) FROM public.tasks t WHERE t.board_id = b.id AND t.is_archived = FALSE) AS task_count,
    (SELECT COUNT(*) FROM public.board_members bm WHERE bm.board_id = b.id) AS member_count
FROM public.boards b
JOIN public.profiles p ON p.id = b.owner_id;

-- ============================================================================
-- Database View: Task with assignees and labels (for task cards)
-- ============================================================================

CREATE OR REPLACE VIEW public.task_details AS
SELECT
    t.id AS task_id,
    t.title,
    t.description,
    t.position,
    t.priority,
    t.due_date,
    t.cover_image,
    t.is_completed,
    t.is_archived,
    t.list_id,
    t.board_id,
    t.created_by,
    t.created_at,
    t.updated_at,
    -- Assignees as JSON array
    COALESCE(
        (SELECT json_agg(json_build_object(
            'id', p.id,
            'username', p.username,
            'avatar_url', p.avatar_url
        ))
        FROM public.task_assignees ta
        JOIN public.profiles p ON p.id = ta.user_id
        WHERE ta.task_id = t.id),
        '[]'::json
    ) AS assignees,
    -- Labels as JSON array
    COALESCE(
        (SELECT json_agg(json_build_object(
            'id', l.id,
            'name', l.name,
            'color', l.color
        ))
        FROM public.task_labels tl
        JOIN public.labels l ON l.id = tl.label_id
        WHERE tl.task_id = t.id),
        '[]'::json
    ) AS labels,
    -- Comment count
    (SELECT COUNT(*) FROM public.task_comments tc WHERE tc.task_id = t.id) AS comment_count
FROM public.tasks t;

-- ============================================================================
-- Function: Reorder list positions within a board
-- ============================================================================

CREATE OR REPLACE FUNCTION public.reorder_lists(
    p_board_id UUID,
    p_list_ids UUID[]
)
RETURNS VOID AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(p_list_ids, 1) LOOP
        UPDATE public.lists
        SET position = (i - 1) * 1000
        WHERE id = p_list_ids[i]
        AND board_id = p_board_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Function: Move a task between lists (drag-and-drop)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.move_task(
    p_task_id UUID,
    p_target_list_id UUID,
    p_new_position INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.tasks
    SET list_id = p_target_list_id,
        position = p_new_position,
        updated_at = NOW()
    WHERE id = p_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Function: Get board statistics
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_board_stats(p_board_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_tasks',      (SELECT COUNT(*) FROM public.tasks WHERE board_id = p_board_id AND is_archived = FALSE),
        'completed_tasks',  (SELECT COUNT(*) FROM public.tasks WHERE board_id = p_board_id AND is_completed = TRUE AND is_archived = FALSE),
        'overdue_tasks',    (SELECT COUNT(*) FROM public.tasks WHERE board_id = p_board_id AND due_date < CURRENT_DATE AND is_completed = FALSE AND is_archived = FALSE),
        'total_lists',      (SELECT COUNT(*) FROM public.lists WHERE board_id = p_board_id AND is_archived = FALSE),
        'total_members',    (SELECT COUNT(*) FROM public.board_members WHERE board_id = p_board_id),
        'tasks_by_priority', (
            SELECT json_object_agg(priority, cnt)
            FROM (
                SELECT priority, COUNT(*) AS cnt
                FROM public.tasks
                WHERE board_id = p_board_id AND is_archived = FALSE
                GROUP BY priority
            ) sub
        )
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
