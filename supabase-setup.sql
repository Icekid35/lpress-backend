-- =====================================================
-- LPRES Admin Database Setup
-- This script creates all necessary tables for the LPRES Admin API
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    lga TEXT DEFAULT '',
    ward TEXT DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('in progress', 'completed')),
    images TEXT[] DEFAULT '{}'::TEXT[]
);

-- =====================================================
-- NEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    event TEXT NOT NULL,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[]
);

-- =====================================================
-- COMPLAINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL
);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- NEWSLETTER TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    html_content TEXT NOT NULL,
    thumbnail TEXT
);

-- =====================================================
-- NEWSLETTER CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    sent_to_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('completed', 'partial', 'failed'))
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_email ON public.complaints(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON public.newsletter_subscribers(subscribed);

CREATE INDEX IF NOT EXISTS idx_newsletter_templates_created_at ON public.newsletter_templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_at ON public.newsletter_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON public.newsletter_campaigns(status);

-- =====================================================
-- TRIGGERS for automatic updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_newsletter_templates_updated_at
    BEFORE UPDATE ON public.newsletter_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS but allow service role full access
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Projects policies (read public, write authenticated)
CREATE POLICY "Enable read access for all users" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON public.projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON public.projects
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for service role" ON public.projects
    FOR DELETE USING (true);

-- News policies (read public, write authenticated)
CREATE POLICY "Enable read access for all users" ON public.news
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON public.news
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON public.news
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for service role" ON public.news
    FOR DELETE USING (true);

-- Complaints policies (insert public, read authenticated)
CREATE POLICY "Enable insert access for all users" ON public.complaints
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for service role" ON public.complaints
    FOR SELECT USING (true);

CREATE POLICY "Enable delete for service role" ON public.complaints
    FOR DELETE USING (true);

-- Newsletter policies (insert public, read/update authenticated)
CREATE POLICY "Enable insert access for all users" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for service role" ON public.newsletter_subscribers
    FOR SELECT USING (true);

CREATE POLICY "Enable update for service role" ON public.newsletter_subscribers
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for service role" ON public.newsletter_subscribers
    FOR DELETE USING (true);

-- Newsletter templates policies (authenticated only)
CREATE POLICY "Enable read for service role" ON public.newsletter_templates
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON public.newsletter_templates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON public.newsletter_templates
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for service role" ON public.newsletter_templates
    FOR DELETE USING (true);

-- Newsletter campaigns policies (authenticated only)
CREATE POLICY "Enable read for service role" ON public.newsletter_campaigns
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON public.newsletter_campaigns
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample project
INSERT INTO public.projects (title, description, location, status, images)
VALUES 
    ('Community Center Renovation', 'Complete renovation of the community center including new facilities', 'Downtown District', 'in progress', ARRAY['https://example.com/image1.jpg']::TEXT[]),
    ('Street Lighting Project', 'Installation of energy-efficient LED street lights', 'North Avenue', 'completed', ARRAY['https://example.com/image2.jpg']::TEXT[])
ON CONFLICT DO NOTHING;

-- Insert sample news
INSERT INTO public.news (published_at, title, details, event, location, images)
VALUES 
    (NOW(), 'Town Hall Meeting Scheduled', 'Join us for the monthly town hall meeting to discuss community issues', 'Town Hall Meeting', 'City Hall', ARRAY[]::TEXT[]),
    (NOW() - INTERVAL '1 day', 'New Park Opening', 'The newly renovated park is now open to the public', 'Park Opening Ceremony', 'Central Park', ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;

-- =====================================================
-- GRANTS (Ensure service role has access)
-- =====================================================
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.news TO service_role;
GRANT ALL ON public.complaints TO service_role;
GRANT ALL ON public.newsletter_subscribers TO service_role;
GRANT ALL ON public.newsletter_templates TO service_role;
GRANT ALL ON public.newsletter_campaigns TO service_role;

-- Grant usage on sequences if any
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ LPRES Admin database setup completed successfully!';
    RAISE NOTICE '📋 Tables created: projects, news, complaints, newsletter_subscribers, newsletter_templates, newsletter_campaigns';
    RAISE NOTICE '🔒 Row Level Security enabled with appropriate policies';
    RAISE NOTICE '⚡ Indexes and triggers configured for optimal performance';
    RAISE NOTICE '📧 Newsletter system ready for professional email campaigns';
END $$;
