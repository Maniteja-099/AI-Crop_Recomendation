// Voice-Enabled Multilingual Chatbot Widget with Text-to-Speech
// Context-Aware AI Assistant for Farmers — supports ALL languages

import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../api/client';
import { getTranslation } from '../i18n/translations';
import { useGlobalSettings } from '../context/GlobalSettingsContext';

// ──────────────────────────────────────────────────────────
// Comprehensive BCP-47 locale map for Speech Recognition & TTS
// ──────────────────────────────────────────────────────────
const SPEECH_LANG_MAP = {
  // Indian
  'en': 'en-IN', 'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN',
  'kn': 'kn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'pa': 'pa-IN',
  'bn': 'bn-IN', 'ml': 'ml-IN', 'or': 'or-IN', 'as': 'as-IN',
  'ur': 'ur-PK', 'sd': 'sd-PK', 'ne': 'ne-NP', 'si': 'si-LK',
  // European
  'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES', 'pt': 'pt-BR',
  'it': 'it-IT', 'nl': 'nl-NL', 'pl': 'pl-PL', 'ro': 'ro-RO',
  'uk': 'uk-UA', 'ru': 'ru-RU', 'cs': 'cs-CZ', 'sv': 'sv-SE',
  'da': 'da-DK', 'fi': 'fi-FI', 'no': 'nb-NO', 'el': 'el-GR',
  'hu': 'hu-HU', 'bg': 'bg-BG', 'hr': 'hr-HR', 'sk': 'sk-SK',
  'sl': 'sl-SI', 'lt': 'lt-LT', 'lv': 'lv-LV', 'et': 'et-EE',
  // Asian
  'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', 'ja': 'ja-JP', 'ko': 'ko-KR',
  'th': 'th-TH', 'vi': 'vi-VN', 'id': 'id-ID', 'ms': 'ms-MY',
  'fil': 'fil-PH', 'my': 'my-MM', 'km': 'km-KH', 'lo': 'lo-LA',
  // Middle-Eastern / African
  'ar': 'ar-SA', 'fa': 'fa-IR', 'he': 'he-IL', 'tr': 'tr-TR',
  'sw': 'sw-KE', 'am': 'am-ET', 'ha': 'ha-NG', 'yo': 'yo-NG',
  'zu': 'zu-ZA', 'af': 'af-ZA',
};

// ──────────────────────────────────────────────────────────
// All language options for the dropdown (grouped by region)
// ──────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS = [
  // Indian Languages
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hi', label: '🇮🇳 हिंदी' },
  { code: 'te', label: '🇮🇳 తెలుగు' },
  { code: 'ta', label: '🇮🇳 தமிழ்' },
  { code: 'kn', label: '🇮🇳 ಕನ್ನಡ' },
  { code: 'mr', label: '🇮🇳 मराठी' },
  { code: 'gu', label: '🇮🇳 ગુજરાતી' },
  { code: 'pa', label: '🇮🇳 ਪੰਜਾਬੀ' },
  { code: 'bn', label: '🇮🇳 বাংলা' },
  { code: 'ml', label: '🇮🇳 മലയാളം' },
  { code: 'or', label: '🇮🇳 ଓଡ଼ିଆ' },
  { code: 'ur', label: '🇵🇰 اردو' },
  { code: 'ne', label: '🇳🇵 नेपाली' },
  // European
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'nl', label: '🇳🇱 Nederlands' },
  { code: 'pl', label: '🇵🇱 Polski' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'uk', label: '🇺🇦 Українська' },
  { code: 'ro', label: '🇷🇴 Română' },
  { code: 'cs', label: '🇨🇿 Čeština' },
  { code: 'sv', label: '🇸🇪 Svenska' },
  { code: 'da', label: '🇩🇰 Dansk' },
  { code: 'fi', label: '🇫🇮 Suomi' },
  { code: 'no', label: '🇳🇴 Norsk' },
  { code: 'el', label: '🇬🇷 Ελληνικά' },
  { code: 'hu', label: '🇭🇺 Magyar' },
  { code: 'bg', label: '🇧🇬 Български' },
  { code: 'hr', label: '🇭🇷 Hrvatski' },
  { code: 'sk', label: '🇸🇰 Slovenčina' },
  // Asian
  { code: 'zh-CN', label: '🇨🇳 中文(简)' },
  { code: 'zh-TW', label: '🇹🇼 中文(繁)' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'th', label: '🇹🇭 ไทย' },
  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
  { code: 'id', label: '🇮🇩 Bahasa Indonesia' },
  { code: 'ms', label: '🇲🇾 Bahasa Melayu' },
  { code: 'fil', label: '🇵🇭 Filipino' },
  // Middle-East / Africa
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'fa', label: '🇮🇷 فارسی' },
  { code: 'he', label: '🇮🇱 עברית' },
  { code: 'tr', label: '🇹🇷 Türkçe' },
  { code: 'sw', label: '🇰🇪 Kiswahili' },
  { code: 'af', label: '🇿🇦 Afrikaans' },
];

// ──────────────────────────────────────────────────────────
// Utility: strip emojis from text for clean TTS
// ──────────────────────────────────────────────────────────
const stripEmojis = (text) => {
  if (!text) return '';
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}\u{200D}\u{200B}\u{2B50}\u{2B05}-\u{2B07}\u{2934}-\u{2935}\u{3030}\u{25AA}-\u{25AB}\u{25FB}-\u{25FE}\u{25B6}\u{25C0}\u{2122}\u{2139}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{203C}\u{2049}\u{20E3}\u{00A9}\u{00AE}]/gu,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
};

// ──────────────────────────────────────────────────────────
// Localized UI strings (for status messages in any language)
// Falls back to English for languages without explicit mapping
// ──────────────────────────────────────────────────────────
const UI_STRINGS = {
  subtitle: {
    en: 'Context-Aware • Voice-Enabled',
    hi: 'संदर्भ-जागरूक • आवाज़-सक्षम',
    te: 'సందర్భ-అవగాహన • వాయిస్-ఎనేబుల్డ్',
    ta: 'சூழல்-விழிப்புணர்வு • குரல்-இயக்கப்பட்டது',
    kn: 'ಸಂದರ್ಭ-ಜಾಗೃತ • ಧ್ವನಿ-ಸಕ್ರಿಯ',
    mr: 'संदर्भ-जागरूक • आवाज-सक्षम',
    gu: 'સંદર્ભ-જાગૃત • અવાજ-સક્ષમ',
    pa: 'ਸੰਦਰਭ-ਜਾਗਰੂਕ • ਆਵਾਜ਼-ਸਮਰੱਥ',
    bn: 'প্রসঙ্গ-সচেতন • ভয়েস-সক্ষম',
    ml: 'സന്ദർഭ-ബോധമുള്ള • വോയ്‌സ്-പ്രാപ്തം',
    or: 'ସନ୍ଦର୍ଭ-ସଚେତନ • ସ୍ବର-ସକ୍ଷମ',
    ur: 'سیاق و سباق آگاہ • آواز فعال',
    ne: 'सन्दर्भ-सचेत • आवाज-सक्षम',
    fr: 'Contextuel • Vocal',
    de: 'Kontextbewusst • Sprachaktiviert',
    es: 'Contextual • Voz habilitada',
    ar: 'مدرك للسياق • صوت مفعّل',
    zh: '上下文感知 • 语音启用',
    ja: 'コンテキスト対応 • 音声対応',
    ko: '상황 인식 • 음성 지원',
    ru: 'Контекстный • Голосовой',
    pt: 'Contextual • Voz ativada',
    tr: 'Bağlam Farkında • Ses Etkin',
    th: 'ตระหนักบริบท • เปิดใช้งานเสียง',
    vi: 'Nhận biết ngữ cảnh • Hỗ trợ giọng nói',
    id: 'Sadar Konteks • Suara Diaktifkan',
  },
  listening: {
    en: '🎤 Listening...',
    hi: '🎤 सुन रहा हूं...',
    te: '🎤 వింటున్నాను...',
    ta: '🎤 கேட்கிறேன்...',
    kn: '🎤 ಕೇಳುತ್ತಿದೆ...',
    mr: '🎤 ऐकत आहे...',
    gu: '🎤 સાંભળી રહ્યું છે...',
    pa: '🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ...',
    bn: '🎤 শুনছি...',
    ml: '🎤 കേൾക്കുന്നു...',
    or: '🎤 ଶୁଣୁଛି...',
    ur: '🎤 سن رہا ہوں...',
    ne: '🎤 सुनिरहेको छ...',
    fr: '🎤 Écoute en cours...',
    de: '🎤 Höre zu...',
    es: '🎤 Escuchando...',
    pt: '🎤 Ouvindo...',
    ru: '🎤 Слушаю...',
    ar: '🎤 ...جارٍ الاستماع',
    ja: '🎤 聞いています...',
    ko: '🎤 듣고 있습니다...',
    tr: '🎤 Dinleniyor...',
    th: '🎤 กำลังฟัง...',
    vi: '🎤 Đang nghe...',
    id: '🎤 Mendengarkan...',
  },
  recording: {
    en: 'Recording... Speak clearly',
    hi: 'रिकॉर्डिंग... स्पष्ट बोलें',
    te: 'రికార్డింగ్... స్పష్టంగా మాట్లాడండి',
    ta: 'பதிவு செய்கிறது... தெளிவாக பேசுங்கள்',
    kn: 'ರೆಕಾರ್ಡಿಂಗ್... ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ',
    mr: 'रेकॉर्डिंग... स्पष्ट बोला',
    gu: 'રેકોર્ડિંગ... સ્પષ્ટ બોલો',
    pa: 'ਰਿਕਾਰਡਿੰਗ... ਸਪੱਸ਼ਟ ਬੋਲੋ',
    bn: 'রেকর্ডিং... স্পষ্ট বলুন',
    ml: 'റെക്കോർഡിംഗ്... വ്യക്തമായി സംസാരിക്കൂ',
    or: 'ରେକର୍ଡିଂ... ସ୍ପଷ୍ଟ କୁହନ୍ତୁ',
    ur: '...ریکارڈنگ صاف بولیں',
    ne: 'रेकर्डिङ... स्पष्ट बोल्नुहोस्',
    fr: 'Enregistrement... Parlez clairement',
    de: 'Aufnahme... Sprechen Sie deutlich',
    es: 'Grabando... Hable claramente',
    pt: 'Gravando... Fale claramente',
    ru: 'Запись... Говорите чётко',
    ar: '...جارٍ التسجيل تحدث بوضوح',
    ja: '録音中... はっきり話してください',
    ko: '녹음 중... 또렷하게 말씀하세요',
    tr: 'Kaydediliyor... Net konuşun',
    th: 'กำลังบันทึก... พูดให้ชัดเจน',
    vi: 'Đang ghi... Hãy nói rõ ràng',
    id: 'Merekam... Bicara dengan jelas',
  },
  speaking: {
    en: 'Speaking...',
    hi: 'बोल रहा हूं...',
    te: 'మాట్లాడుతున్నాను...',
    ta: 'பேசுகிறேன்...',
    kn: 'ಮಾತನಾಡುತ್ತಿದೆ...',
    mr: 'बोलत आहे...',
    gu: 'બોલી રહ્યું છે...',
    pa: 'ਬੋਲ ਰਿਹਾ ਹਾਂ...',
    bn: 'বলছি...',
    ml: 'സംസാരിക്കുന്നു...',
    or: 'କହୁଛି...',
    ur: '...بول رہا ہوں',
    ne: 'बोलिरहेको छ...',
    fr: 'En train de parler...',
    de: 'Spricht...',
    es: 'Hablando...',
    pt: 'Falando...',
    ru: 'Говорит...',
    ar: '...يتحدث',
    ja: '話しています...',
    ko: '말하고 있습니다...',
    tr: 'Konuşuyor...',
    th: 'กำลังพูด...',
    vi: 'Đang nói...',
    id: 'Berbicara...',
  },
};

const getUIString = (key, lang) => {
  const map = UI_STRINGS[key];
  if (!map) return '';
  return map[lang] || map['en'] || '';
};

const ChatWidget = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceError, setVoiceError] = useState(null);

  // Sync language with global settings
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useGlobalSettings();
  const [language, setLanguageLocal] = useState(globalLanguage || 'en');

  const setLanguage = (newLang) => {
    setLanguageLocal(newLang);
    // Also update global language for languages supported by GlobalSettingsContext
    if (['en', 'hi', 'te', 'ta', 'kn', 'mr'].includes(newLang)) {
      setGlobalLanguage(newLang);
    }
  };

  useEffect(() => {
    if (globalLanguage) {
      setLanguageLocal(globalLanguage);
    }
  }, [globalLanguage]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize greeting message when language changes
  useEffect(() => {
    const greeting = getTranslation(language, 'chatGreeting');
    setMessages([{
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    }]);
  }, [language]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-Speech Setup — load available voices
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      };

      // Some browsers load voices async
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      // Fallback: retry after short delay (Chrome sometimes needs this)
      const voiceTimer = setTimeout(loadVoices, 500);

      return () => {
        clearTimeout(voiceTimer);
        if (synthRef.current) {
          synthRef.current.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Helper: find the best matching voice for a given BCP-47 locale
  const findBestVoice = (targetLang) => {
    if (!availableVoices.length) return null;
    const bcp47 = SPEECH_LANG_MAP[targetLang] || targetLang;
    const langPrefix = bcp47.split('-')[0].toLowerCase();

    // 1. Exact BCP-47 match (e.g. "te-IN")
    let voice = availableVoices.find(v => v.lang.toLowerCase() === bcp47.toLowerCase());
    if (voice) return voice;

    // 2. Same language prefix (e.g. "te")
    voice = availableVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (voice) return voice;

    // 3. For Indian languages, try Google voices which are often available
    voice = availableVoices.find(v =>
      v.lang.toLowerCase().startsWith(langPrefix) && v.name.toLowerCase().includes('google')
    );
    if (voice) return voice;

    return null;
  };

  // Voice Recognition Setup (all languages)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Show partial results for better UX
      recognition.maxAlternatives = 1;

      // Use full BCP-47 locale from our map, fallback to code itself
      recognition.lang = SPEECH_LANG_MAP[language] || language;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        // Show interim results as user speaks, finalize on completion
        if (finalTranscript) {
          setInputMessage(prev => prev + finalTranscript);
        } else if (interimTranscript) {
          // Show what the user is saying in real-time
          setInputMessage(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'network') {
          setVoiceError(getTranslation(language, 'voiceNetworkError'));
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError(getTranslation(language, 'voiceMicDenied'));
        } else if (event.error === 'no-speech') {
          setVoiceError(getTranslation(language, 'voiceNoSpeech'));
        } else if (event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error);
          setVoiceError(getTranslation(language, 'voiceGenericError'));
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) { /* ignore */ }
      }
    };
  }, [language]);

  // Text-to-Speech function — uses best matching voice per language
  const speakText = (text) => {
    if (!synthRef.current || !voiceEnabled) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    // Clean emojis from text before speaking
    const cleanText = stripEmojis(text);
    if (!cleanText) return;

    // For long text, split into sentences for more natural TTS
    const sentences = cleanText.match(/[^.!?।]+[.!?।]*/g) || [cleanText];
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed) return;

      const utterance = new SpeechSynthesisUtterance(trimmed);

      // Set language to proper BCP-47 locale
      const bcp47 = SPEECH_LANG_MAP[language] || language;
      utterance.lang = bcp47;

      // Explicitly set voice for non-English languages
      const bestVoice = findBestVoice(language);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      if (index === 0) {
        utterance.onstart = () => setIsSpeaking(true);
      }
      if (index === sentences.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }

      synthRef.current.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      const msg = getTranslation(language, 'voiceNotSupported');
      setVoiceError(msg);
      return;
    }

    // Clear any previous voice error when user tries again
    setVoiceError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Clear previous input for fresh voice capture
      setInputMessage('');
      // Pre-check network connectivity
      if (!navigator.onLine) {
        setVoiceError(getTranslation(language, 'voiceOffline'));
        return;
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setVoiceError(getTranslation(language, 'voiceStartError'));
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call chatbot API with context
      const result = await sendChatMessage(inputMessage, language, contextData);

      const assistantResponse = result.success ? result.data.reply : `Error: ${result.error}`;
      const ttsResponse = result.success ? (result.data.tts_message || result.data.reply) : assistantResponse;

      const assistantMessage = {
        role: 'assistant',
        content: assistantResponse,
        tts_content: ttsResponse,
        intent: result.data?.intent,
        confidence: result.data?.confidence,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if voice is enabled
      if (voiceEnabled && result.success) {
        setTimeout(() => speakText(ttsResponse), 500);
      }
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = getTranslation(language, 'quickQuestions') || [
    'What crop should I grow?',
    'Is this yield good?',
    'Tell me about weather risk',
    'What fertilizer to use?',
    'How is my soil health?'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-2xl z-50"
          aria-label={getTranslation(language, 'openChat')}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-green-200">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">{getTranslation(language, 'farmAssistant')}</h3>
                <p className="text-xs opacity-90">
                  {getUIString('subtitle', language)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice Toggle */}
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (isSpeaking) stopSpeaking();
                }}
                className={`w-8 h-8 rounded-full transition flex items-center justify-center ${voiceEnabled ? 'bg-white/30' : 'bg-white/10'
                  }`}
                title={voiceEnabled ? getTranslation(language, 'disableVoiceBtn') : getTranslation(language, 'enableVoiceBtn')}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              {/* Language Selector — ALL languages */}
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (isSpeaking) stopSpeaking();
                }}
                className="px-2 py-1 bg-white/20 rounded text-xs font-semibold focus:outline-none max-w-[120px]"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (isSpeaking) stopSpeaking();
                }}
                className="w-8 h-8 hover:bg-white/20 rounded-full transition flex items-center justify-center text-xl"
                aria-label={getTranslation(language, 'closeChat')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-800 shadow-sm'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.intent && (
                    <p className="text-xs opacity-70 mt-1">
                      {getTranslation(language, 'intentLabel')}: {msg.intent} • {msg.confidence}%
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {msg.role === 'assistant' && voiceEnabled && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.tts_content || msg.content)}
                        className="text-lg hover:scale-110 transition"
                        title={isSpeaking ? getTranslation(language, 'speaking') : getTranslation(language, 'enableVoiceBtn')}
                      >
                        {isSpeaking ? '⏸️' : '🔊'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">{getTranslation(language, 'quickQuestionsLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(q)}
                    className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition border border-green-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t-2 border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening
                    ? getUIString('listening', language)
                    : getTranslation(language, 'typeMessage')
                }
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-sm"
                rows="2"
                disabled={isListening}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`w-12 h-12 rounded-xl transition flex items-center justify-center text-xl ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  title={getTranslation(language, 'voiceInput')}
                  aria-label={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl"
                  title={getTranslation(language, 'sendMessage')}
                  aria-label={getTranslation(language, 'sendMessage')}
                >
                  ➤
                </button>
              </div>
            </div>

            {/* Voice Status Indicator */}
            {voiceError && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-2">
                <span>⚠️</span>
                {voiceError}
                <button
                  onClick={() => setVoiceError(null)}
                  className="ml-1 text-red-400 hover:text-red-600 font-bold"
                  aria-label={getTranslation(language, 'dismiss')}
                >
                  ✕
                </button>
              </p>
            )}

            {isListening && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                {getUIString('recording', language)}
              </p>
            )}

            {isSpeaking && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                {getUIString('speaking', language)}
              </p>
            )}

            {!recognitionRef.current && (
              <p className="text-xs text-gray-500 mt-2">
                💡 {getTranslation(language, 'voiceNotSupported').substring(0, 50)}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
