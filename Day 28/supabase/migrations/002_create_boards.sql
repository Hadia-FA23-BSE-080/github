-- ============================================================================
-- Day 28 Capstone: Kanban Board Database Schema
-- Migration 002: Boards Table
-- ============================================================================
-- A Board is the top-level container (e.g. "Sprint 12", "Product Roadmap").
-- Each board is owned by a user and can have multiple members.
-- ============================================================================

-- Boards Table
CREATE TABLE IF NOT EXISTS public.boards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
    description     TEXT DEFAULT '',
    background      TEXT DEFAULT 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    is_archived     BOOLEAN DEFAULT FALSE NOT NULL,
    owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_boards_owner ON public.boards(owner_id);
CREATE INDEX idx_boards_archived ON public.boards(is_archived);

-- Auto-update `updated_at`
CREATE TRIGGER on_board_updated
    BEFORE UPDATE ON public.boards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Board Members (Many-to-Many: Boards ↔ Users)
-- ============================================================================
-- Roles: 'owner', 'admin', 'member', 'viewer'
-- ============================================================================

CREATE TYPE board_role AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE IF NOT EXISTS public.board_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role            board_role DEFAULT 'member' NOT NULL,
    joined_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Each user can only be a member of a board once
    UNIQUE (board_id, user_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_board_members_board ON public.board_members(board_id);
CREATE INDEX idx_board_members_user ON public.board_members(user_id);

-- ============================================================================
-- Row Level Security for Boards
-- ============================================================================

ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- SELECT: Board members can view the board
CREATE POLICY "Board members can view boards"
    ON public.boards
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = boards.id
            AND board_members.user_id = auth.uid()
        )
    );

-- INSERT: Any authenticated user can create a board
CREATE POLICY "Authenticated users can create boards"
    ON public.boards
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Only owner or admin can update
CREATE POLICY "Board owners and admins can update boards"
    ON public.boards
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = boards.id
            AND board_members.user_id = auth.uid()
            AND board_members.role IN ('owner', 'admin')
        )
    );

-- DELETE: Only owner can delete
CREATE POLICY "Board owners can delete boards"
    ON public.boards
    FOR DELETE
    USING (auth.uid() = owner_id);

-- ============================================================================
-- Row Level Security for Board Members
-- ============================================================================

ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- SELECT: Board members can see other members
CREATE POLICY "Board members can view membership"
    ON public.board_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members AS bm
            WHERE bm.board_id = board_members.board_id
            AND bm.user_id = auth.uid()
        )
    );

-- INSERT: Owner/admin can add members
CREATE POLICY "Board owners and admins can add members"
    ON public.board_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members AS bm
            WHERE bm.board_id = board_members.board_id
            AND bm.user_id = auth.uid()
            AND bm.role IN ('owner', 'admin')
        )
    );

-- DELETE: Owner/admin can remove members, users can leave
CREATE POLICY "Board owners/admins can remove or users can leave"
    ON public.board_members
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.board_members AS bm
            WHERE bm.board_id = board_members.board_id
            AND bm.user_id = auth.uid()
            AND bm.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Trigger: Auto-add creator as board owner in board_members
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_board()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.board_members (board_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_board_created
    AFTER INSERT ON public.boards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_board();
