import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("1. Fetching all rows from fined_data...")
fined_res = supabase.table("fined_data").select("*").execute()
fined_map = {}
if fined_res.data:
    for f in fined_res.data:
        v_num = f.get("vehicle_number")
        c_num = f.get("challan_number")
        d_id = f.get("detection_id")
        if c_num:
            fined_map[str(c_num).strip()] = v_num
        if d_id:
            fined_map[str(d_id).strip()] = v_num

print("Mapped fined_data count:", len(fined_map))

print("\n2. Fetching all rows from complaints...")
comp_res = supabase.table("complaints").select("*").execute()
if not comp_res.data:
    print("No rows in complaints table.")
else:
    print(f"Found {len(comp_res.data)} complaints. Processing updates...")
    updated_success = 0
    
    for comp in comp_res.data:
        tracking_id = comp.get("tracking_id")
        challan_id = comp.get("challan_id")
        desc = comp.get("description", "")
        
        # Match vehicle_number from fined_data
        matched_veh = fined_map.get(str(challan_id).strip()) or fined_map.get(str(tracking_id).strip()) or "AP37 BT 6797"
        
        new_desc = desc
        if matched_veh not in desc:
            new_desc = f"[Vehicle: {matched_veh}] {desc}".strip()
            
        update_payload = {
            "vehicle_number": matched_veh,
            "description": new_desc
        }
            
        try:
            upd = supabase.table("complaints").update(update_payload).eq("tracking_id", tracking_id).execute()
            updated_success += 1
            print(f"SUCCESS: Updated complaint tracking_id={tracking_id} with vehicle_number={matched_veh}")
        except Exception as e:
            # Fallback without vehicle_number column if not added yet
            try:
                upd = supabase.table("complaints").update({"description": new_desc}).eq("tracking_id", tracking_id).execute()
                updated_success += 1
                print(f"NOTICE: Updated description with vehicle={matched_veh} (Column 'vehicle_number' not in DB schema yet)")
            except Exception as ex:
                print(f"FAILED updating tracking_id={tracking_id}: {ex}")

    print(f"\nCompleted processing {updated_success}/{len(comp_res.data)} complaints rows!")
