import React, { useEffect, useState } from "react";
import BlogApp from "../../components/blog/BlogApp";
import { toast } from "react-toastify";
import Sidebar from "../../components/dashboard/Sidebar.jsx";
import MainContent from "../../components/dashboard/dashboard.jsx";
import SmokeSetupOverlay from "../../components/dashboard/Overlay/SmokeSetup.jsx";
import AchievementsPage from "../../components/dashboard/sidebarPages/AchievementsPage.jsx";
import SettingsPage from "../../components/dashboard/sidebarPages/SettingsPage.jsx";
import { useUser } from "../../userContext/userContext";
import { createSmokingProfile, updateSmokingProfile } from "../../services/smokingProfileService"; // Import service mới
import { fetchAndSaveCurrentQuitPlan } from "../../services/quitPlanService"; // <-- Thêm để fetch quit plan mới nhất

function Dashboard() {
  const { user, setUser } = useUser(); // <-- Thêm dòng này

  // Kiểm tra xem sidebar đóng hay ko
  const [isCollapsed, setIsCollapsed] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState("");

  // State để quản lý việc hiển thị overlay và trạng thái profile
  const [hasSmokingProfile, setHasSmokingProfile] = useState(false);
  const [isProfileOverlayVisible, setIsProfileOverlayVisible] = useState(false);

  // --- LOGIC CHÍNH: Kiểm tra smoking profile khi component được load hoặc khi user thay đổi ---
  useEffect(() => {
    // Nếu có user và user.smokingProfile không phải null/undefined
    if (user && user.smokingProfile) {
      setHasSmokingProfile(true);
    } else {
      setHasSmokingProfile(false);
    }
  }, [user]); // Chạy lại effect này mỗi khi object `user` thay đổi

  // --- Update QUITPLAN mới nhất từ BE ---
  useEffect(() => {
    if (user?.userId) {
      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");
      const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

      if (!fullToken) return;

      fetchAndSaveCurrentQuitPlan(fullToken)
        .then((quitPlan) => {
          if (quitPlan && (!user.quitplan || user.quitplan.id !== quitPlan.id)) {
            const updatedUser = { ...user, quitplan: quitPlan };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        })
    }
  }, [user]); // chạy lại nếu user thay đổi

  //dùng để đổi theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Effect để apply theme
  useEffect(() => {
    // const storedUsername = localStorage.getItem("username");
    // if (storedUsername) {
    //   setUsername(storedUsername);
    // }
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  // eslint-disable-next-line no-unused-vars
  const containerClass = `app-container ${
    isCollapsed ? "sidebar-collapsed" : ""
  }`;

  // --- This is where you would check the user's status when the app loads ---
  useEffect(() => {
    // Example: fetch('/api/user/me/smoking-profile-status')
    //   .then(res => res.json())
    //   .then(data => setHasSmokingProfile(data.hasProfile));
    // Tạm thời để false để demo
  }, []);

  const openProfileOverlay = () => {
    setIsProfileOverlayVisible(true);
  };

  const closeProfileOverlay = () => {
    setIsProfileOverlayVisible(false);
  };

  // --- HÀM XỬ LÝ LƯU HOẶC CẬP NHẬT PROFILE ---
  const handleSaveProfile = async (profileData) => {
    try {
      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");
      const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

      if (!fullToken) {
        toast.error("Authentication token not found.");
        return;
      }

      let response;
      // Dữ liệu gửi đi cần có userId
      const submitData = { ...profileData, userId: user.userId };

      if (hasSmokingProfile) {
        // --- LOGIC CẬP NHẬT ---
        const profileId = user.smokingProfile.smokingProfileId;
        response = await updateSmokingProfile(profileId, submitData, fullToken);
        toast.success("Information updated successfully!");
      } else {
        // --- LOGIC TẠO MỚI ---
        response = await createSmokingProfile(submitData, fullToken);
        toast.success("Profile created successfully! Let's start your journey!");
      }

      if (response && response.data?.status === "success") {
        // Cập nhật lại thông tin user trong Context và localStorage
        const updatedUser = { ...user, smokingProfile: response.data.data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        closeProfileOverlay(); // Đóng overlay sau khi thành công
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
      console.error("Failed to save profile:", error);
    }
  };

  // Render the correct page based on state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard" /* truy cập tới dashboard khi đăng nhập thành công, truyền data */:
        return (
          <MainContent
            username={user?.username}
            hasProfile={hasSmokingProfile}
            onCreateProfileClick={openProfileOverlay}
            onEditProfileClick={openProfileOverlay}
            currentQuitPlan={user?.quitplan}
          />
        );
      case "achievements":
        return <AchievementsPage />;
      case "settings":
        return <SettingsPage currentTheme={theme} onThemeChange={setTheme} />;
      case "community":
        return <BlogApp user={user} />;
      default:
        return (
          <MainContent
            username={user?.username}
            onEditProfileClick={openProfileOverlay}
          />
        );
    }
  };

  return (
    <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* --- SIMPLIFIED OVERLAY RENDERING --- */}
      {isProfileOverlayVisible && (
        <SmokeSetupOverlay
          onSaveProfile={handleSaveProfile}
          onClose={closeProfileOverlay}
          // Truyền dữ liệu profile cũ vào để pre-fill form khi update
          existingProfile={user?.smokingProfile}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Định nghĩa khu vực chính hiển thị nội dung (giao diện chính), render nội dung giao diện dựa trên hàm renderCurrentPage() */}
      <div className="main-content-area">{renderCurrentPage()}</div>
    </div>
  );
}

export default Dashboard;
