import { useState } from "react";

const TipCard = ({ tip, onSelect, toggleSaveTip, isTipSaved }) => {
  const [hovered, setHovered] = useState(false);
  const saved = isTipSaved(tip);

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group card-hover fade-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(tip)}
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{tip.icon}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveTip(tip);
            }}
            className={`p-2 rounded-full transition-all ${
              saved
                ? "text-yellow-500 bg-yellow-50"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
          >
            {saved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {tip.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{tip.shortDesc}</p>

        {/* Metadata */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {tip.duration}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {tip.intensity} intensity
          </span>
        </div>

        {/* Benefits Preview */}
        <div className="flex flex-wrap gap-1 mt-3">
          {tip.benefits.slice(0, 2).map((b, i) => (
            <span
              key={i}
              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
            >
              {b}
            </span>
          ))}
          {tip.benefits.length > 2 && (
            <span className="text-xs text-gray-500">
              +{tip.benefits.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div
        className={`px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-xl transition-opacity ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center text-blue-600 text-sm font-medium">
          Click to view details →
        </div>
      </div>
    </div>
  );
};

export default TipCard;
