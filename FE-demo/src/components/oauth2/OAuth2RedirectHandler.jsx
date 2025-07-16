// src/pages/OAuth2RedirectHandler.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "/src/userContext/UserContext";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setUser, refreshUser } = useUser();

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const token = param.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    const tokenType = "Bearer";
    localStorage.setItem("tokenType", tokenType);

    const fullToken = token + tokenType;
    localStorage.setItem("fullToken", fullToken);
    fetchUserData(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/googleLogin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user info");

      const result = await response.json();

     const membership =  result.currentUserMembership;
     const quitPlan =  result.quitPlan;
     const smokingProfile = result.smokingProfile;

      const userData = {
        ...result.user,
        accessToken: localStorage.getItem("accessToken"),
        tokenType: localStorage.getItem("tokenType"),
        membership,
        quitPlan,
        smokingProfile
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      localStorage.setItem("membership", userData.membership);
      localStorage.setItem("quitplan", userData.quitPlan);
      localStorage.setItem("smokingProfile", userData.smokingProfile);

      // Gọi refreshUser để đảm bảo userId và toàn bộ info được đồng bộ
      const refreshed = await refreshUser();
      if (!refreshed) {
        toast.warn("Partial login: Please re-login to complete your profile");
      }
      toast.success("Google Login Success!", { theme: "dark" });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to login with Google", { theme: "dark" });
      console.error("Google OAuth fetch error:", error);
    }
  };

  return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;
