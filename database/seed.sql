-- ==============================================================================
-- SupaChat Database Seed Data
-- Provides realistic blog analytics data for testing NL-to-SQL logic
-- ==============================================================================

-- Clean existing data for idempotency
TRUNCATE TABLE public.article_engagement CASCADE;
TRUNCATE TABLE public.article_views CASCADE;
TRUNCATE TABLE public.articles CASCADE;
TRUNCATE TABLE public.topics CASCADE;
TRUNCATE TABLE public.authors CASCADE;

-- 1. Insert Topics
INSERT INTO public.topics (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Artificial Intelligence'),
    ('22222222-2222-2222-2222-222222222222', 'DevOps'),
    ('33333333-3333-3333-3333-333333333333', 'Cloud Computing'),
    ('44444444-4444-4444-4444-444444444444', 'Cybersecurity'),
    ('55555555-5555-5555-5555-555555555555', 'Web Development');

-- 2. Insert Authors
INSERT INTO public.authors (id, first_name, last_name, email) VALUES
    ('aaaa0000-0000-0000-0000-000000000000', 'Alice', 'Smith', 'alice.smith@example.com'),
    ('bbbb0000-0000-0000-0000-000000000000', 'Bob', 'Jones', 'bob.jones@example.com'),
    ('cccc0000-0000-0000-0000-000000000000', 'Charlie', 'Brown', 'charlie.brown@example.com');

-- 3. Insert Articles
INSERT INTO public.articles (id, title, slug, author_id, topic_id, published_at, is_published) VALUES
    -- AI
    ('a1a1a1a1-1111-1111-1111-111111111111', 'The Future of LLMs', 'future-of-llms', 'aaaa0000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '2025-10-01 09:00:00Z', TRUE),
    ('a2a2a2a2-1111-1111-1111-111111111111', 'RAG vs Fine-tuning', 'rag-vs-finetuning', 'aaaa0000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '2025-11-15 10:00:00Z', TRUE),
    -- DevOps
    ('b1b1b1b1-2222-2222-2222-222222222222', 'Kubernetes for Beginners', 'kubernetes-beginners', 'bbbb0000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', '2025-09-20 08:30:00Z', TRUE),
    ('b2b2b2b2-2222-2222-2222-222222222222', 'CI/CD Best Practices 2026', 'cicd-best-practices', 'bbbb0000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', '2026-01-10 11:15:00Z', TRUE),
    -- Cloud
    ('c1c1c1c1-3333-3333-3333-333333333333', 'AWS vs GCP vs Azure', 'aws-vs-gcp-azure', 'cccc0000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', '2025-08-05 14:00:00Z', TRUE),
    -- Security
    ('d1d1d1d1-4444-4444-4444-444444444444', 'Zero Trust Architecture', 'zero-trust-architecture', 'cccc0000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', '2025-12-01 09:45:00Z', TRUE),
    -- Web Dev
    ('e1e1e1e1-5555-5555-5555-555555555555', 'React Server Components', 'react-server-components', 'aaaa0000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', '2026-02-20 13:20:00Z', TRUE);

-- 4. Insert Article Engagement
INSERT INTO public.article_engagement (article_id, likes_count, comments_count, shares_count, bookmarks_count) VALUES
    ('a1a1a1a1-1111-1111-1111-111111111111', 1250, 85, 320, 450),
    ('a2a2a2a2-1111-1111-1111-111111111111', 890, 42, 150, 210),
    ('b1b1b1b1-2222-2222-2222-222222222222', 2100, 150, 600, 850),
    ('b2b2b2b2-2222-2222-2222-222222222222', 1540, 95, 410, 390),
    ('c1c1c1c1-3333-3333-3333-333333333333', 3420, 210, 890, 1200),
    ('d1d1d1d1-4444-4444-4444-444444444444', 980, 55, 205, 310),
    ('e1e1e1e1-5555-5555-5555-555555555555', 1850, 120, 480, 620);

-- 5. Insert Article Views (Simulated time-series over the last 30 days)
-- To keep the script small but data-rich, we generate the daily views using a CTE.
INSERT INTO public.article_views (article_id, view_date, view_count, unique_visitors, avg_time_on_page_seconds)
SELECT 
    a.id,
    gen_date::date,
    -- Randomize views based on article's topic 'popularity' base multiplier to create distinct trends
    CAST(
        (RANDOM() * 100 + 50) * 
        CASE 
            WHEN a.topic_id = '11111111-1111-1111-1111-111111111111' THEN 3.5  -- AI high
            WHEN a.topic_id = '33333333-3333-3333-3333-333333333333' THEN 2.5  -- Cloud med-high
            ELSE 1.5 
        END
    AS INTEGER),
    -- Unique visitors usually 60-80% of total views
    CAST(
        (RANDOM() * 100 + 50) * 0.7 * 
        CASE 
            WHEN a.topic_id = '11111111-1111-1111-1111-111111111111' THEN 3.5 
            WHEN a.topic_id = '33333333-3333-3333-3333-333333333333' THEN 2.5 
            ELSE 1.5 
        END
    AS INTEGER),
    -- Avg time on page between 90s and 300s
    CAST(RANDOM() * 210 + 90 AS INTEGER)
FROM 
    public.articles a
CROSS JOIN 
    generate_series(
        CURRENT_DATE - INTERVAL '120 days',
        CURRENT_DATE,
        '1 day'::interval
    ) AS gen_date;
