import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Deleting all data rows from 'complaints' table in Supabase...")
try:
    # Delete all rows where tracking_id is not null/empty
    res = supabase.table("complaints").delete().neq("tracking_id", "NON_EXISTENT_DUMMY_KEY").execute()
    print("SUCCESS: Deleted all complaints rows from Supabase database!")
    print(f"Total deleted rows: {len(res.data) if res.data else 0}")
except Exception as e:
    print("Notice on delete:", e)
