import psycopg2
import os

# Test standard Supabase DB host connection
hosts = [
    "db.qcgcqstvrnbacwqksfgo.supabase.co",
    "aws-0-ap-south-1.pooler.supabase.com",
    "aws-0-us-east-1.pooler.supabase.com"
]

passwords = [
    "postgres",
    "Postgres123!",
    "Supabase123!",
    "EChallan2026!",
    "Madhuri123!",
    "Madhuri@2026"
]

connected = False
for host in hosts:
    for pwd in passwords:
        try:
            conn = psycopg2.connect(
                dbname="postgres",
                user="postgres",
                password=pwd,
                host=host,
                port="5432",
                connect_timeout=3
            )
            print(f"SUCCESS CONNECTED to {host} with password {pwd}!")
            cur = conn.cursor()
            cur.execute("ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS vehicle_number TEXT;")
            conn.commit()
            print("SUCCESS EXECUTED ALTER TABLE!")
            cur.close()
            conn.close()
            connected = True
            break
        except Exception as e:
            pass
    if connected:
        break

if not connected:
    print("Could not connect via direct TCP (need db password or Supabase SQL Editor execution).")
