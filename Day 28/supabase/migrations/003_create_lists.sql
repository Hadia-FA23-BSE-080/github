-- ============================================================================
-- Day 28 Capstone: Kanban Board Database Schema
-- Migration 003: Lists Table
-- ============================================================================
-- A List (column) belongs to a Board. (e.g. "To Do", "In Progress", "Done")
-- `position` controls the left-to-right ordering via drag-and-drop.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 80),
    position        INTEGER NOT NULL DEFAULT 0,
    board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    is_archived     BOOLEAN DEFAULT FALSE NOT NULL,
    color           TEXT DEFAULT NULL,   -- optional accent color for the list header
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_lists_board ON public.lists(board_id);
CREATE INDEX idx_lists_position ON public.lists(board_id, position);

-- Auto-update `updated_at`
CREATE TRIGGER on_list_updated
    BEFORE UPDATE ON public.lists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Row Level Security for Lists
-- ============================================================================

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- SELECT: Board members can view lists
CREATE POLICY "Board members can view lists"
    ON public.lists
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = lists.board_id
            AND board_members.user_id = auth.uid()
        )
    );

-- INSERT: Board members (not viewers) can create lists
CREATE POLICY "Board members can create lists"
    ON public.lists
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = lists.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

-- UPDATE: Board members (not viewers) can update lists
CREATE POLICY "Board members can update lists"
    ON public.lists
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = lists.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin', 'member')
        )
    );

-- DELETE: Only owner/admin can delete lists
CREATE POLICY "Board owners and admins can delete lists"
    ON public.lists
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = lists.board_id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );
