import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

print("1. Inserting test complaint into complaints table...")
test_tracking_id = "CMP-TEST-ACCEPT-999"
test_challan_id = "CHL-TEST-999"

insert_data = {
    "tracking_id": test_tracking_id,
    "challan_id": test_challan_id,
    "vehicle_number": "AP37 BT 6797",
    "description": "Test complaint for accept button verification",
    "status": "UNDER_REVIEW",
    "current_stage": 2
}

try:
    ins_res = supabase.table("complaints").upsert([insert_data], on_conflict="tracking_id").execute()
    print("Inserted complaint row:", ins_res.data)
except Exception as e:
    print("Insert error:", e)

print("\n2. Executing Accept/Verify update on complaints table...")
update_payload = {
    "status": "VERIFIED",
    "current_stage": 3,
    "officer_notes": "Dispute verified and accepted by Police Officer. Penalty revoked."
}

try:
    upd_res = supabase.table("complaints").update(update_payload).eq("tracking_id", test_tracking_id).execute()
    print("SUCCESS: Updated complaint row:", upd_res.data)
except Exception as e:
    print("Update error:", e)

print("\n3. Verifying updated row from Supabase database...")
verify_res = supabase.table("complaints").select("*").eq("tracking_id", test_tracking_id).execute()
print("Final row state in Supabase:", verify_res.data)
