import os
import time
import shutil
from pathlib import Path

class FileManager:
    """
    Handles file paths and temporary file cleanup.
    """
    def __init__(self, download_dir: str = "/tmp/downloads"):
        self.download_dir = Path(download_dir)
        self.download_dir.mkdir(exist_ok=True, parents=True)

    def get_full_path(self, filename: str) -> Path:
        """Returns the full path for a given filename in the download directory."""
        return self.download_dir / filename

    def cleanup_old_files(self, max_age_seconds: int = 3600):
        """
        Deletes files older than max_age_seconds.
        Default is 1 hour.
        """
        now = time.time()
        for file_path in self.download_dir.iterdir():
            if file_path.is_file():
                file_age = now - file_path.stat().st_mtime
                if file_age > max_age_seconds:
                    try:
                        file_path.unlink()
                        print(f"Cleaned up old file: {file_path}")
                    except Exception as e:
                        print(f"Error deleting {file_path}: {e}")

file_manager = FileManager()

