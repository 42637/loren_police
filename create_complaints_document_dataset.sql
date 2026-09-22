-- ==============================================================================
-- e-Challan Official Document & Complaint Redressal Dataset - Supabase Setup Script
-- Target Table: 'complaints' (Stores generated E-Challan dispute records & documents)
-- Target Project URL: https://qcgcqstvrnbacwqksfgo.supabase.co
-- ==============================================================================

-- Step 1: Create 'complaints' table with complete document & dispute metadata
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  challan_id TEXT NOT NULL,
  vehicle_number TEXT NULL,
  user_name TEXT NULL,
  father_name TEXT NULL,
  engine_number TEXT NULL,
  chassis_number TEXT NULL,
  vehicle_details TEXT NULL,
  violation_tagged TEXT NULL,
  violation_reason TEXT NULL,
  fine_amount NUMERIC NULL DEFAULT 1000.0,
  location_name TEXT NULL,
  latitude DOUBLE PRECISION NULL DEFAULT 16.5062,
  longitude DOUBLE PRECISION NULL DEFAULT 80.6480,
  claim_category TEXT NULL,
  description TEXT NOT NULL,
  evidence_file_name TEXT NULL,
  camera_image_url TEXT NULL,
  date_submitted TEXT NULL,
  current_stage INT DEFAULT 2,
  stage_history TEXT NULL,
  officer_notes TEXT NULL,
  status TEXT DEFAULT 'UNDER_REVIEW',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT complaints_pkey PRIMARY KEY (id)
);

-- Step 2: Idempotent Column Additions
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS tracking_id TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS engine_number TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS chassis_number TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS vehicle_details TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS violation_reason TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS fine_amount NUMERIC;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS location_name TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS camera_image_url TEXT;

-- Step 3: Enable RLS Policy
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to complaints" ON public.complaints;
CREATE POLICY "Allow public access to complaints" ON public.complaints FOR ALL USING (true);

-- Step 4: Verify Complaints Table
SELECT * FROM public.complaints;
