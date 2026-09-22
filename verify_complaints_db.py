import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

res = supabase.table("complaints").select("tracking_id, challan_id, vehicle_number, description").execute()

print("--- VERIFYING COMPLAINTS IN SUPABASE DB ---")
print(f"Total Complaints Rows: {len(res.data)}")
for row in res.data:
    print(f"Tracking ID: {row.get('tracking_id')} | Challan ID: {row.get('challan_id')} | Vehicle Number: '{row.get('vehicle_number')}'")
