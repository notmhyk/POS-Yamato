import os
import re
import requests

def download_google_fonts():
    base_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI"
    fonts_dir = os.path.join(base_dir, "assets", "fonts")
    os.makedirs(fonts_dir, exist_ok=True)

    # Fetch CSS with a modern User-Agent to get WOFF2
    url = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    print("Fetching Google Fonts CSS...")
    res = requests.get(url, headers=headers, timeout=15)
    css = res.text

    # Find all font URLs
    font_urls = re.findall(r'url\((https://fonts\.gstatic\.com/s/[^)]+)\)', css)
    print(f"Found {len(font_urls)} font files to download...")

    for i, f_url in enumerate(font_urls):
        filename = f"font_{i}.woff2"
        dest = os.path.join(fonts_dir, filename)
        r = requests.get(f_url, timeout=15)
        if r.status_code == 200:
            with open(dest, "wb") as f:
                f.write(r.content)
            # Replace URL in CSS with relative path
            css = css.replace(f_url, f"../fonts/{filename}")
            print(f"Saved {filename}")

    # Save local fonts CSS
    fonts_css_path = os.path.join(base_dir, "assets", "fonts", "fonts.css")
    with open(fonts_css_path, "w", encoding="utf-8") as f:
        f.write(css)

    print(f"Local fonts saved to {fonts_css_path}")

if __name__ == '__main__':
    download_google_fonts()
