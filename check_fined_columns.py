# policenew/check_fined_columns.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)
res = supabase.table("fined_data").select("*").limit(1).execute()
if res.data:
    print("Existing fined_data columns in Supabase:")
    for k in res.data[0].keys():
        print(f" - {k}")
else:
    print("fined_data is empty or not found.")
