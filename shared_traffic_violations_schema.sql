-- ==============================================================================
-- e-Challan Shared Traffic Violation Dataset - Supabase Production Setup Script
-- Target Table: 'fined_data' (Shared across policenew and usernew applications)
-- Target Project URL: https://qcgcqstvrnbacwqksfgo.supabase.co
-- ==============================================================================

-- Step 1: Create 'fined_data' table with all required violation & vehicle columns
CREATE TABLE IF NOT EXISTS public.fined_data (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  detection_id TEXT NOT NULL,
  challan_number TEXT NULL,
  vehicle_number TEXT NOT NULL,
  user_name TEXT NULL,
  owner_name TEXT NULL,
  father_name TEXT NULL,
  vehicle_details TEXT NULL,
  engine_number TEXT NULL,
  chassis_number TEXT NULL,
  violation_reason TEXT NULL,
  violation_type TEXT NOT NULL,
  fine_amount NUMERIC NULL DEFAULT 1000.0,
  violation_place TEXT NULL,
  location_name TEXT NULL,
  latitude DOUBLE PRECISION NULL DEFAULT 16.5062,
  longitude DOUBLE PRECISION NULL DEFAULT 80.6480,
  violation_date_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  issued_date_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  image_url TEXT NULL,
  camera_image_url TEXT NULL,
  plate_crop_url TEXT NULL,
  camera_id TEXT NULL DEFAULT 'CAM-VJW-01'::TEXT,
  camera_direction TEXT NULL DEFAULT 'Northbound'::TEXT,
  speed_recorded NUMERIC NULL DEFAULT 0.0,
  speed_limit NUMERIC NULL DEFAULT 50.0,
  status TEXT NULL DEFAULT 'ISSUED'::TEXT,
  payment_status TEXT NULL DEFAULT 'UNPAID'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT fined_data_pkey PRIMARY KEY (id),
  CONSTRAINT fined_data_detection_id_key UNIQUE (detection_id)
) TABLESPACE pg_default;

-- Step 2: Idempotent Migrations (Add missing columns if table already exists)
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS vehicle_details TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS engine_number TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS chassis_number TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS violation_reason TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS violation_place TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS camera_image_url TEXT;
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS violation_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.fined_data ADD COLUMN IF NOT EXISTS issued_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 3: Enable Row Level Security (RLS) & Grant Access Policy
ALTER TABLE public.fined_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to fined_data" ON public.fined_data;
CREATE POLICY "Allow public access to fined_data" ON public.fined_data FOR ALL USING (true);

-- Step 4: Seed Sample Violation Records for Shared Application Dataset
INSERT INTO public.fined_data (
  detection_id, challan_number, vehicle_number, user_name, owner_name, father_name,
  vehicle_details, engine_number, chassis_number, violation_reason, violation_type,
  fine_amount, violation_place, location_name, latitude, longitude,
  violation_date_time, issued_date_time, image_url, camera_image_url, plate_crop_url,
  camera_id, camera_direction, speed_recorded, speed_limit, status, payment_status, created_at
)
VALUES
  (
    'DET-2026-8821', 'CHL-2026-8821', 'AP37 BT 6797', 'Rajesh Kumar Varma', 'Rajesh Kumar Varma', 'S. K. Varma',
    'Hero Splendor Plus 110cc - Metallic Black (2-Wheeler)', 'ENG-4B12-984210', 'CHS-8842-109482',
    'Over-speeding (74 km/h in 50 km/h speed zone)', 'Over-speeding (74 km/h in 50 km/h speed zone)',
    1000.0, 'Janpath Intersection, Vijayawada', 'Janpath Intersection, Vijayawada', 16.5062, 80.6480,
    '2026-08-24T14:32:00Z', '2026-08-24T15:00:00Z',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
    'CAM-VJW-04', 'Northbound', 74.0, 50.0, 'ISSUED', 'UNPAID', '2026-08-24T14:32:00Z'
  ),
  (
    'DET-2026-4412', 'CHL-2026-4412', 'AP37 BT 6797', 'Rajesh Kumar Varma', 'Rajesh Kumar Varma', 'S. K. Varma',
    'Hero Splendor Plus 110cc - Metallic Black (2-Wheeler)', 'ENG-4B12-984210', 'CHS-8842-109482',
    'Riding without Safety Helmet on Public Road', 'Riding without Helmet',
    500.0, 'Benz Circle Junction, Vijayawada', 'Benz Circle Junction, Vijayawada', 16.5020, 80.6450,
    '2026-08-12T09:15:00Z', '2026-08-12T09:45:00Z',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&auto=format&fit=crop&q=80',
    'CAM-VJW-01', 'Southbound', 0.0, 50.0, 'RESOLVED', 'PAID', '2026-08-12T09:15:00Z'
  ),
  (
    'DET-2026-1029', 'CHL-2026-1029', 'AP37 BT 6797', 'Rajesh Kumar Varma', 'Rajesh Kumar Varma', 'S. K. Varma',
    'Hero Splendor Plus 110cc - Metallic Black (2-Wheeler)', 'ENG-4B12-984210', 'CHS-8842-109482',
    'Red Traffic Signal Jumping at Busy Intersection', 'Signal Jump',
    1000.0, 'Ring Road Junction, Vijayawada', 'Ring Road Junction, Vijayawada', 16.5110, 80.6520,
    '2026-08-02T18:45:00Z', '2026-08-02T19:10:00Z',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
    'CAM-VJW-09', 'Eastbound', 0.0, 50.0, 'UNDER_REVIEW', 'UNPAID', '2026-08-02T18:45:00Z'
  ),
  (
    'DET-2026-9951', 'CHL-2026-9951', 'AP39 C 1234', 'Venkata Raman Rao', 'Venkata Raman Rao', 'R. V. Rao',
    'Honda City 1.5 i-VTEC - Pearl White (4-Wheeler Sedan)', 'ENG-HC15-773190', 'CHS-HC99-441029',
    'Driving without Seatbelt & Mobile Phone Usage', 'No Seatbelt / Mobile Usage',
    1500.0, 'Eluru Road Traffic Flyover, Vijayawada', 'Eluru Road Traffic Flyover, Vijayawada', 16.5185, 80.6321,
    '2026-09-01T11:20:00Z', '2026-09-01T11:40:00Z',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
    'CAM-VJW-12', 'Westbound', 62.0, 50.0, 'ISSUED', 'UNPAID', '2026-09-01T11:20:00Z'
  ),
  (
    'DET-2026-3382', 'CHL-2026-3382', 'TS09 FA 5678', 'Suresh Chandra Prasad', 'Suresh Chandra Prasad', 'M. S. Prasad',
    'Hyundai Creta SX - Titan Grey (SUV)', 'ENG-HY16-559102', 'CHS-HY33-882019',
    'Illegal Parking in No-Parking Towing Zone', 'Illegal Parking in Towing Zone',
    750.0, 'Mg Road Commercial Hub, Vijayawada', 'Mg Road Commercial Hub, Vijayawada', 16.5089, 80.6412,
    '2026-09-03T16:05:00Z', '2026-09-03T16:25:00Z',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80',
    'CAM-VJW-03', 'Northbound', 0.0, 50.0, 'ISSUED', 'UNPAID', '2026-09-03T16:05:00Z'
  )
ON CONFLICT (detection_id) DO NOTHING;

SELECT * FROM public.fined_data;
