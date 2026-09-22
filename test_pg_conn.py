import sys
for pkg in ["psycopg2", "psycopg", "pg8000", "asyncpg", "sqlalchemy"]:
    try:
        __import__(pkg)
        print(f"AVAILABLE: {pkg}")
    except ImportError:
        print(f"NOT available: {pkg}")
