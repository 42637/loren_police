# policenew/create_shared_dataset.py
import os
import json
from dotenv import load_dotenv
from supabase import create_client

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

url = os.getenv("VITE_SUPABASE_URL", "https://qcgcqstvrnbacwqksfgo.supabase.co")
key = os.getenv("VITE_SUPABASE_ANON_KEY", "")

supabase = create_client(url, key)

print("Populating shared violation dataset into Supabase 'fined_data'...")

dataset_records = [
    {
        "detection_id": "DET-2026-8821",
        "challan_number": "CHL-2026-8821",
        "vehicle_number": "AP37 BT 6797",
        "owner_name": "Rajesh Kumar Varma",
        "owner_mobile": "9848022334",
        "violation_type": "Over-speeding (74 km/h in 50 km/h speed zone)",
        "fine_amount": 1000.0,
        "location_name": "Janpath Intersection, Vijayawada",
        "latitude": 16.5062,
        "longitude": 80.6480,
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
        "plate_crop_url": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80",
        "camera_id": "CAM-VJW-04",
        "camera_direction": "Northbound",
        "status": "ISSUED",
        "payment_status": "UNPAID",
        "speed_recorded": 74.0,
        "speed_limit": 50.0,
        "created_at": "2026-08-24T14:32:00Z"
    },
    {
        "detection_id": "DET-2026-4412",
        "challan_number": "CHL-2026-4412",
        "vehicle_number": "AP37 BT 6797",
        "owner_name": "Rajesh Kumar Varma",
        "owner_mobile": "9848022334",
        "violation_type": "Riding without Helmet",
        "fine_amount": 500.0,
        "location_name": "Benz Circle Junction, Vijayawada",
        "latitude": 16.5020,
        "longitude": 80.6450,
        "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
        "plate_crop_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&auto=format&fit=crop&q=80",
        "camera_id": "CAM-VJW-01",
        "camera_direction": "Southbound",
        "status": "RESOLVED",
        "payment_status": "PAID",
        "speed_recorded": 0.0,
        "speed_limit": 50.0,
        "created_at": "2026-08-12T09:15:00Z"
    },
    {
        "detection_id": "DET-2026-1029",
        "challan_number": "CHL-2026-1029",
        "vehicle_number": "AP37 BT 6797",
        "owner_name": "Rajesh Kumar Varma",
        "owner_mobile": "9848022334",
        "violation_type": "Signal Jump",
        "fine_amount": 1000.0,
        "location_name": "Ring Road Junction, Vijayawada",
        "latitude": 16.5110,
        "longitude": 80.6520,
        "image_url": "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80",
        "plate_crop_url": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80",
        "camera_id": "CAM-VJW-09",
        "camera_direction": "Eastbound",
        "status": "UNDER_REVIEW",
        "payment_status": "UNPAID",
        "speed_recorded": 0.0,
        "speed_limit": 50.0,
        "created_at": "2026-08-02T18:45:00Z"
    },
    {
        "detection_id": "DET-2026-9951",
        "challan_number": "CHL-2026-9951",
        "vehicle_number": "AP39 C 1234",
        "owner_name": "Venkata Raman Rao",
        "owner_mobile": "9848099887",
        "violation_type": "No Seatbelt / Mobile Usage",
        "fine_amount": 1500.0,
        "location_name": "Eluru Road Traffic Flyover, Vijayawada",
        "latitude": 16.5185,
        "longitude": 80.6321,
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
        "plate_crop_url": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80",
        "camera_id": "CAM-VJW-12",
        "camera_direction": "Westbound",
        "status": "ISSUED",
        "payment_status": "UNPAID",
        "speed_recorded": 62.0,
        "speed_limit": 50.0,
        "created_at": "2026-09-01T11:20:00Z"
    },
    {
        "detection_id": "DET-2026-3382",
        "challan_number": "CHL-2026-3382",
        "vehicle_number": "TS09 FA 5678",
        "owner_name": "Suresh Chandra Prasad",
        "owner_mobile": "9848011223",
        "violation_type": "Illegal Parking in Towing Zone",
        "fine_amount": 750.0,
        "location_name": "Mg Road Commercial Hub, Vijayawada",
        "latitude": 16.5089,
        "longitude": 80.6412,
        "image_url": "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80",
        "plate_crop_url": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80",
        "camera_id": "CAM-VJW-03",
        "camera_direction": "Northbound",
        "status": "ISSUED",
        "payment_status": "UNPAID",
        "speed_recorded": 0.0,
        "speed_limit": 50.0,
        "created_at": "2026-09-03T16:05:00Z"
    }
]

for item in dataset_records:
    try:
        res = supabase.table("fined_data").upsert(item, on_conflict="detection_id").execute()
        print(f"SUCCESS: Inserted/Updated detection_id '{item['detection_id']}' for Vehicle '{item['vehicle_number']}'")
    except Exception as e:
        print(f"ERROR for detection_id '{item['detection_id']}': {e}")
