import os
import zipfile
import requests
import json

def deploy():
    base_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI"
    zip_path = os.path.join(base_dir, "pos_deploy.zip")
    
    # Create zip of essential web files
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(base_dir):
            if '.git' in root or '__pycache__' in root or '.gemini' in root:
                continue
            for file in files:
                if file.endswith('.zip') or file.endswith('.py') or file.endswith('.bat') or file.endswith('.sh'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, base_dir)
                z.write(file_path, arcname)

    print(f"Zip created at {zip_path}, size: {os.path.getsize(zip_path)} bytes")

    # Deploy to Netlify
    with open(zip_path, 'rb') as f:
        zip_data = f.read()

    headers = {
        'Content-Type': 'application/zip'
    }
    
    try:
        res = requests.post('https://api.netlify.com/api/v1/sites', data=zip_data, headers=headers, timeout=30)
        print(f"Status Code: {res.status_code}")
        if res.status_code in (200, 201):
            data = res.json()
            url = data.get('ssl_url') or data.get('url')
            site_id = data.get('site_id')
            print(f"SUCCESS! Live URL: {url}")
            print(f"Site ID: {site_id}")
            with open(os.path.join(base_dir, "live_pos_url.txt"), "w") as out:
                out.write(url)
            return url
        else:
            print("Response:", res.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    deploy()
