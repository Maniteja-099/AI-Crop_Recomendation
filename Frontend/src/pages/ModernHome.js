import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Cloud, Droplet, TrendingUp, Pill, BarChart3, MessageCircle, ArrowRight } from 'lucide-react';
import { FeatureCard, Button } from '../components/ui/ModernComponents';
import useTranslation from '../hooks/useTranslation';

export default function ModernHome() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-farm-600 via-farm-500 to-farm-700 rounded-2xl overflow-hidden text-white p-8 md:p-12 lg:p-16 shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <div className="text-9xl">🌾</div>
        </div>
        <div className="absolute bottom-0 left-0 opacity-5">
          <div className="text-8xl">🌱</div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur">
            {t('homeWelcome')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {t('homeTitle')}
          </h1>
          <p className="text-lg md:text-xl text-farm-50 mb-8 max-w-xl">
            {t('homeSubtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/crop-recommendation">
              <Button size="lg" className="!bg-white !text-farm-700 hover:!bg-farm-50">
                <ArrowRight size={20} />
                {t('homeGetStarted')}
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-farm-700">
                <MessageCircle size={20} />
                {t('homeAskAI')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Agricultural Image Gallery */}
      <div>
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('homeGalleryTitle') || 'Our Agricultural Focus'}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('homeGallerySubtitle') || 'Supporting farmers across diverse crop types'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              src: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
              title: t('homeCropRice') || 'Rice Paddy Fields',
              desc: t('homeCropRiceDesc') || 'Lush green rice paddies — the staple crop of millions',
            },
            {
              src: 'https://images.unsplash.com/photo-1437252611977-07f74518abd7?w=600&h=400&fit=crop',
              title: t('homeCropWheat') || 'Golden Wheat',
              desc: t('homeCropWheatDesc') || 'Rabi season wheat fields ready for harvest',
            },
            {
              src: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop',
              title: t('homeCropCorn') || 'Corn / Maize',
              desc: t('homeCropCornDesc') || 'Versatile corn crops growing tall in the sun',
            },
            {
              src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=400&fit=crop',
              title: t('homeCropCotton') || 'Cotton Fields',
              desc: t('homeCropCottonDesc') || 'White cotton bolls ready for picking',
            },
            {
              src: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=400&fit=crop',
              title: t('homeCropTea') || 'Tea Garden',
              desc: t('homeCropTeaDesc') || 'Terraced tea plantations in the highlands',
            },
            {
              src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
              title: t('homeCropVegetable') || 'Vegetable Farming',
              desc: t('homeCropVegetableDesc') || 'Fresh organic vegetables from the farm',
            },
          ].map((crop, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                src={crop.src}
                alt={crop.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white text-lg font-bold mb-1">{crop.title}</h3>
                <p className="text-gray-200 text-sm">{crop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Main Features Grid */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('homeWhatCanYouDo')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('homeFiveTools')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Soil Health */}
          <FeatureCard
            icon={Leaf}
            title={t('homeCheckSoil')}
            description={t('homeCheckSoilDesc')}
            color="farm"
            href="/soil-fertility"
          />

          {/* Weather */}
          <FeatureCard
            icon={Cloud}
            title={t('homeWeatherRisk')}
            description={t('homeWeatherRiskDesc')}
            color="sky"
            href="/weather"
          />

          {/* Crop Suggestion */}
          <FeatureCard
            icon={Droplet}
            title={t('homeWhatGrow')}
            description={t('homeWhatGrowDesc')}
            color="harvest"
            href="/crop-recommendation"
          />

          {/* Yield Prediction */}
          <FeatureCard
            icon={TrendingUp}
            title={t('homeHarvestEst')}
            description={t('homeHarvestEstDesc')}
            color="harvest"
            href="/yield-prediction"
          />

          {/* Fertilizer */}
          <FeatureCard
            icon={Pill}
            title={t('homeFertGuide')}
            description={t('homeFertGuideDesc')}
            color="farm"
            href="/fertilizer"
          />

          {/* Dashboard */}
          <FeatureCard
            icon={BarChart3}
            title={t('homeFullDash')}
            description={t('homeFullDashDesc')}
            color="sky"
            href="/dashboard"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('homeHowItWorks')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: t('homeStep1'), desc: t('homeStep1Desc') },
            { step: 2, title: t('homeStep2'), desc: t('homeStep2Desc') },
            { step: 3, title: t('homeStep3'), desc: t('homeStep3Desc') },
            { step: 4, title: t('homeStep4'), desc: t('homeStep4Desc') },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-farm-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-farm-600 to-farm-700 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">{t('homeReadyTransform')}</h2>
        <p className="text-lg text-farm-50 mb-8 max-w-2xl mx-auto">
          {t('homeReadyCTA')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/soil-fertility">
            <Button size="lg" variant="secondary">
              {t('homeStartAnalysis')}
            </Button>
          </Link>
          <Link to="/chat">
            <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-farm-700">
              {t('homeGetHelp')}
            </Button>
          </Link>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('homeFAQ')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: t('homeFAQ1Q'), a: t('homeFAQ1A') },
            { q: t('homeFAQ2Q'), a: t('homeFAQ2A') },
            { q: t('homeFAQ3Q'), a: t('homeFAQ3A') },
            { q: t('homeFAQ4Q'), a: t('homeFAQ4A') },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
