"""Minimal test API"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

print("✅ 1. Imports starting...")

# Import services
sys.path.insert(0, os.path.dirname(__file__))
from backend.ml_models.model_manager import ModelManager

print("✅ 2. ModelManager imported")

# Create app
app = FastAPI(title="Minimal Test")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

print("✅ 3. FastAPI app created")

# Add endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

print("✅ 4. Endpoints defined")

if __name__ == "__main__":
    import uvicorn
    print("✅ 5. Starting uvicorn...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
