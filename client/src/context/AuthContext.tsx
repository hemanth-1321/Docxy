import { createContext, useState, ReactNode, useContext } from "react";
import { signinWithGoogle } from "../firebase";
import axios from "axios";
import { BACKEND_URL } from "../lib/Api"

interface User {
  uid:string
  name: string|null
  email: string|null
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async () => {
    try {
      const userData = await signinWithGoogle();
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: userData.email,
        name: userData.name,
        id:userData.uid
      })
     if (response.status === 201) {
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
       setUser(user);
      alert("Login successful");
    }
      console.log("User Data:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};