"""
Chat Message Pydantic Models
For AI Chatbot communication with Gemini AI support
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Chat message roles"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatbotContext(BaseModel):
    """Context information for chatbot"""
    farmer_profile: Optional[Dict[str, Any]] = None
    previous_analysis: Optional[str] = None
    session_id: str = "default"
    conversation_history: List[Dict[str, str]] = []


class ChatMessage(BaseModel):
    """Single chat message"""
    role: MessageRole
    content: str = Field(..., min_length=1, max_length=5000)
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)
    language: str = Field("en", description="Message language code")
    
    # Context data for better responses
    context: Optional[Dict[str, Any]] = Field(None, description="Farm analysis context")


class ChatRequest(BaseModel):
    """Chat API request with Gemini AI support"""
    message: str = Field(..., min_length=1, max_length=2000)
    language: str = Field("en", description="User's preferred language")
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    
    # Enhanced context support
    context: Optional[ChatbotContext] = Field(None, description="Conversation context")
    
    # Session management
    session_id: Optional[str] = Field("default", description="Session ID for conversation continuity")
    
    # AI configuration
    use_ai: bool = Field(True, description="Use Gemini AI (True) or rule-based fallback (False)")
    
    # Farm context for intelligent responses (deprecated - use context.previous_analysis)
    farm_context: Optional[Dict[str, Any]] = Field(None, description="Current farm analysis data")
    
    # Voice input flag
    is_voice_input: bool = Field(False, description="Message from voice recognition")


class QuickAction(BaseModel):
    """Quick action suggestion"""
    label: str
    action: str
    icon: str


class ChatResponse(BaseModel):
    """Chat API response from Gemini AI"""
    message: str = Field(..., description="AI response message with emojis for display")
    tts_message: Optional[str] = Field(None, description="Clean response for text-to-speech (without emojis)")
    timestamp: datetime = Field(default_factory=datetime.now)
    language: str = Field("en", description="Response language")
    
    # Quick action suggestions
    suggestions: List[str] = Field(default_factory=list, description="Quick action suggestions")
    
    # Context for next message
    context: Optional[ChatbotContext] = None
    
    # Response metadata
    confidence: Optional[float] = Field(None, ge=0, le=1)
    response_type: str = Field("text", description="text, recommendation, alert, etc.")
    
    # Follow-up suggestions
    quick_actions: Optional[List[QuickAction]] = None
    related_modules: Optional[List[str]] = None
    
    # Response success status
    success: bool = Field(True, description="Response success status")
    
    # Voice output
    should_speak: bool = Field(True, description="Whether to auto-speak this response")
