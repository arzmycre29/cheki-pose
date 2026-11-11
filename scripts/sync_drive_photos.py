#!/usr/bin/env python3
"""
ChekiPose - Google Drive Sync & Image Processor Script
Mengunduh foto referensi dari Google Drive folder:
- 1_Cute_Mode (ID: 1YCRWIuTP32DUJkKS7vElvF_P_UrXHPci) -> assets/poses/cute/
- 2_Fun_Mode (ID: 1vqiy95U3kq69o57DdU3SJCXLhzKD2NK_) -> assets/poses/fun/
- 3_Random_Meme (ID: 1yqSTiGAyaYuhHTJcEE4fsa9lzSAMa0jn) -> assets/poses/meme/
"""

import os
import subprocess
import json
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
DRIVE_CLI = "/opt/antigravity/plugins/gdrive/skills/gdrive/scripts/gdrive"

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

def optimize_image_34(src_path, dest_path):
    """Crop/resize image into portrait 3:4 for fast mobile loading"""
    try:
        with Image.open(src_path) as img:
            img = img.convert("RGB")
            w, h = img.size
            target_ratio = 3 / 4

            # Crop to 3:4 aspect ratio
            current_ratio = w / h
            if current_ratio > target_ratio:
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                img = img.crop((left, 0, left + new_w, h))
            else:
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                img = img.crop((0, top, w, top + new_h))

            # Resize to max 600x800 for high quality yet lightweight mobile delivery
            img = img.resize((600, 800), Image.Resampling.LANCZOS)
            img.save(dest_path, "JPEG", quality=85, optimize=True)
            return True
    except Exception as e:
        print(f"Error optimizing {src_path}: {e}")
        return False

def sync():
    print("=== Sinkronisasi Foto dari Google Drive ===")
    total_found = 0
    for mode, info in FOLDERS.items():
        info["dest"].mkdir(parents=True, exist_ok=True)
        print(f"\nMemeriksa folder: {info['name']} ({info['id']})...")
        items = list_drive_folder(info["id"])
        print(f"Ditemukan {len(items)} file di {info['name']}.")
        
        for item in items:
            name = item.get("name", "")
            file_id = item.get("id")
            mime = item.get("mimeType", "")
            if not mime.startswith("image/"):
                continue

            total_found += 1
            raw_tmp = Path(f"/tmp/{file_id}_{name}")
            dest_jpg = info["dest"] / f"{Path(name).stem}.jpg"

            print(f"Mengunduh {name}...")
            if download_file(file_id, raw_tmp):
                optimize_image_34(raw_tmp, dest_jpg)
                raw_tmp.unlink(missing_ok=True)
                print(f"-> Berhasil disimpan di: {dest_jpg}")

    print(f"\nSelesai! Total {total_found} foto referensi diproses.")

if __name__ == "__main__":
    sync()
