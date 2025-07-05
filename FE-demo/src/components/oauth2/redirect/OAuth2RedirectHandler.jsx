import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "/src/userContext/UserContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const username = params.get("username");

    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);
      localStorage.setItem("tokenType", "Bearer"); // nếu bạn dùng tokenType

      setUser({ username, email });

      toast.success("Login with Google successfully!", { theme: "dark" });
      navigate("/dashboard"); // hoặc homepage, tùy bạn
    } else {
      toast.error("Google login failed!", { theme: "dark" });
      navigate("/login");
    }
  }, []);

  return <div>Logging you in with Google...</div>;
};

export default OAuth2RedirectHandler;
