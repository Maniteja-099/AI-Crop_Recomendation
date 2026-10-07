// Advanced AI Chatbot Component
// Voice-enabled, bilingual, context-aware agricultural assistant

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  Zoom,
  Chip,
  Avatar,
  Divider,
  Collapse,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Comprehensive BCP-47 locale map for Speech Recognition & TTS
const SPEECH_LANG_MAP = {
  'en': 'en-IN', 'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN',
  'kn': 'kn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'pa': 'pa-IN',
  'bn': 'bn-IN', 'ml': 'ml-IN', 'or': 'or-IN', 'as': 'as-IN',
  'ur': 'ur-PK', 'sd': 'sd-PK', 'ne': 'ne-NP', 'si': 'si-LK',
  'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES', 'pt': 'pt-BR',
  'it': 'it-IT', 'nl': 'nl-NL', 'pl': 'pl-PL', 'ro': 'ro-RO',
  'uk': 'uk-UA', 'ru': 'ru-RU', 'cs': 'cs-CZ', 'sv': 'sv-SE',
  'da': 'da-DK', 'fi': 'fi-FI', 'no': 'nb-NO', 'el': 'el-GR',
  'hu': 'hu-HU', 'bg': 'bg-BG', 'hr': 'hr-HR', 'sk': 'sk-SK',
  'sl': 'sl-SI', 'lt': 'lt-LT', 'lv': 'lv-LV', 'et': 'et-EE',
  'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', 'ja': 'ja-JP', 'ko': 'ko-KR',
  'th': 'th-TH', 'vi': 'vi-VN', 'id': 'id-ID', 'ms': 'ms-MY',
  'fil': 'fil-PH', 'my': 'my-MM', 'km': 'km-KH', 'lo': 'lo-LA',
  'ar': 'ar-SA', 'fa': 'fa-IR', 'he': 'he-IL', 'tr': 'tr-TR',
  'sw': 'sw-KE', 'am': 'am-ET', 'ha': 'ha-NG', 'yo': 'yo-NG',
  'zu': 'zu-ZA', 'af': 'af-ZA',
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

// Quick questions by language (falls back to English)
const quickQuestions = {
  en: [
    { text: 'What crop should I grow?', icon: '🌾' },
    { text: 'How is my soil health?', icon: '🧪' },
    { text: 'Weather risk today?', icon: '☁️' },
    { text: 'Fertilizer advice', icon: '💧' },
    { text: 'Improve my yield', icon: '📈' },
  ],
  hi: [
    { text: 'कौन सी फसल उगाऊं?', icon: '🌾' },
    { text: 'मिट्टी कैसी है?', icon: '🧪' },
    { text: 'मौसम का जोखिम?', icon: '☁️' },
    { text: 'उर्वरक सलाह', icon: '💧' },
    { text: 'उपज कैसे बढ़ाएं?', icon: '📈' },
  ],
  te: [
    { text: 'ఏ పంట పండించాలి?', icon: '🌾' },
    { text: 'నా మట్టి ఎలా ఉంది?', icon: '🧪' },
    { text: 'వాతావరణ ప్రమాదం?', icon: '☁️' },
    { text: 'ఎరువు సలహా', icon: '💧' },
    { text: 'దిగుబడి పెంచడం', icon: '📈' },
  ],
};

// Greetings by language (falls back to English)
const greetings = {
  en: "Namaste! I'm your AI farming assistant. How can I help you today?",
  hi: "नमस्ते! मैं आपका AI कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
  te: "నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
  ta: "வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
  mr: "नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
  fr: "Bonjour! Je suis votre assistant agricole IA. Comment puis-je vous aider?",
  de: "Hallo! Ich bin Ihr KI-Landwirtschaftsassistent. Wie kann ich Ihnen helfen?",
  es: "¡Hola! Soy tu asistente agrícola de IA. ¿Cómo puedo ayudarte?",
  ar: "مرحباً! أنا مساعدك الزراعي بالذكاء الاصطناعي. كيف يمكنني مساعدتك؟",
  zh: "你好！我是您的AI农业助手。今天我能帮您什么？",
  ja: "こんにちは！私はAI農業アシスタントです。今日はどのようにお手伝いできますか？",
  ko: "안녕하세요! 저는 AI 농업 도우미입니다. 오늘 무엇을 도와드릴까요?",
  ru: "Здравствуйте! Я ваш AI-помощник в сельском хозяйстве. Чем могу помочь?",
  pt: "Olá! Sou seu assistente agrícola de IA. Como posso ajudar?",
  tr: "Merhaba! Ben AI tarım asistanınızım. Bugün size nasıl yardımcı olabilirim?",
};

const AdvancedChatbot = ({ contextData = {}, language = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: greetings[language] || greetings['en'],
      timestamp: new Date(),
    }]);
  }, [language]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.lang = SPEECH_LANG_MAP[language] || language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        // Auto-send voice message
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  // Text-to-Speech function
  const speak = useCallback((text) => {
    if (!synthRef.current || !voiceEnabled) return;

    synthRef.current.cancel();
    // Strip emojis before speaking
    const cleanText = stripEmojis(text);
    if (!cleanText) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = SPEECH_LANG_MAP[language] || language;
    utterance.rate = 0.9;
    synthRef.current.speak(utterance);
  }, [language, voiceEnabled]);

  // Handle sending message
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/chat`, {
        message: messageText,
        language: language,
        context_data: contextData,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        quickActions: response.data.quick_actions,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if voice enabled
      if (voiceEnabled) {
        speak(response.data.message);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: language === 'en'
          ? "Sorry, I couldn't process that. Please try again."
          : "क्षमा करें, मैं वह प्रोसेस नहीं कर सका। कृपया पुनः प्रयास करें।",
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(language === 'en'
        ? 'Voice input not supported in your browser'
        : 'आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const currentQuestions = quickQuestions[language] || quickQuestions.en;

  return (
    <>
      {/* Floating Chat Button */}
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 70,
            height: 70,
            boxShadow: '0 4px 20px rgba(46, 125, 50, 0.4)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.3s ease',
          }}
        >
          <ChatIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 400 },
            height: { xs: 'calc(100vh - 100px)', sm: 550 },
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              color: 'white',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SmartToyIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {greetings[language] ? {
                    en: 'Farm Assistant', hi: 'कृषि सहायक', te: 'వ్యవసాయ సహాయకుడు',
                    ta: 'வேளாண் உதவியாளர்', kn: 'ಕೃಷಿ ಸಹಾಯಕ', mr: 'शेती सहाय्यक',
                    fr: 'Assistant Agricole', de: 'Landwirtschaftsassistent', es: 'Asistente Agrícola',
                    ar: 'مساعد زراعي', zh: '农业助手', ja: '農業アシスタント',
                    ko: '䗃业 助手', ru: 'Агропомощник', pt: 'Assistente Agrícola',
                    tr: 'Tarım Asistanı',
                  }[language] || 'Farm Assistant' : 'Farm Assistant'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {{
                    en: 'AI-Powered Help', hi: 'AI संचालित सहायता',
                    te: 'AI సహాయం', ta: 'AI உதவி', kn: 'AI ಸಹಾಯ', mr: 'AI सहाय्य',
                    fr: 'Aide IA', de: 'KI-Hilfe', es: 'Ayuda IA', ar: 'مساعدة AI',
                    zh: 'AI智能帮助', ja: 'AIヘルプ', ko: 'AI 도움',
                    ru: 'Помощь AI', pt: 'Ajuda IA', tr: 'AI Yardımı',
                  }[language] || 'AI-Powered Help'}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                sx={{ color: 'white' }}
              >
                {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </IconButton>
              <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    maxWidth: '85%',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: msg.role === 'user' ? '#ff9800' : '#2e7d32',
                    }}
                  >
                    {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.role === 'user' ? '#e3f2fd' : 'white',
                      border: msg.isError ? '2px solid #f44336' : 'none',
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 36, height: 36, backgroundColor: '#2e7d32' }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper elevation={1} sx={{ padding: '12px 16px', borderRadius: '16px' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#2e7d32',
                          animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`,
                          '@keyframes bounce': {
                            '0%, 80%, 100%': { transform: 'scale(0.6)' },
                            '40%': { transform: 'scale(1)' },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Questions */}
          <Box sx={{ padding: '8px 16px', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {currentQuestions.map((q, index) => (
                <Chip
                  key={index}
                  label={`${q.icon} ${q.text}`}
                  onClick={() => handleQuickQuestion(q.text)}
                  sx={{
                    backgroundColor: '#e8f5e9',
                    '&:hover': { backgroundColor: '#c8e6c9' },
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Input Area */}
          <Box
            sx={{
              padding: '12px 16px',
              backgroundColor: 'white',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleVoiceInput}
              sx={{
                backgroundColor: isListening ? '#f44336' : '#e8f5e9',
                '&:hover': { backgroundColor: isListening ? '#d32f2f' : '#c8e6c9' },
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>

            <TextField
              fullWidth
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={{
                en: 'Type your question...', hi: 'अपना सवाल टाइप करें...',
                te: 'మీ ప్రశ్న టైప్ చేయండి...', ta: 'உங்கள் கேள்வியை தட்டச்சு செய்க...',
                kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ...', mr: 'तुमचा प्रश्न टाइप करा...',
                fr: 'Tapez votre question...', de: 'Ihre Frage eingeben...',
                es: 'Escriba su pregunta...', ar: '...اكتب سؤالك',
              }[language] || 'Type your question...'}
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
            />

            <IconButton
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                backgroundColor: '#2e7d32',
                color: 'white',
                '&:hover': { backgroundColor: '#1b5e20' },
                '&:disabled': { backgroundColor: '#ccc' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default AdvancedChatbot;
