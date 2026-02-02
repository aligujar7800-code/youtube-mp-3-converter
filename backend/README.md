# YouTube to MP3 Converter Backend

This is a production-ready FastAPI backend for converting YouTube videos to MP3 files using `yt-dlp` and `FFmpeg`.

## Prerequisites

- Python 3.8+
- **FFmpeg installed on your system**
  - Ubuntu: `sudo apt update && sudo apt install ffmpeg`
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/macOS: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API

Start the server using uvicorn:
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

## API Endpoints

### `POST /convert`
Request Body:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "quality": "320"
}
```
Response:
```json
{
  "status": "success",
  "download_url": "/download/unique-id.mp3",
  "filename": "unique-id.mp3",
  "info": { ... }
}
```

### `GET /download/{filename}`
Downloads the converted MP3 file.

## Frontend Fetch Example (JavaScript)

```javascript
async function convertAndDownload(youtubeUrl, quality = '192') {
  try {
    const response = await fetch('http://localhost:8000/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: youtubeUrl,
        quality: quality
      }),
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      // Trigger download
      const downloadLink = `http://localhost:8000${data.download_url}`;
      window.location.href = downloadLink;
    } else {
      console.error('Conversion failed:', data.detail);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## VPS Deployment (Ubuntu)

1. **Install FFmpeg & Python:**
   ```bash
   sudo apt update
   sudo apt install ffmpeg python3-pip python3-venv -y
   ```

2. **Clone and Setup:**
   (Assuming you've uploaded your code)
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Use Gunicorn with Uvicorn workers for production:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000 --daemon
   ```

4. **Nginx Reverse Proxy (Optional but Recommended):**
   Setup Nginx to forward requests to port 8000 and handle SSL (Certbot).

## Notes

- Files are stored in the `downloads/` directory.
- A background task automatically cleans up files older than 1 hour.
- Error handling covers invalid URLs and download failures.

