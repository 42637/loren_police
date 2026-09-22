# policenew/seed_complaint_record.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Seeding E-Challan document complaint record into Supabase 'complaints' dataset...")

record = {
    "complaint_id": "CMP-2026-08821",
    "tracking_id": "CMP-2026-08821",
    "challan_id": "CHL-2026-8821",
    "vehicle_number": "AP37 BT 6797",
    "citizen_name": "Rajesh Kumar Varma",
    "contact_mobile": "9848022334",
    "dispute_reason": "Wrong Violation Detected by Camera",
    "detailed_statement": "The vehicle was stopped at green light signal, camera misidentified lane position.",
    "status": "UNDER_REVIEW"
}

try:
    res = supabase.table("complaints").insert(record).execute()
    print("SUCCESS: Inserted complaint into Supabase!")
    print(res.data)
except Exception as e:
    print(f"NOTICE: Error inserting complaint: {e}")
