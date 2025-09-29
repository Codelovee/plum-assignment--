import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import GeminiService from "../services/GeminiService"; // ✅ import service
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorModal from "../components/ErrorModal";

const TipsPage = ({
  generatedTips,
  setGeneratedTips,
  savedTips,
  setSavedTips,
  setSelectedTip,
  profile,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [storedProfile, setStoredProfile] = useState(null);

  // Load profile from localStorage if missing in props
  useEffect(() => {
    if (profile) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setStoredProfile(profile);
    } else {
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        setStoredProfile(JSON.parse(savedProfile));
      }
    }
  }, [profile]);

  // Fetch tips when profile is available
  useEffect(() => {
    if (storedProfile) {
      handleRegenerate(); // ✅ auto-generate tips on load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedProfile]);

  // Toggle save/unsave
  const toggleSaveTip = (tip) => {
    const exists = savedTips.some((t) => t.id === tip.id);
    let updatedSavedTips;

    if (exists) {
      updatedSavedTips = savedTips.filter((t) => t.id !== tip.id);
    } else {
      updatedSavedTips = [
        ...savedTips,
        { ...tip, savedAt: new Date().toISOString() },
      ];
    }

    setSavedTips(updatedSavedTips);
    localStorage.setItem("savedTips", JSON.stringify(updatedSavedTips));
  };

  const isTipSaved = (tip) => savedTips.some((t) => t.id === tip.id);

  // Navigate to detail page
  const handleViewDetails = (tip) => {
    setSelectedTip(tip);
    navigate(`/tips/${tip.id}`);
  };

  // ✅ Generate tips from Gemini API
  const handleRegenerate = async () => {
    const activeProfile = storedProfile;

    if (!activeProfile || !activeProfile.goal) {
      setError("Profile information missing. Please go back to Home.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tips = await GeminiService.generateTips(activeProfile);
      setGeneratedTips(tips || []);
    } catch (err) {
      console.error(err);
      setError("Failed to generate tips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Decide which list to show
  const tipsToDisplay = showSaved ? savedTips : generatedTips;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {showSaved ? "Saved Wellness Tips" : "Generated Wellness Tips"}
        </h1>
        <div className="flex gap-2">
          {!showSaved && (
            <button
              onClick={handleRegenerate}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Regenerate Tips
            </button>
          )}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {showSaved ? "Back to Generated" : "View Saved Tips"}
          </button>
        </div>
      </div>

      {tipsToDisplay.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          {showSaved
            ? "No saved tips yet."
            : "No tips generated yet. Please go back and enter your profile."}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipsToDisplay.map((tip, index) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group card-hover fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleViewDetails(tip)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{tip.icon}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveTip(tip);
                    }}
                    className={`p-2 rounded-full cursor-pointer ${
                      isTipSaved(tip)
                        ? "text-yellow-500 bg-yellow-50"
                        : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {isTipSaved(tip) ? "★" : "☆"}
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tip.shortDesc}
                </p>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  Click to view details →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorModal error={error} setError={setError} />}
    </div>
  );
};

export default TipsPage;
