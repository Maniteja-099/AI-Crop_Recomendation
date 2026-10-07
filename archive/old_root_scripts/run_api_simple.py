#!/usr/bin/env python
"""Simple API runner - no fancy stuff"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run
from backend.api_smart import app
import uvicorn

if __name__ == "__main__":
    print("\n[START] Starting Smart Agricultural API...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
