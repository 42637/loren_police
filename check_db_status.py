# policenew/check_db_status.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

print("==================================================")
print(f"Supabase Project URL: {url}")
print("==================================================")

supabase = create_client(url, key)

try:
    res = supabase.table("registered_police").select("*").limit(5).execute()
    print("SUCCESS: Table 'registered_police' EXISTS in Supabase!")
    print(f"Row count: {len(res.data)}")
    for row in res.data:
        print(f" - Officer ID: {row.get('police_id')}, Name: {row.get('full_name')}, Rank: {row.get('rank')}")
except Exception as e:
    print(f"NOTICE: Table 'registered_police' is not yet created in PostgreSQL schema.")
    print(f"Error: {e}")
