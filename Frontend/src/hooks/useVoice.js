// useVoice Hook - Text-to-Speech and Speech Recognition
import { useState, useCallback, useEffect, useRef } from 'react';

export const useVoice = (language = 'en') => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('voiceEnabled') !== 'false';
  });
  const [voiceSpeed, setVoiceSpeed] = useState(() => {
    return parseFloat(localStorage.getItem('voiceSpeed')) || 0.9;
  });
  
  const synthRef = useRef(null);
  const recognitionRef = useRef(null);

  // Language mapping for voice
  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
  };

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
      recognitionRef.current.lang = langMap[language] || 'en-IN';
    }
  }, [language]);

  // Speak text
  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current || !voiceEnabled) return Promise.resolve();

    return new Promise((resolve) => {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langMap[language] || 'en-IN';
      utterance.rate = options.speed || voiceSpeed;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  }, [language, voiceEnabled, voiceSpeed]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return Promise.reject(new Error('Speech recognition not supported'));
    }

    return new Promise((resolve, reject) => {
      recognitionRef.current.lang = langMap[language] || 'en-IN';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        resolve(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        reject(new Error(event.error));
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      setIsListening(true);
      recognitionRef.current.start();
    });
  }, [language]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Toggle voice enabled
  const toggleVoice = useCallback(() => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('voiceEnabled', newValue.toString());
  }, [voiceEnabled]);

  // Update voice speed
  const updateVoiceSpeed = useCallback((speed) => {
    setVoiceSpeed(speed);
    localStorage.setItem('voiceSpeed', speed.toString());
  }, []);

  // Check if voice features are supported
  const isVoiceSupported = {
    synthesis: 'speechSynthesis' in window,
    recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  };

  return {
    // State
    isSpeaking,
    isListening,
    voiceEnabled,
    voiceSpeed,
    
    // Actions
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleVoice,
    updateVoiceSpeed,
    
    // Support info
    isVoiceSupported,
  };
};

export default useVoice;
