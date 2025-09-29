import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GeminiService from "../services/GeminiService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorModal from "../components/ErrorModal";

const TipDetailPage = ({
  selectedTip,
  setSelectedTip,
  savedTips,
  setSavedTips,
  profile,
}) => {
  const navigate = useNavigate();
  const [tipDetails, setTipDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTipSaved = (tip) => savedTips.some((t) => t.id === tip.id);

  const toggleSaveTip = (tip) => {
    let updatedSavedTips;
    const exists = savedTips.some((t) => t.id === tip.id);

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

  useEffect(() => {
    const fetchTipDetails = async () => {
      if (!selectedTip) {
        navigate("/tips"); // Redirect if no tip is selected
        return;
      }

      setLoading(true);
      try {
        const detailedTip = await GeminiService.generateDetailedExplanation(
          selectedTip,
          profile
        );
        setTipDetails(detailedTip);
      } catch (err) {
        // ❌ removed console.error
        setError("Failed to load tip details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTipDetails();
  }, [selectedTip]);

  if (!selectedTip) return null;

  return (
    <div className="min-h-screen bg-white fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/90 hover:text-white mb-4 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tips
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-6xl mb-4">{selectedTip.icon}</div>
              <h1 className="text-3xl font-bold mb-2">{selectedTip.title}</h1>
              <p className="text-blue-100 text-lg">{selectedTip.shortDesc}</p>
            </div>
            <button
              onClick={() => toggleSaveTip(selectedTip)}
              className={`p-3 rounded-full transition-all ${
                isTipSaved(selectedTip)
                  ? "text-yellow-400 bg-white/20"
                  : "text-white/80 bg-white/10 hover:bg-white/20"
              }`}
            >
              {isTipSaved(selectedTip) ? "★" : "☆"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {loading && <LoadingSpinner />}
        {error && <ErrorModal error={error} setError={setError} />}
        {tipDetails && (
          <>
            {/* Overview */}
            <section className="mb-8 slide-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tipDetails.detailedExplanation}
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Duration</div>
                  <div className="font-medium ml-2">{tipDetails.duration}</div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Intensity</div>
                  <div className="font-medium ml-2">{tipDetails.intensity}</div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600">Category</div>
                  <div className="font-medium ml-2 capitalize">
                    {tipDetails.category}
                  </div>
                </div>
              </div>
            </section>

            {/* Step-by-Step Guide */}
            <section className="mb-8 slide-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step-by-Step Guide
              </h2>
              <div className="space-y-4">
                {tipDetails.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-lg fade-in"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Benefits */}
            <section className="mb-8 slide-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Key Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tipDetails.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg fade-in"
                  >
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Personalized Tips */}
            {tipDetails.personalizedTips && (
              <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg slide-in">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Personalized for You
                </h3>
                <ul className="space-y-2">
                  {tipDetails.personalizedTips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-yellow-700 flex items-start"
                    >
                      <span className="text-yellow-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TipDetailPage;
