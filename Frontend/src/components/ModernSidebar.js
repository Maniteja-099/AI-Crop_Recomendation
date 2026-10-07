import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Leaf,
  Cloud,
  Droplet,
  TrendingUp,
  Pill,
  BarChart3,
  MessageCircle,
  ChevronRight,
  X,
} from 'lucide-react';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import useTranslation from '../hooks/useTranslation';

export default function ModernSidebar({ open, onClose }) {
  const location = useLocation();
  const { farmingRegion } = useGlobalSettings();
  const { t } = useTranslation();

  const menuItems = [
    { icon: Home, label: t('navHome'), path: '/', desc: t('navHomeDesc'), color: 'text-green-600' },
    { icon: Leaf, label: t('navSoilCheck'), path: '/soil-fertility', desc: t('navSoilCheckDesc'), color: 'text-amber-600' },
    { icon: Cloud, label: t('navWeather'), path: '/weather', desc: t('navWeatherDesc'), color: 'text-sky-600' },
    { icon: Droplet, label: t('navCropsToGrow'), path: '/crop-recommendation', desc: t('navCropsToGrowDesc'), color: 'text-green-600' },
    { icon: TrendingUp, label: t('navYieldPredictor'), path: '/yield-prediction', desc: t('navYieldPredictorDesc'), color: 'text-orange-600' },
    { icon: Pill, label: t('navFertGuide'), path: '/fertilizer', desc: t('navFertGuideDesc'), color: 'text-red-600' },
    { icon: BarChart3, label: t('navFullReport'), path: '/dashboard', desc: t('navFullReportDesc'), color: 'text-purple-600' },
    { icon: MessageCircle, label: t('navAIAssistant'), path: '/chat', desc: t('navAIAssistantDesc'), color: 'text-blue-600' },
  ];

  // Display farming region from settings, with a fallback
  const regionDisplay = farmingRegion || 'Your Region';

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 w-72 overflow-y-auto transition-transform duration-300 z-40 lg:static lg:h-full lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="p-6 space-y-2">
          {/* Quick Info - Dynamic Region */}
          <div className="mb-6 pt-8 lg:pt-0 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-xs font-semibold text-green-600 mb-2">📍 {t('navFarmingRegion')}</p>
            <p className="text-lg font-bold text-green-900">{regionDisplay}</p>
            <Link
              to="/settings"
              onClick={onClose}
              className="text-xs text-green-600 hover:text-green-800 underline mt-1 inline-block"
            >
              {t('navChangeSettings')} →
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 mt-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-green-50 border-l-4 border-green-600'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${isActive ? 'text-green-700' : item.color
                        }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-sm ${isActive ? 'text-green-700' : 'text-gray-700'
                          }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  {isActive && <ChevronRight size={18} className="text-green-600" />}
                </Link>
              );
            })}
          </nav>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-600 mb-2">💡 {t('settingsNeedHelp')}</p>
            <p className="text-xs text-blue-700 mb-3">
              {t('navAIAssistantDesc')}
            </p>
            <Link
              to="/chat"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              <MessageCircle size={14} />
              {t('navAIAssistant')}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
