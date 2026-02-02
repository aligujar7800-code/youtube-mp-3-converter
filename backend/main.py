from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from services.downloader import downloader
from services.file_manager import file_manager
import uvicorn

app = FastAPI(title="YouTube to MP3 Converter API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConvertRequest(BaseModel):
    url: str
    quality: str = "192"

@app.post("/api/convert")
async def convert_video(request: ConvertRequest, background_tasks: BackgroundTasks):
    """
    Endpoint to start the conversion process.
    """
    # 1. Validate quality
    if request.quality not in ["128", "192", "320"]:
        raise HTTPException(status_code=400, detail="Invalid quality. Choose 128, 192, or 320.")

    # 2. Start download/conversion
    result = downloader.download_audio(request.url, request.quality)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    # 3. Schedule cleanup in background (e.g., check every hour, but here we can just trigger it)
    background_tasks.add_task(file_manager.cleanup_old_files)

    return {
        "status": "success",
        "message": "Conversion complete",
        "download_url": f"/download/{result['filename']}",
        "filename": result["filename"],
        "info": {
            "title": result["title"],
            "thumbnail": result["thumbnail"]
        }
    }

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """
    Endpoint to stream the converted MP3 file.
    """
    file_path = file_manager.get_full_path(filename)
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found or has expired.")

    # We can use the original title in the filename if we had stored it, 
    # but for simplicity, we use the unique ID.
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"converted_audio.mp3"
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

