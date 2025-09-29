import { useNavigate } from "react-router";

const SavedTipsPage = ({ savedTips, setSelectedTip }) => {
  const navigate = useNavigate();

  const openTipDetail = (tip) => {
    setSelectedTip(tip);
    navigate(`/tips/${tip.id}`);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
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
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Saved Wellness Tips
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          {savedTips.length} tip{savedTips.length !== 1 ? "s" : ""} saved for
          later
        </p>
      </div>

      {savedTips.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold mb-2">No saved tips yet</h2>
          <p>Start generating wellness tips and save your favorites!</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-6"
              onClick={() => openTipDetail(tip)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{tip.icon}</div>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tip.shortDesc}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Saved on {new Date(tip.savedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTipsPage;
