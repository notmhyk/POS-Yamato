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

# Ensure current working directory is the script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_PORT = 8080

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

    # Try ports in sequence if 8080 is occupied
    for p in [8080, 8081, 8082, 3000, 5000]:
        try:
            httpd = ReusableTCPServer(("", p), CustomHandler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print("[ERROR] Could not bind to any port. Please close other instances.")
        sys.exit(1)

    local_ip = get_ip()
    url_local = f"http://localhost:{port}"
    url_network = f"http://{local_ip}:{port}"

    print("=" * 65)
    print("  YAMATO SHOKUDO (Yamato Shokudo) - POINT OF SALE (POS)")
    print("=" * 65)
    print(f"  [PC (This Computer)]:      {url_local}")
    print(f"  [Tablet / Phone (Wi-Fi)]:  {url_network}")
    print("=" * 65)
    print("  * POS Server is running.")
    print("  * Press Ctrl + C to stop.")
    print("=" * 65)

    # Open default browser automatically
    try:
        webbrowser.open(url_local)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Yamato Shokudo POS server stopped.")
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
