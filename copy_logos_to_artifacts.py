import os
import shutil

src_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI\assets"
art_dir = r"C:\Users\ADMIN MHYK\.gemini\antigravity-ide\brain\bfaaaf07-6dfa-4430-89a7-b4c80f4f0232"

for name in ["logo.png", "icon-512.png", "icon-192.png", "favicon.png"]:
    src = os.path.join(src_dir, name)
    dest = os.path.join(art_dir, name)
    if os.path.exists(src):
        shutil.copy2(src, dest)
        print(f"Copied {name} to {dest}")
