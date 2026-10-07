// Enhanced Settings Page - Full Feature Integration
// Comprehensive settings for the Agricultural Intelligence System

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Button,
  Alert,
  Divider,
  Paper,
  Chip,
  TextField,
  Snackbar,
  IconButton,
  Avatar,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CloudIcon from '@mui/icons-material/Cloud';
import MicIcon from '@mui/icons-material/Mic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import SyncIcon from '@mui/icons-material/Sync';
import HelpIcon from '@mui/icons-material/Help';

// Translations for the Settings Page
const translations = {
  en: {
    title: "Settings & Preferences",
    subtitle: "Customize your farming assistant",
    saved: "Settings saved successfully!",
    profile: "Farmer Profile",
    language: "Language & Communication",
    voice: "Voice & Audio",
    display: "Display & Appearance",
    notifications: "Notifications",
    accessibility: "Accessibility",
    location: "Location & Weather",
    farming: "Farming Preferences",
    data: "Data & Storage",
    save: "Save Settings",
    reset: "Reset to Default",
    name: "Your Name",
    phone: "Phone Number",
    state: "State",
    district: "District",
    farmSize: "Farm Size (Hectares)",
    primaryCrops: "Primary Crops",
    experience: "Farming Experience",
    enableVoice: "Enable Voice Features",
    autoRead: "Auto-read AI Responses",
    voiceSpeed: "Voice Speed",
    fontSize: "Font Size",
    theme: "Theme",
    highContrast: "High Contrast Mode",
    simpleUI: "Simplified UI",
    largeButtons: "Large Buttons",
    weatherAlerts: "Weather Alerts",
    cropReminders: "Crop Reminders",
    priceUpdates: "Market Price Updates",
    getLocation: "Get My Location",
    manualLocation: "Enter Manually",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
    small: "Small",
    medium: "Medium",
    large: "Large",
    xlarge: "Extra Large",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    clearData: "Clear Saved Data",
    exportData: "Export My Data",
    importData: "Import Data",
  },
  hi: {
    title: "सेटिंग्स और प्राथमिकताएं",
    subtitle: "अपने कृषि सहायक को अनुकूलित करें",
    saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    profile: "किसान प्रोफ़ाइल",
    language: "भाषा और संचार",
    voice: "आवाज और ऑडियो",
    display: "प्रदर्शन और उपस्थिति",
    notifications: "सूचनाएं",
    accessibility: "सुलभता",
    location: "स्थान और मौसम",
    farming: "कृषि प्राथमिकताएं",
    data: "डेटा और स्टोरेज",
    save: "सेटिंग्स सहेजें",
    reset: "डिफ़ॉल्ट पर रीसेट करें",
    name: "आपका नाम",
    phone: "फोन नंबर",
    state: "राज्य",
    district: "जिला",
    farmSize: "खेत का आकार (हेक्टेयर)",
    primaryCrops: "मुख्य फसलें",
    experience: "खेती का अनुभव",
    enableVoice: "आवाज सुविधाएं सक्षम करें",
    autoRead: "AI प्रतिक्रिया स्वतः पढ़ें",
    voiceSpeed: "आवाज की गति",
    fontSize: "फ़ॉन्ट का आकार",
    theme: "थीम",
    highContrast: "उच्च विपरीत मोड",
    simpleUI: "सरल UI",
    largeButtons: "बड़े बटन",
    weatherAlerts: "मौसम अलर्ट",
    cropReminders: "फसल अनुस्मारक",
    priceUpdates: "बाजार मूल्य अपडेट",
    getLocation: "मेरा स्थान प्राप्त करें",
    manualLocation: "मैन्युअल रूप से दर्ज करें",
    beginner: "शुरुआती",
    intermediate: "मध्यवर्ती",
    expert: "विशेषज्ञ",
    small: "छोटा",
    medium: "मध्यम",
    large: "बड़ा",
    xlarge: "अतिरिक्त बड़ा",
    light: "हल्का",
    dark: "गहरा",
    auto: "स्वचालित",
    clearData: "सहेजा डेटा साफ़ करें",
    exportData: "मेरा डेटा निर्यात करें",
    importData: "डेटा आयात करें",
  },
  te: {
    title: "సెట్టింగ్‌లు & ప్రాధాన్యతలు",
    subtitle: "మీ వ్యవసాయ సహాయకుడిని అనుకూలీకరించండి",
    saved: "సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి!",
    profile: "రైతు ప్రొఫైల్",
    language: "భాష & కమ్యూనికేషన్",
    voice: "వాయిస్ & ఆడియో",
    display: "ప్రదర్శన & అపియరెన్స్",
    notifications: "నోటిఫికేషన్‌లు",
    accessibility: "యాక్సెసిబిలిటీ",
    location: "లొకేషన్ & వాతావరణం",
    farming: "వ్యవసాయ ప్రాధాన్యతలు",
    data: "డేటా & స్టోరేజ్",
    save: "సెట్టింగ్‌లు సేవ్ చేయండి",
    reset: "డిఫాల్ట్‌కు రీసెట్ చేయండి",
    name: "మీ పేరు",
    phone: "ఫోన్ నంబర్",
    state: "రాష్ట్రం",
    district: "జిల్లా",
    farmSize: "పొలం పరిమాణం (హెక్టార్లు)",
    primaryCrops: "ప్రధాన పంటలు",
    experience: "వ్యవసాయ అనుభవం",
    enableVoice: "వాయిస్ ఫీచర్లు ఎనేబుల్ చేయండి",
    autoRead: "AI ప్రతిస్పందనలను ఆటో-రీడ్ చేయండి",
    voiceSpeed: "వాయిస్ వేగం",
    fontSize: "ఫాంట్ సైజ్",
    theme: "థీమ్",
    highContrast: "హై కాంట్రాస్ట్ మోడ్",
    simpleUI: "సింప్లిఫైడ్ UI",
    largeButtons: "పెద్ద బటన్‌లు",
    weatherAlerts: "వాతావరణ హెచ్చరికలు",
    cropReminders: "పంట రిమైండర్లు",
    priceUpdates: "మార్కెట్ ధర అప్‌డేట్‌లు",
    getLocation: "నా లొకేషన్ పొందండి",
    manualLocation: "మాన్యువల్‌గా నమోదు చేయండి",
    beginner: "బిగినర్",
    intermediate: "ఇంటర్మీడియేట్",
    expert: "నిపుణుడు",
    small: "చిన్న",
    medium: "మధ్యస్థ",
    large: "పెద్ద",
    xlarge: "అతి పెద్ద",
    light: "లైట్",
    dark: "డార్క్",
    auto: "ఆటో",
    clearData: "సేవ్ చేసిన డేటాను క్లియర్ చేయండి",
    exportData: "నా డేటాను ఎక్స్‌పోర్ట్ చేయండి",
    importData: "డేటాను ఇంపోర్ట్ చేయండి",
  },
  ta: {
    title: "அமைப்புகள் & விருப்பங்கள்",
    subtitle: "உங்கள் விவசாய உதவியாளரை தனிப்பயனாக்குங்கள்",
    saved: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",
    profile: "விவசாயி சுயவிவரம்",
    language: "மொழி & தொடர்பு",
    voice: "குரல் & ஆடியோ",
    display: "காட்சி & தோற்றம்",
    notifications: "அறிவிப்புகள்",
    accessibility: "அணுகல்தன்மை",
    location: "இடம் & வானிலை",
    farming: "விவசாய விருப்பங்கள்",
    data: "தரவு & சேமிப்பு",
    save: "அமைப்புகளை சேமி",
    reset: "இயல்புநிலைக்கு மீட்டமை",
    name: "உங்கள் பெயர்",
    phone: "தொலைபேசி எண்",
    state: "மாநிலம்",
    district: "மாவட்டம்",
    farmSize: "பண்ணை அளவு (ஹெக்டேர்)",
    primaryCrops: "முதன்மை பயிர்கள்",
    experience: "விவசாய அனுபவம்",
    enableVoice: "குரல் அம்சங்களை இயக்கு",
    autoRead: "AI பதில்களை தானாகப் படி",
    voiceSpeed: "குரல் வேகம்",
    fontSize: "எழுத்துரு அளவு",
    theme: "தீம்",
    highContrast: "உயர் கான்ட்ராஸ்ட் பயன்முறை",
    simpleUI: "எளிய UI",
    largeButtons: "பெரிய பொத்தான்கள்",
    weatherAlerts: "வானிலை எச்சரிக்கைகள்",
    cropReminders: "பயிர் நினைவூட்டல்கள்",
    priceUpdates: "சந்தை விலை புதுப்பிப்புகள்",
    getLocation: "என் இருப்பிடத்தைப் பெறு",
    manualLocation: "கைமுறையாக உள்ளிடவும்",
    beginner: "தொடக்கநிலை",
    intermediate: "இடைநிலை",
    expert: "நிபுணர்",
    small: "சிறிய",
    medium: "நடுத்தர",
    large: "பெரிய",
    xlarge: "மிகப்பெரிய",
    light: "ஒளி",
    dark: "இருள்",
    auto: "தானியங்கு",
    clearData: "சேமித்த தரவை அழி",
    exportData: "என் தரவை ஏற்றுமதி செய்",
    importData: "தரவை இறக்குமதி செய்",
  },
  kn: {
    title: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಪ್ರಾಶಸ್ತ್ಯಗಳು",
    subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    saved: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    profile: "ರೈತ ಪ್ರೊಫೈಲ್",
    language: "ಭಾಷೆ & ಸಂವಹನ",
    voice: "ಧ್ವನಿ & ಆಡಿಯೋ",
    display: "ಪ್ರದರ್ಶನ & ಗೋಚರತೆ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    accessibility: "ಪ್ರವೇಶಸಾಧ್ಯತೆ",
    location: "ಸ್ಥಳ & ಹವಾಮಾನ",
    farming: "ಕೃಷಿ ಪ್ರಾಶಸ್ತ್ಯಗಳು",
    data: "ಡೇಟಾ & ಸಂಗ್ರಹ",
    save: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ",
    reset: "ಡೀಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಿ",
    name: "ನಿಮ್ಮ ಹೆಸರು",
    phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
    state: "ರಾಜ್ಯ",
    district: "ಜಿಲ್ಲೆ",
    farmSize: "ಕೃಷಿ ಭೂಮಿ ಗಾತ್ರ (ಹೆಕ್ಟೇರ್)",
    primaryCrops: "ಪ್ರಾಥಮಿಕ ಬೆಳೆಗಳು",
    experience: "ಕೃಷಿ ಅನುಭವ",
    enableVoice: "ಧ್ವನಿ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    autoRead: "AI ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಸ್ವಯಂ-ಓದಿ",
    voiceSpeed: "ಧ್ವನಿ ವೇಗ",
    fontSize: "ಫಾಂಟ್ ಗಾತ್ರ",
    theme: "ಥೀಮ್",
    highContrast: "ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್",
    simpleUI: "ಸರಳ UI",
    largeButtons: "ದೊಡ್ಡ ಬಟನ್‌ಗಳು",
    weatherAlerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    cropReminders: "ಬೆಳೆ ಜ್ಞಾಪನೆಗಳು",
    priceUpdates: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಅಪ್‌ಡೇಟ್‌ಗಳು",
    getLocation: "ನನ್ನ ಸ್ಥಳವನ್ನು ಪಡೆಯಿರಿ",
    manualLocation: "ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ",
    beginner: "ಆರಂಭಿಕ",
    intermediate: "ಮಧ್ಯಮ",
    expert: "ತಜ್ಞ",
    small: "ಸಣ್ಣ",
    medium: "ಮಧ್ಯಮ",
    large: "ದೊಡ್ಡ",
    xlarge: "ಅತಿ ದೊಡ್ಡ",
    light: "ಬೆಳಕು",
    dark: "ಕತ್ತಲೆ",
    auto: "ಸ್ವಯಂ",
    clearData: "ಉಳಿಸಿದ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸಿ",
    exportData: "ನನ್ನ ಡೇಟಾವನ್ನು ರಫ್ತು ಮಾಡಿ",
    importData: "ಡೇಟಾವನ್ನು ಆಮದು ಮಾಡಿ",
  }
};

// List of Indian States
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Common crops in India
const commonCrops = [
  "Rice", "Wheat", "Maize", "Millets", "Sugarcane", "Cotton", "Groundnut",
  "Soybean", "Potato", "Tomato", "Onion", "Pulses", "Mustard", "Sunflower",
  "Banana", "Mango", "Vegetables", "Tea", "Coffee", "Coconut"
];

const EnhancedSettingsPage = () => {
  // Current language
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('appLanguage') || 'en');
  const t = translations[currentLang] || translations.en;
  
  // Active Tab
  const [activeTab, setActiveTab] = useState(0);
  
  // All Settings State
  const [settings, setSettings] = useState({
    // Profile
    name: localStorage.getItem('farmerName') || '',
    phone: localStorage.getItem('farmerPhone') || '',
    state: localStorage.getItem('farmerState') || 'Karnataka',
    district: localStorage.getItem('farmerDistrict') || '',
    farmSize: parseFloat(localStorage.getItem('farmSize')) || 2,
    primaryCrops: JSON.parse(localStorage.getItem('primaryCrops') || '["Rice"]'),
    experience: localStorage.getItem('farmingExperience') || 'intermediate',
    
    // Language
    language: localStorage.getItem('appLanguage') || 'en',
    
    // Voice
    voiceEnabled: localStorage.getItem('voiceEnabled') !== 'false',
    voiceSpeed: parseFloat(localStorage.getItem('voiceSpeed')) || 1.0,
    autoSpeak: localStorage.getItem('autoSpeak') !== 'false',
    voiceLanguage: localStorage.getItem('voiceLanguage') || 'en-IN',
    
    // Display
    fontSize: localStorage.getItem('fontSize') || 'medium',
    theme: localStorage.getItem('theme') || 'light',
    animations: localStorage.getItem('animations') !== 'false',
    
    // Accessibility
    highContrast: localStorage.getItem('highContrast') === 'true',
    simplifiedUI: localStorage.getItem('simplifiedUI') === 'true',
    largeButtons: localStorage.getItem('largeButtons') === 'true',
    
    // Notifications
    notifications: localStorage.getItem('notifications') !== 'false',
    weatherAlerts: localStorage.getItem('weatherAlerts') !== 'false',
    cropReminders: localStorage.getItem('cropReminders') !== 'false',
    priceUpdates: localStorage.getItem('priceUpdates') !== 'false',
    
    // Location
    gpsEnabled: localStorage.getItem('gpsEnabled') === 'true',
    latitude: parseFloat(localStorage.getItem('latitude')) || null,
    longitude: parseFloat(localStorage.getItem('longitude')) || null,
    
    // Data
    offlineMode: localStorage.getItem('offlineMode') !== 'false',
    autoSync: localStorage.getItem('autoSync') !== 'false',
  });
  
  // UI State
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [testingVoice, setTestingVoice] = useState(false);
  
  // Handle setting changes
  const handleChange = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update language immediately for real-time preview
    if (key === 'language') {
      setCurrentLang(value);
    }
  }, []);
  
  // Handle crop selection
  const handleCropToggle = useCallback((crop) => {
    setSettings(prev => {
      const crops = prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop];
      return { ...prev, primaryCrops: crops };
    });
  }, []);
  
  // Get GPS location
  const getGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('GPS not supported on this device');
      return;
    }
    
    setGpsLoading(true);
    setGpsError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSettings(prev => ({
          ...prev,
          gpsEnabled: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGpsLoading(false);
      },
      (error) => {
        setGpsError(`Location error: ${error.message}`);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);
  
  // Test voice
  const testVoice = useCallback(() => {
    if (!window.speechSynthesis) return;
    
    setTestingVoice(true);
    const utterance = new SpeechSynthesisUtterance(
      settings.language === 'hi' 
        ? 'नमस्ते किसान भाई! आवाज सेटिंग सही है।'
        : 'Hello farmer! Your voice settings are working correctly.'
    );
    utterance.rate = settings.voiceSpeed;
    utterance.lang = settings.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setTestingVoice(false);
    window.speechSynthesis.speak(utterance);
  }, [settings.language, settings.voiceSpeed]);
  
  // Save settings
  const saveSettings = useCallback(async () => {
    setSaving(true);
    
    try {
      // Save to localStorage
      const settingsToSave = {
        farmerName: settings.name,
        farmerPhone: settings.phone,
        farmerState: settings.state,
        farmerDistrict: settings.district,
        farmSize: settings.farmSize.toString(),
        primaryCrops: JSON.stringify(settings.primaryCrops),
        farmingExperience: settings.experience,
        appLanguage: settings.language,
        voiceEnabled: settings.voiceEnabled.toString(),
        voiceSpeed: settings.voiceSpeed.toString(),
        autoSpeak: settings.autoSpeak.toString(),
        voiceLanguage: settings.voiceLanguage,
        fontSize: settings.fontSize,
        theme: settings.theme,
        animations: settings.animations.toString(),
        highContrast: settings.highContrast.toString(),
        simplifiedUI: settings.simplifiedUI.toString(),
        largeButtons: settings.largeButtons.toString(),
        notifications: settings.notifications.toString(),
        weatherAlerts: settings.weatherAlerts.toString(),
        cropReminders: settings.cropReminders.toString(),
        priceUpdates: settings.priceUpdates.toString(),
        gpsEnabled: settings.gpsEnabled.toString(),
        latitude: settings.latitude?.toString() || '',
        longitude: settings.longitude?.toString() || '',
        location: settings.state,
        offlineMode: settings.offlineMode.toString(),
        autoSync: settings.autoSync.toString(),
      };
      
      Object.entries(settingsToSave).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      
      // Optional: Save to backend
      try {
        await fetch('http://localhost:8000/api/settings/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: settings.name,
            phone: settings.phone,
            state: settings.state,
            district: settings.district,
            farm_size: settings.farmSize,
            primary_crops: settings.primaryCrops,
            language: settings.language,
          }),
        });
      } catch (apiError) {
        console.log('Backend save skipped:', apiError.message);
      }
      
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        // Reload to apply settings
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [settings]);
  
  // Reset settings
  const resetSettings = useCallback(() => {
    setConfirmDialog({
      title: '🔄 Reset All Settings?',
      message: 'This will clear all your preferences and reload the page. Your saved analyses will be kept.',
      onConfirm: () => {
        const keysToKeep = ['soilAnalysis', 'cropRecommendation', 'yieldPrediction'];
        const savedData = {};
        keysToKeep.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) savedData[key] = value;
        });
        
        localStorage.clear();
        
        Object.entries(savedData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        
        window.location.reload();
      }
    });
  }, []);
  
  // Clear all data
  const clearAllData = useCallback(() => {
    setConfirmDialog({
      title: '⚠️ Clear All Data?',
      message: 'This will permanently delete ALL your data including saved analyses, preferences, and profile. This cannot be undone.',
      onConfirm: () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    });
  }, []);
  
  // Export data
  const exportData = useCallback(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Tab content components
  const tabContent = [
    // Tab 0: Profile
    <Box key="profile" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon color="success" /> {t.profile}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t.name}
            value={settings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'gray' }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t.phone}
            value={settings.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            variant="outlined"
            type="tel"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t.state}</InputLabel>
            <Select
              value={settings.state}
              label={t.state}
              onChange={(e) => handleChange('state', e.target.value)}
            >
              {indianStates.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t.district}
            value={settings.district}
            onChange={(e) => handleChange('district', e.target.value)}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>{t.farmSize}: {settings.farmSize} ha</Typography>
          <Slider
            value={settings.farmSize}
            onChange={(e, val) => handleChange('farmSize', val)}
            min={0.1}
            max={100}
            step={0.1}
            marks={[
              { value: 1, label: '1' },
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' }
            ]}
            valueLabelDisplay="auto"
            sx={{ color: 'success.main' }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t.experience}</InputLabel>
            <Select
              value={settings.experience}
              label={t.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
            >
              <MenuItem value="beginner">🌱 {t.beginner}</MenuItem>
              <MenuItem value="intermediate">🌿 {t.intermediate}</MenuItem>
              <MenuItem value="expert">🌳 {t.expert}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom sx={{ mb: 2 }}>{t.primaryCrops}:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {commonCrops.map(crop => (
              <Chip
                key={crop}
                label={crop}
                onClick={() => handleCropToggle(crop)}
                color={settings.primaryCrops.includes(crop) ? 'success' : 'default'}
                variant={settings.primaryCrops.includes(crop) ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>,
    
    // Tab 1: Language & Voice
    <Box key="language-voice" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TranslateIcon color="success" /> {t.language}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Application Language</InputLabel>
            <Select
              value={settings.language}
              label="Application Language"
              onChange={(e) => handleChange('language', e.target.value)}
            >
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="hi">🇮🇳 हिंदी (Hindi)</MenuItem>
              <MenuItem value="te">🇮🇳 తెలుగు (Telugu)</MenuItem>
              <MenuItem value="ta">🇮🇳 தமிழ் (Tamil)</MenuItem>
              <MenuItem value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VolumeUpIcon color="success" /> {t.voice}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.voiceEnabled}
                onChange={(e) => handleChange('voiceEnabled', e.target.checked)}
                color="success"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RecordVoiceOverIcon /> {t.enableVoice}
              </Box>
            }
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSpeak}
                onChange={(e) => handleChange('autoSpeak', e.target.checked)}
                color="success"
                disabled={!settings.voiceEnabled}
              />
            }
            label={t.autoRead}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom>
            {t.voiceSpeed}: {settings.voiceSpeed.toFixed(1)}x
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={settings.voiceSpeed}
              onChange={(e, val) => handleChange('voiceSpeed', val)}
              min={0.5}
              max={2.0}
              step={0.1}
              disabled={!settings.voiceEnabled}
              marks={[
                { value: 0.5, label: '🐢' },
                { value: 1.0, label: '🚶' },
                { value: 2.0, label: '🏃' }
              ]}
              sx={{ color: 'success.main', flex: 1 }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={testVoice}
              disabled={!settings.voiceEnabled || testingVoice}
              startIcon={testingVoice ? <CircularProgress size={16} /> : <VolumeUpIcon />}
            >
              Test
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>,
    
    // Tab 2: Display & Accessibility
    <Box key="display" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DarkModeIcon color="success" /> {t.display}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t.fontSize}</InputLabel>
            <Select
              value={settings.fontSize}
              label={t.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
            >
              <MenuItem value="small"><TextFieldsIcon sx={{ fontSize: 14, mr: 1 }} /> {t.small}</MenuItem>
              <MenuItem value="medium"><TextFieldsIcon sx={{ fontSize: 18, mr: 1 }} /> {t.medium}</MenuItem>
              <MenuItem value="large"><TextFieldsIcon sx={{ fontSize: 22, mr: 1 }} /> {t.large}</MenuItem>
              <MenuItem value="xlarge"><TextFieldsIcon sx={{ fontSize: 26, mr: 1 }} /> {t.xlarge}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t.theme}</InputLabel>
            <Select
              value={settings.theme}
              label={t.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <MenuItem value="light">☀️ {t.light}</MenuItem>
              <MenuItem value="dark">🌙 {t.dark}</MenuItem>
              <MenuItem value="auto">🔄 {t.auto}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.animations}
                onChange={(e) => handleChange('animations', e.target.checked)}
                color="success"
              />
            }
            label="Enable Animations"
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessibilityIcon color="success" /> {t.accessibility}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.highContrast}
                onChange={(e) => handleChange('highContrast', e.target.checked)}
                color="success"
              />
            }
            label={t.highContrast}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.simplifiedUI}
                onChange={(e) => handleChange('simplifiedUI', e.target.checked)}
                color="success"
              />
            }
            label={t.simpleUI}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.largeButtons}
                onChange={(e) => handleChange('largeButtons', e.target.checked)}
                color="success"
              />
            }
            label={t.largeButtons}
          />
        </Grid>
      </Grid>
    </Box>,
    
    // Tab 3: Location
    <Box key="location" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOnIcon color="success" /> {t.location}
      </Typography>
      
      <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <GpsFixedIcon color={settings.gpsEnabled ? 'success' : 'disabled'} />
          <Typography>
            {settings.gpsEnabled && settings.latitude
              ? `📍 Location: ${settings.latitude.toFixed(4)}, ${settings.longitude.toFixed(4)}`
              : 'GPS location not set'}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="success"
          onClick={getGPSLocation}
          disabled={gpsLoading}
          startIcon={gpsLoading ? <CircularProgress size={20} color="inherit" /> : <GpsFixedIcon />}
          sx={{ minHeight: 48 }}
        >
          {gpsLoading ? 'Getting Location...' : t.getLocation}
        </Button>
        
        {gpsError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {gpsError}
          </Alert>
        )}
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Or select your state for weather data:
      </Typography>
      
      <FormControl fullWidth>
        <InputLabel>{t.state}</InputLabel>
        <Select
          value={settings.state}
          label={t.state}
          onChange={(e) => handleChange('state', e.target.value)}
        >
          {indianStates.map(state => (
            <MenuItem key={state} value={state}>{state}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>,
    
    // Tab 4: Notifications
    <Box key="notifications" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsIcon color="success" /> {t.notifications}
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon><NotificationsIcon color="success" /></ListItemIcon>
          <ListItemText 
            primary="Enable Notifications" 
            secondary="Receive important updates"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              color="success"
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem>
          <ListItemIcon><CloudIcon color="info" /></ListItemIcon>
          <ListItemText 
            primary={t.weatherAlerts}
            secondary="Get alerts for extreme weather"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.weatherAlerts}
              onChange={(e) => handleChange('weatherAlerts', e.target.checked)}
              color="success"
              disabled={!settings.notifications}
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem>
          <ListItemIcon><AgricultureIcon color="success" /></ListItemIcon>
          <ListItemText 
            primary={t.cropReminders}
            secondary="Reminders for sowing, harvesting, etc."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.cropReminders}
              onChange={(e) => handleChange('cropReminders', e.target.checked)}
              color="success"
              disabled={!settings.notifications}
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem>
          <ListItemIcon><SpeedIcon color="warning" /></ListItemIcon>
          <ListItemText 
            primary={t.priceUpdates}
            secondary="Market price changes for your crops"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.priceUpdates}
              onChange={(e) => handleChange('priceUpdates', e.target.checked)}
              color="success"
              disabled={!settings.notifications}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Box>,
    
    // Tab 5: Data & Storage
    <Box key="data" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon color="success" /> {t.data}
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon><StorageIcon /></ListItemIcon>
          <ListItemText 
            primary="Offline Mode"
            secondary="Store data locally for offline use"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.offlineMode}
              onChange={(e) => handleChange('offlineMode', e.target.checked)}
              color="success"
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem>
          <ListItemIcon><SyncIcon /></ListItemIcon>
          <ListItemText 
            primary="Auto Sync"
            secondary="Automatically sync when online"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={settings.autoSync}
              onChange={(e) => handleChange('autoSync', e.target.checked)}
              color="success"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Data Management
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={exportData}
          startIcon={<StorageIcon />}
        >
          {t.exportData}
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          onClick={clearAllData}
          startIcon={<WarningIcon />}
        >
          {t.clearData}
        </Button>
      </Box>
    </Box>,
  ];
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
        <Box>
          <Typography variant="h4" fontWeight={600}>
            ⚙️ {t.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t.subtitle}
          </Typography>
        </Box>
      </Box>
      
      {/* Success Alert */}
      <Snackbar open={saved} autoHideDuration={3000}>
        <Alert severity="success" variant="filled">
          ✅ {t.saved}
        </Alert>
      </Snackbar>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Main Content */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.9rem',
              }
            }}
          >
            <Tab icon={<PersonIcon />} label={t.profile} />
            <Tab icon={<TranslateIcon />} label={t.language} />
            <Tab icon={<DarkModeIcon />} label={t.display} />
            <Tab icon={<LocationOnIcon />} label={t.location} />
            <Tab icon={<NotificationsIcon />} label={t.notifications} />
            <Tab icon={<StorageIcon />} label={t.data} />
          </Tabs>
        </Box>
        
        <CardContent sx={{ minHeight: 400 }}>
          {tabContent[activeTab]}
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="warning"
          onClick={resetSettings}
          startIcon={<RestartAltIcon />}
          sx={{ minHeight: 48 }}
        >
          {t.reset}
        </Button>
        
        <Button
          variant="contained"
          color="success"
          onClick={saveSettings}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ minHeight: 48, minWidth: 160 }}
        >
          {saving ? 'Saving...' : t.save}
        </Button>
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
        <DialogTitle>{confirmDialog?.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog?.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              confirmDialog?.onConfirm();
              setConfirmDialog(null);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedSettingsPage;
