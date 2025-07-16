// src/pages/OAuth2RedirectHandler.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "/src/userContext/UserContext";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      return;
    }

    localStorage.setItem("accessToken", token);
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

      handleLoginSuccess(result);
    } catch (error) {
      toast.error("Failed to login with Google", { theme: "dark" });
      console.error("Google OAuth fetch error:", error);
    }
  };
  const handleLoginSuccess = (result) => {
    const userData = {
      ...result.user,
      membership: result.currentUserMembership,
      quitplan: result.currentQuitPlan,
    };

    // Lưu thông tin vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("username", result.user.username);
    localStorage.setItem("email", result.user.email);

    // Cập nhật context
    setUser(userData);

    toast.success("Google Login Success!", { theme: "dark" });

    // Chuyển hướng theo role
    const role = result.user.role;
    const redirectMap = {
      MEMBER: "/dashboard",
      COACH: "/coach-dashboard",
      ADMIN: "/admin",
    };
    const redirectPath = redirectMap[role] || "/home";
    navigate(redirectPath, { replace: true });
  };

  return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;
