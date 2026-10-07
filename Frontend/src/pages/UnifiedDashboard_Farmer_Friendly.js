import React, { useState } from 'react';
import { getFullReport } from '../api/client';
import ChatWidget from '../components/ChatWidget';
import SimplerForm from '../components/SimplerForm';
import FarmerFriendlyCard from '../components/FarmerFriendlyCard';
import GuidancePanel from '../components/GuidancePanel';

/**
 * UnifiedDashboard - Farmer-Friendly Main Interface
 * Version 2: Redesigned for maximum usability and attractiveness
 */
const UnifiedDashboard = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    month: '',
    area: '',
    state: 'Karnataka',
    season: 'Kharif',
    soil_type: 'Loamy',
    ph: 6.8,
    rainfall: 200
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadDemoData = () => {
    setFormData({
      nitrogen: 45.5,
      phosphorus: 25.3,
      potassium: 85.2,
      temperature: 28.5,
      humidity: 65,
      month: 6,
      area: 2.5
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await getFullReport(formData);
      if (result.success) {
        setReport(result.data);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        setError(result.error || 'Failed to get report');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 flex items-center justify-center gap-2">
            🌾 Smart Farming Assistant
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Get personalized recommendations for your farm in seconds
          </p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              ✅ AI-Powered Analysis
            </span>
            <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              📊 Real-Time Predictions
            </span>
            <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              💡 Expert Guidance
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <SimplerForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          {/* Right Side - Info & Chat */}
          <div className="space-y-6">
            {/* Quick Info Box */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ℹ️ How It Works
              </h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-gray-700 text-sm">Enter your farm data</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-gray-700 text-sm">AI analyzes your data</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-gray-700 text-sm">Get personalized advice</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span className="text-gray-700 text-sm">Increase your harvest!</span>
                </li>
              </ol>
            </div>

            {/* Chat Button */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                💬 Need Help?
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Ask our AI assistant any farming questions
              </p>
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>💬</span>
                {showChatbot ? 'Close Chat' : 'Open Chat'}
              </button>
            </div>

            {/* Benefits Box */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">✨ Benefits</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Save time & money
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Increase yield
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Reduce waste
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Better decisions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        {showChatbot && (
          <div className="mt-8 fixed bottom-4 right-4 z-50 w-80 h-96 shadow-2xl rounded-lg bg-white">
            <ChatWidget />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800 font-semibold">❌ Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {report && (
          <div id="results" className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                🎯 Your Farm Report
              </h2>
              <p className="text-gray-600">Based on AI analysis - Follow these recommendations</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Soil Card */}
              {report.report?.soil_fertility && (
                <FarmerFriendlyCard
                  title="Soil Health"
                  icon="🌱"
                  status={report.report.soil_fertility.message}
                  statusColor={
                    report.report.soil_fertility.message.includes('High') ? '#10b981' :
                    report.report.soil_fertility.message.includes('Low') ? '#ef4444' : '#f59e0b'
                  }
                  mainValue={report.report.soil_fertility.avg_nutrients?.toFixed(1)}
                  mainLabel="Average Nutrient Level"
                  recommendations={[report.report.soil_fertility.recommendation]}
                />
              )}

              {/* Weather Card */}
              {report.report?.weather_risk && (
                <FarmerFriendlyCard
                  title="Weather Conditions"
                  icon="⛅"
                  status={report.report.weather_risk.label}
                  statusColor="#3b82f6"
                  details={['Current conditions analyzed', 'Based on month and temperature']}
                  recommendations={[report.report.weather_risk.recommendation]}
                />
              )}

              {/* Crop Card */}
              {report.report?.crop_recommendation && (
                <FarmerFriendlyCard
                  title="Recommended Crop"
                  icon={report.report.crop_recommendation.icon}
                  status={report.report.crop_recommendation.primary_crop.toUpperCase()}
                  statusColor="#10b981"
                  mainValue={`${(report.report.crop_recommendation.confidence * 100).toFixed(0)}%`}
                  mainLabel="Confidence Level"
                  details={[
                    `Alternatives: ${report.report.crop_recommendation.alternatives.join(', ')}`,
                    ...report.report.crop_recommendation.crop_tips
                  ]}
                />
              )}

              {/* Yield Card */}
              {report.report?.yield_prediction && (
                <FarmerFriendlyCard
                  title="Yield Prediction"
                  icon="📈"
                  status={`${report.report.yield_prediction.quality} Quality`}
                  statusColor={
                    report.report.yield_prediction.quality === 'Excellent' ? '#10b981' :
                    report.report.yield_prediction.quality === 'Good' ? '#3b82f6' : '#f59e0b'
                  }
                  mainValue={`${report.report.yield_prediction.predicted_yield.toFixed(1)} tons`}
                  mainLabel="Expected Harvest"
                  details={[
                    `Per Hectare: ${report.report.yield_prediction.per_hectare.toFixed(2)} tons`,
                    `Market Value: ${report.report.yield_prediction.market_value || 'N/A'}`
                  ]}
                />
              )}

              {/* Fertilizer Card */}
              {report.report?.fertilizer_advisory && (
                <FarmerFriendlyCard
                  title="Fertilizer Advice"
                  icon="💧"
                  status={report.report.fertilizer_advisory.recommended_fertilizer}
                  statusColor="#8b5cf6"
                  details={[
                    `Dosage: ${report.report.fertilizer_advisory.dosage}`,
                    `Timing: ${report.report.fertilizer_advisory.timing}`,
                    `Method: ${report.report.fertilizer_advisory.application_method}`
                  ]}
                  recommendations={report.report.fertilizer_advisory.warnings || []}
                  warnings={
                    Object.values(report.report.fertilizer_advisory.deficiencies || {}).some(v => v) 
                      ? ['Nutrient deficiencies detected. Apply fertilizer as recommended.']
                      : []
                  }
                />
              )}
            </div>

            {/* Action Items */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ✅ Action Plan
              </h3>
              <ol className="space-y-3">
                <li className="flex gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="flex-shrink-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-gray-700"><strong>This Week:</strong> Prepare soil according to recommendations above</span>
                </li>
                <li className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="flex-shrink-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-gray-700"><strong>Before Planting:</strong> Apply recommended fertilizer</span>
                </li>
                <li className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="flex-shrink-0 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-gray-700"><strong>During Growing:</strong> Monitor weather and adjust irrigation</span>
                </li>
                <li className="flex gap-3 p-3 bg-amber-50 rounded-lg">
                  <span className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span className="text-gray-700"><strong>Harvest Time:</strong> Ready for better yield!</span>
                </li>
              </ol>
            </div>

            {/* Success Message */}
            <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 p-6 rounded-lg text-center">
              <p className="text-green-900 font-semibold text-lg">
                🎉 You're all set! Follow the recommendations above for the best results.
              </p>
              <p className="text-green-800 text-sm mt-2">
                Questions? Ask the chatbot for more details or farmer support.
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 text-sm pb-8">
          <p>
            Made with 💚 for farmers | Version 2.0 | 
            <a href="#" className="text-green-600 hover:text-green-700 ml-1">Feedback</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
