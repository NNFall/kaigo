-- Add new fields to contact_requests table for enhanced admin functionality
ALTER TABLE public.contact_requests 
ADD COLUMN interested_project TEXT,
ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed'));

-- Create index for better performance on status filtering
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_project ON public.contact_requests(interested_project);