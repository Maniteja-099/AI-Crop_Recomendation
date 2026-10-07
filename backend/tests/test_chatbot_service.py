import pytest
import sys
import os
import asyncio

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.chatbot_service import get_chatbot_service
from models.chat import ChatRequest

@pytest.fixture
def service():
    return get_chatbot_service()

@pytest.mark.asyncio
async def test_greeting_en(service):
    request = ChatRequest(message="hello", language="en")
    response = await service.process_message(request)
    assert response.success is True
    assert any(greet in response.message.lower() for greet in ["hello", "welcome", "namaste"])

@pytest.mark.asyncio
async def test_soil_query_hi(service):
    request = ChatRequest(message="मिट्टी की जांच कैसे करें", language="hi")
    response = await service.process_message(request)
    assert response.success is True
    # The response should be in Hindi and contain soil-related content
    assert response.language == "hi"
    assert len(response.message) > 10

@pytest.mark.asyncio
async def test_crop_query_te(service):
    request = ChatRequest(message="పంట సిఫార్సు", language="te")
    response = await service.process_message(request)
    assert response.success is True
    assert "పంట" in response.message or "వరి" in response.message

@pytest.mark.asyncio
async def test_strip_emojis(service):
    text = "Hello 🌾 farmer! 🚜"
    stripped = service._clean_for_tts(text)
    assert "Hello" in stripped
    assert "farmer" in stripped
    assert "🌾" not in stripped
    assert "🚜" not in stripped

@pytest.mark.asyncio
async def test_intent_detection(service):
    intent = service._detect_intent_from_keywords("what is my soil health?")
    assert intent == "soil"
    
    intent = service._detect_intent_from_keywords("will it rain today?")
    assert intent == "weather"
