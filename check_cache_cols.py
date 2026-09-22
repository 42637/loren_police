import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

print("Checking PostgREST select * on complaints...")
try:
    res = supabase.table("complaints").select("*").limit(1).execute()
    print("Complaints table select result:", res.data)
except Exception as e:
    print("Select error:", e)

# Test fields one by one to see which fields trigger PGRST204
fields = ["tracking_id", "challan_id", "status", "current_stage", "officer_notes", "vehicle_number", "description", "date_submitted"]
for field in fields:
    try:
        r = supabase.table("complaints").select(field).limit(1).execute()
        print(f"  Field '{field}' -> ALLOWED")
    except Exception as e:
        print(f"  Field '{field}' -> ERROR: {e}")
