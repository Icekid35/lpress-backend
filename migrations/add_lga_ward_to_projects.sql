-- Migration: Add LGA and Ward fields to projects table
-- Run this if your projects table already exists

-- Add lga column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='lga') THEN
        ALTER TABLE public.projects ADD COLUMN lga TEXT DEFAULT '';
    END IF;
END $$;

-- Add ward column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='ward') THEN
        ALTER TABLE public.projects ADD COLUMN ward TEXT DEFAULT '';
    END IF;
END $$;

-- Update existing projects to have empty strings for lga and ward
UPDATE public.projects 
SET lga = COALESCE(lga, ''), 
    ward = COALESCE(ward, '')
WHERE lga IS NULL OR ward IS NULL;
