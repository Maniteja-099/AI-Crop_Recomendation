"""
Chatbot Service - Advanced AI Chatbot for Farmers
Context-aware, multilingual agricultural assistant
Supports: English, Hindi, Telugu, Kannada, Tamil, Marathi, and more
"""

import os
import re
import asyncio
import difflib
import logging
from typing import Dict, Any, List, Optional
from models.chat import ChatRequest, ChatResponse, QuickAction
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# 1. TRANSLATION SETUP (Deep Translator)
# ------------------------------------------------------------------
try:
    from deep_translator import GoogleTranslator
    HAS_TRANSLATION = True
except ImportError:
    logger.warning("deep-translator not installed. Falling back to rule-based responses.")
    HAS_TRANSLATION = False

# ------------------------------------------------------------------
# 2. GEMINI AI SETUP
# ------------------------------------------------------------------
HAS_GEMINI = False
gemini_model = None
gemini_fallback_model = None

# Ordered list of models to try (primary + fallbacks)
GEMINI_MODEL_CANDIDATES = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]

try:
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and len(api_key) > 10:
        genai.configure(api_key=api_key)
        primary_model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        gemini_model = genai.GenerativeModel(primary_model_name)
        # Setup fallback models (different from primary)
        fallback_names = [m for m in GEMINI_MODEL_CANDIDATES if m != primary_model_name]
        gemini_fallback_model = genai.GenerativeModel(fallback_names[0]) if fallback_names else None
        HAS_GEMINI = True
        logger.info(f"Gemini AI Configured: primary={primary_model_name}, fallback={fallback_names[0] if fallback_names else 'none'}")
    else:
        logger.warning("No valid GEMINI_API_KEY found.")
except ImportError:
    logger.warning("google-generativeai not installed.")
except Exception as e:
    logger.error(f"Gemini Setup Error: {e}")

class ChatbotService:
    """
    Advanced AI Chatbot Service for Agricultural Assistance
    Provides context-aware, multilingual responses using:
    1. Gemini AI (if available) -> for complex queries
    2. FAQ Matching -> for common farming questions
    3. Deep Translator -> for multilingual support (all languages)
    """
    
    # ------------------------------------------------------------------
    # ALL LANGUAGES supported by Google Translate / deep-translator
    # The chatbot accepts ANY language code; this map is for display only.
    # If a code is not listed here we still pass it through to the
    # translator – so effectively every Google-Translate language works.
    # ------------------------------------------------------------------
    SUPPORTED_LANGUAGES = {
        # --- Indian Languages ---
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "kn": "Kannada",
        "ta": "Tamil",
        "mr": "Marathi",
        "gu": "Gujarati",
        "pa": "Punjabi",
        "bn": "Bengali",
        "ml": "Malayalam",
        "or": "Odia",
        "as": "Assamese",
        "ur": "Urdu",
        "sd": "Sindhi",
        "ne": "Nepali",
        "si": "Sinhala",
        # --- European Languages ---
        "fr": "French",
        "de": "German",
        "es": "Spanish",
        "pt": "Portuguese",
        "it": "Italian",
        "nl": "Dutch",
        "pl": "Polish",
        "ro": "Romanian",
        "uk": "Ukrainian",
        "ru": "Russian",
        "cs": "Czech",
        "sv": "Swedish",
        "da": "Danish",
        "fi": "Finnish",
        "no": "Norwegian",
        "el": "Greek",
        "hu": "Hungarian",
        "bg": "Bulgarian",
        "hr": "Croatian",
        "sk": "Slovak",
        "sl": "Slovenian",
        "lt": "Lithuanian",
        "lv": "Latvian",
        "et": "Estonian",
        # --- Asian Languages ---
        "zh-CN": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
        "ja": "Japanese",
        "ko": "Korean",
        "th": "Thai",
        "vi": "Vietnamese",
        "id": "Indonesian",
        "ms": "Malay",
        "fil": "Filipino",
        "my": "Myanmar (Burmese)",
        "km": "Khmer",
        "lo": "Lao",
        # --- Middle Eastern / African ---
        "ar": "Arabic",
        "fa": "Persian",
        "he": "Hebrew",
        "tr": "Turkish",
        "sw": "Swahili",
        "am": "Amharic",
        "ha": "Hausa",
        "yo": "Yoruba",
        "zu": "Zulu",
        "af": "Afrikaans",
    }

    # Accept any language code (not just the ones listed above)
    @classmethod
    def _is_language_supported(cls, lang_code: str) -> bool:
        """Always return True – we let deep-translator handle validation."""
        return True
    
    # ------------------------------------------------------------------
    # 3. ROBUST FARMING KNOWLEDGE BASE (FAQs)
    # ------------------------------------------------------------------
    FAQ_KB = {
        # --- RICE ---
        "rice_general": {"q": ["how to grow rice", "rice cultivation", "paddy farming"], "a": "Rice needs flooded soil and warm weather. Sow in June-July (Kharif). Use SR-1 or IR-64 varieties."},
        "rice_blast": {"q": ["rice blast disease", "spots on rice leaves", "rice disease control"], "a": "For Rice Blast, spray Tricyclazole 75 WP @ 0.6 g/l or Carbendazim 50 WP @ 1 g/l. Avoid excess N fertilizer."},
        "stem_borer": {"q": ["stem borer control", "dead heart in rice", "white ears in rice"], "a": "For Stem Borer, apply Cartap Hydrochloride 4G @ 10kg/acre or spray Chlorantraniliprole 18.5 SC @ 0.3ml/l."},
        "rice_fertilizer": {"q": ["fertilizer for rice", "rice npk"], "a": "Apply 100 kg Nitrogen, 60 kg Phosphorus, 40 kg Potassium per hectare. Split Nitrogen dose provided at 3 stages."},

        # --- WHEAT ---
        "wheat_general": {"q": ["how to grow wheat", "wheat cultivation"], "a": "Wheat is a Rabi crop. Sow in Nov-Dec. Requires cool climate. Best varieties: HD 2967, PBW 343."},
        "wheat_rust": {"q": ["yellow rust in wheat", "wheat leaves turning yellow", "wheat disease"], "a": "For Yellow Rust in wheat, spray Propiconazole 25 EC @ 1ml/l. Grow resistant varieties like HD 2967."},
        "wheat_fertilizer": {"q": ["fertilizer for wheat", "wheat npk"], "a": "Apply DAP @ 55kg/acre and Urea @ 90kg/acre. Apply Urea in two splits after irrigation."},

        # --- COTTON ---
        "cotton_general": {"q": ["growing cotton", "cotton farming"], "a": "Cotton grows best in black soil. Sow in May-June. Maintain 60-90cm spacing."},
        "cotton_bollworm": {"q": ["cotton bollworm", "pink bollworm", "worms in cotton"], "a": "Install pheromone traps (5/acre). Spray Emamectin Benzoate 5 SG @ 0.5g/l or Profenofos 50 EC @ 2ml/l."},
        "cotton_leaf_curl": {"q": ["leaf curl in cotton", "curled leaves"], "a": "Control whitefly vectors using Acetamiprid or Diafenthiuron. Remove infected plants immediately."},

        # --- MAIZE / CORN ---
        "maize_general": {"q": ["how to grow maize", "corn farming", "makka"], "a": "Maize can be grown in Kharif, Rabi, and Zaid. Requires well-drained loamy soil. Sensitive to waterlogging."},
        "maize_pest": {"q": ["fall armyworm", "worm in maize whorl"], "a": "For Fall Armyworm, spray Spinetoram 11.7 SC @ 0.5ml/l or Emamectin Benzoate @ 0.4g/l into the whorl."},

        # --- SUGARCANE ---
        "sugarcane_general": {"q": ["sugarcane farming", "ganna cultivation"], "a": "Plant setts in furrows. Requires high water (1500-2500mm). Top dressing of Urea is essential."},
        "sugarcane_red_rot": {"q": ["red rot in sugarcane", "red stems"], "a": "Use healthy setts. Treat setts with Carbendazim. Grow resistant varieties like Co 86032."},

        # --- VEGETABLES ---
        "tomato_blight": {"q": ["tomato leaves drying", "black spots on tomato", "blight"], "a": "For Early/Late Blight in tomato, spray Mancozeb 75 WP @ 2.5g/l or Metalaxyl + Mancozeb @ 2g/l."},
        "potato_blight": {"q": ["potato blight", "rotting potato leaves"], "a": "Spray Ridomil Gold @ 2g/l or Mancozeb. Ensure proper earthing up."},
        "onion_thrips": {"q": ["thrips in onion", "white insects on onion"], "a": "Spray Fipronil 5 SC @ 2ml/l or Profenofos. Use blue sticky traps."},

        # --- GENERAL FARMING ---
        "soil_ph": {"q": ["fix acidic soil", "increase soil ph", "liming", "soil ph", "acidic soil", "alkaline soil"], "a": "To fix acidic soil (low pH), apply agricultural lime. For alkaline soil (high pH), use gypsum."},
        "irrigation_time": {"q": ["best time to water crops", "when to irrigate", "irrigation", "watering", "water schedule"], "a": "The best time to irrigate is early morning or late evening to minimize evaporation."},
        "organic_farming": {"q": ["organic fertilizer", "make compost", "natural farming", "organic", "bio fertilizer"], "a": "Use Vermicompost, Cow Dung Manure (FYM), and Jeevamrutham. Neem oil for pest control. Avoid chemical pesticides."},
        "vermicompost": {"q": ["how to make vermicompost", "earthworm manure", "worm compost"], "a": "Layer crop waste and cow dung. Add earthworms (Eisenia fetida). Keep moist. Ready in 45-60 days."},
        "drip_irrigation": {"q": ["drip irrigation benefits", "save water", "drip", "micro irrigation"], "a": "Drip irrigation saves 40-60% water and improves yield by delivering water directly to roots."},
        "crop_rotation": {"q": ["crop rotation", "rotate crops", "what to grow next", "next crop", "rotation plan"], "a": "Rotate legumes with cereals. Example: Rice-Wheat, Maize-Soybean. Legumes fix nitrogen and improve soil fertility for the next crop."},
        "crop_recommendation": {"q": ["which crop to grow", "what crop should i grow", "best crop", "recommend crop", "suggest crop", "suitable crop", "profitable crop"], "a": "The best crop depends on your soil, climate, and season. For Kharif (June-July): Rice, Cotton, Maize, Soybean. For Rabi (Oct-Nov): Wheat, Mustard, Chickpea. Get a soil test done first and check our Crop Recommendation tool for personalized advice."},
        "seed_treatment": {"q": ["seed treatment", "treat seeds", "seeds before sowing"], "a": "Treat seeds with Carbendazim 2g/kg or Trichoderma viride 4g/kg before sowing. This prevents seedborne diseases."},
        "harvest_time": {"q": ["when to harvest", "harvest time", "harvesting", "crop ready"], "a": "Harvest when grain moisture is 20-22%. For rice, when 80% grains turn golden. For wheat, when leaves dry and grain is hard."},
        "pest_general": {"q": ["pest control", "insect control", "pesticide", "bugs on crops", "insects", "pest"], "a": "Use Integrated Pest Management (IPM): light traps, pheromone traps, neem oil spray (5ml/l), and targeted pesticides only when pest population crosses Economic Threshold Level."},
        "weed_control": {"q": ["weed control", "remove weeds", "herbicide", "weed management"], "a": "Manual weeding at 20-25 and 40-45 days. Pre-emergence herbicides like Pendimethalin can be applied within 3 days of sowing."},
        "soil_testing": {"q": ["soil test", "test my soil", "soil analysis", "soil quality", "soil health", "check soil"], "a": "Get your soil tested every 2-3 years at the nearest Krishi Vigyan Kendra or agricultural lab. Test for NPK, pH, EC, and organic carbon."},
        "mulching": {"q": ["mulching", "mulch", "cover soil"], "a": "Mulching conserves soil moisture, controls weeds, and maintains soil temperature. Use straw, dried leaves, or plastic mulch."},
        "nitrogen": {"q": ["nitrogen deficiency", "yellow leaves", "nitrogen", "urea"], "a": "Nitrogen deficiency shows as yellowing of older leaves. Apply Urea (46% N) at 50-60 kg/acre in 2-3 splits. Avoid excess to prevent lodging."},
        "phosphorus": {"q": ["phosphorus deficiency", "purple leaves", "phosphorus", "dap"], "a": "Phosphorus deficiency shows as purple/dark leaves and poor rooting. Apply DAP or SSP at sowing time."},
        "potassium": {"q": ["potassium deficiency", "brown leaf edges", "potassium", "mop"], "a": "Potassium deficiency shows as brown/scorched leaf edges. Apply MOP (Muriate of Potash) at 30-40 kg/acre."},
        "climate_smart": {"q": ["climate change", "drought resistant", "flood tolerant", "climate smart"], "a": "Use drought-tolerant varieties (DRR Dhan 42 for rice), rainwater harvesting, conservation tillage, and crop diversification."},
        "sowing_season": {"q": ["sowing season", "when to sow", "planting time", "sowing time", "when to plant"], "a": "Kharif (June-July): Rice, Cotton, Maize, Soybean. Rabi (Oct-Nov): Wheat, Mustard, Chickpea. Zaid (Feb-Mar): Watermelon, Cucumber."},
        "fertilizer_general": {"q": ["fertilizer", "which fertilizer", "best fertilizer", "npk", "manure", "fertilizer recommendation", "fertilizer advice", "fertilizer suggestion"], "a": "Follow soil test recommendations. General guide: Urea for Nitrogen, DAP for Phosphorus, MOP for Potassium. Always apply based on soil test."},
        "yield_improve": {"q": ["improve yield", "increase yield", "better yield", "more production", "increase production", "good yield", "boost production", "higher yield", "maximize yield"], "a": "To improve yield: 1) Get soil tested and follow nutrient recommendations. 2) Use certified seeds. 3) Timely sowing. 4) Proper irrigation. 5) IPM for pests. 6) Balanced fertilization."},
        
        # --- GREETINGS & GENERAL ---
        "hello_general": {"q": ["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening", "greetings"], "a": "Namaste! I am your AI Farming Assistant. I can help you with crop recommendations, soil health, fertilizer advice, weather guidance, pest control, government schemes, and more. What would you like to know?"},
        "thanks": {"q": ["thank you", "thanks", "thank", "dhanyavaad", "shukriya"], "a": "You're welcome! I'm always here to help with your farming questions. Feel free to ask anything about agriculture."},
        "who_are_you": {"q": ["who are you", "what are you", "your name", "introduce yourself", "what can you do", "help me", "what do you know"], "a": "I am your AI Farming Assistant! I can help with crop recommendations, soil health analysis, fertilizer advice, weather risk assessment, pest control, irrigation tips, government schemes like PM-KISAN, and more. Just ask!"},
        
        # --- ADDITIONAL FARMING TOPICS ---
        "monsoon_farming": {"q": ["monsoon crop", "rainy season crop", "kharif crop list", "monsoon farming"], "a": "Kharif (monsoon) crops: Rice, Maize, Cotton, Soybean, Groundnut, Bajra, Jowar. Sow in June-July after first monsoon rains."},
        "rabi_farming": {"q": ["rabi crop", "winter crop", "rabi farming", "cold season crop"], "a": "Rabi (winter) crops: Wheat, Mustard, Chickpea (Chana), Peas, Barley, Lentil. Sow in October-November."},
        "water_saving": {"q": ["save water", "water conservation", "reduce water usage", "water efficient"], "a": "Water conservation tips: 1) Use drip/sprinkler irrigation. 2) Mulch soil to reduce evaporation. 3) Rainwater harvesting. 4) Grow drought-tolerant varieties. 5) Irrigate at optimal times (early morning)."},
        "profit_farming": {"q": ["profitable crop", "earn money farming", "high income crop", "cash crop", "money from farming"], "a": "High-value crops include vegetables (tomato, chili), fruits (banana, mango), spices (turmeric, ginger), and cash crops (cotton, sugarcane). Market linkage and value addition can boost income."},
        "disease_general": {"q": ["plant disease", "crop disease", "leaf disease", "disease identification", "disease treatment", "sick plant", "dying plant", "wilting"], "a": "Common crop diseases: 1) Fungal - spray Mancozeb/Carbendazim. 2) Bacterial - use copper-based fungicides. 3) Viral - remove infected plants, control vectors. Always identify the disease before treatment. Consult local agriculture officer for diagnosis."},
        
        # --- GOVERNMENT SCHEMES ---
        "pm_kisan": {"q": ["pm kisan scheme", "6000 rupees", "pm kisan", "government scheme", "subsidy", "farmer scheme", "government help"], "a": "PM-KISAN provides Rs. 6000/year to farmers in 3 installments. Register at pmkisan.gov.in."},
        "soil_card": {"q": ["soil health card", "government soil test", "soil card"], "a": "SHC scheme provides free soil testing every 3 years. Contact your local agriculture department."},
        "crop_insurance": {"q": ["crop insurance", "pmfby", "insurance", "fasal bima"], "a": "PMFBY (Pradhan Mantri Fasal Bima Yojana) covers crop losses due to natural calamities. Premium: 2% for Kharif, 1.5% for Rabi."},
        "kcc": {"q": ["kisan credit card", "kcc", "farm loan", "loan", "credit", "bank loan for farmer"], "a": "Kisan Credit Card provides loans up to Rs. 3 lakh at 4% interest. Apply at any bank with land documents."}
    }
    
    INTENT_BASE = {
        "greeting": {
            "keywords": ["hello", "hi", "namaste", "help", "start", "hey", "good morning", "good evening", "greetings", "howdy"],
            "response": "Namaste! I am your AI Farming Assistant. Ask me about crops, diseases, fertilizers, weather, soil health, or government schemes."
        },
        "weather": {
            "keywords": ["weather", "rain", "forecast", "monsoon", "temperature", "climate", "hot", "cold", "storm", "flood", "drought"],
            "response": "Weather is crucial for farming. Check our Weather tab for live conditions and 7-day forecast. Key tips: irrigate before expected heat waves, drain fields before heavy rains."
        },
        "market": {
            "keywords": ["price", "market", "mandi", "rate", "sell", "selling", "buy", "trade", "income"],
            "response": "Check e-NAM (enam.gov.in) or local mandi rates before selling. Compare prices across multiple mandis for best returns."
        },
        "soil": {
            "keywords": ["soil check", "soil health", "test soil", "soil quality", "earth", "ground", "land quality"],
            "response": "Healthy soil is key to good farming. Get your soil NPK values tested regularly at your nearest Krishi Vigyan Kendra. Use our Soil Fertility tool for AI-powered analysis."
        },
        "farming_general": {
            "keywords": ["farm", "farming", "agriculture", "cultivation", "grow", "plant", "crop", "kheti", "kisan"],
            "response": "I can help with many farming topics! Ask me about: crop recommendations, soil health, fertilizer advice, pest control, weather guidance, irrigation tips, or government schemes for farmers."
        }
    }

    QUICK_ACTIONS = {
        "general": [
            QuickAction(label="Check Soil Health", action="soil_check", icon="🧪"),
            QuickAction(label="Weather Forecast", action="weather_check", icon="☁️"),
            QuickAction(label="Crop Recommendation", action="crop_recommend", icon="🌾"),
        ]
    }

    def __init__(self):
        pass  # Stateless service — sessions managed externally

    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """
        Process message: Translate -> Understand (Gemini/FAQ) -> Respond -> Translate Back
        Supports ALL languages via deep-translator (Google Translate).
        """
        user_msg = request.message.strip()
        # Accept any language code – don't restrict to SUPPORTED_LANGUAGES keys
        lang = request.language if request.language else "en"
        context = request.farm_context or {}
        
        # 1. TRANSLATE TO ENGLISH (if needed)
        english_query = user_msg
        if HAS_TRANSLATION and lang != "en":
            try:
                # Use Deep Translator with auto-detect source
                english_query = GoogleTranslator(source='auto', target='en').translate(user_msg)
                logger.info(f"Translated '{user_msg}' ({lang}) -> '{english_query}' (en)")
            except Exception as e:
                logger.error(f"Translation Error: {e}")
                
        english_query_lower = english_query.lower()

        # 2. DETERMINE ANSWER
        response_text = ""
        intent = None
        system_warning = ""
        
        # Get the full language name for the Gemini prompt
        lang_name = self.SUPPORTED_LANGUAGES.get(lang, lang)
        
        # A0. Quick Greeting Check (before heavy processing)
        greeting_words = {"hello", "hi", "hey", "namaste", "help", "start", "greetings", "howdy",
                         "good morning", "good evening", "good afternoon"}
        cleaned_for_greeting = self._clean_query(english_query_lower)
        query_tokens = set(cleaned_for_greeting.split())
        if query_tokens.intersection(greeting_words) and len(cleaned_for_greeting.split()) <= 8:
            # Short greeting-like messages - respond with greeting
            response_text = self.FAQ_KB.get("hello_general", {}).get("a",
                "Namaste! I am your AI Farming Assistant. Ask me about crops, diseases, fertilizers, weather, soil health, or government schemes.")
            intent = "greeting"
        
        # A. Try Gemini AI (First Priority - only if not a simple greeting)
        if not response_text and HAS_GEMINI and gemini_model:
            try:
                # Build Prompt – ask Gemini to reply directly in user's language
                if lang != "en":
                    prompt = f"""
                    You are an expert AI agricultural assistant.
                    The user is speaking in {lang_name} (language code: {lang}).
                    Answer the user's question concisely and RESPOND DIRECTLY IN {lang_name}.
                    IMPORTANT: Use the actual local/regional names for crops, fertilizers, soil types,
                    and agricultural terms as they are known to farmers in {lang_name}-speaking regions.
                    For example, use the local name for rice (not a transliteration of "rice"),
                    the local name for soil types, fertilizer names in local script, etc.
                    Do NOT include emojis in your response.
                    User Question (translated to English): {english_query}
                    Original User Message: {user_msg}
                    Context: {str(context)}
                    Keep answer under 100 words. Focus on practical farming advice.
                    Reply in {lang_name} language ONLY using local agricultural terminology.
                    """
                else:
                    prompt = f"""
                    You are an expert AI agricultural assistant. Answer the user's question concisely.
                    Do NOT include emojis in your response.
                    User Question: {english_query}
                    Context: {str(context)}
                    Keep answer under 100 words. Focus on practical farming advice.
                    """
                ai_response = gemini_model.generate_content(prompt)
                if ai_response.text:
                    response_text = ai_response.text.strip()
                    intent = "ai_generated"
            except Exception as e:
                logger.error(f"Gemini Generation Error: {e}")
                error_msg = str(e).lower()
                if "429" in str(e) or "quota" in error_msg or "rate" in error_msg:
                    # Rate limited — try fallback model, then async retry
                    if gemini_fallback_model:
                        try:
                            logger.info("Primary Gemini model quota exceeded, trying fallback model...")
                            ai_response = gemini_fallback_model.generate_content(prompt)
                            if ai_response.text:
                                response_text = ai_response.text.strip()
                                intent = "ai_generated"
                        except Exception as fallback_err:
                            logger.error(f"Fallback model also failed: {fallback_err}")
                    
                    # If fallback also failed, try async retry on primary
                    if not response_text:
                        await asyncio.sleep(2)
                        try:
                            ai_response = gemini_model.generate_content(prompt)
                            if ai_response.text:
                                response_text = ai_response.text.strip()
                                intent = "ai_generated"
                        except Exception:
                            logger.warning("All Gemini attempts exhausted, falling back to FAQ.")
                elif "expired" in error_msg or "invalid" in error_msg:
                    logger.warning("Gemini API Key issue, falling back to FAQ.")
        
        # B. Check FAQ database (Fallback)
        if not response_text:
            best_faq_match = self._find_faq_match(english_query_lower)
            if best_faq_match:
                response_text = best_faq_match
                intent = "faq"
        
        # C. Check Intents (Fallback 2)
        if not response_text:
            intent_match = self._detect_intent_from_keywords(english_query_lower)
            if intent_match:
                response_text = self.INTENT_BASE[intent_match]["response"]
                intent = intent_match
        
        # D. Intelligent Fallback – Use fuzzy search on FAQ answers
        if not response_text:
            # Try a more lenient search: find closest matching FAQ
            cleaned = self._clean_query(english_query_lower)
            content_words = set(cleaned.split()) - {'i', 'me', 'my', 'a', 'an', 'the', 'is', 'are',
                'do', 'does', 'to', 'of', 'in', 'for', 'on', 'with', 'what', 'how', 'can',
                'should', 'about', 'please', 'tell', 'know', 'want', 'need'}
            
            # Try matching any single content word against FAQ keywords
            best_fallback = None
            best_fb_score = 0
            for key, data in self.FAQ_KB.items():
                for question in data["q"]:
                    q_cleaned = self._clean_query(question)
                    for cw in content_words:
                        if len(cw) >= 3 and cw in q_cleaned:
                            score = len(cw)
                            if score > best_fb_score:
                                best_fb_score = score
                                best_fallback = data["a"]
            
            if best_fallback:
                response_text = best_fallback
                intent = "faq_fuzzy"
            else:
                # True generic fallback with farming-specific guidance
                farming_tips = [
                    "For crop recommendations, try asking: 'Which crop should I grow?' or 'Best crop for my soil'",
                    "For soil health, ask: 'How to improve soil fertility?'",
                    "For fertilizer advice, ask: 'Which fertilizer should I use?'",
                    "For pest control, ask: 'How to control pests in my crop?'",
                    "For weather guidance, ask: 'What is the weather risk?'",
                    "For government schemes, ask: 'Tell me about PM-KISAN scheme'",
                    "For irrigation tips, ask: 'Best time to water crops?'"
                ]
                selected_tips = farming_tips[:4]
                response_text = (
                    "I'm your AI farming assistant! I can help with many agricultural topics. "
                    "Here are some things you can ask me:\n" + "\n".join(selected_tips)
                )
                intent = "general_guidance"

        # Log warning (don't pollute user response with system notices)
        if system_warning:
            logger.warning(system_warning)

        # 3. TRANSLATE RESPONSE BACK (if needed)
        # If Gemini already replied in the target language, skip re-translation
        final_response = response_text
        if lang != "en" and intent != "ai_generated":
            # Step A: Replace known agricultural terms with proper regional names
            try:
                from config.regional_terms import translate_agricultural_text
                final_response = translate_agricultural_text(final_response, lang)
            except Exception:
                pass  # regional_terms import may fail; continue with original

            # Step B: Machine-translate the rest
            if HAS_TRANSLATION:
                try:
                    final_response = GoogleTranslator(source='en', target=lang).translate(final_response)
                except Exception as e:
                    logger.error(f"Back-Translation Error (deep-translator): {e}")
            elif HAS_GEMINI and gemini_model:
                # Fallback: use Gemini to translate FAQ/intent responses when deep-translator is unavailable
                try:
                    lang_name_t = self.SUPPORTED_LANGUAGES.get(lang, lang)
                    trans_prompt = (
                        f"Translate the following English agricultural text to {lang_name_t}. "
                        f"Output ONLY the translated text. Do not add explanations, headers, or extra content.\n\n"
                        f"{response_text}"
                    )
                    trans_resp = gemini_model.generate_content(trans_prompt)
                    if trans_resp.text:
                        final_response = trans_resp.text.strip()
                        logger.info(f"Gemini-translated FAQ response to {lang_name_t}")
                except Exception as e:
                    logger.error(f"Back-Translation Error (Gemini fallback): {e}")

        # 4. PREPARE TTS (strip emojis, keep all language chars)
        tts_text = self._clean_for_tts(final_response)
        
        # 5. TRANSLATE QUICK ACTIONS
        base_quick_actions = self.QUICK_ACTIONS.get("general", [])
        final_quick_actions = []
        
        for qa in base_quick_actions:
            label = qa.label
            if lang != "en":
                if HAS_TRANSLATION:
                    try:
                        label = GoogleTranslator(source='en', target=lang).translate(label)
                    except Exception:
                        pass
                elif HAS_GEMINI and gemini_model:
                    try:
                        lang_name_t = self.SUPPORTED_LANGUAGES.get(lang, lang)
                        qa_prompt = f"Translate to {lang_name_t} (output ONLY the translation): {qa.label}"
                        qa_resp = gemini_model.generate_content(qa_prompt)
                        if qa_resp.text:
                            label = qa_resp.text.strip()
                    except Exception:
                        pass
            final_quick_actions.append(QuickAction(label=label, action=qa.action, icon=qa.icon))
        
        return ChatResponse(
            success=True,
            message=final_response,
            tts_message=tts_text,
            language=lang,
            response_type=intent or "general",
            quick_actions=final_quick_actions,
            should_speak=True
        )

    @staticmethod
    def _clean_query(text: str) -> str:
        """Remove punctuation and extra spaces for better matching"""
        cleaned = re.sub(r'[^\w\s]', ' ', text)
        return re.sub(r'\s+', ' ', cleaned).strip().lower()

    def _find_faq_match(self, query: str) -> Optional[str]:
        """Find best matching FAQ answer using combined keyword overlap + substring + fuzzy matching"""
        best_score = 0
        best_answer = None
        cleaned_query = self._clean_query(query)
        query_words = set(cleaned_query.split())
        # Remove common stop words for better matching
        stop_words = {'i', 'me', 'my', 'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be',
                       'do', 'does', 'did', 'to', 'of', 'in', 'for', 'on', 'with', 'at',
                       'by', 'from', 'it', 'this', 'that', 'what', 'which', 'how', 'can',
                       'should', 'about', 'will', 'would', 'could', 'please', 'tell',
                       'know', 'want', 'need', 'give', 'get', 'make', 'use', 'has', 'have'}
        content_words = query_words - stop_words
        
        for key, data in self.FAQ_KB.items():
            for question in data["q"]:
                q_lower = question.lower()
                q_cleaned = self._clean_query(question)
                q_words = set(q_cleaned.split())
                q_content = q_words - stop_words
                
                # Score 1: Word overlap (using cleaned words)
                word_overlap = len(query_words.intersection(q_words))
                content_overlap = len(content_words.intersection(q_content)) * 1.5  # Boost content word matches
                
                # Score 2: Substring match (e.g. "fertilizer" in query matches "fertilizer" in FAQ)
                substring_bonus = 0
                for q_word in q_words:
                    if len(q_word) >= 4 and q_word in cleaned_query:
                        substring_bonus += 1
                # Reverse: check if query content words appear in FAQ question
                for qw in content_words:
                    if len(qw) >= 4 and qw in q_cleaned:
                        substring_bonus += 1
                
                # Score 3: Full phrase containment
                phrase_bonus = 3 if q_cleaned in cleaned_query or cleaned_query in q_cleaned else 0
                
                # Score 4: Fuzzy match using difflib
                fuzzy_ratio = difflib.SequenceMatcher(None, cleaned_query, q_cleaned).ratio()
                fuzzy_bonus = fuzzy_ratio * 3  # Up to 3 points for high similarity
                
                # Score 5: Stem/partial word matching (handles plurals, "crops" vs "crop")
                stem_bonus = 0
                for qw in content_words:
                    for fw in q_content:
                        if len(qw) >= 4 and len(fw) >= 4:
                            if qw.startswith(fw[:4]) or fw.startswith(qw[:4]):
                                stem_bonus += 0.5
                
                total_score = word_overlap + content_overlap + substring_bonus + phrase_bonus + fuzzy_bonus + stem_bonus
                
                if total_score > best_score:
                    best_score = total_score
                    best_answer = data["a"]
        
        # Lower threshold to 1.5 to catch more queries
        if best_score >= 1.5:
            return best_answer
        return None

    def _detect_intent_from_keywords(self, query: str) -> Optional[str]:
        for intent, data in self.INTENT_BASE.items():
            for keyword in data["keywords"]:
                if keyword in query: return intent
        return None
        
    def _clean_for_tts(self, text: str) -> str:
        """
        Remove emojis and special symbols from text for clean TTS output.
        Preserves ALL language characters (Hindi, Arabic, Chinese, etc.)
        by targeting only emoji Unicode ranges.
        """
        # Comprehensive emoji removal pattern
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # Emoticons
            "\U0001F300-\U0001F5FF"  # Misc Symbols & Pictographs
            "\U0001F680-\U0001F6FF"  # Transport & Map
            "\U0001F1E0-\U0001F1FF"  # Flags
            "\U00002702-\U000027B0"  # Dingbats
            "\U000024C2-\U0001F251"  # Enclosed chars
            "\U0001F900-\U0001F9FF"  # Supplemental Symbols
            "\U0001FA00-\U0001FA6F"  # Chess Symbols
            "\U0001FA70-\U0001FAFF"  # Symbols Extended-A
            "\U00002600-\U000026FF"  # Misc Symbols
            "\U0000FE00-\U0000FE0F"  # Variation Selectors
            "\U0000200D"             # Zero Width Joiner
            "\U00000023\U0000FE0F?\U000020E3"  # Keycap #
            "\U0000002A\U0000FE0F?\U000020E3"  # Keycap *
            "\U00000030-\U00000039\U0000FE0F?\U000020E3"  # Keycap 0-9
            "\U0000200B"             # Zero Width Space
            "\U00002B50"             # Star
            "\U00002B05-\U00002B07"  # Arrows
            "\U00002934-\U00002935"  # Arrows
            "\U00003030"             # Wavy Dash
            "\U000025AA-\U000025AB"  # Squares
            "\U000025FB-\U000025FE"  # Squares
            "\U000025B6\U000025C0"   # Play/Reverse
            "\U00002122\U00002139"   # TM & Info
            "\U0000231A-\U0000231B"  # Watch/Hourglass
            "\U000023E9-\U000023F3"  # Media controls
            "\U000023F8-\U000023FA"  # Media controls
            "\U0000203C\U00002049"   # Punctuation
            "\U000020E3"             # Combining Enclosing Keycap
            "\U000000A9\U000000AE"   # © ®
            "⚠️"
            "]+",
            flags=re.UNICODE
        )
        text = emoji_pattern.sub('', text)
        # Clean up extra whitespace left behind
        text = re.sub(r'\s+', ' ', text).strip()
        return text

# Singleton
_chatbot_service: Optional[ChatbotService] = None

def get_chatbot_service() -> ChatbotService:
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service
