import React from 'react';

/**
 * GuidancePanel - Shows quick tips and guidance for farmers
 * Makes the app more user-friendly with contextual help
 */
const GuidancePanel = ({ section = 'form' }) => {
  const guidanceContent = {
    form: {
      title: "📝 Need Help Filling This Out?",
      tips: [
        "🌱 Soil Nutrients: Use soil testing kits or contact your local agricultural office",
        "🌡️ Temperature: Check weather app or local weather station",
        "💧 Humidity: Usually provided in weather forecasts",
        "📅 Month: Select the month when you'll plant/harvest",
        "📏 Area: Enter your farm size in hectares"
      ],
      icon: "📋"
    },
    results: {
      title: "🎯 Understanding Your Report",
      tips: [
        "🟢 Green status: Everything is good, proceed with planting",
        "🟡 Yellow status: Be cautious, may need adjustments",
        "🔴 Red status: Take action before proceeding",
        "💧 Follow fertilizer recommendations for best yield",
        "📞 Ask the chatbot (💬) for more detailed advice"
      ],
      icon: "✅"
    },
    soil: {
      title: "🌍 Understanding Soil Health",
      tips: [
        "NPK = Nitrogen (N), Phosphorus (P), Potassium (K)",
        "Nitrogen: For leafy growth (green parts)",
        "Phosphorus: For root and seed development",
        "Potassium: For overall plant strength",
        "Balanced nutrients = Better harvest"
      ],
      icon: "🌱"
    },
    weather: {
      title: "⛅ Weather Impact on Farming",
      tips: [
        "Temperature affects crop growth and maturity",
        "Humidity impacts disease and pest risk",
        "Rainfall determines irrigation needs",
        "Extreme conditions may damage crops",
        "Plan ahead based on forecast"
      ],
      icon: "🌦️"
    }
  };

  const content = guidanceContent[section] || guidanceContent.form;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{content.icon}</span>
        <h4 className="font-bold text-blue-900 text-lg">{content.title}</h4>
      </div>
      
      <ul className="space-y-2">
        {content.tips.map((tip, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 leading-relaxed">
            <span className="text-blue-600 font-bold flex-shrink-0">→</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuidancePanel;
