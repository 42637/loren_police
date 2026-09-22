import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

print("Updating existing complaint CMP-2026-08682 using challan_status, current_stage, officer_notes...")
try:
    res = supabase.table("complaints").update({
        "challan_status": "VERIFIED",
        "current_stage": 3,
        "officer_notes": "Dispute verified and accepted by Police Officer. Penalty revoked."
    }).eq("tracking_id", "CMP-2026-08682").execute()
    print("SUCCESS: Updated complaint row:", res.data)
except Exception as e:
    print("ERROR:", e)
