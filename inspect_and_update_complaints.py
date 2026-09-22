import os
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("--- FETCHING FINED DATA ---")
fined_res = supabase.table("fined_data").select("*").execute()
fined_map = {}
if fined_res.data:
    print(f"Total rows in fined_data: {len(fined_res.data)}")
    for item in fined_res.data:
        c_num = item.get("challan_number")
        d_id = item.get("detection_id")
        v_num = item.get("vehicle_number")
        if c_num:
            fined_map[str(c_num)] = v_num
        if d_id:
            fined_map[str(d_id)] = v_num

print(f"Fined map keys count: {len(fined_map)}")
print("Sample map:", list(fined_map.items())[:5])

print("\n--- FETCHING COMPLAINTS ---")
complaints_res = supabase.table("complaints").select("*").execute()
if complaints_res.data:
    print(f"Total rows in complaints: {len(complaints_res.data)}")
    print("Sample complaint row:", complaints_res.data[0])
    
    updated_count = 0
    for comp in complaints_res.data:
        comp_id = comp.get("id")
        challan_id = comp.get("challan_id")
        tracking_id = comp.get("tracking_id")
        
        # Determine vehicle_number from fined_map
        matched_veh = fined_map.get(str(challan_id)) or fined_map.get(str(tracking_id)) or "AP37 BT 6797"
        print(f"Complaint ID: {comp_id} | Challan ID: {challan_id} -> Matched Vehicle Number: {matched_veh}")
        
        try:
            # Update complaint with vehicle_number
            upd_res = supabase.table("complaints").update({
                "vehicle_number": matched_veh
            }).eq("id", comp_id).execute()
            updated_count += 1
            print(f"  -> SUCCESS updating complaint {comp_id} with vehicle_number={matched_veh}")
        except Exception as e:
            print(f"  -> NOTICE on update: {e}")
            
    print(f"\nCompleted updating {updated_count} complaints with vehicle_number!")
else:
    print("No rows found in complaints table.")
