import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const AppBar: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setUserToken(token);

    if (token) {
      navigate("/letter"); // Navigate to the letter page if token exists
    }
  }, [navigate]);

  return (
    <div>
      <div>Assign</div>
      <div>
        {!userToken ? <Login /> : <div>Welcome! You are logged in.</div>}
      </div>
    </div>
  );
};

export default AppBar;
