import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import TipsPage from "./pages/TipsPage";
import TipDetailPage from "./pages/TipDetailPage";
import SavedTipsPage from "./pages/SavedTipsPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

// Layout component to wrap pages with Header
const Layout = () => (
  <div>
    <Header />
    <Outlet /> {/* Render the matched page here */}
  </div>
);

function App() {
  const [savedTips, setSavedTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [profile, setProfile] = useState({ age: "", gender: "", goal: "" });
  const [generatedTips, setGeneratedTips] = useState([]);

  // Load savedTips + profile from localStorage on mount
  useEffect(() => {
    const storedTips = localStorage.getItem("savedTips");
    if (storedTips) setSavedTips(JSON.parse(storedTips));

    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  // Sync savedTips with localStorage
  useEffect(() => {
    if (savedTips.length > 0) {
      localStorage.setItem("savedTips", JSON.stringify(savedTips));
    }
  }, [savedTips]);

  // Sync profile with localStorage
  useEffect(() => {
    if (profile && (profile.age || profile.gender || profile.goal)) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
    }
  }, [profile]);

  const router = createBrowserRouter([
    {
      element: <Layout />, // Header + Outlet wrapper
      children: [
        {
          path: "/",
          element: (
            <HomePage
              savedTips={savedTips}
              setSavedTips={setSavedTips}
              profile={profile}
              setProfile={setProfile}
              setSelectedTip={setSelectedTip}
              generatedTips={generatedTips}
              setGeneratedTips={setGeneratedTips}
            />
          ),
        },
        {
          path: "/tips",
          element: (
            <TipsPage
              generatedTips={generatedTips}
              setGeneratedTips={setGeneratedTips}
              savedTips={savedTips}
              setSavedTips={setSavedTips}
              setSelectedTip={setSelectedTip}
              profile={profile}
            />
          ),
        },
        {
          path: "/tips/:id",
          element: (
            <TipDetailPage
              selectedTip={selectedTip}
              setSelectedTip={setSelectedTip}
              savedTips={savedTips}
              setSavedTips={setSavedTips}
              profile={profile}
            />
          ),
        },
        {
          path: "/saved",
          element: (
            <SavedTipsPage
              savedTips={savedTips}
              setSelectedTip={setSelectedTip}
            />
          ),
        },
        { path: "/about", element: <AboutUs /> },
        { path: "/contact", element: <ContactUs /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
