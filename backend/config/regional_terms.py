"""
Regional Agricultural Terminology Mappings
==========================================
Provides culturally accurate translations of agricultural terms
instead of literal machine translation.

Each term is mapped to its actual regional name as used by farmers
in that language/region. This covers:
- Crop names (what farmers actually call them)
- Fertilizer names (local brand/generic names)
- Soil health terms
- Weather/season terms
- Common agricultural vocabulary

Supported languages: hi (Hindi), te (Telugu), ta (Tamil), kn (Kannada), mr (Marathi)
"""

# ============================================
# CROP NAMES — Local names as used by farmers
# ============================================
CROP_NAMES = {
    "rice":       {"hi": "धान",        "te": "వరి",       "ta": "நெல்",      "kn": "ಭತ್ತ",      "mr": "भात/तांदूळ"},
    "wheat":      {"hi": "गेहूं",       "te": "గోధుమ",     "ta": "கோதுமை",    "kn": "ಗೋಧಿ",      "mr": "गहू"},
    "maize":      {"hi": "मक्का",       "te": "మొక్కజొన్న", "ta": "மக்காச்சோளம்", "kn": "ಮೆಕ್ಕೆಜೋಳ",  "mr": "मका"},
    "cotton":     {"hi": "कपास",       "te": "పత్తి",      "ta": "பருத்தி",    "kn": "ಹತ್ತಿ",      "mr": "कापूस"},
    "sugarcane":  {"hi": "गन्ना",       "te": "చెరకు",     "ta": "கரும்பு",    "kn": "ಕಬ್ಬು",      "mr": "ऊस"},
    "pulses":     {"hi": "दालें",       "te": "పప్పు దినుసులు", "ta": "பருப்பு வகைகள்", "kn": "ಬೇಳೆಕಾಳುಗಳು", "mr": "कडधान्य"},
    "groundnut":  {"hi": "मूंगफली",     "te": "వేరుశెనగ",   "ta": "நிலக்கடலை",  "kn": "ಕಡಲೆಕಾಯಿ",   "mr": "भुईमूग"},
    "soybean":    {"hi": "सोयाबीन",     "te": "సోయాబీన్",   "ta": "சோயாபீன்",   "kn": "ಸೋಯಾಬೀನ್",   "mr": "सोयाबीन"},
    "potato":     {"hi": "आलू",         "te": "బంగాళాదుంప", "ta": "உருளைக்கிழங்கு", "kn": "ಆಲೂಗೆಡ್ಡೆ",   "mr": "बटाटा"},
    "jute":       {"hi": "जूट/पटसन",    "te": "జనపనార",    "ta": "சணல்",       "kn": "ಸೆಣಬು",      "mr": "ताग/जूट"},
    "barley":     {"hi": "जौ",          "te": "బార్లీ",     "ta": "வாற்கோதுமை", "kn": "ಬಾರ್ಲಿ",     "mr": "जव/सातू"},
    "millets":    {"hi": "बाजरा",       "te": "రాగులు",    "ta": "தினை வகைகள்", "kn": "ರಾಗಿ",       "mr": "बाजरी"},
    "coffee":     {"hi": "कॉफी",        "te": "కాఫీ",      "ta": "காபி",       "kn": "ಕಾಫಿ",       "mr": "कॉफी"},
    "coconut":    {"hi": "नारियल",      "te": "కొబ్బరి",    "ta": "தேங்காய்",   "kn": "ತೆಂಗಿನಕಾಯಿ",  "mr": "नारळ"},
    "banana":     {"hi": "केला",        "te": "అరటి",      "ta": "வாழை",       "kn": "ಬಾಳೆ",       "mr": "केळी"},
    "mango":      {"hi": "आम",          "te": "మామిడి",    "ta": "மாம்பழம்",    "kn": "ಮಾವು",       "mr": "आंबा"},
    "tomato":     {"hi": "टमाटर",       "te": "టమాటా",     "ta": "தக்காளி",    "kn": "ಟೊಮೇಟೊ",    "mr": "टोमॅटो"},
    "onion":      {"hi": "प्याज",       "te": "ఉల్లిపాయ",  "ta": "வெங்காயம்",  "kn": "ಈರುಳ್ಳಿ",    "mr": "कांदा"},
    "turmeric":   {"hi": "हल्दी",       "te": "పసుపు",     "ta": "மஞ்சள்",     "kn": "ಅರಿಶಿನ",     "mr": "हळद"},
    "chilli":     {"hi": "मिर्च",       "te": "మిరపకాయ",   "ta": "மிளகாய்",    "kn": "ಮೆಣಸಿನಕಾಯಿ",  "mr": "मिरची"},
    "mustard":    {"hi": "सरसों",       "te": "ఆవాలు",     "ta": "கடுகு",      "kn": "ಸಾಸಿವೆ",     "mr": "मोहरी"},
    "lentil":     {"hi": "मसूर दाल",    "te": "మసూర్ పప్పు", "ta": "மசூர் பருப்பு", "kn": "ಮಸೂರ ಬೇಳೆ",  "mr": "मसूर डाळ"},
    "chickpea":   {"hi": "चना",         "te": "శెనగలు",    "ta": "கொண்டைக்கடலை", "kn": "ಕಡಲೆ",      "mr": "हरभरा"},
    "watermelon": {"hi": "तरबूज",       "te": "పుచ్చకాయ",  "ta": "தர்பூசணி",   "kn": "ಕಲ್ಲಂಗಡಿ",   "mr": "कलिंगड"},
    "papaya":     {"hi": "पपीता",       "te": "బొప్పాయి",   "ta": "பப்பாளி",    "kn": "ಪಪ್ಪಾಯ",     "mr": "पपई"},
    "apple":      {"hi": "सेब",         "te": "ఆపిల్",     "ta": "ஆப்பிள்",    "kn": "ಸೇಬು",       "mr": "सफरचंद"},
    "grapes":     {"hi": "अंगूर",       "te": "ద్రాక్ష",    "ta": "திராட்சை",   "kn": "ದ್ರಾಕ್ಷಿ",    "mr": "द्राक्ष"},
    "pomegranate":{"hi": "अनार",        "te": "దానిమ్మ",    "ta": "மாதுளை",     "kn": "ದಾಳಿಂಬ",     "mr": "डाळिंब"},
    "orange":     {"hi": "संतरा",       "te": "నారింజ",    "ta": "ஆரஞ்சு",     "kn": "ಕಿತ್ತಳೆ",    "mr": "संत्रा"},
    "peas":       {"hi": "मटर",         "te": "బఠానీ",     "ta": "பட்டாணி",    "kn": "ಬಟಾಣಿ",      "mr": "वाटाणा"},
    "muskmelon":  {"hi": "खरबूजा",      "te": "ఖర్బూజ",    "ta": "முலாம் பழம்", "kn": "ಕರಬೂಜ",     "mr": "खरबूज"},
    "kidneybeans":{"hi": "राजमा",       "te": "రాజ్మా",     "ta": "ராஜ்மா",     "kn": "ರಾಜ್ಮಾ",     "mr": "राजमा"},
    "pigeonpeas": {"hi": "अरहर दाल",    "te": "కందిపప్పు",  "ta": "துவரம்பருப்பு", "kn": "ತೊಗರಿ ಬೇಳೆ", "mr": "तूर डाळ"},
    "mothbeans":  {"hi": "मोठ",         "te": "మోత్ బీన్స్", "ta": "மோத் பீன்ஸ்", "kn": "ಮೋತ್ ಬೀನ್ಸ್", "mr": "मटकी"},
    "mungbean":   {"hi": "मूंग",        "te": "పెసలు",     "ta": "பாசிப்பயறு",  "kn": "ಹೆಸರು ಕಾಳು", "mr": "मूग"},
    "blackgram":  {"hi": "उड़द",        "te": "మినపప్పు",   "ta": "உளுந்து",    "kn": "ಉದ್ದು",      "mr": "उडीद"},
    "lentils":    {"hi": "दाल",         "te": "పప్పు",      "ta": "பருப்பு",    "kn": "ಬೇಳೆ",       "mr": "डाळ"},
}

# ============================================
# FERTILIZER NAMES — As known locally
# ============================================
# Note: Chemical fertilizers like Urea, DAP are mostly known by the same name
# across Indian languages, but we add local script versions
FERTILIZER_NAMES = {
    "Urea":           {"hi": "यूरिया",       "te": "యూరియా",      "ta": "யூரியா",      "kn": "ಯೂರಿಯಾ",     "mr": "युरिया"},
    "DAP":            {"hi": "डी.ए.पी.",    "te": "డి.ఎ.పి.",    "ta": "டி.ஏ.பி.",    "kn": "ಡಿ.ಎ.ಪಿ.",   "mr": "डी.ए.पी."},
    "17-17-17":       {"hi": "17-17-17 (संतुलित खाद)", "te": "17-17-17 (సమతుల్య ఎరువు)", "ta": "17-17-17 (சமச்சீர் உரம்)", "kn": "17-17-17 (ಸಮತೋಲಿತ ಗೊಬ್ಬರ)", "mr": "17-17-17 (संतुलित खत)"},
    "20-20":          {"hi": "20-20 (संयुक्त खाद)", "te": "20-20 (మిశ్రమ ఎరువు)", "ta": "20-20 (கலப்பு உரம்)", "kn": "20-20 (ಮಿಶ್ರ ಗೊಬ್ಬರ)", "mr": "20-20 (मिश्र खत)"},
    "14-35-14":       {"hi": "14-35-14 (फॉस्फोरस प्रधान)", "te": "14-35-14 (భాస్వరం ప్రధానం)", "ta": "14-35-14 (பாஸ்பரஸ் மிகுதி)", "kn": "14-35-14 (ರಂಜಕ ಪ್ರಧಾನ)", "mr": "14-35-14 (स्फुरद प्रधान)"},
    "10-26-26":       {"hi": "10-26-26 (पोटाश प्रधान)", "te": "10-26-26 (పొటాష్ ప్రధానం)", "ta": "10-26-26 (பொட்டாஷ் மிகுதி)", "kn": "10-26-26 (ಪೊಟ್ಯಾಷ್ ಪ್ರಧಾನ)", "mr": "10-26-26 (पालाश प्रधान)"},
    "28-28":          {"hi": "28-28 (NPK मिश्रण)", "te": "28-28 (NPK మిశ్రమం)", "ta": "28-28 (NPK கலவை)", "kn": "28-28 (NPK ಮಿಶ್ರಣ)", "mr": "28-28 (NPK मिश्रण)"},
    "Minimal/Organic":{"hi": "जैविक/न्यूनतम खाद", "te": "సేంద్రీయ/కనిష్ట ఎరువు", "ta": "இயற்கை/குறைந்தபட்ச உரம்", "kn": "ಸಾವಯವ/ಕನಿಷ್ಠ ಗೊಬ್ಬರ", "mr": "सेंद्रिय/किमान खत"},
}

# ============================================
# SOIL STATUS TERMS
# ============================================
SOIL_STATUS = {
    "Infertile Soil":     {"hi": "अनुपजाऊ मिट्टी",     "te": "నిస్సారమైన నేల",     "ta": "பயனற்ற மண்",       "kn": "ಬರಡು ಮಣ್ಣು",      "mr": "नापीक माती"},
    "Semi-Fertile Soil":  {"hi": "अर्ध-उपजाऊ मिट्टी",  "te": "మధ్యస్థ సారవంతమైన నేల", "ta": "அரை-வளமான மண்",    "kn": "ಅರೆ-ಫಲವತ್ತಾದ ಮಣ್ಣು", "mr": "अर्ध-सुपीक माती"},
    "Fertile Soil":       {"hi": "उपजाऊ मिट्टी",       "te": "సారవంతమైన నేల",       "ta": "வளமான மண்",         "kn": "ಫಲವತ್ತಾದ ಮಣ್ಣು",    "mr": "सुपीक माती"},
}

# ============================================
# WEATHER/RISK TERMS
# ============================================
WEATHER_TERMS = {
    "Flood Risk":         {"hi": "बाढ़ का खतरा",       "te": "వరద ప్రమాదం",       "ta": "வெள்ள அபாயம்",     "kn": "ಪ್ರವಾಹ ಅಪಾಯ",     "mr": "पुराचा धोका"},
    "Drought Risk":       {"hi": "सूखे का खतरा",       "te": "కరువు ప్రమాదం",      "ta": "வறட்சி அபாயம்",    "kn": "ಬರ ಅಪಾಯ",          "mr": "दुष्काळाचा धोका"},
    "Normal Conditions":  {"hi": "सामान्य स्थिति",      "te": "సాధారణ పరిస్థితులు",  "ta": "இயல்பான நிலை",      "kn": "ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿ",  "mr": "सामान्य स्थिती"},
    "Optimal":            {"hi": "अनुकूल",             "te": "అనుకూలం",            "ta": "உகந்தது",           "kn": "ಅನುಕೂಲ",           "mr": "अनुकूल"},
}

# ============================================
# SEASON NAMES
# ============================================
SEASON_NAMES = {
    "Kharif":  {"hi": "खरीफ (बारिश की फसल)",  "te": "ఖరీఫ్ (వర్షాకాలపు పంట)",  "ta": "காரிஃப் (மழைக்கால பயிர்)", "kn": "ಖಾರಿಫ್ (ಮಳೆಗಾಲದ ಬೆಳೆ)",   "mr": "खरीप (पावसाळी पीक)"},
    "Rabi":    {"hi": "रबी (सर्दी की फसल)",    "te": "రబీ (శీతాకాల పంట)",       "ta": "ரபி (குளிர்கால பயிர்)",   "kn": "ರಬಿ (ಚಳಿಗಾಲದ ಬೆಳೆ)",     "mr": "रब्बी (हिवाळी पीक)"},
    "Zaid":    {"hi": "जायद (गर्मी की फसल)",   "te": "జైద్ (వేసవి పంట)",        "ta": "ஜாய்த் (கோடைகால பயிர்)", "kn": "ಝೈದ್ (ಬೇಸಿಗೆ ಬೆಳೆ)",     "mr": "झायद (उन्हाळी पीक)"},
}

# ============================================
# SOIL TYPE NAMES
# ============================================
SOIL_TYPES = {
    "Loamy":      {"hi": "दोमट मिट्टी",   "te": "గట్టి నేల",      "ta": "களிமண் கலந்த மண்", "kn": "ಮಿಶ್ರ ಮಣ್ಣು",    "mr": "चिकण माती"},
    "Sandy":      {"hi": "बालू मिट्टी",   "te": "ఇసుక నేల",      "ta": "மண் நிலம்",       "kn": "ಮರಳು ಮಣ್ಣು",    "mr": "वालुकामय माती"},
    "Clay":       {"hi": "चिकनी मिट्टी",  "te": "బంక మట్టి",     "ta": "களிமண்",          "kn": "ಜೇಡಿಮಣ್ಣು",     "mr": "काळी चिकणमाती"},
    "Black":      {"hi": "काली मिट्टी",   "te": "నల్ల రేగడి",    "ta": "கருப்பு மண்",     "kn": "ಕಪ್ಪು ಮಣ್ಣು",    "mr": "काळी माती"},
    "Red":        {"hi": "लाल मिट्टी",    "te": "ఎర్ర నేల",      "ta": "சிவப்பு மண்",     "kn": "ಕೆಂಪು ಮಣ್ಣು",    "mr": "तांबडी माती"},
    "Laterite":   {"hi": "लेटराइट मिट्टी", "te": "లాటరైట్ నేల",   "ta": "லேட்டரைட் மண்",   "kn": "ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು", "mr": "जांभी माती"},
    "Alluvial":   {"hi": "जलोढ़ मिट्टी",  "te": "ఒండ్రు నేల",    "ta": "வண்டல் மண்",      "kn": "ಮೆಕ್ಕಲು ಮಣ್ಣು",   "mr": "गाळाची माती"},
}

# ============================================
# YIELD QUALITY TERMS
# ============================================
YIELD_QUALITY = {
    "Excellent": {"hi": "उत्कृष्ट",    "te": "అద్భుతం",     "ta": "சிறப்பு",     "kn": "ಅತ್ಯುತ್ತಮ",    "mr": "उत्कृष्ट"},
    "Good":      {"hi": "अच्छा",       "te": "మంచిది",      "ta": "நல்லது",      "kn": "ಉತ್ತಮ",       "mr": "चांगले"},
    "Fair":      {"hi": "ठीक",         "te": "సగటు",        "ta": "சராசரி",      "kn": "ಸಾಧಾರಣ",      "mr": "बरे"},
}

# ============================================
# COMMON AGRICULTURAL PHRASES
# ============================================
AG_PHRASES = {
    "Urgent treatment needed":  {"hi": "तुरंत उपचार आवश्यक",   "te": "తక్షణ చికిత్స అవసరం",   "ta": "உடனடி சிகிச்சை தேவை",    "kn": "ತುರ್ತು ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ",   "mr": "तातडीने उपचार आवश्यक"},
    "tons":                     {"hi": "टन",                   "te": "టన్నులు",               "ta": "டன்",                   "kn": "ಟನ್",                   "mr": "टन"},
    "kg/hectare":               {"hi": "किलो/हेक्टेयर",         "te": "కిలో/హెక్టారు",          "ta": "கிலோ/ஹெக்டேர்",          "kn": "ಕೆಜಿ/ಹೆಕ್ಟೇರ್",          "mr": "किलो/हेक्टर"},
    "tons/hectare":             {"hi": "टन/हेक्टेयर",          "te": "టన్నులు/హెక్టారు",       "ta": "டன்/ஹெக்டேர்",           "kn": "ಟನ್/ಹೆಕ್ಟೇರ್",           "mr": "टन/हेक्टर"},
}


# ============================================
# UNIFIED LOOKUP FUNCTION
# ============================================
def get_regional_term(term: str, language: str, category: str = "auto") -> str:
    """
    Get the regional/local name for an agricultural term.
    
    Args:
        term: English term to translate (e.g., 'rice', 'Urea', 'Fertile Soil')
        language: Target language code (e.g., 'hi', 'te', 'ta', 'kn', 'mr')
        category: Which dictionary to look in. 'auto' tries all categories.
                  Options: 'crop', 'fertilizer', 'soil_status', 'weather',
                           'season', 'soil_type', 'yield_quality', 'phrase', 'auto'
    
    Returns:
        Regional term if found, otherwise the original English term.
    """
    if language == "en" or not language:
        return term
    
    # Normalize the term for lookup
    term_lower = term.strip().lower()
    term_original = term.strip()
    
    CATEGORY_MAP = {
        "crop":          CROP_NAMES,
        "fertilizer":    FERTILIZER_NAMES,
        "soil_status":   SOIL_STATUS,
        "weather":       WEATHER_TERMS,
        "season":        SEASON_NAMES,
        "soil_type":     SOIL_TYPES,
        "yield_quality": YIELD_QUALITY,
        "phrase":        AG_PHRASES,
    }
    
    if category != "auto":
        dictionary = CATEGORY_MAP.get(category, {})
        # Try exact match first, then case-insensitive
        entry = dictionary.get(term_original) or dictionary.get(term_lower)
        if entry and language in entry:
            return entry[language]
        return term
    
    # Auto mode: search all categories
    for dict_name, dictionary in CATEGORY_MAP.items():
        # Try exact match
        if term_original in dictionary:
            entry = dictionary[term_original]
            if language in entry:
                return entry[language]
        # Try case-insensitive match
        if term_lower in dictionary:
            entry = dictionary[term_lower]
            if language in entry:
                return entry[language]
    
    return term


def translate_agricultural_text(text: str, language: str) -> str:
    """
    Scan a text string and replace known agricultural terms with their
    regional equivalents. This is used as a pre-processing step BEFORE
    sending to Google Translate, so that crop/fertilizer names are correct.
    
    For short labels (single terms), use get_regional_term() directly.
    For longer text containing multiple terms, use this function.
    
    Args:
        text: English text that may contain agricultural terms
        language: Target language code
    
    Returns:
        Text with known agricultural terms replaced by regional names
    """
    if language == "en" or not language or not text:
        return text
    
    result = text
    
    # Replace crop names (case-insensitive, whole word)
    import re
    for eng_name, translations in CROP_NAMES.items():
        if language in translations:
            # Match whole word, case-insensitive
            pattern = re.compile(r'\b' + re.escape(eng_name) + r'\b', re.IGNORECASE)
            result = pattern.sub(translations[language], result)
    
    # Replace fertilizer names
    for eng_name, translations in FERTILIZER_NAMES.items():
        if language in translations and eng_name in result:
            result = result.replace(eng_name, translations[language])
    
    # Replace soil status terms
    for eng_name, translations in SOIL_STATUS.items():
        if language in translations and eng_name in result:
            result = result.replace(eng_name, translations[language])
    
    # Replace weather terms
    for eng_name, translations in WEATHER_TERMS.items():
        if language in translations and eng_name in result:
            result = result.replace(eng_name, translations[language])
    
    # Replace quality terms
    for eng_name, translations in YIELD_QUALITY.items():
        if language in translations:
            pattern = re.compile(r'\b' + re.escape(eng_name) + r'\b', re.IGNORECASE)
            result = pattern.sub(translations[language], result)
    
    # Replace common phrases
    for eng_name, translations in AG_PHRASES.items():
        if language in translations and eng_name in result:
            result = result.replace(eng_name, translations[language])
    
    return result
