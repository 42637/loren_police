import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

try:
    # Try calling a generic SQL rpc if created
    res = supabase.rpc("exec_sql", {"sql": "ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS vehicle_number TEXT;"}).execute()
    print("RPC exec_sql result:", res.data)
except Exception as e:
    print("RPC exec_sql notice:", e)
