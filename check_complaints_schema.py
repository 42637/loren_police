import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

res = supabase.table("complaints").select("*").limit(1).execute()
if res.data:
    print("Complaints Table Columns:")
    for col in res.data[0].keys():
        print(f" - '{col}': {res.data[0][col]}")
else:
    print("No data in complaints table.")
