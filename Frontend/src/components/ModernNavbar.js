import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Settings, Globe, LogOut } from 'lucide-react';
import { useGlobalSettings, LANGUAGE_NAMES } from '../context/GlobalSettingsContext';
import { useAuth } from '../context/AuthContext';
import useTranslation from '../hooks/useTranslation';

export default function Navbar({ toggleSidebar }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage } = useGlobalSettings();
  const { logout, user } = useAuth();
  const { t, isTranslating } = useTranslation();
  const languageRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      {/* Translation loading indicator */}
      {isTranslating && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-100 overflow-hidden z-50">
          <div className="h-full bg-green-500 animate-pulse" style={{ width: '100%', animation: 'translatePulse 1.5s ease-in-out infinite' }} />
          <style>{`
            @keyframes translatePulse {
              0%, 100% { transform: translateX(-100%); }
              50% { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="text-2xl">🌾</div>
              <span className="font-bold text-xl text-green-700 hidden sm:inline">AI Crop Recommendation & Growth Prediction System</span>
            </Link>
          </div>

          {/* Center: Brand Name (Mobile) */}
          <div className="sm:hidden text-center">
            <h1 className="text-lg font-bold text-green-700">AI Crop Rec. & Growth Prediction</h1>
          </div>

          {/* Right: Language & Settings */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="p-2 rounded-lg hover:bg-green-100 text-gray-600 hover:text-green-700 transition-colors flex items-center gap-1"
                title={t('settingsChangeLanguage')}
              >
                <Globe size={20} className={isTranslating ? 'animate-spin' : ''} />
                <span className="text-sm font-semibold hidden sm:inline uppercase">{isTranslating ? '...' : language}</span>
              </button>

              {/* Language Dropdown */}
              {languageOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 z-50 border-2 border-gray-200 max-h-96 overflow-y-auto">
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white sticky top-0 z-10 border-b border-gray-100">
                    {t('navSelectLanguage')}
                  </div>
                  {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors bg-white ${language === code
                        ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-green-100 text-gray-600 hover:text-green-700 transition-colors"
              title={t('settingsPageTitle')}
            >
              <Settings size={20} />
            </Link>

            {/* Logout */}
            {user && (
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                title={t('authLogout') || 'Logout'}
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
