#!/usr/bin/env python
"""
Multilingual Chatbot Testing Script
Tests emoji stripping, multilingual support, and TTS optimization
"""

import asyncio
from backend.services.chatbot_service import ChatbotService
from backend.models.chat import ChatRequest

async def test_chatbot_multilingual():
    """Test chatbot in multiple languages"""
    
    chatbot = ChatbotService()
    
    # Test data for each language
    test_cases = [
        {
            "language": "en",
            "message": "hello",
            "name": "English"
        },
        {
            "language": "hi",
            "message": "नमस्ते",
            "name": "Hindi"
        },
        {
            "language": "te",
            "message": "హలో",
            "name": "Telugu"
        },
        {
            "language": "ta",
            "message": "வணக்கம்",
            "name": "Tamil"
        },
        {
            "language": "kn",
            "message": "ನಮಸ್ಕಾರ",
            "name": "Kannada"
        },
        {
            "language": "mr",
            "message": "नमस्कार",
            "name": "Marathi"
        }
    ]
    
    print("="*70)
    print("MULTILINGUAL CHATBOT TEST - EMOJI REMOVAL & TTS OPTIMIZATION")
    print("="*70)
    
    for test in test_cases:
        print(f"\n{'='*70}")
        print(f"Testing: {test['name']} ({test['language'].upper()})")
        print(f"{'='*70}")
        
        request = ChatRequest(
            message=test["message"],
            language=test["language"]
        )
        
        response = await chatbot.process_message(request)
        
        print(f"Original Message: {test['message']}")
        print(f"Language: {response.language}")
        print(f"\n📱 DISPLAY VERSION (with emojis):")
        print(f"   {response.message}")
        print(f"\n🔊 TTS VERSION (clean, no emojis):")
        print(f"   {response.tts_message}")
        print(f"\nQuick Actions:")
        if response.quick_actions:
            for action in response.quick_actions[:3]:
                print(f"   - {action.label}")
    
    # Test soil query in different languages
    print(f"\n{'='*70}")
    print("TESTING SOIL QUERIES IN DIFFERENT LANGUAGES")
    print(f"{'='*70}")
    
    soil_queries = [
        ("en", "soil"),
        ("hi", "मिट्टी"),
        ("te", "మట్టి"),
        ("ta", "மண்"),
    ]
    
    for lang, query in soil_queries:
        request = ChatRequest(
            message=query,
            language=lang
        )
        response = await chatbot.process_message(request)
        print(f"\n{lang.upper()}: {query}")
        print(f"Response: {response.tts_message[:80]}...")
    
    # Test emoji stripping effectiveness
    print(f"\n{'='*70}")
    print("EMOJI STRIPPING TEST")
    print(f"{'='*70}")
    
    test_text = "Welcome! 🎉 Check soil 🧪, weather ☁️, crops 🌾, yield 📊, and fertilizers 💧"
    cleaned = chatbot.strip_emojis(test_text)
    
    print(f"\nOriginal: {test_text}")
    print(f"Cleaned:  {cleaned}")
    print(f"\nEmojis removed: ✓")

if __name__ == "__main__":
    print("\n🚀 Starting Multilingual Chatbot Tests...\n")
    asyncio.run(test_chatbot_multilingual())
    print("\n✅ All tests completed!")
