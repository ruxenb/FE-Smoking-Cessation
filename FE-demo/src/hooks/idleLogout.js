import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContext/userContext";
import { toast } from "react-toastify";

function getIdleLogoutTime(minutes) {
  return minutes * 60 * 1000; // Chuyển đổi phút sang mili giây
}

const Idle_Logout_Time = getIdleLogoutTime(1); // 10 phút
export default function IdleLogout() {
  const { logout } = useUser();
  const navigate = useNavigate();
  const timeoutRef = useRef(null); //   const timeoutRef = React.useRef(null);

  // Reset lại timer mỗi khi user có tương tác
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      toast.info("Bạn đã không hoạt động trong 10 phút. Tự động đăng xuất!", {
        position: "top-right",
        theme: "dark",
      });
      logout();
      navigate("/login");
    }, Idle_Logout_Time);
  };

  useEffect(() => {
    // Các event tương tác
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer(); // khởi động lần đầu

    return () => {
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);
}
