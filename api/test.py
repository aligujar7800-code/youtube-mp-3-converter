from http.server import BaseHTTPRequestHandler
import json

# Try to import fastapi to prove if deps are installed
try:
    import fastapi
    FASTAPI_VERSION = fastapi.__version__
    IMPORT_SUCCESS = True
except ImportError:
    FASTAPI_VERSION = "Not Found"
    IMPORT_SUCCESS = False

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_data = {
            "test_file_loaded": True,
            "fastapi_import_success": IMPORT_SUCCESS,
            "fastapi_version": FASTAPI_VERSION
        }
        
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
