import os
import re
import requests

def download_fontawesome():
    base_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI"
    fa_css_dir = os.path.join(base_dir, "assets", "fontawesome", "css")
    fa_fonts_dir = os.path.join(base_dir, "assets", "fontawesome", "webfonts")
    
    os.makedirs(fa_css_dir, exist_ok=True)
    os.makedirs(fa_fonts_dir, exist_ok=True)

    css_url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    print(f"Downloading CSS from {css_url}...")
    res = requests.get(css_url, timeout=15)
    css_content = res.text

    # Save original CSS
    css_dest = os.path.join(fa_css_dir, "all.min.css")
    with open(css_dest, "w", encoding="utf-8") as f:
        f.write(css_content)
    print(f"Saved CSS to {css_dest}")

    # Find all font URLs in CSS or download standard webfonts
    font_files = [
        "fa-solid-900.woff2",
        "fa-solid-900.ttf",
        "fa-regular-400.woff2",
        "fa-regular-400.ttf",
        "fa-brands-400.woff2",
        "fa-brands-400.ttf",
        "fa-v4compatibility.woff2",
        "fa-v4compatibility.ttf"
    ]

    base_font_url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/"
    for font_name in font_files:
        f_url = base_font_url + font_name
        dest_path = os.path.join(fa_fonts_dir, font_name)
        try:
            print(f"Downloading font: {font_name}...")
            r = requests.get(f_url, timeout=15)
            if r.status_code == 200:
                with open(dest_path, "wb") as f:
                    f.write(r.content)
                print(f"Successfully downloaded {font_name} ({len(r.content)} bytes)")
            else:
                print(f"Failed to download {font_name} (Status: {r.status_code})")
        except Exception as e:
            print(f"Error downloading {font_name}: {e}")

if __name__ == '__main__':
    download_fontawesome()
