from fastapi import FastAPI
print("FASTAPI IMPORTED successfully")
from fastapi.middleware.cors import CORSMiddleware

# Minimal Health Check Only - Commenting out services to isolate crash
# from backend.services.downloader import downloader
# from backend.services.file_manager import file_manager

app = FastAPI(title="YouTube to MP3 Converter API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# @app.post("/api/convert")
# async def convert_video(request: Request, background_tasks: BackgroundTasks):
#     return {"status": "disabled_for_debugging"}

# @app.get("/api/download/{filename}")
# async def download_file(filename: str):
#     return {"status": "disabled_for_debugging"}
