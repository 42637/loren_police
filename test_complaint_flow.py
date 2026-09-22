# policenew/test_complaint_flow.py
import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Simulating User submitting complaint on fine 'CHL-2026-8821'...")

# 1. Insert into complaints table
new_complaint = {
    "tracking_id": "CMP-2026-0045",
    "challan_id": "CHL-2026-8821",
    "violation_tagged": "Wrong Violation Detected by Camera",
    "claim_category": "Wrong Violation Detected by Camera",
    "description": "Vehicle was already in the center of junction when signal turned yellow during heavy rain. Stopped safely to avoid collision with emergency ambulance approaching from side lane.",
    "evidence_file_name": "dashcam_clip_02aug2026.jpg",
    "date_submitted": "03 Aug 2026, 10:15 IST",
    "current_stage": 2,
    "officer_notes": "Complaint submitted by citizen in User Portal. Under officer verification.",
    "status": "UNDER_REVIEW"
}

try:
    res = supabase.table("complaints").upsert(new_complaint, on_conflict="tracking_id").execute()
    print("SUCCESS: Inserted complaint into Supabase 'complaints' table!")
except Exception as e:
    print(f"Error inserting complaint: {e}")

# 2. Update fined_data status to UNDER_REVIEW
try:
    supabase.table("fined_data").update({"status": "UNDER_REVIEW"}).or_("challan_number.eq.CHL-2026-8821,detection_id.eq.DET-2026-8821").execute()
    print("SUCCESS: Updated fine status in Supabase 'fined_data' table to UNDER_REVIEW!")
except Exception as e:
    print(f"Error updating fined_data: {e}")
