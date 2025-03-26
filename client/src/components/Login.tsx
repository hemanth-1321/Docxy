import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  //@ts-ignore
  const { login } = useContext(AuthContext);

  return (
    <div className="flex justify-center">
      <Button 
        onClick={login} 
        className="flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </Button>
    </div>
  );
};

export default Login;
