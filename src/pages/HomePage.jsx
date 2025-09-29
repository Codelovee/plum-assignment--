import { useState } from "react";
import { useNavigate } from "react-router";
import data from "../utils/data.json";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorModal from "../components/ErrorModal";

const HomePage = ({ setGeneratedTips, setSelectedTip, setProfile }) => {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleGenerateTips = async () => {
    if (!age || !gender || !goal) {
      setError("Please fill all the fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedGoal = goal.trim().toLowerCase();

      // ✅ Save profile
      const newProfile = { age, gender, goal: normalizedGoal };
      setProfile(newProfile);
      localStorage.setItem("userProfile", JSON.stringify(newProfile));

      // Filter tips
      const filteredTips = data.filter(
        (tip) => tip.category.toLowerCase() === normalizedGoal
      );

      if (filteredTips.length === 0) {
        setError("No tips found for this goal. Try another one!");
        setLoading(false);
        return;
      }

      const randomizedTips = shuffleArray(filteredTips);

      setGeneratedTips(randomizedTips);
      setSelectedTip(null);
      navigate("/tips");
    } catch (err) {
      console.error(err);
      setError("Failed to load tips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const genders = ["Male", "Female", "Non binary", "Prefer not to say"];
  const goals = [
    { label: "Weight Loss", value: "weight loss", emoji: "⚖️" },
    { label: "Muscle Gain", value: "muscle gain", emoji: "💪" },
    { label: "Stress Reduction", value: "stress reduction", emoji: "🧘" },
    { label: "Better Sleep", value: "better sleep", emoji: "😴" },
    { label: "Improved Focus", value: "improved focus", emoji: "🎯" },
    { label: "General Wellness", value: "general wellness", emoji: "🌞" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:w-96 w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Wellness Profile
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Tell us about yourself to get personalized wellness tips
        </p>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your age"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g.toLowerCase())}
                className={`px-3 py-2 rounded-lg border cursor-pointer transition ${
                  gender === g.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Wellness Goal */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Wellness Goal</label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer transition ${
                  goal === g.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{g.emoji}</span> {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleGenerateTips}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
        >
          Generate Wellness Tips →
        </button>

        {loading && <LoadingSpinner />}
        {error && <ErrorModal error={error} setError={setError} />}
      </div>
    </div>
  );
};

export default HomePage;
