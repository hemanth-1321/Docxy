import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "./ui/button";

const Login = () => {
  //@ts-ignore
  const { login } = useContext(AuthContext);
  
  return (
    <div>
     <Button onClick={login}>Continue with google</Button>
    </div>
  );
};

export default Login;
