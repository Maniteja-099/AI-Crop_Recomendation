"""
Enhanced Chatbot Service with Google Gemini API Integration
Context-aware, bilingual agricultural assistant with advanced AI capabilities

NOTE: This service is a standalone Gemini wrapper used by api/routes/chatbot.py.
The primary chatbot service used by main.py is chatbot_service.py, which already
integrates Gemini with FAQ fallback. Consider using chatbot_service.py for new
features to avoid duplication.
"""

import os
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
from dotenv import load_dotenv
from models.chat import ChatRequest, ChatResponse, QuickAction, ChatbotContext

# Load environment variables
load_dotenv()

# Check for offline mode
OFFLINE_MODE = os.getenv("OFFLINE_MODE", "false").lower() == "true"

# Try to import Gemini - make it optional
genai = None
if not OFFLINE_MODE:
    try:
        import google.generativeai as genai
    except ImportError:
        print("Warning: google-generativeai not installed. Running in offline mode.")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") if not OFFLINE_MODE else None
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if GEMINI_API_KEY and genai:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("[INFO] Gemini AI disabled - Running in OFFLINE MODE with rule-based responses")


class GeminiChatbotService:
    """
    Advanced AI Chatbot Service powered by Google Gemini
    Provides context-aware, multilingual agricultural assistance
    """
    
    MAX_SESSIONS = 200  # Maximum concurrent chat sessions

    def __init__(self):
        """Initialize Gemini chatbot service"""
        self.model = None
        self.chat_sessions = {}  # Store conversation history
        
        # Initialize Gemini model if API key is available and genai is loaded
        if GEMINI_API_KEY and genai:
            try:
                self.model = genai.GenerativeModel(
                    model_name=GEMINI_MODEL,
                    generation_config={
                        "temperature": 0.7,
                        "top_p": 0.95,
                        "top_k": 40,
                        "max_output_tokens": 1024,
                    },
                    safety_settings=[
                        {
                            "category": "HARM_CATEGORY_HARASSMENT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_HATE_SPEECH",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                    ]
                )
                print(f"[OK] Gemini model '{GEMINI_MODEL}' initialized successfully")
            except Exception as e:
                print(f"[ERROR] Failed to initialize Gemini model: {e}")
                self.model = None
        
        # System prompt for agricultural context
        self.system_prompt = """You are an expert agricultural AI assistant helping farmers in India. 
Your role is to provide accurate, practical advice on:
- Crop recommendations based on soil and climate
- Soil health and fertilizer management
- Weather forecasts and seasonal planning
- Pest and disease management
- Irrigation and water conservation
- Yield optimization techniques
- Market prices and farming economics

Guidelines:
1. Keep responses concise (2-3 sentences maximum)
2. Use simple, farmer-friendly language
3. Provide actionable advice
4. Consider Indian agricultural practices and crops
5. If asked in Hindi or regional languages, respond in that language
6. Always be encouraging and supportive
7. If you don't know something, suggest consulting local agricultural officers

Current context: The farmer is using an AI-powered crop recommendation system."""

    def get_or_create_session(self, session_id: str):
        """Get existing chat session or create new one"""
        if session_id not in self.chat_sessions:
            # Evict oldest session if limit reached
            if len(self.chat_sessions) >= self.MAX_SESSIONS:
                oldest_key = next(iter(self.chat_sessions))
                del self.chat_sessions[oldest_key]
            if self.model:
                self.chat_sessions[session_id] = self.model.start_chat(history=[])
        return self.chat_sessions.get(session_id)

    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """
        Process incoming chat message using Gemini AI
        
        Args:
            request: ChatRequest with message and context
            
        Returns:
            ChatResponse with AI-generated reply
        """
        try:
            # Use Gemini API if available and enabled
            if self.model and request.use_ai:
                response_text = await self._generate_gemini_response(request)
            else:
                # Fallback to rule-based responses
                response_text = self._generate_fallback_response(request)
            
            # Detect language from response
            language = self._detect_language(request.message)
            
            # Generate quick actions
            quick_actions = self._generate_quick_actions(response_text, language)
            
            return ChatResponse(
                message=response_text,
                timestamp=datetime.now(),
                language=language,
                suggestions=quick_actions,
                context=ChatbotContext(
                    farmer_profile=request.context.farmer_profile if request.context else None,
                    previous_analysis=request.context.previous_analysis if request.context else None,
                    session_id=request.session_id or "default",
                    conversation_history=[]
                )
            )
            
        except Exception as e:
            print(f"Error in chatbot service: {e}")
            return ChatResponse(
                message="I apologize, but I'm having trouble processing your request. Please try again.",
                timestamp=datetime.now(),
                language="en",
                suggestions=[],
                context=ChatbotContext(
                    session_id=request.session_id or "default",
                    conversation_history=[]
                )
            )

    async def _generate_gemini_response(self, request: ChatRequest) -> str:
        """Generate response using Gemini API"""
        try:
            # Get or create chat session for conversation history
            session_id = request.session_id or "default"
            chat_session = self.get_or_create_session(session_id)
            
            # Build context-aware prompt
            context_info = ""
            if request.context:
                if request.context.farmer_profile:
                    context_info += f"\nFarmer's location: {request.context.farmer_profile.get('location', 'Unknown')}"
                    context_info += f"\nPreferred language: {request.context.farmer_profile.get('language', 'en')}"
                
                if request.context.previous_analysis:
                    context_info += f"\nRecent analysis: {request.context.previous_analysis}"
            
            # Combine system prompt with user message
            full_prompt = f"""{self.system_prompt}
            
{context_info}

Farmer's question: {request.message}

Respond in a helpful, concise manner (2-3 sentences maximum):"""
            
            # Generate response
            if chat_session:
                response = chat_session.send_message(full_prompt)
                return response.text.strip()
            else:
                # Fallback if session not available
                response = self.model.generate_content(full_prompt)
                return response.text.strip()
                
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._generate_fallback_response(request)

    def _generate_fallback_response(self, request: ChatRequest) -> str:
        """Generate rule-based fallback response"""
        message_lower = request.message.lower()
        
        # Simple keyword matching
        if any(word in message_lower for word in ["soil", "mitti", "fertility", "npk"]):
            responses = [
                "Soil health is crucial for good yields! Ensure balanced NPK nutrients and pH between 6.0-7.0.",
                "Test your soil regularly and add organic matter like compost to improve fertility.",
                "Balanced NPK (Nitrogen, Phosphorus, Potassium) is key. Consider soil testing for precise recommendations."
            ]
        elif any(word in message_lower for word in ["weather", "rain", "temperature", "mausam", "barish"]):
            responses = [
                "Weather monitoring is essential! Check forecasts regularly and plan irrigation accordingly.",
                "During monsoon, ensure proper drainage. In summer, irrigate early morning or late evening.",
                "Climate-smart farming adapts to weather patterns. Use our weather analysis feature for insights."
            ]
        elif any(word in message_lower for word in ["crop", "recommendation", "grow", "fasal", "phasal"]):
            responses = [
                "Crop selection depends on soil type, climate, and water availability. Use our crop recommendation tool!",
                "Rice thrives in high rainfall; wheat prefers cooler conditions. Match crops to your region's climate.",
                "Consider crop rotation to maintain soil health and reduce pests. Diversification reduces risk."
            ]
        elif any(word in message_lower for word in ["yield", "production", "harvest", "upaj"]):
            responses = [
                "Yield optimization requires good soil health, timely irrigation, and proper fertilization.",
                "Quality seeds and timely pest management can increase yield by 20-30%.",
                "Use our yield prediction tool to estimate production based on your inputs."
            ]
        elif any(word in message_lower for word in ["fertilizer", "khad", "eruvu"]):
            responses = [
                "Apply fertilizers based on soil test results. Organic options include compost and green manure.",
                "Balanced NPK application is crucial. Avoid overuse to prevent soil degradation.",
                "Our fertilizer recommendation tool provides precise quantities based on your soil analysis."
            ]
        elif any(word in message_lower for word in ["pest", "disease", "keeda", "rog"]):
            responses = [
                "Integrated Pest Management (IPM) combines biological, cultural, and chemical control methods.",
                "Early detection is key! Regularly inspect crops and use organic pesticides when possible.",
                "Crop rotation and resistant varieties help prevent pest buildup. Consult agricultural officers for specific issues."
            ]
        elif any(word in message_lower for word in ["water", "irrigation", "pani", "neeru"]):
            responses = [
                "Drip irrigation saves up to 60% water compared to flood irrigation. Consider efficient methods.",
                "Irrigate during cooler hours to reduce evaporation. Mulching helps retain soil moisture.",
                "Water management is critical! Monitor soil moisture and avoid over-irrigation to prevent nutrient leaching."
            ]
        elif any(word in message_lower for word in ["price", "market", "sell", "bechna"]):
            responses = [
                "Check local mandi prices before selling. Consider contract farming for price stability.",
                "Proper post-harvest handling and storage can get you better prices.",
                "Diversification and value addition (processing) can improve farm income."
            ]
        else:
            responses = [
                "I'm here to help with your farming questions! Ask about crops, soil, weather, or yield predictions.",
                "Use our AI tools for crop recommendations, soil analysis, and weather forecasts. How can I assist you?",
                "Feel free to ask about soil health, crop selection, fertilizers, or any farming challenges!"
            ]
        
        import random
        return random.choice(responses)

    def _detect_language(self, message: str) -> str:
        """Detect language of the message"""
        # Simple heuristic based on script
        hindi_chars = re.findall(r'[\u0900-\u097F]', message)
        telugu_chars = re.findall(r'[\u0C00-\u0C7F]', message)
        tamil_chars = re.findall(r'[\u0B80-\u0BFF]', message)
        kannada_chars = re.findall(r'[\u0C80-\u0CFF]', message)
        
        if len(hindi_chars) > 3:
            return "hi"
        elif len(telugu_chars) > 3:
            return "te"
        elif len(tamil_chars) > 3:
            return "ta"
        elif len(kannada_chars) > 3:
            return "kn"
        else:
            return "en"

    def _generate_quick_actions(self, response: str, language: str) -> List[str]:
        """Generate contextual quick action suggestions"""
        quick_actions_map = {
            "en": [
                "Get crop recommendation",
                "Check weather forecast",
                "Analyze soil health",
                "Predict yield",
                "View fertilizer needs"
            ],
            "hi": [
                "फसल सुझाव प्राप्त करें",
                "मौसम पूर्वानुमान देखें",
                "मिट्टी जांच करें",
                "उपज अनुमान लगाएं",
                "उर्वरक जरूरतें देखें"
            ],
            "te": [
                "పంట సిఫార్సు పొందండి",
                "వాతావరణ అంచనా చూడండి",
                "మట్టి పరీక్ష చేయండి",
                "దిగుబడి అంచనా వేయండి",
                "ఎరువు అవసరాలు చూడండి"
            ]
        }
        
        actions = quick_actions_map.get(language, quick_actions_map["en"])
        
        # Return 3 relevant actions based on response content
        import random
        return random.sample(actions, min(3, len(actions)))

    def clear_session(self, session_id: str):
        """Clear conversation history for a session"""
        if session_id in self.chat_sessions:
            del self.chat_sessions[session_id]
            return True
        return False

    def get_session_history(self, session_id: str) -> List[Dict[str, str]]:
        """Get conversation history for a session"""
        session = self.chat_sessions.get(session_id)
        if session and hasattr(session, 'history'):
            return [
                {
                    "role": msg.role,
                    "content": msg.parts[0].text if msg.parts else ""
                }
                for msg in session.history
            ]
        return []


# Create singleton instance
gemini_chatbot_service = GeminiChatbotService()
