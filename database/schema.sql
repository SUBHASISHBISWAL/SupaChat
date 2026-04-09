-- ==============================================================================
-- SupaChat Database Schema
-- Provides core analytics tables and the RPC function for read-only querying
-- ==============================================================================

-- 1. Topics Table (Categories for blog posts)
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Authors Table (Blog writers)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Articles Table (Core blog posts configuration)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE RESTRICT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Article Views Table (Time-series data for chart plotting)
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    view_date DATE NOT NULL,
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    unique_visitors INTEGER DEFAULT 0 CHECK (unique_visitors >= 0),
    avg_time_on_page_seconds INTEGER DEFAULT 0 CHECK (avg_time_on_page_seconds >= 0),
    UNIQUE(article_id, view_date)
);

-- 5. Article Engagement Table (Social metrics)
CREATE TABLE IF NOT EXISTS public.article_engagement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INTEGER DEFAULT 0 CHECK (comments_count >= 0),
    shares_count INTEGER DEFAULT 0 CHECK (shares_count >= 0),
    bookmarks_count INTEGER DEFAULT 0 CHECK (bookmarks_count >= 0),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id)
);

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_articles_topic_id ON public.articles(topic_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at);
CREATE INDEX IF NOT EXISTS idx_article_views_date ON public.article_views(view_date);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);

-- ==============================================================================
-- Security / RPC Extensions
-- ==============================================================================

-- This function allows the backend to execute read-only SQL via Supabase RPC.
-- By using SECURITY DEFINER and doing an explicit SELECT validation, we provide
-- a safe execution context for LLM-generated analytics queries.
CREATE OR REPLACE FUNCTION public.execute_readonly_query(query_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSON;
BEGIN
    -- Input validation: ensure query strictly starts with SELECT (case-insensitive)
    -- This adds a layer of defense-in-depth on top of the backend validation.
    IF NOT (lower(trim(query_text)) LIKE 'select%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed for execution';
    END IF;

    -- Protect against data modification keywords, even if embedded
    IF (query_text ~* '\m(?:insert|update|delete|drop|alter|truncate|grant|revoke|commit|rollback)\M') THEN
        RAISE EXCEPTION 'Restricted SQL keywords detected in query';
    END IF;

    -- Execute the query and aggregate the results into a JSON array
    EXECUTE 'SELECT COALESCE(json_agg(row_to_json(t)), ''[]''::json) FROM (' || query_text || ') t'
    INTO result_data;

    RETURN result_data;
EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise with a clean, user-friendly message that doesn't leak DB internals heavily
        RAISE EXCEPTION 'Query execution failed: %', SQLERRM;
END;
$$;
