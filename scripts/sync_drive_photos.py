#!/usr/bin/env python3
"""
Sync reference photos from Google Drive folders into assets/poses/{cute,fun,meme}
while preserving each image's original aspect ratio without cropping.
"""

import json
import os
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

BASE_DIR = Path(__file__).resolve().parent.parent
DRIVE_CLI = "/opt/antigravity/plugins/gdrive/skills/gdrive/scripts/gdrive"
MAX_DIMENSION = 1440

FOLDERS = {
    "cute": {
        "id": "1YCRWIuTP32DUJkKS7vElvF_P_UrXHPci",
        "name": "1_Cute_Mode",
        "dest": BASE_DIR / "assets" / "poses" / "cute"
    },
    "fun": {
        "id": "1vqiy95U3kq69o57DdU3SJCXLhzKD2NK_",
        "name": "2_Fun_Mode",
        "dest": BASE_DIR / "assets" / "poses" / "fun"
    },
    "meme": {
        "id": "1yqSTiGAyaYuhHTJcEE4fsa9lzSAMa0jn",
        "name": "3_Random_Meme",
        "dest": BASE_DIR / "assets" / "poses" / "meme"
    }
}


def list_drive_folder(folder_id):
    env = os.environ.copy()
    env["ANTIGRAVITY_APP_DATA_DIR"] = "/tmp/antigravity"
    cmd = [DRIVE_CLI, "readonly", "ls", folder_id, "--json"]
    try:
        res = subprocess.run(cmd, env=env, capture_output=True, text=True, check=True)
        return json.loads(res.stdout) if res.stdout.strip() else []
    except Exception as e:
        print(f"Error listing folder {folder_id}: {e}")
        return []


def download_file(file_id, dest_path):
    env = os.environ.copy()
    env["ANTIGRAVITY_APP_DATA_DIR"] = "/tmp/antigravity"
    cmd = [DRIVE_CLI, "readonly", "download", file_id, "--out", str(dest_path)]
    try:
        subprocess.run(cmd, env=env, capture_output=True, text=True, check=True)
        return True
    except Exception as e:
        print(f"Error downloading {file_id}: {e}")
        return False


def optimize_image_preserve_ratio(src_path, dest_path):
    """Downscale only when larger than MAX_DIMENSION while keeping full uncropped bounds."""
    try:
        with Image.open(src_path) as img:
            img = ImageOps.exif_transpose(img).convert("RGB")
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
            img.save(dest_path, "JPEG", quality=88, optimize=True)
            return True
    except Exception as e:
        print(f"Error optimizing {src_path}: {e}")
        return False


def sync():
    total_found = 0
    for info in FOLDERS.values():
        info["dest"].mkdir(parents=True, exist_ok=True)
        items = list_drive_folder(info["id"])

        for item in items:
            name = item.get("name", "")
            file_id = item.get("id")
            mime = item.get("mimeType", "")
            if not mime.startswith("image/"):
                continue

            total_found += 1
            raw_tmp = Path(f"/tmp/{file_id}_{name}")
            dest_jpg = info["dest"] / f"{Path(name).stem}.jpg"

            if download_file(file_id, raw_tmp):
                optimize_image_preserve_ratio(raw_tmp, dest_jpg)
                raw_tmp.unlink(missing_ok=True)
                print(f"Saved uncropped image: {dest_jpg}")

    print(f"Completed sync for {total_found} reference photos.")


if __name__ == "__main__":
    sync()
