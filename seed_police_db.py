# policenew/seed_police_db.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

demo_officer = {
    "police_id": "POLICE001",
    "full_name": "K. V. R. Chowdhary",
    "rank": "Inspector of Police",
    "badge_number": "AP-TP-0842",
    "email": "officer.chowdhary@appolice.gov.in",
    "mobile": "9848022334",
    "password": "police123",
    "station": "Bhimavaram Traffic PS"
}

try:
    # Try inserting demo officer into Supabase registered_police table
    res = supabase.table("registered_police").insert(demo_officer).execute()
    print("SUCCESS: Seeded Demo Officer POLICE001 into Supabase registered_police table!")
    print(res.data)
except Exception as e:
    print(f"Insert result / notice: {e}")

res = supabase.table("registered_police").select("*").execute()
print(f"Current registered_police rows count: {len(res.data)}")
for row in res.data:
    print(f" - Police ID: {row.get('police_id')} | Name: {row.get('full_name')} | Email: {row.get('email')} | Station: {row.get('station')}")
