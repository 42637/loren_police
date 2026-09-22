# policenew/clean_police_from_users.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Checking 'registered_users' table for Police records...")

res = supabase.table("registered_users").select("*").execute()

police_in_users = []
if res.data:
    for row in res.data:
        v_num = str(row.get("vehicle_number") or "").upper()
        if "POLICE" in v_num:
            police_in_users.append(row)
            print(f"Found Police record in registered_users: ID={row.get('id')}, vehicle_number={v_num}, name={row.get('full_name')}")

if police_in_users:
    print(f"\nDeleting {len(police_in_users)} Police record(s) from 'registered_users'...")
    for p in police_in_users:
        supabase.table("registered_users").delete().eq("id", p["id"]).execute()
        print(f"Deleted {p['vehicle_number']} from registered_users.")
    print("SUCCESS: 'registered_users' table cleaned! No Police data remains in registered_users.")
else:
    print("No Police records found in registered_users.")

# Also check profiles table
print("\nChecking 'profiles' table for Police records...")
res_prof = supabase.table("profiles").select("*").execute()
if res_prof.data:
    for row in res_prof.data:
        v_num = str(row.get("vehicle_number") or row.get("vehicle_reg") or "").upper()
        if "POLICE" in v_num:
            supabase.table("profiles").delete().eq("id", row["id"]).execute()
            print(f"Deleted {v_num} from profiles table.")
print("SUCCESS: Clean up complete!")
