import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const AppBar: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white py-3 px-6 flex justify-between items-center shadow-lg">
      {/* Logo */}
   <a href="/">   <div className="text-2xl font-bold tracking-wide cursor-pointer">
        Doc<span className="text-yellow-300">xy</span>
      </div></a>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {!userToken ? (
          <Login />
        ) : (
          <button
            onClick={() => navigate("/letter")}
            className="bg-white text-blue-600 cursor-pointer px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100"
          >
            Dashboard
          </button>
        )}
      </div>
    </nav>
  );
};

export default AppBar;
