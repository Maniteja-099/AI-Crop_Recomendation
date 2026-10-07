// Standalone Chatbot Page - Always Available
// Full-screen AI Assistant for Farmers — supports ALL languages

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  IconButton,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { sendChatMessage } from '../api/client';
import { getTranslation } from '../i18n/translations';
import { useGlobalSettings } from '../context/GlobalSettingsContext';

// Comprehensive BCP-47 locale map for Speech Recognition & TTS
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

// All language options for the dropdown
const LANGUAGE_OPTIONS = [
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
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'zh-CN', label: '🇨🇳 中文(简)' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'th', label: '🇹🇭 ไทย' },
  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
  { code: 'id', label: '🇮🇩 Bahasa Indonesia' },
  { code: 'tr', label: '🇹🇷 Türkçe' },
  { code: 'sw', label: '🇰🇪 Kiswahili' },
  { code: 'af', label: '🇿🇦 Afrikaans' },
];

// Subtitle text for all languages
const SUBTITLE_MAP = {
  en: 'Context-Aware • Voice-Enabled',
  hi: 'संदर्भ-जागरूक • आवाज़-सक्षम',
  te: 'సందర్భ-అవగాహన • వాయిస్-ఎనేబుల్డ్',
  ta: 'சூழல்-விழிப்புணர்வு • குரல்-இயக்கப்பட்டது',
  kn: 'ಸಂದರ್ಭ-ಜಾಗೃತ • ಧ್ವನಿ-ಸಕ್ರಿಯ',
  mr: 'संदर्भ-जागरूक • आवाज-सक्षम',
  fr: 'Contextuel • Vocal',
  de: 'Kontextbewusst • Sprachaktiviert',
  es: 'Contextual • Voz habilitada',
  ar: 'مدرك للسياق • صوت مفعّل',
  ja: 'コンテキスト対応 • 音声対応',
  ko: '상황 인식 • 음성 지원',
  ru: 'Контекстный • Голосовой',
  pt: 'Contextual • Voz ativada',
};

// Strip emojis for clean TTS
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

const ChatbotPage = () => {
  const { language: globalLanguage } = useGlobalSettings();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(globalLanguage || 'en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voiceEnabled');
    return saved === null ? true : saved === 'true';
  });

  // Sync language with global settings
  useEffect(() => {
    if (globalLanguage) {
      setLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize greeting message
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

  // Text-to-Speech Setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Voice Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      // Use comprehensive BCP-47 locale map
      recognitionRef.current.lang = SPEECH_LANG_MAP[language] || language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
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

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) { /* ignore */ }
      }
    };
  }, [language]);

  const speakText = (text) => {
    if (!synthRef.current || !voiceEnabled) return;

    synthRef.current.cancel();

    // Strip emojis for clean TTS
    const cleanText = stripEmojis(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Use comprehensive BCP-47 locale map
    utterance.lang = SPEECH_LANG_MAP[language] || language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceError(getTranslation(language, 'voiceNotSupported'));
      return;
    }

    // Clear previous error when user retries
    setVoiceError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
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
      const result = await sendChatMessage(inputMessage, language, null);

      if (result.success && result.data) {
        const assistantResponse = result.data.reply || getTranslation(language, 'error');
        const ttsResponse = result.data.tts_message || assistantResponse;

        const assistantMessage = {
          role: 'assistant',
          content: assistantResponse,
          tts_content: ttsResponse,
          intent: result.data.intent || 'general',
          confidence: result.data.confidence || 0.85,
          quick_actions: result.data.quick_actions || [],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (voiceEnabled) {
          setTimeout(() => speakText(ttsResponse), 500);
        }
      } else {
        // Handle error
        const errorMessage = result.data?.reply || result.error || getTranslation(language, 'errorBackend');
        const errorMsg = {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMsg = {
        role: 'assistant',
        content: getTranslation(language, 'errorBackend'),
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ChatIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
        <Box>
          <Typography variant="h4" fontWeight={600}>
            🤖 {getTranslation(language, 'farmAssistant')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getTranslation(language, 'cropSubtitle')}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ height: 'calc(100vh - 250px)', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{
          p: 2,
          backgroundColor: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#2e7d32' }}>
              <SmartToyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>{getTranslation(language, 'farmAssistant')}</Typography>
              <Typography variant="caption">
                {SUBTITLE_MAP[language] || SUBTITLE_MAP['en']}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => {
                const newState = !voiceEnabled;
                setVoiceEnabled(newState);
                localStorage.setItem('voiceEnabled', newState);
                if (isSpeaking) stopSpeaking();
              }}
              sx={{ color: 'white' }}
              title={voiceEnabled ? getTranslation(language, 'disableVoiceBtn') : getTranslation(language, 'enableVoiceBtn')}
            >
              {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem('appLanguage', e.target.value);
                if (isSpeaking) stopSpeaking();
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                maxWidth: '140px'
              }}
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 3,
          backgroundColor: '#f5f5f5'
        }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  backgroundColor: msg.role === 'user' ? '#2e7d32' : 'white',
                  color: msg.role === 'user' ? 'white' : 'black',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: msg.role === 'user' ? '#1b5e20' : '#e8f5e9'
                    }}
                  >
                    {msg.role === 'user' ?
                      <PersonIcon sx={{ fontSize: 16, color: 'white' }} /> :
                      <SmartToyIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
                    }
                  </Avatar>
                  <Typography variant="caption" fontWeight={600}>
                    {msg.role === 'user' ? getTranslation(language, 'farmerProfile') : getTranslation(language, 'farmAssistant')}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </Typography>
                {msg.intent && (
                  <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                    {getTranslation(language, 'intentLabel')}: {msg.intent} • {msg.confidence}%
                  </Typography>
                )}
                <Typography variant="caption" sx={{ opacity: 0.6, mt: 1, display: 'block' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {msg.role === 'assistant' && voiceEnabled && (
                  <IconButton
                    size="small"
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.tts_content || msg.content)}
                    sx={{ mt: 1 }}
                  >
                    {isSpeaking ? '⏸️' : '🔊'}
                  </IconButton>
                )}
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: '#2e7d32', borderRadius: '50%', animation: 'bounce 0.6s infinite' }} />
                  <Box sx={{ width: 8, height: 8, bgcolor: '#2e7d32', borderRadius: '50%', animation: 'bounce 0.6s infinite 0.2s' }} />
                  <Box sx={{ width: 8, height: 8, bgcolor: '#2e7d32', borderRadius: '50%', animation: 'bounce 0.6s infinite 0.4s' }} />
                </Box>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {getTranslation(language, 'quickQuestionsLabel')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {quickQuestions.slice(0, 5).map((q, idx) => (
                <Chip
                  key={idx}
                  label={q}
                  onClick={() => setInputMessage(q)}
                  sx={{
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '2px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isListening
                  ? `🎤 ${getTranslation(language, 'listening')}`
                  : getTranslation(language, 'typeMessage')
              }
              disabled={isListening}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2e7d32',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2e7d32',
                  },
                }
              }}
            />
            <IconButton
              onClick={toggleVoiceInput}
              color={isListening ? 'error' : 'primary'}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: isListening ? '#ffebee' : '#e8f5e9',
                '&:hover': { backgroundColor: isListening ? '#ffcdd2' : '#c8e6c9' }
              }}
            >
              {isListening ? '🔴' : <MicIcon />}
            </IconButton>
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: '#2e7d32',
                color: 'white',
                '&:hover': { backgroundColor: '#1b5e20' },
                '&:disabled': { backgroundColor: '#e0e0e0' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>

          {voiceError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>⚠️</span>
              {voiceError}
              <span
                onClick={() => setVoiceError(null)}
                style={{ cursor: 'pointer', marginLeft: 4, fontWeight: 'bold', color: '#d32f2f' }}
              >
                ✕
              </span>
            </Typography>
          )}

          {isListening && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{
                width: 8,
                height: 8,
                backgroundColor: '#d32f2f',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              {getTranslation(language, 'recording')}
            </Typography>
          )}

          {isSpeaking && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{
                width: 8,
                height: 8,
                backgroundColor: '#2e7d32',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              {getTranslation(language, 'speaking')}
            </Typography>
          )}
        </Box>
      </Card>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default ChatbotPage;
