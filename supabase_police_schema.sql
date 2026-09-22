-- ==============================================================================
-- Police Control Room Portal - Supabase Production Database Setup Script
-- Table: 'registered_police' (Dedicated Police Officer Registrations & Auth)
-- Target Project URL: https://qcgcqstvrnbacwqksfgo.supabase.co
-- ==============================================================================

-- Step 1: Drop incomplete table if present to ensure clean schema build
DROP TABLE IF EXISTS public.registered_police CASCADE;

-- Step 2: Create 'registered_police' Table with all required columns
CREATE TABLE public.registered_police (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  police_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'Inspector of Police'::TEXT,
  badge_number TEXT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  password TEXT NOT NULL,
  station TEXT NOT NULL DEFAULT 'Bhimavaram Traffic PS'::TEXT,
  address TEXT NULL DEFAULT 'Traffic Police Station, AP'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT registered_police_pkey PRIMARY KEY (id)
);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.registered_police ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Public Access Policy
DROP POLICY IF EXISTS "Allow public access to registered_police" ON public.registered_police;
CREATE POLICY "Allow public access to registered_police" ON public.registered_police FOR ALL USING (true);

-- Step 5: Seed Default Demo Police Officer (POLICE001)
INSERT INTO public.registered_police (
  id, police_id, full_name, rank, badge_number, email, mobile, password, station, address
)
VALUES (
  gen_random_uuid(),
  'POLICE001',
  'K. V. R. Chowdhary',
  'Inspector of Police',
  'AP-TP-0842',
  'officer.chowdhary@appolice.gov.in',
  '9848022334',
  'police123',
  'Bhimavaram Traffic PS',
  'Bhimavaram Traffic PS, AP'
)
ON CONFLICT (police_id) DO NOTHING;

-- Step 6: Verify Created Table
SELECT * FROM public.registered_police;
