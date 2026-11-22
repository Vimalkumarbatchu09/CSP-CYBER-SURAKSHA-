import os
import sys

# Ensure project root is in Python sys.path so app, models, auth can be imported
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import app

# Vercel Serverless WSGI Handler
app = app

if __name__ == '__main__':
    app.run()
