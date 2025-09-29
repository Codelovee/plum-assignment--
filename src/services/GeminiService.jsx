// src/services/GeminiService.jsx
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_API_URL;
  

const SYSTEM_PROMPT = `You are a wellness expert AI that generates personalized health recommendations. 
Always respond with valid JSON in this exact format:

For generating tips:
{
  "tips": [
    {
      "id": "unique_id_1",
      "title": "Tip Title",
      "icon": "relevant_emoji",
      "category": "exercise|nutrition|sleep|mental|general",
      "shortDesc": "Brief description",
      "longDesc": "Detailed explanation",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "duration": "e.g., 10 minutes",
      "intensity": "Low|Moderate|High",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
    }
  ]
}

For detailed explanations:
{
  "detailedExplanation": "Extended personalized explanation",
  "personalizedTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Make tips practical, evidence-based, and personalized to the user's age, gender, and goals.`;

export default class GeminiService {
  static async generateTips(profile) {
    const prompt = `${SYSTEM_PROMPT}

Generate 5 personalized wellness tips for:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Goal: ${profile.goal}

Make the tips diverse across different categories and truly personalized.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format from AI");
     
      const tipsData = JSON.parse(jsonMatch[0]);
      return tipsData.tips.slice(0, 5);
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getFallbackTips(profile);
    }
  }

  static async generateDetailedExplanation(tip, profile) {
    const prompt = `${SYSTEM_PROMPT}

Create a detailed explanation for this wellness tip:
Title: ${tip.title}
Category: ${tip.category}

Personalize it for:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Goal: ${profile.goal}

Provide a detailed explanation and 3 personalized implementation tips.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format from AI");

      const explanationData = JSON.parse(jsonMatch[0]);
      return {
        ...tip,
        detailedExplanation: explanationData.detailedExplanation,
        personalizedTips: explanationData.personalizedTips,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        ...tip,
        detailedExplanation: `Personalized for ${profile.age}yo ${profile.gender} focusing on ${profile.goal}. ${tip.longDesc}`,
        personalizedTips: [
          "Start with 70% intensity and gradually increase",
          "Combine with your existing routine for better adherence",
          "Track your progress weekly for motivation",
        ],
      };
    }
  }

  static async getFallbackTips(profile) {
    const fallbackTips = [
      {
        id: "1",
        title: "Personalized Morning Routine",
        icon: "🌅",
        category: "general",
        shortDesc: "Start your day with energy and purpose",
        longDesc: `Based on your profile as a ${profile.age}-year-old ${profile.gender} focusing on ${profile.goal}, this morning routine will set you up for success.`,
        steps: [
          "Wake up at a consistent time",
          "Drink a glass of water",
          "5 minutes of light stretching",
          "Set 3 daily intentions",
          "Healthy breakfast",
        ],
        duration: "20 minutes",
        intensity: "Low",
        benefits: ["Increased energy", "Better focus", "Improved mood"],
      },
      {
        id: "2",
        title: "Hydration Strategy",
        icon: "💧",
        category: "nutrition",
        shortDesc: "Stay optimally hydrated throughout the day",
        longDesc: `Proper hydration is especially important for ${profile.gender}s your age pursuing ${profile.goal}.`,
        steps: [
          "Drink water upon waking",
          "Keep water visible",
          "Set hourly reminders",
          "Infuse with natural flavors",
          "Monitor hydration levels",
        ],
        duration: "Throughout day",
        intensity: "Moderate",
        benefits: ["Better skin", "Improved cognition", "Enhanced digestion"],
      },
    ];

    if (profile.goal === "weight loss") {
      fallbackTips.push({
        id: "3",
        title: "Active Lifestyle Integration",
        icon: "🚶",
        category: "exercise",
        shortDesc: "Incorporate movement into daily activities",
        longDesc:
          "Small changes can lead to significant weight management results.",
        steps: [
          "Take stairs instead of elevator",
          "Walk during phone calls",
          "Park further away",
          "Stand up every 30 minutes",
          "Evening walk after dinner",
        ],
        duration: "Throughout day",
        intensity: "Moderate",
        benefits: ["Calorie burning", "Metabolism boost", "Stress reduction"],
      });
    }

    return fallbackTips.slice(0, 5);
  }
}
