import { Link, useLocation } from "react-router";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Saved Tips", path: "/saved" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-white font-bold text-xl cursor-pointer hover:scale-105 transition-transform">
          <Link to="/">WellnessAI</Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-white font-medium hover:text-yellow-300 transition-colors ${
                location.pathname === item.path
                  ? "border-b-2 border-yellow-300 pb-1"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-blue-600 text-white">
          <ul className="flex flex-col space-y-2 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-medium hover:text-yellow-300 transition-colors ${
                    location.pathname === item.path
                      ? "border-l-4 border-yellow-300 pl-2"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
