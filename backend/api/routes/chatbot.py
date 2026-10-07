"""
Chatbot API Route - AI Agricultural Assistant with Gemini AI
Handles chat interactions with context-aware responses
"""

from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any

from models.chat import ChatRequest, ChatResponse
from services.gemini_chatbot_service import gemini_chatbot_service
from services.chatbot_service import get_chatbot_service

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a message to the AI farming assistant (powered by Google Gemini)
    
    - **message**: User's question or message
    - **language**: Preferred language (en, hi, te, ta, kn)
    - **context**: Optional context including farmer profile and previous analysis
    - **session_id**: Session ID for conversation continuity
    - **use_ai**: Use Gemini AI (True) or fallback to rule-based (False)
    
    Returns AI response with quick actions and related module suggestions.
    """
    try:
        # Try Gemini service first (if API key is configured)
        response = await gemini_chatbot_service.process_message(request)
        return response
    except Exception as e:
        # Fallback to original chatbot service if Gemini fails
        print(f"Gemini service error, using fallback: {e}")
        try:
            chatbot_service = get_chatbot_service()
            response = await chatbot_service.process_message(request)
            return response
        except Exception as fallback_error:
            raise HTTPException(
                status_code=500,
                detail=f"Chat processing error: {str(fallback_error)}"
            )


@router.post("/analyze-report")
async def analyze_farm_report(
    report_data: Dict[str, Any],
    language: str = "en"
):
    """
    Analyze a farm report and provide summary
    
    Send the complete farm analysis data and get an AI-generated summary
    with actionable insights.
    """
    # Extract key information
    soil_status = report_data.get("soil_analysis", {}).get("message", "Unknown")
    weather_risk = report_data.get("weather_analysis", {}).get("label", "Unknown")
    recommended_crop = report_data.get("crop_recommendation", {}).get("recommended_crop", "Unknown")
    predicted_yield = report_data.get("yield_prediction", {}).get("predicted_yield", 0)
    fertilizer = report_data.get("fertilizer_advisory", {}).get("recommended_fertilizer", "Unknown")
    
    # Generate summary based on language
    if language == "en":
        summary = f"""
        📊 **Farm Analysis Summary**
        
        🌱 **Soil Health:** {soil_status}
        ☁️ **Weather Outlook:** {weather_risk}
        🌾 **Recommended Crop:** {recommended_crop}
        📈 **Expected Yield:** {predicted_yield} tons
        💧 **Fertilizer Advice:** Use {fertilizer}
        
        **Key Actions:**
        1. {report_data.get("soil_analysis", {}).get("recommendation", "Monitor soil nutrients")}
        2. {report_data.get("weather_analysis", {}).get("recommendation", "Check weather forecasts")}
        3. Consider planting {recommended_crop} for best results
        """
    elif language == "hi":
        summary = f"""
        📊 **खेत विश्लेषण सारांश**
        
        🌱 **मिट्टी का स्वास्थ्य:** {soil_status}
        ☁️ **मौसम:** {weather_risk}
        🌾 **अनुशंसित फसल:** {recommended_crop}
        📈 **अपेक्षित उपज:** {predicted_yield} टन
        💧 **उर्वरक सलाह:** {fertilizer} का उपयोग करें
        """
    elif language == "te":
        summary = f"""
        📊 **వ్యవసాయ విశ్లేషణ సారాంశం**
        
        🌱 **మట్టి ఆరోగ్యం:** {soil_status}
        ☁️ **వాతావరణం:** {weather_risk}
        🌾 **సిఫార్సు చేసిన పంట:** {recommended_crop}
        📈 **అంచనా దిగుబడి:** {predicted_yield} టన్నులు
        💧 **ఎరువు సలహా:** {fertilizer} వాడండి
        """
    else:
        summary = f"Soil: {soil_status}, Weather: {weather_risk}, Crop: {recommended_crop}, Yield: {predicted_yield} tons"
    
    return {
        "success": True,
        "language": language,
        "summary": summary.strip(),
        "key_metrics": {
            "soil_status": soil_status,
            "weather_risk": weather_risk,
            "recommended_crop": recommended_crop,
            "predicted_yield": predicted_yield,
            "fertilizer": fertilizer
        }
    }


@router.get("/quick-questions")
async def get_quick_questions(language: str = "en"):
    """
    Get suggested quick questions for the chatbot
    
    Returns language-specific quick questions that farmers commonly ask.
    """
    questions = {
        "en": [
            {"text": "What crop should I grow?", "icon": "🌾"},
            {"text": "Is this yield good for my farm?", "icon": "📊"},
            {"text": "Tell me about weather risk", "icon": "☁️"},
            {"text": "What fertilizer should I use?", "icon": "💧"},
            {"text": "How is my soil health?", "icon": "🧪"},
            {"text": "When should I harvest?", "icon": "🚜"},
            {"text": "How to improve my yield?", "icon": "📈"},
            {"text": "Best irrigation timing?", "icon": "💦"}
        ],
        "hi": [
            {"text": "मुझे कौन सी फसल उगानी चाहिए?", "icon": "🌾"},
            {"text": "क्या यह उपज अच्छी है?", "icon": "📊"},
            {"text": "मौसम का जोखिम क्या है?", "icon": "☁️"},
            {"text": "मुझे कौन सा उर्वरक उपयोग करना चाहिए?", "icon": "💧"},
            {"text": "मेरी मिट्टी की सेहत कैसी है?", "icon": "🧪"},
            {"text": "कटाई कब करनी चाहिए?", "icon": "🚜"},
            {"text": "उपज कैसे बढ़ाएं?", "icon": "📈"},
            {"text": "सिंचाई का सबसे अच्छा समय?", "icon": "💦"}
        ],
        "te": [
            {"text": "నేను ఏ పంట పండించాలి?", "icon": "🌾"},
            {"text": "ఈ దిగుబడి మంచిదా?", "icon": "📊"},
            {"text": "వాతావరణ ప్రమాదం గురించి చెప్పండి", "icon": "☁️"},
            {"text": "నేను ఏ ఎరువు వాడాలి?", "icon": "💧"},
            {"text": "నా మట్టి ఆరోగ్యం ఎలా ఉంది?", "icon": "🧪"},
            {"text": "పంట ఎప్పుడు కోయాలి?", "icon": "🚜"},
            {"text": "దిగుబడి ఎలా పెంచాలి?", "icon": "📈"},
            {"text": "నీరు పెట్టడానికి మంచి సమయం?", "icon": "💦"}
        ]
    }
    
    return {
        "success": True,
        "language": language,
        "questions": questions.get(language, questions["en"])
    }


@router.post("/clear-session/{session_id}")
async def clear_chat_session(session_id: str):
    """
    Clear conversation history for a specific session
    """
    try:
        success = gemini_chatbot_service.clear_session(session_id)
        return {
            "success": success,
            "message": f"Session {session_id} cleared successfully" if success else "Session not found"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session-history/{session_id}")
async def get_session_history(session_id: str):
    """
    Get conversation history for a specific session
    """
    try:
        history = gemini_chatbot_service.get_session_history(session_id)
        return {
            "session_id": session_id,
            "history": history,
            "message_count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/greetings")
async def get_chatbot_greeting(language: str = "en"):
    """
    Get chatbot greeting message
    """
    greetings = {
        "en": "Namaste! 🙏 I'm your AI farming assistant powered by Gemini AI. Ask me anything about your farm - soil health, weather, crops, yield, or fertilizers!",
        "hi": "नमस्ते! 🙏 मैं आपका AI खेती सहायक हूं। मुझसे अपने खेत के बारे में कुछ भी पूछें - मिट्टी, मौसम, फसलें, उपज या उर्वरक!",
        "te": "నమస్కారం! 🙏 నేను మీ AI వ్యవసాయ సహాయకుడిని. మీ వ్యవసాయం గురించి నన్ను ఏదైనా అడగండి - మట్టి, వాతావరణం, పంటలు, దిగుబడి లేదా ఎరువులు!",
        "ta": "வணக்கம்! 🙏 நான் உங்கள் AI விவசாய உதவியாளர். உங்கள் பண்ணை பற்றி என்னிடம் எதையும் கேளுங்கள்!",
        "kn": "ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ನಿಮ್ಮ ಕೃಷಿ ಬಗ್ಗೆ ನನ್ನನ್ನು ಏನಾದರೂ ಕೇಳಿ!"
    }
    
    return {
        "success": True,
        "language": language,
        "greeting": greetings.get(language, greetings["en"])
    }
