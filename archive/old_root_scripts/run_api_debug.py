#!/usr/bin/env python
"""Run Smart API - with debug output"""
import sys
import os
import traceback

try:
    print("[START] Python Smart API Launcher")
    sys.path.insert(0, os.path.dirname(__file__))
    
    print("[IMPORT] Importing FastAPI...")
    from fastapi import FastAPI
    
    print("[IMPORT] Importing api_smart...")
    from backend.api_smart import app
    
    print("[IMPORT] Importing uvicorn...")
    import uvicorn
    
    print("[RUN] Starting Uvicorn server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
    
except Exception as e:
    print(f"\n[ERROR] {e}")
    traceback.print_exc()
    sys.exit(1)
