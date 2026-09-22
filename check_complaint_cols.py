# policenew/check_complaint_cols.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

# Test fields one by one to see existing schema
test_record = {
    "tracking_id": "TEST-001",
    "challan_id": "CHL-001",
    "violation_tagged": "Over-speeding",
    "claim_category": "Wrong Violation",
    "description": "Test description",
    "evidence_file_name": "proof.jpg",
    "date_submitted": "Today",
    "current_stage": 2,
    "officer_notes": "Under review"
}

try:
    res = supabase.table("complaints").insert(test_record).execute()
    print("SUCCESS: Inserted test record into complaints table!")
    print(res.data)
except Exception as e:
    print(f"NOTICE: {e}")
