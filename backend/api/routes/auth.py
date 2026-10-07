"""
Authentication API Routes
Register and Login endpoints with JSON file-based user storage
"""

import os
import json
import hashlib
import secrets
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, field_validator

router = APIRouter(prefix="/auth", tags=["Authentication"])

# User storage file path
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "users.json")


def _load_users() -> dict:
    """Load users from JSON file"""
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}


def _save_users(users: dict):
    """Save users to JSON file"""
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)


def _hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt"""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"


def _verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash"""
    try:
        salt, hashed = stored_hash.split(":")
        return hashlib.sha256((salt + password).encode()).hexdigest() == hashed
    except (ValueError, AttributeError):
        return False


# ---- Request/Response Models ----

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: str

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()

    @field_validator("email")
    @classmethod
    def email_valid(cls, v):
        if not v or "@" not in v or "." not in v:
            raise ValueError("Invalid email address")
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def password_strong(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod 
    def email_clean(cls, v):
        return v.strip().lower()


class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str = ""
    user: dict = {}


# ---- Endpoints ----

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register a new user account"""
    # Validate passwords match
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    users = _load_users()

    # Check if email already exists
    if request.email in users:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    # Create user
    token = secrets.token_hex(32)
    users[request.email] = {
        "full_name": request.full_name,
        "email": request.email,
        "password_hash": _hash_password(request.password),
        "token": token,
        "created_at": datetime.now().isoformat(),
    }

    _save_users(users)

    return AuthResponse(
        success=True,
        message="Account created successfully! Please login.",
        token=token,
        user={"full_name": request.full_name, "email": request.email},
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login with email and password"""
    users = _load_users()

    user = users.get(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not _verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate new token on each login
    token = secrets.token_hex(32)
    user["token"] = token
    users[request.email] = user
    _save_users(users)

    return AuthResponse(
        success=True,
        message="Login successful!",
        token=token,
        user={"full_name": user["full_name"], "email": user["email"]},
    )
