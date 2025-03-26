import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setUserToken(token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f2ee] text-gray-900">
      {/* Hero Section */}
      <div className="flex-grow max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
          Create & Manage Your Letters Effortlessly
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8">
          A modern, streamlined solution for writing, storing, and organizing
          your important letters in one place.
        </p>

        {/* Call-to-Action Button (Only visible if token exists) */}
        {userToken && (
          <button
            onClick={() => navigate("/letter")}
            className="bg-blue-950 text-white px-5 py-3 text-lg font-semibold rounded-full shadow-md hover:bg-blue-900 flex items-center gap-2 mx-auto"
          >
            Get Started <ArrowRight size={20} />
          </button>
        )}
      </div>

      {/* Illustration */}
      <div className="max-w-4xl mx-auto px-4">
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
          alt="Writing"
          className="rounded-lg shadow-lg w-full object-cover"
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-400 text-gray-700 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          {/* Brand Name */}
          <div className="text-xl font-bold">
            Doc<span className="text-blue-600">xy</span>
          </div>

          {/* Footer Navigation */}
          <nav className="flex flex-col sm:flex-row sm:space-x-6 mt-4 sm:mt-0 text-gray-600">
            <a href="/#" className="hover:text-blue-600 mb-2 sm:mb-0">
              About
            </a>
            <a href="/#" className="hover:text-blue-600 mb-2 sm:mb-0">
              Features
            </a>
            <a href="/#" className="hover:text-blue-600">Contact</a>
          </nav>

          {/* Copyright */}
          <div className="text-sm mt-4 sm:mt-0">
            © {new Date().getFullYear()} Docxy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};