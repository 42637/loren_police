# policenew/update_complaints_schema.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Checking complaints table in Supabase...")

try:
    res = supabase.table("complaints").select("*").limit(1).execute()
    print("SUCCESS: Table 'complaints' EXISTS in Supabase!")
    if res.data:
        print("Existing columns in complaints:")
        for k in res.data[0].keys():
            print(f" - {k}")
    else:
        print("Table 'complaints' is currently empty.")
except Exception as e:
    print(f"NOTICE: Error querying complaints table: {e}")
