import yt_dlp
import os
from pathlib import Path
import uuid

class Downloader:
    """
    Handles downloading audio from YouTube and converting it to MP3 using yt-dlp and FFmpeg.
    """
    def __init__(self, download_dir: str = "downloads"):
        self.download_dir = download_dir

    def download_audio(self, url: str, quality: str) -> dict:
        """
        Downloads audio from a URL and converts it to MP3.
        Returns a dictionary with file info or error.
        """
        # Generate a unique filename to avoid collisions
        file_id = str(uuid.uuid4())
        output_template = os.path.join(self.download_dir, f"{file_id}.%(ext)s")

        def progress_hook(d):
            if d['status'] == 'downloading':
                print(f"Downloading: {d.get('_percent_str', '0%')} of {d.get('_total_bytes_str', 'unknown size')}")
            elif d['status'] == 'finished':
                print(f"Download complete, now converting...")

        # Path to the bin folder containing ffmpeg.exe and ffprobe.exe
        # Use .resolve() to get the absolute path regardless of where the script is run from
        current_file = Path(__file__).resolve()
        project_root = current_file.parent.parent.parent
        bin_dir = project_root / "bin"
        ffmpeg_path = str(bin_dir)

        # Debug: print the path being used
        print(f"Looking for FFmpeg in: {ffmpeg_path}")
        print(f"FFmpeg exists: {(bin_dir / 'ffmpeg.exe').exists()}")
        print(f"FFprobe exists: {(bin_dir / 'ffprobe.exe').exists()}")

        # Add bin directory to PATH for this process to ensure ffprobe is found
        os.environ["PATH"] = ffmpeg_path + os.pathsep + os.environ.get("PATH", "")

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality,
            }],
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
            'progress_hooks': [progress_hook],
            # Use a modern user agent instead of cookies to avoid "locked database" errors
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'nocheckcertificate': True,
            'geo_bypass': True,
            'ffmpeg_location': ffmpeg_path,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                # The filename yt-dlp gives might have the original extension before conversion
                # But since we use postprocessors, the final file will be .mp3
                final_filename = f"{file_id}.mp3"
                
                return {
                    "success": True,
                    "filename": final_filename,
                    "title": info.get('title', 'Unknown Title'),
                    "duration": info.get('duration'),
                    "thumbnail": info.get('thumbnail')
                }
        except yt_dlp.utils.DownloadError as e:
            return {"success": False, "error": f"Download failed: {str(e)}"}
        except Exception as e:
            return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}

downloader = Downloader()

