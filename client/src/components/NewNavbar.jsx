import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeartIcon = () => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="#000000"
      width="32"
      height="32"
    >
      <g>
        <path
          fill="#394240"
          d="M48,5c-4.418,0-8.418,1.793-11.312,4.688L32,14.344l-4.688-4.656C24.418,6.793,20.418,5,16,5 
          C7.164,5,0,12.164,0,21c0,4.418,2.852,8.543,5.75,11.438l23.422,23.426c1.562,1.562,4.094,1.562,5.656,0L58.188,32.5 
          C61.086,29.605,64,25.418,64,21C64,12.164,56.836,5,48,5z M32,47.375L11.375,26.75C9.926,25.305,8,23.211,8,21
          c0-4.418,3.582-8,8-8c2.211,0,4.211,0.895,5.656,2.344l7.516,7.484c1.562,1.562,4.094,1.562,5.656,0l7.516-7.484
          C43.789,13.895,45.789,13,48,13c4.418,0,8,3.582,8,8c0,2.211-1.926,4.305-3.375,5.75L32,47.375z"
        />
        <path
          fill="#F76D57"
          d="M32,47.375L11.375,26.75C9.926,25.305,8,23.211,8,21c0-4.418,3.582-8,8-8
          c2.211,0,4.211,0.895,5.656,2.344l7.516,7.484c1.562,1.562,4.094,1.562,5.656,0l7.516-7.484
          C43.789,13.895,45.789,13,48,13c4.418,0,8,3.582,8,8c0,2.211-1.926,4.305-3.375,5.75L32,47.375z"
        />
      </g>
    </svg>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("authtoken");

  const handleLogout = () => {
    // localStorage.removeItem("authtoken");
    // localStorage.removeItem("isAdmin");
    // localStorage.removeItem("id");
    localStorage.clear();
    navigate("/login");
  };

  // Navigation items
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "INFO", path: "/info", requiresAuth: true }, // add requiresAuth flag
  ];

  return (
    <nav className="bg-blue-100 py-2 px-6">
      <div className="max-w-8xl mx-auto px-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex space-x-4">
          <HeartIcon />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex ml-10 mr-auto space-x-5">
          {" "}
          {navItems
            .filter((item) => !item.requiresAuth || isLoggedIn) // Show only if requiresAuth is true and user is logged in
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-blue-500 font-medium"
              >
                {item.name}
              </Link>
            ))}
        </div>

        {/* Display Sign in / Sign up or Logout */}
        <div className="hidden md:flex space-x-1">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="border border-blue-400 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="border border-blue-400 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-blue-400 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-3 px-4 pt-2 pb-4">
            {navItems
              .filter((item) => !item.requiresAuth || isLoggedIn) // Show only if requiresAuth is true and user is logged in
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-blue-500 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-500 text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
