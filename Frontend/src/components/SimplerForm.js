import React, { useState } from 'react';
import GuidancePanel from './GuidancePanel';
import { ALL_INDIAN_STATES } from '../context/GlobalSettingsContext';

/**
 * SimplerForm - Farmer-Friendly Form Component
 * Simple, clear, with helpful guidance
 */
const SimplerForm = ({ formData, onInputChange, onSubmit, loading }) => {
  const [showGuidance, setShowGuidance] = useState(true);

  const inputField = (label, name, type = "number", placeholder = "", unit = "", min = 0, max = 100) => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
        {unit && <span className="text-gray-500 font-normal"> ({unit})</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={onInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-lg"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🌾 Your Farm Details
      </h2>

      {showGuidance && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">ℹ️ Quick Tips</h3>
            <button
              onClick={() => setShowGuidance(false)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Hide
            </button>
          </div>
          <GuidancePanel section="form" />
        </div>
      )}

      <form onSubmit={onSubmit}>
        {/* Soil Section */}
        <div className="mb-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            🌱 Soil Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputField("Nitrogen", "nitrogen", "number", "0-200", "mg/kg", 0, 200)}
            {inputField("Phosphorus", "phosphorus", "number", "0-200", "mg/kg", 0, 200)}
            {inputField("Potassium", "potassium", "number", "0-300", "mg/kg", 0, 300)}
          </div>
        </div>

        {/* Weather Section */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            ⛅ Weather Conditions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputField("Temperature", "temperature", "number", "-20-60", "°C", -20, 60)}
            {inputField("Humidity", "humidity", "number", "0-100", "%", 0, 100)}
            {inputField("Month", "month", "number", "1-12", "", 1, 12)}
          </div>
        </div>

        {/* Farm Section */}
        <div className="mb-8 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
          <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            📍 Farm Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputField("Farm Area", "area", "number", "Size of your farm", "hectares", 0, 1000)}

            {/* State Select */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                State
              </label>
              <select
                name="state"
                value={formData.state || ''}
                onChange={onInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-lg"
              >
                {ALL_INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {inputField("pH Level", "ph", "number", "Soil pH", "", 3, 9)}
            {inputField("Rainfall", "rainfall", "number", "Annual rainfall", "mm", 0, 500)}
          </div>
        </div>

        {/* Additional Options */}
        <div className="mb-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            ⚙️ Additional Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Season
              </label>
              <select
                name="season"
                value={formData.season || ''}
                onChange={onInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-lg"
              >
                <option>Kharif</option>
                <option>Rabi</option>
                <option>Summer</option>
                <option>Whole Year</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                name="soil_type"
                value={formData.soil_type || ''}
                onChange={onInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-lg"
              >
                <option>Loamy</option>
                <option>Sandy</option>
                <option>Clayey</option>
                <option>Black</option>
                <option>Red</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>📊</span>
                Get My Farm Report
              </>
            )}
          </button>

        </div>

        {/* Info Box */}
        <div className="mt-6 bg-green-100 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-900 text-sm font-medium">
            ✅ <strong>Tip:</strong> Fill in your actual farm data above and click the button to get a personalized farm report.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SimplerForm;
