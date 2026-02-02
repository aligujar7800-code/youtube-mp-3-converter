import sys
import os

print("--- DEBUG START ---")
print(f"Python version: {sys.version}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"Python Path: {sys.path}")
try:
    print(f"Files in CWD: {os.listdir('.')}")
except:
    print("Could not list files in CWD")

try:
    import fastapi
    print(f"FASTAPI IMPORTED successfully. Version: {fastapi.__version__}")
except Exception as e:
    print(f"FASTAPI IMPORT FAILED: {e}")

print("--- DEBUG END ---")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="YouTube to MP3 Converter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "debug": "Health check is running"}
