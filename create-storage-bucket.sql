-- Create the storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Allow service role to upload (for backend API)
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Allow service role to delete
CREATE POLICY "Service role can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );
