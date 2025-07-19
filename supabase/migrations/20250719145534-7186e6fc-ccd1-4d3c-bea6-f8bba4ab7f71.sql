-- Allow the service role to insert videos (for API access)
CREATE POLICY "Allow service role to insert videos" 
ON public.videos 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Allow the service role to select videos (for API access)
CREATE POLICY "Allow service role to select videos" 
ON public.videos 
FOR SELECT 
TO service_role 
USING (true);