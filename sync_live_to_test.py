import os
import shutil
import sys

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def sync_live_to_test(force=False):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    test_dir = os.path.join(root_dir, 'test_app')

    print("=" * 65)
    print("  🔄 SYNC LIVE APP -> TEST APP (test_app)")
    print("=" * 65)
    print("  Source: Live app files in root")
    print(f"  Target: {test_dir}")
    print("=" * 65)

    if not force:
        try:
            choice = input("Overwrite test_app with current LIVE files? (y/N): ").strip().lower()
            if choice not in ['y', 'yes']:
                print("[!] Sync cancelled by user.")
                return False
        except (KeyboardInterrupt, EOFError):
            print("\n[!] Sync cancelled.")
            return False

    os.makedirs(test_dir, exist_ok=True)

    # Core web app files to sync
    files_to_sync = ['index.html', 'app.js', 'style.css', 'manifest.json', 'sw.js']
    for filename in files_to_sync:
        src = os.path.join(root_dir, filename)
        dst = os.path.join(test_dir, filename)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  [+] Copied: {filename}")
        else:
            print(f"  [!] Missing source file: {filename}")

    # Sync assets folder
    src_assets = os.path.join(root_dir, 'assets')
    dst_assets = os.path.join(test_dir, 'assets')
    if os.path.exists(src_assets):
        if os.path.exists(dst_assets):
            shutil.rmtree(dst_assets)
        shutil.copytree(src_assets, dst_assets)
        print("  [+] Synchronized: assets/ folder")

    # Create test_app/server.py if not already present
    test_server_path = os.path.join(test_dir, 'server.py')
    if not os.path.exists(test_server_path):
        create_test_server(test_server_path)
        print("  [+] Created: test_app/server.py (Port 8090)")
    else:
        print("  [*] Preserved: test_app/server.py")

    print("=" * 65)
    print("  ✅ TEST APP SYNCHRONIZATION COMPLETE!")
    print("  You can now make changes in 'test_app/' and run 'test_app.bat'.")
    print("=" * 65)
    return True

def create_test_server(filepath):
    code = '''import http.server
import socketserver
import webbrowser
import socket
import os
import sys

# Ensure UTF-8 output encoding for Windows command prompt
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure working directory is test_app
os.chdir(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_PORT = 8091

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def run_server():
    port = DEFAULT_PORT
    httpd = None

    # Try test ports in sequence (8091 - 8095, 8888)
    for p in [8091, 8092, 8093, 8094, 8888, 3001]:
        try:
            httpd = ReusableTCPServer(("", p), CustomHandler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print("[ERROR] Could not bind to test port (8090-8095). Please check open processes.")
        sys.exit(1)

    local_ip = get_ip()
    url_local = f"http://localhost:{port}"
    url_network = f"http://{local_ip}:{port}"

    print("=" * 65)
    print("  🧪 YAMATO SHOKUDO - TEST & STAGING POS (test_app)")
    print("=" * 65)
    print(f"  [PC Test App]:       {url_local}")
    print(f"  [Tablet / Wi-Fi]:    {url_network}")
    print("=" * 65)
    print("  * ⚠️ YOU ARE RUNNING THE TEST / STAGING ENVIRONMENT.")
    print("  * Any revisions or experiments here DO NOT touch the LIVE POS.")
    print("  * Browser LocalStorage is isolated on port " + str(port) + ".")
    print("=" * 65)
    print("  * When your test features are ready and verified, run:")
    print("      push_to_live.bat")
    print("    to promote your changes to the LIVE POS & GitHub!")
    print("=" * 65)
    print("  * Press Ctrl + C to stop test server.")
    print("=" * 65)

    # Open test URL in default browser
    try:
        webbrowser.open(url_local)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n[!] Test POS server stopped.")
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
'''
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

if __name__ == '__main__':
    force_flag = '--force' in sys.argv or '--auto' in sys.argv
    sync_live_to_test(force=force_flag)
