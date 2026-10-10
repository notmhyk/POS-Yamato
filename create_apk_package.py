import os
import zipfile

def create_apk_package():
    base_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI"
    zip_path = os.path.join(base_dir, "Yamato_POS_APK_Package.zip")
    
    files_to_include = [
        "index.html",
        "style.css",
        "app.js",
        "manifest.json",
        "sw.js",
        "Yamato_POS_Offline.html"
    ]
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files_to_include:
            f_path = os.path.join(base_dir, f)
            if os.path.exists(f_path):
                z.write(f_path, f)
                
        assets_dir = os.path.join(base_dir, "assets")
        if os.path.exists(assets_dir):
            for root, _, files in os.walk(assets_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, base_dir)
                    z.write(file_path, arcname)

    print(f"Created APK Package Zip: {zip_path} ({os.path.getsize(zip_path)} bytes)")

if __name__ == '__main__':
    create_apk_package()
