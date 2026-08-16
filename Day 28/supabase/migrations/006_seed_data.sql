-- ============================================================================
-- Day 28 Capstone: Kanban Board Database Schema
-- Migration 006: Seed Data (Sample boards, lists, and tasks)
-- ============================================================================
-- This file provides realistic test data to demonstrate the schema.
-- NOTE: In production, user IDs come from Supabase Auth.
--       For seeding, we create placeholder UUIDs.
-- ============================================================================

-- Placeholder user IDs (replace with real auth IDs in production)
-- User 1: Ali Khan (owner)
-- User 2: Sara Ahmed (admin)
-- User 3: Usman Malik (member)

-- Insert sample profiles (only works if auth.users exist)
-- In a real environment, these are auto-created by the signup trigger.
-- Below is for reference / manual testing only.

/*
INSERT INTO public.profiles (id, username, full_name, email, avatar_url) VALUES
    ('11111111-1111-1111-1111-111111111111', 'alikhan', 'Ali Khan', 'ali@example.com', ''),
    ('22222222-2222-2222-2222-222222222222', 'saraahmed', 'Sara Ahmed', 'sara@example.com', ''),
    ('33333333-3333-3333-3333-333333333333', 'usmanmalik', 'Usman Malik', 'usman@example.com', '');

-- Create a board
INSERT INTO public.boards (id, title, description, background, owner_id) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sprint 12 - Product Launch', 'Main sprint board for Q3 launch', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '11111111-1111-1111-1111-111111111111');

-- Board members (owner is auto-added by trigger, add others)
INSERT INTO public.board_members (board_id, user_id, role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'admin'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member');

-- Create lists
INSERT INTO public.lists (id, title, position, board_id) VALUES
    ('bbbbbbbb-0001-0000-0000-000000000000', '📋 Backlog',      0, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('bbbbbbbb-0002-0000-0000-000000000000', '🚀 To Do',        1000, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('bbbbbbbb-0003-0000-0000-000000000000', '🔨 In Progress',  2000, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('bbbbbbbb-0004-0000-0000-000000000000', '🔍 In Review',    3000, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('bbbbbbbb-0005-0000-0000-000000000000', '✅ Done',          4000, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Create labels
INSERT INTO public.labels (id, name, color, board_id) VALUES
    ('cccccccc-0001-0000-0000-000000000000', 'Bug',         '#ef4444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('cccccccc-0002-0000-0000-000000000000', 'Feature',     '#22c55e', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('cccccccc-0003-0000-0000-000000000000', 'Enhancement', '#3b82f6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('cccccccc-0004-0000-0000-000000000000', 'Urgent',      '#f97316', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('cccccccc-0005-0000-0000-000000000000', 'Design',      '#a855f7', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Create tasks
INSERT INTO public.tasks (id, title, description, position, priority, due_date, list_id, board_id, created_by) VALUES
    -- Backlog
    ('dddddddd-0001-0000-0000-000000000000', 'Research competitor boards',   'Analyze Trello, Asana, Monday features', 0, 'low',    '2026-09-01', 'bbbbbbbb-0001-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0002-0000-0000-000000000000', 'Write API documentation',      'Swagger / OpenAPI spec for all endpoints', 1000, 'medium', '2026-09-15', 'bbbbbbbb-0001-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),

    -- To Do
    ('dddddddd-0003-0000-0000-000000000000', 'Setup Supabase Auth',          'Configure email + Google OAuth providers', 0, 'high',   '2026-08-20', 'bbbbbbbb-0002-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0004-0000-0000-000000000000', 'Design board card component',  'React component with DnD support', 1000, 'medium', '2026-08-22', 'bbbbbbbb-0002-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),

    -- In Progress
    ('dddddddd-0005-0000-0000-000000000000', 'Implement drag and drop',      'Using @dnd-kit/core for list and task reordering', 0, 'urgent', '2026-08-18', 'bbbbbbbb-0003-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0006-0000-0000-000000000000', 'Database schema design',       'Tables for boards, lists, tasks, users', 1000, 'high',   '2026-08-17', 'bbbbbbbb-0003-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),

    -- In Review
    ('dddddddd-0007-0000-0000-000000000000', 'Fix mobile responsive layout', 'Board overflows on screens < 768px', 0, 'medium', '2026-08-19', 'bbbbbbbb-0004-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),

    -- Done
    ('dddddddd-0008-0000-0000-000000000000', 'Project initialization',       'Vite + React + Supabase client setup', 0, 'high',   '2026-08-10', 'bbbbbbbb-0005-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0009-0000-0000-000000000000', 'Create wireframes',            'Figma wireframes for all screens', 1000, 'medium', '2026-08-12', 'bbbbbbbb-0005-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');

-- Assign users to tasks
INSERT INTO public.task_assignees (task_id, user_id) VALUES
    ('dddddddd-0005-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0005-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333'),
    ('dddddddd-0006-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222'),
    ('dddddddd-0003-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
    ('dddddddd-0007-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333');

-- Apply labels to tasks
INSERT INTO public.task_labels (task_id, label_id) VALUES
    ('dddddddd-0005-0000-0000-000000000000', 'cccccccc-0002-0000-0000-000000000000'),  -- Feature
    ('dddddddd-0005-0000-0000-000000000000', 'cccccccc-0004-0000-0000-000000000000'),  -- Urgent
    ('dddddddd-0006-0000-0000-000000000000', 'cccccccc-0002-0000-0000-000000000000'),  -- Feature
    ('dddddddd-0007-0000-0000-000000000000', 'cccccccc-0001-0000-0000-000000000000'),  -- Bug
    ('dddddddd-0003-0000-0000-000000000000', 'cccccccc-0002-0000-0000-000000000000'),  -- Feature
    ('dddddddd-0004-0000-0000-000000000000', 'cccccccc-0005-0000-0000-000000000000');  -- Design

-- Add comments
INSERT INTO public.task_comments (task_id, user_id, content) VALUES
    ('dddddddd-0005-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Started implementing with @dnd-kit. Working on sortable containers first.'),
    ('dddddddd-0005-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Should we also support keyboard navigation for accessibility?'),
    ('dddddddd-0006-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Schema design complete. Waiting for review before running migrations.'),
    ('dddddddd-0007-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Fixed the overflow issue. Needs testing on iPad.');

-- Log some activity
INSERT INTO public.activity_log (board_id, task_id, user_id, action, metadata) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, '11111111-1111-1111-1111-111111111111', 'board_created', '{"title": "Sprint 12 - Product Launch"}'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-0005-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'task_created', '{"title": "Implement drag and drop"}'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-0005-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'task_assigned', '{"assignee": "usmanmalik"}'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, '11111111-1111-1111-1111-111111111111', 'member_added', '{"member": "saraahmed", "role": "admin"}');
*/

-- ============================================================================
-- NOTE: Uncomment the above INSERT statements after creating real users
-- through Supabase Auth, and replace the placeholder UUIDs with actual user IDs.
-- ============================================================================
