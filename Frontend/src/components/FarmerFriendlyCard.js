import React from 'react';

/**
 * FarmerFriendlyCard - Attractive, Easy-to-Understand Result Card
 * Designed specifically for farmers with clear guidance
 */
const FarmerFriendlyCard = ({ 
  title, 
  icon, 
  status, 
  statusColor, 
  mainValue, 
  mainLabel,
  details = [],
  recommendations = [],
  warnings = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4 border-l-4" style={{ borderColor: statusColor }}>
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className={`text-sm font-semibold ${statusColor === '#10b981' ? 'text-green-600' : statusColor === '#f59e0b' ? 'text-amber-600' : 'text-red-600'}`}>
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* Main Value Display */}
      {mainValue && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
          <p className="text-gray-600 text-sm font-medium mb-1">{mainLabel}</p>
          <p className="text-3xl font-bold text-gray-800">{mainValue}</p>
        </div>
      )}

      {/* Details Section */}
      {details.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">📋 Details:</p>
          <ul className="space-y-1">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mb-4 bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 What You Should Do:</p>
          <ul className="space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Important:</p>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-600 font-bold mt-0.5">!</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FarmerFriendlyCard;
