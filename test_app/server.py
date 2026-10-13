import http.server
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
        print("\n[!] Test POS server stopped.")
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
